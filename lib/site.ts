export const SITE_NAME = "ShopSphere";

export const SITE_DESCRIPTION =
  "ShopSphere is a premium shopping destination for thoughtfully designed fashion, footwear, accessories, home and beauty essentials.";

// Absolute base URL used for social-share images, the sitemap and robots.txt.
// Priority: an explicit NEXT_PUBLIC_SITE_URL (set this for a custom domain),
// then Vercel's production domain, then localhost for local development.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();