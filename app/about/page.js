"use client";
import "./about.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import Aboutt from "@/public/about_img.png";
import AboutBanner from "./About.png";

export default function About() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    setLoading(true);

    const items =
      document.querySelectorAll(".fade-up");

    items.forEach((el, i) => {

      el.classList.remove("active");

      setTimeout(() => {
        el.classList.add("active");
      }, i * 150);

    });

    const timer = setTimeout(() => {

      setMounted(true);

      setLoading(false);

    }, 600);

    return () => clearTimeout(timer);

  }, []);
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
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <Image
          src={AboutBanner}
          alt="About Global Biomedical"
          fill
          priority
          className="about-banner"
        />

      </section>

      {/* CONTENT */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center gy-5">

            {/* LEFT IMAGE */}
            <div className="col-lg-6 text-center">
              <div className="about-img-wrapper">
                <img
                  src={Aboutt.src}
                  alt="About"
                  className="img-fluid"
                />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="col-lg-6">
              <h3 className="about-heading">
                Delivering Quality Healthcare Solutions
              </h3>

              <p className="about-text">
                Global Biomedical has been providing high-quality diagnostic instruments,
                lab equipment, and medical consumables across India.
              </p>

              <p className="about-text">
                Our mission is to empower healthcare professionals with reliable
                and advanced technology.
              </p>

              {/* FEATURES */}
              <div className="mt-4">
                <div className="about-feature">
                  <i className="bi bi-check-circle-fill"></i>
                  Trusted Medical Products
                </div>

                <div className="about-feature">
                  <i className="bi bi-truck"></i>
                  Pan India Delivery
                </div>

                <div className="about-feature">
                  <i className="bi bi-headset"></i>
                  24/7 Support Team
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="about-stats text-center">
        <div className="container">
          <div className="row">

            <div className="col-4">
              <h2>1000+</h2>
              <p>Happy Clients</p>
            </div>

            <div className="col-4">
              <h2>15+</h2>
              <p>Years Experience</p>
            </div>

            <div className="col-4">
              <h2>500+</h2>
              <p>Products Delivered</p>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
}