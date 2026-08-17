"use client";
import "./service.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePathname } from "next/navigation";

export default function Services({ city }) {
  const [currentCity, setCurrentCity] = useState("");
  const [services, setServices] = useState([]);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const pathParts = pathname.split("/").filter(Boolean);

  const formatCity = (name = "") =>
    name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const citySlug = currentCity?.toLowerCase()?.replace(/\s+/g, "-");
  const cityName = formatCity(currentCity);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkDistrict = async () => {
      const slug = pathParts[0];
      if (!slug || ["services", "about", "contact", "items"].includes(slug)) {
        setCurrentCity("");
        return;
      }
      try {
        const snap = await getDoc(
          doc(db, "websites", "globalbiomedicalorg", "districts", slug)
        );
        if (snap.exists()) {
          setCurrentCity(slug);
        } else {
          setCurrentCity("");
        }
      } catch {
        setCurrentCity("");
      }
    };
    checkDistrict();
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "globalbiomedicalorg", "pages", "services")
        );
        if (snap.exists() && snap.data().services?.length > 0) {
          setServices(snap.data().services);
        } else {
          setServices(defaultServicesList);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices(defaultServicesList);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultServicesList = [
    {
      title: "Diagnostic Equipment Supply",
      icon: "bi-heart-pulse-fill",
      tag: "CORE SERVICE",
      desc: "Comprehensive supply of fully automated Hematology Analyzers, Biochemistry Systems, Electrolyte Readers, and Clinical Equipment.",
      features: ["Brand Genuine Warranty", "Free Initial Demo", "Tailored Pricing Plans"]
    },
    {
      title: "Annual Maintenance (AMC) & Support",
      icon: "bi-tools",
      tag: "24/7 SUPPORT",
      desc: "Preventive maintenance, rapid breakdown engineering response, and original spare part replacement for zero lab downtime.",
      features: ["24-Hour Emergency Dispatch", "Preventive Inspections", "Genuine Parts Only"]
    },
    {
      title: "On-Site Installation & Staff Training",
      icon: "bi-person-badge-fill",
      tag: "TURNKEY SETUP",
      desc: "Complete laboratory setup by expert biomedical engineers along with hands-on staff operational and safety training.",
      features: ["Engineer Setup", "Operator Certification", "Workflow Optimization"]
    },
    {
      title: "Reagents & Consumables Logistics",
      icon: "bi-capsule-capsule",
      tag: "COLD-CHAIN SUPPLY",
      desc: "Uninterrupted supply of original reagents, calibrators, quality controls, and diagnostic testing kits with temperature control.",
      features: ["Batch Consistency", "Cold-Chain Shipping", "Stock Alert System"]
    },
    {
      title: "Calibration & Quality Control",
      icon: "bi-shield-check",
      tag: "ISO / NABL STANDARD",
      desc: "Instrument calibration, accuracy validation, and guidance for ISO/NABL laboratory accreditation compliance.",
      features: ["Validation Certificates", "IQC & EQAS Assistance", "Precision Diagnostics"]
    },
    {
      title: "Pan-India Express Delivery",
      icon: "bi-truck",
      tag: "500+ DISTRICTS",
      desc: "Fast, secure, and insured door-to-door transit to diagnostic labs and hospitals in major cities and remote locations.",
      features: ["Insured Transit", "Real-Time Tracking", "Safe Wooden Casing"]
    }
  ];

  const activeServices = services.length > 0 ? services : defaultServicesList;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Biomedical Equipment Services & AMC",
    "provider": {
      "@type": "Organization",
      "name": "Global Biomedical Inc.",
      "url": "https://globalbiomedical.org"
    },
    "serviceType": "Diagnostic Equipment Maintenance, Installation & Supply",
    "areaServed": "India",
    "description": "Comprehensive biomedical equipment sales, 24/7 maintenance support, installation, and cold-chain reagent logistics."
  };

  if (!mounted || loading) {
    return (
      <div className="page-loader">
        <div className="loader-circle"></div>
        <h2 className="text-plum fw-bold">Global Biomedical Inc.</h2>
        <p className="text-muted">Loading medical services...</p>
      </div>
    );
  }

  return (
    <div className="services-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* HERO BANNER */}
      <section className="services-hero-gradient text-white position-relative">
        <div className="container text-center position-relative z-2">
          <span className="badge bg-white text-plum px-3 py-2 rounded-pill fs-7 fw-bold mb-3 shadow-sm text-uppercase border">
            <i className="bi bi-star-fill me-1"></i> Comprehensive Healthcare Services
          </span>
          <h1 className="display-4 fw-extrabold mb-3">
            End-to-End Biomedical & Diagnostic Solutions
          </h1>
          <p className="lead max-w-700 mx-auto text-light opacity-90 mb-4">
            From equipment supply and installation to 24/7 technical support and reagent logistics
            {cityName ? ` in ${cityName}` : " across India"}.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a href="tel:+919257984336" className="btn btn-plum btn-lg px-4 py-2 text-white">
              <i className="bi bi-telephone-fill me-1"></i> Speak To Biomedical Engineer
            </a>
            <Link href={citySlug ? `/${citySlug}/contact` : "/contact"} className="btn btn-outline-light btn-lg px-4 py-2 rounded-pill fw-semibold">
              Request Service Quote
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-plum fw-bold text-uppercase fs-7">Our Expertise</span>
            <h2 className="display-6 fw-bold text-dark mt-1">Services Tailored for Modern Pathology Labs</h2>
            <p className="text-muted">We ensure maximum equipment uptime, clinical precision, and hassle-free operation for healthcare facilities.</p>
          </div>

          <div className="row g-4">
            {activeServices.map((item, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="service-card-modern h-100 p-4 bg-plum-light rounded-4 border-0 shadow-sm transition-all hover-lift d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="service-icon-wrapper bg-plum text-white rounded-4 d-flex align-items-center justify-content-center" style={{ width: 55, height: 55 }}>
                        <i className={`bi ${item.icon || "bi-gear-fill"} fs-3`}></i>
                      </div>
                      <span className="badge bg-white text-plum border border-plum px-2 py-1 rounded-pill small fw-bold">
                        {item.tag || "HEALTHCARE"}
                      </span>
                    </div>

                    <h4 className="fw-bold text-dark mb-2">{item.title}</h4>
                    <p className="text-muted small mb-3 leading-relaxed">{item.desc}</p>

                    {item.features && (
                      <ul className="list-unstyled small text-secondary mb-4">
                        {item.features.map((feat, fIdx) => (
                          <li key={fIdx} className="d-flex align-items-center gap-2 mb-1">
                            <i className="bi bi-check-circle-fill text-plum"></i>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Link href={citySlug ? `/${citySlug}/contact` : "/contact"} className="btn btn-outline-plum w-100 rounded-pill fw-semibold py-2">
                    Inquire For Service <i className="bi bi-chevron-right ms-1"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS WALKTHROUGH */}
      <section className="py-5 bg-plum-light border-top border-bottom">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-plum fw-bold text-uppercase fs-7">How We Serve You</span>
            <h2 className="display-6 fw-bold text-dark mt-1">Our Simple 4-Step Working Process</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-sm-6 col-lg-3">
              <div className="p-4 bg-white rounded-4 h-100 border shadow-sm position-relative">
                <div className="step-number bg-plum text-white fw-bold rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 45, height: 45, fontSize: "1.2rem" }}>
                  1
                </div>
                <h5 className="fw-bold text-dark">Requirement Consultation</h5>
                <p className="small text-muted mb-0">We evaluate your lab test load, space, and budget to recommend optimal instruments.</p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="p-4 bg-white rounded-4 h-100 border shadow-sm position-relative">
                <div className="step-number bg-plum text-white fw-bold rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 45, height: 45, fontSize: "1.2rem" }}>
                  2
                </div>
                <h5 className="fw-bold text-dark">Custom Quote & Demo</h5>
                <p className="small text-muted mb-0">Transparent pricing, equipment specification datasheets, and live working demonstration.</p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="p-4 bg-white rounded-4 h-100 border shadow-sm position-relative">
                <div className="step-number bg-plum text-white fw-bold rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 45, height: 45, fontSize: "1.2rem" }}>
                  3
                </div>
                <h5 className="fw-bold text-dark">Delivery & Setup</h5>
                <p className="small text-muted mb-0">Express dispatch to your location followed by professional engineer installation.</p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="p-4 bg-white rounded-4 h-100 border shadow-sm position-relative">
                <div className="step-number bg-plum text-white fw-bold rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 45, height: 45, fontSize: "1.2rem" }}>
                  4
                </div>
                <h5 className="fw-bold text-dark">Ongoing Support</h5>
                <p className="small text-muted mb-0">Staff operational training, reagent replenishment, and lifetime AMC maintenance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-5 text-black bg-gradient-dark-purple text-center">
        <div className="container py-3">
          <h2 className="display-6 fw-bold mb-3">Need Instant Service or Spare Parts Support?</h2>
          <p className="lead max-w-600 mx-auto text-light opacity-75 mb-4">
            Our technical engineers are available for immediate phone consultation and prompt on-site visits.
          </p>
          <Link href={citySlug ? `/${citySlug}/contact` : "/contact"} className="btn btn-plum btn-lg px-5 py-3 rounded-pill fw-bold text-white shadow">
            Contact Support Team <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}