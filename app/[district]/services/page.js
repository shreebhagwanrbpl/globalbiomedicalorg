import Services from "@/app/services/page";

export async function generateMetadata({ params }) {
  return {
    title: "Biomedical & Laboratory Equipment Services | Installation, AMC & Maintenance",
    description: "Biomedical equipment services including installation, calibration, preventive maintenance, AMC contracts, and technical support across India.",
    alternates: {
      canonical: "https://globalbiomedical.org/services",
    },
    robots: {
      index: false,
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

  return <Services city={city} />;
}