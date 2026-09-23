import type { Metadata } from "next";
import WishlistClient from "@/components/WishlistClient";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "View and manage the products you've saved to your ShopSphere wishlist.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
