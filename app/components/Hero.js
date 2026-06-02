"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function Hero({ city }) {
  const [mounted, setMounted] = useState(false);
  const [homeLoading, setHomeLoading] = useState(true);

  const [data, setData] = useState({
    // title: "Advanced Diagnostic Solutions",
    // description:
    //   "Delivering high-quality medical equipment & consumables for hospitals, labs & healthcare professionals",
    // button1Text: "Explore Services",
    // button2Text: "Contact Us",
  });
  const pathname = usePathname();
  const pathParts = pathname
    .split("/")
    .filter(Boolean);
  // current city
  const [currentCity, setCurrentCity] =
    useState("");
  const [isValidCity, setIsValidCity] =
    useState(false);
  const [loading, setLoading] =
    useState(true);
  useEffect(() => {

    const checkDistrict =
      async () => {

        const slug =
          pathParts[0];

        if (!slug) {

          setCurrentCity("");
          setIsValidCity(false);
          setLoading(false);

          return;

        }

        try {

          const snap = await getDoc(
            doc(
              db,
              "websites",
              "globalbiomedicalorg",
              "districts",
              slug
            )
          );

          // valid city
          if (snap.exists()) {

            setCurrentCity(slug);
            setIsValidCity(true);

          } else {

            // invalid city
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

  // format city
  const formatCity = (name = "") =>
    name
      .split("-")
      .map(
        (w) =>
          w.charAt(0).toUpperCase() +
          w.slice(1)
      )
      .join(" ");

  const citySlug = currentCity
    ?.toLowerCase()
    ?.replace(/\s+/g, "-");

  const cityName = formatCity(currentCity);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {

    const fetchData = async () => {

      const snap = await getDoc(
        doc(
          db,
          "websites",
          "globalbiomedicalorg",
          "pages",
          "home"
        )
      );

      if (snap.exists()) {
        setData(snap.data());
      }
      setHomeLoading(false);
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
  return (
    <section className="hero-section text-white">

      <div className="container">

        <div className="row align-items-center">

          {/* IMAGE */}
          <div className="col-lg-6 text-center position-relative">

            <div className="hero-glow"></div>

            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67"
              className="img-fluid rounded-4 shadow-lg"
              alt="medical lab"
            />

          </div>

          {/* CONTENT */}
          <div className="col-lg-6">

            <span className="hero-badge mb-3">
              Trusted Since 2009
            </span>

            <h1 className="fw-bold display-4 hero-title">

              {data?.title}

              {" "}

              {isValidCity
                ? ` in ${cityName}`
                : ""}

            </h1>

            <p className="mt-3 hero-subtext">

              {data?.description}

              {" "}

              {" "}
              {isValidCity
                ? ` available in ${cityName}`
                : ""}

            </p>
            <div className="mt-4 d-flex gap-3">
              <Link
                href={
                  data?.button1Link ||
                  (isValidCity
                    ? `/${citySlug}/services`
                    : "/services")
                }
                className="hero-btn-primary"
              >
                {data?.button1Text}
              </Link>

              <Link
                href={
                  data?.button2Link ||
                  (isValidCity
                    ? `/${citySlug}/contact`
                    : "/contact")
                }
              >
                <button className="btn hero-btn-outline">
                  {data?.button2Text}
                </button>
              </Link>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}