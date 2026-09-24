/**
 * Static website content.
 *
 * This website intentionally does not read website/content data from Firebase
 * or SQLite at runtime. SQLite migration support remains available separately
 * for a future catalog migration.
 */

export const STATIC_HERO = {
  badge: "Trusted Since 2009",
  title: "Advanced Diagnostic Solutions",
  description:
    "Delivering high-quality medical equipment & consumables for hospitals, labs & healthcare professionals.",
  button1Text: "Explore Services",
  button1Link: "/services",
  button2Text: "Contact Us",
  button2Link: "/contact",
  image: "/HA.png",
};

export const STATIC_SERVICES = [
  {
    title: "Diagnostic Equipment Supply",
    icon: "bi-heart-pulse-fill",
    tag: "CORE SERVICE",
    desc: "Comprehensive supply of hematology analyzers, biochemistry systems, electrolyte readers, and clinical equipment.",
    features: ["Brand Genuine Warranty", "Free Initial Demo", "Tailored Pricing Plans"],
  },
  {
    title: "Annual Maintenance (AMC) & Support",
    icon: "bi-tools",
    tag: "24/7 SUPPORT",
    desc: "Preventive maintenance, rapid breakdown engineering response, and original spare part replacement for reliable lab operations.",
    features: ["24-Hour Emergency Dispatch", "Preventive Inspections", "Genuine Parts Only"],
  },
  {
    title: "On-Site Installation & Staff Training",
    icon: "bi-person-badge-fill",
    tag: "TURNKEY SETUP",
    desc: "Complete laboratory setup by biomedical engineers with hands-on staff operational and safety training.",
    features: ["Engineer Setup", "Operator Certification", "Workflow Optimization"],
  },
  {
    title: "Reagents & Consumables Logistics",
    icon: "bi-capsule-capsule",
    tag: "COLD-CHAIN SUPPLY",
    desc: "Supply of original reagents, calibrators, quality controls, and diagnostic testing kits with temperature-aware logistics.",
    features: ["Batch Consistency", "Cold-Chain Shipping", "Stock Alert System"],
  },
  {
    title: "Calibration & Quality Control",
    icon: "bi-shield-check",
    tag: "ISO / NABL STANDARD",
    desc: "Instrument calibration, accuracy validation, and guidance for laboratory quality and accreditation requirements.",
    features: ["Validation Certificates", "IQC & EQAS Assistance", "Precision Diagnostics"],
  },
  {
    title: "Pan-India Express Delivery",
    icon: "bi-truck",
    tag: "500+ DISTRICTS",
    desc: "Fast, secure, and insured door-to-door transit to diagnostic labs and hospitals in major cities and remote locations.",
    features: ["Insured Transit", "Real-Time Tracking", "Safe Packaging"],
  },
];

export const STATIC_CONTACT = {
  address: "Jaipur, Rajasthan, India",
  email: "info@globalbiomedical.org",
  phones: ["+91 9257984336", "+91 8529833535", "+91 9983301657"],
};

export const STATIC_DISTRICTS = [
  { name: "Jaipur", state: "Rajasthan", slug: "jaipur" },
  { name: "Jodhpur", state: "Rajasthan", slug: "jodhpur" },
  { name: "Udaipur", state: "Rajasthan", slug: "udaipur" },
  { name: "Kota", state: "Rajasthan", slug: "kota" },
  { name: "Bikaner", state: "Rajasthan", slug: "bikaner" },
  { name: "Ajmer", state: "Rajasthan", slug: "ajmer" },
  { name: "Alwar", state: "Rajasthan", slug: "alwar" },
  { name: "Bhilwara", state: "Rajasthan", slug: "bhilwara" },
  { name: "Sikar", state: "Rajasthan", slug: "sikar" },
  { name: "Delhi", state: "Delhi", slug: "delhi" },
  { name: "Mumbai", state: "Maharashtra", slug: "mumbai" },
  { name: "Ahmedabad", state: "Gujarat", slug: "ahmedabad" },
  { name: "Lucknow", state: "Uttar Pradesh", slug: "lucknow" },
  { name: "Patna", state: "Bihar", slug: "patna" },
  { name: "Indore", state: "Madhya Pradesh", slug: "indore" },
  { name: "Bhopal", state: "Madhya Pradesh", slug: "bhopal" },
  { name: "Chandigarh", state: "Punjab", slug: "chandigarh" },
];

/**
 * Temporary static catalog used until the SQLite product migration is performed.
 * Product content is intentionally local/static; images use local assets with
 * component-level fallbacks.
 */
export const STATIC_PRODUCTS = [
  {
    id: "static-hematology-analyzer",
    uid: "static-hematology-analyzer",
    slug: "hematology-analyzer",
    title: "Hematology Analyzer",
    description:
      "Automated hematology testing equipment for routine CBC and laboratory diagnostic workflows.",
    desc:
      "Automated hematology testing equipment for routine CBC and laboratory diagnostic workflows.",
    brand: "Global Biomedical",
    model: "Standard Series",
    instrument: "Hematology Analyzer",
    category: "Hematology Analyzer",
    subCategory: "Hematology",
    usage: "Clinical Laboratory",
    throughput: "Routine CBC Testing",
    capacity: "Laboratory System",
    automation: "Automated",
    availability: "Contact for availability",
    images: ["/HA.png"],
    image: "/HA.png",
    isPublished: true,
  },
  {
    id: "static-biochemistry-analyzer",
    uid: "static-biochemistry-analyzer",
    slug: "biochemistry-analyzer",
    title: "Biochemistry Analyzer",
    description:
      "Clinical chemistry analyzer for routine biochemical testing in hospitals and diagnostic laboratories.",
    desc:
      "Clinical chemistry analyzer for routine biochemical testing in hospitals and diagnostic laboratories.",
    brand: "Global Biomedical",
    model: "Standard Series",
    instrument: "Biochemistry Analyzer",
    category: "Biochemistry Analyzer",
    subCategory: "Biochemistry",
    usage: "Clinical Laboratory",
    throughput: "Routine Chemistry Testing",
    capacity: "Laboratory System",
    automation: "Automated",
    availability: "Contact for availability",
    images: ["/HA.png"],
    image: "/HA.png",
    isPublished: true,
  },
  {
    id: "static-electrolyte-analyzer",
    uid: "static-electrolyte-analyzer",
    slug: "electrolyte-analyzer",
    title: "Electrolyte Analyzer",
    description:
      "Laboratory electrolyte testing system for routine clinical analysis and diagnostic workflows.",
    desc:
      "Laboratory electrolyte testing system for routine clinical analysis and diagnostic workflows.",
    brand: "Global Biomedical",
    model: "Standard Series",
    instrument: "Electrolyte Analyzer",
    category: "Electrolyte Analyzer",
    subCategory: "Electrolytes",
    usage: "Clinical Laboratory",
    throughput: "Routine Electrolyte Testing",
    capacity: "Laboratory System",
    automation: "Automated",
    availability: "Contact for availability",
    images: ["/HA.png"],
    image: "/HA.png",
    isPublished: true,
  },
];

export function getStaticProductBySlug(slug = "") {
  const target = decodeURIComponent(String(slug)).toLowerCase().trim();
  return STATIC_PRODUCTS.find((product) => {
    const titleSlug = product.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    return product.slug === target || product.id === target || titleSlug === target;
  }) || null;
}

export const STATIC_CATEGORIES = [...new Set(STATIC_PRODUCTS.map((p) => p.category))];
export const STATIC_BRANDS = [...new Set(STATIC_PRODUCTS.map((p) => p.brand))];
