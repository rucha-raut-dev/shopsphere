import type { Metadata } from "next";
import { Suspense } from "react";
import { products } from "@/data/products";
import ShopClient from "@/components/ShopClient";
import TrendingPicks from "@/components/TrendingPicks";
import TrendingPicksSkeleton from "@/components/TrendingPicksSkeleton";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full ShopSphere catalog with search, filters and sorting.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q ?? "";

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

      {/*
        TrendingPicks is a slow `async` Server Component. Without Suspense,
        this whole page would wait for it before sending ANYTHING to the
        browser — the heading above and the product grid below are both
        ready instantly, but a visitor would still stare at a blank page
        for over a second because of one unrelated, slower section.

        With this boundary, Next streams the rest of the page immediately
        and fills in TrendingPicksSkeleton's placeholder in its place, then
        swaps in the real TrendingPicks HTML over that same connection the
        moment it resolves — no extra client-side fetch, no loading spinner
        the browser has to script itself.
      */}
      <Suspense fallback={<TrendingPicksSkeleton />}>
        <TrendingPicks />
      </Suspense>

      {/*
        `key` forces ShopClient to remount whenever the ?q= param changes, so a
        new search from the navbar / mobile menu while already on /shop updates
        the results instead of being ignored (initialQuery is only read once).
      */}
      <ShopClient key={query} allProducts={products} initialQuery={query} />
    </div>
  );
}