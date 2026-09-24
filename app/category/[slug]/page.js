import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import {
  generateCategoryMetadata,
  generateFAQSchema,
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
    (p) => makeSlug(p.category || "") === slug || makeSlug(p.subCategory || "") === slug
  );

  const categoryName = matchedProducts[0]?.category || formatName(slug);
  return generateCategoryMetadata(categoryName, matchedProducts.length);
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";

  const allProducts = await fetchFullCatalog();

  const categoryProducts = allProducts.filter(
    (p) => makeSlug(p.category || "") === slug || makeSlug(p.subCategory || "") === slug
  );

  if (!categoryProducts || categoryProducts.length === 0) {
    notFound();
  }

  const categoryName = categoryProducts[0]?.category || formatName(slug);

  // Extract distinct brands and categories for internal linking
  const brands = Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean)));
  const categories = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: categoryName, url: `/category/${slug}` },
  ];

  const categoryFaqs = [
    {
      question: `What are ${categoryName} used for?`,
      answer: `${categoryName} are clinical laboratory instruments used by pathology labs, diagnostic centers, and hospitals for accurate medical testing, analysis, and patient diagnosis.`,
    },
    {
      question: `What factors affect the price of ${categoryName}?`,
      answer: `Pricing depends on automation level (fully automatic vs semi-automatic), throughput capacity (tests per hour), brand, optical precision, and included warranty/AMC support.`,
    },
    {
      question: `Does Global Biomedical provide installation support for ${categoryName}?`,
      answer: `Yes, Global Biomedical provides complete installation, user training, technical calibration, and ongoing AMC maintenance support across India.`,
    },
    {
      question: `How can I request a price quotation for ${categoryName}?`,
      answer: `Select your preferred model on our website and click 'View Details' or submit an enquiry form. Our technical sales team will send an official quotation within 24 hours.`,
    },
  ];

  const faqSchema = generateFAQSchema(categoryFaqs);

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container py-4 mt-4">
        <Breadcrumbs items={breadcrumbs} />

        {/* Category Banner */}
        <div className="bg-dark text-white rounded-4 p-4 p-md-5 my-4 position-relative overflow-hidden shadow-sm">
          <div className="position-relative z-1" style={{ maxWidth: "800px" }}>
            <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase tracking-wider">
              Category Hub
            </span>
            <h1 className="fw-bold display-5 mb-3">{categoryName}</h1>
            <p className="lead text-light opacity-90 mb-0">
              Browse top-rated {categoryName} for hospitals, pathology labs, and clinical centers.
              Supplied with genuine manufacturer warranty, installation, and express pan-India delivery.
            </p>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <section className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0 text-slate-800 fs-3">
              Available Models ({categoryProducts.length})
            </h2>
          </div>

          <div className="row g-4">
            {categoryProducts.map((prod) => (
              <div key={prod.uid || prod.slug} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition">
                  <div
                    className="bg-white p-4 d-flex align-items-center justify-content-center"
                    style={{ height: "240px", borderBottom: "1px solid #f1f5f9" }}
                  >
                    <img
                      src={prod.images?.[0] || prod.image || "/placeholder.jpg"}
                      alt={`${prod.title} - ${prod.brand || categoryName}`}
                      className="img-fluid"
                      style={{ maxHeight: "200px", objectFit: "contain" }}
                    />
                  </div>
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      {prod.brand && (
                        <span className="text-danger fw-semibold small text-uppercase tracking-wider d-block mb-1">
                          {prod.brand}
                        </span>
                      )}
                      <h3 className="card-title h5 fw-bold text-dark mb-2">
                        {prod.title}
                      </h3>
                      <p className="card-text text-muted small line-clamp-2 mb-3">
                        {prod.desc || prod.description || `High-performance ${categoryName} for medical laboratories.`}
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

        {/* Category Knowledge & SEO Section */}
        <section className="bg-white rounded-4 p-4 p-md-5 my-5 border shadow-sm">
          <h2 className="fw-bold mb-3 text-dark">
            Complete Buying Guide for {categoryName}
          </h2>
          <p className="text-secondary leading-relaxed">
            When selecting {categoryName} for your healthcare facility or pathology laboratory,
            evaluating test throughput, reagent consumption, calibration stability, and technical support availability is essential.
            Global Biomedical works directly with trusted diagnostic manufacturers to deliver reliable, accredited laboratory equipment.
          </p>

          <h3 className="h4 fw-bold mt-4 mb-2 text-dark">Key Applications</h3>
          <ul className="text-secondary mb-4">
            <li>Hospitals and clinical diagnostic laboratores</li>
            <li>Pathology testing centers & reference labs</li>
            <li>Blood banks, medical research institutions, and universities</li>
          </ul>

          <h3 className="h4 fw-bold mt-4 mb-3 text-dark">Frequently Asked Questions</h3>
          <div className="accordion accordion-flush" id="categoryFaqAccordion">
            {categoryFaqs.map((faq, idx) => (
              <div key={idx} className="accordion-item border-bottom py-2">
                <h4 className="accordion-header" id={`heading${idx}`}>
                  <button
                    className="accordion-button collapsed fw-semibold text-dark bg-transparent shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${idx}`}
                  >
                    {faq.question}
                  </button>
                </h4>
                <div
                  id={`collapse${idx}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#categoryFaqAccordion"
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
          currentCategory={categoryName}
        />
      </div>
    </>
  );
}
