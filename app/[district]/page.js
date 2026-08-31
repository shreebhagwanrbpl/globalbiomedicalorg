import DistrictPage, { generateMetadata as districtGenerateMetadata } from "../district/[slug]/page";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const district = resolvedParams?.district || "jaipur";

  // Re-use rich location metadata generation
  return districtGenerateMetadata({ params: Promise.resolve({ slug: district }) });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const district = resolvedParams?.district || "jaipur";

  return <DistrictPage params={Promise.resolve({ slug: district })} />;
}