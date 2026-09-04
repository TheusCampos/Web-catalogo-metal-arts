/**
 * Mapeia nomes de cores (PT/EN) para valores CSS para exibição visual nos seletores.
 * Cores não reconhecidas retornam um cinza neutro como fallback.
 */
const COLOR_MAP: Record<string, string> = {
  // Português
  branco: "#f8fafc",
  "off-white": "#f8fafc",
  preto: "#111827",
  azul: "#2563eb",
  "azul-marinho": "#1e3a5f",
  "azul-royal": "#1d4ed8",
  vermelho: "#dc2626",
  verde: "#16a34a",
  "verde-militar": "#3f5c2e",
  amarelo: "#eab308",
  rosa: "#ec4899",
  "rosa-bebê": "#fbcfe8",
  cinza: "#6b7280",
  "cinza-claro": "#d1d5db",
  bege: "#d4b996",
  marrom: "#78350f",
  vinho: "#831843",
  roxo: "#a855f7",
  lilás: "#a855f7",
  laranja: "#ea580c",
  dourado: "#ca8a04",
  prata: "#9ca3af",
  turquesa: "#0891b2",
  caramelo: "#b45309",
  nude: "#e8c9a0",

  // Inglês
  white: "#f8fafc",
  black: "#111827",
  blue: "#2563eb",
  navy: "#1e3a5f",
  red: "#dc2626",
  green: "#16a34a",
  yellow: "#eab308",
  pink: "#ec4899",
  gray: "#6b7280",
  grey: "#6b7280",
  beige: "#d4b996",
  brown: "#78350f",
  purple: "#a855f7",
  orange: "#ea580c",
  gold: "#ca8a04",
  silver: "#9ca3af",
  teal: "#0891b2",
};

/** Resolve uma cor pelo nome, retorna o hex ou um cinza neutro como fallback. */
export function resolveColorHex(colorName: string): string {
  const key = colorName.toLowerCase().trim();
  return COLOR_MAP[key] ?? "#94a3b8";
}
