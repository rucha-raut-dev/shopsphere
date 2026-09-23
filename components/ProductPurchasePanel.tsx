"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import QuantitySelector from "@/components/QuantitySelector";
import WishlistButton from "@/components/WishlistButton";
import { useCart } from "@/context/CartContext";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(product.colors?.[0]);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-6">
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            Color{color ? `: ${color}` : ""}
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={color === c}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                  color === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:border-foreground/40"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            Size{size ? `: ${size}` : ""}
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  "flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors",
                  size === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:border-foreground/40"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Quantity</h3>
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock ?? 10} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => addToCart(product.id, quantity, color, size)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary-light"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
        <button
          type="button"
          onClick={() => {
            addToCart(product.id, quantity, color, size);
            router.push("/checkout");
          }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Zap className="h-4 w-4" />
          Buy Now
        </button>
        <WishlistButton productId={product.id} variant="pill" />
      </div>
    </div>
  );
}