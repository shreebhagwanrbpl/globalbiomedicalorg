import About from "@/app/about/page";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const district = resolvedParams?.district || "jaipur";

  return {
    title: "About Global Biomedical | Medical & Laboratory Equipment Supplier",
    description: "Learn about Global Biomedical, a trusted supplier of medical equipment, laboratory instruments, diagnostic devices and biomedical solutions across India.",
    alternates: {
      canonical: "https://globalbiomedical.org/about",
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

  return <About city={city} />;
}