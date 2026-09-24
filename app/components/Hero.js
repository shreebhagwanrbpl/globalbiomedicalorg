"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Hero({ city }) {
  const [mounted, setMounted] = useState(false);
  const [homeLoading, setHomeLoading] = useState(true);

  const [data, setData] = useState({});
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  const [currentCity, setCurrentCity] = useState("");
  const [isValidCity, setIsValidCity] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDistrict = async () => {
      const slug = pathParts[0];

      if (!slug) {
        setCurrentCity("");
        setIsValidCity(false);
        setLoading(false);
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
      setLoading(false);
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

  if (!mounted || homeLoading || loading) {
    return (
      <div className="page-loader">
        <div className="loader-circle"></div>
        <h2>Global Biomedical</h2>
        <p>Loading amazing healthcare solutions...</p>
      </div>
    );
  }

  // Admin-managed text is used exactly as stored in SQLite.
  // Only the image is allowed to use a local static fallback.
  const heroBadge = "Trusted Since 2009";
  const heroTitle = data?.title || "";
  const heroDescription = data?.description || "";
  const button1Text = data?.button1Text || "";
  const button2Text = data?.button2Text || "";
  const heroImage = data?.image || "/HA.png";

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
                {button1Text && (data?.button1Link ? (
                  <Link href={data.button1Link} className="hero-btn-primary">
                    {button1Text} <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                ) : (
                  <span className="hero-btn-primary">
                    {button1Text} <i className="bi bi-arrow-right ms-2"></i>
                  </span>
                ))}

                {button2Text && (data?.button2Link ? (
                  <Link href={data.button2Link} className="hero-btn-outline">
                    {button2Text}
                  </Link>
                ) : (
                  <span className="hero-btn-outline">{button2Text}</span>
                ))}
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