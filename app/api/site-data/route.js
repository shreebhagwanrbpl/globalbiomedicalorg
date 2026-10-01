import { NextResponse } from "next/server";
import { WEBSITE_ID } from "@/lib/catalog-utils";
import { getSiteDocFromDb } from "@/lib/sqlite";
import {
  STATIC_HERO,
  STATIC_SERVICES,
  STATIC_CONTACT,
  STATIC_DISTRICTS,
} from "@/lib/static-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const websiteId = searchParams.get("websiteId") || WEBSITE_ID;
    const slug = searchParams.get("slug");

    if (!type) {
      return NextResponse.json(
        { success: false, error: "type is required" },
        { status: 400 }
      );
    }

    const dbDoc = getSiteDocFromDb(type, websiteId, slug);

    let finalData = null;

    if (type === "home") {
      const adminData = dbDoc || {};
      finalData = {
        title: adminData.title || STATIC_HERO.title,
        description: adminData.description || STATIC_HERO.description,
        badge: adminData.badge || STATIC_HERO.badge,
        button1Text: adminData.button1Text || STATIC_HERO.button1Text,
        button1Link: adminData.button1Link || STATIC_HERO.button1Link,
        button2Text: adminData.button2Text || STATIC_HERO.button2Text,
        button2Link: adminData.button2Link || STATIC_HERO.button2Link,
        image:
          adminData.image ||
          adminData.imageUrl ||
          (Array.isArray(adminData.images) && adminData.images[0]) ||
          STATIC_HERO.image,
        images:
          Array.isArray(adminData.images) && adminData.images.length > 0
            ? adminData.images
            : [STATIC_HERO.image],
        media: adminData.media || [],
        videos: adminData.videos || [],
        videoUrl: adminData.videoUrl || "",
        updatedAt: adminData.updatedAt || new Date().toISOString(),
      };
    } else if (type === "services") {
      const rawServices = dbDoc?.services || dbDoc;
      if (Array.isArray(rawServices) && rawServices.length > 0) {
        finalData = { services: rawServices };
      } else {
        finalData = { services: STATIC_SERVICES };
      }
    } else if (type === "contact") {
      if (dbDoc && typeof dbDoc === "object" && Object.keys(dbDoc).length > 0) {
        finalData = {
          ...STATIC_CONTACT,
          ...dbDoc,
          contactInfo:
            Array.isArray(dbDoc.contactInfo) && dbDoc.contactInfo.length > 0
              ? dbDoc.contactInfo
              : STATIC_CONTACT.contactInfo,
        };
      } else {
        finalData = {
          ...STATIC_CONTACT,
          contactInfo: STATIC_CONTACT.contactInfo,
        };
      }
    } else if (type === "districts") {
      const rawDistricts = Array.isArray(dbDoc) && dbDoc.length > 0 ? dbDoc : STATIC_DISTRICTS;
      finalData = rawDistricts;
    } else if (type === "district") {
      if (dbDoc && typeof dbDoc === "object") {
        finalData = dbDoc;
      } else {
        const found = STATIC_DISTRICTS.find(
          (d) =>
            d.slug === slug || d.name?.toLowerCase() === slug?.toLowerCase()
        );
        const formattedName = slug
          ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : "India";
        finalData = found || {
          name: formattedName,
          slug: slug || "jaipur",
          state: found?.state || "India",
        };
      }
    } else {
      finalData = dbDoc || null;
    }

    return NextResponse.json(
      {
        success: true,
        type,
        websiteId,
        data: finalData,
        ...(type === "districts" ? { districts: finalData } : {}),
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[website /api/site-data]", error);
    return NextResponse.json(
      { success: false, data: null, error: error.message },
      { status: 500 }
    );
  }
}
