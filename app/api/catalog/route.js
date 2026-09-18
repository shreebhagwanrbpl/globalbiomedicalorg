import { NextResponse } from "next/server";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { getDetectedCompanyId, getDetectedWebsiteId } from "@/lib/catalog-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetWebsite = searchParams.get("websiteId") || getDetectedWebsiteId();
    const targetCompany = searchParams.get("companyId") || getDetectedCompanyId();

    const products = await fetchFullCatalog(targetWebsite, targetCompany);

    return NextResponse.json(
      {
        success: true,
        companyId: targetCompany,
        websiteId: targetWebsite,
        count: Array.isArray(products) ? products.length : 0,
        products: Array.isArray(products) ? products : [],
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("[API /api/catalog] Error fetching catalog:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to fetch master catalog",
        products: [],
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
