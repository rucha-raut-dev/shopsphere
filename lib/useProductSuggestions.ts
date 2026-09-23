"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

export type SuggestionStatus = "idle" | "loading" | "done" | "error";

/**
 * Debounced client-side fetch of live search suggestions from our own
 * Route Handler (GET /api/products?q=...). Pulled out into a hook so both
 * the navbar's keyboard handling (which result is highlighted, what Enter
 * should do) and the dropdown's rendering share the exact same results
 * instead of each firing their own request.
 */
export function useProductSuggestions(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [status, setStatus] = useState<SuggestionStatus>("idle");

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    const controller = new AbortController();

    // Debounce: don't hit the network on every single keystroke, only once
    // typing pauses for a moment.
    const timer = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(trimmed)}&limit=5`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Search request failed");
          return res.json();
        })
        .then((data: { products: Product[] }) => {
          setResults(data.products);
          setStatus("done");
        })
        .catch((err) => {
          if (err.name !== "AbortError") setStatus("error");
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { results, status };
}
