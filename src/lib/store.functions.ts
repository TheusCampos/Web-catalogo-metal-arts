import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type StoreSettings = Database["public"]["Tables"]["store_settings"]["Row"];
export type Banner = Database["public"]["Tables"]["banners"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];

export type CatalogData = {
  settings: StoreSettings | null;
  banners: Banner[];
  categories: Category[];
  products: Product[];
};

export interface ServiceCardItem {
  badge: string;
  title: string;
  desc: string;
  imageUrl: string;
}

export interface NobleWoodItem {
  id: string;
  name: string;
  scientificName: string;
  tag: string;
  colorTone: string;
  bestFor: string;
  description: string;
  imageUrl: string;
}

export interface DifferentialItem {
  title: string;
  description: string;
}

export interface ServicesSectionData {
  title: string;
  subtitle: string;
  description: string;
  items: ServiceCardItem[];
  woods: NobleWoodItem[];
}

export interface AboutSectionData {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  badgeText: string;
  differentials: DifferentialItem[];
}

const DEFAULT_SERVICES: ServiceCardItem[] = [
  {
    badge: "Projetos Sob Medida",
    title: "Móveis e Bancadas Personalizadas",
    desc: "Desenvolvemos mesas de jantar, aparadores, racks e bancadas nas dimensões exatas do seu espaço, adaptando espessura e acabamento.",
    imageUrl:
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=700&auto=format&fit=crop",
  },
  {
    badge: "Design Orgânico",
    title: "Pranchas e Mesas com Borda Viva",
    desc: "Preservamos o desenho sinuoso e os nós naturais da árvore. Não há duas peças iguais em todo o mundo: exclusividade pura para o seu ambiente.",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=700&auto=format&fit=crop",
  },
  {
    badge: "Toque Acetinado",
    title: "Acabamento com Óleos Naturais",
    desc: "Selamento atóxico com cera de abelha e óleos botânicos que nutrem as fibras sem plastificar a madeira, realçando seu aroma e toque natural.",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=700&auto=format&fit=crop",
  },
];

const DEFAULT_WOODS: NobleWoodItem[] = [
  {
    id: "cumaru",
    name: "Cumaru Dourado",
    scientificName: "Dipteryx odorata",
    tag: "Mais Procurada",
    colorTone: "Castanho-dourado quente",
    bestFor: "Mesas de jantar, bancadas e aparadores de alto tráfego",
    description:
      "Tonalidade solar exuberante e toque sedoso. Possui óleos naturais que garantem altíssima resistência a riscos, líquidos e umidade.",
    imageUrl:
      "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ipe",
    name: "Ipê Nobre",
    scientificName: "Handroanthus spp.",
    tag: "Densidade Extrema",
    colorTone: "Castanho-escuro profundo",
    bestFor: "Mobiliário imponente, tampos maciços e peças de grande porte",
    description:
      "Considerada o 'aço' da flora brasileira. Uma madeira secular de peso imponente, veios discretos e elegância incomparável que dura séculos.",
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "peroba",
    name: "Peroba Rosa de Demolição",
    scientificName: "Aspidosperma polyneuron",
    tag: "100% Sustentável",
    colorTone: "Rosa-queimado a caramelo com alma rústica",
    bestFor: "Peças com personalidade histórica, estantes e mesas de centro",
    description:
      "Resgatada de antigas construções brasileiras. Cada prancha preserva marcas originais do tempo, pregos antigos e veios que contam histórias reais.",
    imageUrl:
      "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=800&auto=format&fit=crop",
  },
];

const DEFAULT_DIFFERENTIALS: DifferentialItem[] = [
  {
    title: "100% Madeira Legal & Rastreável",
    description: "Espécies nobres e de reaproveitamento histórico selecionadas com rigor.",
  },
  {
    title: "Marcenaria Fina e Ferragens Robustas",
    description:
      "Encaixes tradicionais, lixamento em múltiplos grãos e estruturas feitas para atravessar gerações.",
  },
];

export function getServicesSectionData(settings?: StoreSettings | null): ServicesSectionData {
  let header = {
    title: "Nossos Serviços & Especialidades",
    subtitle: "Do corte milimétrico ao acabamento acetinado com óleos naturais",
    description:
      "Criamos móveis e peças assinadas com técnicas de marcenaria tradicional. Trabalhamos sob medida para materializar exatamente o projeto que você sonhou para o seu espaço.",
  };

  if (settings?.announcement_text) {
    try {
      const parsed = JSON.parse(settings.announcement_text);
      if (parsed && typeof parsed === "object") {
        header = {
          title: parsed.title || header.title,
          subtitle: parsed.subtitle || header.subtitle,
          description: parsed.description || header.description,
        };
      }
    } catch {
      // Ignora erro de parse
    }
  }

  let items = DEFAULT_SERVICES;
  if (settings?.trust_badge_1) {
    try {
      const parsed = JSON.parse(settings.trust_badge_1);
      if (Array.isArray(parsed) && parsed.length > 0) {
        items = parsed.map((item, idx) => ({
          badge: item.badge ?? DEFAULT_SERVICES[idx]?.badge ?? "",
          title: item.title ?? DEFAULT_SERVICES[idx]?.title ?? "",
          desc: item.desc ?? DEFAULT_SERVICES[idx]?.desc ?? "",
          imageUrl: item.imageUrl ?? DEFAULT_SERVICES[idx]?.imageUrl ?? "",
        }));
      }
    } catch {
      // fallback
    }
  }

  let woods = DEFAULT_WOODS;
  if (settings?.trust_badge_2) {
    try {
      const parsed = JSON.parse(settings.trust_badge_2);
      if (Array.isArray(parsed) && parsed.length > 0) {
        woods = parsed.map((wood, idx) => ({
          id: wood.id || DEFAULT_WOODS[idx]?.id || `wood-${idx}`,
          name: wood.name ?? DEFAULT_WOODS[idx]?.name ?? "",
          scientificName: wood.scientificName ?? DEFAULT_WOODS[idx]?.scientificName ?? "",
          tag: wood.tag ?? DEFAULT_WOODS[idx]?.tag ?? "",
          colorTone: wood.colorTone ?? DEFAULT_WOODS[idx]?.colorTone ?? "",
          bestFor: wood.bestFor ?? DEFAULT_WOODS[idx]?.bestFor ?? "",
          description: wood.description ?? DEFAULT_WOODS[idx]?.description ?? "",
          imageUrl: wood.imageUrl ?? DEFAULT_WOODS[idx]?.imageUrl ?? "",
        }));
      }
    } catch {
      // fallback
    }
  }

  return {
    ...header,
    items,
    woods,
  };
}

export function getAboutSectionData(settings?: StoreSettings | null): AboutSectionData {
  const storeName = settings?.name || "Nossa Empresa";

  let differentials = DEFAULT_DIFFERENTIALS;
  if (settings?.trust_badge_3) {
    try {
      const parsed = JSON.parse(settings.trust_badge_3);
      if (Array.isArray(parsed) && parsed.length > 0) {
        differentials = parsed.map((diff, idx) => ({
          title: diff.title ?? DEFAULT_DIFFERENTIALS[idx]?.title ?? "",
          description: diff.description ?? DEFAULT_DIFFERENTIALS[idx]?.description ?? "",
        }));
      }
    } catch {
      // fallback
    }
  }

  return {
    title: settings?.about_title || `Conheça a ${storeName}: Artesanato & Design Atemporal`,
    subtitle:
      settings?.trust_badge_4 ||
      "Tradição em marcenaria artesanal e respeito absoluto à matéria-prima",
    description:
      settings?.about_description ||
      "Não produzimos em massa. Cada peça parte de toras selecionadas com respeito aos ciclos da natureza, mantendo os contornos originais da árvore, fissuras naturais estabilizadas e nós que conferem alma inconfundível ao seu espaço.",
    imageUrl:
      settings?.about_image_url ||
      "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=1200&auto=format&fit=crop",
    badgeText: settings?.catalog_banner_url || "Madeira Maciça & Bordas Vivas",
    differentials,
  };
}

let cachedPublicClient: ReturnType<typeof createClient<Database>> | null = null;

/** Cliente publishable usado apenas para leituras públicas no servidor (RLS como anon). */
function publicClient() {
  if (cachedPublicClient) return cachedPublicClient;
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  cachedPublicClient = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  return cachedPublicClient;
}

import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 60; // requisições por minuto
const RATE_LIMIT_WINDOW = 60_000;

function checkRateLimit() {
  const ip =
    getRequestIP() ||
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-forwarded-for") ||
    "unknown";

  const now = Date.now();
  let record = rateLimitMap.get(ip);
  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
    record = { count: 0, lastReset: now };
    rateLimitMap.set(ip, record);
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    throw new Error("Muitas requisições. Tente novamente mais tarde.");
  }
}

export type CatalogProductItem = {
  id: string;
  name: string;
  price: number;
  promo_price?: number | null;
  image_url?: string | null;
  category_id?: string | null;
  stock_quantity?: number | null;
  sizes?: string[] | string | null;
  colors?: string[] | string | null;
  dimensions?: string | null;
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
  created_at: string;
};

export type PaginatedProductsResult = {
  items: CatalogProductItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

export const catalogFilterSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
  categoria: z.string().optional().default(""),
  busca: z.string().optional().default(""),
  tamanho: z.string().optional().default(""),
  faixaPreco: z.string().optional().default(""),
  apenasPromo: z.boolean().optional().default(false),
  ordem: z.string().optional().default("relevancia"),
});

export type CatalogFilterParams = {
  page?: number | undefined;
  limit?: number | undefined;
  categoria?: string | undefined;
  busca?: string | undefined;
  tamanho?: string | undefined;
  faixaPreco?: string | undefined;
  apenasPromo?: boolean | undefined;
  ordem?: string | undefined;
};

/**
 * Consulta otimizada do catálogo com filtros e paginação no PostgreSQL.
 * Seleciona somente colunas necessárias para os cards, sem trafegar descrições ou galerias.
 */
export const getProductsCatalog = createServerFn({ method: "GET" })
  .validator((params: Partial<CatalogFilterParams> | undefined) =>
    catalogFilterSchema.parse(params ?? {}),
  )
  .handler(async ({ data: params }): Promise<PaginatedProductsResult> => {
    checkRateLimit();
    const supabase = publicClient();

    const page = params.page;
    const limit = params.limit;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("products")
      .select(
        "id, name, price, promo_price, image_url, category_id, stock_quantity, sizes, colors, is_featured, sort_order, created_at",
        { count: "exact" },
      )
      .eq("is_active", true);

    if (params.categoria) {
      query = query.eq("category_id", params.categoria);
    }

    if (params.busca && params.busca.trim()) {
      const term = params.busca.trim();
      query = query.ilike("name", `%${term}%`);
    }

    if (params.apenasPromo) {
      query = query.not("promo_price", "is", null).gt("promo_price", 0);
    }

    if (params.faixaPreco === "ate100") {
      query = query.lte("price", 100);
    } else if (params.faixaPreco === "100a300") {
      query = query.gte("price", 100).lte("price", 300);
    } else if (params.faixaPreco === "acima300") {
      query = query.gte("price", 300);
    }

    if (params.ordem === "menor_preco") {
      query = query.order("price", { ascending: true });
    } else if (params.ordem === "maior_preco") {
      query = query.order("price", { ascending: false });
    } else if (params.ordem === "recentes") {
      query = query.order("created_at", { ascending: false });
    } else {
      // Relevância padrão: sort_order asc, depois created_at desc
      query = query
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    }

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    let items = (data ?? []) as CatalogProductItem[];

    // Filtro refinado de tamanho caso informado
    if (params.tamanho) {
      const filterSize = params.tamanho.toUpperCase().trim();
      items = items.filter((p) => {
        const rawSizes = p.sizes;
        let pSizes: string[] = [];
        if (Array.isArray(rawSizes)) {
          pSizes = rawSizes.map((s) => String(s).toUpperCase().trim());
        } else if (typeof rawSizes === "string") {
          pSizes = rawSizes.split(",").map((s) => s.toUpperCase().trim());
        }
        return pSizes.includes(filterSize);
      });
    }

    const total = count ?? items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items,
      total,
      totalPages,
      page,
      limit,
    };
  });

/**
 * Carrega exclusivamente o produto solicitado com todas as suas informações ricas
 * (descrição, galeria, especificações, dimensões, estoque, acabamento).
 */
export const getProductById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<Product | null> => {
    checkRateLimit();
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as Product | null;
  });

/**
 * Consulta de metadados institucionais e produtos em destaque.
 * Otimizada para não trafegar colunas pesadas nos cards.
 */
export const getCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<CatalogData> => {
    checkRateLimit();
    const supabase = publicClient();

    const [settingsRes, bannersRes, categoriesRes, productsRes] = await Promise.all([
      supabase.from("store_settings").select("*").limit(1).maybeSingle(),
      supabase.from("banners").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
      supabase
        .from("products")
        .select(
          "id, category_id, name, price, promo_price, image_url, images, is_active, is_featured, sort_order, stock_quantity, sizes, colors, wood_type, dimensions, created_at, updated_at",
        )
        .eq("is_active", true)
        .order("sort_order")
        .order("created_at", { ascending: false }),
    ]);

    const error = settingsRes.error ?? bannersRes.error ?? categoriesRes.error ?? productsRes.error;
    if (error) throw new Error(error.message);

    return {
      settings: settingsRes.data ?? null,
      banners: bannersRes.data ?? [],
      categories: categoriesRes.data ?? [],
      products: (productsRes.data ?? []) as Product[],
    };
  },
);

/** Schema de validação para leads com suporte a consentimento LGPD */
const leadSchema = z.object({
  name: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email("E-mail inválido").max(254).optional().or(z.literal("")),
  product_interest: z.string().uuid().optional().or(z.literal("")),
  source: z.enum(["order", "newsletter"]).default("order"),
  marketing_consent: z.boolean().default(false),
  privacy_version: z.string().default("v1.0"),
});

/** Registra intenção de compra do cliente no banco com registro de consentimento LGPD */
export const recordLead = createServerFn({ method: "POST" })
  .validator((params: z.input<typeof leadSchema>) => leadSchema.parse(params))
  .handler(async ({ data: params }) => {
    try {
      checkRateLimit();
      const supabase = publicClient();
      await supabase.from("customer_leads").insert({
        name: params.name || null,
        phone: params.phone || null,
        email: params.email || null,
        product_interest: params.product_interest || null,
        source: params.source,
        marketing_consent: params.marketing_consent,
        consent_at: params.marketing_consent ? new Date().toISOString() : null,
        privacy_version: params.privacy_version,
      });
    } catch (err) {
      console.error("Erro ao gravar lead:", err);
    }
  });
