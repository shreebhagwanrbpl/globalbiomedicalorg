"use client";
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

            <div className="col-md-4">
              <h2>1000+</h2>
              <p>Happy Clients</p>
            </div>

            <div className="col-md-4">
              <h2>15+</h2>
              <p>Years Experience</p>
            </div>

            <div className="col-md-4">
              <h2>500+</h2>
              <p>Products Delivered</p>
            </div>

          </div>
        </div>
      </section>




      {/* 🔥 STYLES */}
      <style jsx>{`
              /* PAGE BG */
        .about-page {
          background: #f9fafb;
        }

        .why-title {
          font-size: 40px;
          font-weight: 700;
          color: #111;
        }

        .why-title span {
          color: #8e6a8f;  
        }

        .why-text {
          color: #666;  
          font-size: 16px;
        }

        .feature-item {
          background: #f5f5f5;  
          border: 1px solid #eee;
          color: #333;
        }

        .feature-item i {
          color: #8e6a8f;  
        }

        .stats h3 {
          color: #8e6a8f;   
          font-weight: 700;
        }

        .stats p {
          color: #777;
        }

        /* HERO */
     .about-hero{
    position: relative;
    width: 100%;
    height: 580px;
    overflow: hidden;
}

.about-banner{
    object-fit: cover;
}

        /* CONTENT */
        .about-heading {
          font-weight: 700;
          font-size: 28px;
        }

        .about-text {
          color: #555;
        }

        /* FEATURES */
        .about-feature {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 10px;
          background: #fff;
          padding: 12px 15px;
          border-radius: 10px;
          border: 1px solid #eee;
        }

        .about-feature i {
          color: #945c8d;
        }

        /* IMAGE */
        .about-img-wrapper {
          border-radius: 20px;
          overflow: hidden;
        }

        .about-img-wrapper img {
          border-radius: 20px;
          transition: 0.4s;
        }

        .about-img-wrapper:hover img {
          transform: scale(1.05);
        }

        /* STATS */
        .about-stats {
          background: linear-gradient(135deg, #f4d7cc, #ead6e2);
          padding: 60px 0;
        }

        .about-stats h2 {
          color: #945c8d;
          font-weight: bold;
        }

        .about-stats p {
          margin: 0;
          color: #555;
        }

        .about-stats {
  background: linear-gradient(135deg, #f4d7cc, #ead6e2);
  padding: 70px 0;
  border-radius: 30px;
  margin: 50px auto;
  max-width: 90%;
}

/* NUMBERS */
.about-stats h2 {
  color: #8e6a8f;   /* 👈 purple */
  font-weight: 700;
  font-size: 36px;
}

/* TEXT */
.about-stats p {
  color: #555;
  margin: 0;
  font-size: 14px;
}
          .page-loader{
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f7f7f7, #e6d7d7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 14px;
}

.page-loader h2{
  font-size: 32px;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.page-loader p{
  color: #555;
  font-size: 15px;
  margin: 0;
}

.loader-circle{
  width: 65px;
  height: 65px;
  border: 5px solid #ddd;
  border-top: 5px solid #111;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin{
  100%{
    transform: rotate(360deg);
  }
}
      `}</style>
    </div>
  );
}