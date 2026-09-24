import { NextResponse } from "next/server";
import { fetchAdminJson } from "@/lib/admin-api";
import { getDetectedCompanyId, getDetectedWebsiteId } from "@/lib/catalog-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get("websiteId") || getDetectedWebsiteId();
    const companyId = searchParams.get("companyId") || getDetectedCompanyId();

    const params = new URLSearchParams({ websiteId, companyId });
    const data = await fetchAdminJson(`/api/catalog?${params.toString()}`);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[website /api/catalog]", error);
    return NextResponse.json({ success: false, products: [], error: error.message }, { status: 502 });
  }
}
