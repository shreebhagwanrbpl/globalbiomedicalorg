import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import {
  generateBrandMetadata,
  makeSlug,
  formatName,
} from "@/lib/seo-utils";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import InternalLinkEngine from "@/app/components/InternalLinkEngine";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";

  const allProducts = await fetchFullCatalog();
  const matchedProducts = allProducts.filter(
    (p) => makeSlug(p.brand || "") === slug
  );

  const brandName = matchedProducts[0]?.brand || formatName(slug);
  return generateBrandMetadata(brandName, matchedProducts.length);
}

export default async function BrandPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";

  const allProducts = await fetchFullCatalog();

  const brandProducts = allProducts.filter(
    (p) => makeSlug(p.brand || "") === slug
  );

  if (!brandProducts || brandProducts.length === 0) {
    notFound();
  }

  const brandName = brandProducts[0]?.brand || formatName(slug);

  const brands = Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean)));
  const categories = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: `${brandName} Equipment`, url: `/brand/${slug}` },
  ];

  return (
    <div className="container py-4 mt-4">
      <Breadcrumbs items={breadcrumbs} />

      {/* Brand Hero */}
      <div className="bg-gradient bg-dark text-white rounded-4 p-4 p-md-5 my-4 position-relative overflow-hidden shadow-sm">
        <div className="position-relative z-1" style={{ maxWidth: "800px" }}>
          <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase tracking-wider">
            Brand Showcase
          </span>
          <h1 className="fw-bold display-5 mb-3">{brandName} Equipment</h1>
          <p className="lead text-light opacity-90 mb-0">
            Discover genuine {brandName} medical devices, diagnostic instruments, analyzers, and laboratory consumables.
            Supplied with complete technical warranty, calibration, and installation support across India.
          </p>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <section className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0 text-slate-800 fs-3">
            {brandName} Products ({brandProducts.length})
          </h2>
        </div>

        <div className="row g-4">
          {brandProducts.map((prod) => (
            <div key={prod.uid || prod.slug} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition">
                <div
                  className="bg-white p-4 d-flex align-items-center justify-content-center"
                  style={{ height: "240px", borderBottom: "1px solid #f1f5f9" }}
                >
                  <img
                    src={prod.images?.[0] || prod.image || "/placeholder.jpg"}
                    alt={`${prod.title} - ${brandName}`}
                    className="img-fluid"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <span className="text-muted small text-uppercase tracking-wider d-block mb-1">
                      {prod.category || "Biomedical Equipment"}
                    </span>
                    <h3 className="card-title h5 fw-bold text-dark mb-2">
                      {prod.title}
                    </h3>
                    <p className="card-text text-muted small line-clamp-2 mb-3">
                      {prod.desc || prod.description || `Genuine ${brandName} biomedical equipment.`}
                    </p>
                  </div>

                  <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="small text-muted">
                      Model: <strong>{prod.model || "Standard"}</strong>
                    </span>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="btn btn-outline-danger btn-sm rounded-pill px-3 font-semibold"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Link Engine */}
      <InternalLinkEngine
        categories={categories}
        brands={brands}
        currentBrand={brandName}
      />
    </div>
  );
}
