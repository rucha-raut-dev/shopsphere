import { notFound } from "next/navigation";
import { getCachedProductBySlug } from "@/lib/products-cache";
import Modal from "@/components/Modal";
import QuickViewContent from "@/components/QuickViewContent";

/**
 * INTERCEPTING ROUTE. The `(.)` prefix means "intercept navigations to
 * `products/[id]` at this same folder level" — this file and app/products/
 * are both direct children of app/, so `(.)` is the right convention here
 * (one level up would be `(..)`, and so on).
 *
 * Interception only fires for a *client-side* transition — i.e. someone
 * clicking a <Link href="/products/..."> while already inside this app.
 * A hard navigation (typing the URL, refreshing, opening in a new tab,
 * or a search engine crawling it) skips this file entirely and renders
 * the real app/products/[id]/page.tsx instead — full page, no modal.
 * That's not a fallback we had to build; it's what "intercepting" means:
 * this route only exists for the soft-navigation case.
 */
export default async function ProductQuickViewModal({
  params,
}: {
  params: { id: string };
}) {
  const product = await getCachedProductBySlug(params.id);
  if (!product) notFound();

  return (
    <Modal>
      <QuickViewContent product={product} />
    </Modal>
  );
}