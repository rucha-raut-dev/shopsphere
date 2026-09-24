import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import ProductGrid from "@/components/ProductGrid";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

// Same ISR pattern as the product detail page: pre-built at deploy time,
// then eligible to regenerate in the background at most once an hour. See
// the comment on app/products/[id]/page.tsx for the full explanation.
export const revalidate = 3600; // seconds

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const category = categories.find((c) => c.slug === params.category);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: `Shop ${category.name} at ShopSphere — ${category.label}.`,
  };
}

export default function CategoryDetailPage({
  params,
}: {
  params: { category: string };
}) {
  const category = categories.find((c) => c.slug === params.category);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <div className="container-page py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/categories" className="hover:text-primary">Categories</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {category.label}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-medium text-foreground sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      <ProductGrid
        products={categoryProducts}
        emptyTitle="No products in this category yet"
        emptyDescription="Check back soon, or browse our other categories."
      />
    </div>
  );
}
