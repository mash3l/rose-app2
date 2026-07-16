export type ProductBadge = "new" | "hot" | "out-of-stock";

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  rating: number;
  imageUrl: string;
  badges: ProductBadge[];
}

export interface ApiEnvelope<TPayload> {
  status: boolean;
  code: number;
  message: string;
  payload: TPayload;
}

export interface PaginatedPayload<TItem> {
  items: TItem[];
  page: number;
  limit: number;
  total: number;
}
