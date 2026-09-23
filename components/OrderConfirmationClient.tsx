import type { Metadata } from "next";
import OrderConfirmationClient from "@/components/OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  return <OrderConfirmationClient orderId={params.id} />;
}