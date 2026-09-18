import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductDetails from "@/app/items/[slug]/ProductDetails";
import {
  generateProductMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  makeSlug,
} from "@/lib/seo-utils";
import InternalLinkEngine from "@/app/components/InternalLinkEngine";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || "";

    const allProducts = await fetchFullCatalog();
    const targetSlug = (slug || "").toLowerCase().trim();
    const product = allProducts.find((p) => {
      if (!p) return false;
      const prodSlug = (p.slug || "").toLowerCase().trim();
      const prodId = (p.id || "").toLowerCase().trim();
      return (
        prodSlug === targetSlug ||
        prodId === targetSlug ||
        makeSlug(p.title) === targetSlug
      );
    });

    return generateProductMetadata(product || { title: slug.replace(/-/g, " "), slug });
  } catch (err) {
    console.error("[ProductPageMetadata] Error generating metadata:", err);
    return {
      title: "Biomedical & Diagnostic Equipment Supplier | Global Biomedical",
    };
  }
}

export default async function ProductPage({ params }) {
  let slug = "";
  let product = null;

  try {
    const resolvedParams = await params;
    slug = resolvedParams?.slug || "";

    if (slug) {
      const allProducts = await fetchFullCatalog();
      const targetSlug = (slug || "").toLowerCase().trim();
      product = allProducts.find((p) => {
        if (!p) return false;
        const prodSlug = (p.slug || "").toLowerCase().trim();
        const prodId = (p.id || "").toLowerCase().trim();
        return (
          prodSlug === targetSlug ||
          prodId === targetSlug ||
          makeSlug(p.title) === targetSlug
        );
      }) || null;
    }
  } catch (err) {
    console.error("[ProductPage] Server fetch failed:", err);
  }

  const allProducts = await fetchFullCatalog();
  const categories = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));
  const brands = Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean)));
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.slug !== product?.slug)
    .slice(0, 6);

  const canonicalUrl = `https://globalbiomedical.org/products/${slug}`;
  const productSchema = generateProductSchema(product, canonicalUrl);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    ...(product?.category
      ? [{ name: product.category, url: `/category/${makeSlug(product.category)}` }]
      : []),
    { name: product?.title || slug, url: `/products/${slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const productFaqs = product
    ? [
        {
          question: `What is ${product.title} used for?`,
          answer: `${product.title} is designed for medical laboratories, hospitals, pathology testing, and clinical diagnostic facilities.`,
        },
        {
          question: `How can I request a quotation for ${product.title}?`,
          answer: `Submit the enquiry form on this page or call our sales team. We provide competitive pricing, warranty terms, and express pan-India logistics.`,
        },
        {
          question: `Do you provide installation and technical service for ${product.title}?`,
          answer: `Yes, Global Biomedical provides full installation, staff operation training, technical calibration, and AMC maintenance services.`,
        },
      ]
    : [];

  const faqSchema = generateFAQSchema(productFaqs);

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container py-2">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <ProductDetails slug={slug} product={product} />

      <div className="container pb-5">
        <InternalLinkEngine
          categories={categories}
          brands={brands}
          relatedProducts={relatedProducts}
          currentCategory={product?.category}
          currentBrand={product?.brand}
        />
      </div>
    </>
  );
}
