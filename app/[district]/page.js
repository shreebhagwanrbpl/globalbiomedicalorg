import Home from "../page";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const district = resolvedParams?.district || "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `Medical Equipment Supplier in ${city} | Global Biomedical`,
    description: `Global Biomedical is a trusted supplier of medical equipment, laboratory equipment, diagnostic instruments and biomedical solutions in ${city}. We provide installation, maintenance, genuine products and technical support across India.`,

    keywords: [
      `Medical Equipment Supplier ${city}`,
      `Laboratory Equipment Supplier ${city}`,
      `Biomedical Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      `Hospital Equipment ${city}`,
      `Medical Devices ${city}`,
      `Lab Instruments ${city}`,
      `Biomedical Company ${city}`,
      "Global Biomedical",
    ],

    alternates: {
      canonical: `https://globalbiomedical.org/${district}`,
    },

    openGraph: {
      title: `Medical Equipment Supplier in ${city} | Global Biomedical`,
      description:
        `Trusted supplier of medical and laboratory equipment in ${city}.`,
      url: `https://globalbiomedical.org/${district}`,
      siteName: "Global Biomedical",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "https://globalbiomedical.org/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Global Biomedical ${city}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `Medical Equipment Supplier in ${city}`,
      description:
        `Medical, laboratory and biomedical equipment supplier in ${city}.`,
      images: ["https://globalbiomedical.org/og-image.jpg"],
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

export default async function Page({ params }) {
  const resolvedParams = await params;

  const district = resolvedParams?.district || "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <Home city={city} />;
}