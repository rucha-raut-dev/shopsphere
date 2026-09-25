import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// next/font self-hosts these at build time (no request to Google Fonts at
// runtime, no layout shift) and exposes each as a CSS variable so Tailwind's
// `font-sans` / `font-serif` utilities can reference them directly — see
// fontFamily in tailwind.config.ts.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ShopSphere | Discover Products You'll Love",
    template: "%s | ShopSphere",
  },
  description: SITE_DESCRIPTION,
  // The share image comes from app/opengraph-image.png and
  // app/twitter-image.png, which Next attaches automatically.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          {/*
            The @modal parallel slot. It renders alongside `children`, not
            instead of it — the page you were on stays mounted underneath,
            which is exactly what makes this feel like a modal instead of
            a navigation. app/@modal/default.tsx makes it render nothing
            for every route that isn't the intercepted quick-view page.
          */}
          {modal}
        </Providers>
      </body>
    </html>
  );
}