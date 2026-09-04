import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { catalogQueryOptions } from "@/lib/queries";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useFavoritesStore } from "@/stores/favorites.store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/favoritos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: () => ({
    meta: [
      { title: "Meus favoritos — produtos salvos" },
      {
        name: "description",
        content: "Os produtos que você salvou ficam aqui, prontos para pedir pelo WhatsApp.",
      },
      { property: "og:title", content: "Meus favoritos — produtos salvos" },
      { property: "og:description", content: "Produtos salvos no seu navegador." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const ids = useFavoritesStore((s) => s.ids);
  const ready = useFavoritesStore((s) => s.ready);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const toggle = useFavoritesStore((s) => s.toggle);

  const favorites = useMemo(
    () => data.products.filter((product) => ids.includes(product.id)),
    [data.products, ids],
  );

  return (
    <div className="container-page pt-20 sm:pt-24 pb-12">
      <h1 className="text-3xl font-semibold sm:text-4xl">Meus favoritos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Salvos apenas neste navegador — não precisa criar conta.
      </p>

      {!ready ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-sm text-muted-foreground">Você ainda não favoritou nenhum produto.</p>
          <Button asChild className="mt-6">
            <Link to="/catalogo" search={{ categoria: "", busca: "" }}>
              Explorar catálogo
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={() => toggle(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
