"use client";

import { Star } from "lucide-react";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export type FilterState = {
  category: string | null;
  maxPrice: number;
  minRating: number;
};

export const PRICE_CEILING = 150;

export default function FilterSidebar({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <aside className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Category</h3>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...filters, category: null })}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
              filters.category === null
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ ...filters, category: cat.slug })}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                filters.category === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Max Price: ${filters.maxPrice}
        </h3>
        <input
          type="range"
          min={10}
          max={PRICE_CEILING}
          step={5}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-primary"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>$10</span>
          <span>${PRICE_CEILING}+</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Minimum Rating</h3>
        <div className="flex flex-col gap-2">
          {[0, 4, 4.5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange({ ...filters, minRating: rating })}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                filters.minRating === rating
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {rating === 0 ? (
                "Any Rating"
              ) : (
                <>
                  <Star className="h-3.5 w-3.5 fill-current" /> {rating}+ &amp; up
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
