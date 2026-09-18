import Link from "next/link";
import { makeSlug } from "@/lib/seo-utils";

const TOP_DISTRICTS = [
  { name: "Jaipur", slug: "jaipur" },
  { name: "Delhi", slug: "delhi" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Jodhpur", slug: "jodhpur" },
  { name: "Kota", slug: "kota" },
  { name: "Udaipur", slug: "udaipur" },
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Indore", slug: "indore" },
];

export default function InternalLinkEngine({
  categories = [],
  brands = [],
  relatedProducts = [],
  currentCategory = null,
  currentBrand = null,
  currentDistrict = null,
}) {
  return (
    <div className="seo-internal-links border-top pt-5 mt-5 bg-light rounded-4 p-4">
      <div className="row g-4">
        {/* Categories Link Section */}
        {categories.length > 0 && (
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark mb-3 text-uppercase fs-7 tracking-wider">
              Equipment Categories
            </h6>
            <ul className="list-unstyled space-y-1 mb-0 fs-7">
              {categories.slice(0, 8).map((cat, idx) => {
                const catName = typeof cat === "string" ? cat : cat.name;
                const slug = makeSlug(catName);
                if (catName === currentCategory) return null;
                return (
                  <li key={idx} className="mb-1">
                    <Link
                      href={`/category/${slug}`}
                      className="text-muted text-decoration-none hover-red"
                    >
                      {catName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Brands Link Section */}
        {brands.length > 0 && (
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark mb-3 text-uppercase fs-7 tracking-wider">
              Featured Brands
            </h6>
            <ul className="list-unstyled space-y-1 mb-0 fs-7">
              {brands.slice(0, 8).map((brand, idx) => {
                const brandName = typeof brand === "string" ? brand : brand.name;
                const slug = makeSlug(brandName);
                if (brandName === currentBrand) return null;
                return (
                  <li key={idx} className="mb-1">
                    <Link
                      href={`/brand/${slug}`}
                      className="text-muted text-decoration-none hover-red"
                    >
                      {brandName} Equipment
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Location Service Hubs */}
        <div className="col-lg-3 col-md-6">
          <h6 className="fw-bold text-dark mb-3 text-uppercase fs-7 tracking-wider">
            Key Service Locations
          </h6>
          <ul className="list-unstyled space-y-1 mb-0 fs-7">
            {TOP_DISTRICTS.map((dist, idx) => {
              if (dist.slug === currentDistrict) return null;
              return (
                <li key={idx} className="mb-1">
                  <Link
                    href={`/district/${dist.slug}`}
                    className="text-muted text-decoration-none hover-red"
                  >
                    Supplier in {dist.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark mb-3 text-uppercase fs-7 tracking-wider">
              Related Equipment
            </h6>
            <ul className="list-unstyled space-y-1 mb-0 fs-7">
              {relatedProducts.slice(0, 6).map((prod, idx) => (
                <li key={idx} className="mb-1 text-truncate">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="text-muted text-decoration-none hover-red"
                    title={prod.title}
                  >
                    {prod.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
