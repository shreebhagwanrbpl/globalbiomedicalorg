import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import {
  generateDistrictMetadata,
  generateLocalBusinessSchema,
  generateFAQSchema,
  formatName,
  makeSlug,
} from "@/lib/seo-utils";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import InternalLinkEngine from "@/app/components/InternalLinkEngine";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  const cityName = formatName(slug);

  if (!slug) return {};
  return generateDistrictMetadata(slug, cityName);
}

export default async function DistrictPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  const cityName = formatName(slug);

  if (!slug) {
    notFound();
  }

  const allProducts = await fetchFullCatalog();
  const featuredProducts = allProducts.slice(0, 9);
  const categories = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));
  const brands = Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean)));

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Districts", url: "/district/jaipur" },
    { name: cityName, url: `/district/${slug}` },
  ];

  const localSchema = generateLocalBusinessSchema(cityName, slug);

  const districtFaqs = [
    {
      question: `Does Global Biomedical supply medical equipment in ${cityName}?`,
      answer: `Yes, Global Biomedical is a premier supplier of medical equipment, pathology lab instruments, diagnostic analyzers, and healthcare consumables in ${cityName} and surrounding areas.`,
    },
    {
      question: `What types of laboratory analyzers are available in ${cityName}?`,
      answer: `We supply 3-part & 5-part CBC hematology analyzers, fully automatic biochemistry analyzers, electrolyte analyzers, CLIA immunoassay systems, and point-of-care diagnostic devices.`,
    },
    {
      question: `Do you provide installation and technical support in ${cityName}?`,
      answer: `Yes, our certified biomedical engineers provide onsite installation, operational training, calibration, warranty service, and annual maintenance contracts (AMC) in ${cityName}.`,
    },
    {
      question: `How can hospitals or pathology labs in ${cityName} request a quotation?`,
      answer: `You can contact our direct hotline at +91 9257984336 or submit an online inquiry through any product page to receive an official quotation with best pricing.`,
    },
  ];

  const faqSchema = generateFAQSchema(districtFaqs);

  return (
    <>
      {localSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container py-4 mt-4">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <div className="bg-gradient bg-dark text-white rounded-4 p-4 p-md-5 my-4 shadow-sm position-relative">
          <div className="position-relative z-1" style={{ maxWidth: "850px" }}>
            <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase tracking-wider">
              Location Hub • {cityName}
            </span>
            <h1 className="fw-bold display-5 mb-3">
              Biomedical, Hospital & Laboratory Equipment Supplier in {cityName}
            </h1>
            <p className="lead text-light opacity-90 mb-4">
              Global Biomedical delivers genuine medical devices, clinical diagnostic analyzers, pathology instruments, and healthcare consumables to hospitals, clinics, and diagnostic centers across {cityName}.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <a href="tel:+919257984336" className="btn btn-danger btn-lg rounded-pill px-4 fw-bold">
                📞 Call Sales: +91 9257984336
              </a>
              <Link href="/products" className="btn btn-outline-light btn-lg rounded-pill px-4">
                Explore Product Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Local Services & Capabilities */}
        <section className="my-5">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                <div className="fs-1 text-danger mb-2">🚚</div>
                <h3 className="h5 fw-bold text-dark mb-2">Pan-{cityName} Express Delivery</h3>
                <p className="text-secondary small mb-0">
                  Reliable logistics supply chain delivering diagnostic analyzers and lab consumables directly to medical centers in {cityName}.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                <div className="fs-1 text-danger mb-2">⚙️</div>
                <h3 className="h5 fw-bold text-dark mb-2">Onsite Installation & AMC</h3>
                <p className="text-secondary small mb-0">
                  Certified biomedical engineers available for equipment setup, operational training, calibration, and preventive maintenance.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                <div className="fs-1 text-danger mb-2">🛡️</div>
                <h3 className="h5 fw-bold text-dark mb-2">100% Genuine Warranty</h3>
                <p className="text-secondary small mb-0">
                  All equipment comes with original manufacturer warranty, authentic reagents, and long-term technical customer support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products in District */}
        <section className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark m-0 fs-3">
                Biomedical Equipment Available in {cityName}
              </h2>
              <p className="text-muted small m-0">
                High-demand clinical analyzers and pathology instruments for medical laboratories in {cityName}
              </p>
            </div>
            <Link href="/products" className="btn btn-outline-danger btn-sm rounded-pill px-3">
              View All Products
            </Link>
          </div>

          <div className="row g-4">
            {featuredProducts.map((prod) => (
              <div key={prod.uid || prod.slug} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition">
                  <div
                    className="bg-white p-4 d-flex align-items-center justify-content-center"
                    style={{ height: "220px", borderBottom: "1px solid #f1f5f9" }}
                  >
                    <img
                      src={prod.images?.[0] || prod.image || "/placeholder.jpg"}
                      alt={`${prod.title} Supplier in ${cityName}`}
                      className="img-fluid"
                      style={{ maxHeight: "180px", objectFit: "contain" }}
                    />
                  </div>
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <span className="text-danger small text-uppercase tracking-wider d-block mb-1 fw-bold">
                        {prod.brand || "Global Biomedical"}
                      </span>
                      <h3 className="card-title h6 fw-bold text-dark mb-2">
                        {prod.title}
                      </h3>
                      <p className="card-text text-muted small line-clamp-2 mb-3">
                        {prod.desc || prod.description || `Available for immediate delivery in ${cityName}.`}
                      </p>
                    </div>

                    <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                      <span className="small text-muted">
                        In Stock ({cityName})
                      </span>
                      <Link
                        href={`/products/${prod.slug}`}
                        className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                      >
                        Get Quote →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Equipment Categories in Location */}
        <section className="bg-white rounded-4 p-4 p-md-5 my-5 border shadow-sm">
          <h2 className="fw-bold text-dark mb-4">
            Equipment Categories Supplied in {cityName}
          </h2>
          <div className="row g-3">
            {categories.map((cat, idx) => {
              const slug = makeSlug(cat);
              return (
                <div key={idx} className="col-md-4 col-sm-6">
                  <Link
                    href={`/category/${slug}`}
                    className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between text-dark text-decoration-none hover-red border"
                  >
                    <span className="fw-semibold">{cat}</span>
                    <span className="text-danger">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Local FAQs */}
        <section className="bg-white rounded-4 p-4 p-md-5 my-5 border shadow-sm">
          <h2 className="fw-bold text-dark mb-4">
            Frequently Asked Questions ({cityName})
          </h2>
          <div className="accordion accordion-flush" id="districtFaqAccordion">
            {districtFaqs.map((faq, idx) => (
              <div key={idx} className="accordion-item border-bottom py-2">
                <h3 className="accordion-header" id={`dheading${idx}`}>
                  <button
                    className="accordion-button collapsed fw-semibold text-dark bg-transparent shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#dcollapse${idx}`}
                  >
                    {faq.question}
                  </button>
                </h3>
                <div
                  id={`dcollapse${idx}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#districtFaqAccordion"
                >
                  <div className="accordion-body text-secondary small">
                    {faq.answer}
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
          currentDistrict={slug}
        />
      </div>
    </>
  );
}
