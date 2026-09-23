import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

// GET /api/products
// GET /api/products?q=shirt
// GET /api/products?category=fashion
// GET /api/products?q=shirt&limit=5
//
// This is a real HTTP endpoint: anything that can make a request — a
// browser fetch(), curl, a future mobile app, a different frontend
// entirely — can call it. That's the difference from just importing
// `products` from data/products.ts, which only works for code that runs
// inside this Next.js build.
//
// Today `products` is a static array, so this route just filters an
// in-memory list. If this ever became a real database, this file is the
// *only* place that would need to change — every caller below still just
// does `fetch("/api/products?...")` and gets JSON back either way.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const category = searchParams.get("category");
  const limitParam = searchParams.get("limit");
  const limit = limitParam
    ? Math.max(1, Math.min(50, Number(limitParam) || 0))
    : undefined;

  let results = products;

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  const total = results.length;
  if (limit) results = results.slice(0, limit);

  return NextResponse.json({ products: results, total });
}
