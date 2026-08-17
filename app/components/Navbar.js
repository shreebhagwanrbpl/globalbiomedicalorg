"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathParts = pathname.split("/").filter(Boolean);

  const reservedRoutes = [
    "about",
    "contact",
    "items",
    "products",
    "services",
  ];

  const district =
    pathParts[0] && !reservedRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path = "") => {
    if (!district) return path || "/";
    if (!path) return `/${district}`;
    return `/${district}${path}`;
  };

  return (
    <>
      {/* TOP HEADER STRIP WITH CONTACT NUMBERS */}
      <div className="top-header-strip py-1 px-3 px-lg-5 text-white bg-dark">
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap fs-7">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span className="d-inline-flex align-items-center gap-1 text-light">
              <i className="bi bi-telephone-fill text-danger me-1"></i>
              <strong>Call Us:</strong>
            </span>
            <a href="tel:+919257984336" className="text-light text-decoration-none me-2 hover-red">
              +91 9257984336
            </a>
            <span className="text-muted d-none d-sm-inline">|</span>
            <a href="tel:+918529833535" className="text-light text-decoration-none me-2 hover-red">
              +91 8529833535
            </a>
            <span className="text-muted d-none d-sm-inline">|</span>
            <a href="tel:+919983301657" className="text-light text-decoration-none hover-red">
              +91 9983301657
            </a>
          </div>

          <div className="d-none d-md-flex align-items-center gap-3">
            <a href="mailto:info@globalbiomedical.org" className="text-light text-decoration-none">
              <i className="bi bi-envelope-fill me-1 text-danger"></i> info@globalbiomedical.org
            </a>
            <a
              href="https://wa.me/919257984336"
              target="_blank"
              rel="noopener noreferrer"
              className="text-success text-decoration-none fw-semibold"
            >
              <i className="bi bi-whatsapp me-1"></i> WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid px-lg-5 px-3">
          {/* LOGO */}
          <Link href={makeLink("")} className="navbar-brand">
            <Image
              src="/globallogo.png"
              alt="Global Biomedical"
              width={110}
              height={45}
              priority
            />
          </Link>

          {/* TOGGLE */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* MENU */}
          <div
            className={`collapse navbar-collapse justify-content-end ${
              menuOpen ? "show" : ""
            }`}
          >
            <ul className="navbar-nav align-items-lg-center gap-lg-4 gap-3">
              <li className="nav-item">
                <Link
                  href={makeLink("/about")}
                  className={`nav-link ${
                    pathname.includes("/about") ? "active" : ""
                  }`}
                >
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href={makeLink("/services")}
                  className={`nav-link ${
                    pathname.includes("/services") ? "active" : ""
                  }`}
                >
                  Services
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href={makeLink("/items")}
                  className={`nav-link ${
                    pathname.includes("/items") ? "active" : ""
                  }`}
                >
                  Items
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href={makeLink("/contact")}
                  className={`nav-link ${
                    pathname.includes("/contact") ? "active" : ""
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}