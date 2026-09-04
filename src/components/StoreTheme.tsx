import { useEffect } from "react";
import type { StoreSettings } from "@/lib/store.functions";

/** Converte #rrggbb para "oklch(...)" aproximado via canvas-free conversion. */
function hexToOklch(hex: string): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1]!, 16);
  const srgb = [(int >> 16) & 255, (int >> 8) & 255, int & 255].map((v) => v / 255);
  const lin = srgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [
    number,
    number,
    number,
  ];
  const [r, g, b] = lin;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m2 = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m2 - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m2 + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m2 - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  const H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

/**
 * Aplica a identidade visual da loja em CSS variables.
 * Assim o lojista muda a cor primária pelo painel, sem tocar no código.
 */
export function StoreTheme({ settings }: { settings: StoreSettings | null }) {
  useEffect(() => {
    if (!settings?.primary_color) return;
    const value = hexToOklch(settings.primary_color) ?? settings.primary_color;
    document.documentElement.style.setProperty("--primary", value);
    // Contraste do texto sobre a cor primária.
    const int = parseInt(settings.primary_color.replace("#", ""), 16);
    if (!Number.isNaN(int)) {
      const luminance =
        (0.299 * ((int >> 16) & 255) + 0.587 * ((int >> 8) & 255) + 0.114 * (int & 255)) / 255;
      document.documentElement.style.setProperty(
        "--primary-foreground",
        luminance > 0.62 ? "oklch(0.18 0.01 260)" : "oklch(0.99 0 0)",
      );
    }
  }, [settings?.primary_color]);

  return null;
}
