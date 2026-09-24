"use client";
import Hero from "./components/Hero";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Home({ city }) {
  const [mounted, setMounted] = useState(false);
  const [homeLoading, setHomeLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const [currentCity, setCurrentCity] = useState("");
  const [isValidCity, setIsValidCity] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/site-data?type=services", { cache: "no-store" });
        const json = await res.json();
        if (json?.data) setServices(json.data.services || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchCatalogProducts = async () => {
      try {
        const res = await fetch(`/api/catalog?websiteId=globalbiomedicalorg&companyId=global&t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.products)) {
            setProducts(json.products);
            return;
          }
        }
        setProducts([]);
      } catch (err) {
        console.error("Error fetching homepage products:", err);
        setProducts([]);
      } finally {
        setHomeLoading(false);
      }
    };

    fetchCatalogProducts();
  }, []);

  const formatCity = (name = "") =>
    name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const citySlug = currentCity?.toLowerCase()?.replace(/\s+/g, "-");
  const cityName = formatCity(currentCity);

  useEffect(() => {
    const checkDistrict = async () => {
      const slug = pathParts[0];

      if (!slug) {
        setCurrentCity("");
        setIsValidCity(false);
        return;
      }

      try {
        const res = await fetch(`/api/site-data?type=district&slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
        const json = await res.json();

        if (json?.data) {
          setCurrentCity(slug);
          setIsValidCity(true);
        } else {
          setCurrentCity("");
          setIsValidCity(false);
        }
      } catch {
        setCurrentCity("");
        setIsValidCity(false);
      }
    };

    checkDistrict();
  }, [pathname]);

  const icons = ["bi-heart-pulse", "bi-capsule", "bi-tools"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted || homeLoading || pageLoading || animating) {
    return (
      <div className="page-loader">
        <div className="loader-circle"></div>
        <h2>Global Biomedical</h2>
        <p>Loading amazing healthcare solutions...</p>
      </div>
    );
  }

  // Firebase dummy fallback has been removed. Show only live SQLite catalog products.
  const displayProducts = Array.isArray(products) ? products.slice(0, 4) : [];

  return (
    <>
      <Hero city={city} />

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="container-fluid px-3 px-md-5">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <h3>1000+</h3>
              <p>Happy Clients</p>
            </div>
            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <h3>15+</h3>
              <p>Years Experience</p>
            </div>
            <div className="col-md-3 col-6">
              <h3>500+</h3>
              <p>Products</p>
            </div>
            <div className="col-md-3 col-6">
              <h3>24/7</h3>
              <p>Technical Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="py-5 service-section">
        <div className="container-fluid px-3 px-md-5 text-center">
          <h2 className="section-title">Our Core Services</h2>

          <div className="row g-4 mt-2">
            {services.length === 0 ? (
              <div className="col-12">
                <p className="text-muted">Loading Services...</p>
              </div>
            ) : (
              services.slice(0, 3).map((item, i) => (
                <div className="col-md-4" key={i}>
                  <div className="p-4 rounded-4 service-card h-100">
                    <i className={`bi ${icons[i] || "bi-heart-pulse"} fs-1 text-danger`}></i>
                    <h5 className="mt-3 fw-bold">{item.title}</h5>
                    <p className="text-muted small">{item.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* INDUSTRIES WE SERVE */}
      <section className="industry-section py-5">
        <div className="container">
          <h2 className="section-title">Industries We Serve</h2>

          <div className="row g-4 mt-3">
            <div className="col-md-2 col-4">
              <div className="industry-card">
                <i className="bi bi-hospital"></i>
                <p>Hospitals</p>
              </div>
            </div>

            <div className="col-md-2 col-4">
              <div className="industry-card">
                <i className="bi bi-capsule"></i>
                <p>Labs</p>
              </div>
            </div>

            <div className="col-md-2 col-4">
              <div className="industry-card">
                <i className="bi bi-heart-pulse"></i>
                <p>Clinics</p>
              </div>
            </div>

            <div className="col-md-2 col-4">
              <div className="industry-card">
                <i className="bi bi-building"></i>
                <p>Medical Colleges</p>
              </div>
            </div>

            <div className="col-md-2 col-4">
              <div className="industry-card">
                <i className="bi bi-droplet"></i>
                <p>Blood Banks</p>
              </div>
            </div>

            <div className="col-md-2 col-4">
              <div className="industry-card">
                <i className="bi bi-virus"></i>
                <p>Research</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PRODUCTS */}
      <section className="py-5 product-section">
        <div className="container-fluid px-3 px-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="text-start">
              <h2 className="section-title text-start mb-0">Our Products</h2>
            </div>
            <Link
              href={isValidCity ? `/${citySlug}/items` : "/items"}
              className="btn btn-outline-dark rounded-pill px-4 fw-semibold d-none d-md-inline-block"
            >
              View All Products <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          <div className="row g-4">
            {displayProducts.map((item, i) => {
              const itemImg =
                (item.images && Array.isArray(item.images) && item.images[0]) ||
                item.image ||
                item.imageUrl ||
                "/HA.png";

              return (
                <div className="col-lg-3 col-md-6" key={item.id || item.slug || i}>
                  <div className="product-card-pro h-100 d-flex flex-column shadow-sm rounded-4 overflow-hidden border">
                    <div className="product-img-pro position-relative">
                      <img
                        src={itemImg}
                        alt={item.title || "Biomedical Product"}
                        className="img-fluid"
                        onError={(e) => {
                          e.currentTarget.src = "/HA.png";
                        }}
                      />
                    </div>

                    <div className="product-body p-4 d-flex flex-column flex-grow-1 justify-content-between text-start">
                      <div>
                        <h6 className="fw-bold fs-6 mb-2 text-dark">
                          {item.title}
                        </h6>

                        <div className="d-flex flex-wrap gap-2 my-2">
                          {item.brand && (
                            <span className="badge bg-light text-dark border">
                              {item.brand}
                            </span>
                          )}
                          {item.size && (
                            <span className="badge bg-light text-dark border">
                              {item.size}
                            </span>
                          )}
                          {item.usage && (
                            <span className="badge bg-light text-dark border">
                              {item.usage}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={
                          isValidCity
                            ? `/${citySlug}/items`
                            : "/items"
                        }
                        className="product-view-btn text-center text-decoration-none d-flex align-items-center justify-content-center mt-3"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center d-md-none">
            <Link
              href={isValidCity ? `/${citySlug}/items` : "/items"}
              className="btn btn-dark rounded-pill px-5 py-2 fw-semibold"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="testimonial-section py-5">
        <div className="container">
          <h2 className="section-title">Client Testimonials</h2>

          <div className="row mt-4 g-4">
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="text-warning mb-2">★★★★★</div>
                <p>Excellent products and timely support.</p>
                <h6>AIIMS Hospital</h6>
              </div>
            </div>

            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="text-warning mb-2">★★★★★</div>
                <p>Very reliable biomedical supplier.</p>
                <h6>Private Lab</h6>
              </div>
            </div>

            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="text-warning mb-2">★★★★★</div>
                <p>Professional installation and support.</p>
                <h6>Diagnostic Centre</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-5 why-section">
        <div className="container px-3 px-md-5">
          <div className="row align-items-center gy-5">
            {/* LEFT IMAGE */}
            <div className="col-lg-6 text-center">
              <div className="why-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"
                  className="img-fluid rounded-4 shadow-lg"
                  alt="Laboratory Equipment"
                />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="col-lg-6">
              <h2 className="why-title">
                Why Choose <span>Global Biomedical?</span>
              </h2>

              <p className="why-text">
                We deliver trusted diagnostic solutions with high precision and
                reliability for hospitals and laboratories across India.
              </p>

              {/* FEATURES */}
              <div className="mt-4">
                <div className="feature-item d-flex align-items-center mb-3">
                  <i className="bi bi-check-circle-fill text-danger fs-5 me-3"></i>
                  <span>Certified Medical Products</span>
                </div>

                <div className="feature-item d-flex align-items-center mb-3">
                  <i className="bi bi-truck text-danger fs-5 me-3"></i>
                  <span>Pan India Delivery</span>
                </div>

                <div className="feature-item d-flex align-items-center mb-3">
                  <i className="bi bi-headset text-danger fs-5 me-3"></i>
                  <span>Expert Support Team</span>
                </div>
              </div>

              {/* STATS */}
              <div className="row mt-4 stats text-center">
                <div className="col-4">
                  <h3 className="fw-bold">1000+</h3>
                  <p className="small text-muted">Clients</p>
                </div>

                <div className="col-4">
                  <h3 className="fw-bold">15+</h3>
                  <p className="small text-muted">Years</p>
                </div>

                <div className="col-4">
                  <h3 className="fw-bold">500+</h3>
                  <p className="small text-muted">Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="certificate-section py-5">
        <div className="container">
          <h2 className="section-title">Our Certifications</h2>

          <div className="row g-4 mt-2">
            <div className="col-lg-3 col-md-6">
              <div className="certificate-card">
                <div className="certificate-icon">
                  <i className="bi bi-patch-check-fill"></i>
                </div>
                <h5>ISO 9001</h5>
                <p>Quality Management System</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="certificate-card">
                <div className="certificate-icon">
                  <i className="bi bi-award-fill"></i>
                </div>
                <h5>CE Certified</h5>
                <p>European Safety Standard</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="certificate-card">
                <div className="certificate-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5>FDA Approved</h5>
                <p>Trusted Medical Compliance</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="certificate-card">
                <div className="certificate-icon">
                  <i className="bi bi-file-earmark-check-fill"></i>
                </div>
                <h5>IEC Standards</h5>
                <p>International Safety Compliance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 cta-section">
        <div className="container text-center">
          <div className="cta-box p-5 rounded-4 shadow-sm">
            <h2 className="cta-title fw-bold">Need Medical Solutions?</h2>
            <p className="cta-text text-muted">
              Contact us today for premium diagnostic equipment and expert support.
            </p>
            <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
              <Link
                href={isValidCity ? `/${citySlug}/contact` : "/contact"}
              >
                <button className="cta-btn-primary">Get in Touch</button>
              </Link>

              <Link
                href={isValidCity ? `/${citySlug}/items` : "/items"}
              >
                <button className="cta-btn-outline">Request Quote</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS WE DEAL IN */}
      <section className="brands-section py-5">
        <div className="container">
          <h2 className="section-title">Brands We Deal In</h2>

          <div className="row g-4 mt-2">
            {["Abbott", "Mindray", "Roche", "Erba", "Medica", "Transasia"].map(
              (brand, i) => (
                <div className="col-lg-2 col-md-4 col-6" key={i}>
                  <div className="brand-card p-3 rounded-3 text-center border bg-white">
                    <h5 className="mb-0 fw-bold">{brand}</h5>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}