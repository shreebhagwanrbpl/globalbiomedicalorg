"use client";
import Link from "next/link";
import Image from "next/image";
import "./Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
     <div className="w-100 px-5 d-flex align-items-center justify-content-between">
      <Link href="/" className="navbar-brand">
        <Image
          src="/logo.png"
          alt="Raj Biosis"
          width={140}
          height={50}
          style={{ objectFit: "contain" }}
          priority
        />
      </Link>
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-center gap-4">
            <li><Link href="/about" className="nav-link">About</Link></li>
            <li><Link href="/services" className="nav-link">Services</Link></li>
            <li><Link href="/products" className="nav-link">Products</Link></li>
            <li><Link href="/contact" className="nav-link">Contact</Link></li>
            {/* <li>
              <Link href="/contact" className="btn px-3">
                Get Details
              </Link>
            </li> */}
          </ul>
        </div>
      </div>


        </nav>
      );
    }