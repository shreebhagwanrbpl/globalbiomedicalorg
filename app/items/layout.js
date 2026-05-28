export const metadata = {
  title:
    "Biomedical Products, Diagnostic Machines & Medical Equipment | Global Biomedical",
    
  description:
    "Explore premium biomedical products, diagnostic machines, pathology equipment, CBC machines, laboratory instruments and hospital equipment at Global Biomedical. Trusted supplier in India.",

  keywords: [
    "biomedical products",
    "medical equipment",
    "diagnostic machines",
    "pathology equipment",
    "laboratory equipment",
    "hospital equipment",
    "cbc machine supplier",
    "medical device supplier india",
    "diagnostic equipment india",
    "Global Biomedical"
  ],

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical:
      "https://globalbiomedical.org/items",
  },

  openGraph: {
    title:
      "Biomedical Products & Medical Equipment | Global Biomedical",

    description:
      "Trusted supplier of biomedical, diagnostic, pathology, laboratory and hospital equipment in India.",

    url:
      "https://globalbiomedical.org/items",

    siteName:
      "Global Biomedical",

    locale:
      "en_IN",

    type:
      "website",

    images: [
      {
        url:
          "/logo.png",
        width: 1200,
        height: 630,
        alt:
          "Global Biomedical Products",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Biomedical Products & Medical Equipment | Global Biomedical",

    description:
      "Explore premium biomedical and diagnostic products in India.",

    images: ["/logo.png"],
  },
};

export default function ItemsLayout({
  children,
}) {
  return <>{children}</>;
}