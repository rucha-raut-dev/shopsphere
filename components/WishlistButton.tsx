"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

export default function WishlistButton({
  productId,
  variant = "icon",
}: {
  productId: string;
  variant?: "icon" | "pill";
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(productId);

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={() => toggleWishlist(productId)}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors",
          active
            ? "border-accent bg-accent/10 text-accent"
            : "border-border bg-card text-foreground hover:border-foreground/30"
        )}
      >
        <Heart className={cn("h-4 w-4 transition-transform", active && "scale-110 fill-accent text-accent")} />
        {active ? "Wishlisted" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-soft backdrop-blur transition-transform hover:scale-105"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 text-foreground transition-colors",
          active && "fill-accent text-accent"
        )}
      />
    </button>
  );
}
