import type { Metadata } from "next";
import CartClient from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the items in your ShopSphere shopping cart.",
};

export default function CartPage() {
  return <CartClient />;
}
