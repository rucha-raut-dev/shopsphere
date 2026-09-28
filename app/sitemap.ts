import type { MetadataRoute } from "next";
import { getCategories, getAllProducts } from "@/lib/product-queries";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);

  const staticPaths = ["", "/shop", "/categories", "/new-arrivals", "/about", "/contact"];

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
    })),
    ...categories.map((c) => ({
      url: `${SITE_URL}/categories/${c.slug}`,
      lastModified: now,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: now,
    })),
  ];
}