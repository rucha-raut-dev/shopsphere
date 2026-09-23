"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export default function WishlistClient() {
  const { productIds, removeFromWishlist, isHydrated } = useWishlist();
  const { addToCart } = useCart();

  if (!isHydrated) {
    return (
      <div className="container-page py-10 sm:py-14">
        <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const items = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Heart className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-2xl font-medium text-foreground">
          Your wishlist is empty
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Save items you love by tapping the heart icon on any product.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Discover Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Your Wishlist
        </h1>
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <div key={product.id} className="group relative flex flex-col">
            <Link
              href={`/products/${product.slug}`}
              className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWishlist(product.id);
                }}
                aria-label={`Remove ${product.name} from wishlist`}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-soft transition-transform hover:scale-105"
              >
                <Trash2 className="h-4 w-4 text-foreground" />
              </button>
            </Link>
            <div className="mt-3 flex flex-1 flex-col gap-1">
              <Link
                href={`/products/${product.slug}`}
                className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary"
              >
                {product.name}
              </Link>
              <p className="text-sm font-semibold text-foreground">
                {formatPrice(product.price)}
              </p>
              <button
                type="button"
                onClick={() => {
                  addToCart(product.id, 1);
                  removeFromWishlist(product.id);
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground/95 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
