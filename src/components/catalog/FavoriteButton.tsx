import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/** Botão de favoritar (coração) — funciona sem login. */
export function FavoriteButton({
  active,
  onToggle,
  className,
  label,
  responsiveLabel = false,
}: {
  active: boolean;
  onToggle: () => void;
  className?: string;
  label?: string;
  responsiveLabel?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-border bg-card/90 px-3 py-2 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground shrink-0",
        active && "text-primary",
        className,
      )}
    >
      <Heart
        className={cn("h-4 w-4 shrink-0 transition-transform", active && "fill-current scale-110")}
      />
      {label ? (
        <span className={responsiveLabel ? "hidden md:inline" : undefined}>{label}</span>
      ) : null}
    </button>
  );
}
