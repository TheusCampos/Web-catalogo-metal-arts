import { supabase } from "@/integrations/supabase/client";

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "origin";
}

/**
 * Retorna URL de imagem otimizada com suporte a Supabase Image Transformation
 * ou serviços de CDN/Unsplash.
 */
export function getOptimizedImageUrl(
  originalUrl: string | null | undefined,
  options?: ImageTransformOptions,
): string {
  if (!originalUrl) return "";

  const width = options?.width;
  const quality = options?.quality ?? 80;

  try {
    const url = new URL(originalUrl);

    // 1. Suporte a Supabase Storage Image Transformation
    // Transforma /storage/v1/object/public/... em /storage/v1/render/image/public/...
    if (url.pathname.includes("/storage/v1/object/public/")) {
      const renderPath = url.pathname.replace(
        "/storage/v1/object/public/",
        "/storage/v1/render/image/public/",
      );
      const renderUrl = new URL(url.origin + renderPath);
      if (width) renderUrl.searchParams.set("width", width.toString());
      if (quality) renderUrl.searchParams.set("quality", quality.toString());
      renderUrl.searchParams.set("format", options?.format ?? "origin");
      return renderUrl.toString();
    }

    // Se já estiver usando /render/image/
    if (url.pathname.includes("/storage/v1/render/image/public/")) {
      if (width) url.searchParams.set("width", width.toString());
      if (quality) url.searchParams.set("quality", quality.toString());
      return url.toString();
    }

    // 2. Imagens do Unsplash
    if (url.hostname.includes("images.unsplash.com")) {
      if (width) url.searchParams.set("w", width.toString());
      if (quality) url.searchParams.set("q", quality.toString());
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      return url.toString();
    }

    return originalUrl;
  } catch {
    return originalUrl;
  }
}

/**
 * Gera atributo srcset com resoluções responsivas para cards e galerias.
 */
export function getProductSrcSet(originalUrl: string | null | undefined): string {
  if (!originalUrl) return "";
  const s400 = getOptimizedImageUrl(originalUrl, { width: 400, quality: 78 });
  const s800 = getOptimizedImageUrl(originalUrl, { width: 800, quality: 82 });
  const s1200 = getOptimizedImageUrl(originalUrl, { width: 1200, quality: 85 });

  // Se a URL não for transformável (retornou idêntica), não replica srcset inútil
  if (s400 === originalUrl) {
    return "";
  }

  return `${s400} 400w, ${s800} 800w, ${s1200} 1200w`;
}

/** Configuração padrão de sizes para cards no catálogo */
export const CARD_IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/**
 * Compressão inteligente de imagem e upload para o Supabase Storage.
 * Comprime para WebP otimizado (85% qualidade por padrão) e aplica cabeçalhos imutáveis.
 */
export async function uploadImage(
  file: File,
  options?: { maxSide?: number; quality?: number; maxSizeBytes?: number },
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Arquivo selecionado não é uma imagem.");
  }

  const maxSide = options?.maxSide ?? 2400; // 2400px garante altíssima definição com fração do peso de 3840px
  const quality = options?.quality ?? 0.85; // Alta fidelidade WebP balanceada

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Não foi possível processar a imagem.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  if (!blob) throw new Error("Falha ao gerar o arquivo comprimido.");

  const maxSizeBytes = options?.maxSizeBytes ?? 4_000_000;
  if (blob.size > maxSizeBytes) {
    throw new Error(
      "Imagem muito pesada mesmo após compressão. Tente uma imagem de menor resolução.",
    );
  }

  // Nome com hash para cache CDN longo e imutável
  const ext = "webp";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`;

  const { data, error } = await supabase.storage.from("product-images").upload(fileName, blob, {
    contentType: "image/webp",
    cacheControl: "public, max-age=31536000, immutable",
    upsert: false,
  });

  if (error) {
    throw new Error(`Falha no upload: ${error.message}`);
  }

  const { data: publicData } = supabase.storage.from("product-images").getPublicUrl(data.path);
  return publicData.publicUrl;
}
