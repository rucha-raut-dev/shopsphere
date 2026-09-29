import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "An authenticated user session is required." },
    { status: 401 }
  );
}