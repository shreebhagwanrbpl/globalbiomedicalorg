/**
 * SEO & Structured Data Utility Functions for Global Biomedical
 */

const BASE_URL = "https://globalbiomedical.org";

/**
 * Generate clean URL slug from title/name
 */
export function makeSlug(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Capitalize Words for Display
 */
export function formatName(slug = "") {
  if (!slug) return "";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * SEO Quality Gate: Returns true if page meets quality threshold for indexation
 */
export function validateSEOQuality(pageType, data) {
  if (!data) return false;

  switch (pageType) {
    case "product":
      return Boolean(data.title && (data.slug || data.id));
    case "category":
      return Boolean(data.name && data.products && data.products.length > 0);
    case "brand":
      return Boolean(data.name && data.products && data.products.length > 0);
    case "district":
      return Boolean(data.slug && data.name);
    default:
      return true;
  }
}

/**
 * Generate Product SEO Metadata
 */
export function generateProductMetadata(product, district = null, city = null) {
  if (!product) {
    return {
      title: "Biomedical & Diagnostic Equipment Supplier | Global Biomedical",
      description: "Trusted supplier of medical, laboratory and diagnostic equipment across India.",
    };
  }

  const productName = product.title || "Biomedical Equipment";
  const brandName = product.brand ? ` | ${product.brand}` : "";
  const locationSuffix = city ? ` Supplier in ${city}` : " Supplier in India";

  const title = `${productName}${locationSuffix}${brandName} | Global Biomedical`;

  const description = city
    ? `Buy ${productName} in ${city}. Trusted supplier, dealer and distributor of ${productName} for hospitals, pathology labs and diagnostic centres. Contact Global Biomedical for best pricing and installation.`
    : `Buy ${productName} at best price in India. Trusted supplier, dealer and distributor of ${productName} for hospitals, pathology labs, diagnostic centres and research institutes. Contact Global Biomedical for quotation.`;

  const canonicalUrl = district
    ? `${BASE_URL}/${district}/items/${product.slug}`
    : `${BASE_URL}/products/${product.slug}`;

  const imageUrl = product.images?.[0] || product.image || `${BASE_URL}/globallogo.png`;

  return {
    title,
    description,
    keywords: [
      productName,
      `${productName} Supplier`,
      `${productName} Price`,
      `${productName} Dealer`,
      `${productName} Distributor`,
      city ? `${productName} in ${city}` : `${productName} in India`,
      product.category || "Biomedical Equipment",
      product.brand || "Global Biomedical",
      "Medical Equipment",
      "Laboratory Equipment",
      "Diagnostic Equipment",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Global Biomedical",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/**
 * Generate Category SEO Metadata
 */
export function generateCategoryMetadata(categoryName, productCount = 0) {
  const formattedCategory = formatName(categoryName);
  const slug = makeSlug(categoryName);

  const title = `${formattedCategory} Supplier in India | Diagnostic & Lab Equipment | Global Biomedical`;
  const description = `Browse top quality ${formattedCategory} for hospitals, pathology labs and diagnostic centers across India. Explore ${productCount}+ models, specifications, pricing and quotation options from Global Biomedical.`;
  const canonicalUrl = `${BASE_URL}/category/${slug}`;

  return {
    title,
    description,
    keywords: [
      formattedCategory,
      `${formattedCategory} Supplier`,
      `${formattedCategory} Price`,
      `${formattedCategory} Dealer`,
      `${formattedCategory} Distributor`,
      "Medical Laboratory Equipment",
      "Diagnostic Instruments",
      "Global Biomedical",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Global Biomedical",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${BASE_URL}/globallogo.png`, width: 1200, height: 630, alt: formattedCategory }],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Generate Brand SEO Metadata
 */
export function generateBrandMetadata(brandName, productCount = 0) {
  const formattedBrand = formatName(brandName);
  const slug = makeSlug(brandName);

  const title = `${formattedBrand} Medical & Laboratory Equipment Supplier in India | Global Biomedical`;
  const description = `Authorized supplier and distributor of genuine ${formattedBrand} biomedical and diagnostic equipment in India. Explore ${productCount}+ products with specifications, warranty and service support.`;
  const canonicalUrl = `${BASE_URL}/brand/${slug}`;

  return {
    title,
    description,
    keywords: [
      `${formattedBrand} Equipment`,
      `${formattedBrand} Supplier`,
      `${formattedBrand} Dealer`,
      `${formattedBrand} Distributor`,
      `${formattedBrand} Price India`,
      "Global Biomedical",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Global Biomedical",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${BASE_URL}/globallogo.png`, width: 1200, height: 630, alt: formattedBrand }],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Generate District Location SEO Metadata
 */
export function generateDistrictMetadata(districtSlug, cityName) {
  const title = `Biomedical, Hospital & Laboratory Equipment Supplier in ${cityName} | Global Biomedical`;
  const description = `Global Biomedical is a leading supplier of diagnostic analyzers, pathology equipment, hospital instruments and medical consumables in ${cityName}. Quick delivery, installation & AMC technical support.`;
  const canonicalUrl = `${BASE_URL}/district/${districtSlug}`;

  return {
    title,
    description,
    keywords: [
      `Biomedical Equipment Supplier ${cityName}`,
      `Laboratory Equipment Supplier ${cityName}`,
      `Diagnostic Equipment ${cityName}`,
      `Hospital Equipment Supplier ${cityName}`,
      `Pathology Lab Instruments ${cityName}`,
      `CBC Machine Supplier ${cityName}`,
      `Biochemistry Analyzer ${cityName}`,
      "Global Biomedical",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Global Biomedical",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${BASE_URL}/globallogo.png`, width: 1200, height: 630, alt: `Global Biomedical ${cityName}` }],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Generate Schema.org Product JSON-LD
 */
export function generateProductSchema(product, canonicalUrl) {
  if (!product) return null;

  const imageUrl = product.images?.[0] || product.image || `${BASE_URL}/globallogo.png`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [imageUrl],
    description: product.desc || product.description || product.title,
    sku: product.sku || product.slug || product.id,
    mpn: product.model || product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand || "Global Biomedical",
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "INR",
      price: product.price ? String(product.price) : "0",
      priceValidationUntil: "2030-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Global Biomedical Inc.",
      },
    },
  };
}

/**
 * Generate Schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(items = []) {
  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate Schema.org FAQPage JSON-LD
 */
export function generateFAQSchema(faqs = []) {
  if (!faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Schema.org LocalBusiness / MedicalEquipmentSupplier JSON-LD
 */
export function generateLocalBusinessSchema(cityName, districtSlug) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalEquipmentSupplier",
    name: `Global Biomedical Inc. - ${cityName}`,
    url: `${BASE_URL}/district/${districtSlug}`,
    telephone: "+91-9257984336",
    priceRange: "₹₹-₹₹₹",
    areaServed: {
      "@type": "AdministrativeArea",
      name: cityName,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Global Biomedical Inc.",
      url: BASE_URL,
    },
  };
}
