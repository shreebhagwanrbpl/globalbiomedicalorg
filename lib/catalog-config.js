/**
 * Dynamic Company & Website Identification & Visibility System
 */

export const COMPANY_WEBSITES = {
  human: [
    "humanbiomedicalcom",
    "humanbiomedicalin",
    "humanbiomedicalorg",
    "humanbiomedicalsnet",
    "humanhealthkartcom",
  ],
  global: [
    "globalbiomedicalorg",
    "globalbiomedicalin",
    "globalbiomedicalcoin",
    "globalbiomedicalsin",
    "globalbiomedicalsnet",
    "globalhealthkartcom",
  ],
  rajbiosis: [
    "indiandiagnostic",
    "centralbiomedicals",
    "humarilabin",
    "humarilabcom",
    "safekitin",
  ],
};

export function normalizeWebsiteId(id = "") {
  if (!id || typeof id !== "string") return "";
  return id
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/[^a-z0-9]/g, "");
}

export function getDetectedCompanyId() {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.NEXT_PUBLIC_COMPANY_ID) {
      return process.env.NEXT_PUBLIC_COMPANY_ID.toLowerCase().trim();
    }
    if (process.env.COMPANY_ID) {
      return process.env.COMPANY_ID.toLowerCase().trim();
    }
  }

  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname.toLowerCase();
    if (host.includes("human")) return "human";
    if (host.includes("rajbiosis") || host.includes("indiandiagnostic") || host.includes("safekit")) return "rajbiosis";
    if (host.includes("global")) return "global";
  }

  return "global";
}

export function getDetectedWebsiteId() {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.NEXT_PUBLIC_WEBSITE_ID) {
      return process.env.NEXT_PUBLIC_WEBSITE_ID.trim();
    }
    if (process.env.WEBSITE_ID) {
      return process.env.WEBSITE_ID.trim();
    }
  }

  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname.toLowerCase();
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return normalizeWebsiteId(host);
    }
  }

  return "globalbiomedicalorg";
}

export function isItemVisibleOnWebsite(
  item,
  targetWebsiteId = null,
  parentCategoryVisible = true,
  parentSubcategoryVisible = true
) {
  if (!parentCategoryVisible || !parentSubcategoryVisible) {
    return false;
  }

  if (!item || typeof item !== "object") {
    return false;
  }

  if (item.isPublished === false) {
    return false;
  }

  if (item.status === "hidden" || item.status === "inactive") {
    return false;
  }

  const websiteId = targetWebsiteId || getDetectedWebsiteId();
  const normalizedTarget = normalizeWebsiteId(websiteId);

  if (Array.isArray(item.websiteIds)) {
    if (item.websiteIds.length === 0) {
      return false;
    }

    if (item.websiteIds.includes("all") || item.websiteIds.includes("*")) {
      return true;
    }

    const company = getDetectedCompanyId() || "global";
    const allowedSites = COMPANY_WEBSITES[company] || [];
    const normalizedAllowed = allowedSites.map(normalizeWebsiteId);

    const hasMatch = item.websiteIds.some((site) => {
      if (!site) return false;
      const normalizedSite = normalizeWebsiteId(site);
      if (normalizedSite === normalizedTarget || site === websiteId || normalizedSite === "all") {
        return true;
      }
      if (normalizedAllowed.includes(normalizedTarget) && normalizedAllowed.includes(normalizedSite)) {
        return true;
      }
      return false;
    });

    return hasMatch;
  }

  return item.isPublished !== false;
}

export function makeSlug(text = "") {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
