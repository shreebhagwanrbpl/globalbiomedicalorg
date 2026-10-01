/**
 * Single Source of Truth for Website & Catalog Configuration
 *
 * All files across the project must import WEBSITE_ID, COMPANY_ID, and SQLITE_DB_PATH
 * strictly from this module.
 */

export const WEBSITE_ID = "globalbiomedicalorg";
export const COMPANY_ID = "global";
export const SQLITE_DB_PATH =
  process.env.SQLITE_DB_PATH || "../SuperAdminRBPL/data/catalog.db";

/**
 * Normalizes any domain or website ID:
 * Removes protocol (http/https), www., dots, dashes, underscores, spaces, and slashes.
 * e.g. "https://www.globalbiomedical.org/" -> "globalbiomedicalorg"
 * e.g. "globalbiomedical.org" -> "globalbiomedicalorg"
 */
export function normalizeDomainId(id = "") {
  if (!id || typeof id !== "string") return "";
  return id
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Backward compatibility alias for normalizeDomainId
 */
export const normalizeWebsiteId = normalizeDomainId;

/**
 * Strict exact domain matching & cascading visibility
 *
 * Rules:
 * 1. If parentCategoryVisible === false -> return false (cascading hide).
 * 2. If parentSubcategoryVisible === false -> return false (cascading hide).
 * 3. If item is null/undefined -> return false.
 * 4. If item.isPublished === false -> return false.
 * 5. If item.status === "inactive" || item.status === "draft" || item.status === "hidden" -> return false.
 * 6. If item.websiteIds is an array:
 *    - item.websiteIds.length === 0 -> return false (0 websites assigned = HIDE).
 *    - item.websiteIds.includes("all") || item.websiteIds.includes("*") -> return true.
 *    - STRICT EXACT MATCHING: normalize each website and check match against targetWebsiteId.
 *    - If match found -> return true.
 *    - Otherwise -> return false.
 * 7. If item.websiteIds is undefined/null -> return true (default show for unassigned legacy items).
 */
export function isItemVisibleOnWebsite(
  item,
  targetWebsiteId = WEBSITE_ID,
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

  if (
    item.status === "inactive" ||
    item.status === "draft" ||
    item.status === "hidden"
  ) {
    return false;
  }

  const targetNorm = normalizeDomainId(targetWebsiteId || WEBSITE_ID);

  if (Array.isArray(item.websiteIds)) {
    if (item.websiteIds.length === 0) {
      return false;
    }

    if (item.websiteIds.includes("all") || item.websiteIds.includes("*")) {
      return true;
    }

    return item.websiteIds.some((site) => {
      if (!site) return false;
      const siteNorm = normalizeDomainId(site);
      return (
        siteNorm === targetNorm ||
        site === targetWebsiteId ||
        siteNorm === "all"
      );
    });
  }

  return true;
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
