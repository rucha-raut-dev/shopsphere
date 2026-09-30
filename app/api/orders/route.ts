import { NextRequest, NextResponse } from "next/server";
import { getOrdersForEmail } from "@/lib/order-queries";

// GET /api/orders?email=someone@example.com
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  const orders = await getOrdersForEmail(email);
  return NextResponse.json({ orders });
}