"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
      // `invisible` when closed removes the whole menu from the tab order
      // (transition on visibility too, so the fade-out still plays).
      className={cn(
        "fixed inset-0 z-[90] transition-[opacity,visibility] duration-300 md:hidden",
        open ? "visible pointer-events-auto opacity-100" : "invisible pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-background shadow-lift transition-transform duration-300",
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