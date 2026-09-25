import { ImageResponse } from "next/og";
import { getCachedProductBySlug } from "@/lib/products-cache";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

/**
 * A dynamic per-product share image, generated on demand (and cached by
 * Next.js afterwards) instead of the one static app/opengraph-image.png
 * every other page falls back to. When a product link gets pasted into
 * iMessage, Slack, Twitter/X, etc., the preview card now actually shows
 * that product's photo, name and price — not a generic ShopSphere banner.
 *
 * This file follows a naming convention Next.js recognizes automatically:
 * putting `opengraph-image.tsx` inside app/products/[id]/ means it's used
 * for every route under that segment, with `params` passed in the same
 * shape as the page itself gets them.
 */

export const alt = "ShopSphere product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-generate one of these for every product at build time, same as the
// page itself does — see generateStaticParams in app/products/[id]/page.tsx.
export function generateStaticParams() {
  return products.map((p) => ({ id: p.slug }));
}

export default async function ProductOpengraphImage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getCachedProductBySlug(params.id);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1F3A2E",
            color: "#FAF9F6",
            fontSize: 64,
            fontFamily: "sans-serif",
          }}
        >
          ShopSphere
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAF9F6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "45%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F1EFE9",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            width={520}
            height={630}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>

        <div
          style={{
            width: "55%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#C97B5A",
            }}
          >
            {product.category.replace("-", " & ")}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 56,
              fontWeight: 600,
              color: "#1C1C1A",
              lineHeight: 1.15,
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 40,
              fontWeight: 600,
              color: "#1F3A2E",
            }}
          >
            {formatPrice(product.price)}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 48,
              fontSize: 28,
              fontWeight: 700,
              color: "#1F3A2E",
              letterSpacing: 1,
            }}
          >
            SHOPSPHERE
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}