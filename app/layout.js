import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./globals.css";

import AOSInit from "./components/AOSInit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  metadataBase: new URL("https://globalbiomedical.org"),

  title: {
    default: "Biomedical, Hospital & Laboratory Equipment Supplier in India | Global Biomedical",
    template: "%s | Global Biomedical",
  },

  description: "Global Biomedical is a trusted supplier of diagnostic, pathology, biomedical, hospital and laboratory equipment in India. We provide CBC machines, Maglumi systems, medical consumables, installation, maintenance and expert support.",

  keywords: [
    "biomedical equipment",
    "medical equipment supplier",
    "hospital equipment",
    "pathology lab equipment",
    "laboratory equipment supplier india",
    "diagnostic equipment",
    "clinical instruments",
    "biomedical supplier india",
    "cbc machine supplier",
    "maglumi analyzer",
    "biochemistry analyzer",
    "electrolyte analyzer",
    "global biomedical",
    "rajbiosis"
  ],

  authors: [{ name: "Global Biomedical Inc." }],
  creator: "Global Biomedical Inc.",
  publisher: "Global Biomedical Inc.",

  alternates: {
    canonical: "https://globalbiomedical.org"
  },

  referrer: "origin-when-cross-origin",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  formatDetection: {
    telephone: false
  },

  openGraph: {
    title: "Global Biomedical | Diagnostic & Laboratory Equipment Supplier in India",
    description: "Global Biomedical is a trusted supplier of biomedical, diagnostic, pathology, hospital & laboratory equipment in India. Get best pricing, installation, maintenance and expert support.",
    url: "https://globalbiomedical.org",
    siteName: "Global Biomedical",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/globallogo.png",
        width: 1200,
        height: 630,
        alt: "Global Biomedical Diagnostic Equipment",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Global Biomedical | Diagnostic & Laboratory Equipment Supplier in India",
    description: "Trusted supplier of biomedical, diagnostic, pathology, hospital & laboratory equipment in India.",
    images: ["/globallogo.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/globallogo.png",
  },

  category: "Medical Equipment",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2a1128",
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://globalbiomedical.org/#organization",
        "name": "Global Biomedical Inc.",
        "alternateName": ["Global Biomedical", "Rajbiosis Private Limited"],
        "url": "https://globalbiomedical.org",
        "logo": "https://globalbiomedical.org/globallogo.png",
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+91-9257984336",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          }
        ],
        "sameAs": [
          "https://www.facebook.com/globalbiomedical",
          "https://wa.me/919257984336"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://globalbiomedical.org/#website",
        "url": "https://globalbiomedical.org",
        "name": "Global Biomedical",
        "publisher": {
          "@id": "https://globalbiomedical.org/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://globalbiomedical.org/items?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <AOSInit />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}