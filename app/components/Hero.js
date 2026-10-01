"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Hero({ city, initialHero = null }) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState(initialHero || {});
  const [homeLoading, setHomeLoading] = useState(!initialHero);

  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  const [currentCity, setCurrentCity] = useState(city || "");
  const [isValidCity, setIsValidCity] = useState(!!city);
  const [loading, setLoading] = useState(false);

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
    const fetchData = async () => {
      try {
        const res = await fetch("/api/site-data?type=home", { cache: "no-store" });
        const json = await res.json();
        if (json?.data) setData(json.data);
      } catch (err) {
        console.error("Error fetching hero data:", err);
      } finally {
        setHomeLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!mounted && !initialHero) {
    return null;
  }

  // Admin-managed text is used, with robust defaults for missing fields
  const heroBadge = data?.badge || "Trusted Since 2009";
  const heroTitle = data?.title || "Precision Diagnostics, Powered by Smarter Biomedical Solutions";
  const heroDescription =
    data?.description ||
    "Empowering laboratories and healthcare professionals with dependable diagnostic instruments, laboratory essentials, and biomedical solutions built for accuracy, efficiency, and everyday performance.";
  const button1Text = data?.button1Text || "Request Product Details";
  const button1Link =
    data?.button1Link ||
    (isValidCity ? `/${citySlug}/items` : "/items");
  const button2Text = data?.button2Text || "Talk to Our Experts";
  const button2Link =
    data?.button2Link ||
    (isValidCity ? `/${citySlug}/contact` : "/contact");
  const heroImage = data?.image || data?.imageUrl || "/HA.png";

  return (
    <section className="hero-section">
      <div className="container py-3 py-md-5">
        <div className="hero-banner-card p-4 p-md-5 shadow-2xl">
          <div className="row align-items-center g-4 g-lg-5">
            {/* LEFT CONTENT */}
            <div className="col-lg-6 text-start">
              <div className="mb-3">
                <span className="hero-badge">
                  <i className="bi bi-shield-check me-2"></i>
                  {heroBadge}
                </span>
              </div>

              <h1 className="hero-title">
                {heroTitle}
                {isValidCity ? (
                  <span className="d-block highlight fs-2 mt-1">in {cityName}</span>
                ) : (
                  ""
                )}
              </h1>

              <p className="mt-3 hero-subtext">
                {heroDescription}
                {isValidCity ? ` available in ${cityName}` : ""}
              </p>

              {/* HIGHLIGHT FEATURES */}
              <div className="d-flex flex-wrap gap-3 mt-4 text-light small fw-medium">
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-info me-2 fs-6"></i>
                  <span>ISO Certified Equipment</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-truck text-info me-2 fs-6"></i>
                  <span>Pan India Delivery</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-headset text-info me-2 fs-6"></i>
                  <span>24/7 Expert Support</span>
                </div>
              </div>

              <div className="mt-4 pt-2 d-flex flex-wrap gap-3 align-items-center">
                {button1Text && (
                  <Link
                    href={button1Link}
                    className="hero-btn-primary text-decoration-none d-inline-flex align-items-center"
                  >
                    {button1Text} <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                )}

                {button2Text && (
                  <Link
                    href={button2Link}
                    className="hero-btn-outline text-decoration-none d-inline-flex align-items-center"
                  >
                    {button2Text}
                  </Link>
                )}
              </div>
            </div>

            {/* RIGHT SHOWCASE IMAGE WITH FLOATING BADGE */}
            <div className="col-lg-6">
              <div className="hero-img-container">
                <img
                  src={heroImage}
                  className="hero-banner-img img-fluid"
                  alt="Medical Laboratory Equipment"
                  onError={(e) => {
                    e.currentTarget.src = "/HA.png";
                  }}
                />
                <div className="hero-floating-badge">
                  <i className="bi bi-patch-check-fill text-info fs-3"></i>
                  <div>
                    <div className="fw-bold fs-6">100% Genuine</div>
                    <div className="small text-white-50">Certified Diagnostic Supplier</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}