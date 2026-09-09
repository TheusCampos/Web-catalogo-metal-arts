import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { catalogQueryOptions, productsCatalogQueryOptions } from "@/lib/queries";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PaginationControl } from "@/components/ui/pagination-control";
import { CatalogBanner } from "@/components/catalog/CatalogBanner";
import { CatalogFilterSidebar, type FilterState } from "@/components/catalog/CatalogFilterSidebar";
import { useFavoritesStore } from "@/stores/favorites.store";
import { ChevronRight, SlidersHorizontal, PackageX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CatalogPendingSkeleton } from "@/components/catalog/CatalogPendingSkeleton";

type CatalogSearch = {
  categoria?: string;
  busca?: string;
  tamanho?: string;
  faixaPreco?: string;
  apenasPromo?: boolean;
  ordem?: string;
  pagina?: number;
};

const ITEMS_PER_PAGE = 12;

export const Route = createFileRoute("/catalogo")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    categoria: typeof search["categoria"] === "string" ? search["categoria"] : "",
    busca: typeof search["busca"] === "string" ? search["busca"] : "",
    tamanho: typeof search["tamanho"] === "string" ? search["tamanho"] : "",
    faixaPreco: typeof search["faixaPreco"] === "string" ? search["faixaPreco"] : "",
    apenasPromo: search["apenasPromo"] === true || search["apenasPromo"] === "true",
    ordem: typeof search["ordem"] === "string" ? search["ordem"] : "relevancia",
    pagina:
      typeof search["pagina"] === "number" && search["pagina"] > 0
        ? Math.floor(search["pagina"])
        : 1,
  }),
  loader: async ({ context, location }) => {
    const search = location.search as CatalogSearch;
    await Promise.all([
      context.queryClient.ensureQueryData(catalogQueryOptions),
      context.queryClient.ensureQueryData(
        productsCatalogQueryOptions({
          page: search.pagina ?? 1,
          limit: ITEMS_PER_PAGE,
          categoria: search.categoria || "",
          busca: search.busca || "",
          tamanho: search.tamanho || "",
          faixaPreco: search.faixaPreco || "",
          apenasPromo: Boolean(search.apenasPromo),
          ordem: search.ordem || "relevancia",
        }),
      ),
    ]);
  },
  pendingComponent: CatalogPendingSkeleton,
  pendingMs: 0,
  head: () => ({
    meta: [
      { title: "Catálogo de Móveis e Peças — Serralheria Metal Arts" },
      {
        name: "description",
        content:
          "Conheça nosso catálogo completo de móveis em madeira maciça nobre, marcenaria fina e serralheria artística sob medida. Filtre por categoria e faça seu orçamento direto pelo WhatsApp.",
      },
      {
        name: "keywords",
        content:
          "catálogo serralheria metal arts, móveis madeira maciça, mesas de jantar madeira, aparador industrial, estantes sob medida, serralheria fina",
      },
      {
        property: "og:title",
        content: "Catálogo de Móveis e Peças — Serralheria Metal Arts",
      },
      {
        property: "og:description",
        content:
          "Móveis em madeira maciça nobre e serralheria artística sob medida com atendimento pelo WhatsApp.",
      },
      { property: "og:url", content: "https://www.serralheriametalarts.com.br/catalogo" },
      {
        property: "og:image",
        content: "https://www.serralheriametalarts.com.br/img-footer.jpg",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.serralheriametalarts.com.br/catalogo" }],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const toggle = useFavoritesStore((s) => s.toggle);
  const catalogHeaderRef = useRef<HTMLDivElement>(null);

  const {
    categoria = "",
    busca = "",
    tamanho = "",
    faixaPreco = "",
    apenasPromo = false,
    ordem = "relevancia",
    pagina = 1,
  } = searchParams;

  // Consulta paginada diretamente no banco de dados
  const { data: productsResult } = useSuspenseQuery(
    productsCatalogQueryOptions({
      page: pagina,
      limit: ITEMS_PER_PAGE,
      categoria,
      busca,
      tamanho,
      faixaPreco,
      apenasPromo,
      ordem,
    }),
  );

  // 1. Extração dos Tamanhos Disponíveis para os Filtros
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    data.products.forEach((p) => {
      const rawSizes = p.sizes;
      if (Array.isArray(rawSizes)) {
        rawSizes.forEach(
          (s) => typeof s === "string" && s.trim() && sizeSet.add(s.trim().toUpperCase()),
        );
      } else if (typeof rawSizes === "string" && rawSizes.trim()) {
        rawSizes.split(",").forEach((s) => s.trim() && sizeSet.add(s.trim().toUpperCase()));
      }
    });

    const orderPriority = ["XP", "PP", "P", "M", "G", "GG", "XGG", "EG", "EGG"];
    return Array.from(sizeSet).sort((a, b) => {
      const idxA = orderPriority.indexOf(a);
      const idxB = orderPriority.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      const numA = Number(a);
      const numB = Number(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }, [data.products]);

  // 2. Extração das Categorias para a Sidebar
  const categoriesWithCount = useMemo(() => {
    return data.categories.map((cat) => {
      const count = data.products.filter((p) => p.category_id === cat.id && p.is_active).length;
      return { id: cat.id, name: cat.name, count };
    });
  }, [data.categories, data.products]);

  const totalItems = productsResult.total;
  const totalPages = productsResult.totalPages;
  const currentPage = productsResult.page;
  const displayedProducts = productsResult.items;

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    navigate({
      search: (prev: CatalogSearch) => ({
        ...prev,
        ...newFilters,
        pagina: 1, // Reseta a paginação ao mudar filtro
      }),
      replace: true,
    });
  };

  const handleResetFilters = () => {
    navigate({
      search: () => ({
        categoria: "",
        busca: "",
        tamanho: "",
        faixaPreco: "",
        apenasPromo: false,
        ordem: "relevancia",
        pagina: 1,
      }),
      replace: true,
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev: CatalogSearch) => ({ ...prev, pagina: newPage }),
      replace: false,
    });
    catalogHeaderRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentCategoryName = data.categories.find((c) => c.id === categoria)?.name;

  return (
    <div className="container-page pt-24 pb-8" ref={catalogHeaderRef}>
      {/* 1. Banner Superior Promocional */}
      <CatalogBanner banners={data.banners} />

      {/* 2. Breadcrumb de Navegação */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">
          Página Inicial
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
        <span className="font-bold text-foreground">
          {currentCategoryName ? `Catálogo · ${currentCategoryName}` : "Catálogo Completo"}
        </span>
      </nav>

      {/* 3. Grid Principal de 2 Colunas (Sidebar + Catálogo) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Coluna Esquerda: Filtros Detalhados */}
        <div className="lg:col-span-1">
          <CatalogFilterSidebar
            filters={{ busca, categoria, tamanho, faixaPreco, apenasPromo }}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            categories={categoriesWithCount}
            availableSizes={availableSizes}
          />
        </div>

        {/* Coluna Direita: Produtos & Ordenação */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header da Listagem (Contagem + Select de Ordenação) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
                {currentCategoryName || "Todos os Produtos"}
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                {totalItems} produto{totalItems === 1 ? "" : "s"} encontrado
                {totalItems === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Ordenar por:
              </span>
              <Select
                value={ordem}
                onValueChange={(val) =>
                  navigate({
                    search: (prev: CatalogSearch) => ({ ...prev, ordem: val, pagina: 1 }),
                    replace: true,
                  })
                }
              >
                <SelectTrigger className="w-[170px] h-9 text-xs font-semibold">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">Relevância / Destaques</SelectItem>
                  <SelectItem value="menor_preco">Menor Preço</SelectItem>
                  <SelectItem value="maior_preco">Maior Preço</SelectItem>
                  <SelectItem value="maior_desconto">Maior Desconto (% OFF)</SelectItem>
                  <SelectItem value="recentes">Mais Recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid de Produtos */}
          {displayedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-muted/20 rounded-2xl p-8 border border-dashed border-border">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <PackageX className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Nenhum produto encontrado</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Tente alterar ou limpar os filtros aplicados para visualizar outros produtos do
                  catálogo.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {displayedProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={idx < 4}
                    isFavorite={isFavorite(product.id)}
                    onToggleFavorite={() => toggle(product.id)}
                  />
                ))}
              </div>

              <div className="pt-4">
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
