import { PackageSearch } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({
  products,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your search or filters to find what you're looking for.",
}: {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <PackageSearch className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-lg font-medium text-foreground">{emptyTitle}</h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
