import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import Newsletter from "@/components/Newsletter";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { Headphones, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

export default function HomePage() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="border-b border-border">
        <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {[
            { icon: Truck, label: "Free Shipping", sub: "On orders over $50" },
            { icon: ShieldCheck, label: "Secure Payment", sub: "100% protected" },
            { icon: RefreshCcw, label: "Easy Returns", sub: "30-day return" },
            { icon: Headphones, label: "24/7 Support", sub: "We're here to help" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <SectionHeading
          eyebrow="Shop by Category"
          title="Find what you're looking for"
          actionHref="/categories"
          actionLabel="Browse all categories"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="container-page grid items-center gap-8 py-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              Limited Time Offer
            </p>
            <h2 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
              Spring Sale is Live
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Enjoy up to 40% off on selected collections across fashion,
              accessories and home essentials — for a limited time only.
            </p>
            <a
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Explore Deals
            </a>
          </div>
          <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-accent/15 bg-accent text-white shadow-lift sm:h-48 sm:w-48">
            <div className="text-center">
              <p className="text-3xl font-bold sm:text-4xl">40%</p>
              <p className="text-xs font-semibold uppercase tracking-wide">Off</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <SectionHeading
          eyebrow="Curated Picks"
          title="Featured Products"
          actionHref="/shop"
          actionLabel="View all products"
        />
        <div className="mt-8">
          <ProductGrid products={featured} />
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="container-page pb-14 sm:pb-20">
          <SectionHeading
            eyebrow="Just In"
            title="New Arrivals"
            actionHref="/new-arrivals"
            actionLabel="View all new arrivals"
          />
          <div className="mt-8">
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}