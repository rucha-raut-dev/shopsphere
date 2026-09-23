"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product, SortOption } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import SortDropdown from "@/components/SortDropdown";
import FilterSidebar, { FilterState, PRICE_CEILING } from "@/components/FilterSidebar";

export default function ShopClient({
  allProducts,
  initialQuery = "",
}: {
  allProducts: Product[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>("featured");
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    maxPrice: PRICE_CEILING,
    minRating: 0,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
    let list = allProducts.filter((p) => {
      const matchesQuery =
        query.trim().length === 0 ||
        [p.name, p.category, p.description].some((field) =>
          field.toLowerCase().includes(query.trim().toLowerCase())
        );
      const matchesCategory = !filters.category || p.category === filters.category;
      const matchesPrice = p.price <= filters.maxPrice;
      const matchesRating = p.rating >= filters.minRating;
      return matchesQuery && matchesCategory && matchesPrice && matchesRating;
    });

    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [allProducts, query, filters, sort]);

  const resetFilters = () =>
    setFilters({ category: null, maxPrice: PRICE_CEILING, minRating: 0 });

  const filtersActive =
    filters.category !== null || filters.maxPrice !== PRICE_CEILING || filters.minRating !== 0;
  const clearAll = () => {
    resetFilters();
    setQuery("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <div className="hidden lg:block">
        <FilterSidebar filters={filters} onChange={setFilters} />
      </div>

      <div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-sm flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        <p className="mb-5 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "product" : "products"} found
          {query && <> for &ldquo;{query}&rdquo;</>}
        </p>

        <ProductGrid
          products={results}
          emptyTitle={query ? `No results for "${query}"` : "No products match your filters"}
          emptyDescription="Try a different search term, or reset your filters to see more products."
          emptyAction={
            (query || filtersActive) && (
              <button
                type="button"
                onClick={clearAll}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Clear search &amp; filters
              </button>
            )
          }
        />
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6 shadow-lift animate-fade-in-up">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-lg font-medium text-foreground">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={setFilters} />
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 rounded-full border border-border py-3 text-sm font-medium text-foreground"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Show {results.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}