import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2, PackageCheck, AlertTriangle, XCircle, Box } from "lucide-react";
import { adminApi, type ProductRow } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PaginationControl } from "@/components/ui/pagination-control";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ImageField } from "@/components/admin/ImageField";
import { GalleryField } from "@/components/admin/GalleryField";
import { SizeSelectorField } from "@/components/admin/SizeSelectorField";
import { ColorSelectorField } from "@/components/admin/ColorSelectorField";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/produtos")({
  component: AdminProducts,
});

type FormState = {
  id?: string;
  name: string;
  description: string;
  price: string;
  promo_price: string;
  stock_quantity: string;
  sizes: string[];
  colors: string[];
  category_id: string;
  image_url: string;
  images: string[];
  sort_order: string;
  is_active: boolean;
  is_featured: boolean;
  wood_type: string;
  dimensions: string;
  finish: string;
  weight_kg: string;
};

const EMPTY: FormState = {
  name: "",
  description: "",
  price: "",
  promo_price: "",
  stock_quantity: "",
  sizes: [],
  colors: [],
  category_id: "",
  image_url: "",
  images: [],
  sort_order: "0",
  is_active: true,
  is_featured: false,
  wood_type: "",
  dimensions: "",
  finish: "",
  weight_kg: "",
};

const ADMIN_ITEMS_PER_PAGE = 15;

function AdminProducts() {
  const queryClient = useQueryClient();
  const products = useQuery({ queryKey: ["admin", "products"], queryFn: adminApi.products });
  const categories = useQuery({ queryKey: ["admin", "categories"], queryFn: adminApi.categories });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [currentPage, setCurrentPage] = useState(1);

  const allProducts = products.data ?? [];
  const totalItems = allProducts.length;
  const totalPages = Math.ceil(totalItems / ADMIN_ITEMS_PER_PAGE);

  // Métricas de Estoque do Lojista
  const stockMetrics = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    allProducts.forEach((p) => {
      const qty = p.stock_quantity ?? null;
      if (qty === null) {
        inStock++;
      } else if (qty <= 0) {
        outOfStock++;
      } else if (qty <= 5) {
        lowStock++;
      } else {
        inStock++;
      }
    });

    return { total: totalItems, inStock, lowStock, outOfStock };
  }, [allProducts, totalItems]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ADMIN_ITEMS_PER_PAGE;
    return allProducts.slice(start, start + ADMIN_ITEMS_PER_PAGE);
  }, [allProducts, currentPage]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Informe o nome do produto.");

      await adminApi.saveProduct({
        ...(form.id ? { id: form.id } : {}),
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price.replace(",", ".")) || 0,
        promo_price: form.promo_price ? Number(form.promo_price.replace(",", ".")) : null,
        stock_quantity: form.stock_quantity !== "" ? Number(form.stock_quantity) : null,
        sizes: form.sizes.length > 0 ? form.sizes : null,
        colors: form.colors.length > 0 ? form.colors : null,
        wood_type: form.wood_type.trim() || null,
        dimensions: form.dimensions.trim() || null,
        finish: form.finish.trim() || null,
        weight_kg: form.weight_kg !== "" ? Number(form.weight_kg.replace(",", ".")) : null,
        category_id: form.category_id || null,
        image_url: form.image_url || null,
        images: form.images,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
        is_featured: form.is_featured,
      });
    },
    onSuccess: () => {
      toast.success("Produto salvo com sucesso");
      setOpen(false);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: adminApi.deleteProduct,
    onSuccess: () => {
      toast.success("Produto excluído");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function edit(product: ProductRow) {
    const rawSizes = product.sizes;
    const sizesArr = Array.isArray(rawSizes)
      ? rawSizes.map(String)
      : typeof rawSizes === "string" && rawSizes.trim()
        ? rawSizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const rawColors = product.colors;
    const colorsArr = Array.isArray(rawColors)
      ? rawColors.map(String)
      : typeof rawColors === "string" && rawColors.trim()
        ? rawColors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

    setForm({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      promo_price: product.promo_price === null ? "" : String(product.promo_price),
      stock_quantity:
        product.stock_quantity === null || product.stock_quantity === undefined
          ? ""
          : String(product.stock_quantity),
      sizes: sizesArr,
      colors: colorsArr,
      category_id: product.category_id ?? "",
      image_url: product.image_url ?? "",
      images: Array.isArray(product.images) ? product.images : [],
      sort_order: String(product.sort_order),
      is_active: product.is_active,
      is_featured: product.is_featured,
      wood_type: product.wood_type ?? "",
      dimensions: product.dimensions ?? "",
      finish: product.finish ?? "",
      weight_kg:
        product.weight_kg === null || product.weight_kg === undefined
          ? ""
          : String(product.weight_kg),
    });
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gestão de Produtos e Estoque</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre produtos, controle estoque e defina os tamanhos disponíveis.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(EMPTY);
            setOpen(true);
          }}
          className="font-bold uppercase tracking-wider"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Novo Produto
        </Button>
      </div>

      {/* Cards de Resumo de Estoque */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Total de Produtos
              </p>
              <h3 className="text-xl font-bold text-foreground">{stockMetrics.total}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Em Estoque
              </p>
              <h3 className="text-xl font-bold text-foreground">{stockMetrics.inStock}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Estoque Baixo (≤5)
              </p>
              <h3 className="text-xl font-bold text-foreground">{stockMetrics.lowStock}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Esgotados
              </p>
              <h3 className="text-xl font-bold text-foreground">{stockMetrics.outOfStock}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {paginatedProducts.map((product) => {
          const qty = product.stock_quantity ?? null;
          const rawSizes = product.sizes;
          const sizesList = Array.isArray(rawSizes)
            ? rawSizes
            : typeof rawSizes === "string" && rawSizes
              ? rawSizes
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];

          const rawColors = product.colors;
          const colorsList = Array.isArray(rawColors)
            ? rawColors
            : typeof rawColors === "string" && rawColors
              ? rawColors
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean)
              : [];

          return (
            <Card key={product.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-bold text-foreground">{product.name}</p>
                    {qty !== null &&
                      (qty <= 0 ? (
                        <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded border border-destructive/20 uppercase">
                          Esgotado
                        </span>
                      ) : qty <= 5 ? (
                        <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                          Restam {qty} un.
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                          {qty} un. em estoque
                        </span>
                      ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
                    <span>{formatPrice(product.promo_price ?? product.price)}</span>
                    {product.is_featured ? <span>· Destaque</span> : null}
                    {!product.is_active ? <span>· Inativo</span> : null}
                    {sizesList.length > 0 && (
                      <div className="flex items-center gap-1 ml-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          Tam:
                        </span>
                        {sizesList.map((sz, i) => (
                          <span
                            key={i}
                            className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-bold text-foreground"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    )}
                    {colorsList.length > 0 && (
                      <div className="flex items-center gap-1 ml-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          Cores:
                        </span>
                        {colorsList.map((col, i) => (
                          <span
                            key={i}
                            className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-bold text-foreground"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Editar"
                    onClick={() => edit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Excluir"
                    onClick={() => {
                      if (confirm(`Excluir "${product.name}"?`)) remove.mutate(product.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {allProducts.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Nenhum produto cadastrado ainda.
          </p>
        ) : null}

        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ADMIN_ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Tênis Esportivo Casual"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descreva detalhes, especificações e diferenciais do produto..."
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label htmlFor="wood_type">Tipo de Madeira</Label>
                <Input
                  id="wood_type"
                  value={form.wood_type}
                  onChange={(e) => setForm({ ...form, wood_type: e.target.value })}
                  placeholder="Ex: Nogueira"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensões</Label>
                <Input
                  id="dimensions"
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  placeholder="Ex: 40x30x5cm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="finish">Acabamento</Label>
                <Input
                  id="finish"
                  value={form.finish}
                  onChange={(e) => setForm({ ...form, finish: e.target.value })}
                  placeholder="Ex: Óleo Mineral"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight_kg">Peso (Kg)</Label>
                <Input
                  id="weight_kg"
                  inputMode="decimal"
                  value={form.weight_kg}
                  onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                  placeholder="Ex: 2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price">Preço Normal (R$)</Label>
                <Input
                  id="price"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="199.90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo">Preço Promo (R$)</Label>
                <Input
                  id="promo"
                  inputMode="decimal"
                  value={form.promo_price}
                  onChange={(e) => setForm({ ...form, promo_price: e.target.value })}
                  placeholder="149.90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Estoque (Qtd)</Label>
                <Input
                  id="stock"
                  inputMode="numeric"
                  value={form.stock_quantity}
                  onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                  placeholder="Ex: 10"
                />
              </div>
            </div>

            {/* Seleção Interativa de Tamanhos */}
            <SizeSelectorField
              values={form.sizes}
              onChange={(sizes) => setForm({ ...form, sizes })}
            />

            {/* Seleção Interativa de Cores */}
            <ColorSelectorField
              values={form.colors}
              onChange={(colors) => setForm({ ...form, colors })}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={form.category_id || "none"}
                  onValueChange={(value) =>
                    setForm({ ...form, category_id: value === "none" ? "" : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sem categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem categoria</SelectItem>
                    {(categories.data ?? []).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort">Ordem de Exibição</Label>
                <Input
                  id="sort"
                  inputMode="numeric"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                />
              </div>
            </div>
            <ImageField
              value={form.image_url}
              onChange={(value) => setForm({ ...form, image_url: value })}
              label="Foto principal"
            />
            <GalleryField
              values={form.images}
              onChange={(values) => setForm({ ...form, images: values })}
            />

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="active">Produto ativo no catálogo</Label>
              <Switch
                id="active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="featured">Exibir na página de destaques</Label>
              <Switch
                id="featured"
                checked={form.is_featured}
                onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              Salvar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
