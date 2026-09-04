import type { Banner } from "@/lib/store.functions";

interface CatalogBannerProps {
  banners?: Banner[];
}

export function CatalogBanner({ banners = [] }: CatalogBannerProps) {
  const catalogBanner = banners.find((b) => b.sort_order === 6);

  if (!catalogBanner || !catalogBanner.is_active || !catalogBanner.image_url) {
    return null; // Oculta se não houver banner de catálogo
  }

  const isExternal = catalogBanner.cta_link?.startsWith("http");

  const Content = () => (
    <div className="w-full max-w-[1234px] mx-auto mb-8 overflow-hidden rounded-2xl shadow-sm transition-transform duration-300 hover:scale-[1.005]">
      <div className="relative w-full bg-muted overflow-hidden">
        <img
          src={catalogBanner.image_url ?? ""}
          alt={catalogBanner.title || "Banner do Catálogo"}
          loading="eager"
          decoding="async"
          className="w-full h-auto object-cover rounded-2xl"
        />
      </div>
    </div>
  );

  if (catalogBanner.cta_link) {
    if (isExternal) {
      return (
        <a
          href={catalogBanner.cta_link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Content />
        </a>
      );
    }
    return (
      <a href={catalogBanner.cta_link} className="block">
        <Content />
      </a>
    );
  }

  return <Content />;
}
