import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  qty: number;
  size?: string | null;
  color?: string | null;
};

const MAX_QTY = 99;

function matchesItem(item: CartItem, id: string, size?: string | null, color?: string | null) {
  return (
    item.id === id && (item.size || "") === (size || "") && (item.color || "") === (color || "")
  );
}

interface CartState {
  items: CartItem[];
  /** true depois que o estado hidratou do localStorage (evita flash de contador no SSR) */
  ready: boolean;

  add: (id: string, qty?: number, size?: string | null, color?: string | null) => void;
  setQty: (id: string, qty: number, size?: string | null, color?: string | null) => void;
  remove: (id: string, size?: string | null, color?: string | null) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      ready: false,

      add: (id, qty = 1, size, color) => {
        set((state) => {
          const existing = state.items.find((item) => matchesItem(item, id, size, color));
          if (existing) {
            return {
              items: state.items.map((item) =>
                matchesItem(item, id, size, color)
                  ? { ...item, qty: Math.min(item.qty + qty, MAX_QTY) }
                  : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id,
                qty: Math.min(qty, MAX_QTY),
                size: size?.trim() || null,
                color: color?.trim() || null,
              },
            ],
          };
        });
      },

      setQty: (id, qty, size, color) => {
        if (qty <= 0) {
          set((state) => ({
            items: state.items.filter((item) => !matchesItem(item, id, size, color)),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            matchesItem(item, id, size, color) ? { ...item, qty: Math.min(qty, MAX_QTY) } : item,
          ),
        }));
      },

      remove: (id, size, color) => {
        set((state) => ({
          items: state.items.filter((item) => !matchesItem(item, id, size, color)),
        }));
      },

      clear: () => set({ items: [] }),

      has: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: "catalogo:carrinho", // mesma chave anterior — migração transparente
      onRehydrateStorage: () => (state) => {
        if (state) state.ready = true;
      },
    },
  ),
);

/** Seletor derivado: total de unidades no carrinho */
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((total, item) => total + item.qty, 0));
