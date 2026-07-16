"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Input } from "@/shared/ui/Input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { SearchResultsDropdown } from "@/features/header/components/search-results-dropdown";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

export function SearchBar() {
  // Translation
  const t = useTranslations("header");

  // State
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Ref
  const containerRef = useRef<HTMLDivElement>(null);

  // Variables (derived)
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const hasActiveQuery = debouncedQuery.trim().length >= MIN_QUERY_LENGTH;

  // Functions (handlers)
  const handleFocus = () => setIsExpanded(true);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setIsExpanded(false);
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div ref={containerRef} className="relative w-full" onBlur={handleBlur}>
      <Input
        type="search"
        value={query}
        onChange={handleQueryChange}
        onFocus={handleFocus}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        aria-expanded={isExpanded}
        aria-haspopup="listbox"
        height={52}
      />

      {isExpanded && (
        <SearchResultsDropdown
          query={debouncedQuery}
          hasActiveQuery={hasActiveQuery}
        />
      )}
    </div>
  );
}
