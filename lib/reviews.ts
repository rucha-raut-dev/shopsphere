import type { Review } from "@/lib/types";

const STORAGE_KEY = "shopsphere-reviews";

// DEMO STORE: like orders and accounts elsewhere in this app, reviews live
// in this browser's localStorage only — there's no shared database, so
// nobody else actually sees the reviews you leave. These helpers touch
// localStorage, so only ever call them from client code (event handlers or
// useEffect), never during server rendering.

export function createReviewId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `RV-${time}${rand}`;
}

function getAllReviews(): Review[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Review[]) : [];
  } catch {
    return [];
  }
}

// Newest first.
export function getReviewsForProduct(productId: string): Review[] {
  return getAllReviews()
    .filter((r) => r.productId === productId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveReview(review: Review): boolean {
  try {
    const all = getAllReviews();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([review, ...all]));
    return true;
  } catch {
    return false;
  }
}