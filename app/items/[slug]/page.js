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

export default function ItemDetailPage() {
    const { slug } = useParams();

    const [item, setItem] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

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
                <div className="container">

                    <div className="row g-4 align-items-center">

                        {/* IMAGE */}
                        <div className="col-lg-5">

                            <div
                                className="bg-white p-4 shadow-sm rounded text-center h-100 d-flex align-items-center justify-content-center"
                            >
                                <img
                                    src={
                                        item.image ||
                                        "/no-image.png"
                                    }
                                    alt={`${item.title} | Biomedical Equipment Supplier in India`}
                                    className="img-fluid"
                                    style={{
                                        maxHeight: "420px",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>

                        </div>

                        {/* DETAILS */}
                        <div className="col-lg-7">

                            <div className="bg-white p-4 shadow-sm rounded">

                                <h1 className="fw-bold mb-3">
                                    {item.title}
                                </h1>

                                <p className="text-muted mb-4">
                                    {item.desc}
                                </p>
                                <p className="mt-4 text-muted">
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
                                                        className="border rounded p-3 h-100"
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

                    <div className="row mt-5 justify-content-center">

                        <div className="col-lg-6">

                            <div className="bg-white p-4 shadow-sm rounded">

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

                    </div>

                    <div className="mt-5">
  <h3>Frequently Asked Questions</h3>

  <div className="mt-3">
    <h5>What is the price of {item.title}?</h5>
    <p>
      Contact Global Biomedical for the latest price and quotation.
    </p>

    <h5>Do you provide installation?</h5>
    <p>
      Yes, installation and technical support are available.
    </p>

    <h5>Is warranty available?</h5>
    <p>
      Yes, warranty depends on the manufacturer and product model.
    </p>
  </div>
</div>

                </div>
            </section>
        </>
    );
}