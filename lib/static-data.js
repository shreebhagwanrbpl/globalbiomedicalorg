/**
 * Static website content.
 *
 * This website intentionally does not read website/content data from Firebase
 * or SQLite at runtime. SQLite migration support remains available separately
 * for a future catalog migration.
 */

export const STATIC_HERO = {
  badge: "Trusted Since 2009",
  title: "Precision Diagnostics, Powered by Smarter Biomedical Solutions",
  description:
    "Empowering laboratories and healthcare professionals with dependable diagnostic instruments, laboratory essentials, and biomedical solutions built for accuracy, efficiency, and everyday performance.",
  button1Text: "Request Product Details",
  button1Link: "/items",
  button2Text: "Talk to Our Experts",
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
    icon: "bi-capsule",
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
  contactInfo: [
    { label: "Address", value: "Jaipur, Rajasthan, India" },
    { label: "Email", value: "info@globalbiomedical.org" },
    { label: "Phone", value: "+91 9257984336" },
    { label: "Mobile", value: "+91 8529833535" },
    { label: "Telephone", value: "+91 9983301657" },
    { label: "WhatsApp", value: "+91 9257984336" },
  ],
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
 * Master product catalog fallback ensuring uninterrupted dynamic browsing.
 */
export const STATIC_PRODUCTS = [
  {
    id: "static-hematology-analyzer",
    productId: "static-hematology-analyzer",
    uid: "static-hematology-analyzer",
    slug: "hematology-analyzer",
    title: "Hematology Analyzer (3-Part Differential)",
    name: "Hematology Analyzer (3-Part Differential)",
    description:
      "Advanced 3-part differential automated hematology analyzer designed for high precision complete blood count (CBC) testing in clinical laboratories and hospitals.",
    desc:
      "Advanced 3-part differential automated hematology analyzer designed for high precision complete blood count (CBC) testing in clinical laboratories and hospitals.",
    brand: "Global Biomedical",
    model: "GB-3000 Plus",
    instrument: "Hematology Analyzer",
    category: "Hematology Analyzer",
    subCategory: "3-Part Differential",
    usage: "Clinical Laboratory",
    throughput: "60 Tests / Hour",
    capacity: "21 Parameters + 3 Histograms",
    automation: "Fully Automatic",
    availability: "In Stock - Pan India Delivery",
    images: ["/HA.png"],
    image: "/HA.png",
    isPublished: true,
    websiteIds: ["all"],
  },
  {
    id: "static-biochemistry-analyzer",
    productId: "static-biochemistry-analyzer",
    uid: "static-biochemistry-analyzer",
    slug: "biochemistry-analyzer",
    title: "Fully Automatic Biochemistry Analyzer",
    name: "Fully Automatic Biochemistry Analyzer",
    description:
      "Clinical chemistry analyzer for routine biochemical testing, liver and kidney profile screening in hospitals and diagnostic laboratories.",
    desc:
      "Clinical chemistry analyzer for routine biochemical testing, liver and kidney profile screening in hospitals and diagnostic laboratories.",
    brand: "Global Biomedical",
    model: "GB-Chem 200",
    instrument: "Biochemistry Analyzer",
    category: "Biochemistry Analyzer",
    subCategory: "Clinical Chemistry",
    usage: "Clinical Laboratory & Hospitals",
    throughput: "200 Tests / Hour",
    capacity: "Discrete Random Access",
    automation: "Fully Automatic",
    availability: "In Stock - Pan India Delivery",
    images: ["/HA.png"],
    image: "/HA.png",
    isPublished: true,
    websiteIds: ["all"],
  },
  {
    id: "static-electrolyte-analyzer",
    productId: "static-electrolyte-analyzer",
    uid: "static-electrolyte-analyzer",
    slug: "electrolyte-analyzer",
    title: "Direct ISE Electrolyte Analyzer",
    name: "Direct ISE Electrolyte Analyzer",
    description:
      "State-of-the-art ion-selective electrode (ISE) electrolyte analyzer providing fast, accurate measurement of Na+, K+, Cl-, iCa2+, and pH in whole blood, serum, and plasma.",
    desc:
      "State-of-the-art ion-selective electrode (ISE) electrolyte analyzer providing fast, accurate measurement of Na+, K+, Cl-, iCa2+, and pH in whole blood, serum, and plasma.",
    brand: "Global Biomedical",
    model: "GB-Lyte 500",
    instrument: "Electrolyte Analyzer",
    category: "Electrolyte Analyzer",
    subCategory: "ISE Systems",
    usage: "Critical Care & Clinical Laboratory",
    throughput: "60 Samples / Hour",
    capacity: "5 Ion Channels",
    automation: "Automated ISE",
    availability: "In Stock - Pan India Delivery",
    images: ["/HA.png"],
    image: "/HA.png",
    isPublished: true,
    websiteIds: ["all"],
  },
  {
    id: "static-immunoassay-analyzer",
    productId: "static-immunoassay-analyzer",
    uid: "static-immunoassay-analyzer",
    slug: "immunoassay-analyzer",
    title: "Chemiluminescence Immunoassay (CLIA) Analyzer",
    name: "Chemiluminescence Immunoassay (CLIA) Analyzer",
    description:
      "High-sensitivity automated chemiluminescence immunoassay analyzer for quantitative detection of thyroid hormones, fertility profiles, cardiac markers, and infectious diseases.",
    desc:
      "High-sensitivity automated chemiluminescence immunoassay analyzer for quantitative detection of thyroid hormones, fertility profiles, cardiac markers, and infectious diseases.",
    brand: "Global Biomedical",
    model: "GB-CLIA 180",
    instrument: "Immunoassay Analyzer",
    category: "Immunoassay Analyzer",
    subCategory: "CLIA Systems",
    usage: "Endocrinology & Immunology Diagnostics",
    throughput: "180 Tests / Hour",
    capacity: "Magnetic Microparticle CLIA",
    automation: "Fully Automatic",
    availability: "In Stock - Pan India Delivery",
    images: ["/HA.png"],
    image: "/HA.png",
    isPublished: true,
    websiteIds: ["all"],
  },
  {
    id: "static-hematology-analyzer-5part",
    productId: "static-hematology-analyzer-5part",
    uid: "static-hematology-analyzer-5part",
    slug: "hematology-analyzer-5-part",
    title: "5-Part Auto Hematology Analyzer",
    name: "5-Part Auto Hematology Analyzer",
    description:
      "Laser scatter and flow cytometry 5-part differential hematology system delivering 29 parameters with abnormal cell flagging for advanced pathology laboratories.",
    desc:
      "Laser scatter and flow cytometry 5-part differential hematology system delivering 29 parameters with abnormal cell flagging for advanced pathology laboratories.",
    brand: "Global Biomedical",
    model: "GB-5000 Pro",
    instrument: "5-Part Hematology Analyzer",
    category: "Hematology Analyzer",
    subCategory: "5-Part Differential",
    usage: "Advanced Pathology Centers",
    throughput: "60 Tests / Hour",
    capacity: "29 Parameters + 3D Scattergram",
    automation: "Fully Automatic",
    availability: "In Stock - Pan India Delivery",
    images: ["/HA.png"],
    image: "/HA.png",
    isPublished: true,
    websiteIds: ["all"],
  },
  {
    id: "static-laboratory-consumables",
    productId: "static-laboratory-consumables",
    uid: "static-laboratory-consumables",
    slug: "laboratory-consumables",
    title: "Laboratory Diagnostic Reagents & Controls Pack",
    name: "Laboratory Diagnostic Reagents & Controls Pack",
    description:
      "Certified cold-chain supplied clinical diagnostic reagents, dedicated diluents, lysing reagents, calibrators, and quality control packs for reliable test results.",
    desc:
      "Certified cold-chain supplied clinical diagnostic reagents, dedicated diluents, lysing reagents, calibrators, and quality control packs for reliable test results.",
    brand: "Global Biomedical",
    model: "GB-Reagent Standard Pack",
    instrument: "Laboratory Consumables",
    category: "Laboratory Consumables",
    subCategory: "Reagents & Controls",
    usage: "Routine Laboratory Operation",
    throughput: "Standard Pack Sizes",
    capacity: "Batch Tested Quality",
    automation: "Ready-to-Use",
    availability: "Immediate Dispatch",
    images: ["/HA.png"],
    image: "/HA.png",
    isPublished: true,
    websiteIds: ["all"],
  },
];

export function getStaticProductBySlug(slug = "") {
  const target = decodeURIComponent(String(slug)).toLowerCase().trim();
  return (
    STATIC_PRODUCTS.find((product) => {
      const titleSlug = product.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      return (
        product.slug === target ||
        product.id === target ||
        product.productId === target ||
        titleSlug === target
      );
    }) || null
  );
}

export const STATIC_CATEGORIES = [
  ...new Set(STATIC_PRODUCTS.map((p) => p.category)),
];
export const STATIC_BRANDS = [
  ...new Set(STATIC_PRODUCTS.map((p) => p.brand)),
];
