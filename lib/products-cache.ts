import { unstable_cache } from "next/cache";
import {
  getProductBySlug as getProductBySlugUncached,
  getProductsByCategory as getProductsByCategoryUncached,
  products,
} from "@/data/products";
import type { Product } from "./types";

/**
 * Tag-based caching, the sibling of the `revalidate = 3600` (time-based ISR)
 * already on the product/category pages. Time-based revalidation answers
 * "regenerate this at most once an hour"; tags answer "regenerate this
 * *right now*, because something specific just changed" — see
 * revalidateTag calls in app/actions/checkout.ts.
 *
 * Each function below is wrapped in `unstable_cache` *inside* the exported
 * function rather than at module scope. That looks odd, but it's the
 * standard pattern for tags that depend on the argument (`product:${slug}`)
 * — `unstable_cache` treats the `keyParts` array as the cache key, so
 * calling it again with the same slug reuses the same cache entry instead
 * of creating a new one.
 *
 * `data/products.ts` is a static in-memory array, so none of this changes
 * what's returned today — it's wiring the caching *pattern* in ahead of
 * the data actually becoming dynamic (a database, a CMS, a fetch to
 * another service).
 */

export async function getCachedProductBySlug(slug: string): Promise<Product | null> {
  return unstable_cache(
    async () => getProductBySlugUncached(slug) ?? null,
    ["product-by-slug", slug],
    { tags: ["products", `product:${slug}`], revalidate: 3600 }
  )();
}

export async function getCachedProductsByCategory(categorySlug: string): Promise<Product[]> {
  return unstable_cache(
    async () => getProductsByCategoryUncached(categorySlug),
    ["products-by-category", categorySlug],
    { tags: ["products", `category:${categorySlug}`], revalidate: 3600 }
  )();
}

export async function getCachedProducts(): Promise<Product[]> {
  return unstable_cache(
    async () => products,
    ["all-products"],
    { tags: ["products"], revalidate: 3600 }
  )();
}