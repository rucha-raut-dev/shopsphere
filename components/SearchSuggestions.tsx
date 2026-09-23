"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import type { SuggestionStatus } from "@/lib/useProductSuggestions";
import { cn, formatPrice } from "@/lib/utils";

const MIN_QUERY_LENGTH = 2;

/**
 * Pure rendering of live search results — fetching and keyboard state both
 * live in Navbar (via useProductSuggestions), so arrow-key navigation and
 * "Enter selects the highlighted result" stay in sync with what's on screen.
 */
export default function SearchSuggestions({
  query,
  results,
  status,
  activeIndex,
  onHover,
  onNavigate,
}: {
  query: string;
  results: Product[];
  status: SuggestionStatus;
  activeIndex: number;
  onHover: (index: number) => void;
  onNavigate: () => void;
}) {
  if (query.trim().length < MIN_QUERY_LENGTH) return null;

  return (
    <div
      id="navbar-search-results"
      role="listbox"
      className="max-h-80 overflow-y-auto"
    >
      {status === "loading" && (
        <div className="flex items-center gap-2 px-4 py-4 text-xs text-muted-foreground">
          <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-border border-t-primary" />
          Searching…
        </div>
      )}
      {status === "error" && (
        <p className="px-4 py-4 text-xs text-muted-foreground">
          Couldn&apos;t load suggestions. Press Enter to search anyway.
        </p>
      )}
      {status === "done" && results.length === 0 && (
        <p className="px-4 py-4 text-xs text-muted-foreground">
          No products found for &ldquo;{query.trim()}&rdquo;.
        </p>
      )}
      {results.map((product, index) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          id={`search-suggestion-${index}`}
          role="option"
          aria-selected={index === activeIndex}
          onClick={onNavigate}
          onMouseEnter={() => onHover(index)}
          className={cn(
            "flex items-center gap-3 border-l-2 px-4 py-2.5 transition-colors",
            index === activeIndex
              ? "border-l-primary bg-primary/5"
              : "border-l-transparent hover:bg-muted"
          )}
        >
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={product.image} alt={product.name} fill sizes="44px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-foreground">{product.name}</p>
            <p className="truncate text-xs capitalize text-muted-foreground">{product.category}</p>
          </div>
          <p className="shrink-0 text-xs font-medium text-foreground">
            {formatPrice(product.price)}
          </p>
        </Link>
      ))}
    </div>
  );
}