"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePathname } from "next/navigation";
import Image from "next/image";
import OS from "../services/os.png";





export default function Services({ city }) {
const [currentCity, setCurrentCity] = useState("");
const [isValidCity, setIsValidCity] = useState(false);
  const [services, setServices] = useState([]);
const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
const pathParts = pathname
  .split("/")
  .filter(Boolean);
  // current city
  // const currentCity = city || "jaipur";
const [stateName, setStateName] = useState("");
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
const [loading, setLoading] =
  useState(true);
  const citySlug = currentCity
    ?.toLowerCase()
    ?.replace(/\s+/g, "-");

  const cityName =
    formatCity(currentCity);
    useEffect(() => {
  setMounted(true);
}, []);
useEffect(() => {

  const checkDistrict =
    async () => {

  const slug =
  pathParts[0];

setStateName("");

      // no slug
      if (!slug) {

        setCurrentCity("");
        setIsValidCity(false);

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

  const data =
    snap.data();

  setCurrentCity(slug);

  setStateName(
    data?.state || ""
  );

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

    };

  checkDistrict();

}, [pathname]);
  // FETCH DATA
  useEffect(() => {

    const fetchData = async () => {

      try {

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "globalbiomedicalorg",
            "pages",
            "services"
          )
        );

        if (snap.exists()) {

          setServices(
            snap.data().services || []
          );

        }

      } catch (err) {

        console.error(
          "Error fetching services:",
          err
        );

      }

    };

    fetchData();

  }, []);

  // ICONS
  const icons = [
    "bi-heart-pulse-fill",
    "bi-capsule",
    "bi-tools",
    "bi-truck",
    "bi-shield-check",
    "bi-person-check",
  ];
    const timer = setTimeout(() => {

    setMounted(true);

    setLoading(false);

  }, 500);
if (!mounted || loading) {
    return (
<div className="page-loader">
  <div className="loader-circle"></div>
  <h2>Global Biomedical</h2>
  <p>Loading amazing healthcare solutions...</p>
</div>
    );

  }
  return (
    <div className="services-page">

   <section className="services-heroo">
  <Image
    src={OS}
    alt="Our Services"
    fill
    priority
    className="services-banner"
  />
</section>

      {/* SERVICES */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {services.length === 0 ? (
              <p className="text-center">
                No Services Found
              </p>

            ) : (

              services.map((item, i) => (

                <div
                  className="col-md-4"
                  key={i}
                >

                  <div className="service-card">

                    {/* ICON */}
                    <i
                      className={`bi ${
                        icons[
                          i % icons.length
                        ]
                      }`}
                    ></i>

                    {/* DATA */}
                    <h5>
                      {item.title ||
                        "Service Title"}
                    </h5>

                    <p>
                      {item.desc ||
                        "Service Description"}
                    </p>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="cta text-center">

        <div className="container">

          <h2>
            Need Medical Solutions?
          </h2>

          <p>

            Contact us today for best
            diagnostic equipment

            {" "}

            {cityName &&
              `in ${cityName}`}

          </p>

          <Link
            href={`/${citySlug}/contact`}
          >

            <button className="btn btn-light px-4 mt-2">

              Get in Touch

            </button>

          </Link>

        </div>

      </section>

      {/* STYLES */}
      <style jsx>{`

        .services-page {
          background: #f9fafb;
        }

        /* HERO */
        .services-hero {
          padding: 100px 0;
          background: linear-gradient(
            3deg,
            #945c8dd6,
            #db8a64,
            #462c647d
          );
          color: #fff;
        }

        .services-hero span {
          color: #f5e6d3;
        }

        .services-hero p {
          color: rgba(255,255,255,0.8);
        }
          
        .services-heroo{
          position: relative;
          width:100%;
          height:510px;
          overflow:hidden;
          margin-top:25px;
        }

        .services-banner{
          object-fit:cover;
        }

        /* CARDS */
        .service-card {
          background: #fff;
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          transition: 0.4s;
          border: 1px solid #eee;
        }

        .service-card i {
          font-size: 40px;
          color: #8e6a8f;
          margin-bottom: 15px;
        }

        .service-card h5 {
          color: #111;
        }

        .service-card p {
          color: #666;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.1);
        }

        /* CTA */
        .cta {
          background: linear-gradient(
            135deg,
            #f4d7cc,
            #ead6e2
          );
          color: #111;
          padding: 70px 0;
          border-radius: 30px;
          margin: 50px auto;
          max-width: 90%;
        }

        .cta h2 {
          font-weight: 700;
        }

        .cta p {
          color: #555;
        }

        /* BUTTON */
        .cta button {
          background: #111;
          color: #fff;
          border-radius: 50px;
          padding: 12px 28px;
          border: none;
          transition: 0.3s;
        }

        .cta button:hover {
          background: #000;
          transform: scale(1.05);
        }

      `}</style>

    </div>
  );
}