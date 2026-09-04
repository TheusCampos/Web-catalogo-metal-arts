import { queryOptions } from "@tanstack/react-query";
import { getCatalog } from "./store.functions";

/** Dados públicos do catálogo — usados no loader (SSR) e no componente. */
export const catalogQueryOptions = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
  staleTime: 300_000, // 5 minutos
});
