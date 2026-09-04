import { supabase } from "@/integrations/supabase/client";

/**
 * Compressão de imagem em alta definição e upload pro Supabase Storage.
 * Suporta banners de até 4K (3840px) e produtos em alta fidelidade.
 */
export async function uploadImage(
  file: File,
  options?: { maxSide?: number; quality?: number; maxSizeBytes?: number },
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Arquivo selecionado não é uma imagem.");
  }

  const maxSide = options?.maxSide ?? 3840; // Suporte a alta resolução 4K (3780px / 3840px)
  const quality = options?.quality ?? 0.92; // Alta fidelidade WebP sem perdas perceptíveis

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Não foi possível processar a imagem.");

  // Interpolação de imagem em alta qualidade
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  if (!blob) throw new Error("Falha ao gerar o arquivo comprimido.");

  // Limite de segurança: até 6MB para imagens 4K
  const maxSizeBytes = options?.maxSizeBytes ?? 6_000_000;
  if (blob.size > maxSizeBytes) {
    throw new Error("Imagem muito pesada mesmo após compressão. Tente uma imagem com até 6MB.");
  }

  // Gera um nome único para o arquivo
  const ext = "webp";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

  const { data, error } = await supabase.storage.from("product-images").upload(fileName, blob, {
    contentType: "image/webp",
    cacheControl: "31536000, immutable",
    upsert: false,
  });

  if (error) {
    throw new Error(`Falha no upload: ${error.message}`);
  }

  const { data: publicData } = supabase.storage.from("product-images").getPublicUrl(data.path);

  return publicData.publicUrl;
}
