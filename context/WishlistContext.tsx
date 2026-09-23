"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useToast } from "@/context/ToastContext";

const STORAGE_KEY = "shopsphere-wishlist";

type WishlistContextValue = {
  productIds: string[];
  count: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isHydrated: boolean;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProductIds(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    } catch {
      // ignore
    }
  }, [productIds, isHydrated]);

  const isWishlisted = (productId: string) => productIds.includes(productId);

  const toggleWishlist = (productId: string) => {
    setProductIds((prev) => {
      if (prev.includes(productId)) {
        showToast("Removed from wishlist", "info");
        return prev.filter((id) => id !== productId);
      }
      showToast("Added to wishlist", "success");
      return [...prev, productId];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setProductIds((prev) => prev.filter((id) => id !== productId));
  };

  const count = useMemo(() => productIds.length, [productIds]);

  return (
    <WishlistContext.Provider
      value={{ productIds, count, isWishlisted, toggleWishlist, removeFromWishlist, isHydrated }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
