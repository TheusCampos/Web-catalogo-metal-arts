import { Link } from "@tanstack/react-router";
import type { Banner } from "@/lib/store.functions";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { WoodcraftCornerDecor } from "@/components/decor/WoodcraftCornerDecor";

interface PromoBannerGridProps {
  banners: Banner[];
}

export function PromoBannerGrid({ banners }: PromoBannerGridProps) {
  const promoItems = banners
    .filter((b): b is Banner & { image_url: string } => Boolean(b.image_url))
    .slice(0, 4);

  if (promoItems.length === 0) return null;

  return (
    <section className="relative overflow-hidden container-page pt-12 pb-6 isolate">
      {/* Ornamentos de canto botânicos */}
      <WoodcraftCornerDecor position="top-left" variant="leaves" size="md" className="opacity-30" />
      <WoodcraftCornerDecor position="bottom-right" variant="tools" size="md" className="opacity-25" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {promoItems.map((banner, idx) => (
          <div
            key={banner.id}
            className="group relative overflow-hidden rounded-2xl bg-muted/20 min-h-[260px] flex flex-col justify-between p-5 border border-border/60 hover:border-emerald-600/40 shadow-xs hover:shadow-md transition-all duration-300 isolate"
          >
            {/* Imagem de Fundo com Zoom Suave */}
            <img
              src={banner.image_url}
              alt={banner.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradiente sofisticado escuro com toque verde sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Badge Superior com Verde Botânico */}
            <div className="relative z-10 self-start">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-800/80 backdrop-blur-md text-emerald-100 border border-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                {idx === 0 ? "Mais Procurado" : idx === 1 ? "Pronta Entrega" : "Madeira Maciça"}
              </span>
            </div>

            {/* Conteúdo Inferior com Tipografia Elegante */}
            <div className="relative z-10 space-y-2 pt-10">
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white line-clamp-2 drop-shadow-sm group-hover:text-emerald-200 transition-colors">
                {banner.title}
              </h3>
              {banner.subtitle && (
                <p className="text-xs text-stone-200 line-clamp-1 font-medium font-serif italic">
                  {banner.subtitle}
                </p>
              )}

              <div className="pt-2">
                {banner.cta_link && banner.cta_link.startsWith("http") ? (
                  <Button
                    asChild
                    size="sm"
                    className="h-8 px-4 text-[11px] font-bold uppercase tracking-wider rounded-full bg-white text-black hover:bg-emerald-50 hover:text-emerald-950 shadow-sm transition-all"
                  >
                    <a href={banner.cta_link} target="_blank" rel="noopener noreferrer">
                      {banner.cta_text || "Ver Detalhes"} <ArrowRight className="ml-1.5 h-3 w-3" />
                    </a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="sm"
                    className="h-8 px-4 text-[11px] font-bold uppercase tracking-wider rounded-full bg-white text-black hover:bg-emerald-50 hover:text-emerald-950 shadow-sm transition-all"
                  >
                    <Link to="/catalogo" search={{ categoria: "", busca: "" }}>
                      {banner.cta_text || "Ver Detalhes"} <ArrowRight className="ml-1.5 h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
