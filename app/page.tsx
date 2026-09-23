import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import SaleBanner from "@/components/SaleBanner";
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

      <SaleBanner />

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