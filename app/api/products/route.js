import { NextResponse } from "next/server";
import { WEBSITE_ID, COMPANY_ID } from "@/lib/catalog-utils";
import { getProductsFromDb } from "@/lib/sqlite";
import { STATIC_PRODUCTS } from "@/lib/static-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get("websiteId") || WEBSITE_ID;
    const companyId = searchParams.get("companyId") || COMPANY_ID;

    const products = getProductsFromDb(websiteId, companyId);
    const finalProducts = Array.isArray(products) && products.length > 0 ? products : STATIC_PRODUCTS;

    return NextResponse.json(
      {
        success: true,
        products: finalProducts,
        data: finalProducts,
        websiteId,
        companyId,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[website /api/products]", error);
    return NextResponse.json(
      {
        success: true,
        products: STATIC_PRODUCTS,
        data: STATIC_PRODUCTS,
        error: error.message,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  }
}
