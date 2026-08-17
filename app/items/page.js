import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "./ProductsClient";

export const revalidate = 3600; // Revalidate cache every hour

export default async function ProductsPage({ district = null, city = null }) {
  let allProducts = [];
  try {
    allProducts = await fetchFullCatalog();
  } catch (err) {
    console.error("[ProductsPage] Server fetch failed, falling back to client fetch:", err);
  }

  return (
    <ProductsClient
      initialProducts={allProducts}
      district={district}
      city={city}
    />
  );
}