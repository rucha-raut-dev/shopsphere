import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/order-queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = await getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}