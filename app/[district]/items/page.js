import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "@/app/items/ProductsClient";

export async function generateMetadata({ params }) {
  return {
    title: "Medical & Laboratory Equipment Catalog | Global Biomedical",
    description: "Browse medical equipment, laboratory instruments, diagnostic devices, hospital equipment and biomedical products.",
    alternates: {
      canonical: "https://globalbiomedical.org/products",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const district = resolvedParams?.district || "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  let allProducts = [];
  try {
    allProducts = await fetchFullCatalog();
  } catch (err) {
    console.error("[DistrictItemsPage] Server fetch failed:", err);
  }

  return <ProductsClient initialProducts={allProducts} city={city} district={district} />;
}