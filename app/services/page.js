"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function Services() {
    const [services, setServices] = useState([]);

      // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "globalbiomedicalorg", "pages", "services")
        );

        if (snap.exists()) {
          setServices(snap.data().services || []);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchData();
  }, []);

    const icons = [
    "bi-heart-pulse-fill",
    "bi-capsule",
    "bi-tools",
    "bi-truck",
    "bi-shield-check",
    "bi-person-check",
  ];

  return (
    <div className="services-page">

      {/* 🔥 HERO */}
      <section className="services-hero text-center">
        <div className="container">
          <h1 className="fw-bold display-4">
            Our <span>Services</span>
          </h1>
          <p className="mt-3">
            Comprehensive medical and diagnostic solutions for modern healthcare
          </p>
        </div>
      </section>

      {/* 🔥 SERVICES CARDS */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">

            {services.length === 0 ? (
              <p className="text-center">No Services Found</p>
            ) : (
              services.map((item, i) => (
                <div className="col-md-4" key={i}>
                  <div className="service-card">

                    {/* ICON */}
                    <i className={`bi ${icons[i % icons.length]}`}></i>

                    {/* DATA */}
                    <h5>{item.title || "Service Title"}</h5>
                    <p>{item.desc || "Service Description"}</p>

                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      </section>

      {/* 🔥 CTA */}
      <section className="cta text-center">
        <div className="container">
          <h2>Need Medical Solutions?</h2>
          <p>Contact us today for best diagnostic equipment</p>
          <Link href="/contact">
          <button className="btn btn-light px-4 mt-2">
            Get in Touch
          </button>
          </Link>
        </div>
      </section>

      {/* 🔥 STYLES */}
      <style jsx>{`

      .services-page {
        background: #f9fafb;
      }

      /* HERO */
      .services-hero {
        padding: 100px 0;
        background: linear-gradient(3deg, #945c8dd6, #db8a64, #462c647d);
        color: #fff;
      }

      .services-hero span {
        color: #f5e6d3;
      }

      .services-hero p {
        color: rgba(255,255,255,0.8);
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
        color: #8e6a8f;   /* 👈 purple theme */
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
        background: linear-gradient(135deg, #f4d7cc, #ead6e2);
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