"use client";

import toast, { Toaster } from "react-hot-toast";
import "./contact.css";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { usePathname } from "next/navigation";
import ContactBanner from "./Contact.png";
import Image from "next/image";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

export default function Contact({ city }) {

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    const { name, value } = e.target;

    if (name === "name") {
      const onlyLetters = value.replace(/[^A-Za-z\s]/g, "");
      setForm((prev) => ({
        ...prev,
        [name]: onlyLetters
      }));
      return;
    }

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);

      setForm((prev) => ({
        ...prev,
        [name]: onlyNumbers
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // SUBMIT
  const handleSubmit = async () => {
    const { name, email, phone, subject, message } = form;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return toast.error("Please fill all fields");
    }

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name)) {
      return toast.error("Name can contain only letters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email");
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      return toast.error("Enter a valid 10-digit mobile number");
    }

    if (subject.trim().length < 3) {
      return toast.error("Subject must be at least 3 characters");
    }

    if (message.trim().length < 10) {
      return toast.error("Message must be at least 10 characters");
    }

    try {
      setSubmitting(true);

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

      toast.success("Message sent successfully");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    } finally {
      setSubmitting(false);
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
      <section className="contact-hero">
        <Image
          src={ContactBanner}
          alt="Contact Us"
          fill
          priority
          className="contact-banner"
        />

        {isValidCity && (
          <div className="hero-overlay">
            <h1>Reach Out To Us In {cityName}</h1>
          </div>
        )}

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
                      maxLength={50}
                      required
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
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      className="input-field"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={10}
                      inputMode="numeric"
                      required
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
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Your Message"
                      value={form.message}
                      onChange={handleChange}
                      maxLength={1000}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <button
                      className="btn submit-btn w-100"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? "Sending..." : "Send Message"}
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

        <div className="container">

          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              isValidCity
                ? `${cityName}, ${stateName}, India`
                : "Amrapali, Vaishali Nagar, Jaipur, Rajasthan, India"
            )
              }&z=12&output=embed`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
          />

        </div>

      </section>

    </div>
  );
}