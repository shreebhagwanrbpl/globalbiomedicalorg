"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
import {
    doc,
    getDoc,
    getDocs,
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import {
    FaShareAlt,
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaLink,
    FaPlay,
} from "react-icons/fa";
import { db } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";
import "../products.css";

export default function ItemDetailPage() {
    const pathname = usePathname();

    const pathParts = pathname
        .split("/")
        .filter(Boolean);


    const { slug } = useParams();

    const [item, setItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);
    const shareRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const cityName =
        pathParts.length > 2
            ? pathParts[0]
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase())
            : "India";
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);



    useEffect(() => {
        const fetchItem = async () => {
            try {

                let found = null;

                // OLD PRODUCTS
                const oldSnap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "globalbiomedicalorg",
                        "pages",
                        "products"
                    )
                );

                if (oldSnap.exists()) {

                    const oldProducts =
                        oldSnap.data().products || [];

                    found = oldProducts.find((p) => {

                        const itemSlug =
                            p.slug ||
                            p.title
                                ?.toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9\s-]/g, "")
                                .replace(/\s+/g, "-");

                        return itemSlug === slug;
                    });
                }

                // CATEGORY PRODUCTS
                if (!found) {

                    const categorySnap = await getDocs(
                        collection(
                            db,
                            "websites",
                            "globalbiomedicalorg",
                            "pages",
                            "categoryproducts",
                            "categories"
                        )
                    );

                    categorySnap.forEach((docSnap) => {

                        const products =
                            docSnap.data().products || [];

                        const match = products.find((p) => {

                            const itemSlug =
                                p.slug ||
                                p.title
                                    ?.toLowerCase()
                                    .trim()
                                    .replace(/[^a-z0-9\s-]/g, "")
                                    .replace(/\s+/g, "-");

                            return itemSlug === slug;
                        });

                        if (match) {
                            found = match;
                        }
                    });
                }

                setItem(found || null);

                if (found) {

                    if (found.images?.length) {
                        setSelectedImage(found.images[0]);
                    } else {
                        setSelectedImage(found.image);
                    }

                    setSelectedMedia("image");
                }

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
                    <div className="mb-4">
                        <small className="text-muted">
                            Home / {cityName} / {item.title}
                        </small>
                    </div>

                    <div className="page-header">

                        <h1 className="main-product-heading">
                            {item.title} Supplier, Dealer & Distributor In {cityName}
                        </h1>

                        <p className="product-subheading">
                            Trusted {item.title} Supplier, Dealer,
                            Distributor and Exporter in {cityName},
                            Rajasthan, India.
                        </p>

                        <div className="keyword-tags">
                            <span>{item.title} Supplier</span>
                            <span>{item.title} Dealer</span>
                            <span>{item.title} Distributor</span>
                            <span>{item.title} Price</span>
                            <span>{cityName}</span>
                        </div>

                    </div>
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
                                    {selectedMedia === "video" && item.video ? (
                                        <video
                                            controls
                                            className="product-video"
                                        >
                                            <source
                                                src={item.video}
                                                type="video/mp4"
                                            />
                                        </video>

                                    ) : (

                                        <img
                                            src={
                                                selectedImage ||
                                                item.image ||
                                                "/no-image.png"
                                            }
                                            alt={item.title}
                                            className="product-main-image"
                                        />

                                    )}
                                </div>
                                <div className="d-flex gap-2 flex-wrap mt-3">

                                    {(item.images?.length
                                        ? item.images
                                        : [item.image]
                                    ).map((img, i) => (

                                        <img
                                            key={i}
                                            src={img}
                                            onClick={() => {
                                                setSelectedImage(img);
                                                setSelectedMedia("image");
                                            }}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                cursor: "pointer",
                                                objectFit: "cover",
                                                border:
                                                    selectedImage === img
                                                        ? "2px solid #0d6efd"
                                                        : "1px solid #ddd",
                                                borderRadius: 8,
                                            }}
                                        />

                                    ))}

                                    {item.video && (

                                        <button
                                            className="btn btn-light border"
                                            onClick={() =>
                                                setSelectedMedia("video")
                                            }
                                        >
                                            ▶ Video
                                        </button>

                                    )}

                                    {item.pdf && (

                                        <a
                                            href={item.pdf}
                                            target="_blank"
                                            className="btn btn-light border"
                                        >
                                            📄 PDF
                                        </a>

                                    )}

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
                                <div
                                    className="d-flex justify-content-between align-items-start position-relative"
                                >

                                    <h2 className="product-title">
                                        Product Specifications & Features
                                    </h2>

                                    <div
                                        ref={shareRef}
                                        style={{ position: "relative" }}
                                    >

                                        <button
                                            className="btn btn-light border rounded-circle"
                                            onClick={async () => {

                                                if (navigator.share) {

                                                    try {
                                                        await navigator.share({
                                                            title: item.title,
                                                            text: item.desc,
                                                            url: window.location.href,
                                                        });

                                                    } catch (err) { }

                                                } else {

                                                    setShowShare(!showShare);

                                                }

                                            }}
                                        >
                                            <FaShareAlt />
                                        </button>

                                        {showShare && (

                                            <div
                                                className="shadow bg-white rounded p-2"
                                                style={{
                                                    position: "absolute",
                                                    right: 0,
                                                    top: 50,
                                                    width: 220,
                                                    zIndex: 1000,
                                                }}
                                            >

                                                <button
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            window.location.href
                                                        )
                                                    }
                                                >
                                                    <FaLink className="me-2" />
                                                    Copy Link
                                                </button>

                                                <a
                                                    className="dropdown-item"
                                                    target="_blank"
                                                    href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                                                >
                                                    <FaWhatsapp className="me-2 text-success" />
                                                    WhatsApp
                                                </a>

                                                <a
                                                    className="dropdown-item"
                                                    target="_blank"
                                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                                >
                                                    <FaFacebook className="me-2 text-primary" />
                                                    Facebook
                                                </a>

                                            </div>

                                        )}

                                    </div>

                                </div>
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
                                                    "images",
                                                    "video",
                                                    "pdf",
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


                    <div className="mt-5">

                        <div className="text-center mb-5">
                            <span className="faq-badge">
                                Frequently Asked Questions
                            </span>

                            <h2 className="faq-title mt-3">
                                Frequently Asked Questions About {item.title}
                            </h2>

                            <p className="faq-subtitle">
                                Find answers related to {item.title} price,
                                supplier, dealer, distributor, installation,
                                warranty, quotation and technical support in {cityName}.
                            </p>
                        </div>

                        <div className="row g-4">

                            <div className="col-md-6">
                                <div className="faq-card">
                                    <h4>
                                        What is the price of {item.title} in {cityName}?
                                    </h4>

                                    <p>
                                        The price of {item.title} in {cityName}
                                        depends on the model, specifications and
                                        configuration. As a trusted supplier,
                                        dealer and distributor of {item.title}
                                        in {cityName}, we provide the latest
                                        quotation and competitive pricing.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="faq-card">
                                    <h4>
                                        What is {item.title} used for?
                                    </h4>

                                    <p>
                                        {item.title} is widely used in hospitals,
                                        pathology laboratories, diagnostic centres,
                                        healthcare institutions and research facilities
                                        across {cityName} and nearby locations.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="faq-card">
                                    <h4>
                                        Do you provide installation support?
                                    </h4>

                                    <p>
                                        Yes, we provide installation, training,
                                        maintenance and technical support for
                                        {item.title} in {cityName}. Our team
                                        assists customers before and after delivery.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="faq-card">
                                    <h4>
                                        Is warranty available?
                                    </h4>

                                    <p>
                                        Yes, warranty for {item.title}
                                        depends on the manufacturer and model.
                                        Contact our team in {cityName}
                                        for complete warranty and service details.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="faq-card">
                                    <h4>
                                        Do you supply in {cityName}?
                                    </h4>

                                    <p>
                                        Yes, we are a trusted supplier,
                                        dealer and distributor of {item.title}
                                        in {cityName}. We provide fast delivery,
                                        installation support and after-sales
                                        service across the region.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="faq-card">
                                    <h4>
                                        Can I request a quotation?
                                    </h4>

                                    <p>
                                        Yes, submit the enquiry form to get
                                        the latest {item.title} price in {cityName},
                                        product specifications, availability and
                                        quotation from our sales team.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="seo-bottom-content mt-5">
                        <p>
                            We are a leading supplier, dealer and distributor of
                            {item.title} in {cityName}, providing installation,
                            training, maintenance support and competitive pricing
                            for hospitals, pathology laboratories, diagnostic
                            centres and healthcare institutions.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}