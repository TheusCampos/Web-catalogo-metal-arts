import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Banner, StoreSettings } from "@/lib/store.functions";

interface HeroCarouselProps {
  banners: Banner[];
  settings?: StoreSettings | null;
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroBanners = banners.filter((b): b is Banner & { image_url: string } =>
    Boolean(b.image_url),
  );

  const nextSlide = useCallback(() => {
    if (heroBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
  }, [heroBanners.length]);

  const prevSlide = useCallback(() => {
    if (heroBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  }, [heroBanners.length]);

  useEffect(() => {
    if (heroBanners.length <= 1 || isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [heroBanners.length, isPaused, nextSlide]);

  if (heroBanners.length === 0) {
    return null;
  }

  const currentBanner = heroBanners[currentIndex] ?? heroBanners[0];
  const ctaLink = currentBanner?.cta_link || "/catalogo";

  return (
    <section
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[1.85/1] min-h-[460px] sm:min-h-[540px] md:min-h-[620px] max-h-[860px] bg-neutral-950 overflow-hidden group select-none isolate flex flex-col justify-end"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Imagens do Carrossel com suporte a imagem Mobile dedicada e transição suave */}
      {heroBanners.map((banner, index) => (
        <div
          key={banner.id || index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {banner.mobile_image_url ? (
            <picture className="w-full h-full block">
              <source media="(max-width: 640px)" srcSet={banner.mobile_image_url} />
              <img
                src={banner.image_url}
                alt={banner.title || "Banner Principal"}
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="w-full h-full object-cover object-center"
              />
            </picture>
          ) : (
            <img
              src={banner.image_url}
              alt={banner.title || "Banner Principal"}
              loading={index === 0 ? "eager" : "lazy"}
              decoding={index === 0 ? "sync" : "async"}
              fetchPriority={index === 0 ? "high" : "auto"}
              className="w-full h-full object-cover object-center"
            />
          )}
          {/* Overlay suave e sutil — mantém a imagem nítida, iluminada e valorizada */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
        </div>
      ))}

      {/* Conteúdo Central/Inferior do Banner (Título, Subtítulo, CTA) */}
      <div className="relative z-20 w-full flex flex-col justify-end items-center text-center px-4 pb-8 sm:pb-12 max-w-5xl mx-auto pointer-events-none">
        {Boolean(currentBanner?.title?.trim()) && (
          <h1
            key={`title-${currentIndex}`}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white drop-shadow-lg max-w-3xl leading-tight animate-in fade-in slide-in-from-bottom-3 duration-500"
          >
            {currentBanner?.title}
          </h1>
        )}

        {Boolean(currentBanner?.subtitle?.trim()) && (
          <p
            key={`sub-${currentIndex}`}
            className="mt-3 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl font-medium drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75"
          >
            {currentBanner?.subtitle}
          </p>
        )}

        {/* Botão de Ação CTA — Sempre visível com link para o catálogo ou link customizado */}
        <div className="mt-6 pointer-events-auto">
          {ctaLink.startsWith("http") ? (
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-black hover:bg-neutral-100 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/20"
            >
              {currentBanner?.cta_text || "Ver Catálogo"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </a>
          ) : (
            <Link
              to="/catalogo"
              search={{ categoria: "", busca: "" }}
              className="group/btn inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-black hover:bg-neutral-100 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/20"
            >
              {currentBanner?.cta_text || "Ver Catálogo"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Indicadores de Pontinhos (Dots) para Múltiplos Banners */}
        {heroBanners.length > 1 && (
          <div className="flex items-center gap-2 mt-6 pointer-events-auto">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Ir para banner ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-white shadow-md"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Setas Laterais de Navegação (Visíveis no Hover Desktop) */}
      {heroBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Banner anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Próximo banner"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </section>
  );
}
