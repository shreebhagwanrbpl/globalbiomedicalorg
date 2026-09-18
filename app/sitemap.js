import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { adminDb } from "@/lib/firebase-admin";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { getDetectedWebsiteId } from "@/lib/catalog-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap() {
  const baseUrl = "https://globalbiomedical.org";
  const websiteId = getDetectedWebsiteId();
  const now = new Date();

  const urls = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
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
      url: `${baseUrl}/items`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    // 1. Fetch all visible Master Catalog products
    const products = await fetchFullCatalog();
    const seenProductSlugs = new Set();

    for (const prod of products) {
      if (!prod || !prod.slug) continue;
      const slug = prod.slug.toLowerCase().trim();
      if (!seenProductSlugs.has(slug)) {
        seenProductSlugs.add(slug);
        urls.push({
          url: `${baseUrl}/items/${slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.9,
        });
      }
    }

    // 2. Fetch districts if adminDb is available
    if (adminDb) {
      const websiteRef = adminDb.collection("websites").doc(websiteId);
      const districtSnapshot = await websiteRef.collection("districts").get();

      for (const districtDoc of districtSnapshot.docs) {
        const districtSlug = districtDoc.id;

        urls.push(
          {
            url: `${baseUrl}/${districtSlug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
          },
          {
            url: `${baseUrl}/${districtSlug}/items`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.8,
          },
          {
            url: `${baseUrl}/${districtSlug}/about`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
          },
          {
            url: `${baseUrl}/${districtSlug}/contact`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
          },
          {
            url: `${baseUrl}/${districtSlug}/services`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
          }
        );

        // Add district product URLs
        for (const prodSlug of Array.from(seenProductSlugs).slice(0, 100)) {
          urls.push({
            url: `${baseUrl}/${districtSlug}/items/${prodSlug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      }
    }

    return urls;
  } catch (error) {
    console.error("[sitemap.js] Sitemap generation error:", error);
    return urls;
  }
}
