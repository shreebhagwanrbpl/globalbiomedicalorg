import HomePage from "./homepage";

export const metadata = {
  title: "Global Biomedical | Medical Equipment Supplier in India",
  description:
    "Global Biomedical is a trusted supplier of medical equipment, laboratory equipment, diagnostic instruments and hospital solutions across India.",
  keywords: [
    "Medical Equipment",
    "Biomedical Equipment",
    "Laboratory Equipment",
    "Hospital Equipment",
    "Diagnostic Equipment",
    "Global Biomedical",
    "Diagnostic",
    "Hospital ",
    "Biomedical",
    "Medical"



  ],
  alternates: {
    canonical: "https://globalbiomedical.org",
  },
  openGraph: {
    title: "Global Biomedical | Medical Equipment Supplier",
    description:
      "Trusted supplier of medical and laboratory equipment across India.",
    url: "https://globalbiomedical.org",
    siteName: "Global Biomedical",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://globalbiomedical.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Global Biomedical",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Biomedical",
    description:
      "Trusted Medical & Laboratory Equipment Supplier.",
    images: ["https://globalbiomedical.org/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return <HomePage />;
}