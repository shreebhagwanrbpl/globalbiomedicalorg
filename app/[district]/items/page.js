import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "@/app/items/ProductsClient";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const district = resolvedParams?.district || "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `Medical & Laboratory Equipment in ${city} | Global Biomedical`,
    description: `Browse premium medical equipment, laboratory instruments, diagnostic devices, hospital equipment and biomedical products in ${city}. Get genuine products, competitive pricing and expert support from Global Biomedical.`,

    keywords: [
      `Medical Equipment ${city}`,
      `Laboratory Equipment ${city}`,
      `Biomedical Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      `Hospital Equipment ${city}`,
      `Medical Device Supplier ${city}`,
      `Lab Instruments ${city}`,
      "Global Biomedical",
    ],

    alternates: {
      canonical: `https://globalbiomedical.org/${district}/items`,
    },

    openGraph: {
      title: `Medical & Laboratory Equipment in ${city} | Global Biomedical`,
      description: `Explore premium medical and laboratory equipment in ${city} from Global Biomedical.`,
      url: `https://globalbiomedical.org/${district}/items`,
      siteName: "Global Biomedical",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "https://globalbiomedical.org/globallogo.png",
          width: 1200,
          height: 630,
          alt: `Medical Equipment in ${city}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `Medical Equipment in ${city} | Global Biomedical`,
      description: `Browse biomedical and laboratory equipment in ${city}.`,
      images: ["https://globalbiomedical.org/globallogo.png"],
    },

    robots: {
      index: true,
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