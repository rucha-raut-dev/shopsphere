"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SearchSuggestions from "@/components/SearchSuggestions";
import { useProductSuggestions } from "@/lib/useProductSuggestions";
import { cn } from "@/lib/utils";

// MobileMenu is never needed until someone actually taps the hamburger
// icon — on desktop it's never needed at all. Importing it normally would
// still bundle its code into every page's initial JS anyway, even for
// visitors who never open it. `next/dynamic` instead puts it in its own
// separate chunk that only gets fetched the first time it's rendered.
//
// `ssr: false` is the other half of this: it tells Next not to render
// MobileMenu's HTML on the server at all. That's not just an optimization
// here — it's necessary, because `ssr: false` is only valid inside a
// Client Component ("use client", which this file already is), never in a
// Server Component. A pure overlay like this one has nothing worth
// search engines indexing anyway, so skipping SSR for it is free.
const MobileMenu = dynamic(() => import("@/components/MobileMenu"), {
  ssr: false,
});

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About" },
];

const menuItemClass =
  "block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted";

export default function Navbar() {
  const { itemCount } = useCart();
  const { count } = useWishlist();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // MobileMenu only needs to exist in the DOM (and its lazy chunk only
  // needs to be fetched) once someone actually taps the hamburger icon —
  // before that, mounting it would pay for the dynamic import with
  // nothing to show for it. Once mounted, it stays mounted so `open`
  // toggling on/off still gets its slide-in/out CSS transition instead of
  // instantly appearing/disappearing.
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);

  const { results: suggestions, status: suggestionStatus } = useProductSuggestions(searchValue);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close either dropdown when clicking outside it or pressing Escape.
  useEffect(() => {
    if (!searchOpen && !accountOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchOpen && !searchRef.current?.contains(target)) setSearchOpen(false);
      if (accountOpen && !accountRef.current?.contains(target)) setAccountOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen, accountOpen]);

  // Focus the search input the moment the panel opens. This used to be a
  // plain `searchInputRef.current?.focus()`, but the panel was hidden with
  // Tailwind's `invisible` class (`visibility: hidden`) — and browsers
  // refuse to focus an element that's still visibility:hidden, even for a
  // single frame. That's what forced a second click to actually type.
  // Fix has two parts: (1) the panel is now hidden with opacity/pointer-events
  // instead of visibility (see the className below), which alone resolves
  // it, and (2) we still wait a frame here as a safety net for the browser
  // to finish applying the new styles before we call .focus().
  useEffect(() => {
    if (!searchOpen) return;
    const raf = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [searchOpen]);

  // A fresh query invalidates whatever was highlighted before.
  useEffect(() => {
    setActiveIndex(-1);
  }, [searchValue]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Enter with a suggestion highlighted (via arrow keys) jumps straight
    // to that product. Otherwise it falls back to a full search.
    const active = activeIndex >= 0 ? suggestions[activeIndex] : undefined;
    if (active) {
      router.push(`/products/${active.slug}`);
      setSearchValue("");
      setSearchOpen(false);
      return;
    }
    if (searchValue.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

  // Arrow keys move the highlight through the live suggestions; Enter is
  // handled by the form's onSubmit above (submitSearch reads activeIndex).
  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    }
  };

  const closeAccount = () => setAccountOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect width="64" height="64" rx="14" fill="#1F3A2E" />
            <text
              x="32"
              y="46"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="42"
              fontWeight="700"
              fill="#FAF9F6"
            >
              S
            </text>
            <circle cx="49" cy="15" r="5.5" fill="#C97B5A" />
          </svg>
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            Shop<span className="text-primary">Sphere</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute bottom-1 left-3 right-3 h-px scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div ref={searchRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((v) => !v);
                setAccountOpen(false);
              }}
              aria-label="Toggle search"
              aria-expanded={searchOpen}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                searchOpen
                  ? "scale-105 bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "text-foreground hover:scale-105 hover:bg-primary/10 hover:text-primary"
              )}
            >
              {searchOpen ? (
                <X className="h-[18px] w-[18px]" />
              ) : (
                <Search className="h-[18px] w-[18px]" />
              )}
            </button>

            <div
              className={cn(
                "absolute right-0 top-12 origin-top-right transition-all duration-200",
                // Hidden with opacity + pointer-events, NOT `invisible`
                // (visibility:hidden) — that's the actual fix for the
                // "have to click twice" bug. An element that's merely
                // transparent and unclickable can still be focused
                // programmatically; a visibility:hidden one cannot.
                searchOpen
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              )}
            >
              <div className="w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-lift ring-1 ring-primary/10 sm:w-96">
                <form
                  onSubmit={submitSearch}
                  className="flex items-center gap-2.5 border-b border-border px-4 py-3"
                >
                  <Search className="h-4 w-4 shrink-0 text-primary" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={onSearchKeyDown}
                    placeholder="Search for products..."
                    aria-label="Search products"
                    role="combobox"
                    aria-expanded={suggestions.length > 0}
                    aria-controls="navbar-search-results"
                    aria-activedescendant={
                      activeIndex >= 0 ? `search-suggestion-${activeIndex}` : undefined
                    }
                    tabIndex={searchOpen ? 0 : -1}
                    className="w-full border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                  />
                  <button
                    type="submit"
                    tabIndex={searchOpen ? 0 : -1}
                    aria-label="Search"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/40 transition-all duration-150 hover:scale-110 hover:shadow-md hover:shadow-primary/50 active:scale-95"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>

                <SearchSuggestions
                  query={searchValue}
                  results={suggestions}
                  status={suggestionStatus}
                  activeIndex={activeIndex}
                  onHover={setActiveIndex}
                  onNavigate={() => {
                    setSearchValue("");
                    setSearchOpen(false);
                  }}
                />

                {suggestions.length > 0 && (
                  <div className="flex items-center justify-center gap-3 border-t border-border bg-muted/50 px-4 py-2 text-[11px] text-muted-foreground">
                    <span><kbd className="rounded border border-border bg-card px-1 py-0.5 font-sans">↑↓</kbd> Navigate</span>
                    <span><kbd className="rounded border border-border bg-card px-1 py-0.5 font-sans">↵</kbd> Select</span>
                    <span><kbd className="rounded border border-border bg-card px-1 py-0.5 font-sans">Esc</kbd> Close</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${count} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <Heart className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label={`Shopping bag, ${itemCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {itemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          <div ref={accountRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setAccountOpen((v) => !v);
                setSearchOpen(false);
              }}
              aria-label={user ? `Account menu for ${user.name}` : "Account menu"}
              aria-expanded={accountOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              {user ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold uppercase text-primary-foreground">
                  {user.name.trim().charAt(0)}
                </span>
              ) : (
                <User className="h-[18px] w-[18px]" />
              )}
            </button>
            <div
              className={cn(
                "absolute right-0 top-12 w-52 origin-top-right rounded-xl border border-border bg-card p-2 shadow-lift transition-all duration-200",
                accountOpen
                  ? "visible scale-100 opacity-100"
                  : "pointer-events-none invisible scale-95 opacity-0"
              )}
              role="menu"
            >
              {user ? (
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              ) : (
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  Guest browsing
                </p>
              )}

              {user ? (
                <>
                  <Link href="/account" role="menuitem" className={menuItemClass} onClick={closeAccount}>
                    My Orders
                  </Link>
                  <Link href="/wishlist" role="menuitem" className={menuItemClass} onClick={closeAccount}>
                    My Wishlist
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className={menuItemClass}
                    onClick={() => {
                      signOut();
                      closeAccount();
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/account?mode=signin" role="menuitem" className={menuItemClass} onClick={closeAccount}>
                    Sign In
                  </Link>
                  <Link href="/account?mode=signup" role="menuitem" className={menuItemClass} onClick={closeAccount}>
                    Create Account
                  </Link>
                  <Link href="/wishlist" role="menuitem" className={menuItemClass} onClick={closeAccount}>
                    My Wishlist
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuMounted(true);
              setMobileOpen(true);
            }}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {mobileMenuMounted && (
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      )}
    </header>
  );
}