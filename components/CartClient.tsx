"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import CartItem from "@/components/CartItem";

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 6.99;

export default function CartClient() {
  const { lines, subtotal, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="container-page py-10 sm:py-14">
        <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-2xl font-medium text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet. Explore the shop to
          find something you&apos;ll love.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-8 font-serif text-3xl font-medium text-foreground sm:text-4xl">
        Shopping Cart
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-border bg-card px-5">
          {lines.map((line) => {
            const product = products.find((p) => p.id === line.productId);
            if (!product) return null;
            return (
              <CartItem key={`${line.productId}-${line.color}-${line.size}`} line={line} product={product} />
            );
          })}
        </div>

        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg font-medium text-foreground">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-foreground">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold text-foreground">
            <span>Estimated Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href="/shop"
            className="mt-3 block text-center text-xs font-medium text-muted-foreground hover:text-primary"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
