import Services from "@/app/services/page";

export async function generateMetadata({ params }) {
  const district = params?.district || "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `Biomedical Services in ${city} | Global Biomedical`,
    description: `Global Biomedical provides professional biomedical equipment installation, calibration, maintenance, repair and laboratory equipment services in ${city}. Trusted healthcare solutions with expert technical support.`,

    keywords: [
      `Biomedical Services ${city}`,
      `Medical Equipment Services ${city}`,
      `Laboratory Equipment Services ${city}`,
      `Biomedical Equipment Repair ${city}`,
      `Medical Equipment Installation ${city}`,
      `Calibration Services ${city}`,
      `AMC for Medical Equipment ${city}`,
      "Global Biomedical",
    ],

    alternates: {
      canonical: `https://globalbiomedical.org/${district}/services`,
    },

    openGraph: {
      title: `Biomedical Services in ${city} | Global Biomedical`,
      description:
        `Professional biomedical and laboratory equipment services in ${city}.`,
      url: `https://globalbiomedical.org/${district}/services`,
      siteName: "Global Biomedical",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "https://globalbiomedical.org/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Biomedical Services in ${city}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `Biomedical Services in ${city}`,
      description:
        `Expert installation, repair and maintenance services for medical equipment in ${city}.`,
      images: ["https://globalbiomedical.org/og-image.jpg"],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function DistrictServicesPage({ params }) {
  const { district } = params;

  return <Services city={district} />;
}