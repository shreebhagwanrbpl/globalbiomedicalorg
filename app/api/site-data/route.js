import { NextResponse } from "next/server";
import { fetchAdminJson } from "@/lib/admin-api";
import { getDetectedWebsiteId } from "@/lib/catalog-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const websiteId = searchParams.get("websiteId") || getDetectedWebsiteId();
    const slug = searchParams.get("slug");

    if (!type) {
      return NextResponse.json({ success: false, error: "type is required" }, { status: 400 });
    }

    const params = new URLSearchParams({ type, websiteId });
    if (slug) params.set("slug", slug);

    const data = await fetchAdminJson(`/api/site-data?${params.toString()}`);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error) {
    console.error("[website /api/site-data]", error);
    return NextResponse.json({ success: false, data: null, error: error.message }, { status: 502 });
  }
}
