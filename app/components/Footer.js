"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [contactInfo, setContactInfo] =
    useState([]);
  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

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
      : "";

  // format city
  const formatCity = (name = "") =>
    name
      .split("-")
      .map(
        (w) =>
          w.charAt(0).toUpperCase() + w.slice(1)
      )
      .join(" ");

  const citySlug = district;

  const city = formatCity(citySlug);
  const [stateName, setStateName] =
    useState("");

  // dynamic links
  const makeLink = (path = "") => {

    // no district
    if (!citySlug) {

      return path || "/";

    }

    // homepage
    if (!path) {

      return `/${citySlug}`;

    }
    // other pages
    return `/${citySlug}${path}`;
  };
  useEffect(() => {

    const loadDistrict = async () => {

      if (!citySlug) return;

      try {

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "globalbiomedicalorg",
            "districts",
            citySlug
          )
        );

        if (snap.exists()) {

          setStateName(
            snap.data()?.state || ""
          );

        }

      } catch (err) {

        console.log(err);

      }

    };

    loadDistrict();

  }, [citySlug]);
  const getValue = (key) => {
    return (
      contactInfo.find((x) => {
        const label = x.label?.toLowerCase();

        return (
          label?.includes(key) ||
          (key === "address" &&
            label?.includes("location"))
        );
      })?.value || ""
    );
  };
  // const getValue = (key) => {

  //   return (
  //     contactInfo.find((x) => {

  //       const label =
  //         x.label?.toLowerCase();

  //       return (
  //         label?.includes(key) ||
  //         (key === "address" &&
  //           label?.includes(
  //             "location"
  //           ))
  //       );



  //     })?.value || "Amrapali , Vaishali Nagar , Jaipur Jaipur, India, 302021"
  //   );

  // };
  useEffect(() => {

    const fetchContact =
      async () => {

        try {

          const snap = await getDoc(
            doc(
              db,
              "websites",
              "globalbiomedicalorg",
              "pages",
              "contact"
            )
          );

          if (snap.exists()) {

            setContactInfo(
              snap.data().contactInfo || []
            );

          }

        } catch (err) {

          console.log(err);

        }

      };

    fetchContact();

  }, []);
  return (
    <footer className="footer">

      <div className="container-fluid px-5 py-5">

        <div className="row gy-4">

          {/* COMPANY INFO */}
          <div className="col-lg-4">

            <h4 className="fw-bold text-white">
              Global Biomedical inc.
            </h4>

            <p className="small">
              Trusted partner for diagnostic instruments,
              reagents, and medical consumables across India.
            </p>

          </div>

          {/* QUICK LINKS */}
          <div className="col-lg-2">

            <h6 className="footer-title">
              Quick Links
            </h6>

            <ul className="footer-links">

              <li>
                <Link href={makeLink("")}>
                  Home
                </Link>
              </li>

              <li>
                <Link href={makeLink("/items")}>
                  Products
                </Link>
              </li>

              <li>
                <Link href={makeLink("/services")}>
                  Services
                </Link>
              </li>

              <li>
                <Link href={makeLink("/about")}>
                  About
                </Link>
              </li>

              <li>
                <Link href={makeLink("/contact")}>
                  Contact
                </Link>
              </li>

            </ul>

          </div>

          {/* SERVICES */}
          <div className="col-lg-3">

            <h6 className="footer-title">
              Our Services
            </h6>

            <ul className="footer-links">

              <li>Diagnostic Equipment</li>

              <li>Medical Consumables</li>

              <li>Lab Solutions</li>

              <li>Support & Maintenance</li>

            </ul>

          </div>

          {/* CONTACT */}
          <div className="col-lg-3">

            <h6 className="footer-title">
              Contact
            </h6>

            <p className="small mb-1">
              <i className="bi bi-geo-alt"></i>


              {district
                ? stateName
                  ? `${city}, ${stateName}, India`
                  : getValue("address")
                : getValue("address")}

            </p>

            <p className="small mb-1">
              <i className="bi bi-envelope"></i>
              {getValue("email")}
            </p>

            <p className="small">
              <i className="bi bi-telephone"></i>
              {getValue("contact")}
            </p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom mt-4 pt-3 text-center">

          <p className="mb-0 small">
            © {new Date().getFullYear()}
            {" "}
            Global Biomedical |
            All Rights Reserved
          </p>

        </div>

      </div>

      <style jsx>{`
  .footer {
    background: linear-gradient(
      135deg,
      #1b0f2a,
      #111827
    );
    color: #fff;
  }

  .footer-title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 22px;
    position: relative;
    padding-bottom: 10px;
  }

  .footer-title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 55px;
    height: 3px;
    background: #a56b97;;
    border-radius: 20px;
  }

  .footer p {
    color: #cbd5e1;
    line-height: 1.8;
  }

  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links li {
    margin-bottom: 14px;
  }

  .footer-links a {
    color: #e5e7eb !important;
    text-decoration: none !important;
    font-size: 15px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  .footer-links a::before {
    content: "→";
    color: #198754;
    margin-right: 10px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .footer-links a:hover {
    color: #a56b97 !important;
    transform: translateX(6px);
  }

  .footer-links a:hover::before {
    margin-right: 14px;
  }

  .footer-links li:not(:has(a)) {
    color: #cbd5e1;
    font-size: 14px;
    padding-left: 2px;
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 30px;
  }

  .footer-bottom p {
    color: #94a3b8;
    letter-spacing: 0.3px;
  }

  i {
    margin-right: 10px;
    color: #a56b97;
    font-size: 16px;
  }

  .small {
    color: #cbd5e1;
    line-height: 1.8;
  }

  @media (max-width: 768px) {
    .footer {
      text-align: center;
    }

    .footer-title::after {
      left: 50%;
      transform: translateX(-50%);
    }

    .footer-links a {
      justify-content: center;
    }
  }
    
.footer-links a,
.footer-links a:link,
.footer-links a:visited,
.footer-links a:hover,
.footer-links a:active {
  text-decoration: none !important;
}
`}</style>

    </footer>
  );
}