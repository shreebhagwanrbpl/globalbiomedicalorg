import About from "@/app/about/page";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const district = resolvedParams?.district || "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `About Global Biomedical in ${city} | Medical & Laboratory Equipment Supplier`,
    description: `Learn about Global Biomedical, a trusted supplier of medical equipment, laboratory instruments, diagnostic devices and biomedical solutions in ${city} and across India.`,

    keywords: [
      `About Global Biomedical ${city}`,
      `Medical Equipment Supplier ${city}`,
      `Laboratory Equipment Supplier ${city}`,
      `Biomedical Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      "Hospital Equipment",
      "Medical Devices India",
      "Global Biomedical",
    ],

    alternates: {
      canonical: `https://globalbiomedical.org/${district}/about`,
    },

    openGraph: {
      title: `About Global Biomedical in ${city}`,
      description: `Know more about Global Biomedical, a trusted medical and laboratory equipment supplier in ${city}.`,
      url: `https://globalbiomedical.org/${district}/about`,
      siteName: "Global Biomedical",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: "https://globalbiomedical.org/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `About Global Biomedical ${city}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `About Global Biomedical in ${city}`,
      description: `Trusted supplier of medical and laboratory equipment in ${city}.`,
      images: ["https://globalbiomedical.org/og-image.jpg"],
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

  return <About city={city} />;
}