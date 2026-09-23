"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartLine, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import QuantitySelector from "@/components/QuantitySelector";
import { useCart } from "@/context/CartContext";

export default function CartItem({ line, product }: { line: CartLine; product: Product }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 border-b border-border py-5 last:border-0">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28"
      >
        <Image src={product.image} alt={product.name} fill sizes="112px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/products/${product.slug}`}
              className="text-sm font-medium text-foreground hover:text-primary sm:text-base"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              {[line.color, line.size].filter(Boolean).join(" · ") || "Standard"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(product.id, line.color, line.size)}
            aria-label={`Remove ${product.name} from cart`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-accent"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <QuantitySelector
            quantity={line.quantity}
            onChange={(q) => updateQuantity(product.id, q, line.color, line.size)}
          />
          <p className="text-sm font-semibold text-foreground sm:text-base">
            {formatPrice(product.price * line.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
