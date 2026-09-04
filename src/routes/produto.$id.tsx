import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ImageIcon,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { catalogQueryOptions } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { ShareButton } from "@/components/catalog/ShareButton";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useFavoritesStore } from "@/stores/favorites.store";
import { useCartStore } from "@/stores/cart.store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";
import { recordLead } from "@/lib/store.functions";
import { ProductPendingSkeleton } from "@/components/catalog/ProductPendingSkeleton";
import { resolveColorHex } from "@/lib/colors";

export const Route = createFileRoute("/produto/$id")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(catalogQueryOptions);
    const product = data.products.find((item) => item.id === params.id);
    if (!product) throw notFound();
    return { name: product.name, description: product.description, image: product.image_url };
  },
  pendingComponent: ProductPendingSkeleton,
  pendingMs: 150,
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produto indisponível" }, { name: "robots", content: "noindex" }],
      };
    }
    const description =
      loaderData.description?.slice(0, 155) ||
      `Veja fotos, detalhes e peça ${loaderData.name} pelo WhatsApp.`;
    const image =
      loaderData.image?.startsWith("https://") || loaderData.image?.startsWith("http://")
        ? loaderData.image
        : null;
    return {
      meta: [
        { title: `${loaderData.name} — detalhes do produto` },
        { name: "description", content: description },
        { property: "og:title", content: `${loaderData.name} — detalhes do produto` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:site_name", content: "Catálogo" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [
        ...(image
          ? [
              {
                rel: "preload",
                as: "image",
                href: image,
                fetchPriority: "high" as const,
              },
            ]
          : []),
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="container-page py-24 text-center" role="alert">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
      <Button asChild className="mt-6">
        <Link to="/catalogo" search={{ categoria: "", busca: "" }}>
          Voltar ao catálogo
        </Link>
      </Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const toggle = useFavoritesStore((s) => s.toggle);
  const add = useCartStore((s) => s.add);
  const inCart = useCartStore((s) => s.items.some((item) => item.id === id));
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = data.products.find((item) => item.id === id);

  const sizesList = useMemo(() => {
    if (!product) return [];
    const raw = product.sizes;
    if (Array.isArray(raw)) return raw.map((s) => String(s).trim()).filter(Boolean);
    if (typeof raw === "string" && raw.trim()) {
      return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [product]);

  const colorsList = useMemo(() => {
    if (!product) return [];
    const raw = product.colors;
    if (Array.isArray(raw)) return raw.map((c) => String(c).trim()).filter(Boolean);
    if (typeof raw === "string" && raw.trim()) {
      return raw
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    }
    return [];
  }, [product]);

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    const extra = Array.isArray(product.images) ? product.images : [];
    return [product.image_url, ...extra].filter((url): url is string => Boolean(url));
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    return data.products
      .filter((item) => item.id !== product.id && item.category_id === product.category_id)
      .slice(0, 4);
  }, [data.products, product]);

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
        <Button asChild className="mt-6">
          <Link to="/catalogo" search={{ categoria: "", busca: "" }}>
            Voltar ao catálogo
          </Link>
        </Button>
      </div>
    );
  }

  const hasPromo = product.promo_price != null && Number(product.promo_price) > 0;
  const finalPrice = hasPromo ? Number(product.promo_price) : product.price;
  const category = data.categories.find((item) => item.id === product.category_id);
  const cover = gallery[activeImage] ?? gallery[0];

  const handleBuyWhatsApp = () => {
    if (sizesList.length > 0 && !selectedSize) {
      toast.error("Por favor, selecione um tamanho antes de comprar!");
      return;
    }
    if (colorsList.length > 0 && !selectedColor) {
      toast.error("Por favor, selecione uma cor antes de comprar!");
      return;
    }

    const rawNumber = data.settings?.whatsapp_number || "5511999999999";
    const url = buildProductWhatsAppLink({
      whatsappNumber: rawNumber,
      productName: product.name,
      price: finalPrice,
      qty: quantity,
      size: selectedSize || null,
      color: selectedColor || null,
      storeName: data.settings?.name,
    });

    recordLead({
      data: {
        product_interest: product.id,
        source: "order",
      },
    });

    window.open(url, "_blank");
  };

  const handleAddToCart = () => {
    if (sizesList.length > 0 && !selectedSize) {
      toast.error("Por favor, selecione um tamanho antes de adicionar!");
      return;
    }
    if (colorsList.length > 0 && !selectedColor) {
      toast.error("Por favor, selecione uma cor antes de adicionar!");
      return;
    }

    add(product.id, quantity, selectedSize || null, selectedColor || null);
    toast.success(`${quantity}x adicionado à sua lista de compras!`);
  };

  return (
    <div className="container-page pt-20 sm:pt-24 pb-12">
      <Link
        to="/catalogo"
        search={{ categoria: "", busca: "" }}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2 items-start">
        {/* Galeria de fotos */}
        <div className="space-y-3">
          <div className="aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-muted shadow-sm border border-border/40 relative">
            {cover ? (
              <img
                key={cover}
                src={cover}
                alt={product.name}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
          </div>
          {gallery.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {gallery.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  onMouseEnter={() => {
                    const img = new Image();
                    img.src = url;
                  }}
                  aria-label={`Ver foto ${index + 1}`}
                  className={cn(
                    "h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors cursor-pointer",
                    index === activeImage
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Informações do Produto */}
        <div className="space-y-6">
          <div className="space-y-2">
            {category ? (
              <Link
                to="/catalogo"
                search={{ categoria: category.id, busca: "" }}
                className="text-xs uppercase font-extrabold tracking-widest text-primary hover:underline"
              >
                {category.name}
              </Link>
            ) : null}
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {formatPrice(finalPrice)}
              </span>
              {hasPromo ? (
                <span className="text-base sm:text-lg text-muted-foreground line-through font-semibold">
                  {formatPrice(product.price)}
                </span>
              ) : null}
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                10% OFF no PIX
              </span>
            </div>
          </div>

          {/* Seleção de Tamanhos se houver */}
          {sizesList.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  Tamanho:
                </span>
                {selectedSize ? (
                  <span className="text-xs text-primary font-bold">
                    Selecionado: {selectedSize}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    (Escolha uma opção)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizesList.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-11 min-w-[48px] px-3.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer",
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                          : "border-border/60 bg-card hover:border-primary/60 text-foreground",
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seleção de Cores se houver */}
          {colorsList.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  Cor:
                </span>
                {selectedColor ? (
                  <span className="text-xs text-primary font-bold">
                    Selecionada: {selectedColor}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    (Escolha uma opção)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((color) => {
                  const active = selectedColor === color;
                  const colorKey = color.toLowerCase().trim();
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "h-11 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer inline-flex items-center gap-2",
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                          : "border-border/60 bg-card hover:border-primary/60 text-foreground",
                      )}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: resolveColorHex(color) }}
                      />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seleção de Quantidade */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-foreground block">
              Quantidade:
            </span>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-border bg-card p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                  disabled={quantity <= 1}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-muted text-foreground transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-black text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="Aumentar quantidade"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Total:{" "}
                <strong className="text-foreground text-sm font-extrabold">
                  {formatPrice(finalPrice * quantity)}
                </strong>
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/40">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
              Especificações e Detalhes
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              {product.wood_type && (
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">Tipo de Madeira</span>
                  <span className="font-bold text-foreground">{product.wood_type}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">Dimensões</span>
                  <span className="font-bold text-foreground">{product.dimensions}</span>
                </div>
              )}
              {product.finish && (
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">Acabamento</span>
                  <span className="font-bold text-foreground">{product.finish}</span>
                </div>
              )}
              {product.weight_kg && (
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">Peso Aproximado</span>
                  <span className="font-bold text-foreground">{product.weight_kg} kg</span>
                </div>
              )}
            </div>

            <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-muted-foreground mt-4">
              {product.description || "Sem descrição cadastrada para este item."}
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              onClick={handleBuyWhatsApp}
              className="w-full h-13 sm:h-14 rounded-2xl bg-[#25D366] text-white hover:bg-[#20bd5a] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Comprar via WhatsApp
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1 h-12 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
                onClick={handleAddToCart}
              >
                {inCart ? (
                  <Check className="h-4 w-4 mr-1.5 shrink-0" />
                ) : (
                  <ShoppingBag className="h-4 w-4 mr-1.5 shrink-0" />
                )}
                <span className="truncate">{inCart ? "Adicionar Mais" : "Adicionar à Lista"}</span>
              </Button>
              <FavoriteButton
                active={isFavorite(product.id)}
                onToggle={() => toggle(product.id)}
                label={isFavorite(product.id) ? "Favoritado" : "Favoritar"}
                responsiveLabel
                className="h-12 px-3 sm:px-4 rounded-xl shadow-sm text-xs font-bold uppercase"
              />
              <ShareButton
                productId={product.id}
                productName={product.name}
                label="Compartilhar"
                responsiveLabel
                className="h-12 px-3 sm:px-4 rounded-xl shadow-sm text-xs font-bold uppercase"
              />
            </div>
          </div>

          {/* Garantias */}
          <div className="p-4 rounded-2xl bg-muted/30 space-y-2 border border-border/40 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Truck className="h-4 w-4 text-primary" /> Envio rápido com suporte em todo o processo
            </div>
            <div className="flex items-center gap-2 font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Compra segura com atendimento via
              WhatsApp
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 pt-8 border-t border-border/50">
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground">
            | Produtos Relacionados
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={() => toggle(item.id)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
