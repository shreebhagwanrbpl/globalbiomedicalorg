import { fetchFullCatalog, fetchDistricts } from "@/lib/data-fetcher-server";
import { getDetectedWebsiteId } from "@/lib/catalog-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap() {
  const baseUrl = "https://globalbiomedical.org";
  const websiteId = getDetectedWebsiteId();
  const now = new Date();
  const urls = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/items`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];
  try {
    const products = await fetchFullCatalog();
    const seen = new Set();
    for (const prod of products) {
      if (!prod?.slug) continue;
      const slug = prod.slug.toLowerCase().trim();
      if (seen.has(slug)) continue;
      seen.add(slug);
      urls.push({ url: `${baseUrl}/items/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 });
    }
    const districts = await fetchDistricts(websiteId);
    for (const district of districts) {
      const slug = district.slug || district.id;
      if (!slug) continue;
      urls.push(
        { url: `${baseUrl}/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/${slug}/items`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
        { url: `${baseUrl}/${slug}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/${slug}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/${slug}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.7 }
      );
      for (const prodSlug of Array.from(seen).slice(0, 100)) {
        urls.push({ url: `${baseUrl}/${slug}/items/${prodSlug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
      }
    }
  } catch (error) { console.error("[sitemap.js] Sitemap generation error:", error); }
  return urls;
}
