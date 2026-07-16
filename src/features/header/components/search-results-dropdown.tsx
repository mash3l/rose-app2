import { useTranslations } from "next-intl";
import Image from "next/image";

import { Link } from "@/i18n/routing";
import { StarRating } from "@/shared/ui/StarRating";
import { PriceDisplay } from "@/shared/ui/PriceDisplay";
import { useProductSearch } from "@/features/header/hooks/useProductSearch";

export interface SearchResultsDropdownProps {
  query: string;
  hasActiveQuery: boolean;
}

export function SearchResultsDropdown({
  query,
  hasActiveQuery,
}: SearchResultsDropdownProps) {
  // Translation
  const t = useTranslations("header");

  // Query
  const { results, isLoading, isError } = useProductSearch(
    query,
    hasActiveQuery,
  );

  return (
    <div
      role="listbox"
      className="absolute top-full mt-2 w-full rounded-[10px] border border-border bg-card p-2 shadow-lg z-50"
    >
      {!hasActiveQuery && (
        <p className="px-3 py-2 text-body-sm text-muted-foreground">
          {t("searchDefault")}
        </p>
      )}

      {hasActiveQuery && isLoading && <SearchResultsSkeleton />}

      {hasActiveQuery && !isLoading && isError && (
        <p className="px-3 py-4 text-center text-body-sm text-danger">
          {t("searchError")}
        </p>
      )}

      {hasActiveQuery && !isLoading && !isError && results.length === 0 && (
        <p className="px-3 py-4 text-center text-body-sm text-muted-foreground">
          {t("searchEmpty")}
        </p>
      )}

      {hasActiveQuery &&
        !isLoading &&
        !isError &&
        results.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            role="option"
            className="flex items-center gap-3 rounded-[10px] p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-md object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-body-sm font-medium text-foreground">
                {product.title}
              </p>
              <StarRating rating={product.rating} />
            </div>
            <PriceDisplay
              price={product.price}
              discountedPrice={product.discountedPrice}
              className="shrink-0"
            />
          </Link>
        ))}
    </div>
  );
}

function SearchResultsSkeleton() {
  const skeletonRowIds = ["row-1", "row-2", "row-3"];

  return (
    <div className="flex flex-col gap-2 p-1">
      {skeletonRowIds.map((rowId) => (
        <div key={rowId} className="flex items-center gap-3 p-2">
          <div className="size-12 shrink-0 animate-pulse rounded-md bg-muted" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
