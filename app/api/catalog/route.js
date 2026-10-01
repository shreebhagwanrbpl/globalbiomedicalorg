import { NextResponse } from "next/server";
import { getFullCatalog } from "@/lib/mongoDb";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import { getDetectedCompanyId, getDetectedWebsiteId } from "@/lib/catalog-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get("websiteId") || WEBSITE_ID;
    const companyId = searchParams.get("companyId") || COMPANY_ID;

    let products = [];
    try {
      products = await getFullCatalog(companyId, websiteId);
    } catch (dbErr) {
      products = await fetchFullCatalog();
    }

    return NextResponse.json(
      { success: true, count: products.length, products, timestamp: Date.now() },
      { status: 200, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
