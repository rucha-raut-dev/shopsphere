"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Star,
  Users,
} from "lucide-react";
import { products } from "@/data/products";
import { discountPercent, formatPrice } from "@/lib/utils";

const DEADLINE_KEY = "shopsphere-sale-deadline";
const SALE_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const PROMO_CODE = "SPRING40";
const ROTATE_MS = 4000;

type TimeLeft = { hours: number; minutes: number; seconds: number };

// The deadline is stored in localStorage so it counts down consistently
// across reloads instead of resetting to 3 days every time the page loads.
function getDeadline(): number {
  try {
    const stored = window.localStorage.getItem(DEADLINE_KEY);
    const existing = stored ? Number(stored) : NaN;
    if (!Number.isNaN(existing) && existing > Date.now()) return existing;
  } catch {
    // storage unavailable, fall through to a fresh deadline
  }
  const fresh = Date.now() + SALE_DURATION_MS;
  try {
    window.localStorage.setItem(DEADLINE_KEY, String(fresh));
  } catch {
    // ignore, the countdown just won't persist across reloads
  }
  return fresh;
}

function splitTime(msLeft: number): TimeLeft {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function SaleBanner() {
  // undefined until mounted, so the server-rendered markup never shows a
  // countdown that depends on the visitor's clock (avoids a hydration mismatch).
  const [timeLeft, setTimeLeft] = useState<TimeLeft | undefined>(undefined);
  const [percentElapsed, setPercentElapsed] = useState(0);
  const [saleEnded, setSaleEnded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Real sale items pulled from the catalog (anything with an originalPrice),
  // sorted so the biggest discounts lead.
  const saleProducts = useMemo(
    () =>
      products
        .filter((p) => p.originalPrice && p.originalPrice > p.price)
        .sort(
          (a, b) =>
            (discountPercent(b.price, b.originalPrice) ?? 0) -
            (discountPercent(a.price, a.originalPrice) ?? 0)
        )
        .slice(0, 5),
    []
  );

  const maxDiscount = saleProducts.reduce(
    (max, p) => Math.max(max, discountPercent(p.price, p.originalPrice) ?? 0),
    0
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // A small, believable "recent activity" number — reseeds per page load,
  // purely presentational, no backend involved. Generated client-side only
  // (after mount) so the server-rendered HTML and the first client render
  // always agree — Math.random() in the initial render would otherwise
  // produce a hydration mismatch.
  const [recentBuyers, setRecentBuyers] = useState<number | undefined>(undefined);
  useEffect(() => {
    setRecentBuyers(8 + Math.floor(Math.random() * 19));
  }, []);

  useEffect(() => {
    const deadline = getDeadline();
    const start = deadline - SALE_DURATION_MS;
    const tick = () => {
      const msLeft = deadline - Date.now();
      setTimeLeft(splitTime(msLeft));
      setSaleEnded(msLeft <= 0);
      const elapsed = Math.min(
        100,
        Math.max(0, ((Date.now() - start) / SALE_DURATION_MS) * 100)
      );
      setPercentElapsed(elapsed);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Auto-rotate the featured sale product, pausing while the user is
  // hovering/interacting with the showcase.
  useEffect(() => {
    if (paused || saleProducts.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % saleProducts.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, saleProducts.length]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable (e.g. insecure context); the code is
      // still visible on screen for the visitor to copy manually.
    }
  };

  const goTo = (index: number) => {
    setActiveIndex(((index % saleProducts.length) + saleProducts.length) % saleProducts.length);
  };

  const active = saleProducts[activeIndex];
  const activeDiscount = active ? discountPercent(active.price, active.originalPrice) : null;

  return (
    <section className="relative overflow-hidden border-y border-border bg-gradient-to-br from-secondary/50 via-background to-accent/10">
      {/* Ambient decorative blobs — slow, subtle, purely atmospheric. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 animate-blob rounded-full bg-primary/10 blur-3xl [animation-delay:-6s]"
      />

      <div className="container-page relative grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-16">
        <div>
          <p className="mb-3 inline-flex animate-fade-in-up items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Limited Time Offer
          </p>

          <h2 className="animate-fade-in-up font-serif text-3xl font-medium text-foreground [animation-delay:80ms] sm:text-4xl lg:text-[2.75rem]">
            Spring Sale is Live
          </h2>
          <p className="mt-3 max-w-md animate-fade-in-up text-sm text-muted-foreground [animation-delay:160ms]">
            Enjoy up to {maxDiscount || 40}% off on selected collections across
            fashion, accessories and home essentials — for a limited time
            only.
          </p>

          {saleEnded ? (
            <div className="mt-5 max-w-sm animate-fade-in-up rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              This sale has ended — new deals are on the way. Check back soon!
            </div>
          ) : (
            <div className="mt-5 max-w-sm animate-fade-in-up [animation-delay:220ms]">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 shadow-soft backdrop-blur"
                aria-live="polite"
              >
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span className="font-serif text-sm font-semibold tabular-nums text-foreground">
                  {timeLeft === undefined
                    ? "--:--:--"
                    : `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  left
                </span>
              </div>

              {/* Progress bar: visualizes how much of the sale window has
                  elapsed, reinforcing the urgency the numbers alone don't. */}
              <div className="mt-3 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-linear"
                  style={{ width: `${percentElapsed}%` }}
                />
              </div>
            </div>
          )}

          {/* Lightweight social proof — small and tasteful, not a hard sell. */}
          <div className="mt-4 flex animate-fade-in-up items-center gap-1.5 text-xs text-muted-foreground [animation-delay:260ms]">
            <Users className="h-3.5 w-3.5 text-accent" />
            <span>
              {recentBuyers === undefined ? "Several" : recentBuyers} people bought sale
              items in the last hour
            </span>
          </div>

          <div className="mt-6 flex flex-wrap animate-fade-in-up items-center gap-3 [animation-delay:320ms]">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Explore Deals
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <button
              type="button"
              onClick={copyCode}
              aria-label={`Copy promo code ${PROMO_CODE}`}
              className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent/50 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : PROMO_CODE}
            </button>
          </div>
        </div>

        {/* Interactive lifestyle showcase: a large rotating photo of the
            active sale product, with a floating discount badge and a
            floating "shop now" chip — echoes an editorial sale banner while
            staying data-driven and clickable. */}
        {active ? (
          <div
            className="mx-auto w-full max-w-[280px] animate-scale-in [animation-delay:120ms] sm:max-w-xs"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Photo frame — everything that overlaps the photo (chips,
                badge, arrows) is positioned relative to THIS element, so its
                own box height stays just the photo's height. */}
            <div className="group relative">
              <Link
                href={`/products/${active.slug}`}
                aria-label={`Shop ${active.name}`}
                className="relative block aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lift"
              >
                <Image
                  key={active.id}
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="(min-width: 1024px) 22vw, 70vw"
                  className="animate-ken-burns object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>

              {/* Floating rating chip, top-left, bobbing gently. */}
              <div className="absolute -left-2 -top-2 animate-float rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-lift">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {active.rating.toFixed(1)}
                </span>
              </div>

              {/* Floating overall-discount badge, top-right, overlapping the photo. */}
              <div className="absolute -right-2 -top-3 animate-float [animation-delay:-1.5s]">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lift sm:h-16 sm:w-16">
                  <div className="absolute inset-[-5px] animate-[spin_14s_linear_infinite] rounded-full border-2 border-dashed border-accent/40" />
                  <div className="text-center leading-tight">
                    <p className="text-[7px] font-semibold uppercase tracking-wide">Up to</p>
                    <p className="font-serif text-base font-bold sm:text-lg">
                      {maxDiscount || 40}%
                    </p>
                    <p className="text-[7px] font-semibold uppercase tracking-wide">Off</p>
                  </div>
                </div>
              </div>

              {saleProducts.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous sale item"
                    onClick={() => goTo(activeIndex - 1)}
                    className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground opacity-0 shadow-soft backdrop-blur transition-opacity duration-200 hover:bg-card group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next sale item"
                    onClick={() => goTo(activeIndex + 1)}
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground opacity-0 shadow-soft backdrop-blur transition-opacity duration-200 hover:bg-card group-hover:opacity-100"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>

            {/* Info card — normal document flow (not absolute), pulled up
                slightly to overlap the photo for a "floating" look without
                breaking the section's layout or getting clipped. */}
            <div className="relative z-10 -mt-5 mx-2 flex items-center justify-between gap-2 rounded-2xl border border-border bg-card/95 px-3.5 py-2.5 shadow-lift backdrop-blur">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                  {active.name}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground sm:text-sm">
                    {formatPrice(active.price)}
                  </span>
                  {active.originalPrice && (
                    <span className="text-[11px] text-muted-foreground line-through">
                      {formatPrice(active.originalPrice)}
                    </span>
                  )}
                  {activeDiscount && (
                    <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-semibold text-accent">
                      -{activeDiscount}%
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/products/${active.slug}`}
                className="shrink-0 rounded-full bg-foreground/95 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary"
              >
                Shop now
              </Link>
            </div>

            {saleProducts.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-1.5">
                {saleProducts.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-label={`Show ${p.name}`}
                    aria-current={i === activeIndex}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-border hover:bg-accent/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative mx-auto h-40 w-40 animate-scale-in sm:h-48 sm:w-48">
            <div className="absolute inset-[-10px] animate-[spin_16s_linear_infinite] rounded-full border-2 border-dashed border-accent/30" />
            <div className="absolute inset-0 animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full bg-accent/40" />
            <Link
              href="/shop"
              aria-label="Shop the sale"
              className="group absolute inset-0 flex items-center justify-center rounded-full border-8 border-accent/15 bg-accent text-white shadow-lift transition-transform duration-300 hover:scale-105 hover:rotate-3"
            >
              <div className="text-center">
                <p className="text-3xl font-bold sm:text-4xl">40%</p>
                <p className="text-xs font-semibold uppercase tracking-wide">Off</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.92); opacity: 0.5; }
          70% { transform: scale(1.18); opacity: 0; }
          100% { transform: scale(1.18); opacity: 0; }
        }
      `}</style>
    </section>
  );
}