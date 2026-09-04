import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type StoreSettings = Database["public"]["Tables"]["store_settings"]["Row"];
export type Banner = Database["public"]["Tables"]["banners"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
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

export const DEFAULT_SERVICES: ServiceCardItem[] = [
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

export const DEFAULT_WOODS: NobleWoodItem[] = [
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

export const DEFAULT_DIFFERENTIALS: DifferentialItem[] = [
  {
    title: "100% Madeira Legal & Rastreável",
    description: "Espécies nobres e de reaproveitamento histórico selecionadas com rigor.",
  },
  {
    title: "Marcenaria Fina e Ferragens Robustas",
    description: "Encaixes tradicionais, lixamento em múltiplos grãos e estruturas feitas para atravessar gerações.",
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

/**
 * Uma única chamada traz tudo que as páginas públicas precisam.
 * Simples e barato: o catálogo de uma loja única cabe em poucas linhas.
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
        .select("*")
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
      products: productsRes.data ?? [],
    };
  },
);

/** Schema de validação para leads — impede inputs maliciosos */
const leadSchema = z.object({
  name: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email("E-mail inválido").max(254).optional().or(z.literal("")),
  product_interest: z.string().uuid().optional().or(z.literal("")),
  source: z.enum(["order", "newsletter"]).default("order"),
});

/** Registra intenção de compra do cliente no banco de dados */
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
      });
    } catch (err) {
      // Falha silenciosa para não travar a experiência do usuário
      console.error("Erro ao gravar lead:", err);
    }
  });
