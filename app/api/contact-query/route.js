import { NextResponse } from "next/server";
import { saveQuery } from "@/lib/mongoDb";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await saveQuery("contact", body);
    if (result.success) {
      return NextResponse.json({ success: true, message: "Enquiry submitted successfully." });
    }
    return NextResponse.json({ success: false, error: result.error || "Failed to save enquiry" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
