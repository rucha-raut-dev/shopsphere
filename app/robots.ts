import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Private pages (checkout, account, receipts) opt out with a `noindex` meta tag
// instead of a Disallow rule: crawlers must be able to fetch a page to see its
// noindex, and blocking it here would hide that instruction.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}