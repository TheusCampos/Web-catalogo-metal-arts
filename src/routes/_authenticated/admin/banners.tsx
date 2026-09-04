import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  ExternalLink,
  ImageIcon,
  LayoutGrid,
  Monitor,
  Image,
} from "lucide-react";
import { adminApi, type BannerRow } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageField } from "@/components/admin/ImageField";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/banners")({
  component: AdminBanners,
});

// ─── Tipos ────────────────────────────────────────────────────────────────────

type BannerType = "hero" | "grid" | "middle" | "catalog";

type FormState = {
  id?: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  mobile_image_url: string;
  is_active: boolean;
  bannerType: BannerType;
  gridPosition: string;
};

const BASE: Omit<FormState, "bannerType" | "gridPosition"> = {
  title: "",
  subtitle: "",
  cta_text: "",
  cta_link: "",
  image_url: "",
  mobile_image_url: "",
  is_active: true,
};

const EMPTY_HERO: FormState = { ...BASE, bannerType: "hero", gridPosition: "1" };
const EMPTY_GRID: FormState = { ...BASE, bannerType: "grid", gridPosition: "1" };
const EMPTY_MIDDLE: FormState = { ...BASE, bannerType: "middle", gridPosition: "1" };
const EMPTY_CATALOG: FormState = { ...BASE, bannerType: "catalog", gridPosition: "1" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectType(b: BannerRow): BannerType {
  if (b.sort_order === 0) return "hero";
  if (b.sort_order >= 1 && b.sort_order <= 4) return "grid";
  if (b.sort_order === 6) return "catalog";
  return "middle";
}

function resolveSortOrder(f: FormState): number {
  if (f.bannerType === "hero") return 0;
  if (f.bannerType === "grid") return Math.min(4, Math.max(1, Number(f.gridPosition) || 1));
  if (f.bannerType === "catalog") return 6;
  return 5;
}

// ─── Componente principal ─────────────────────────────────────────────────────

function AdminBanners() {
  const queryClient = useQueryClient();
  const banners = useQuery({ queryKey: ["admin", "banners"], queryFn: adminApi.banners });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_HERO);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!form.image_url) throw new Error("Selecione uma imagem para o banner.");
      await adminApi.saveBanner({
        ...(form.id ? { id: form.id } : {}),
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        cta_text: form.cta_text.trim() || null,
        cta_link: form.cta_link.trim() || null,
        image_url: form.image_url || null,
        mobile_image_url: form.bannerType === "hero" ? form.mobile_image_url || null : null,
        sort_order: resolveSortOrder(form),
        is_active: form.is_active,
      });
    },
    onSuccess: () => {
      toast.success("Banner salvo com sucesso!");
      setOpen(false);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: adminApi.deleteBanner,
    onSuccess: () => {
      toast.success("Banner excluído");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function openNew(type: BannerType) {
    if (type === "hero") setForm(EMPTY_HERO);
    else if (type === "grid") setForm(EMPTY_GRID);
    else if (type === "catalog") setForm(EMPTY_CATALOG);
    else setForm(EMPTY_MIDDLE);
    setOpen(true);
  }

  function edit(banner: BannerRow) {
    const bannerType = detectType(banner);
    setForm({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      cta_text: banner.cta_text ?? "",
      cta_link: banner.cta_link ?? "",
      image_url: banner.image_url ?? "",
      mobile_image_url: banner.mobile_image_url ?? "",
      is_active: banner.is_active,
      bannerType,
      gridPosition: bannerType === "grid" ? String(banner.sort_order) : "1",
    });
    setOpen(true);
  }

  const heroBanners = (banners.data ?? []).filter((b) => b.sort_order === 0);
  const gridBanners = (banners.data ?? []).filter((b) => b.sort_order >= 1 && b.sort_order <= 4);
  const middleBanners = (banners.data ?? []).filter((b) => b.sort_order === 5);
  const catalogBanners = (banners.data ?? []).filter((b) => b.sort_order === 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Banners</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie os banners de cada seção da loja separadamente.
        </p>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero" className="flex items-center gap-1.5 text-xs">
            <Monitor className="h-3.5 w-3.5" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-1.5 text-xs">
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid 4 Cards
          </TabsTrigger>
          <TabsTrigger value="middle" className="flex items-center gap-1.5 text-xs">
            <Image className="h-3.5 w-3.5" />
            Banner Central
          </TabsTrigger>
          <TabsTrigger value="catalogo" className="flex items-center gap-1.5 text-xs">
            <ImageIcon className="h-3.5 w-3.5" />
            Catálogo
          </TabsTrigger>
        </TabsList>

        {/* ── Hero ── */}
        <TabsContent value="hero" className="space-y-4 pt-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-base">Hero — Banner Principal</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Imagens do carrossel exibido no topo da página inicial. Adicione quantos quiser —
                eles alternam automaticamente a cada 5 segundos.
              </p>
            </div>
            <Button size="sm" onClick={() => openNew("hero")} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" /> Novo slide
            </Button>
          </div>
          <BannerList
            banners={heroBanners}
            emptyMessage="Nenhum slide cadastrado — adicione imagens para o carrossel do topo da página inicial."
            onEdit={edit}
            onDelete={(b) => {
              if (confirm(`Excluir "${b.title || "este banner"}"?`)) remove.mutate(b.id);
            }}
            badgeLabel={() => "Slide Hero"}
          />
        </TabsContent>

        {/* ── Grid ── */}
        <TabsContent value="grid" className="space-y-4 pt-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-base">Grid — 4 Mini-Banners Promocionais</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Grade com 4 banners exibida logo abaixo do hero. Cada posição (1 a 4) equivale a um
                card na grade.
              </p>
            </div>
            <Button size="sm" onClick={() => openNew("grid")} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" /> Novo card
            </Button>
          </div>

          {/* Preview das 4 posições */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[1, 2, 3, 4].map((pos) => {
              const found = gridBanners.find((b) => b.sort_order === pos);
              return (
                <div
                  key={pos}
                  className={`rounded-lg border-2 border-dashed p-3 text-xs transition-colors ${
                    found
                      ? "border-primary/40 bg-primary/5 text-primary font-semibold"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4 mx-auto mb-1 opacity-60" />
                  Posição {pos}
                  {found ? (
                    <div className="truncate text-[10px] font-normal mt-0.5 text-foreground">
                      {found.title || "Card Ativo"}
                    </div>
                  ) : (
                    <div className="text-[10px] mt-0.5 opacity-60">Vazio</div>
                  )}
                </div>
              );
            })}
          </div>

          <BannerList
            banners={[...gridBanners].sort((a, b) => a.sort_order - b.sort_order)}
            emptyMessage="Nenhum mini-banner cadastrado. Adicione até 4 cards para exibir o grid promocional."
            onEdit={edit}
            onDelete={(b) => {
              if (confirm(`Excluir "${b.title || "este banner"}"?`)) remove.mutate(b.id);
            }}
            badgeLabel={(b) => `Posição ${b.sort_order}`}
          />
        </TabsContent>

        {/* ── Banner Central ── */}
        <TabsContent value="middle" className="space-y-4 pt-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-base">
                Banner Central — Destaque de Grande Impacto
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Banner panorâmico exibido no meio da página inicial, entre os produtos e as
                categorias. Proporção recomendada: <strong>1234 × 418 px</strong>.
              </p>
            </div>
            {middleBanners.length === 0 && (
              <Button size="sm" onClick={() => openNew("middle")} className="shrink-0">
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            )}
          </div>

          <BannerList
            banners={middleBanners}
            emptyMessage="Nenhum banner central cadastrado."
            onEdit={edit}
            onDelete={(b) => {
              if (confirm(`Excluir "${b.title || "este banner"}"?`)) remove.mutate(b.id);
            }}
            badgeLabel={() => "Banner Central"}
          />

          {middleBanners.length > 0 && (
            <p className="text-xs text-muted-foreground">
              💡 Apenas o primeiro banner central é exibido. Exclua o atual para adicionar outro.
            </p>
          )}
        </TabsContent>

        {/* ── Catálogo ── */}
        <TabsContent value="catalogo" className="space-y-4 pt-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-base">Banner do Catálogo</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Imagem promocional exibida no topo da página de catálogo.
              </p>
            </div>
            {catalogBanners.length === 0 && (
              <Button size="sm" onClick={() => openNew("catalog")} className="shrink-0">
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            )}
          </div>

          <BannerList
            banners={catalogBanners}
            emptyMessage="Nenhum banner de catálogo cadastrado."
            onEdit={edit}
            onDelete={(b) => {
              if (confirm(`Excluir "${b.title || "este banner"}"?`)) remove.mutate(b.id);
            }}
            badgeLabel={() => "Banner de Catálogo"}
          />

          {catalogBanners.length > 0 && (
            <p className="text-xs text-muted-foreground">
              💡 Apenas o primeiro banner de catálogo é exibido. Exclua o atual para adicionar
              outro.
            </p>
          )}

          <div className="rounded-xl border border-dashed border-border p-6 bg-muted/20 space-y-2 mt-6">
            <h3 className="font-semibold text-sm">Como funciona o Banner do Catálogo?</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Exibido no topo da página /catalogo, acima dos produtos</li>
              <li>
                Ideal para promoções gerais da loja, como "Frete Grátis acima de R$ 299" ou "Queima
                de Estoque"
              </li>
              <li>Aparece em todas as visitas ao catálogo, independente de filtros</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Dialog de criação/edição ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {form.id ? "Editar banner" : "Novo banner"}
              {" — "}
              {form.bannerType === "hero"
                ? "Hero (Slide do Carrossel)"
                : form.bannerType === "grid"
                  ? "Grid Card"
                  : "Banner Central"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Posição no Grid */}
            {form.bannerType === "grid" && (
              <div className="space-y-2">
                <Label>Posição no Grid (1 a 4)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setForm({ ...form, gridPosition: String(pos) })}
                      className={`rounded-lg border-2 py-2 text-sm font-bold transition-colors ${
                        form.gridPosition === String(pos)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Posição {form.gridPosition} — da esquerda para a direita no grid.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Título (opcional)</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Nova Coleção (ou deixe em branco se já houver texto na imagem)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo (opcional)</Label>
              <Input
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Ex: Descubra as novidades da estação"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cta">Texto do botão</Label>
                <Input
                  id="cta"
                  value={form.cta_text}
                  onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                  placeholder="Ex: Ver Coleção"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaLink">Link do botão</Label>
                <Input
                  id="ctaLink"
                  value={form.cta_link}
                  onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                  placeholder="/catalogo ou https://..."
                />
              </div>
            </div>

            <ImageField
              value={form.image_url}
              onChange={(value) => setForm({ ...form, image_url: value })}
              label={
                form.bannerType === "hero"
                  ? "Imagem Desktop (Principal — Recomendado: 3780 × 1890 px ou 1920 × 960 px)"
                  : "Imagem do banner"
              }
            />

            {form.bannerType === "hero" && (
              <div className="space-y-1 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3">
                <ImageField
                  value={form.mobile_image_url}
                  onChange={(value) => setForm({ ...form, mobile_image_url: value })}
                  label="Imagem Mobile (Opcional — Recomendado: 1080 × 1350 px ou 1080 × 1080 px)"
                />
                <p className="text-[11px] text-muted-foreground">
                  📱 Se cadastrada, esta imagem será exibida automaticamente em celulares e telas
                  menores no lugar do banner widescreen desktop.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="bannerActive" className="text-sm font-medium">
                  Banner ativo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Banners inativos ficam ocultos na loja.
                </p>
              </div>
              <Switch
                id="bannerActive"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Sub-componente: lista de banners ─────────────────────────────────────────

interface BannerListProps {
  banners: BannerRow[];
  emptyMessage: string;
  onEdit: (banner: BannerRow) => void;
  onDelete: (banner: BannerRow) => void;
  badgeLabel: (banner: BannerRow) => string;
}

function BannerList({ banners, emptyMessage, onEdit, onDelete, badgeLabel }: BannerListProps) {
  if (banners.length === 0) {
    return emptyMessage ? (
      <p className="py-10 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
        {emptyMessage}
      </p>
    ) : null;
  }

  return (
    <div className="space-y-3">
      {banners.map((banner) => (
        <Card key={banner.id} className={banner.is_active ? "" : "opacity-60"}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              {banner.image_url ? (
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="truncate font-bold text-foreground text-sm">
                  {banner.title || "Banner sem título"}
                </p>
                <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-primary/20 shrink-0">
                  {badgeLabel(banner)}
                </span>
                {!banner.is_active && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-muted text-muted-foreground shrink-0">
                    Inativo
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground font-medium mt-0.5">
                {banner.subtitle || "Sem subtítulo"}
                {banner.cta_link ? ` · ${banner.cta_link}` : ""}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Editar"
                onClick={() => onEdit(banner)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Excluir"
                onClick={() => onDelete(banner)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
