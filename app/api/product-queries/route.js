import { NextResponse } from "next/server";
import { saveQuery } from "@/lib/sqlite";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    saveQuery("product", { ...body, createdAt: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[product-queries]", error);
    return NextResponse.json({ success: false, error: "Failed to save product query" }, { status: 500 });
  }
}
