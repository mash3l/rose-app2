import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/shared/api/products";
import type { Product } from "@/shared/types/product";

const SEARCH_RESULTS_LIMIT = 50;
const MAX_DISPLAYED_RESULTS = 8;

function matchesQuery(product: Product, query: string): boolean {
  return product.title.toLowerCase().includes(query.toLowerCase());
}

export function useProductSearch(query: string, isEnabled: boolean) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "search-pool"],
    queryFn: () => getProducts({ limit: SEARCH_RESULTS_LIMIT }),
    enabled: isEnabled,
    staleTime: 60_000,
  });

  const results =
    data?.items.filter((product) => matchesQuery(product, query)) ?? [];

  return {
    results: results.slice(0, MAX_DISPLAYED_RESULTS),
    isLoading,
    isError,
  };
}
