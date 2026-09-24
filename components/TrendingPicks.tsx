import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

/**
 * This is an `async` Server Component — a component whose function body
 * itself awaits something before it can render, not a component that
 * fetches data in a useEffect. React can only start sending the parts of
 * the page that ARE ready while this one is still pending, which is what
 * <Suspense> in app/shop/page.tsx is there to allow.
 *
 * `data/products.ts` is instant to read (it's just an array already in
 * memory), so there's nothing to actually wait on here. The delay below
 * exists purely to make that "still loading" moment visible — stand-in for
 * a real recommendation engine, an analytics service, or any other slow
 * external call a product page might genuinely make.
 */
export default async function TrendingPicks() {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const picks = products.filter((p) => p.featured).slice(0, 4);
  if (picks.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Trending Right Now
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-1">
        {picks.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="w-40 shrink-0 group sm:w-48"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="192px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 truncate text-sm text-foreground">{product.name}</p>
            <p className="text-sm font-medium text-muted-foreground">
              {formatPrice(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}