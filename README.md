# ShopSphere

A premium, modern e-commerce demo built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS** — using only local/static data, with no backend, database, or paid APIs.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech & Architecture

- **Next.js App Router** — server components by default, client components (`"use client"`) only where interactivity is required (search, filters, cart, wishlist, gallery, forms, mobile menu).
- **Dynamic routes** — `/products/[id]` and `/categories/[category]`, with `generateStaticParams` and `generateMetadata`.
- **State management** — React Context for `CartContext` and `WishlistContext`, persisted to `localStorage` (`shopsphere-cart`, `shopsphere-wishlist`) with careful hydration handling to avoid mismatch errors.
- **Reusable components** — see `components/` (ProductCard, ProductGrid, ProductGallery, FilterSidebar, SearchBar, SortDropdown, CartItem, QuantitySelector, WishlistButton, Toast, Newsletter, Hero, SectionHeading, etc).
- **Local data** — all products and categories live in `data/products.ts` and `data/categories.ts`, typed via `lib/types.ts`.
- **Loading / error / not-found states** — `app/shop/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`, plus dedicated not-found pages for invalid products and categories.
- **Images** — `next/image` throughout, sourced from Unsplash (configured in `next.config.js`).

## Routes

```
/                       Home
/shop                   Full catalog with search, filters, sorting
/products               Redirects to /shop
/products/[id]          Product detail page (dynamic route)
/categories             All categories
/categories/[category]  Products within a category (dynamic route)
/new-arrivals           Newest products
/cart                   Shopping cart (client-side state)
/wishlist               Saved products (client-side state)
/about                  Brand story, values, stats
/contact                Contact info + validated form
```

## Notes

- No backend, database, or external auth — cart/wishlist/newsletter/contact all work entirely on the client.
- Product images are pulled from Unsplash's CDN; swap `data/products.ts` image URLs for your own assets in production.
