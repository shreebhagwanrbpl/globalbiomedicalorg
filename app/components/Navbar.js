"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {

  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  // current path
  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  // reserved routes
  const reservedRoutes = [
    "about",
    "contact",
    "items",
    "products",
    "services",
  ];

  // district slug
  const district =
    pathParts[0] &&
    !reservedRoutes.includes(
      pathParts[0]
    )
      ? pathParts[0]
      : "";

  // dynamic links
    const makeLink = (
    path = ""
  ) => {

    // no district
    if (!district) {

      return path || "/";

    }

    // homepage
    if (!path) {

      return `/${district}`;

    }

    // other pages
    return `/${district}${path}`;

  };

  return (
<nav className="navbar navbar-expand-lg custom-navbar">

  <div className="container-fluid px-lg-5 px-3">

    {/* LOGO */}
    <Link
      href={makeLink("")}
      className="navbar-brand"
    >
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
      onClick={() =>
        setMenuOpen(!menuOpen)
      }
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
              pathname.includes("/about")
                ? "active"
                : ""
            }`}
          >
            About
          </Link>
        </li>

        <li className="nav-item">
          <Link
            href={makeLink("/services")}
            className={`nav-link ${
              pathname.includes("/services")
                ? "active"
                : ""
            }`}
          >
            Services
          </Link>
        </li>

        <li className="nav-item">
          <Link
            href={makeLink("/items")}
            className={`nav-link ${
              pathname.includes("/items")
                ? "active"
                : ""
            }`}
          >
            Items
          </Link>
        </li>

        <li className="nav-item">
          <Link
            href={makeLink("/contact")}
            className={`nav-link ${
              pathname.includes("/contact")
                ? "active"
                : ""
            }`}
          >
            Contact
          </Link>
        </li>

      </ul>
    </div>

  </div>
</nav>
  );
}