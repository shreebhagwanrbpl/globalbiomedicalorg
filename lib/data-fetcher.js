/**
 * Client-compatible catalog helper. The browser talks only to the Next.js API;
 * SQLite is never exposed to the client.
 */
import { getDetectedCompanyId, getDetectedWebsiteId } from "./catalog-config.js";

let inFlightCatalogPromise = null;

export async function fetchDocCached(path) {
  const parts = String(path || "").split("/").filter(Boolean);
  if (parts[0] === "websites" && parts[1] && parts[2] === "pages" && parts[3]) {
    const type = parts[3];
    const res = await fetch(`/api/site-data?type=${encodeURIComponent(type)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()).data || null;
  }
  if (parts[0] === "websites" && parts[1] && parts[2] === "districts" && parts[3]) {
    const res = await fetch(`/api/site-data?type=district&slug=${encodeURIComponent(parts[3])}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()).data || null;
  }
  return null;
}

export async function fetchFullCatalog(options = {}) {
  const { forceRefresh = false, targetWebsiteId = null, targetCompanyId = null } = options;
  if (forceRefresh) inFlightCatalogPromise = null;
  if (inFlightCatalogPromise) return inFlightCatalogPromise;
  const websiteId = targetWebsiteId || getDetectedWebsiteId();
  const companyId = targetCompanyId || getDetectedCompanyId();
  inFlightCatalogPromise = fetch(`/api/catalog?websiteId=${encodeURIComponent(websiteId)}&companyId=${encodeURIComponent(companyId)}${forceRefresh ? "&force=true" : ""}`, { cache: "no-store" })
    .then((r) => r.ok ? r.json() : { products: [] })
    .then((j) => Array.isArray(j.products) ? j.products : [])
    .finally(() => { inFlightCatalogPromise = null; });
  return inFlightCatalogPromise;
}

export const fetchHomeData = () => fetchDocCached(`websites/${getDetectedWebsiteId()}/pages/home`);
export const fetchContactData = () => fetchDocCached(`websites/${getDetectedWebsiteId()}/pages/contact`);
export const fetchServicesData = () => fetchDocCached(`websites/${getDetectedWebsiteId()}/pages/services`);
export const fetchDistrictData = (district) => fetchDocCached(`websites/${getDetectedWebsiteId()}/districts/${district}`);
