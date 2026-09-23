"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import MobileMenu from "@/components/MobileMenu";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { count } = useWishlist();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0 font-serif text-xl font-semibold tracking-tight text-foreground">
          Shop<span className="text-primary">Sphere</span>
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
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Toggle search"
              aria-expanded={searchOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
            </button>
            <div
              className={cn(
                "absolute right-0 top-12 origin-top-right transition-all duration-200",
                searchOpen
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              )}
            >
              <form
                onSubmit={submitSearch}
                className="flex w-72 items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-4 shadow-lift"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus={searchOpen}
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
              </form>
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

          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              aria-label="Account menu"
              aria-expanded={accountOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <User className="h-[18px] w-[18px]" />
            </button>
            <div
              className={cn(
                "absolute right-0 top-12 w-48 origin-top-right rounded-xl border border-border bg-card p-2 shadow-lift transition-all duration-200",
                accountOpen
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              )}
              role="menu"
            >
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                Guest browsing
              </p>
              <button
                type="button"
                role="menuitem"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                onClick={() => setAccountOpen(false)}
              >
                Sign In
              </button>
              <button
                type="button"
                role="menuitem"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                onClick={() => setAccountOpen(false)}
              >
                Create Account
              </button>
              <Link
                href="/wishlist"
                role="menuitem"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                onClick={() => setAccountOpen(false)}
              >
                My Wishlist
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
