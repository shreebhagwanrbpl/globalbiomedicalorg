import { cache } from "react";
import { fetchAdminJson } from "./admin-api.js";
import {
  getDetectedCompanyId,
  getDetectedWebsiteId,
  isItemVisibleOnWebsite,
  makeSlug,
} from "./catalog-config.js";

/**
 * Format a product into the common structure expected
 * throughout the website.
 */
function formatProduct(item, context = {}) {
  const {
    companyId,
    websiteId,
    categoryId = null,
    subcategoryId = null,
    categoryName = null,
    subCategoryName = null,
    fallbackId = "product",
    websiteIds = [],
  } = context;

  if (!item || typeof item !== "object") {
    return null;
  }

  const formattedImages =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.image
        ? [item.image]
        : Array.isArray(item.originalImages)
          ? item.originalImages
          : [];

  const title = item.title || item.name || "";

  return {
    ...item,

    // IDs
    id:
      item.id ||
      item.productId ||
      item.categoryProductId ||
      fallbackId,

    productId:
      item.productId ||
      item.id ||
      item.categoryProductId ||
      fallbackId,

    categoryProductId:
      item.categoryProductId ||
      item.id ||
      item.productId ||
      fallbackId,

    uid: item.uid || fallbackId,

    // Basic information
    title,
    name: item.name || title,

    // Category information
    category: item.category || categoryName || "",
    subCategory: item.subCategory || subCategoryName || "",

    categoryId:
      item.categoryId ||
      categoryId ||
      null,

    subcategoryId:
      item.subcategoryId ||
      subcategoryId ||
      null,

    // SEO / URL
    slug:
      item.slug ||
      makeSlug(title),

    // Images
    images: formattedImages,
    image: formattedImages[0] || "",

    // Company / website
    companyId:
      item.companyId ||
      companyId ||
      null,

    websiteIds:
      Array.isArray(item.websiteIds)
        ? item.websiteIds
        : websiteIds,

    websiteId,

    // Publishing
    isPublished:
      item.isPublished !== undefined
        ? item.isPublished
        : true,
  };
}

/**
 * Fetch complete Master Product Catalog
 *
 * IMPORTANT:
 * This function uses the SuperAdmin SQLite API.
 *
 * Firebase is NOT used here.
 */
export const fetchFullCatalog = cache(
  async (
    targetWebsiteId = null,
    targetCompanyId = null
  ) => {
    const websiteId =
      targetWebsiteId ||
      getDetectedWebsiteId();

    const companyId =
      targetCompanyId ||
      getDetectedCompanyId();

    if (!websiteId) {
      console.error(
        "[data-fetcher-server] Missing websiteId."
      );

      return [];
    }

    if (!companyId) {
      console.error(
        "[data-fetcher-server] Missing companyId."
      );

      return [];
    }

    try {
      const query = new URLSearchParams({
        websiteId,
        companyId,
      });

      console.log(
        `[data-fetcher-server] Fetching catalog from Admin API: websiteId=${websiteId}, companyId=${companyId}`
      );

      const json = await fetchAdminJson(
        `/api/catalog?${query.toString()}`
      );

      const products = Array.isArray(json?.products)
        ? json.products
        : Array.isArray(json?.data)
          ? json.data
          : [];

      const formattedProducts = products
        .map((item, index) =>
          formatProduct(item, {
            companyId,
            websiteId,
            fallbackId:
              item?.id ||
              item?.productId ||
              `product-${index + 1}`,
          })
        )
        .filter(Boolean);

      const visibleProducts = formattedProducts.filter(
        (product) =>
          isItemVisibleOnWebsite(
            product,
            websiteId,
            true,
            true
          )
      );

      console.log(
        `[data-fetcher-server] Admin SQLite catalog loaded: ${visibleProducts.length} visible products for ${websiteId} (${companyId})`
      );

      return visibleProducts;
    } catch (error) {
      console.error(
        "[data-fetcher-server] Admin SQLite API error:",
        error
      );

      return [];
    }
  }
);

/**
 * Fetch website-level document data.
 *
 * Examples:
 * type = home
 * type = about
 * type = services
 * type = contact
 * type = categories
 */
export async function fetchSiteDocument(
  type,
  websiteId = null,
  district = null
) {
  const site =
    websiteId ||
    getDetectedWebsiteId();

  if (!type) {
    console.error(
      "[data-fetcher-server] fetchSiteDocument: type is required."
    );

    return null;
  }

  if (!site) {
    console.error(
      "[data-fetcher-server] fetchSiteDocument: websiteId is required."
    );

    return null;
  }

  try {
    const params = new URLSearchParams({
      type,
      websiteId: site,
    });

    if (type === "district" && district) {
      params.set("slug", district);
    }

    console.log(
      `[data-fetcher-server] Fetching site document: type=${type}, websiteId=${site}`
    );

    const json = await fetchAdminJson(
      `/api/site-data?${params.toString()}`
    );

    return json?.data || null;
  } catch (error) {
    console.error(
      `[data-fetcher-server] Admin ${type} API error:`,
      error
    );

    return null;
  }
}

/**
 * Fetch all districts for a website.
 *
 * Data source:
 * SuperAdmin SQLite API
 */
export async function fetchDistricts(
  websiteId = null
) {
  const site =
    websiteId ||
    getDetectedWebsiteId();

  if (!site) {
    console.error(
      "[data-fetcher-server] fetchDistricts: websiteId is required."
    );

    return [];
  }

  try {
    const params = new URLSearchParams({
      type: "districts",
      websiteId: site,
    });

    console.log(
      `[data-fetcher-server] Fetching districts for ${site}`
    );

    const json = await fetchAdminJson(
      `/api/site-data?${params.toString()}`
    );

    const districts = Array.isArray(json?.districts)
      ? json.districts
      : Array.isArray(json?.data)
        ? json.data
        : [];

    return districts;
  } catch (error) {
    console.error(
      "[data-fetcher-server] Admin districts API error:",
      error
    );

    return [];
  }
}

/**
 * Fetch a single district document.
 */
export async function fetchDistrict(
  district,
  websiteId = null
) {
  const site =
    websiteId ||
    getDetectedWebsiteId();

  if (!district || !site) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      type: "district",
      websiteId: site,
      slug: district,
    });

    const json = await fetchAdminJson(
      `/api/site-data?${params.toString()}`
    );

    return json?.data || null;
  } catch (error) {
    console.error(
      "[data-fetcher-server] Admin district API error:",
      error
    );

    return null;
  }
}