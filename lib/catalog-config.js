import {
  WEBSITE_ID,
  COMPANY_ID,
  SQLITE_DB_PATH,
  normalizeDomainId,
  normalizeWebsiteId,
  isItemVisibleOnWebsite,
  makeSlug,
} from "./catalog-utils.js";

export {
  WEBSITE_ID,
  COMPANY_ID,
  SQLITE_DB_PATH,
  normalizeDomainId,
  normalizeWebsiteId,
  isItemVisibleOnWebsite,
  makeSlug,
};

export const COMPANY_WEBSITES = {
  human: [
    "humanbiomedicalcom",
    "humanbiomedicalin",
    "humanbiomedicalorg",
    "humanbiomedicalsnet",
    "humanbiomedicalsin",
    "humanbiomedicalsorg",
    "humanbiomedicalscoin",
    "humanbiomedicalscom",
  ],
  global: [
    "globalbiomedicalorg",
    "globalbiomedicalin",
    "globalbiomedicalcoin",
    "globalbiomedicalsin",
    "globalbiomedicalsnet",
  ],
  rajbiosis: [
    "indiandiagnostic",
    "centralbiomedicals",
    "humarilabin",
    "humarilabcom",
    "rajbiosisinfo",
    "rajbiosiscoin",
    "rajbiosisltd",
  ],
};

export function getDetectedCompanyId() {
  return COMPANY_ID;
}

export function getDetectedWebsiteId() {
  return WEBSITE_ID;
}
