import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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