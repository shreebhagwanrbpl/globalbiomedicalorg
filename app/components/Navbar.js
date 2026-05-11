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
    !reservedRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "jaipur";

  // dynamic links
  const makeLink = (path = "") => {

    if (!path) {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">

      <div className="w-100 px-5 d-flex align-items-center justify-content-between">

        {/* LOGO */}
        <Link
          href={makeLink("")}
          className="navbar-brand"
        >
          <Image
            src="/logo.png"
            alt="Raj Biosis"
            width={140}
            height={50}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>

        {/* TOGGLE */}
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div
          className={`collapse navbar-collapse ${
            menuOpen ? "show" : ""
          }`}
          id="nav"
        >

          <ul className="navbar-nav ms-auto align-items-center gap-4">

            <li>
              <Link
                href={makeLink("/about")}
                className="nav-link"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                href={makeLink("/services")}
                className="nav-link"
              >
                Services
              </Link>
            </li>

            <li>
              <Link
                href={makeLink("/items")}
                className="nav-link"
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                href={makeLink("/contact")}
                className="nav-link"
              >
                Contact
              </Link>
            </li>

            {/* <li>
              <Link
                href={makeLink("/contact")}
                className="btn px-3"
              >
                Get Details
              </Link>
            </li> */}

          </ul>

        </div>

      </div>

    </nav>
  );
}