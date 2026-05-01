import Link from "next/link";

export default function Home() {
  return (
    <>
    <section className="py-5 service-section">
  <div className="container-fluid px-5 text-center">

    <h2 className="section-title">Our Core Services</h2>

    <div className="row g-4">
      <div className="col-md-4">
        <div className="service-card h-100">
          <i className="bi bi-heart-pulse"></i>
          <h5 className="mt-3">Diagnostic Equipment</h5>
          <p className="service-text">
            High-end lab machines and diagnostic tools.
          </p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="service-card h-100">
          <i className="bi bi-capsule"></i>
          <h5 className="mt-3">Medical Consumables</h5>
          <p className="service-text">
            Trusted quality consumables for healthcare.
          </p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="service-card h-100">
          <i className="bi bi-tools"></i>
          <h5 className="mt-3">Support & Maintenance</h5>
          <p className="service-text">
            Reliable after-sales and technical support.
          </p>
        </div>
      </div>

    </div>

  </div>
</section>



       <section className="py-5 product-section">
  <div className="container-fluid px-5 text-center">

    <h2 className="section-title">Our Products</h2>

    <div className="row g-4">

      {[1,2,3,4].map((item)=>(
        <div className="col-md-3" key={item}>

          <div className="product-card-new">

            <div className="product-img">
              <img src="/abk.png" />
            </div>

            <div className="product-body text-start">
              <h6>Albumin BCG Method Kit</h6>

              <div className="meta">
                <span>20% / 100ml</span>
                <span>Tablet</span>
                <span>Infusion</span>
              </div>

              <Link href="/products">
                <button className="product-btn mt-3 w-100">
                  View Details
                </button>
              </Link>

            </div>

          </div>

        </div>
      ))}

    </div>

  </div>
</section>


      {/* WHY CHOOSE US */}
  {/* <section className="py-5" style={{background:"#f8fafc"}}>
  <div className="container-fluid px-5">

    <div className="row align-items-center gy-5">

      <div className="col-lg-6" data-aos="fade-right">

        <h2 className="fw-bold mb-4 display-5">
          Why Choose <span style={{color:"#198754"}}>Raj Biosis?</span>
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
          Why Choose <span>Raj Biosis?</span>
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

    <section className="py-5 partner-section">
  <div className="container-fluid px-5 text-center">

    <h2 className="partner-title">Our Trusted Partners</h2>
    <p className="partner-subtext">
      Trusted by leading healthcare brands and laboratories across India
    </p>

    <div className="partner-slider mt-4">
      <div className="partner-track">

        {[1,2,3,4,5,6,7,8].map((i)=>(
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
</section>

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

        <button className="cta-btn-primary">
          Get in Touch
        </button>

        <button className="cta-btn-outline">
          Request Quote
        </button>

      </div>

    </div>

  </div>
</section>
      
    </>
  );
}