import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    // If relative URL, prepend origin
    let targetUrl = imageUrl;
    if (imageUrl.startsWith("/")) {
      const host = request.headers.get("host") || "localhost:3000";
      const protocol = request.headers.get("x-forwarded-proto") || "http";
      targetUrl = `${protocol}://${host}${imageUrl}`;
    }

    const res = await fetch(targetUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({ base64: dataUrl });
  } catch (error) {
    console.error("[api/image-proxy] Error converting image to Base64:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
