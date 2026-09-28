import type { Product as DbProduct } from "@prisma/client";
import { db } from "@/lib/db";
import type { Category, Product } from "@/lib/types";

// Prisma returns Decimal objects and nulls; your UI expects plain numbers
// and optional fields, so convert once, here.
function toProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.categorySlug,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    rating: p.rating,
    reviews: p.reviewCount,
    image: p.image,
    images: p.images,
    description: p.description,
    details: p.details.length ? p.details : undefined,
    colors: p.colors.length ? p.colors : undefined,
    sizes: p.sizes.length ? p.sizes : undefined,
    featured: p.featured,
    newArrival: p.newArrival,
    bestseller: p.bestseller,
    stock: p.stock ?? undefined,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({ orderBy: { id: "asc" } });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.product.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });
  return row ? toProduct(row) : null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { categorySlug },
    orderBy: { id: "asc" },
  });
  return rows.map(toProduct);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { categorySlug: product.category, NOT: { id: product.id } },
    orderBy: { id: "asc" },
    take: limit,
  });
  return rows.map(toProduct);
}

export async function getCategories(): Promise<Category[]> {
  const rows = await db.category.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    label: c.label,
    image: c.image,
    itemCount: c._count.products,
  }));
}