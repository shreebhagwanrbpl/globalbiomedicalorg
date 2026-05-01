    import Link from "next/link";

    export default function Hero() {
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
                  Advanced <span>Diagnostic</span> Solutions
                </h1>

                <p className="mt-3 hero-subtext">
                  Delivering high-quality medical equipment & consumables
                  for hospitals, labs & healthcare professionals.
                </p>

                <div className="mt-4 d-flex gap-3">
                  <Link href="/services" className="hero-btn-primary">
                    Explore Services
                  </Link>

                  <Link href="/contact">
                    <button className="btn hero-btn-outline">
                      Contact Us
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </section>
      );
    }