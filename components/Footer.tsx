import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/new-arrivals", label: "New Arrivals" },
      { href: "/shop?sort=rating", label: "Best Sellers" },
      { href: "/categories", label: "Categories" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "Careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Help Center" },
      { href: "/contact", label: "Shipping" },
      { href: "/contact", label: "Returns" },
      { href: "/contact", label: "Privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <Link href="/" className="font-serif text-xl font-semibold text-foreground">
            Shop<span className="text-primary">Sphere</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Timeless style, thoughtful living. Curated products made for
            everyday, delivered with care.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media link"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-semibold text-foreground">{col.title}</h3>
            <ul className="space-y-2.5">
              {col.links.map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          <p>Built with Next.js, TypeScript &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
