import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, HeartHandshake, Sparkles, Gem } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about ShopSphere's story, mission and values.",
};

const VALUES = [
  {
    icon: Gem,
    title: "Quality You Can Trust",
    body: "Every product is sourced and tested for durability, so what you buy lasts well beyond the season.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    body: "Our support team is here whenever you need help — before, during and after your purchase.",
  },
  {
    icon: Leaf,
    title: "Sustainable Choices",
    body: "We favor materials and partners that reduce environmental impact without compromising on style.",
  },
  {
    icon: Sparkles,
    title: "Thoughtful Curation",
    body: "Nothing lands in our catalog by accident — every piece is chosen with intention and care.",
  },
];

const STATS = [
  { label: "Happy Customers", value: "48K+" },
  { label: "Products Curated", value: "500+" },
  { label: "Countries Shipped To", value: "24" },
  { label: "Average Rating", value: "4.8/5" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Our Story
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium text-foreground sm:text-4xl">
              Thoughtful products, made for everyday living.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              ShopSphere started with a simple idea: shopping for the things
              you use every day shouldn&apos;t mean choosing between quality,
              style and price. We spend our time finding pieces that hold up
              — in your closet, your home and your routine — so you don&apos;t
              have to sort through the noise.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              What began as a small curated catalog has grown into a
              destination trusted by tens of thousands of customers who share
              our belief that good design and everyday life aren&apos;t
              mutually exclusive.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-lift">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop"
              alt="ShopSphere studio and product styling"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-2xl font-medium text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="container-page py-14 sm:py-20">
          <div className="mb-10 max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Why ShopSphere
            </p>
            <h2 className="mt-2 font-serif text-2xl font-medium text-foreground sm:text-3xl">
              What we stand for
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 text-center sm:py-20">
        <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
          Ready to find your next favorite thing?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Explore the full catalog and discover products designed to fit
          seamlessly into your everyday life.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Shop Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
