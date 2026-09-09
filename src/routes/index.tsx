import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ArrowRight, Store } from "lucide-react";
import { catalogQueryOptions } from "@/lib/queries";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PromoBannerGrid } from "@/components/catalog/PromoBannerGrid";
import { MiddleHighlightBanner } from "@/components/catalog/MiddleHighlightBanner";
import { SocialProofCarousel } from "@/components/catalog/SocialProofCarousel";
import { WoodTypesShowcase } from "@/components/catalog/WoodTypesShowcase";
import { CraftEditorialSplit } from "@/components/catalog/CraftEditorialSplit";
import { WoodcraftCornerDecor } from "@/components/decor/WoodcraftCornerDecor";
import { useFavoritesStore } from "@/stores/favorites.store";

import { HeroCarousel } from "@/components/catalog/HeroCarousel";
import { HomePendingSkeleton } from "@/components/catalog/HomePendingSkeleton";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  pendingComponent: HomePendingSkeleton,
  pendingMs: 0,
  head: () => ({
    meta: [
      {
        title:
          "Serralheria Metal Arts — Móveis em Madeira Maciça, Serralheria Artística e Design Nobre",
      },
      {
        name: "description",
        content:
          "Móveis sob medida, marcenaria fina e serralheria artística de alto padrão. Peças exclusivas em madeira maciça nobre (Cumaru, Peroba Rosa) e ferro. Orçamento direto no WhatsApp.",
      },
      {
        name: "keywords",
        content:
          "serralheria metal arts, serralheria artística, marcenaria fina, móveis madeira maciça, móveis estilo industrial, móveis ferro e madeira, cumaru, peroba rosa, móveis sob medida, mesas nobres",
      },
      {
        property: "og:title",
        content: "Serralheria Metal Arts — Móveis em Madeira Maciça e Serralheria Artística",
      },
      {
        property: "og:description",
        content:
          "Móveis sob medida e peças exclusivas em madeira nobre e ferro com acabamento artesanal e atendimento no WhatsApp.",
      },
      { property: "og:url", content: "https://www.serralheriametalarts.com.br/" },
      {
        property: "og:image",
        content: "https://www.serralheriametalarts.com.br/img-footer.jpg",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.serralheriametalarts.com.br/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const toggle = useFavoritesStore((s) => s.toggle);
  const navigate = useNavigate();

  const heroBanners = data.banners.filter((b) => b.sort_order === 0);
  const promoBanners = data.banners.filter((b) => b.sort_order >= 1 && b.sort_order <= 4);
  const middleBanner = data.banners.find((b) => b.sort_order === 5) || null;
  const settings = data.settings;

  // Produtos em destaque (garante exibição com fallback)
  const featured = useMemo(() => {
    const explicitFeatured = data.products.filter((p) => p.is_featured);
    if (explicitFeatured.length >= 8) {
      return explicitFeatured.slice(0, 8);
    }
    const nonFeatured = data.products.filter((p) => !p.is_featured);
    return [...explicitFeatured, ...nonFeatured].slice(0, 8);
  }, [data.products]);

  // Produtos em promoção (com promo_price definido)
  const promoProducts = useMemo(() => {
    return data.products
      .filter((p) => p.promo_price != null && Number(p.promo_price) > 0)
      .slice(0, 6);
  }, [data.products]);

  // Categorias acompanhadas da contagem de produtos
  const categoriesWithCount = useMemo(() => {
    return data.categories.map((cat) => ({
      ...cat,
      count: data.products.filter((p) => p.category_id === cat.id).length,
    }));
  }, [data.categories, data.products]);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      {/* 1. Banner Principal - Hero Minimalista com Carrossel Automático */}
      <HeroCarousel banners={heroBanners} settings={settings} />

      {/* 2. Ofertas da Semana (Primeira seção após a Hero, quando houver promoções) */}
      {promoProducts.length > 0 && (
        <section className="container-page pt-14 pb-8">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 border-b border-border/70 pb-4">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                  Ofertas da Semana
                </h2>
                <p className="font-serif italic text-muted-foreground text-xs sm:text-sm">
                  Pranchas e móveis com valores promocionais para pronta entrega
                </p>
              </div>
              <Link
                to="/catalogo"
                search={{ categoria: "", busca: "" }}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                <span>Ver todas as ofertas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promoProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={() => toggle(product.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Nossos Serviços & Especialidades (Com as 3 Madeiras Nobres) */}
      <WoodTypesShowcase settings={settings} />

      {/* 4. Grid de Mini-Banners Promocionais com Badges e Cantos Decorativos */}
      <PromoBannerGrid banners={promoBanners} />

      {/* 5. Sobre a Nossa Empresa (Banner Editorial Bipartido com Fundo Marrom Claro & Editável no Admin) */}
      <CraftEditorialSplit settings={settings} />

      {/* 6. Destaques do Catálogo / Peças Assinadas (Fundo Limpo) */}
      {featured.length > 0 && (
        <section className="container-page pt-16 pb-10">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 border-b border-border/70 pb-4">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                  Destaques do Catálogo
                </h2>
                <p className="font-serif italic text-muted-foreground text-xs sm:text-sm">
                  Linha de mobília, tábuas nobres e peças de alto acabamento
                </p>
              </div>
              <Link
                to="/catalogo"
                search={{ categoria: "", busca: "" }}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                <span>Explorar catálogo completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={() => toggle(product.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Banner Central de Grande Impacto */}
      <MiddleHighlightBanner banner={middleBanner} settings={settings} />

      {/* 8. Navegação por Categorias com Visual Minimalista */}
      {categoriesWithCount.length > 0 && (
        <section className="relative overflow-hidden bg-muted/15 py-16 border-y border-border/40 isolate">
          {/* Ornamentos nos cantos da seção de categorias */}
          <WoodcraftCornerDecor
            position="top-left"
            variant="leaves"
            size="sm"
            className="opacity-30"
          />
          <WoodcraftCornerDecor
            position="bottom-right"
            variant="tools"
            size="sm"
            className="opacity-25"
          />

          <div className="container-page relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 border-b border-border/70 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 block">
                  Linhas & Ambientes
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                  Navegue por Categoria
                </h2>
              </div>
              <p className="font-serif italic text-muted-foreground text-xs sm:text-sm">
                Descubra coleções criadas sob medida para cada espaço
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 sm:-ml-6">
                {categoriesWithCount.map((category) => (
                  <CarouselItem
                    key={category.id}
                    className="pl-4 sm:pl-6 basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link
                      to="/catalogo"
                      search={{ categoria: category.id, busca: "" }}
                      className="group relative overflow-hidden rounded-2xl bg-card border border-border/70 hover:border-emerald-600/50 min-h-[180px] sm:min-h-[220px] flex flex-col justify-end p-5 transition-all duration-300 hover:shadow-md h-full isolate"
                    >
                      {category.image_url ? (
                        <>
                          <img
                            src={category.image_url}
                            alt={category.name}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
                          <Store className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}

                      <div className="relative z-10 space-y-1">
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full mb-1">
                          {category.count} {category.count === 1 ? "peça" : "peças"}
                        </span>
                        <h4
                          className={`font-black text-base uppercase tracking-wider transition-colors ${
                            category.image_url
                              ? "text-white group-hover:text-emerald-200"
                              : "text-foreground group-hover:text-emerald-700"
                          }`}
                        >
                          {category.name}
                        </h4>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      )}

      {/* 9. Prova Social & Depoimentos com Selos de Verificação Verdes */}
      <SocialProofCarousel settings={settings} />
    </div>
  );
}
