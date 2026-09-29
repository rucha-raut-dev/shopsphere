"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/types";

type ProductCatalogValue = {
  products: Product[];
  isLoading: boolean;
};

const ProductCatalogContext = createContext<ProductCatalogValue>({
  products: [],
  isLoading: true,
});

// Fetches the catalog once, from the same /api/products route external
// callers use, and shares it with every client component below. Server
// components don't need this — they call lib/product-queries.ts directly.
export function ProductCatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .catch(() => {
        // leave products empty; components below already handle "not found"
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProductCatalogContext.Provider value={{ products, isLoading }}>
      {children}
    </ProductCatalogContext.Provider>
  );
}

export function useProductCatalog(): ProductCatalogValue {
  return useContext(ProductCatalogContext);
}