"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid px-5">
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
            <li>
              <Link href="/contact" className="btn px-3">
                Get Details
              </Link>
            </li>
          </ul>
        </div>
      </div>

    <style jsx>{`
    .custom-navbar {
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(12px);
      padding: 12px 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    /* LINKS */
    .nav-link {
      font-weight: 500;
      color: #333;
      position: relative;
      transition: 0.3s;
    }

    /* UNDERLINE HOVER */
    .nav-link::after {
      content: "";
      position: absolute;
      width: 0%;
      height: 2px;
      background: #8e6a8f;
      left: 0;
      bottom: -5px;
      transition: 0.3s;
    }

    .nav-link:hover {
      color: #8e6a8f;
    }

    .nav-link:hover::after {
      width: 100%;
    }

    /* BUTTON */
    .nav-btn {
      background: linear-gradient(3deg, #945c8dd6, #db8a64, #462c647d);
      color: #fff;
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 14px;
      transition: 0.3s;
    }

    .nav-btn:hover {
      background: #000;
      transform: scale(1.05);
    }

    /* TOGGLER */
    .navbar-toggler {
      border: none;
    }

    /* LOGO */
    .navbar-brand img {
      transition: 0.3s;
    }

    .navbar-brand img:hover {
      transform: scale(1.05);
    }

    `}</style>

        </nav>
      );
    }