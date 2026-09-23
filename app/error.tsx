"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center justify-center py-28 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <AlertTriangle className="h-7 w-7 text-accent" />
      </div>
      <h1 className="font-serif text-2xl font-medium text-foreground">
        Something went wrong.
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        We couldn&apos;t load this section right now. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        Try Again
      </button>
    </div>
  );
}
