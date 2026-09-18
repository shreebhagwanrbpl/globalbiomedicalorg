import Contact from "@/app/contact/page";

export async function generateMetadata({ params }) {
  return {
    title: "Contact Global Biomedical | Medical Equipment Quotations & Technical Support",
    description: "Contact Global Biomedical for diagnostic analyzer quotations, laboratory equipment sales, technical installation and service support.",
    alternates: {
      canonical: "https://globalbiomedical.org/contact",
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

  return <Contact city={city} />;
}