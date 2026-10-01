import { NextResponse } from "next/server";
import { getPageData, getDistricts, getDistrictData } from "@/lib/mongoDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "home";
    const district = searchParams.get("district") || undefined;
    const page = searchParams.get("page") || undefined;

    let data = null;
    if (type === "districts") {
      data = await getDistricts();
    } else if (type === "district" && district) {
      data = await getDistrictData(district);
    } else {
      data = await getPageData(page || type);
    }

    return NextResponse.json({ success: true, type, data, timestamp: Date.now() });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
