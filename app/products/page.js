import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "@/app/items/ProductsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Biomedical, Hospital & Laboratory Equipment Catalog | Global Biomedical",
  description:
    "Browse our complete catalog of medical laboratory equipment, diagnostic analyzers, CBC machines, biochemistry analyzers, pathology instruments and consumables in India.",
  keywords: [
    "Biomedical Equipment Catalog",
    "Laboratory Equipment Supplier India",
    "Medical Equipment List",
    "Diagnostic Equipment Price",
    "Hospital Instruments Supplier",
    "Global Biomedical Catalog",
  ],
  alternates: {
    canonical: "https://globalbiomedical.org/products",
  },
  openGraph: {
    title: "Biomedical & Laboratory Equipment Catalog | Global Biomedical",
    description:
      "Explore high-quality medical equipment, analyzers, instruments, and consumables with installation & quotation support.",
    url: "https://globalbiomedical.org/products",
    siteName: "Global Biomedical",
    type: "website",
    locale: "en_IN",
    images: [{ url: "https://globalbiomedical.org/globallogo.png", width: 1200, height: 630, alt: "Global Biomedical Equipment Catalog" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ProductsCatalogPage() {
  let allProducts = [];
  try {
    allProducts = await fetchFullCatalog();
  } catch (err) {
    console.error("[ProductsCatalogPage] Error loading products catalog:", err);
  }

  return <ProductsClient initialProducts={allProducts} />;
}
