"use client";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid px-5 py-5">
        <div className="row gy-4">
          {/* 🔥 COMPANY INFO */}
          <div className="col-lg-4">
            <h4 className="fw-bold text-white">Raj Biosis</h4>
            <p className=" small">
              Trusted partner for diagnostic instruments, reagents,
              and medical consumables across India.
            </p>
          </div>

          {/* 🔥 QUICK LINKS */}
          <div className="col-lg-2">
            <h6 className="footer-title">Quick Links</h6>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* 🔥 SERVICES */}
          <div className="col-lg-3">
            <h6 className="footer-title">Our Services</h6>
            <ul className="footer-links">
              <li>Diagnostic Equipment</li>
              <li>Medical Consumables</li>
              <li>Lab Solutions</li>
              <li>Support & Maintenance</li>
            </ul>
          </div>

          {/* 🔥 CONTACT */}
          <div className="col-lg-3">
            <h6 className="footer-title">Contact</h6>
            <p className="small mb-1">
              <i className="bi bi-geo-alt"></i> Jaipur, India
            </p>
            <p className="small mb-1">
              <i className="bi bi-envelope"></i> info@rajbiosis.com
            </p>
            <p className="small">
              <i className="bi bi-telephone"></i> +91 XXXXX XXXXX
            </p>
          </div>

        </div>

        {/* 🔥 BOTTOM */}
        <div className="footer-bottom mt-4 pt-3 text-center">
          <p className="mb-0 small">
            © 2026 Raj Biosis Pvt Ltd | All Rights Reserved
          </p>
        </div>

      </div>

      <style jsx>{`
        .footer {
          background: #111;
          color: #fff;
        }

        .footer-title {
          font-weight: 600;
          margin-bottom: 12px;
          position: relative;
        }

        /* 🔥 UNDERLINE EFFECT */
        .footer-title::after {
          content: "";
          width: 40px;
          height: 2px;
          background: #198754;
          display: block;
          margin-top: 6px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 10px;
        }

        /* 🔥 LINK STYLE */
        .footer-links a {
        color: #fff !important;
          text-decoration: none;
          font-size: 14px;
          transition: 0.3s;
          display: inline-block;
        }



        /* 🔥 HOVER ANIMATION */
        .footer-links a:hover {
          color: #198754 !important;
          transform: translateX(6px);
        }

        /* 🔥 ICON ADD KARNA HO TO */
        .footer-links a::before {
          content: "›";
          margin-right: 6px;
          color: #198754;
          transition: 0.3s;
        }

        .footer-links a:hover::before {
          margin-right: 10px;
        }

        .footer-bottom {
          border-top: 1px solid #333;
        }

        i {
          margin-right: 6px;
          color: #198754;
        }

      `}</style>

          </footer>
        );
      }