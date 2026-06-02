export async function generateMetadata({
  params,
}) {
  const slug =
    params?.district || "jaipur";

  const district =
    decodeURIComponent(slug)
      .replace(/-/g, " ")
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );

  const url = `https://globalbiomedical.org/${slug}/items`;

  return {
    metadataBase:
      new URL(
        "https://globalbiomedical.org"
      ),

    title: `Biomedical Products in ${district} | Diagnostic & Laboratory Equipment`,

    description: `Buy biomedical, pathology, CBC machines, laboratory and hospital equipment in ${district}. Trusted diagnostic equipment supplier with installation and support.`,

    keywords: [
      `Biomedical Products in ${district}`,
      `Biomedical Supplier in ${district}`,
      `Medical Equipment in ${district}`,
      `Diagnostic Equipment in ${district}`,
      `Laboratory Equipment in ${district}`,
      `Hospital Equipment in ${district}`,
      `CBC Machine in ${district}`,
      `Pathology Equipment in ${district}`,
      `Diagnostic Machine in ${district}`,
      `Medical Device Supplier ${district}`,
      `Biomedical Products Near ${district}`,
      `Global Biomedical ${district}`,
    ],

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        maxSnippet: -1,
        maxImagePreview:
          "large",
        maxVideoPreview:
          -1,
      },
    },

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `Biomedical Products in ${district} | Global Biomedical`,

      description: `Trusted supplier of biomedical, pathology, laboratory & diagnostic equipment in ${district}.`,

      url,

      siteName:
        "Global Biomedical",

      locale: "en_IN",

      type: "website",

      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: `Biomedical Products in ${district}`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title: `Biomedical Products in ${district}`,

      description: `Buy biomedical & laboratory equipment in ${district}.`,

      images: ["/logo.png"],
    },
  };
}

export default function Layout({
  children,
}) {
  return children;
}