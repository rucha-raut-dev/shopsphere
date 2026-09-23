"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="container-page py-10">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4 text-primary-foreground">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-medium sm:text-2xl">
                Stay in the loop.
              </h2>
              <p className="mt-1 max-w-md text-sm text-primary-foreground/75">
                Get updates on new arrivals, special collections and
                exclusive offers.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="flex w-full items-center gap-2 rounded-full bg-white/15 px-5 py-3.5 text-sm font-medium text-primary-foreground lg:w-auto">
              <CheckCircle2 className="h-4 w-4" />
              You&apos;re subscribed! Welcome to the circle.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full lg:w-auto" noValidate>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
                <div className="flex-1 sm:w-72">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-full border-0 bg-white px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-white"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Subscribe
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs font-medium text-warning" role="alert">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
