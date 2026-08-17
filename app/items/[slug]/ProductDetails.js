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
                const targetSlug = (slug || "").toLowerCase().trim();
                const found = allProducts.find((p) => {
                    if (!p) return false;
                    const prodSlug = (p.slug || "").toLowerCase().trim();
                    const prodId = (p.id || "").toLowerCase().trim();
                    const prodTitleSlug = (p.title || "")
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-");
                    return (
                        prodSlug === targetSlug ||
                        prodId === targetSlug ||
                        prodTitleSlug === targetSlug ||
                        decodeURIComponent(targetSlug) === prodSlug
                    );
                });

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

    const handleDownloadBrochure = async () => {
        if (!product) return;

        // If product already has a custom PDF link, download directly
        const existingPdfUrl = product.pdf || product.brochure || product.brochureUrl || product.catalogUrl;
        if (existingPdfUrl) {
            const link = document.createElement("a");
            link.href = existingPdfUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.download = `${product.slug || "product"}-brochure.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Downloading product brochure...");
            return;
        }

        const toastId = toast.loading("Generating & Downloading PDF Brochure...");

        try {
            const { jsPDF } = await import("jspdf");
            const html2canvas = (await import("html2canvas")).default;

            const rawImg = selectedImage || (product.images && product.images[0]) || product.image || "/placeholder.jpg";

            // Helper to get image as Base64 data URL via /api/image-proxy server endpoint
            const getBase64Image = async (url) => {
                if (!url) return "";
                try {
                    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
                    const res = await fetch(proxyUrl);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.base64) {
                            return data.base64;
                        }
                    }
                } catch (e) {
                    console.warn("[ProductDetails] Image proxy failed, using original URL:", e);
                }
                return url;
            };

            const prodImg = await getBase64Image(rawImg);

            const tempDiv = document.createElement("div");
            tempDiv.style.position = "absolute";
            tempDiv.style.left = "-9999px";
            tempDiv.style.top = "-9999px";
            tempDiv.style.width = "794px";
            tempDiv.style.background = "#ffffff";
            tempDiv.style.fontFamily = "'Segoe UI', Arial, sans-serif";

            tempDiv.innerHTML = `
                <div style="width: 794px; min-height: 1123px; padding: 0; margin: 0; background: #ffffff; position: relative; border: 1px solid #dce4ec; box-sizing: border-box;">
                    <!-- HEADER BAR -->
                    <div style="background: #2a1128; color: #ffffff; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 21px; font-weight: 800; letter-spacing: 0.5px;">Global Biomedical Inc.</div>
                        <div style="text-align: right; font-size: 11.5px; line-height: 1.4; opacity: 0.95;">
                            Mobile: +91 9257984336 | +91 8529833535<br/>
                            Web: www.globalbiomedical.org
                        </div>
                    </div>

                    <!-- TITLE & BANNER -->
                    <div style="padding: 20px 30px 10px 30px;">
                        <h2 style="font-size: 20px; font-weight: 800; color: #2a1128; margin: 0 0 12px 0; line-height: 1.3;">
                            ${product.title}${product.model ? `, Model Name/Number: ${product.model}` : ''}
                        </h2>
                        <div style="background: #A56B97; color: #ffffff; padding: 10px 16px; font-size: 12.5px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; border-radius: 4px; text-align: center;">
                            MEDICAL DIAGNOSTIC EQUIPMENT SUPPLIERS
                        </div>
                    </div>

                    <!-- CONTENT BODY -->
                    <div style="padding: 15px 30px 60px 30px;">
                        <!-- TOP GRID -->
                        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                            <div style="width: 250px; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 15px; height: 260px; display: flex; align-items: center; justify-content: center; background: #ffffff; box-sizing: border-box;">
                                <img id="pdf-prod-img" src="${prodImg}" style="max-width: 100%; max-height: 230px; object-fit: contain;" />
                            </div>

                            <div style="flex: 1;">
                                <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden;">
                                    <thead>
                                        <tr>
                                            <th colspan="2" style="background: #2a1128; color: white; text-align: left; padding: 10px 14px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">KEY SPECIFICATIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="background: #ffffff;">
                                            <td style="font-weight: 700; color: #2a1128; width: 40%; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">Brand:</td>
                                            <td style="color: #1e293b; font-weight: 500; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">${product.brand || "Global Biomedical Partner"}</td>
                                        </tr>
                                        <tr style="background: #F8FAFC;">
                                            <td style="font-weight: 700; color: #2a1128; width: 40%; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">Model:</td>
                                            <td style="color: #1e293b; font-weight: 500; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">${product.model || "Standard Series"}</td>
                                        </tr>
                                        <tr style="background: #ffffff;">
                                            <td style="font-weight: 700; color: #2a1128; width: 40%; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">Instrument:</td>
                                            <td style="color: #1e293b; font-weight: 500; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">${product.instrument || "Diagnostic Equipment"}</td>
                                        </tr>
                                        <tr style="background: #F8FAFC;">
                                            <td style="font-weight: 700; color: #2a1128; width: 40%; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">Usage:</td>
                                            <td style="color: #1e293b; font-weight: 500; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">${product.usage || "Clinical / Hospital Laboratory"}</td>
                                        </tr>
                                        <tr style="background: #ffffff;">
                                            <td style="font-weight: 700; color: #2a1128; width: 40%; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">Automation:</td>
                                            <td style="color: #1e293b; font-weight: 500; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">${product.automation || "Fully Automatic"}</td>
                                        </tr>
                                        <tr style="background: #F8FAFC;">
                                            <td style="font-weight: 700; color: #2a1128; width: 40%; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">Test Capacity:</td>
                                            <td style="color: #1e293b; font-weight: 500; padding: 8px 14px; font-size: 11.5px; border-bottom: 1px solid #E2E8F0;">${product.throughput || product.capacity || "Standard High-Throughput"}</td>
                                        </tr>
                                        <tr style="background: #ffffff;">
                                            <td style="font-weight: 700; color: #2a1128; width: 40%; padding: 8px 14px; font-size: 11.5px;">Availability:</td>
                                            <td style="color: #1e293b; font-weight: 500; padding: 8px 14px; font-size: 11.5px;">${product.availability || "In Stock (Pan-India Express Supply)"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- OVERVIEW -->
                        <div style="margin-bottom: 20px; background: #F8FAFC; border-left: 4px solid #A56B97; padding: 14px 18px; border-radius: 0 8px 8px 0;">
                            <div style="font-size: 13px; font-weight: 800; color: #2a1128; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">PRODUCT OVERVIEW</div>
                            <p style="font-size: 11.5px; line-height: 1.6; color: #334155; margin: 0;">
                                ${product.desc || product.description || `The ${product.title} is an advanced diagnostic analyzer designed for high performance, accuracy, and reliability in medical laboratories, hospitals, and clinical settings.`}
                            </p>
                        </div>

                        <!-- BOTTOM GRID -->
                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1; border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden; background: #ffffff;">
                                <div style="background: #2a1128; color: white; padding: 10px 14px; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">KEY APPLICATIONS</div>
                                <div style="padding: 12px 14px;">
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        <li style="font-size: 11px; margin-bottom: 8px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> Clinical Diagnostic Laboratories</li>
                                        <li style="font-size: 11px; margin-bottom: 8px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> Hospitals & Healthcare Centres</li>
                                        <li style="font-size: 11px; margin-bottom: 8px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> Pathology & Diagnostic Testing</li>
                                        <li style="font-size: 11px; margin-bottom: 8px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> Medical Research & Blood Banks</li>
                                        <li style="font-size: 11px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> Medical Colleges & Institutions</li>
                                    </ul>
                                </div>
                            </div>

                            <div style="flex: 1; border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden; background: #ffffff;">
                                <div style="background: #2a1128; color: white; padding: 10px 14px; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">WHY CHOOSE GLOBAL BIOMEDICAL INC.</div>
                                <div style="padding: 12px 14px;">
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        <li style="font-size: 11px; margin-bottom: 8px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> Trusted Biomedical Equipment Supplier</li>
                                        <li style="font-size: 11px; margin-bottom: 8px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> 100% Genuine Leading Brand Products</li>
                                        <li style="font-size: 11px; margin-bottom: 8px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> Competitive Pricing & Warranty Support</li>
                                        <li style="font-size: 11px; margin-bottom: 8px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> Prompt Installation & Staff Training</li>
                                        <li style="font-size: 11px; color: #1e293b;"><span style="color: #A56B97; font-weight: bold; margin-right: 6px;">✦</span> Fast Express Delivery Across India</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- FOOTER -->
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: #2a1128; color: #ffffff; padding: 12px 30px; display: flex; justify-content: space-between; font-size: 10.5px; opacity: 0.95;">
                        <div><strong>GLOBAL BIOMEDICAL INC.</strong> - Clinical & Diagnostic Healthcare Solutions</div>
                        <div>www.globalbiomedical.org</div>
                    </div>
                </div>
            `;

            document.body.appendChild(tempDiv);

            // Wait for image element inside tempDiv to be fully loaded into memory
            const pdfImageEl = tempDiv.querySelector("#pdf-prod-img");
            if (pdfImageEl) {
                await new Promise((resolve) => {
                    if (pdfImageEl.complete && pdfImageEl.naturalWidth !== 0) {
                        resolve();
                    } else {
                        pdfImageEl.onload = resolve;
                        pdfImageEl.onerror = resolve;
                        setTimeout(resolve, 1500);
                    }
                });
            }

            await new Promise((r) => setTimeout(r, 150));

            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
            });

            document.body.removeChild(tempDiv);

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${product.slug || "product"}-official-brochure.pdf`);

            toast.success("PDF Brochure downloaded successfully!", { id: toastId });
        } catch (err) {
            console.error("PDF generation error:", err);
            toast.error("Failed to generate PDF. Please try again.", { id: toastId });
        }
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
                        <div className="card border-0 shadow-sm p-4 mt-4 rounded-4 d-flex flex-row align-items-center justify-content-between flex-wrap gap-3" style={{ background: "linear-gradient(135deg, #fceef8 0%, #f4dbed 100%)", border: "1px solid #e0b4d4" }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 bg-white text-plum rounded-3 shadow-sm" style={{ color: "#A56B97" }}>
                                    <i className="bi bi-file-earmark-pdf-fill fs-2"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark">Official Product Brochure</h5>
                                    <p className="small text-muted mb-0">
                                        Download complete technical specifications & catalog
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleDownloadBrochure}
                                className="btn text-white rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 shadow fs-6 border-0"
                                style={{ background: "#A56B97" }}
                            >
                                <i className="bi bi-download"></i> Download Brochure
                            </button>
                        </div>

                        {/* QUERY FORM */}
                        <div id="query-form" className="card shadow-sm border-0 p-4 mt-4 rounded-4" style={{ background: "#ffffff", border: "1px solid #f4dbed" }}>
                            <h4 className="fw-bold mb-1 text-dark">
                                Get Quotation & Best Price
                            </h4>
                            <p className="text-muted small mb-4">
                                Inquire about latest pricing, installation, and warranty for {product.title}.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    className="form-control mb-3 py-2.5 rounded-3 border"
                                    placeholder="Your Full Name *"
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
                                    className="form-control mb-3 py-2.5 rounded-3 border"
                                    placeholder="Email Address *"
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
                                    className="form-control mb-3 py-2.5 rounded-3 border"
                                    placeholder="10-Digit Mobile Number *"
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
                                    className="btn text-white w-100 py-3 rounded-pill fw-bold border-0 shadow-sm"
                                    style={{ background: "#A56B97" }}
                                >
                                    {submitting ? "Submitting Inquiry..." : "Submit Inquiry For Quote"}
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