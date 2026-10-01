import { getDetectedCompanyId, getDetectedWebsiteId, makeSlug } from "./catalog-config.js";

export { getDetectedCompanyId, getDetectedWebsiteId, makeSlug };

export async function fetchFullCatalog(options = {}) {
  if (typeof window === "undefined") {
    try {
      const { getFullCatalog } = await import("./mongoDb.js");
      const products = await getFullCatalog(getDetectedCompanyId(), getDetectedWebsiteId());
      return products;
    } catch (err) {
      console.error("[data-fetcher] Server MongoDB getFullCatalog error:", err);
    }
  }

  try {
    const url = options.forceRefresh
      ? `/api/catalog?t=${Date.now()}`
      : "/api/catalog";
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return Array.isArray(json.products) ? json.products : [];
    }
  } catch (err) {
    console.error("[data-fetcher] Browser fetchFullCatalog error:", err);
  }

  return [];
}

export async function fetchPageData(pageType = "home") {
  if (typeof window === "undefined") {
    try {
      const { getPageData } = await import("./mongoDb.js");
      const data = await getPageData(pageType, getDetectedWebsiteId(), getDetectedCompanyId());
      return data;
    } catch (err) {
      console.error(`[data-fetcher] Server getPageData(${pageType}) error:`, err);
    }
  }

  try {
    const res = await fetch(`/api/site-data?type=${pageType}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || null;
    }
  } catch (err) {
    console.error(`[data-fetcher] Browser fetchPageData(${pageType}) error:`, err);
  }

  return null;
}

export async function fetchHomeData() { return fetchPageData("home"); }
export async function fetchContactData() { return fetchPageData("contact"); }
export async function fetchServicesData() { return fetchPageData("services"); }

export async function fetchDistricts() {
  if (typeof window === "undefined") {
    try {
      const { getDistricts } = await import("./mongoDb.js");
      return await getDistricts();
    } catch (err) {
      console.error("[data-fetcher] Server getDistricts error:", err);
    }
  }

  try {
    const res = await fetch("/api/site-data?type=districts", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return Array.isArray(json.data) ? json.data : [];
    }
  } catch (err) {
    console.error("[data-fetcher] Browser fetchDistricts error:", err);
  }

  return [];
}

export async function fetchDistrictData(district) {
  if (!district) return null;
  return fetchPageData(district);
}
