import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, RefreshCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { discountPercent, formatPrice } from "@/lib/utils";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductReviews from "@/components/ProductReviews";
import SectionHeading from "@/components/SectionHeading";
import ProductGrid from "@/components/ProductGrid";
export function generateStaticParams() {
  return products.map((p) => ({ id: p.slug }));
}

// ISR (Incremental Static Regeneration): this page is still pre-built at
// deploy time for every slug above (that part hasn't changed), but Next
// will now also regenerate a given product's HTML in the background at
// most once per hour, the next time someone requests it after that window.
// Visitors always get the fast, cached page instantly — nobody waits on
// the regeneration, they just might see data that's up to an hour stale.
//
// Right now `data/products.ts` is a static file, so this has no visible
// effect — the "data" never changes between regenerations. The moment
// this became a real database query, though, this one line is what stops
// a price or stock change from requiring a full redeploy to show up.
export const revalidate = 3600; // seconds

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getProductBySlug(params.id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductBySlug(params.id);
  if (!product) notFound();

  const discount = discountPercent(product.price, product.originalPrice);
  const related = getRelatedProducts(product);

  return (
    <div className="container-page py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/categories/${product.category}`} className="capitalize hover:text-primary">
          {product.category.replace("-", " & ")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {product.category.replace("-", " & ")}
          </p>
          <h1 className="mt-2 font-serif text-2xl font-medium text-foreground sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-warning" : "fill-transparent"}`}
                />
              ))}
            </div>
            <span className="text-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
                Save {discount}%
              </span>
            )}
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6 border-t border-border pt-6">
            <ProductPurchasePanel product={product} />
          </div>

          <div className="mt-8 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">Hassle-free process</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </div>
            </div>
          </div>

          {product.details && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Product Details</h2>
              <ul className="space-y-1.5">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

            <ProductReviews productId={product.id} />

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <SectionHeading title="You may also like" />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
