"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

/**
 * Live "search as you type" suggestions for the navbar search box.
 *
 * This is a genuine client-side fetch, unlike the /shop page (which is a
 * Server Component that imports `products` directly — no network round
 * trip needed there). Here we're reacting to keystrokes in the browser
 * after the page has already loaded, so a real HTTP request to our own
 * Route Handler is the right tool: GET /api/products?q=...
 */
export default function SearchSuggestions({
  query,
  onNavigate,
}: {
  query: string;
  onNavigate: () => void;
}) {
  const [results, setResults] = useState<Product[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

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

  if (query.trim().length < MIN_QUERY_LENGTH) return null;

  return (
    <div className="max-h-80 divide-y divide-border overflow-y-auto border-t border-border">
      {status === "loading" && (
        <p className="px-4 py-3 text-xs text-muted-foreground">Searching…</p>
      )}
      {status === "error" && (
        <p className="px-4 py-3 text-xs text-muted-foreground">
          Couldn&apos;t load suggestions. Press Enter to search anyway.
        </p>
      )}
      {status === "done" && results.length === 0 && (
        <p className="px-4 py-3 text-xs text-muted-foreground">No products found.</p>
      )}
      {results.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={product.image} alt={product.name} fill sizes="40px" className="object-cover" />
          </div>
          <p className="min-w-0 flex-1 truncate text-sm text-foreground">{product.name}</p>
          <p className="shrink-0 text-xs font-medium text-muted-foreground">
            {formatPrice(product.price)}
          </p>
        </Link>
      ))}
    </div>
  );
}
