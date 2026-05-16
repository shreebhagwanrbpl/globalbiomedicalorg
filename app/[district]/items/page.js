import Products from "@/app/products/page";

export default function Page({
  params,
}) {
  const district =
    params?.district || "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

  return (
    <Products city={city} />
  );
}