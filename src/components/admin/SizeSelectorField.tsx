import { useState } from "react";
import { Plus, X, Tag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESET_GROUPS = [
  {
    name: "Vestuário",
    items: ["PP", "P", "M", "G", "GG", "XG", "XGG", "Único"],
  },
  {
    name: "Calçados",
    items: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"],
  },
  {
    name: "Infantil",
    items: ["2", "4", "6", "8", "10", "12", "14", "16"],
  },
];

interface SizeSelectorFieldProps {
  values: string[];
  onChange: (sizes: string[]) => void;
}

export function SizeSelectorField({ values, onChange }: SizeSelectorFieldProps) {
  const [customInput, setCustomInput] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("Vestuário");

  const toggleSize = (size: string) => {
    const trimmed = size.trim().toUpperCase();
    if (!trimmed) return;
    if (values.includes(trimmed)) {
      onChange(values.filter((s) => s !== trimmed));
    } else {
      onChange([...values, trimmed]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const itemsToAdd = trimmed
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s && !values.includes(s));

    if (itemsToAdd.length > 0) {
      onChange([...values, ...itemsToAdd]);
    }
    setCustomInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-3.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-primary" />
          Tamanhos Disponíveis
        </Label>
        {values.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-muted-foreground hover:text-destructive font-medium cursor-pointer transition-colors"
          >
            Limpar todos ({values.length})
          </button>
        )}
      </div>

      {/* Tags selecionadas */}
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-background border border-border">
          {values.map((size) => (
            <span
              key={size}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2.5 py-1 rounded-md"
            >
              {size}
              <button
                type="button"
                onClick={() => toggleSize(size)}
                className="text-primary hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors cursor-pointer"
                title={`Remover tamanho ${size}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Nenhum tamanho selecionado (o produto será vendido como tamanho único/geral).
        </p>
      )}

      {/* Abas de Presets */}
      <div className="space-y-2 pt-1 border-t border-border/60">
        <div className="flex items-center gap-1">
          {PRESET_GROUPS.map((group) => (
            <button
              key={group.name}
              type="button"
              onClick={() => setActiveGroup(group.name)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer",
                activeGroup === group.name
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {group.name}
            </button>
          ))}
        </div>

        {/* Botões do grupo ativo */}
        <div className="flex flex-wrap gap-1.5">
          {PRESET_GROUPS.find((g) => g.name === activeGroup)?.items.map((preset) => {
            const isSelected = values.includes(preset.toUpperCase());
            return (
              <button
                key={preset}
                type="button"
                onClick={() => toggleSize(preset)}
                className={cn(
                  "h-8 min-w-[36px] px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border/80 bg-background text-foreground hover:border-primary/50 hover:bg-accent",
                )}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Adicionar tamanho customizado */}
      <div className="flex gap-2 pt-1">
        <Input
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Outro tamanho (ex: G1, 46, 1 Ano)..."
          className="h-8 text-xs bg-background"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addCustom}
          disabled={!customInput.trim()}
          className="h-8 px-3 text-xs font-bold cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
