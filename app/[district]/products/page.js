import ProductsList from "@/app/products/page";

export default function ProductsPage({ params }) {

  const district =
    params?.district || "";

  return (
    <ProductsList city={district} />
  );
}