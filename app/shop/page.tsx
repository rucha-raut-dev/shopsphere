import type { Metadata } from "next";
import { products } from "@/data/products";
import ShopClient from "@/components/ShopClient";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full ShopSphere catalog with search, filters and sorting.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Shop All
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Explore our full range of thoughtfully designed products, from
          everyday essentials to standout pieces.
        </p>
      </div>
      <ShopClient allProducts={products} initialQuery={searchParams.q ?? ""} />
    </div>
  );
}
