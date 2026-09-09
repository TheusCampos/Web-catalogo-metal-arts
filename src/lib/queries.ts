import { queryOptions } from "@tanstack/react-query";
import {
  getCatalog,
  getProductsCatalog,
  getProductById,
  type CatalogFilterParams,
} from "./store.functions";

/** Dados institucionais gerais do catálogo — usados no shell e na página inicial. */
export const catalogQueryOptions = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
  staleTime: 5 * 60 * 1000, // 5 minutos
  gcTime: 30 * 60 * 1000, // 30 minutos
});

/**
 * Consulta de produtos paginados e filtrados no servidor.
 * Granular: cada combinação de página/filtro gera um cache inteligente.
 */
export const productsCatalogQueryOptions = (filters?: Partial<CatalogFilterParams>) =>
  queryOptions({
    queryKey: ["products", filters ?? {}],
    queryFn: () => getProductsCatalog({ data: filters }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });

/**
 * Consulta sob demanda para a página de detalhes de um único produto.
 * Carrega a descrição e galeria ricas apenas quando o produto é acessado.
 */
export const productDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: () => getProductById({ data: id }),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
