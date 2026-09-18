import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { getDetectedWebsiteId } from "@/lib/catalog-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DOMAIN = "https://globalbiomedical.org";

export async function GET() {
  try {
    const websiteId = getDetectedWebsiteId();

    // 1. Fetch Master Catalog products
    const products = await fetchFullCatalog();
    const publishedProducts = Array.isArray(products) ? products : [];

    // Group by category
    const categoryMap = {};
    publishedProducts.forEach((p) => {
      const cat = p.category || "General Products";
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(p);
    });

    const categoryNames = Object.keys(categoryMap);

    // 2. Fetch Districts
    let districts = [];
    if (adminDb) {
      try {
        const districtSnap = await adminDb
          .collection("websites")
          .doc(websiteId)
          .collection("districts")
          .get();

        districts = districtSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (distErr) {
        console.warn("[llms.txt] Error fetching districts:", distErr);
      }
    }

    // ===========================
    // Categories Text
    // ===========================
    const categoryText =
      categoryNames.length > 0
        ? categoryNames
            .map((catName) => {
              const prods = categoryMap[catName] || [];
              const productList = prods.map((item) => `- ${item.title}`).join("\n");
              return `
## ${catName}
Total Products: ${prods.length}

Products:
${productList || "No Products"}
`;
            })
            .join("\n")
        : "No Categories Found";

    // ===========================
    // Products Text
    // ===========================
    const productText =
      publishedProducts.length > 0
        ? publishedProducts
            .map((product) => {
              return `
# ${product.title}
Category: ${product.category || "N/A"}
SubCategory: ${product.subCategory || "N/A"}
Brand: ${product.brand || "N/A"}
Model: ${product.model || "N/A"}
Description: ${product.desc || product.description || "No description available"}
Instrument: ${product.instrument || "N/A"}
Automation: ${product.automation || "N/A"}
Usage: ${product.usage || "N/A"}
Throughput: ${product.throughput || "N/A"}
Capacity: ${product.capacity || "N/A"}
Availability: ${product.availability || "N/A"}
Price: ${product.price ? "₹" + product.price : "Contact for Price"}
Product URL: ${DOMAIN}/items/${product.slug || product.id}
Tags: ${[
                product.title,
                product.brand,
                product.category,
                product.subCategory,
                product.model,
                product.instrument,
                product.automation,
                product.usage,
              ]
                .filter(Boolean)
                .join(", ")}
`;
            })
            .join("\n")
        : "No Products Found";

    // ===========================
    // Districts Text
    // ===========================
    const districtText =
      districts.length > 0
        ? districts.map((item) => `${DOMAIN}/${item.slug || item.id}`).join("\n")
        : "No Districts Found";

    // ===========================
    // llms.txt Content
    // ===========================
    const content = `
## Statistics
Products: ${publishedProducts.length}
Categories: ${categoryNames.length}
Districts: ${districts.length}

# Global Biomedical
India's Trusted Biomedical, Hospital & Laboratory Equipment Supplier

Website: ${DOMAIN}
Published Products: ${publishedProducts.length}
Categories: ${categoryNames.length}
District Pages: ${districts.length}

Company:
Global Biomedical is one of India's trusted Biomedical & Laboratory Equipment suppliers.

Services:
- Biomedical Equipment Supply
- Laboratory Equipment
- Diagnostic Equipment
- Installation & Commissioning
- AMC & CMC
- Calibration
- Repair & Maintenance
- Technical Support
- Pan India Delivery

Search Keywords:
Biomedical Equipment, Laboratory Equipment, Diagnostic Equipment, Hospital Equipment, Medical Equipment, ICU Equipment, Operation Theatre Equipment, Biochemistry Analyzer, Electrolyte Analyzer, CLIA Analyzer, Immunoassay Analyzer

------------------------------------------------
## Categories
${categoryText}

------------------------------------------------
## Products
${productText}

------------------------------------------------
## District Pages
${districtText}

------------------------------------------------
Sitemap: ${DOMAIN}/sitemap.xml
Robots: ${DOMAIN}/robots.txt
Contact: ${DOMAIN}/contact
Last Updated: ${new Date().toISOString()}
`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e.message,
      },
      {
        status: 500,
      }
    );
  }
}