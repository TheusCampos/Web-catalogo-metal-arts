import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Banner, StoreSettings } from "@/lib/store.functions";

interface MiddleHighlightBannerProps {
  banner?: Banner | null;
  settings?: StoreSettings | null;
}

export function MiddleHighlightBanner({ banner, settings }: MiddleHighlightBannerProps) {
  // Se não houver banner customizado no DB, usamos o visual nobre de marcenaria fina
  const imageUrl =
    banner?.image_url ||
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=80";

  const title = banner?.title ?? "Projetos Sob Medida & Marcenaria Fina";
  const subtitle =
    banner?.subtitle ??
    "Peças exclusivas esculpidas com precisão artesanal em madeira maciça nobre para o seu ambiente.";
  const ctaText = banner?.cta_text || "Explorar Peças Nobres";
  const ctaLink = banner?.cta_link || "/catalogo";
  const isExternal = ctaLink.startsWith("http");

  const hasOverlayContent = Boolean(title && title.trim().length > 0);

  const Content = (
    <div className="relative w-full overflow-hidden rounded-3xl bg-neutral-900 aspect-[4/3] sm:aspect-[21/8] min-h-[200px] sm:min-h-[340px] flex items-center shadow-lg border border-border/60 group">
      {/* Imagem de Fundo com zoom suave */}
      <img
        src={imageUrl}
        alt={title || "Banner Destaque"}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain sm:object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Gradiente de proteção de leitura */}
      {hasOverlayContent && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 sm:to-transparent" />
      )}

      {/* Conteúdo Textual e Botão */}
      {hasOverlayContent && (
        <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-2xl space-y-3 sm:space-y-4">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-300 block">
            {settings?.name || "Metal Art's Ateliê"}
          </span>

          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            {title}
          </h3>

          {subtitle && (
            <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-200 line-clamp-2 sm:line-clamp-none max-w-lg leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all group-hover:gap-3">
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="container-page py-10 sm:py-14">
      {isExternal ? (
        <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
          {Content}
        </a>
      ) : (
        <Link to="/catalogo" search={{ categoria: "", busca: "" }} className="block focus:outline-none">
          {Content}
        </Link>
      )}
    </section>
  );
}
