import type { Review } from "@/lib/types";

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  fieldErrors: { name?: string; rating?: string; comment?: string };
  formError?: string;
  // Present only on success — the server-validated review to persist and display.
  review?: Review;
};

export const REVIEW_INITIAL_STATE: ReviewFormState = {
  status: "idle",
  fieldErrors: {},
};