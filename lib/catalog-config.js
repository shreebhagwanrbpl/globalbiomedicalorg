/**
 * Dynamic Company & Website Identification & Visibility System
 *
 * Normalizes website IDs and provides bulletproof visibility rules:
 * 1. isPublished === false -> Hidden
 * 2. websiteIds === [] (empty array, 0 websites selected) -> Hidden
 * 3. websiteIds.includes("all") -> Visible
 * 4. Normalization: strips '.', '-', '_', spaces, protocol, etc. for robust matching.
 * 5. Cascading hide: Category hidden -> subcategories & products hidden.
 */

export const COMPANY_WEBSITES = {
  human: [
    "humanbiomedicalcom",
    "humanbiomedicalin",
    "humanbiomedicalcoin",
    "humanbiomedicalsin",
    "humanbiomedicalsnet",
    "humanhealthkartcom",
    "humanbiomedical.com",
    "humanbiomedical.in",
    "humanbiomedical.co.in",
  ],
  global: [
    "globalbiomedicalorg",
    "globalbiomedicalin",
    "globalbiomedicalcoin",
    "globalbiomedicalsin",
    "globalbiomedicalsnet",
    "globalhealthkartcom",
    "globalbiomedical.org",
    "globalbiomedical.in",
    "globalbiomedical.co.in",
  ],
  rajbiosis: [
    "rajbiosisinfo",
    "rajbiosiscoin",
    "rajbiosisltd",
    "indiandiagnostic",
    "centralbiomedicals",
    "humarilabin",
    "humarilabcom",
    "rajbiosis.com",
    "rajbiosis.in",
    "rajbiosis.co.in",
  ],
};

/**
 * Strips protocol, www, dots, dashes, underscores, slashes, and spaces.
 * e.g. "https://www.Global-Biomedical.org/" -> "globalbiomedicalorg"
 * e.g. "globalbiomedical.co.in" -> "globalbiomedicalcoin"
 */
export function normalizeWebsiteId(id = "") {
  if (!id || typeof id !== "string") return "";
  return id
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Dynamically detects the current company ID ("global", "human", or "rajbiosis").
 */
export function getDetectedCompanyId() {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.NEXT_PUBLIC_COMPANY_ID) {
      return process.env.NEXT_PUBLIC_COMPANY_ID.toLowerCase().trim();
    }
    if (process.env.COMPANY_ID) {
      return process.env.COMPANY_ID.toLowerCase().trim();
    }
  }

  // Detect from domain / project metadata / package name
  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname.toLowerCase();
    if (host.includes("human")) return "human";
    if (host.includes("rajbiosis") || host.includes("indiandiagnostic")) return "rajbiosis";
    if (host.includes("global")) return "global";
  }

  // Default for this repository (globalbiomedicalorg / globalbiomedical.org)
  return "global";
}

/**
 * Dynamically detects the current website ID.
 */
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

  // Default website ID for this repository
  return "globalbiomedicalorg";
}

/**
 * Checks if an item (category, subcategory, or product) is visible on a given website.
 *
 * Rules:
 * 1. If parentCategoryVisible === false -> false
 * 2. If parentSubcategoryVisible === false -> false
 * 3. item.isPublished === false -> false
 * 4. item.status === "inactive" / "hidden" -> false
 * 5. Array.isArray(item.websiteIds):
 *    - item.websiteIds.length === 0 -> false (0 websites selected = HIDE)
 *    - item.websiteIds.includes("all") -> true
 *    - Matches normalized websiteId -> true
 *    - Otherwise -> false
 * 6. If item.websiteIds is undefined/null on legacy items, falls back to isPublished !== false.
 */
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

  // Rule 1: Explicit publish check
  if (item.isPublished === false) {
    return false;
  }

  // Rule 2: Inactive/hidden status
  if (item.status === "hidden" || item.status === "inactive") {
    return false;
  }

  const websiteId = targetWebsiteId || getDetectedWebsiteId();
  const normalizedTarget = normalizeWebsiteId(websiteId);

  // Rule 3: websiteIds check
  if (Array.isArray(item.websiteIds)) {
    // 0 websites selected -> IMMEDIATELY HIDE
    if (item.websiteIds.length === 0) {
      return false;
    }

    // "all" websites selected -> SHOW
    if (item.websiteIds.includes("all") || item.websiteIds.includes("*")) {
      return true;
    }

    // Check direct match or normalized match
    const hasMatch = item.websiteIds.some((site) => {
      if (!site) return false;
      const normalizedSite = normalizeWebsiteId(site);
      return (
        normalizedSite === normalizedTarget ||
        site === websiteId ||
        normalizedSite === "all"
      );
    });

    return hasMatch;
  }

  // Fallback for legacy items without websiteIds array
  return item.isPublished !== false;
}

/**
 * Generates a clean URL slug from title.
 */
export function makeSlug(text = "") {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
