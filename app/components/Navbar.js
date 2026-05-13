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

      <div className="w-100 px-5 d-flex align-items-center justify-content-between">

        {/* LOGO */}
        <Link
          href={makeLink("")}
          className="navbar-brand"
        >
          <Image
            src="/globallogo.png"
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

            <Link
            className={
              pathname.includes("/about")
                ? "active"
                : ""
            }
              href={makeLink("/about")}
            >
              About
            </Link>

            <li>
         <Link
            className={
              pathname.includes("/services")
                ? "active"
                : ""
            }
              href={makeLink("/services")}
            >
              Service
            </Link>
            </li>

            <Link
            className={
              pathname.includes("/products")
                ? "active"
                : ""
            }
              href={makeLink("/products")}
            >
              Products
            </Link>

            <li>
            <Link
            className={
              pathname.includes("/contact")
                ? "active"
                : ""
            }
              href={makeLink("/contact")}
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