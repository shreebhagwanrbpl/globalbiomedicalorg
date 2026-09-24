import { cache } from "react";
import { fetchAdminJson } from "./admin-api.js";
import { getDetectedCompanyId, getDetectedWebsiteId, isItemVisibleOnWebsite, makeSlug } from "./catalog-config.js";

function formatProduct(item, context = {}) {
  const { companyId, websiteId, categoryId = null, subcategoryId = null, categoryName = null, subCategoryName = null, fallbackId = "product" } = context;
  if (!item || typeof item !== "object") return null;
  const formattedImages = Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : (item.originalImages || []));
  return {
    ...item,
    id: item.id || item.productId || item.categoryProductId || fallbackId,
    productId: item.productId || item.id || fallbackId,
    categoryProductId: item.categoryProductId || item.id || fallbackId,
    uid: item.uid || fallbackId,
    title: item.title || item.name || "",
    name: item.name || item.title || "",
    category: item.category || categoryName || "",
    subCategory: item.subCategory || subCategoryName || "",
    categoryId: item.categoryId || categoryId,
    subcategoryId: item.subcategoryId || subcategoryId,
    slug: item.slug || makeSlug(item.title || item.name),
    images: formattedImages,
    image: formattedImages[0] || "",
    companyId: item.companyId || companyId,
    websiteIds: item.websiteIds || context.websiteIds || [],
    isPublished: item.isPublished !== undefined ? item.isPublished : true,
    websiteId,
  };
}

export const fetchFullCatalog = cache(async (targetWebsiteId = null, targetCompanyId = null) => {
  const websiteId = targetWebsiteId || getDetectedWebsiteId();
  const companyId = targetCompanyId || getDetectedCompanyId();

  try {
    const query = new URLSearchParams({ websiteId, companyId });
    const json = await fetchAdminJson(`/api/catalog?${query.toString()}`);
    return Array.isArray(json?.products) ? json.products : [];
  } catch (error) {
    console.error("[data-fetcher-server] Admin SQLite API error:", error);
    return [];
  }
});

export async function fetchSiteDocument(type, websiteId = null, district = null) {
  const site = websiteId || getDetectedWebsiteId();
  const params = new URLSearchParams({ type, websiteId: site });
  if (type === "district" && district) params.set("slug", district);

  try {
    const json = await fetchAdminJson(`/api/site-data?${params.toString()}`);
    return json?.data || null;
  } catch (error) {
    console.error(`[data-fetcher-server] Admin ${type} API error:`, error);
    return null;
  }
}

export async function fetchDistricts(websiteId = null) {
  const site = websiteId || getDetectedWebsiteId();
  try {
    const json = await fetchAdminJson(`/api/site-data?type=districts&websiteId=${encodeURIComponent(site)}`);
    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    console.error("[data-fetcher-server] Admin districts API error:", error);
    return [];
  }
}
