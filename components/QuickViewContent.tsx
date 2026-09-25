"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/utils";
import { getStockStatus } from "@/lib/stock";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import WishlistButton from "@/components/WishlistButton";

export default function QuickViewContent({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const discount = discountPercent(product.price, product.originalPrice);
  const outOfStock = getStockStatus(product.stock).state === "out";

  return (
    <div className="grid gap-5 pt-2 sm:grid-cols-2 sm:gap-6">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 320px, 100vw"
          className="object-cover"
        />
        {discount && !outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {product.category.replace("-", " & ")}
        </p>
        <h2 className="mt-1 font-serif text-xl font-medium text-foreground">{product.name}</h2>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span>{product.rating.toFixed(1)}</span>
          <span aria-hidden="true">·</span>
          <span>{product.reviews} reviews</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-5">
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => {
              // Quick view uses sensible defaults (first color/size) — the
              // full product page is where you'd pick a specific variant.
              addToCart(product.id, 1, product.colors?.[0], product.sizes?.[0]);
              showToast(`${product.name} added to cart`, "success");
            }}
            className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {outOfStock ? "Sold Out" : "Add to Cart"}
          </button>
          <WishlistButton productId={product.id} />
        </div>

        {/*
          A plain <a>, not next/link's <Link>. We're already "on" this
          route (that's the whole premise of a modal) — a Link to the same
          href wouldn't do anything. A real anchor forces a full browser
          navigation, stepping outside the intercepted modal entirely and
          landing on the actual full product page underneath it.
        */}
        <a
          href={`/products/${product.slug}`}
          className="mt-3 text-center text-xs font-medium text-primary hover:underline"
        >
          View full details &amp; options →
        </a>
      </div>
    </div>
  );
}