"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    doc,
    getDoc,
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";
import "../products.css";

export default function ItemDetailPage() {
    const { slug } = useParams();

    const [item, setItem] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
}, []);



    useEffect(() => {
        const fetchItem = async () => {
            try {
                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "globalbiomedicalorg",
                        "pages",
                        "products"
                    )
                );

                if (!snap.exists()) return;

                const products = snap.data().products || [];

                const found = products.find((p) => {
                    const itemSlug = p.title
                        ?.toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-");

                    return itemSlug === slug;
                });

                setItem(found || null);
            } catch (err) {
                console.error(err);
            }
        };

        fetchItem();
    }, [slug]);

    const handleSubmit = async () => {
        const { name, email, phone } = form;

        if (!name || !email || !phone) {
            return toast.error("Fill all fields");
        }

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {
            return toast.error(
                "Please enter valid mobile number"
            );
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return toast.error(
                "Please enter valid email"
            );
        }

        try {
            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "globalbiomedicalorg",
                    "productQueries"
                ),
                {
                    ...form,
                    productName: item?.title || "",
                    createdAt: serverTimestamp(),
                }
            );

            toast.success("Quote Request Sent");

            setForm({
                name: "",
                email: "",
                phone: "",
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to send");
        }
    };

    if (!item) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "22px",
                    fontWeight: "600",
                }}
            >
                Loading Item...
            </div>
        );
    }
    

    return (
        <>
            <Toaster position="top-right" />
            <section
                style={{
                    paddingTop: "120px",
                    paddingBottom: "60px",
                    background: "#f8f9fa",
                    minHeight: "100vh",
                }}
            >
                <div className="container product-detail-container">
                    <div className="row g-4 align-items-start">
                        {/* IMAGE */}
                        {/* <div className="col-lg-5">

                          <div className="product-image-card">
                                <img
                                    src={
                                        item.image ||
                                        "/no-image.png"
                                    }
                                    alt={`${item.title} | Biomedical Equipment Supplier in India`}
                                    className="product-main-image"
                                 
                                />
                            </div>

                        </div> */}
                        <div className="col-lg-4">
                            <div className="left-side">
                                {/* Product Image */}
                                <div className="product-image-card">
                                    <img
                                        src={item.image || "/no-image.png"}
                                        alt={`${item.title} | Biomedical Equipment Supplier in India`}
                                        className="product-main-image"
                                    />
                                </div>
                                {/* Quote Form */}

                            <div className="quote-card">
                                <h3 className="mb-4">
                                    Get Quote
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="form-control mb-3"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="form-control mb-3"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="form-control mb-4"
                                    maxLength={10}
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value.replace(/\D/g, ""),
                                        })
                                    }
                                />
                                <button
                                    className="btn w-100"
                                    style={{
                                        background: "#C08081",
                                        color: "#fff",
                                        border: "none",
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Submit Quote Request
                                </button>
                            </div>
                        </div>
                    </div>

                        {/* DETAILS */}
                        <div className="col-lg-8">

                            <div className="product-detail-card">

                                <h1 className="product-title">
                                    {item.title}
                                </h1>

                                <p className="product-description">
                                    {item.desc}
                                </p>
                                <p className="product-description mt-4">
                                    {item.title} is a high-quality biomedical and
                                    diagnostic equipment designed for hospitals,
                                    pathology laboratories, diagnostic centres,
                                    medical colleges and healthcare institutions.
                                    Global Biomedical supplies genuine products
                                    across India with installation, technical
                                    support and competitive pricing.

                                    </p>

                                <div className="row">

                                    {Object.entries(item).map(
                                        ([key, value]) => {

                                            if (
                                                [
                                                    "id",
                                                    "title",
                                                    "desc",
                                                    "image",
                                                    "createdAt",
                                                    "isPublished",
                                                ].includes(key)
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    key={key}
                                                    className="col-md-6 mb-3"
                                                >
                                                    <div
                                                        className="product-spec"
                                                    >
                                                        <strong
                                                            style={{
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {key.replace(
                                                                /_/g,
                                                                " "
                                                            )}
                                                        </strong>

                                                        <div className="mt-1 text-muted">
                                                            {value || "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* QUOTE FORM */}

                    {/* <div className="row mt-5 justify-content-center">

                        <div className="8">

                            <div className="quote-card">

                                <h3 className="mb-4">
                                    Get Quote
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="form-control mb-3"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="form-control mb-3"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                />

                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="form-control mb-3"
                                    maxLength={10}
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value.replace(
                                                /\D/g,
                                                ""
                                            ),
                                        })
                                    }
                                />

                                <button
                                    className="btn w-100"
                                    style={{
                                        background: "#C08081",
                                        color: "#fff",
                                        border: "none",
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Submit Quote Request
                                </button>

                            </div>

                        </div>

                    </div> */}

<div className="faq-section mt-5">

    <div className="text-center mb-5">
        <span className="faq-badge">
            Frequently Asked Questions
        </span>

        <h2 className="faq-title mt-3">
            Everything You Need To Know
        </h2>

        <p className="faq-subtitle">
            Find answers to the most common questions about{" "}
            <strong>{item.title}</strong>.
        </p>
    </div>

    <div
        className="accordion accordion-flush faq-accordion"
        id="faqAccordion"
    >

        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq1"
                >
                    What is the price of {item.title}?
                </button>
            </h2>

            <div
                id="faq1"
                className="accordion-collapse collapse show"
                data-bs-parent="#faqAccordion"
            >
                <div className="accordion-body">
                    The price depends on the model and configuration.
                    Contact us today for the latest quotation and
                    best available offer.
                </div>
            </div>
        </div>

        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2"
                >
                    Do you provide installation & training?
                </button>
            </h2>

            <div
                id="faq2"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
            >
                <div className="accordion-body">
                    Yes. We provide installation assistance,
                    user training and complete technical support.
                </div>
            </div>
        </div>

        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq3"
                >
                    Is warranty available?
                </button>
            </h2>

            <div
                id="faq3"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
            >
                <div className="accordion-body">
                    Yes. Warranty is available according to the
                    manufacturer and selected model.
                </div>
            </div>
        </div>

        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq4"
                >
                    Do you supply across India?
                </button>
            </h2>

            <div
                id="faq4"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
            >
                <div className="accordion-body">
                    Yes. We supply biomedical and laboratory
                    equipment to hospitals, laboratories and
                    diagnostic centres all over India.
                </div>
            </div>
        </div>
    </div>
</div>
                </div>
            </section>
        </>
    );
}