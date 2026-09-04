import { useState } from "react";
import { Plus, X, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  { name: "Preto", hex: "#111827" },
  { name: "Branco", hex: "#ffffff" },
  { name: "Cinza", hex: "#6b7280" },
  { name: "Azul", hex: "#2563eb" },
  { name: "Azul Marinho", hex: "#1e3a8a" },
  { name: "Vermelho", hex: "#dc2626" },
  { name: "Verde", hex: "#16a34a" },
  { name: "Amarelo", hex: "#eab308" },
  { name: "Rosa", hex: "#ec4899" },
  { name: "Bege", hex: "#d4b996" },
  { name: "Marrom", hex: "#78350f" },
  { name: "Off-White", hex: "#f8fafc" },
  { name: "Vinho", hex: "#831843" },
  { name: "Lilás", hex: "#a855f7" },
  { name: "Laranja", hex: "#ea580c" },
  { name: "Estampado", hex: "#f43f5e" },
];

interface ColorSelectorFieldProps {
  values: string[];
  onChange: (colors: string[]) => void;
}

export function ColorSelectorField({ values, onChange }: ColorSelectorFieldProps) {
  const [customInput, setCustomInput] = useState("");

  const toggleColor = (colorName: string) => {
    const trimmed = colorName.trim();
    if (!trimmed) return;
    const exists = values.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      onChange(values.filter((c) => c.toLowerCase() !== trimmed.toLowerCase()));
    } else {
      onChange([...values, trimmed]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const itemsToAdd = trimmed
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !values.some((v) => v.toLowerCase() === s.toLowerCase()));

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

  const getHexForColor = (name: string) => {
    const found = PRESET_COLORS.find((p) => p.name.toLowerCase() === name.toLowerCase());
    return found?.hex ?? "#94a3b8";
  };

  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-3.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5 text-primary" />
          Cores Disponíveis
        </Label>
        {values.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-muted-foreground hover:text-destructive font-medium cursor-pointer transition-colors"
          >
            Limpar todas ({values.length})
          </button>
        )}
      </div>

      {/* Tags selecionadas */}
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-background border border-border">
          {values.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2.5 py-1 rounded-md"
            >
              <span
                className="h-2.5 w-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: getHexForColor(color) }}
              />
              {color}
              <button
                type="button"
                onClick={() => toggleColor(color)}
                className="text-primary hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors cursor-pointer ml-0.5"
                title={`Remover cor ${color}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">Nenhuma cor configurada (opcional).</p>
      )}

      {/* Presets Rápidos */}
      <div className="space-y-1.5 pt-1 border-t border-border/60">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
          Cores Populares:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((preset) => {
            const isSelected = values.some((v) => v.toLowerCase() === preset.name.toLowerCase());
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => toggleColor(preset.name)}
                className={cn(
                  "h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer border inline-flex items-center gap-1.5",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                    : "border-border/80 bg-background text-foreground hover:border-primary/50 hover:bg-accent",
                )}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: preset.hex }}
                />
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Adicionar cor customizada */}
      <div className="flex gap-2 pt-1">
        <Input
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Outra cor (ex: Bordô, Nude, Verde Militar)..."
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
