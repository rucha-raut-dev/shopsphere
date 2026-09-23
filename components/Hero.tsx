import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";

export default function Hero() {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="animate-fade-in-up">
          <p className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            New Season Collection
          </p>
          <h1 className="font-serif text-4xl font-medium leading-[1.1] text-foreground sm:text-5xl lg:text-[3.25rem]">
            Discover pieces made
            <br />
            for <span className="italic text-primary">everyday living.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground">
            Thoughtfully designed products that bring style, quality and
            simplicity into your daily routine — curated and delivered to
            your door.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-primary-light"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/new-arrivals"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-transparent px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-white"
            >
              Explore New Arrivals
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 border-t border-border/70 pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" />
              Free shipping over $50
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Secure checkout
            </div>
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted shadow-lift sm:aspect-[5/6]">
            <Image
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZhc2hpb258ZW58MHx8MHx8fDA%3D%3D"
              alt="Model wearing a curated ShopSphere outfit"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden w-52 rounded-2xl border border-border bg-card p-4 shadow-lift sm:block">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200&q=80&auto=format&fit=crop"
                  alt="Structured Canvas Tote"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Canvas Tote</p>
                <p className="text-sm font-semibold text-primary">$59.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
