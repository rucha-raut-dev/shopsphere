"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductCatalogProvider } from "@/context/ProductCatalogContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AuthProvider>
          <ProductCatalogProvider>
            <CartProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </CartProvider>
          </ProductCatalogProvider>
        </AuthProvider>
      </ToastProvider>
    </SessionProvider>
  );
}