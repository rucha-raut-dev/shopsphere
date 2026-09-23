"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine } from "@/lib/types";
import { products } from "@/data/products";
import { useToast } from "@/context/ToastContext";

const STORAGE_KEY = "shopsphere-cart";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addToCart: (productId: string, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function sameLine(a: CartLine, productId: string, color?: string, size?: string) {
  return a.productId === productId && a.color === color && a.size === size;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable, ignore
    }
  }, [lines, isHydrated]);

  const addToCart = (productId: string, quantity = 1, color?: string, size?: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, productId, color, size));
      if (existing) {
        return prev.map((l) =>
          sameLine(l, productId, color, size)
            ? { ...l, quantity: l.quantity + quantity }
            : l
        );
      }
      return [...prev, { productId, quantity, color, size }];
    });
    showToast("Added to cart", "success");
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, productId, color, size)));
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    setLines((prev) =>
      prev
        .map((l) =>
          sameLine(l, productId, color, size) ? { ...l, quantity } : l
        )
        .filter((l) => l.quantity > 0)
    );
  };

  const clearCart = () => setLines([]);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const product = products.find((p) => p.id === l.productId);
        return sum + (product ? product.price * l.quantity : 0);
      }, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
