"use client";

import toast, { Toaster } from "react-hot-toast";
import "./contact.css";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import ContactBanner from "./Contact.png";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

const POPULAR_DISTRICTS = [
  { name: "Jaipur", state: "Rajasthan", slug: "jaipur" },
  { name: "Jodhpur", state: "Rajasthan", slug: "jodhpur" },
  { name: "Udaipur", state: "Rajasthan", slug: "udaipur" },
  { name: "Kota", state: "Rajasthan", slug: "kota" },
  { name: "Bikaner", state: "Rajasthan", slug: "bikaner" },
  { name: "Ajmer", state: "Rajasthan", slug: "ajmer" },
  { name: "Alwar", state: "Rajasthan", slug: "alwar" },
  { name: "Bhilwara", state: "Rajasthan", slug: "bhilwara" },
  { name: "Sikar", state: "Rajasthan", slug: "sikar" },
  { name: "Delhi", state: "Delhi", slug: "delhi" },
  { name: "Mumbai", state: "Maharashtra", slug: "mumbai" },
  { name: "Ahmedabad", state: "Gujarat", slug: "ahmedabad" },
  { name: "Lucknow", state: "Uttar Pradesh", slug: "lucknow" },
  { name: "Patna", state: "Bihar", slug: "patna" },
  { name: "Indore", state: "Madhya Pradesh", slug: "indore" },
  { name: "Bhopal", state: "Madhya Pradesh", slug: "bhopal" },
  { name: "Chandigarh", state: "Punjab", slug: "chandigarh" },
];

export default function Contact({ city }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const pathParts = pathname.split("/").filter(Boolean);

  const initialSlug = (pathParts[0] && !["contact", "about", "services", "items"].includes(pathParts[0]))
    ? pathParts[0]
    : "jaipur";

  const [selectedDistrictSlug, setSelectedDistrictSlug] = useState(initialSlug);
  const [currentCity, setCurrentCity] = useState(initialSlug);
  const [stateName, setStateName] = useState("Rajasthan");

  const formatCity = (name = "") =>
    name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const cityName = formatCity(currentCity);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDistrictDetails = async () => {
      const slug = selectedDistrictSlug;
      if (!slug) return;

      try {
        const snap = await getDoc(
          doc(db, "websites", "globalbiomedicalorg", "districts", slug)
        );

        if (snap.exists()) {
          const data = snap.data();
          setCurrentCity(slug);
          setStateName(data?.state || "India");
        } else {
          const found = POPULAR_DISTRICTS.find(d => d.slug === slug);
          setCurrentCity(slug);
          setStateName(found ? found.state : "India");
        }
      } catch (err) {
        console.error("Error loading district info:", err);
        setCurrentCity(slug);
        setStateName("India");
      } finally {
        setLoading(false);
      }
    };

    fetchDistrictDetails();
  }, [selectedDistrictSlug]);

  const handleDistrictChange = (slug) => {
    setSelectedDistrictSlug(slug);
    if (pathParts[0] && !["contact", "about", "services", "items"].includes(pathParts[0])) {
      router.push(`/${slug}/contact`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const onlyLetters = value.replace(/[^A-Za-z\s]/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyLetters }));
      return;
    }

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, phone, subject, message } = form;

    if (!name.trim() || !email.trim() || !phone.trim() || !subject.trim() || !message.trim()) {
      return toast.error("Please fill all fields");
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return toast.error("Name can contain only letters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email");
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return toast.error("Enter a valid 10-digit mobile number");
    }

    if (subject.trim().length < 3) {
      return toast.error("Subject must be at least 3 characters");
    }

    if (message.trim().length < 10) {
      return toast.error("Message must be at least 10 characters");
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "globalbiomedicalorg",
          "contactQueries"
        ),
        {
          ...form,
          city: cityName,
          districtSlug: selectedDistrictSlug,
          createdAt: serverTimestamp()
        }
      );

      toast.success(`Message sent successfully for ${cityName} area!`);

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": `Contact Global Biomedical ${cityName}`,
    "description": `Get in touch with Global Biomedical for equipment inquiries, sales, and technical service in ${cityName}, ${stateName}.`,
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": `Global Biomedical - ${cityName}`,
      "image": "https://globalbiomedical.org/globallogo.png",
      "telephone": "+91-9257984336",
      "email": "info@globalbiomedical.org",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": cityName,
        "addressRegion": stateName,
        "addressCountry": "IN"
      }
    }
  };

  if (!mounted || loading) {
    return (
      <div className="page-loader">
        <div className="loader-circle"></div>
        <h2 className="text-plum fw-bold">Global Biomedical Inc.</h2>
        <p className="text-muted">Loading contact details & location map...</p>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <Toaster position="top-right" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* HERO */}
      <section className="contact-hero position-relative">
        <Image
          src={ContactBanner}
          alt="Contact Us"
          fill
          priority
          className="contact-banner"
        />
        <div className="hero-overlay d-flex flex-column align-items-center justify-content-center text-center text-white p-4">
          <span className="badge bg-white text-plum px-3 py-2 rounded-pill fw-bold mb-2 border">
            PAN-INDIA BIOMEDICAL SUPPORT
          </span>
          <h1 className="display-5 fw-extrabold m-0 text-white">
            Reach Out To Us In {cityName}
          </h1>
          <p className="lead text-light opacity-90 mt-2 max-w-600">
            Dedicated equipment sales, maintenance engineering & doorstep delivery across {cityName} and nearby districts.
          </p>
        </div>
      </section>

      {/* DISTRICT SELECTOR STRIP */}
      <section className="py-3 bg-plum-dark text-white border-bottom">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt-fill text-plum fs-5"></i>
              <strong className="text-white fs-6">Select District Location:</strong>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select
                className="form-select bg-white text-dark border-0 rounded-pill px-3 py-1 shadow-none fw-semibold"
                style={{ maxWidth: "250px", cursor: "pointer" }}
                value={selectedDistrictSlug}
                onChange={(e) => handleDistrictChange(e.target.value)}
              >
                {POPULAR_DISTRICTS.map((dist) => (
                  <option key={dist.slug} value={dist.slug}>
                    {dist.name} ({dist.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* QUICK PILLS */}
          <div className="d-flex align-items-center gap-2 flex-wrap mt-3 pt-2 border-top border-white border-opacity-25">
            <span className="small text-light opacity-75 me-1">Popular:</span>
            {POPULAR_DISTRICTS.slice(0, 8).map((dist) => (
              <button
                key={dist.slug}
                onClick={() => handleDistrictChange(dist.slug)}
                className={`btn btn-sm rounded-pill px-3 transition-all ${
                  selectedDistrictSlug === dist.slug
                    ? "btn-plum text-white fw-bold"
                    : "btn-outline-light text-light"
                }`}
              >
                {dist.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-5">
            {/* LEFT INFO */}
            <div className="col-lg-5" data-aos="fade-right">
              <div className="p-4 p-md-5 bg-plum-light rounded-4 shadow-sm border border-plum border-opacity-25 h-100">
                <span className="badge bg-plum text-white px-3 py-1 rounded-pill mb-2 fw-bold">
                  DIRECT CONTACT
                </span>
                <h3 className="fw-bold text-dark mb-3">Get In Touch</h3>
                <p className="text-muted small mb-4">
                  Have a product inquiry, pricing quote request, or urgent maintenance call in <strong>{cityName}</strong>? Our technical specialists are ready to assist.
                </p>

                <div className="contact-info d-flex flex-column gap-4">
                  <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-white border">
                    <div className="p-2 bg-plum text-white rounded-circle">
                      <i className="bi bi-geo-alt-fill fs-4"></i>
                    </div>
                    <div>
                      <strong className="text-dark d-block mb-1">Service & Office Location</strong>
                      <p className="text-secondary small mb-0 fw-medium">
                        {cityName}, {stateName}, India
                      </p>
                      <small className="text-muted">Serving all medical centers in {cityName} district</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-white border">
                    <div className="p-2 bg-plum text-white rounded-circle">
                      <i className="bi bi-envelope-fill fs-4"></i>
                    </div>
                    <div>
                      <strong className="text-dark d-block mb-1">Email Support</strong>
                      <a href="mailto:info@globalbiomedical.org" className="text-plum text-decoration-none fw-semibold small">
                        info@globalbiomedical.org
                      </a>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-white border">
                    <div className="p-2 bg-plum text-white rounded-circle">
                      <i className="bi bi-telephone-fill fs-4"></i>
                    </div>
                    <div>
                      <strong className="text-dark d-block mb-1">24/7 Phone & WhatsApp Support</strong>
                      <div className="d-flex flex-column gap-1 mt-1">
                        <a href="tel:+919257984336" className="text-dark fw-bold text-decoration-none small">
                          <i className="bi bi-phone me-1 text-plum"></i> +91 9257984336
                        </a>
                        <a href="tel:+918529833535" className="text-dark fw-bold text-decoration-none small">
                          <i className="bi bi-phone me-1 text-plum"></i> +91 8529833535
                        </a>
                        <a href="tel:+919983301657" className="text-dark fw-bold text-decoration-none small">
                          <i className="bi bi-phone me-1 text-plum"></i> +91 9983301657
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="col-lg-7" data-aos="fade-left">
              <div className="p-4 p-md-5 bg-white rounded-4 shadow-sm border">
                <h4 className="fw-bold text-dark mb-1">Send Us a Direct Message</h4>
                <p className="text-muted small mb-4">
                  Inquire about hematology analyzers, biochemistry units, or request technical service for <strong>{cityName}</strong>.
                </p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="form-control form-control-lg fs-6 rounded-3 border"
                      value={form.name}
                      onChange={handleChange}
                      maxLength={50}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. lab@healthcenter.com"
                      className="form-control form-control-lg fs-6 rounded-3 border"
                      value={form.email}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">10-Digit Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9829012345"
                      className="form-control form-control-lg fs-6 rounded-3 border"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={10}
                      inputMode="numeric"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Subject / Product *</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="e.g. Hematology Analyzer Price"
                      className="form-control form-control-lg fs-6 rounded-3 border"
                      value={form.subject}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">Your Requirement Details *</label>
                    <textarea
                      name="message"
                      rows="4"
                      placeholder={`Please describe your diagnostic equipment or service requirements in ${cityName}...`}
                      className="form-control fs-6 rounded-3 border"
                      value={form.message}
                      onChange={handleChange}
                      maxLength={1000}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      className="btn btn-plum w-100 py-3 text-white"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending Message...
                        </span>
                      ) : (
                        <span>
                          Submit Query For {cityName} <i className="bi bi-send-fill ms-2"></i>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC DISTRICT MAP SECTION */}
      <section className="map-section py-5 bg-plum-light border-top">
        <div className="container text-center mb-4">
          <span className="badge bg-plum text-white px-3 py-1 rounded-pill fw-bold mb-2">
            LOCATION MAP
          </span>
          <h3 className="fw-bold text-dark">District Map - {cityName}, {stateName}</h3>
          <p className="text-muted small">Viewing Google Maps coverage for {cityName} biomedical & diagnostic services.</p>
        </div>
        <div className="container">
          <div className="rounded-4 overflow-hidden shadow border border-plum border-opacity-25">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${cityName}, ${stateName}, India`)}&z=12&output=embed`}
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              title={`Google Map for ${cityName}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}