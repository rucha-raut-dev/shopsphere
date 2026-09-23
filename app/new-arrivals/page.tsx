import type { Metadata } from "next";
import { products } from "@/data/products";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Shop the latest arrivals at ShopSphere — freshly added products across every category.",
};

export default function NewArrivalsPage() {
  const newArrivals = products.filter((p) => p.newArrival);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Just Landed
        </p>
        <h1 className="mt-2 font-serif text-3xl font-medium text-foreground sm:text-4xl">
          New Arrivals
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          The newest additions to ShopSphere, handpicked and freshly stocked
          across fashion, footwear, accessories, home and beauty.
        </p>
        <p className="mt-3 text-sm font-medium text-foreground">
          {newArrivals.length} {newArrivals.length === 1 ? "product" : "products"}
        </p>
      </div>

      <ProductGrid
        products={newArrivals}
        emptyTitle="No new arrivals right now"
        emptyDescription="Check back soon — we restock new pieces regularly."
      />
    </div>
  );
}
