"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Shell for a route rendered inside the `@modal` parallel slot (see
 * app/@modal/(.)products/[id]/page.tsx). Closing it calls `router.back()`
 * rather than a local "isOpen" state — because this "modal" is a real route
 * the browser's URL bar actually changed to. Going back is what makes the
 * URL (and the underlying page you were quick-viewing from) revert too.
 */
export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const close = () => router.back();

  // Escape closes it, and scrolling the page behind a modal is never what
  // you want, so lock it while this is open.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-card p-5 shadow-lift sm:rounded-2xl sm:p-6">
        <button
          type="button"
          onClick={close}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}