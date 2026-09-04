import { useState } from "react";
import { Search, X, Filter, Mail, Check, RotateCcw, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { recordLead } from "@/lib/store.functions";
import { toast } from "sonner";

export interface FilterState {
  busca: string;
  categoria: string;
  tamanho: string;
  faixaPreco: string;
  apenasPromo: boolean;
}

interface CatalogFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  categories: { id: string; name: string; count: number }[];
  availableSizes: string[];
}

const PRICE_RANGES = [
  { id: "", label: "Todos os preços" },
  { id: "ate100", label: "Até R$ 100,00" },
  { id: "100a300", label: "R$ 100,00 a R$ 300,00" },
  { id: "acima300", label: "Acima de R$ 300,00" },
];

export function CatalogFilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  availableSizes,
}: CatalogFilterSidebarProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [savingNewsletter, setSavingNewsletter] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSavingNewsletter(true);
    try {
      await recordLead({
        data: { email: newsletterEmail.trim().toLowerCase(), source: "newsletter" },
      });
      setNewsletterEmail("");
      toast.success("Inscrição realizada! Você receberá nossas promoções.");
    } catch {
      toast.error("Erro ao cadastrar e-mail.");
    } finally {
      setSavingNewsletter(false);
    }
  };

  const hasActiveFilters =
    Boolean(filters.busca) ||
    Boolean(filters.categoria) ||
    Boolean(filters.tamanho) ||
    Boolean(filters.faixaPreco) ||
    filters.apenasPromo;

  return (
    <aside className="w-full space-y-6">
      {/* Cabeçalho de Filtros & Reset */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-foreground">
          <Filter className="h-4 w-4 text-primary" /> Filtros do Catálogo
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-bold text-destructive hover:underline flex items-center gap-1 uppercase"
          >
            <RotateCcw className="h-3 w-3" /> Limpar
          </button>
        )}
      </div>

      {/* 1. Busca por Nome */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Buscar Produto
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Nome ou palavra-chave..."
            value={filters.busca}
            onChange={(e) => onFilterChange({ busca: e.target.value })}
            className="pl-8 text-xs h-9"
          />
          {filters.busca && (
            <button
              type="button"
              onClick={() => onFilterChange({ busca: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Filtro por Categoria / Departamento */}
      {categories.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Filtrar por Categoria
          </span>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onFilterChange({ categoria: "" })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase transition-colors ${
                !filters.categoria
                  ? "bg-primary text-primary-foreground font-bold"
                  : "bg-muted/30 text-foreground hover:bg-muted/70"
              }`}
            >
              <span>Todas as Categorias</span>
            </button>
            {categories.map((cat) => {
              const active = filters.categoria === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onFilterChange({ categoria: cat.id })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium uppercase transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Filtro por Tamanho das Peças (Se houver tamanhos cadastrados) */}
      {availableSizes.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Filtrar por Tamanho
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onFilterChange({ tamanho: "" })}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase border transition-colors ${
                !filters.tamanho
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 bg-card hover:border-primary text-foreground"
              }`}
            >
              Todos
            </button>
            {availableSizes.map((size) => {
              const active = filters.tamanho === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onFilterChange({ tamanho: active ? "" : size })}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase border transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "border-border/60 bg-card hover:border-primary text-foreground"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Filtro por Faixa de Preço */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Faixa de Preço
        </span>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const active = filters.faixaPreco === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => onFilterChange({ faixaPreco: range.id })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <span>{range.label}</span>
                {active && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Filtro Apenas Ofertas */}
      <div className="pt-2 border-t border-border/40">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.apenasPromo}
            onChange={(e) => onFilterChange({ apenasPromo: e.target.checked })}
            className="rounded border-border text-primary focus:ring-primary h-4 w-4"
          />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-destructive" /> Apenas em Promoção
          </span>
        </label>
      </div>
    </aside>
  );
}
