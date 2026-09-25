# ShopSphere

A premium, modern e-commerce demo built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**.

ShopSphere is a frontend-focused project created to practice and demonstrate modern **Next.js and React concepts** using local/static data. It does not require a backend, database, authentication service, or paid APIs.

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Tech Stack

* **Next.js** — App Router, Server Components, Dynamic Routes, Metadata, Loading & Error States
* **React** — Components, Hooks, Context API, Client Components
* **TypeScript** — Type-safe data models, props, state, and utilities
* **Tailwind CSS** — Responsive and modern UI styling
* **LocalStorage** — Client-side persistence for cart, wishlist, and orders
* **Unsplash** — Product imagery

---

## Next.js Concepts Demonstrated

ShopSphere was built to practice a wide range of Next.js concepts, including:

* App Router
* File-system based routing
* Nested routes
* Dynamic routes
* `generateStaticParams`
* `generateMetadata`
* Server Components
* Client Components with `"use client"`
* Route redirects
* `loading.tsx`
* `error.tsx`
* `not-found.tsx`
* Dynamic `not-found` handling
* `next/image`
* Metadata
* Route navigation
* Context API
* Client-side state management
* LocalStorage persistence
* Hydration handling
* Responsive layouts
* Reusable component architecture

---

## Project Architecture

### Server and Client Components

Next.js Server Components are used by default.

Client Components are used only where browser-side interactivity is required, such as:

* Search
* Filters
* Sorting
* Shopping cart
* Wishlist
* Product gallery
* Forms
* Mobile navigation
* Toast notifications
* LocalStorage operations

This keeps the application structure aligned with the App Router architecture.

### Dynamic Routes

The project includes dynamic routes for products and categories:

```text
/products/[id]
/categories/[category]
/order-confirmation/[id]
```

Dynamic pages use:

* `generateStaticParams`
* `generateMetadata`
* Dynamic route parameters
* Custom not-found handling

---

## State Management

ShopSphere uses the **React Context API** for global client-side state.

### Cart

`CartContext` manages:

* Adding products
* Removing products
* Updating quantities
* Clearing the cart
* Cart totals

Cart data is persisted using:

```text
shopsphere-cart
```

### Wishlist

`WishlistContext` manages:

* Adding products to wishlist
* Removing products
* Checking wishlist status

Wishlist data is persisted using:

```text
shopsphere-wishlist
```

The application also includes hydration handling to prevent client/server mismatch issues when reading LocalStorage.

---

## Reusable Components

The project follows a reusable component-based architecture.

Examples include:

```text
ProductCard
ProductGrid
ProductGallery
FilterSidebar
SearchBar
SortDropdown
CartItem
QuantitySelector
WishlistButton
Toast
Newsletter
Hero
SectionHeading
```

These components are reused across multiple pages to keep the UI consistent and maintainable.

---

## Checkout Flow

The checkout process is completely frontend-based.

```text
Cart
  ↓
Checkout
  ↓
Shipping Form Validation
  ↓
Create Order
  ↓
Save Order to LocalStorage
  ↓
Clear Cart
  ↓
Order Confirmation
```

Orders are represented using the `Order` type from:

```text
lib/types.ts
```

Order utilities are located in:

```text
lib/orders.ts
```

Shipping and pricing rules are handled in:

```text
lib/pricing.ts
```

No real payment is processed.

---

## Routes

| Route                      | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `/`                        | Home page                                              |
| `/shop`                    | Full product catalog with search, filters, and sorting |
| `/products`                | Redirects to `/shop`                                   |
| `/products/[id]`           | Dynamic product detail page                            |
| `/categories`              | All product categories                                 |
| `/categories/[category]`   | Dynamic category products page                         |
| `/new-arrivals`            | Newest products                                        |
| `/cart`                    | Shopping cart                                          |
| `/checkout`                | Shipping form and order summary                        |
| `/order-confirmation/[id]` | Dynamic order confirmation page                        |
| `/wishlist`                | Saved products                                         |
| `/about`                   | Brand story, values, and statistics                    |
| `/contact`                 | Contact information and validated form                 |

---

## Data Architecture

All product and category information is stored locally.

```text
data/
├── products.ts
└── categories.ts
```

Shared TypeScript models are defined in:

```text
lib/types.ts
```

This keeps the project independent from external databases and APIs.

---

## Loading, Error & Not-Found States

The application includes dedicated UI states for better user experience:

```text
app/shop/loading.tsx
app/error.tsx
app/not-found.tsx
```

Dynamic product and category routes also handle invalid URLs using custom not-found pages.

---

## Images

Product images are rendered using Next.js's optimized:

```tsx
next/image
```

Images are currently sourced from **Unsplash** and configured through `next.config.js`.

For a production application, the image URLs can be replaced with locally hosted or production-ready assets.

---

## Project Limitations

ShopSphere is intentionally a frontend-only demo.

* No backend
* No database
* No external authentication
* No real payment processing
* No external product API
* Cart, wishlist, and orders use browser LocalStorage
* Orders are stored per browser/device

Because orders are stored locally, an order confirmation URL will only work on the browser/device where the order was created.

---

## Learning Purpose

This project was created as a practical way to learn and demonstrate **Next.js App Router concepts alongside React, TypeScript, and Tailwind CSS**.

The focus is on understanding:

* How Next.js routing works
* When to use Server vs Client Components
* Dynamic routes
* Metadata generation
* Loading and error handling
* Client-side state management
* Context API
* LocalStorage
* Form validation
* Reusable components
* Responsive UI architecture

---

## Future Improvements

Possible future enhancements include:

* Backend/API integration
* Database integration
* User authentication
* Real payment gateway
* Product reviews
* Server-side cart persistence
* Admin dashboard
* Real product search API
* Order management system

---

## License

This project is created for learning, practice, and portfolio purposes.
