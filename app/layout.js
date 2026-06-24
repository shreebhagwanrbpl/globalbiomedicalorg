import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./globals.css";

import AOSInit from "./components/AOSInit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  metadataBase: new URL(
    "https://globalbiomedical.org"
  ),

  title: {
    default:
       "Biomedical, Hospital & Laboratory Equipment Supplier in India | Global Biomedical",
    template:
      "%s | Global Biomedical",
  },

  description:
"Global Biomedical is a trusted supplier of diagnostic, pathology, biomedical, hospital and laboratory equipment in India. We provide CBC machines, Maglumi systems, medical consumables, installation, maintenance and expert support.",
  

keywords: [
    "biomedical equipment",
    "medical equipment",
    "hospital equipment",
    "pathology equipment",
    "laboratory equipment",
    "diagnostic equipment",
    "clinical instruments",
    "biomedical supplier india",
    "medical equipment supplier",
    "diagnostic machine supplier",
    "cbc machine",
    "maglumi machine",
    "hospital machine supplier"
  ],

  authors: [
    {
      name:
        "Global Biomedical",
    },
  ],

  creator:
    "Global Biomedical",

  publisher:
    "Global Biomedical",

  alternates: {
    canonical:"https://globalbiomedical.org"
  },

     referrer:"origin-when-cross-origin",
  
     robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview":
        "large",
      "max-video-preview":
        -1,
      "max-snippet":
        -1,
    },
  },

  formatDetection:{
telephone:false
},

openGraph: {
  title:
    "Global Biomedical | Diagnostic & Laboratory Equipment Supplier in India",

  description:
    "Global Biomedical is a trusted supplier of biomedical, diagnostic, pathology, hospital & laboratory equipment in India. Get best pricing, installation, maintenance and expert support.",

  url:
    "https://globalbiomedical.org",

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
        "Global Biomedical Diagnostic Equipment",
    },
  ],
},

  twitter: {
  card:
    "summary_large_image",

  title:
    "Global Biomedical | Diagnostic & Laboratory Equipment Supplier in India",

  description:
    "Trusted supplier of biomedical, diagnostic, pathology, hospital & laboratory equipment in India.",

  images: ["/logo.png"],
},

icons: {
  icon: "/favicon.ico",
  shortcut: "/favicon.ico",
  apple: "/apple-touch-icon.png",
},


  category:
    "Medical Equipment",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <AOSInit />

        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}