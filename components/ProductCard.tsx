"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/utils";
import WishlistButton from "@/components/WishlistButton";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <div className="group relative flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              New
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              -{discount}%
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} />
        </div>
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id, 1);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground/95 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lift backdrop-blur transition-colors hover:bg-primary"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>
      </Link>

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
