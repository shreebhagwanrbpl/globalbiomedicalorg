"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState([]);
  const pathname = usePathname();

  const getValue = (key) => {
    return (
      contactInfo.find((x) => {
        const label = x.label?.toLowerCase();
        return (
          label?.includes(key) ||
          (key === "address" && label?.includes("location"))
        );
      })?.value || ""
    );
  };

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "globalbiomedicalorg", "pages", "contact")
        );
        if (snap.exists()) {
          setContactInfo(snap.data().contactInfo || []);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchContact();
  }, []);

  return (
    <footer className="footer">
      <div className="container-fluid px-3 px-md-5 py-5">
        <div className="row gy-4">
          {/* COMPANY INFO */}
          <div className="col-lg-3 col-md-6">
            <h4 className="fw-bold text-white mb-3">
              Global Biomedical Inc.
            </h4>
            <p className="small text-white-50 mb-4">
              Trusted supplier for medical equipment, diagnostic analyzers, pathology instruments, and lab consumables across India. Delivering precision healthcare technology.
            </p>

            {/* SOCIAL MEDIA ICONS */}
            <h6 className="footer-title fs-6 mb-3">Follow Us</h6>
            <div className="d-flex gap-2 flex-wrap social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Facebook"
              >
                <i className="bi bi-facebook m-0"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Instagram"
              >
                <i className="bi bi-instagram m-0"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="LinkedIn"
              >
                <i className="bi bi-linkedin m-0"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Twitter / X"
              >
                <i className="bi bi-twitter-x m-0"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="YouTube"
              >
                <i className="bi bi-youtube m-0"></i>
              </a>
              <a
                href="https://wa.me/919257984336"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="WhatsApp"
              >
                <i className="bi bi-whatsapp m-0"></i>
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-title">Quick Links</h6>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products Catalog</Link>
              </li>
              <li>
                <Link href="/services">Services & AMC</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-title">Product Categories</h6>
            <ul className="footer-links">
              <li>
                <Link href="/category/hematology-analyzer">Hematology Analyzers</Link>
              </li>
              <li>
                <Link href="/category/biochemistry-analyzer">Biochemistry Analyzers</Link>
              </li>
              <li>
                <Link href="/category/electrolyte-analyzer">Electrolyte Analyzers</Link>
              </li>
              <li>
                <Link href="/category/immunoassay-analyzer">Immunoassay Analyzers</Link>
              </li>
              <li>
                <Link href="/category/laboratory-consumables">Medical Consumables</Link>
              </li>
            </ul>
          </div>

          {/* LOCATION HUBS */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-title">Top Locations</h6>
            <ul className="footer-links">
              <li>
                <Link href="/district/jaipur">Jaipur Supplier</Link>
              </li>
              <li>
                <Link href="/district/delhi">Delhi Supplier</Link>
              </li>
              <li>
                <Link href="/district/mumbai">Mumbai Supplier</Link>
              </li>
              <li>
                <Link href="/district/jodhpur">Jodhpur Supplier</Link>
              </li>
              <li>
                <Link href="/district/kota">Kota Supplier</Link>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO WITH ALL 3 PHONE NUMBERS */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-title">Get In Touch</h6>
            <p className="small mb-2 d-flex align-items-start text-white-50">
              <i className="bi bi-geo-alt me-2 mt-1"></i>
              <span>{getValue("address") || "Jaipur, Rajasthan, India"}</span>
            </p>

            <p className="small mb-2 d-flex align-items-center text-white-50">
              <i className="bi bi-envelope me-2"></i>
              <span>{getValue("email") || "info@globalbiomedical.org"}</span>
            </p>

            <div className="small mb-2 d-flex align-items-start text-white-50">
              <i className="bi bi-telephone me-2 mt-1"></i>
              <div className="d-flex flex-column gap-1">
                <a href="tel:+919257984336" className="text-light text-decoration-none hover-pink">
                  +91 9257984336
                </a>
                <a href="tel:+918529833535" className="text-light text-decoration-none hover-pink">
                  +91 8529833535
                </a>
                <a href="tel:+919983301657" className="text-light text-decoration-none hover-pink">
                  +91 9983301657
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom mt-5 pt-3 text-center">
          <p className="mb-0 small text-white-50">
            © {new Date().getFullYear()} Global Biomedical Inc. | All Rights Reserved
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #1f0b1d 0%, #3a1936 50%, #150614 100%);
          color: #fff;
          border-top: 1px solid rgba(165, 107, 151, 0.2);
        }

        .footer-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 8px;
        }

        .footer-title::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 45px;
          height: 3px;
          background: #A56B97;
          border-radius: 20px;
        }

        .footer p {
          color: #e2d1de;
          line-height: 1.7;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #f3e8f1 !important;
          text-decoration: none !important;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .footer-links a::before {
          content: "→";
          color: #A56B97;
          margin-right: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: #A56B97 !important;
          transform: translateX(5px);
        }

        .footer-links a:hover::before {
          margin-right: 12px;
        }

        .social-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(165, 107, 151, 0.15);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff !important;
          border: 1px solid rgba(165, 107, 151, 0.3);
          transition: all 0.3s ease;
          text-decoration: none !important;
        }

        .social-icon:hover {
          background: #A56B97;
          color: #ffffff !important;
          transform: translateY(-3px);
          border-color: #A56B97;
          box-shadow: 0 5px 15px rgba(165, 107, 151, 0.4);
        }

        .social-icon i {
          font-size: 16px;
          color: inherit !important;
        }

        .hover-pink:hover {
          color: #A56B97 !important;
        }

        .footer-bottom {
          border-top: 1px solid rgba(165, 107, 151, 0.2);
        }

        i {
          color: #A56B97;
        }

        @media (max-width: 768px) {
          .footer-title::after {
            left: 0;
          }
        }
      `}</style>
    </footer>
  );
}