import { Link, useNavigate } from "@tanstack/react-router";
import type { Product } from "@/lib/store.functions";
import { formatPrice } from "@/lib/format";
import { FavoriteButton } from "./FavoriteButton";
import { ImageIcon, ShoppingBag, Check, MessageCircle, Package } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { catalogQueryOptions } from "@/lib/queries";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";
import { recordLead } from "@/lib/store.functions";

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const navigate = useNavigate();
  const { data } = useQuery({ ...catalogQueryOptions, throwOnError: false });
  const settings = data?.settings;

  const originalPrice = Number(product.price);
  const promoPrice = product.promo_price != null ? Number(product.promo_price) : null;
  const hasPromo = promoPrice != null && promoPrice > 0 && promoPrice < originalPrice;
  const finalPrice = hasPromo ? promoPrice : originalPrice;

  // Cálculo de desconto %
  const discountPercent = hasPromo
    ? Math.round(((originalPrice - promoPrice) / originalPrice) * 100)
    : 0;

  const maxInstallments = settings?.max_installments ?? null;
  const showInstallments = Boolean(finalPrice > 0 && maxInstallments && maxInstallments > 1);

  const add = useCartStore((s) => s.add);
  const inCart = useCartStore((s) => s.items.some((item) => item.id === product.id));

  // Verifica se o produto tem opções de variações (tamanho / cor)
  const hasVariants = Boolean(
    (Array.isArray(product.sizes) && product.sizes.length > 0) ||
    (typeof product.sizes === "string" && product.sizes.trim()) ||
    (Array.isArray(product.colors) && product.colors.length > 0) ||
    (typeof product.colors === "string" && product.colors.trim()),
  );

  // Manipulação de Estoque (exibe somente se o lojista configurou o campo no cadastro)
  const stockQty = product.stock_quantity ?? null;
  const isOutOfStock = stockQty !== null && stockQty <= 0;

  const handleAdd = () => {
    if (hasVariants) {
      toast.info("Selecione o tamanho ou cor desejada.");
      navigate({ to: "/produto/$id", params: { id: product.id } });
      return;
    }
    add(product.id);
    toast.success("Produto adicionado à sua lista");
  };

  // Ação de compra rápida no WhatsApp
  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasVariants) {
      toast.info("Selecione o tamanho ou cor desejada antes de comprar.");
      navigate({ to: "/produto/$id", params: { id: product.id } });
      return;
    }

    const rawNumber = settings?.whatsapp_number || "5511999999999";
    const url = buildProductWhatsAppLink({
      whatsappNumber: rawNumber,
      productName: product.name,
      price: finalPrice,
      qty: 1,
      storeName: settings?.name,
    });

    // Registra o lead silenciosamente no banco
    recordLead({
      data: {
        product_interest: product.id,
        source: "order",
      },
    });

    window.open(url, "_blank");
  };

  return (
    <article className="card-hover group relative overflow-hidden rounded-none bg-card border border-border/70 hover:border-emerald-600/40 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300">
      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="block w-full text-left flex-1"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-muted/40">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}

          {/* Badge de Estoque */}
          {stockQty !== null && (
            <div className="absolute bottom-3 left-3 z-10">
              {isOutOfStock ? (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">
                  Esgotado
                </span>
              ) : stockQty <= 5 ? (
                <span className="bg-amber-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Package className="h-3 w-3" /> Restam {stockQty} un.
                </span>
              ) : (
                <span className="bg-emerald-700 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">
                  Em Estoque
                </span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4">
          <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-foreground uppercase tracking-tight group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>

          {product.dimensions && (
            <p className="text-[10px] text-muted-foreground font-medium truncate">
              {product.dimensions}
            </p>
          )}

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5">
              <span className="text-base sm:text-lg font-black text-foreground">
                {formatPrice(finalPrice)}
              </span>
              {hasPromo && (
                <span className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                  via Pix
                </span>
              )}
              {hasPromo && (
                <span className="text-[10px] sm:text-xs text-muted-foreground line-through ml-0.5 sm:ml-1">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Parcelamento no cartão */}
            {showInstallments && maxInstallments != null && (
              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium truncate">
                ou {maxInstallments}x de {formatPrice(finalPrice / maxInstallments)}
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-1.5 sm:gap-2 p-3 sm:p-4 pt-0">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAdd}
          className={`inline-flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-full px-3 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all min-w-0 cursor-pointer ${
            inCart
              ? "bg-muted text-foreground border border-border"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {inCart ? (
            <Check className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="truncate">{inCart ? "Na Lista" : "Adicionar"}</span>
        </button>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleWhatsAppBuy}
          title="Comprar direto via WhatsApp"
          className="inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 sm:px-3.5 py-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider shadow-xs transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
        >
          <MessageCircle className="h-3.5 w-3.5 fill-current shrink-0" />
          <span>Comprar</span>
        </button>
      </div>

      <FavoriteButton
        active={isFavorite}
        onToggle={onToggleFavorite}
        className="absolute right-3 top-3 h-8 w-8 justify-center p-0 bg-background/85 backdrop-blur-md rounded-full shadow-xs z-10 hover:scale-110 transition-transform"
      />
    </article>
  );
}
