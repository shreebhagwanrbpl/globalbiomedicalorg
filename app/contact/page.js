"use client";

export default function Contact() {
  return (
    <div className="contact-page">

      {/* 🔥 HERO */}
      <section className="contact-hero text-center">
        <div className="container">
          <h1 className="fw-bold display-4">
            Contact <span>Us</span>
          </h1>
          <p className="mt-3">
            Get in touch with us for medical solutions & support
          </p>
        </div>
      </section>

      {/* 🔥 CONTACT SECTION */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">

            {/* 🔥 LEFT INFO */}
            <div className="col-lg-5" data-aos="fade-right">

              <h4 className="fw-bold mb-3">Get In Touch</h4>

              <p className="text-muted">
                We are here to help you with all your diagnostic and medical needs.
              </p>

            <div className="contact-info mt-4">
            <div className="info-box">
              <i className="bi bi-geo-alt"></i>
              <div>
                <strong>Location</strong>
                <p>Jaipur, India</p>
              </div>
            </div>

            <div className="info-box">
              <i className="bi bi-envelope"></i>
              <div>
                <strong>Email</strong>
                <p>info@rajbiosis.com</p>
              </div>
            </div>

            <div className="info-box">
              <i className="bi bi-telephone"></i>
              <div>
                <strong>Phone</strong>
                <p>+91 XXXXX XXXXX</p>
              </div>
            </div>
          </div>
            </div>

            {/* 🔥 RIGHT FORM */}
            <div className="col-lg-7" data-aos="fade-left">
              <div className="contact-form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" placeholder="Your Name" className="input-field"/>
                  </div>

                  <div className="col-md-6">
                    <input type="email" placeholder="Email Address" className="input-field"/>
                  </div>

                  <div className="col-md-6">
                    <input type="text" placeholder="Phone Number" className="input-field"/>
                  </div>

                  <div className="col-md-6">
                    <input type="text" placeholder="Subject" className="input-field"/>
                  </div>

                  <div className="col-12">
                    <textarea rows="4" placeholder="Your Message"></textarea>
                  </div>

                  <div className="col-12">
                    <button className="btn submit-btn w-100">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="map-section">
        <div className="container-fluid p-0">

          <iframe
            src="https://maps.google.com/maps?q=Raj%20Biosis%20Pvt%20Ltd%20Jaipur&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>

        </div>
      </section>

      {/* 🔥 STYLES */}
      <style jsx>{`

      /* PAGE */
      .contact-page {
        background: #f9fafb;
      }

      /* HERO */
      .contact-hero {
        padding: 100px 0;
        background: linear-gradient(3deg, #945c8dd6, #db8a64, #462c647d);
        color: #fff;
      }

      .contact-hero span {
        color: #f5e6d3;
      }

      .contact-hero p {
        color: rgba(255,255,255,0.8);
      }

      /* LEFT TEXT */
      .contact-info p {
        margin-bottom: 10px;
        font-size: 15px;
        color: #666;
      }

      /* INFO BOX */
      .info-box {
        display: flex;
        gap: 12px;
        align-items: center;
        background: #fff;
        padding: 14px;
        border-radius: 12px;
        margin-bottom: 12px;
        border: 1px solid #eee;
        transition: 0.3s;
      }

      .info-box:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      }

      .info-box i {
        font-size: 20px;
        color: #8e6a8f; /* 👈 purple */
      }

      .info-box p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }

      /* FORM */
      .contact-form {
        background: #fff;
        padding: 35px;
        border-radius: 20px;
        box-shadow: 0 25px 60px rgba(0,0,0,0.1);
      }

      /* INPUT */
      .input-field,
      .contact-form textarea {
        width: 100%;
        padding: 14px;
        border-radius: 12px;
        border: 1px solid #ddd;
        transition: 0.3s;
      }

      .input-field:focus,
      .contact-form textarea:focus {
        border-color: #8e6a8f;
        box-shadow: 0 0 12px rgba(142,106,143,0.2);
      }

      /* BUTTON */
      .submit-btn {
        background: #111;
        color: #fff;
        border-radius: 50px;
        padding: 14px;
        font-weight: 500;
        border: none;
        transition: 0.3s;
      }

      .submit-btn:hover {
        background: #000;
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      }

      /* MAP */
      .map-section iframe {
        border-radius: 0;
      }

      /* SECTION SPACING */
      section {
        padding: 80px 0;
      }

      `}</style>

          </div>
        );
      }