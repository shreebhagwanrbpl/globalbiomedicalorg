import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { adminDb } from "@/lib/firebase-admin";
import { makeSlug } from "@/lib/seo-utils";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = "https://globalbiomedical.org";
  const now = new Date();

  // 1. Static Primary URLs
  const urls = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
  ];

  try {
    // 2. Main Product Canonical URLs
    const products = await fetchFullCatalog();
    const addedProductSlugs = new Set();

    if (products && products.length > 0) {
      products.forEach((prod) => {
        const slug = prod.slug || makeSlug(prod.title);
        if (slug && !addedProductSlugs.has(slug)) {
          addedProductSlugs.add(slug);
          urls.push({
            url: `${baseUrl}/products/${slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
          });
        }
      });
    }

    // 3. Category Hub URLs
    const categories = Array.from(
      new Set((products || []).map((p) => p.category).filter(Boolean))
    );
    categories.forEach((cat) => {
      const slug = makeSlug(cat);
      urls.push({
        url: `${baseUrl}/category/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    });

    // 4. Brand Hub URLs
    const brands = Array.from(
      new Set((products || []).map((p) => p.brand).filter(Boolean))
    );
    brands.forEach((brand) => {
      const slug = makeSlug(brand);
      urls.push({
        url: `${baseUrl}/brand/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    // 5. Legitimate District Location Hub URLs
    if (adminDb) {
      const websiteRef = adminDb.collection("websites").doc("globalbiomedicalorg");
      const districtSnapshot = await websiteRef.collection("districts").get();

      districtSnapshot.forEach((districtDoc) => {
        const districtSlug = districtDoc.id;
        if (districtSlug) {
          urls.push({
            url: `${baseUrl}/district/${districtSlug}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.75,
          });
        }
      });
    } else {
      // Fallback top districts if Firestore adminDb is unavailable
      const fallbackDistricts = ["jaipur", "delhi", "mumbai", "jodhpur", "kota", "udaipur", "ahmedabad", "indore"];
      fallbackDistricts.forEach((dist) => {
        urls.push({
          url: `${baseUrl}/district/${dist}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.75,
        });
      });
    }

    return urls;
  } catch (error) {
    console.error("[sitemap.js] Error generating dynamic sitemap:", error);
    return urls;
  }
}
