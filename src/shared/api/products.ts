import { API_BASE_URL } from "@/shared/lib/env";
import type {
  ApiEnvelope,
  PaginatedPayload,
  Product,
} from "@/shared/types/product";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  subCategoryId?: string;
  occasionId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

function buildProductsQueryString(params: GetProductsParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<PaginatedPayload<Product>> {
  const queryString = buildProductsQueryString(params);
  const response = await fetch(`${API_BASE_URL}/api/products?${queryString}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const envelope: ApiEnvelope<PaginatedPayload<Product>> =
    await response.json();

  return envelope.payload;
}
