import Contact from "@/app/contact/page";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const district = resolvedParams?.district || "";

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `Contact Global Biomedical in ${city} | Medical Equipment Supplier`,
    description: `Contact Global Biomedical in ${city} for medical equipment, laboratory equipment, diagnostic instruments, quotations, installation and technical support.`,

    keywords: [
      `Medical Equipment Supplier ${city}`,
      `Laboratory Equipment Supplier ${city}`,
      `Biomedical Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      `Hospital Equipment ${city}`,
      `Medical Device Supplier ${city}`,
      "Global Biomedical",
    ],

    alternates: {
      canonical: `https://globalbiomedical.org/${district}/contact`,
    },

    openGraph: {
      title: `Contact Global Biomedical in ${city}`,
      description: `Get in touch with Global Biomedical in ${city} for premium medical and laboratory equipment.`,
      url: `https://globalbiomedical.org/${district}/contact`,
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
      title: `Contact Global Biomedical in ${city}`,
      description: `Medical & Laboratory Equipment Supplier in ${city}.`,
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
  const district = resolvedParams?.district || "";

  return <Contact city={district} />;
}