"use client";

import toast, { Toaster } from "react-hot-toast";
import "./contact.css";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { usePathname } from "next/navigation";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

export default function Contact({ city }) {

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [contactInfo, setContactInfo] = useState([]);
const [mounted, setMounted] =
  useState(false);
  // current city
const pathname = usePathname();

const pathParts = pathname
  .split("/")
  .filter(Boolean);

const [currentCity, setCurrentCity] =
  useState("");

const [isValidCity, setIsValidCity] =
  useState(false);

const [stateName, setStateName] =
  useState("");

  // format city
  const formatCity = (name = "") =>
    name
      .split("-")
      .map(
        (w) =>
          w.charAt(0).toUpperCase() + w.slice(1)
      )
      .join(" ");

  const citySlug = currentCity
    ?.toLowerCase()
    ?.replace(/\s+/g, "-");

  const cityName = formatCity(currentCity);
  useEffect(() => {

  setMounted(true);

}, []);
useEffect(() => {

  const checkDistrict = async () => {

    const slug = pathParts[0];

    setStateName("");

    if (!slug) {

      setCurrentCity("");
      setIsValidCity(false);

      return;

    }

    try {

      const snap = await getDoc(
        doc(
          db,
          "websites",
          "globalbiomedicalorg",
          "districts",
          slug
        )
      );

      if (snap.exists()) {

        const data = snap.data();

        setCurrentCity(slug);

        setStateName(
          data?.state || ""
        );

        setIsValidCity(true);

      } else {

        setCurrentCity("");
        setIsValidCity(false);

      }

    } catch {

      setCurrentCity("");
      setIsValidCity(false);

    }

  };

  checkDistrict();

}, [pathname]);
  // FETCH CONTACT INFO
  useEffect(() => {

    const load = async () => {

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
        } else {
          setContactInfo([]);
        }

      } catch (err) {
        console.error(err);
      }

      setLoading(false);

    };

    load();

  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // SUBMIT
  const handleSubmit = async () => {

    const {
      name,
      email,
      phone,
      message
    } = form;

    if (
      !name ||
      !email ||
      !phone ||
      !message
    ) {
      return toast.error(
        "Fill all fields"
      );
    }

    try {

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "globalbiomedicalorg",
          "contactQueries"
        ),
        {
          ...form,
          city: cityName,
          createdAt: serverTimestamp()
        }
      );

      toast.success("Message sent");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

    } catch (err) {

      console.error(err);

      toast.error("Failed to send");

    }

  };
if (!mounted || loading) {
  return (
    <div className="page-loader">
      <div className="loader-circle"></div>

      <h2>Global Biomedical</h2>

      <p>Loading amazing healthcare solutions...</p>
    </div>
  );
}
  return (
    <div className="contact-page">

      <Toaster position="top-right" />

      {/* HERO */}
      <section className="contact-hero text-center">

        <div className="container">

          <h1 className="fw-bold display-4">

            Contact <span>Us</span>

            {" "}

   {isValidCity
  ? ` in ${cityName}`
  : ""}

          </h1>

          <p className="mt-3">
            Get in touch with us for
            medical solutions & support
            {" "}
            {isValidCity
  ? ` in ${cityName}`
  : ""}
          </p>

        </div>

      </section>

      {/* CONTACT SECTION */}
      <section className="py-5">

        <div className="container">

          <div className="row g-5">

            {/* LEFT INFO */}
            <div
              className="col-lg-5"
              data-aos="fade-right"
            >

              <h4 className="fw-bold mb-3">
                Get In Touch
              </h4>

              <p className="text-muted">
                We are here to help you
                with all your diagnostic
                and medical needs.
              </p>

              <div className="contact-info mt-4">

                {loading ? (

                  <p className="text-muted">
                    Loading...
                  </p>

                ) : contactInfo.length === 0 ? (

                  <p className="text-muted">
                    No contact info added
                  </p>

                ) : (

                  contactInfo.map((item, i) => (

                    <div
                      className="info-box"
                      key={i}
                    >

                      <i
                        className={
                          item.label
                            .toLowerCase()
                            .includes("address")
                            ? "bi bi-geo-alt"
                            : item.label
                                .toLowerCase()
                                .includes("email")
                            ? "bi bi-envelope"
                            : item.label
                                .toLowerCase()
                                .includes("phone")
                            ? "bi bi-telephone"
                            : "bi bi-info-circle"
                        }
                      ></i>

                      <div>

                        <strong>
                          {item.label}
                        </strong>

<p>

{
  item.label
    .toLowerCase()
    .includes("address")

    ? isValidCity
      ? `${cityName}, ${stateName}, India`
      : item.value

    : item.value
}

</p>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

            {/* RIGHT FORM */}
            <div
              className="col-lg-7"
              data-aos="fade-left"
            >

              <div className="contact-form">

                <div className="row g-3">

                  <div className="col-md-6">

                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      className="input-field"
                      value={form.name}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="col-md-6">

                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="input-field"
                      value={form.email}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="col-md-6">

                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      className="input-field"
                      value={form.phone}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="col-md-6">

                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      className="input-field"
                      value={form.subject}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="col-12">

                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Your Message"
                      value={form.message}
                      onChange={handleChange}
                    ></textarea>

                  </div>

                  <div className="col-12">

                    <button
                      className="btn submit-btn w-100"
                      onClick={handleSubmit}
                    >
                      Send Message
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* MAP */}
      <section className="map-section">

        <div className="container-fluid p-0">

          <iframe
            src={`https://maps.google.com/maps?q=${cityName},India&output=embed`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>

        </div>

      </section>

    </div>
  );
}