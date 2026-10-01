import {
  getFullCatalog,
  getPageData,
  getDistricts as getDistrictsFromDb,
  getDistrictData as getDistrictDataFromDb,
} from "./mongoDb.js";
import { getDetectedCompanyId, getDetectedWebsiteId } from "./catalog-config.js";

export async function fetchFullCatalog() {
  const companyId = getDetectedCompanyId();
  const websiteId = getDetectedWebsiteId();
  const start = performance.now();
  const products = await getFullCatalog(companyId, websiteId);
  const end = performance.now();
  console.log(
    `[data-fetcher-server] fetchFullCatalog took ${(end - start).toFixed(
      2
    )}ms, returned ${products.length} visible products for ${websiteId}`
  );
  return products;
}

export async function fetchDistricts() {
  return await getDistrictsFromDb();
}

export async function fetchDistrictData(district) {
  return await getDistrictDataFromDb(district);
}

export async function fetchHomeData() {
  return await getPageData("home");
}

export async function fetchContactData() {
  return await getPageData("contact");
}

export async function fetchServicesData() {
  return await getPageData("services");
}
