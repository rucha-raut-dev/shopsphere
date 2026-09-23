"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const linkClass =
  "rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [searchValue, setSearchValue] = useState("");

  // Lock background scroll while the menu is open, so the page behind can't
  // move/scroll underneath the (partially transparent) backdrop — that
  // movement is what was reading as page content "mixing" with the menu.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSearchValue("");
    onClose();
  };

  return (
    <div
      // No opacity fade on this outer wrapper — it used to fade the whole
      // menu in together, which meant the "solid" white panel was briefly
      // semi-transparent too, letting the page behind show through and
      // overlap with the menu's own text. Only the backdrop fades now; the
      // panel is always fully opaque and just slides in via transform.
      // `visible`/`invisible` still toggles instantly (no transition on it)
      // so closed menu items are removed from the keyboard tab order.
      className={cn(
        "fixed inset-0 z-[90] h-dvh w-screen md:hidden",
        open ? "visible pointer-events-auto" : "invisible pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          // h-dvh instead of h-full: an explicit height (100% of the
          // *dynamic* viewport) that doesn't depend on any ancestor's
          // resolved height, which is more robust across browsers/DevTools
          // device emulation than a percentage-height chain.
          "absolute right-0 top-0 flex h-dvh w-[72%] max-w-xs flex-col overflow-hidden bg-background shadow-lift transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="font-serif text-lg font-semibold text-foreground">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submitSearch} className="px-4 pt-4" role="search">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for products..."
              aria-label="Search products"
              className="w-full border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus:ring-0"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Go
            </button>
          </div>
        </form>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border px-3 py-4">
          {user ? (
            <>
              <p className="truncate px-3 pb-2 text-xs text-muted-foreground">
                Signed in as {user.email}
              </p>
              <Link href="/account" onClick={onClose} className={cn(linkClass, "block")}>
                My Orders
              </Link>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className={cn(linkClass, "block w-full text-left")}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/account?mode=signin" onClick={onClose} className={cn(linkClass, "block")}>
                Sign In
              </Link>
              <Link href="/account?mode=signup" onClick={onClose} className={cn(linkClass, "block")}>
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}