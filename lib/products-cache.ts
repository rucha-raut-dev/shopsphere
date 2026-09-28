import { unstable_cache } from "next/cache";
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/product-queries";
import type { Product } from "./types";

// Same tag-based caching as before (see revalidateTag in
// app/actions/checkout.ts). Only the data source changed: these now read
// from Postgres instead of data/products.ts.

export async function getCachedProductBySlug(slug: string): Promise<Product | null> {
  return unstable_cache(
    async () => getProductBySlug(slug),
    ["product-by-slug", slug],
    { tags: ["products", `product:${slug}`], revalidate: 3600 }
  )();
}

export async function getCachedProductsByCategory(categorySlug: string): Promise<Product[]> {
  return unstable_cache(
    async () => getProductsByCategory(categorySlug),
    ["products-by-category", categorySlug],
    { tags: ["products", `category:${categorySlug}`], revalidate: 3600 }
  )();
}

export async function getCachedProducts(): Promise<Product[]> {
  return unstable_cache(
    async () => getAllProducts(),
    ["all-products"],
    { tags: ["products"], revalidate: 3600 }
  )();
}