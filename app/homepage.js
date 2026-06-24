"use client";
import Hero from "./components/Hero";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
export default function Home({ city }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
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
          const data =
            snap.data().services || [];
          setServices(data);
        }
      } catch (err) {
        console.error(
          "Error fetching services:",
          err
        );
      }
    };
    fetchServices();
  }, []);


  const [homeLoading, setHomeLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const pathname = usePathname();
  const pathParts = pathname
    .split("/")
    .filter(Boolean);
  const [currentCity, setCurrentCity] =
    useState("");
  const [isValidCity, setIsValidCity] =
    useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [animating, setAnimating] = useState(true);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "globalbiomedicalorg",
            "pages",
            "products"
          )
        );

        if (snap.exists()) {
          const data =
            snap.data().products || [];
          const visible = data.filter(
            (p) => p.isPublished !== false
          );
          setProducts(visible);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setHomeLoading(false);
      }
    };

    fetchData();

  }, []);
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

  const cityName =
    formatCity(currentCity);

  useEffect(() => {
    const checkDistrict = async () => {
      const slug = pathParts[0];

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

        if (snap.exists()) {
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

  //   useEffect(() => {
  //   const fetchData = async () => {
  //   const snap = await getDoc(
  //   doc(db, "websites", "globalbiomedicalorg", "pages", "products")
  //   );

  //     if (snap.exists()) {
  //       const data = snap.data().products || [];
  //       const visible = data.filter((p) => p.isPublished !== false);
  //       setProducts(visible);
  //     }
  //     setHomeLoading(false);
  //   };

  //   fetchData();
  // }, []);



  const icons = [
    "bi-heart-pulse",
    "bi-capsule",
    "bi-tools",
  ];
  useEffect(() => {

    const timer = setTimeout(() => {

      setMounted(true);
      setAnimating(false);

    }, 500);

    return () => clearTimeout(timer);

  }, []);
  if (!mounted || homeLoading || pageLoading || animating) {
    return (
      <div className="page-loader">
        <div className="loader-circle"></div>

        <h2>Global Biomedical</h2>

        <p>Loading amazing healthcare solutions...</p>
      </div>
    );
  }



  return (
    <>
      <Hero city={city} />

<section className="trust-strip">
  <div className="container-fluid px-5">
    <div className="row text-center">

      <div className="col-md-3">
        <h3>1000+</h3>
        <p>Happy Clients</p>
      </div>

      <div className="col-md-3">
        <h3>15+</h3>
        <p>Years Experience</p>
      </div>

      <div className="col-md-3">
        <h3>500+</h3>
        <p>Products</p>
      </div>

      <div className="col-md-3">
        <h3>24/7</h3>
        <p>Technical Support</p>
      </div>

    </div>
  </div>
</section>



      <section className="py-5 service-section">
        <div className="container-fluid px-5 text-center">

          <h2 className="section-title">
            Our Core Services
          </h2>

          <div className="row g-4">
            {services.length === 0 ? (
              <p>No Services Found</p>
            ) : (
              services.slice(0, 3).map((item, i) => (
                <div className="col-md-4" key={i}>
                  <div className="p-4 rounded-4 service-card h-100">
                    <i
                      className={`bi ${icons[i] || "bi-heart-pulse"
                        } fs-1`}
                    ></i>

                    <h5 className="mt-3">
                      {item.title}
                    </h5>

                    <p className="text-muted">
                      {item.desc}
                    </p>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>


      {/* INDUSTRIES */}

<section className="industry-section py-5">

<div className="container">

<h2 className="section-title">
Industries We Serve
</h2>

<div className="row g-4 mt-3">

<div className="col-md-2">
<div className="industry-card">
<i className="bi bi-hospital"></i>
<p>Hospitals</p>
</div>
</div>

<div className="col-md-2">
<div className="industry-card">
<i className="bi bi-capsule"></i>
<p>Labs</p>
</div>
</div>

<div className="col-md-2">
<div className="industry-card">
<i className="bi bi-heart-pulse"></i>
<p>Clinics</p>
</div>
</div>

<div className="col-md-2">
<div className="industry-card">
<i className="bi bi-building"></i>
<p>Medical Colleges</p>
</div>
</div>

<div className="col-md-2">
<div className="industry-card">
<i className="bi bi-droplet"></i>
<p>Blood Banks</p>
</div>
</div>

<div className="col-md-2">
<div className="industry-card">
<i className="bi bi-virus"></i>
<p>Research</p>
</div>
</div>

</div>

</div>

</section>



      <section className="py-5 product-section">
        <div className="container-fluid px-5 text-center">
          <h2 className="section-title">Our Products</h2>
          <div className="row g-4">
            {products.slice(0, 4).map((item, i) => (
              <div className="col-md-3" key={item.id || i}>
                <div className="product-card-pro">
                  <div className="product-img-pro">
                    <img src={item.image || "/no-image.png"} />
                  </div>

                  <div className="product-body text-start">
                    <h6>{item.title}</h6>

                    <div className="meta">
                      <span>{item.brand || "-"}</span>
                      <span>{item.size || "-"}</span>
                      <span>{item.usage || "-"}</span>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {/* <div className="mt-5 text-center">
      <Link
        href={
          citySlug
            ? `/${citySlug}/items`
            : "/items"
        }
      >
        <button
          style={{
            background: "#d38c6f",
            border: "none",
            color: "#fff",
            padding: "12px 35px",
            borderRadius: "8px",
            fontWeight: "600"
          }}
        >
          View All
        </button>
      </Link>
    </div> */}

        </div>
      </section>

      <section className="testimonial-section py-5">

<div className="container">

<h2 className="section-title">
Client Testimonials
</h2>

<div className="row mt-4">

<div className="col-md-4">

<div className="testimonial-card">

★★★★★

<p>

Excellent products and timely support.

</p>

<h6>AIIMS Hospital</h6>

</div>

</div>

<div className="col-md-4">

<div className="testimonial-card">

★★★★★

<p>

Very reliable biomedical supplier.

</p>

<h6>Private Lab</h6>

</div>

</div>

<div className="col-md-4">

<div className="testimonial-card">

★★★★★

<p>

Professional installation and support.

</p>

<h6>Diagnostic Centre</h6>

</div>

</div>

</div>

</div>

</section>


      {/* WHY CHOOSE US */}
      {/* <section className="py-5" style={{background:"#f8fafc"}}>
    <div className="container-fluid px-5">

      <div className="row align-items-center gy-5">

        <div className="col-lg-6" data-aos="fade-right">

          <h2 className="fw-bold mb-4 display-5">
            Why Choose <span style={{color:"#198754"}}>Global Biomedical?</span>
          </h2>

          <p className="text-muted fs-5">
            We deliver trusted diagnostic solutions with high precision
            and reliability for hospitals and laboratories.
          </p>

          <div className="mt-4">

            <div className="d-flex align-items-center mb-3 feature-item">
              <i className="bi bi-check-circle-fill text-success fs-4 me-3"></i>
              <span>Certified Medical Products</span>
            </div>

            <div className="d-flex align-items-center mb-3 feature-item">
              <i className="bi bi-truck text-success fs-4 me-3"></i>
              <span>Pan India Delivery</span>
            </div>

            <div className="d-flex align-items-center mb-3 feature-item">
              <i className="bi bi-headset text-success fs-4 me-3"></i>
              <span>Expert Support Team</span>
            </div>

          </div>

        </div>

    
        <div className="col-lg-6 text-center" data-aos="zoom-in">

          <div className="image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b"
              className="img-fluid rounded-4 shadow-lg"
            />
          </div>

        </div>

      </div>

    </div>
  </section> */}

      <section className="py-5 why-section">
        <div className="container px-5">

          <div className="row align-items-center gy-5">

            {/* LEFT IMAGE */}
            <div className="col-lg-6 text-center" data-aos="zoom-in">
              <div className="why-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d"
                  className="img-fluid"
                  alt="lab"
                />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="col-lg-6" data-aos="fade-left">

              <h2 className="why-title">
                Why Choose <span>Global Biomedical?</span>
              </h2>

              <p className="why-text">
                We deliver trusted diagnostic solutions with high precision
                and reliability for hospitals and laboratories.
              </p>

              {/* FEATURES */}
              <div className="mt-4">

                <div className="feature-item">
                  <i className="bi bi-check-circle-fill"></i>
                  Certified Medical Products
                </div>

                <div className="feature-item">
                  <i className="bi bi-truck"></i>
                  Pan India Delivery
                </div>

                <div className="feature-item">
                  <i className="bi bi-headset"></i>
                  Expert Support Team
                </div>

              </div>

              {/* STATS */}
              <div className="row mt-5 stats">

                <div className="col-4">
                  <h3>1000+</h3>
                  <p>Clients</p>
                </div>

                <div className="col-4">
                  <h3>15+</h3>
                  <p>Years</p>
                </div>

                <div className="col-4">
                  <h3>500+</h3>
                  <p>Products</p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
<section className="certificate-section py-5">

<div className="container">

<h2 className="section-title">
Our Certifications
</h2>



<div className="row g-4 mt-2">

<div className="col-lg-3 col-md-6">

<div className="certificate-card">

<div className="certificate-icon">
<i className="bi bi-patch-check-fill"></i>
</div>

<h5>ISO 9001</h5>

<p>Quality Management System</p>

</div>

</div>

<div className="col-lg-3 col-md-6">

<div className="certificate-card">

<div className="certificate-icon">
<i className="bi bi-award-fill"></i>
</div>

<h5>CE Certified</h5>

<p>European Safety Standard</p>

</div>

</div>

<div className="col-lg-3 col-md-6">

<div className="certificate-card">

<div className="certificate-icon">
<i className="bi bi-shield-check"></i>
</div>

<h5>FDA Approved</h5>

<p>Trusted Medical Compliance</p>

</div>

</div>

<div className="col-lg-3 col-md-6">

<div className="certificate-card">

<div className="certificate-icon">
<i className="bi bi-file-earmark-check-fill"></i>
</div>

<h5>IEC Standards</h5>

<p>International Safety Compliance</p>

</div>

</div>

</div>

</div>

</section>


      {/* <section className="py-5 partner-section">
        <div className="container-fluid px-5 text-center">

          <h2 className="partner-title">Our Trusted Partners</h2>
          <p className="partner-subtext">
            Trusted by leading healthcare brands and laboratories across India
          </p>

          <div className="partner-slider mt-4">
            <div className="partner-track">

              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div className="partner-logo" key={i}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_placeholder.png"
                    alt="partner"
                  />
                </div>
              ))}

            </div>
          </div>

        </div>
      </section> */}

      {/* CTA */}
      <section className="py-5 cta-section">
        <div className="container text-center">
          <div className="cta-box">
            <h2 className="cta-title">
              Need Medical Solutions?
            </h2>
            <p className="cta-text">
              Contact us today for premium diagnostic equipment and expert support
            </p>
            <div className="mt-4 d-flex justify-content-center gap-3">
              <Link
                href={
                  isValidCity
                    ? `/${citySlug}/contact`
                    : "/contact"
                }
              >
                <button className="cta-btn-primary">
                  Get in Touch
                </button>
              </Link>

              <Link
                href={
                  isValidCity
                    ? `/${citySlug}/items`
                    : "/items"
                }
              >
                <button className="cta-btn-outline">
                  Request Quote
                </button>
              </Link>
            </div>

          </div>

        </div>
      </section>

<section className="brands-section py-5">

<div className="container">

<h2 className="section-title">
Brands We Deal In
</h2>



<div className="row g-4 mt-2">

{[
"Abbott",
"Mindray",
"Roche",
"Erba",
"Medica",
"Transasia"
].map((brand,i)=>(

<div className="col-lg-2 col-md-4 col-6" key={i}>

<div className="brand-card">

<h5>{brand}</h5>

</div>

</div>

))}

</div>

</div>

</section>

    </>
  );
}