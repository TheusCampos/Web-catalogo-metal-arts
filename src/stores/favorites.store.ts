import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  ids: string[];
  /** true depois que o estado hidratou do localStorage (evita flash de contador no SSR) */
  ready: boolean;

  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      ready: false,

      toggle: (id) => {
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id],
        }));
      },

      isFavorite: (id) => get().ids.includes(id),
    }),
    {
      name: "catalogo:favoritos", // mesma chave anterior — migração transparente
      onRehydrateStorage: () => (state) => {
        if (state) state.ready = true;
      },
    },
  ),
);

/** Seletor derivado: quantidade de favoritos */
export const useFavoritesCount = () => useFavoritesStore((s) => s.ids.length);
