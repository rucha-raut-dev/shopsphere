"use server";

import type { Review } from "@/lib/types";
import type { ReviewFormState } from "./reviews.types";

function createReviewId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `RV-${time}${rand}`;
}

/**
 * Server Action for submitting a product review. Bound with the product id
 * via `.bind(null, productId)` on the client — see ProductReviews.tsx.
 *
 * `name` arrives from a hidden input when the visitor is signed in (their
 * account name — never trust a display name the client could otherwise
 * tamper with in a more security-sensitive app) or a visible field for a
 * guest. `rating` arrives from the star-picker's hidden input.
 *
 * This function has an artificial delay so the "still saving" window is
 * long enough to actually see the optimistic UI in action. Without that
 * gap, the real server round trip would usually be too fast to notice the
 * difference between "optimistic" and "confirmed" at all.
 */
export async function submitReview(
  productId: string,
  formData: FormData
): Promise<ReviewFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);

  const fieldErrors: ReviewFormState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    fieldErrors.rating = "Please select a star rating.";
  }
  if (comment.length < 10) fieldErrors.comment = "Please write at least 10 characters.";
  if (comment.length > 500) fieldErrors.comment = "Keep it under 500 characters.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  // Simulate real server work (spam/profanity checks, a database write).
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const review: Review = {
    id: createReviewId(),
    productId,
    name,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

  return { status: "success", fieldErrors: {}, review };
}