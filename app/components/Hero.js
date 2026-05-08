 "use client";
 import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";   
    import Link from "next/link";

    export default function Hero() {
         const [data, setData] = useState({
  title: "Advanced Diagnostic Solutions.",
  description: "Delivering high-quality medical equipment & consumables for hospitals, labs & healthcare professionals.",
  button1Text: "Explore Services",
  button2Text: "Contact Us",
});

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(
        doc(db, "websites", "globalbiomedicalorg", "pages", "home")
      );

      if (snap.exists()) {
        setData(snap.data());
      }
    };

    fetchData();
  }, []);

      return (
        <section className="hero-section text-white">
          <div className="container">
            <div className="row align-items-center">

              <div className="col-lg-6 text-center position-relative">
                <div className="hero-glow"></div>
                <img
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67"
                  className="img-fluid rounded-4 shadow-lg"
                  alt="medical lab"
                />
              </div>

              <div className="col-lg-6">
                <span className="hero-badge mb-3">
                  Trusted Since 2009
                </span>

                <h1 className="fw-bold display-4 hero-title">
                  {data?.title}
                </h1>

                <p className="mt-3 hero-subtext">
                  {data?.description}
                </p>

                <div className="mt-4 d-flex gap-3">
                  <Link href="/services" className="hero-btn-primary">
                    {data?.button1Text}
                  </Link>

                  <Link href="/contact">
                    <button className="btn hero-btn-outline">
                      {data?.button2Text}
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </section>
      );
    }