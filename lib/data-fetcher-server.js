import { cache } from "react";
import {
  WEBSITE_ID,
  COMPANY_ID,
  isItemVisibleOnWebsite,
  makeSlug,
} from "./catalog-utils.js";
import {
  STATIC_HERO,
  STATIC_SERVICES,
  STATIC_CONTACT,
  STATIC_DISTRICTS,
  STATIC_PRODUCTS,
} from "./static-data.js";
import {
  getProductsFromDb,
  getSiteDocFromDb,
} from "./sqlite.js";

/**
 * Format a product into the common structure expected
 * throughout the website.
 */
function formatProduct(item, context = {}) {
  const {
    companyId = COMPANY_ID,
    websiteId = WEBSITE_ID,
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
    id: item.id || item.productId || item.categoryProductId || fallbackId,
    productId: item.productId || item.id || item.categoryProductId || fallbackId,
    categoryProductId: item.categoryProductId || item.id || item.productId || fallbackId,
    uid: item.uid || fallbackId,
    title,
    name: item.name || title,
    category: item.category || categoryName || "Test Strips",
    subCategory: item.subCategory || subCategoryName || "",
    categoryId: item.categoryId || categoryId || null,
    subcategoryId: item.subcategoryId || subcategoryId || null,
    slug: item.slug || makeSlug(title),
    images: formattedImages.length > 0 ? formattedImages : ["/HA.png"],
    image: formattedImages[0] || "/HA.png",
    companyId: item.companyId || companyId,
    websiteIds: Array.isArray(item.websiteIds) ? item.websiteIds : websiteIds,
    websiteId,
    isPublished: item.isPublished !== undefined ? item.isPublished : true,
  };
}

/**
 * Fetch complete Master Product Catalog
 *
 * Reads live database products from SQLite DB with zero latency.
 */
export const fetchFullCatalog = cache(
  async (targetWebsiteId = WEBSITE_ID, targetCompanyId = COMPANY_ID) => {
    const websiteId = targetWebsiteId || WEBSITE_ID;
    const companyId = targetCompanyId || COMPANY_ID;

    // Extract live products stored in the SQLite database
    const dbProducts = getProductsFromDb(websiteId, companyId);
    if (Array.isArray(dbProducts) && dbProducts.length > 0) {
      return dbProducts;
    }

    return STATIC_PRODUCTS;
  }
);

/**
 * Fetch website-level document data from SQLite.
 */
export async function fetchSiteDocument(
  type,
  websiteId = WEBSITE_ID,
  district = null
) {
  const site = websiteId || WEBSITE_ID;

  if (!type) {
    return null;
  }

  const adminData = getSiteDocFromDb(type, site, district);

  if (type === "home") {
    const d = adminData || {};
    return {
      title: d.title || STATIC_HERO.title,
      description: d.description || STATIC_HERO.description,
      badge: d.badge || STATIC_HERO.badge,
      button1Text: d.button1Text || STATIC_HERO.button1Text,
      button1Link: d.button1Link || "/items",
      button2Text: d.button2Text || STATIC_HERO.button2Text,
      button2Link: d.button2Link || "/contact",
      image:
        d.image ||
        d.imageUrl ||
        (Array.isArray(d.images) && d.images[0]) ||
        STATIC_HERO.image,
      images:
        Array.isArray(d.images) && d.images.length > 0
          ? d.images
          : [STATIC_HERO.image],
      media: d.media || [],
      videos: d.videos || [],
      videoUrl: d.videoUrl || "",
      updatedAt: d.updatedAt || new Date().toISOString(),
    };
  }

  if (type === "services") {
    const rawServices = adminData?.services || adminData;
    if (Array.isArray(rawServices) && rawServices.length > 0) {
      return { services: rawServices };
    }
    return { services: STATIC_SERVICES };
  }

  if (type === "contact") {
    if (
      adminData &&
      typeof adminData === "object" &&
      Object.keys(adminData).length > 0
    ) {
      return {
        ...STATIC_CONTACT,
        ...adminData,
        contactInfo:
          Array.isArray(adminData.contactInfo) &&
          adminData.contactInfo.length > 0
            ? adminData.contactInfo
            : STATIC_CONTACT.contactInfo,
      };
    }
    return {
      ...STATIC_CONTACT,
      contactInfo: STATIC_CONTACT.contactInfo,
    };
  }

  if (type === "districts") {
    if (Array.isArray(adminData) && adminData.length > 0) return adminData;
    return STATIC_DISTRICTS;
  }

  if (type === "district") {
    if (adminData && typeof adminData === "object") return adminData;
    const found = STATIC_DISTRICTS.find((d) => d.slug === district);
    const formattedName = district
      ? district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "India";
    return (
      found || {
        name: formattedName,
        slug: district || "jaipur",
        state: found?.state || "India",
      }
    );
  }

  return adminData;
}

/**
 * Fetch all districts for a website.
 */
export async function fetchDistricts(websiteId = WEBSITE_ID) {
  const site = websiteId || WEBSITE_ID;
  const adminData = getSiteDocFromDb("districts", site);
  if (Array.isArray(adminData) && adminData.length > 0) {
    return adminData;
  }
  return STATIC_DISTRICTS;
}

/**
 * Fetch a single district document.
 */
export async function fetchDistrict(district, websiteId = WEBSITE_ID) {
  const site = websiteId || WEBSITE_ID;
  if (!district) return null;

  const adminData = getSiteDocFromDb("district", site, district);
  if (adminData && typeof adminData === "object") {
    return adminData;
  }

  const found = STATIC_DISTRICTS.find((d) => d.slug === district);
  const formattedName = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    found || {
      name: formattedName,
      slug: district,
      state: found?.state || "India",
    }
  );
}