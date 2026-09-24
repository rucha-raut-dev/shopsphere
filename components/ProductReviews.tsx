"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Star } from "lucide-react";
import type { Review } from "@/lib/types";
import { getReviewsForProduct, saveReview } from "@/lib/reviews";
import { submitReview } from "@/app/actions/reviews";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const PREVIEW_COUNT = 3;

function initialsOf(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StarRow({ value, size = "h-3.5 w-3.5" }: { value: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5 text-warning">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn(size, i < value ? "fill-warning" : "fill-transparent")} />
      ))}
    </div>
  );
}

/**
 * Optimistic UI, built by hand.
 *
 * React 19 has a `useOptimistic` hook that does exactly this: show a
 * pending update immediately, then reconcile it once the real server
 * response comes back (or quietly drop it if the request fails). This
 * project runs React 18.3 (the version Next.js 14 depends on), where that
 * hook doesn't exist yet — so this component does the same thing manually:
 *
 *   1. `reviews`  — the CONFIRMED list (server has validated these).
 *   2. `pending`  — reviews shown immediately on submit, before the server
 *                   has responded. Purely visual; never persisted.
 *   3. On success — the pending entry is removed and the real, server-
 *      returned review is added to `reviews` instead (and saved to
 *      localStorage, this demo's only "database").
 *   4. On error   — the pending entry is just removed (the "revert" a
 *      failed optimistic update needs — useOptimistic does this for you
 *      automatically; here you do it by hand).
 */
export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pending, setPending] = useState<Review[]>([]);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ name?: string; rating?: string; comment?: string; form?: string }>({});
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [comment, setComment] = useState("");
  const [showAll, setShowAll] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setReviews(getReviewsForProduct(productId));
  }, [productId]);

  const displayed = useMemo(() => [...pending, ...reviews], [pending, reviews]);
  const visible = showAll ? displayed : displayed.slice(0, PREVIEW_COUNT);
  const avgRating = displayed.length
    ? displayed.reduce((sum, r) => sum + r.rating, 0) / displayed.length
    : 0;

  const handleSubmit = (formData: FormData) => {
    // Signed-in visitors post under their real account name — that field
    // is a hidden input (see below) so there's nothing for them to type or
    // accidentally change; a guest still gets a free-text name field.
    const name = (user ? user.name : guestName).trim();
    const submittedRating = rating;
    const submittedComment = comment.trim();

    const optimisticReview: Review = {
      id: `temp-${Date.now()}`,
      productId,
      name: name || "You",
      rating: submittedRating,
      comment: submittedComment,
      createdAt: new Date().toISOString(),
    };

    startTransition(async () => {
      setPending((p) => [optimisticReview, ...p]);
      setErrors({});

      const result = await submitReview(productId, formData);

      setPending((p) => p.filter((r) => r.id !== optimisticReview.id));

      if (result.status === "success" && result.review) {
        saveReview(result.review);
        setReviews((r) => [result.review!, ...r]);
        setRating(0);
        setComment("");
        setGuestName("");
        formRef.current?.reset();
      } else {
        setErrors({ ...result.fieldErrors, form: result.formError });
      }
    });
  };

  return (
    <section className="mt-14 border-t border-border pt-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg font-medium text-foreground">Customer Reviews</h2>
        {displayed.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <StarRow value={Math.round(avgRating)} />
            <span>{avgRating.toFixed(1)} · {displayed.length}</span>
          </div>
        )}
      </div>

      {/* Compact composer — one row, no separate "name" field to fill when signed in */}
      <form ref={formRef} action={handleSubmit} className="mt-4 rounded-xl border border-border bg-card p-3.5">
        <input type="hidden" name="rating" value={rating} />
        {user && <input type="hidden" name="name" value={user.name} />}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {user ? (
              <span>
                Posting as <span className="font-medium text-foreground">{user.name}</span>
              </span>
            ) : (
              <input
                type="text"
                name="name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your name"
                className="w-28 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary"
              />
            )}
          </div>

          <div
            className="flex items-center gap-0.5"
            onMouseLeave={() => setHoverRating(0)}
            role="radiogroup"
            aria-label="Rating"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => setRating(star)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-4 w-4 text-warning transition-colors",
                    (hoverRating || rating) >= star ? "fill-warning" : "fill-transparent"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <textarea
          name="comment"
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts on this product..."
          className="mt-2.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary"
        />

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-accent">
            {errors.name || errors.rating || errors.comment || errors.form || "\u00A0"}
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isPending ? "Posting..." : "Post Review"}
          </button>
        </div>
      </form>

      {displayed.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          No reviews yet. Be the first to share your thoughts.
        </p>
      ) : (
        <>
          <ul className="mt-5 divide-y divide-border">
            {visible.map((review) => {
              const isOptimistic = review.id.startsWith("temp-");
              return (
                <li key={review.id} className={cn("flex gap-3 py-3.5", isOptimistic && "opacity-60")}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initialsOf(review.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <p className="text-sm font-medium text-foreground">{review.name}</p>
                      <StarRow value={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        {isOptimistic ? "Posting…" : timeAgo(review.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {displayed.length > PREVIEW_COUNT && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              {showAll ? "Show less" : `Show all ${displayed.length} reviews`}
            </button>
          )}
        </>
      )}
    </section>
  );
}