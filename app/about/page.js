"use client";
import "./about.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function About() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Global Biomedical",
    "description": "Leading supplier of biomedical equipment, clinical diagnostic analyzers, and laboratory consumables in India.",
    "publisher": {
      "@type": "Organization",
      "name": "Global Biomedical Inc.",
      "logo": "https://globalbiomedical.org/globallogo.png",
      "telephone": "+91-9257984336",
      "email": "info@globalbiomedical.org",
      "url": "https://globalbiomedical.org"
    }
  };

  if (!mounted || loading) {
    return (
      <div className="page-loader">
        <div className="loader-circle"></div>
        <h2 className="text-plum fw-bold">Global Biomedical Inc.</h2>
        <p className="text-muted">Loading organization details...</p>
      </div>
    );
  }

  return (
    <div className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* HERO BANNER SECTION */}
      <section className="about-hero-section position-relative">
        <div className="container position-relative z-2 text-white text-center">
          <span className="badge bg-white text-plum px-3 py-2 rounded-pill fs-7 fw-bold mb-3 shadow-sm text-uppercase border">
            <i className="bi bi-shield-check me-1"></i> Trusted Medical & Diagnostic Partner
          </span>
          <h1 className="display-4 fw-extrabold mb-3">
            Empowering Healthcare Through Cutting-Edge Diagnostics
          </h1>
          <p className="lead max-w-700 mx-auto text-light opacity-90 mb-4 fs-5">
            Global Biomedical Inc. is a premier supplier of high-precision diagnostic instruments,
            hematology & biochemistry analyzers, and medical consumables across India.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/items" className="btn btn-plum btn-lg px-4 py-2 text-white">
              Explore Product Catalog <i className="bi bi-arrow-right ms-1"></i>
            </Link>
            <Link href="/contact" className="btn btn-outline-light btn-lg px-4 py-2 rounded-pill fw-semibold">
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>

      {/* CORE PROFILE & MISSION */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="pe-lg-4">
                <span className="text-plum fw-bold text-uppercase tracking-wider fs-7">About Our Organization</span>
                <h2 className="display-6 fw-bold mt-2 mb-4 text-dark">
                  Delivering Reliable & Advanced Biomedical Solutions Across India
                </h2>
                <p className="text-secondary fs-6 mb-3 leading-relaxed">
                  Established with a commitment to empower diagnostic healthcare, <strong>Global Biomedical Inc.</strong> specializes in supplying state-of-the-art hematology analyzers, biochemistry systems, electrolyte units, and specialized laboratory reagents.
                </p>
                <p className="text-secondary fs-6 mb-4 leading-relaxed">
                  We partner with world-renowned medical manufacturers to bring uncompromised precision, safety, and operational efficiency to hospitals, clinical labs, pathology centers, and research institutes nationwide.
                </p>

                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="p-3 rounded-4 border-start border-4 border-plum bg-plum-light h-100">
                      <h6 className="fw-bold text-dark mb-1">
                        <i className="bi bi-award-fill text-plum me-2"></i> Quality Assurance
                      </h6>
                      <p className="small text-muted mb-0">ISO & CE certified diagnostic equipment and reagents.</p>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 rounded-4 border-start border-4 border-plum bg-plum-light h-100">
                      <h6 className="fw-bold text-dark mb-1">
                        <i className="bi bi-truck text-plum me-2"></i> Pan-India Reach
                      </h6>
                      <p className="small text-muted mb-0">Doorstep dispatch to 500+ districts with cold-chain care.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 p-md-5 rounded-5 shadow-lg border-0 bg-gradient-dark-purple text-white">
                <h3 className="fw-bold mb-4 text-white">Why Healthcare Professionals Trust Us</h3>
                
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="flex-shrink-0 bg-white bg-opacity-25 p-3 rounded-circle text-white border border-white">
                    <i className="bi bi-cpu-fill fs-4"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">High-Precision Instruments</h5>
                    <p className="small text-light opacity-75 mb-0">Advanced automated analyzers offering pinpoint accuracy, fast throughput, and minimal reagent waste.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="flex-shrink-0 bg-white bg-opacity-25 p-3 rounded-circle text-white border border-white">
                    <i className="bi bi-gear-wide-connected fs-4"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">24/7 Technical & AMC Support</h5>
                    <p className="small text-light opacity-75 mb-0">Dedicated biomedical engineers providing prompt installation, staff training, and preventive maintenance.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="flex-shrink-0 bg-white bg-opacity-25 p-3 rounded-circle text-white border border-white">
                    <i className="bi bi-box-seam-fill fs-4"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Uninterrupted Reagent Supply</h5>
                    <p className="small text-light opacity-75 mb-0">Guaranteed stock of original reagents, controls, and calibrators to keep your diagnostic lab running smoothly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-5 bg-plum-light border-top border-bottom">
        <div className="container py-3">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border">
                <h2 className="display-5 fw-extrabold text-plum mb-1">1000+</h2>
                <p className="fw-semibold text-dark mb-0">Satisfied Clients</p>
                <small className="text-muted">Hospitals & Pathology Labs</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border">
                <h2 className="display-5 fw-extrabold text-plum mb-1">15+</h2>
                <p className="fw-semibold text-dark mb-0">Years Experience</p>
                <small className="text-muted">Industry Excellence</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border">
                <h2 className="display-5 fw-extrabold text-plum mb-1">500+</h2>
                <p className="fw-semibold text-dark mb-0">Products Delivered</p>
                <small className="text-muted">Analyzers & Equipment</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border">
                <h2 className="display-5 fw-extrabold text-plum mb-1">99.8%</h2>
                <p className="fw-semibold text-dark mb-0">Uptime Guarantee</p>
                <small className="text-muted">Reliable Service</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS OF EXCELLENCE */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-plum fw-bold text-uppercase fs-7">Our Core Values</span>
            <h2 className="display-6 fw-bold text-dark mt-1">Built On Quality, Driven By Care</h2>
            <p className="text-muted">We strictly adhere to core principles that prioritize patient health, accurate diagnostics, and long-term customer partnerships.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift transition-all bg-plum-light">
                <div className="icon-box-lg bg-plum text-white rounded-4 mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                  <i className="bi bi-shield-lock-fill fs-3"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Integrity & Authenticity</h4>
                <p className="text-muted mb-0">We supply only genuine equipment directly sourced from certified manufacturers with original warranty protection.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift transition-all bg-plum-light">
                <div className="icon-box-lg bg-plum text-white rounded-4 mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                  <i className="bi bi-lightning-charge-fill fs-3"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Rapid Response</h4>
                <p className="text-muted mb-0">Our rapid response engineering team ensures quick call resolution and minimal downtime for your lab operations.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift transition-all bg-plum-light">
                <div className="icon-box-lg bg-plum text-white rounded-4 mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                  <i className="bi bi-diagram-3-fill fs-3"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Continuous Innovation</h4>
                <p className="text-muted mb-0">We constantly update our portfolio with the latest technological breakthroughs in automated clinical diagnostics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-5 text-white bg-gradient-dark-purple position-relative overflow-hidden">
        <div className="container py-4 text-center position-relative z-2">
          <h2 className="display-6 fw-bold mb-3">Ready to Upgrade Your Laboratory Setup?</h2>
          <p className="lead max-w-600 mx-auto text-light opacity-75 mb-4">
            Connect with our biomedical product specialists today for custom quotations, equipment demonstrations, and competitive deals.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a href="tel:+919257984336" className="btn btn-plum btn-lg px-4 py-2 text-white">
              <i className="bi bi-telephone-fill me-2"></i> Call +91 9257984336
            </a>
            <Link href="/contact" className="btn btn-outline-light btn-lg px-4 py-2 rounded-pill fw-semibold">
              Send Online Inquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}