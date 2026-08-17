"use client";

import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import { usePathname } from "next/navigation";

import {
    FaPlay,
    FaShareAlt,
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaLink,
} from "react-icons/fa";

import {
    addDoc,
    collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import "./page.css";

export default function ProductDetails({ slug, product: initialProduct }) {
    const [product, setProduct] = useState(initialProduct || null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(() => {
        if (initialProduct) {
            return initialProduct.images?.length > 0 ? initialProduct.images[0] : (initialProduct.image || "");
        }
        return "";
    });
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);
    const [loading, setLoading] = useState(!initialProduct);

    const shareRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const pathname = usePathname();

    const pathParts = pathname.split("/").filter(Boolean);
    const city = pathParts.length > 1 ? pathParts[0] : "India";
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);

    useEffect(() => {
        if (initialProduct) {
            setProduct(initialProduct);
            setSelectedImage(initialProduct.images?.length > 0 ? initialProduct.images[0] : (initialProduct.image || ""));
            setSelectedMedia("image");
            setLoading(false);
            return;
        }

        const loadProduct = async () => {
            try {
                setLoading(true);
                const allProducts = await fetchFullCatalog();
                const found = allProducts.find((p) => p.slug === slug);

                setProduct(found || null);

                if (found) {
                    if (found.images?.length > 0) {
                        setSelectedImage(found.images[0]);
                    } else {
                        setSelectedImage(found.image || "");
                    }
                    setSelectedMedia("image");
                }
            } catch (error) {
                console.error("Error loading product details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [slug, initialProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.name.trim()) {
            return toast.error("Name is required");
        }

        if (!emailRegex.test(form.email)) {
            return toast.error("Enter valid email");
        }

        if (!phoneRegex.test(form.phone)) {
            return toast.error("Enter valid mobile number");
        }

        try {
            setSubmitting(true);

            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "globalbiomedicalorg",
                    "productQueries"
                ),
                {
                    ...form,
                    productName: product.title,
                    productSlug: product.slug,
                    brand: product.brand || "",
                    model: product.model || "",
                    createdAt: new Date(),
                }
            );

            toast.success("Your enquiry has been submitted successfully.");

            setForm({
                name: "",
                email: "",
                phone: "",
            });
        } catch (error) {
            console.error("Error submitting query:", error);
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const productSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: product.image ? [product.image] : [],
            description:
                product.desc ||
                product.description ||
                product.title,
            brand: {
                "@type": "Brand",
                name: product.brand || "Global Biomedical",
            },
        }
        : null;

    const faqSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: `What is ${product.title} used for?`,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: `${product.title} is used in hospitals, pathology labs and diagnostic centres.`,
                    },
                },
                {
                    "@type": "Question",
                    name: "Do you provide installation support?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, installation and technical support are available.",
                    },
                },
            ],
        }
        : null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied");
        setShowShare(false);
    };

    const handleWhatsapp = () => {
        const shareText = `🔬 ${product?.title}\n\n${product?.desc || ""}\n\n🌐 ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    };

    const handleFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
            )}`,
            "_blank"
        );
    };

    const handleInstagram = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Instagram sharing is not directly supported. Link copied to clipboard!");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.desc || product.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share failed:", err);
            }
        } else {
            setShowShare(!showShare);
        }
    };

    const handleDownloadBrochure = () => {
        if (!product) return;
        const pdfUrl = product.pdf || product.brochure || product.brochureUrl || product.catalogUrl;

        if (pdfUrl) {
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.download = `${product.slug || "product"}-brochure.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Downloading product brochure...");
            return;
        }

        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            toast.error("Please allow popups in your browser to download the PDF brochure.");
            return;
        }

        const prodImg =
            (product.images && product.images[0]) ||
            product.image ||
            "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop";

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${product.title || "Product"} - Official Brochure</title>
              <style>
                @page { size: A4 portrait; margin: 0; }
                * { box-sizing: border-box; }
                body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #333; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .page { width: 210mm; min-height: 297mm; padding: 0; margin: auto; background: white; position: relative; }
                .header-bar { background: #1e5a75; color: #ffffff; padding: 22px 35px; display: flex; justify-content: space-between; align-items: center; }
                .header-bar h1 { margin: 0; font-size: 22px; font-weight: 700; }
                .header-info { text-align: right; font-size: 12px; line-height: 1.4; opacity: 0.95; }
                .title-banner { background: #e89938; color: #ffffff; padding: 10px 35px; }
                .title-banner h2 { margin: 0; font-size: 14px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; }
                .content-body { padding: 25px 35px 80px 35px; }
                .prod-title { font-size: 24px; font-weight: 800; color: #111; margin-top: 0; margin-bottom: 20px; }
                .top-grid { display: grid; grid-template-columns: 220px 1fr; gap: 25px; margin-bottom: 25px; }
                .img-box { border: 2px solid #9ed4cc; border-radius: 12px; padding: 15px; height: 250px; display: flex; align-items: center; justify-content: center; background: #ffffff; }
                .img-box img { max-width: 100%; max-height: 220px; object-fit: contain; }
                .spec-table { width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #bce2dc; border-radius: 10px; overflow: hidden; }
                .spec-table th { background: #1e5a75; color: white; text-align: left; padding: 9px 14px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .spec-table td { padding: 7px 14px; font-size: 11.5px; border-bottom: 1px solid #e5f3f0; }
                .spec-table tr:nth-child(even) { background: #eef7f5; }
                .spec-table tr:last-child td { border-bottom: none; }
                .spec-label { font-weight: 700; color: #1e5a75; width: 38%; }
                .spec-value { color: #222; }
                .overview-section { margin-bottom: 22px; }
                .section-heading { font-size: 14px; font-weight: 800; color: #1e5a75; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; border-bottom: 2px solid #1e5a75; padding-bottom: 3px; display: inline-block; }
                .overview-text { font-size: 11.5px; line-height: 1.6; color: #444; margin: 0; }
                .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .info-card { border: 1.5px solid #9ed4cc; border-radius: 10px; overflow: hidden; background: #fbfdfe; }
                .info-card-header { background: #1e5a75; color: white; padding: 8px 14px; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
                .info-card-body { padding: 12px 14px; }
                .info-list { list-style: none; padding: 0; margin: 0; }
                .info-list li { font-size: 11px; margin-bottom: 7px; display: flex; align-items: center; gap: 8px; color: #333; }
                .dot { width: 7px; height: 7px; background: #e89938; border-radius: 50%; display: inline-block; flex-shrink: 0; }
                .footer-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 35px; border-top: 2px solid #e89938; display: flex; justify-content: space-between; font-size: 10.5px; color: #666; background: #ffffff; z-index: 5; }
                .watermark-container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: space-evenly; align-items: center; opacity: 0.07; }
                .watermark-row { transform: rotate(-30deg); font-size: 34px; font-weight: 900; color: #1e5a75; letter-spacing: 6px; white-space: nowrap; user-select: none; text-transform: uppercase; }
                .header-bar, .title-banner, .content-body { position: relative; z-index: 3; }
              </style>
            </head>
            <body>
              <div class="page">
                <div class="watermark-container">
                  <div class="watermark-row">GLOBAL BIOMEDICAL INC. &nbsp;&nbsp;&nbsp;&nbsp; GLOBAL BIOMEDICAL INC.</div>
                  <div class="watermark-row">GLOBAL BIOMEDICAL INC. &nbsp;&nbsp;&nbsp;&nbsp; GLOBAL BIOMEDICAL INC.</div>
                  <div class="watermark-row">GLOBAL BIOMEDICAL INC. &nbsp;&nbsp;&nbsp;&nbsp; GLOBAL BIOMEDICAL INC.</div>
                  <div class="watermark-row">GLOBAL BIOMEDICAL INC. &nbsp;&nbsp;&nbsp;&nbsp; GLOBAL BIOMEDICAL INC.</div>
                  <div class="watermark-row">GLOBAL BIOMEDICAL INC. &nbsp;&nbsp;&nbsp;&nbsp; GLOBAL BIOMEDICAL INC.</div>
                </div>

                <div class="header-bar">
                  <h1>Global Biomedical Inc.</h1>
                  <div class="header-info">
                    Phone: +91 9257984336 | +91 8529833535 | +91 9983301657<br/>
                    Web: www.globalbiomedical.org
                  </div>
                </div>

                <div class="title-banner">
                  <h2>OFFICIAL PRODUCT SPECIFICATION BROCHURE</h2>
                </div>

                <div class="content-body">
                  <h2 class="prod-title">${product.title}</h2>

                  <div class="top-grid">
                    <div class="img-box">
                      <img src="${prodImg}" alt="${product.title}" />
                    </div>

                    <div>
                      <table class="spec-table">
                        <thead>
                          <tr>
                            <th colspan="2">KEY SPECIFICATIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="spec-label">Brand:</td>
                            <td class="spec-value">${product.brand || "Global Biomedical Partner"}</td>
                          </tr>
                          <tr>
                            <td class="spec-label">Model:</td>
                            <td class="spec-value">${product.model || "N/A"}</td>
                          </tr>
                          <tr>
                            <td class="spec-label">Instrument:</td>
                            <td class="spec-value">${product.instrument || "Diagnostic Equipment"}</td>
                          </tr>
                          <tr>
                            <td class="spec-label">Usage:</td>
                            <td class="spec-value">${product.usage || "Clinical Laboratory"}</td>
                          </tr>
                          <tr>
                            <td class="spec-label">Automation:</td>
                            <td class="spec-value">${product.automation || "Fully Automatic"}</td>
                          </tr>
                          <tr>
                            <td class="spec-label">Size / Capacity:</td>
                            <td class="spec-value">${product.capacity || "Standard"}</td>
                          </tr>
                          <tr>
                            <td class="spec-label">Availability:</td>
                            <td class="spec-value">${product.availability || "In Stock"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="overview-section">
                    <div class="section-heading">PRODUCT OVERVIEW</div>
                    <p class="overview-text">
                      ${product.desc || product.description || `The ${product.title} is an advanced diagnostic analyzer designed for high performance, accuracy, and reliability in medical laboratories, hospitals, and clinical settings.`}
                    </p>
                  </div>

                  <div class="bottom-grid">
                    <div class="info-card">
                      <div class="info-card-header">KEY APPLICATIONS</div>
                      <div class="info-card-body">
                        <ul class="info-list">
                          <li><span class="dot"></span> Clinical Diagnostic Laboratories</li>
                          <li><span class="dot"></span> Hospitals & Healthcare Centres</li>
                          <li><span class="dot"></span> Pathology & Testing Labs</li>
                          <li><span class="dot"></span> Blood Banks & Research Units</li>
                          <li><span class="dot"></span> Medical Colleges & Institutions</li>
                        </ul>
                      </div>
                    </div>

                    <div class="info-card">
                      <div class="info-card-header">WHY CHOOSE GLOBAL BIOMEDICAL INC.</div>
                      <div class="info-card-body">
                        <ul class="info-list">
                          <li><span class="dot"></span> Trusted Biomedical Equipment Supplier</li>
                          <li><span class="dot"></span> 100% Genuine Leading Brand Products</li>
                          <li><span class="dot"></span> Competitive Pricing & Warranty Support</li>
                          <li><span class="dot"></span> Prompt Installation & Staff Training</li>
                          <li><span class="dot"></span> Fast Express Delivery Across India</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="footer-bar">
                  <div><strong>GLOBAL BIOMEDICAL INC.</strong> - Diagnostic Instruments & Healthcare Solutions</div>
                  <div>Official Product Brochure | Confidential & Proprietary</div>
                </div>
              </div>

              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 300);
                };
              </script>
            </body>
            </html>
        `);

        printWindow.document.close();
        toast.success("Opening PDF Brochure for download...");
    };

    useEffect(() => {
        const close = (e) => {
            if (
                shareRef.current &&
                !shareRef.current.contains(e.target)
            ) {
                setShowShare(false);
            }
        };

        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    if (loading) {
        return (
            <>
                <div
                    className="product-loader"
                    style={{
                        minHeight: "calc(100vh + 200px)"
                    }}
                >
                    <div className="loader-left">
                        <div className="skeleton skeleton-title"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text short"></div>
                        <div className="skeleton skeleton-card"></div>
                        <div className="skeleton skeleton-input"></div>
                        <div className="skeleton skeleton-input"></div>
                        <div className="skeleton skeleton-btn"></div>
                    </div>
                    <div className="loader-right">
                        <div className="skeleton skeleton-image"></div>
                    </div>
                </div>
                <style jsx>{`
                    .product-loader {
                        min-height: 100vh;
                        padding-top: 120px;
                        box-sizing: border-box;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 50px;
                        align-items: center;
                        padding-left: 5%;
                        padding-right: 5%;
                    }
                    .skeleton {
                        border-radius: 12px;
                        background: linear-gradient(
                            90deg,
                            #f0f0f0 25%,
                            #e0e0e0 37%,
                            #f0f0f0 63%
                        );
                        background-size: 400% 100%;
                        animation: amazonLoader 1.4s ease infinite;
                    }
                    @keyframes amazonLoader {
                        0% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0 50%;
                        }
                    }
                    .skeleton-title {
                        height: 60px;
                        margin-bottom: 25px;
                    }
                    .skeleton-text {
                        height: 18px;
                        margin-bottom: 12px;
                    }
                    .skeleton-text.short {
                        width: 70%;
                    }
                    .skeleton-card {
                        height: 220px;
                        margin: 30px 0;
                    }
                    .skeleton-input {
                        height: 50px;
                        margin-bottom: 15px;
                    }
                    .skeleton-btn {
                        height: 50px;
                        width: 180px;
                    }
                    .skeleton-image {
                        width: 100%;
                        height: 500px;
                        border-radius: 25px;
                    }
                    @media(max-width:768px){
                        .product-loader {
                            grid-template-columns: 1fr;
                            padding: 20px;
                        }
                        .skeleton-image {
                            height: 320px;
                        }
                    }
                `}</style>
            </>
        );
    }

    if (!product) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                Product Not Found
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />

            <div className="container py-5 mt-5">
                <div className="mb-4 text-sm text-muted">
                    Home / Products / {product.title}
                </div>

                <div className="row align-items-start g-5">
                    {/* IMAGE */}
                    <div className="col-lg-6 text-center">
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: "24px",
                                padding: "40px",
                                boxShadow: "0 20px 50px rgba(0,0,0,.08)",
                                border: "1px solid #eee",
                                minHeight: "650px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                            }}
                        >
                            {selectedMedia === "video" && product.video ? (
                                <video
                                    controls
                                    autoPlay
                                    className="img-fluid"
                                    style={{
                                        maxHeight: "550px",
                                        width: "100%",
                                        objectFit: "contain",
                                        transition: "0.4s ease",
                                    }}
                                >
                                    <source
                                        src={product.video}
                                        type="video/mp4"
                                    />
                                </video>
                            ) : (
                                <>
                                    {!imageLoaded && (
                                        <div
                                            className="absolute inset-0 bg-slate-100 animate-pulse"
                                            style={{ borderRadius: "24px" }}
                                        />
                                    )}
                                    <img
                                        src={selectedImage || product.image || "/placeholder.jpg"}
                                        alt={product.title}
                                        onLoad={() => setImageLoaded(true)}
                                        decoding="async"
                                        className="img-fluid"
                                        style={{
                                            maxHeight: "550px",
                                            width: "100%",
                                            objectFit: "contain",
                                            transition: "0.4s ease",
                                            opacity: imageLoaded ? 1 : 0,
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.src = "/placeholder.jpg";
                                        }}
                                    />
                                </>
                            )}
                        </div>

                        <div className="d-flex gap-2 flex-wrap mt-3">
                            {(product.images?.length
                                ? product.images
                                : [product.image || "/placeholder.jpg"]
                            ).map((img, index) => (
                                <img
                                    key={index}
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
                                        borderRadius: 8,
                                        border: (selectedMedia === "image" && selectedImage === img)
                                            ? "2px solid #0d6efd"
                                            : "1px solid #ddd"
                                    }}
                                    alt=""
                                />
                            ))}

                            {product.video && (
                                <div
                                    className={`media-thumb ${selectedMedia === "video" ? "active-thumb" : ""}`}
                                    onClick={() => setSelectedMedia("video")}
                                >
                                    <FaPlay size={28} />
                                    <span>Video</span>
                                </div>
                            )}

                            {product.pdf && (
                                <a
                                    href={product.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="media-thumb"
                                >
                                    <span className="pdf-icon">📄</span>
                                    <span>PDF</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="col-lg-6">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1 className="fw-bold m-0">
                                {product.title}
                            </h1>

                            <div
                                ref={shareRef}
                                className="position-relative"
                            >
                                <button
                                    className="btn btn-light border rounded-circle"
                                    onClick={handleNativeShare}
                                >
                                    <FaShareAlt />
                                </button>

                                {showShare && (
                                    <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border p-2 z-50 text-start" style={{ right: 0 }}>
                                        <button
                                            onClick={handleCopy}
                                            className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded flex items-center gap-2 border-0 bg-transparent"
                                        >
                                            <FaLink />
                                            Copy Link
                                        </button>

                                        <button
                                            onClick={handleWhatsapp}
                                            className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded flex items-center gap-2 border-0 bg-transparent"
                                        >
                                            <FaWhatsapp className="text-green-600" />
                                            WhatsApp
                                        </button>

                                        <button
                                            onClick={handleFacebook}
                                            className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded flex items-center gap-2 border-0 bg-transparent"
                                        >
                                            <FaFacebook className="text-blue-600" />
                                            Facebook
                                        </button>

                                        <button
                                            onClick={handleInstagram}
                                            className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded flex items-center gap-2 border-0 bg-transparent"
                                        >
                                            <FaInstagram className="text-pink-600" />
                                            Instagram
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-muted mb-4">
                            {product.desc || product.description || "Premium biomedical equipment designed for laboratories, hospitals and diagnostic centres."}
                        </p>

                        <div className="card border-0 shadow-sm p-4">
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <strong>Brand</strong>
                                    <br />
                                    {product.brand || "-"}
                                </div>

                                <div className="col-6 mb-3">
                                    <strong>Model</strong>
                                    <br />
                                    {product.model || "-"}
                                </div>

                                <div className="col-6 mb-3">
                                    <strong>Instrument</strong>
                                    <br />
                                    {product.instrument || "-"}
                                </div>

                                <div className="col-6 mb-3">
                                    <strong>Capacity</strong>
                                    <br />
                                    {product.capacity || "-"}
                                </div>

                                <div className="col-6 mb-3">
                                    <strong>Throughput</strong>
                                    <br />
                                    {product.throughput || "-"}
                                </div>

                                <div className="col-6 mb-3">
                                    <strong>Usage</strong>
                                    <br />
                                    {product.usage || "-"}
                                </div>

                                <div className="col-6 mb-3">
                                    <strong>Automation</strong>
                                    <br />
                                    {product.automation || "-"}
                                </div>
                            </div>
                        </div>

                        {/* PRODUCT BROCHURE SECTION */}
                        <div className="card border-0 shadow-sm p-4 mt-4 rounded-4 d-flex flex-row align-items-center justify-content-between flex-wrap gap-3" style={{ background: "linear-gradient(135deg, #fff5f2, #fef0eb)" }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-3">
                                    <i className="bi bi-file-earmark-pdf-fill fs-2"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark">Product Brochure</h5>
                                    <p className="small text-muted mb-0">
                                        Download complete technical specifications & catalog
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleDownloadBrochure}
                                className="btn btn-danger rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm fs-6"
                            >
                                <i className="bi bi-download"></i> Download Brochure
                            </button>
                        </div>

                        {/* QUERY FORM */}
                        <div id="query-form" className="card shadow-sm border-0 p-4 mt-4">
                            <h4 className="mb-3">
                                Get Details & Quote
                            </h4>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Your Name"
                                    value={form.name}
                                    required
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                />

                                <input
                                    type="email"
                                    className="form-control mb-3"
                                    placeholder="Email Address"
                                    value={form.email}
                                    required
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                />

                                <input
                                    type="tel"
                                    className="form-control mb-3"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    maxLength={10}
                                    required
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value.replace(/\D/g, ""),
                                        })
                                    }
                                />

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-dark w-100"
                                >
                                    {submitting ? "Submitting..." : "Submit Query"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* SEO CONTENT SECTION */}
                <div className="seo-content mt-5">
                    <h2>
                        {product.title} Supplier, Manufacturer & Exporter in {cityName}
                    </h2>

                    <p>
                        Looking for the best {product.title} in {cityName}? We are a trusted
                        supplier, manufacturer, exporter and distributor of high-quality
                        {product.title} for hospitals, pathology laboratories, diagnostic
                        centers, research institutes and healthcare facilities. Our
                        advanced laboratory equipment is designed to deliver reliable
                        performance, accurate testing and long-term durability.
                    </p>

                    <h3>
                        Why Choose Global Biomedical in {cityName}?
                    </h3>

                    <p>
                        Global Biomedical is a trusted supplier and distributor of {product.title} in {cityName}.
                        We provide high-quality biomedical and laboratory equipment for hospitals,
                        pathology laboratories, diagnostic centres and healthcare facilities. Our products are
                        widely used across {cityName}.
                    </p>

                    <h3>
                        Features of {product.title}
                    </h3>

                    <p>
                        {product.title} offers reliable performance, accurate results, easy operation, long service
                        life and efficient workflow for laboratories and hospitals.
                    </p>

                    <h3>
                        Applications of {product.title}
                    </h3>

                    <p>
                        Widely used in hospitals, pathology labs, diagnostic centres, blood banks, research
                        institutes and healthcare facilities.
                    </p>

                    <h3>
                        Specifications Table
                    </h3>

                    <table className="seo-table">
                        <tbody>
                            <tr>
                                <td>Brand</td>
                                <td>{product.brand || "N/A"}</td>
                            </tr>
                            <tr>
                                <td>Model</td>
                                <td>{product.model || "N/A"}</td>
                            </tr>
                            <tr>
                                <td>Usage</td>
                                <td>{product.usage || "N/A"}</td>
                            </tr>
                            <tr>
                                <td>Automation</td>
                                <td>{product.automation || "N/A"}</td>
                            </tr>
                            <tr>
                                <td>Capacity</td>
                                <td>{product.capacity || "N/A"}</td>
                            </tr>
                            {product.throughput && (
                                <tr>
                                    <td>Throughput</td>
                                    <td>{product.throughput}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <h3 className="mt-5">
                        Frequently Asked Questions
                    </h3>

                    <div className="seo-faq">
                        <div className="seo-faq-item">
                            <h4>
                                What is {product.title} used for in {cityName}?
                            </h4>
                            <p>
                                {product.title} is commonly used in hospitals, pathology laboratories and diagnostic centres.
                            </p>
                        </div>
                        <div className="seo-faq-item">
                            <h4>
                                What is the price of {product.title} in {cityName}?
                            </h4>
                            <p>
                                Pricing depends on specifications, brand and model. Contact us for a quote.
                            </p>
                        </div>
                        <div className="seo-faq-item">
                            <h4>
                                Are you an authorized supplier of {product.title}?
                            </h4>
                            <p>
                                We supply genuine biomedical and laboratory equipment from trusted brands.
                            </p>
                        </div>
                        <div className="seo-faq-item">
                            <h4>
                                Can hospitals in {cityName} order this product?
                            </h4>
                            <p>
                                Yes, hospitals, pathology laboratories, diagnostic centres and healthcare facilities can order this product.
                            </p>
                        </div>
                        <div className="seo-faq-item">
                            <h4>
                                Do you provide installation support?
                            </h4>
                            <p>
                                Yes, installation and technical support are available depending on the product.
                            </p>
                        </div>
                        <div className="seo-faq-item">
                            <h4>
                                Can I request a quotation?
                            </h4>
                            <p>
                                Yes, you can submit the enquiry form on this page to receive pricing and product information.
                            </p>
                        </div>
                        <div className="seo-faq-item">
                            <h4>
                                Do you provide warranty?
                            </h4>
                            <p>
                                Warranty depends on the manufacturer and product model.
                            </p>
                        </div>
                        <div className="seo-faq-item">
                            <h4>
                                Do you deliver across India?
                            </h4>
                            <p>
                                Yes, we supply products across India with safe packaging and logistics support.
                            </p>
                        </div>
                        <div className="seo-faq-item">
                            <h4>
                                How can I contact Global Biomedical?
                            </h4>
                            <p>
                                You can fill out the enquiry form or contact our team directly for product details and quotations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}