"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/utils";
import { getStockStatus } from "@/lib/stock";
import WishlistButton from "@/components/WishlistButton";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const discount = discountPercent(product.price, product.originalPrice);
  const outOfStock = getStockStatus(product.stock).state === "out";

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        {/* Image link. The buttons below are siblings (not children) of this
            link, so we no longer nest interactive elements inside an <a>. */}
        <Link
          href={`/products/${product.slug}`}
          aria-label={product.name}
          className="absolute inset-0 block"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              New
            </span>
          )}
          {discount && !outOfStock && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              -{discount}%
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              Sold out
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} />
        </div>

        {/* Always visible on touch / small screens; on md+ it reveals on hover
            OR keyboard focus (group-focus-within) so it's reachable by everyone. */}
        <div
          className="absolute inset-x-3 bottom-3 transition-all duration-300
            md:translate-y-2 md:opacity-0
            md:group-hover:translate-y-0 md:group-hover:opacity-100
            md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
        >
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => {
              // Use the same defaults as the product page so the same item
              // never ends up as two separate cart lines.
              addToCart(product.id, 1, product.colors?.[0], product.sizes?.[0]);
              showToast(`${product.name} added to cart`, "success");
            }}
            aria-label={`Add ${product.name} to cart`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground/95 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lift backdrop-blur transition-colors hover:bg-primary focus-visible:bg-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-foreground/95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {outOfStock ? "Sold out" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {product.category.replace("-", " & ")}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span>{product.rating.toFixed(1)}</span>
          <span aria-hidden="true">·</span>
          <span>{product.reviews} reviews</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}