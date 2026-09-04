import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { catalogQueryOptions } from "@/lib/queries";
import { useCartStore } from "@/stores/cart.store";
import { formatPrice } from "@/lib/format";
import { maskPhone, isValidPhone } from "@/lib/phone";
import { recordLead } from "@/lib/store.functions";
import { buildCartWhatsAppLink } from "@/lib/whatsapp";

/** Carrinho lateral: peças escolhidas + dados do cliente antes de ir ao WhatsApp. */
export function CartSheet() {
  const { data } = useQuery({ ...catalogQueryOptions, throwOnError: false });
  const items = useCartStore((s) => s.items);
  const ready = useCartStore((s) => s.ready);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const count = useCartStore((s) => s.items.reduce((t, i) => t + i.qty, 0));
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const lines = useMemo(() => {
    const products = data?.products ?? [];
    return items.flatMap((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return [];
      const unitPrice = Number(
        product.promo_price != null && Number(product.promo_price) > 0
          ? product.promo_price
          : product.price,
      );
      return [{ product, qty: item.qty, size: item.size, color: item.color, unitPrice }];
    });
  }, [items, data?.products]);

  const total = lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);

  async function handleCheckout(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Informe seu nome.");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error("Informe um telefone válido com DDD.");
      return;
    }
    if (!data?.settings?.whatsapp_number) {
      toast.error("A loja ainda não configurou o WhatsApp.");
      return;
    }

    setSaving(true);
    try {
      await recordLead({
        data: {
          name: name.trim(),
          phone,
          source: "order",
          ...(email.trim() ? { email: email.trim() } : {}),
          ...(lines[0]?.product.id ? { product_interest: lines[0].product.id } : {}),
        },
      });

      const url = buildCartWhatsAppLink({
        whatsappNumber: data.settings.whatsapp_number,
        customerName: name.trim(),
        customerPhone: phone,
        customerEmail: email.trim() || null,
        storeName: data.settings.name,
        items: lines.map((line) => ({
          name: line.product.name,
          qty: line.qty,
          unitPrice: line.unitPrice,
          size: line.size,
          color: line.color,
        })),
        total,
      });

      clear();
      setOpen(false);
      setStep("cart");
      setName("");
      setPhone("");
      setEmail("");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar seu pedido.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setStep("cart");
      }}
    >
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent"
          aria-label="Abrir carrinho"
        >
          <ShoppingBag className="h-5 w-5" />
          {ready && count > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {count}
            </span>
          ) : null}
        </button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{step === "cart" ? "Seu carrinho" : "Seus dados"}</SheetTitle>
          <SheetDescription>
            {step === "cart"
              ? "Revise as peças escolhidas antes de fechar o pedido."
              : "Precisamos do seu contato para continuar no WhatsApp."}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link to="/catalogo" search={{ categoria: "", busca: "" }}>
                Ver catálogo
              </Link>
            </Button>
          </div>
        ) : step === "cart" ? (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {lines.map((line) => {
                const itemKey = `${line.product.id}-${line.size || ""}-${line.color || ""}`;
                return (
                  <div key={itemKey} className="flex gap-3 rounded-xl border border-border p-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {line.product.image_url ? (
                        <img
                          src={line.product.image_url}
                          alt={line.product.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{line.product.name}</p>
                      {(line.size || line.color) && (
                        <div className="flex flex-wrap gap-1 my-1">
                          {line.size && (
                            <span className="inline-flex items-center text-[10px] font-bold uppercase bg-muted text-foreground px-1.5 py-0.5 rounded border border-border/60">
                              Tam: {line.size}
                            </span>
                          )}
                          {line.color && (
                            <span className="inline-flex items-center text-[10px] font-bold uppercase bg-muted text-foreground px-1.5 py-0.5 rounded border border-border/60">
                              Cor: {line.color}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(line.unitPrice)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                          onClick={() =>
                            setQty(line.product.id, line.qty - 1, line.size, line.color)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{line.qty}</span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                          onClick={() =>
                            setQty(line.product.id, line.qty + 1, line.size, line.color)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remover ${line.product.name}`}
                          className="ml-auto text-muted-foreground transition-colors hover:text-destructive"
                          onClick={() => remove(line.product.id, line.size, line.color)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-border p-4">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <Button className="w-full" onClick={() => setStep("form")}>
                Fechar pedido
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleCheckout} className="flex flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="cart-name">Nome</Label>
                <Input
                  id="cart-name"
                  value={name}
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cart-phone">Telefone</Label>
                <Input
                  id="cart-phone"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  placeholder="(11) 91234-5678"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cart-email">E-mail (opcional)</Label>
                <Input
                  id="cart-email"
                  type="email"
                  value={email}
                  maxLength={255}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  autoComplete="email"
                />
              </div>
              <div className="rounded-xl border border-border p-3 text-sm">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {count} item{count === 1 ? "" : "s"} no pedido
                </p>
              </div>
            </div>
            <div className="space-y-2 border-t border-border p-4">
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Continuar no WhatsApp
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep("cart")}
              >
                Voltar ao carrinho
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
