import Contact from "@/app/contact/page";

export default async function Page({ params }) {

  const resolvedParams =
    await params;

  const district =
    resolvedParams?.district || "";

  return (
    <Contact city={district} />
  );
}