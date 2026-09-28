import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/product-queries";

// GET /api/products/linen-blend-shirt  (matches by slug or by id)
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await getProductBySlug(params.id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}