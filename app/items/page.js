"use client";
import { usePathname,useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./products.css";
import Modal from "react-modal";
import toast, { Toaster } from "react-hot-toast";

import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

export default function ItemsPage({ city }) {
const pathname = usePathname();
const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [products, setProducts] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  const [quoteModal, setQuoteModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
const pathParts = pathname
  .split("/")
  .filter(Boolean);
  const [currentCity, setCurrentCity] =
  useState("jaipur");
  // current city
const [isValidCity, setIsValidCity] =
  useState(false);
  //   const [mounted, setMounted] =
  // useState(false);
const [loadingProducts, setLoadingProducts] =
  useState(true);
  const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  // format city
const formatCity = (name = "") =>
  name
    .split("-")
    .map(
      (w) =>
        w.charAt(0).toUpperCase() +
        w.slice(1)
    )
    .join(" ");

const citySlug = currentCity
  ?.toLowerCase()
  ?.replace(/\s+/g, "-");

const cityName = formatCity(currentCity);


// SEO KEYWORDS GENERATOR
const generateKeywords = (
  productName = "",
  city = ""
) => {

  const base =
    productName.toLowerCase();

  const keywords = [

    base,
    `${base} price`,
    `${base} best price`,
    `${base} supplier`,
    `${base} manufacturer`,
    `${base} distributor`,
    `${base} exporter`,
    `${base} dealer`,
    `${base} online`,
    `${base} buy online`,
    `${base} near me`,
    `${base} in india`,
    `${base} in ${city}`,
    `${base} machine`,
    `${base} medical equipment`,
    `${base} diagnostic equipment`,
    `${base} biomedical equipment`,
    `${base} pathology equipment`,
    `${base} laboratory equipment`,
    `${base} hospital equipment`,
    `${base} for hospital`,
    `${base} for clinic`,
    `${base} healthcare equipment`,
    `${base} specifications`,
    `${base} quotation`,
    `${base} details`,
    `${base} testing machine`,
    `${base} latest model`,
    `${base} trusted supplier`,
    `best ${base}`,
    `cheap ${base}`,
    `top ${base}`,
    `${base} available in ${city}`,
    `${base} service`,
    `${base} installation`
  ];

  return keywords.slice(0, 35);
};




  useEffect(() => {
  const checkDistrict =
    async () => {

      const slug =
        pathParts[0];

      // no slug
      if (!slug) {

        setCurrentCity("jaipur");
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

        // valid city
        if (snap.exists()) {

          setCurrentCity(slug);
          setIsValidCity(true);

        } else {

          // invalid city
          setCurrentCity("jaipur");
          setIsValidCity(false);

        }

      } catch {

        setCurrentCity("jaipur");
        setIsValidCity(false);

      }

    };

  checkDistrict();

}, [pathname]);
  // FILTER
  const filtered = products.filter((p) =>
    p.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // TOTAL PAGES
  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(
          filtered.length / itemsPerPage
        );

  // PAGINATION
  const paginatedProducts =
    itemsPerPage === "all"
      ? filtered
      : filtered.slice(
          (currentPage - 1) *
            itemsPerPage,
          currentPage * itemsPerPage
        );

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

//   useEffect(() => {
//   setMounted(true);
// }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // FETCH PRODUCTS
  useEffect(() => {

    const fetchProducts = async () => {

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

        if (snap.exists()) {
          const data =
            snap.data().products || [];
          const visibleProducts =
            data.filter(
              (p) =>
                p.isPublished !== false
            );
          setProducts(visibleProducts);
        }
      } catch (err) {
        console.error(err);
      }
     setLoading(false);
    setLoadingProducts(false);
    };

    fetchProducts();

  }, []);

//   useEffect(() => {

//   const parts =
//     pathname.split("/").filter(Boolean);

//   const slug =
//     parts.length >= 3
//       ? parts[parts.length - 1]
//       : null;

//   if (!slug) {
//     setSelectedProduct(null);
//     return;
//   }

//   const foundProduct =
//     products.find(
//       (p) =>
//         makeSlug(p.title) === slug
//     );

//   if (foundProduct) {

//     setSelectedProduct(
//       foundProduct
//     );
//   }

// }, [pathname, products]);


  // PRODUCT SEO
useEffect(() => {

  if (!selectedProduct?.title)
    return;

  const productName =selectedProduct.title;

  const keywords =
    generateKeywords(
      productName,
      cityName
    );

  console.log(
    "SEO KEYWORDS 👉",
    keywords
  );

  // PAGE TITLE
  document.title =
    `${productName} in ${cityName} | Best Price | Global Biomedical`;

  // META DESCRIPTION
  let metaDescription =
    document.querySelector(
      'meta[name="description"]'
    );

  if (!metaDescription) {

    metaDescription =
      document.createElement(
        "meta"
      );

    metaDescription.name =
      "description";

    document.head.appendChild(
      metaDescription
    );
  }

  metaDescription.content =
    `Buy ${productName} in ${cityName} at best price. Trusted supplier of diagnostic and biomedical equipment. Contact us today for quote and details.`;

  // META KEYWORDS
  let metaKeywords =
    document.querySelector(
      'meta[name="keywords"]'
    );

  if (!metaKeywords) {

    metaKeywords =
      document.createElement(
        "meta"
      );

    metaKeywords.name =
      "keywords";

    document.head.appendChild(
      metaKeywords
    );
  }

  metaKeywords.content =
    keywords.join(", ");

  // OPEN GRAPH TITLE
  let ogTitle =
    document.querySelector(
      'meta[property="og:title"]'
    );

  if (!ogTitle) {

    ogTitle =
      document.createElement(
        "meta"
      );

    ogTitle.setAttribute(
      "property",
      "og:title"
    );

    document.head.appendChild(
      ogTitle
    );
  }

  ogTitle.content =
    `${productName} in ${cityName}`;

  // OG DESCRIPTION
  let ogDescription =
    document.querySelector(
      'meta[property="og:description"]'
    );

  if (!ogDescription) {

    ogDescription =
      document.createElement(
        "meta"
      );

    ogDescription.setAttribute(
      "property",
      "og:description"
    );

    document.head.appendChild(
      ogDescription
    );
  }

  ogDescription.content =
    `Buy ${productName} in ${cityName} with best pricing and trusted quality.`;

  // OG IMAGE
  let ogImage =
    document.querySelector(
      'meta[property="og:image"]'
    );

  if (!ogImage) {

    ogImage =
      document.createElement(
        "meta"
      );

    ogImage.setAttribute(
      "property",
      "og:image"
    );

    document.head.appendChild(
      ogImage
    );
  }

  ogImage.content =
    selectedProduct.image ||
    "/no-image.png";

  // CANONICAL URL
  let canonical =
    document.querySelector(
      'link[rel="canonical"]'
    );

  if (!canonical) {

    canonical =
      document.createElement(
        "link"
      );

    canonical.rel =
      "canonical";

    document.head.appendChild(
      canonical
    );
  }

  canonical.href =
    window.location.href;

  // SCHEMA JSON
  const schema = {

    "@context":
      "https://schema.org",

    "@type":
      "Product",

    name:
      productName,

    image:
      selectedProduct.image,

    description:
      selectedProduct.desc,

    brand: {
      "@type":
        "Brand",

      name:
        "Global Biomedical"
    },

    offers: {
      "@type":
        "Offer",

      availability:
        "https://schema.org/InStock"
    }
  };

  let script =
    document.getElementById(
      "schema-json"
    );

  if (script)
    script.remove();

  script =
    document.createElement(
      "script"
    );

  script.id =
    "schema-json";

  script.type =
    "application/ld+json";

  script.innerHTML =
    JSON.stringify(schema);

  document.head.appendChild(
    script
  );

}, [selectedProduct]);

  // FORM
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

  };

  // SUBMIT
  const handleSubmit = async () => {

    if (
      !form.email ||
      !form.phone
    ) {
      return toast.error(
        "Please fill all details"
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
          name: form.name,
          email: form.email,
          phone: form.phone,

          city: cityName,

          productName:
            selectedProduct?.title || "",

          message:
            `Enquiry for product: ${
              selectedProduct?.title || ""
            }`,

          createdAt:
            serverTimestamp()
        }
      );

      toast.success(
        "Quote Request Sent"
      );

      setForm({
        name: "",
        email: "",
        phone: ""
      });

      setQuoteModal(false);

    } catch (err) {

      console.error(err);

      toast.error(
        "Error sending request"
      );

    }

  };
// if (!mounted || loadingProducts) {
if (loadingProducts){
  return (
    <div className="page-loader">
      <div className="loader-circle"></div>

      {/* <h2>Global Biomedical</h2>#c88379 */}
      <h2>Global Biomedical</h2>

      <p>Loading amazing healthcare solutions...</p>
    </div>
  );
}
  return (
    <div className="products-page">

      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 9999999,
        }}
      />

      {/* HERO */}
      <section className="contactt-hero text-center">

        <div className="container">

          <h1 className="fw-bold display-4">

            Our Products

            {" "}

   {isValidCity
  ? ` in ${cityName}`
  : ""}

          </h1>

          <p className="text-muted">

            Explore our wide range
            of diagnostic products

            {" "}

{isValidCity
  ? ` in ${cityName}`
  : ""}

          </p>

          <div className="search-box mt-4">

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </section>

      {/* PRODUCTS */}
      <div className="container-fluid px-5 pb-5">

        <div className="row g-4">

          {loading ? (

            <div className="text-center w-100 py-5">
              <h5>
                Loading Product list...
              </h5>
            </div>

          ) : paginatedProducts.length ===
            0 ? (

            <div className="text-center w-100 py-5">
              <h5>
                No Products Found
              </h5>
            </div>

          ) : (

            paginatedProducts.map(
              (item, i) => (

                <div
                  className="col-md-3"
                  key={item.id || i}
                >

                  <div className="product-card">

                    <img
                      src={
                        item.image ||
                        "/no-image.png"
                      }
                      className="product-img-top"
                    />

                    <div className="p-3">

                      <h5>
                        {item.title}
                      </h5>

                      <p className="text-muted small">
                        {item.desc}
                      </p>

                      <button
                        className="btn btn-dark product-btn"
                   onClick={(e) => {
                    e.stopPropagation();
                    setSelected(item);
                    setSelectedProduct(item);
                    setShowForm(false);
                    const productPath =
                    isValidCity
                      ? `/${citySlug}/items`
                      : "/items";
                    window.history.replaceState(
                      {},
                      "",
                      productPath
                    );
                  }}
                      >

                        View

                      </button>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

      {/* PAGINATION */}
      <div className="pagination-card">

        <div className="pagination-wrapper">

          {/* ITEMS */}
          <div className="page-size">

            <span>
              Item Per Page :
            </span>

            <select
              value={itemsPerPage}
              onChange={(e) => {

                const value =
                  e.target.value ===
                  "all"
                    ? "all"
                    : Number(
                        e.target.value
                      );

                setItemsPerPage(value);

                setCurrentPage(1);

              }}
            >

              <option value={10}>
                10
              </option>

              <option value={25}>
                25
              </option>

              <option value={50}>
                50
              </option>

              <option value={100}>
                100
              </option>

              <option value="all">
                All
              </option>

            </select>

          </div>

          {/* PAGINATION */}
          <div className="simple-pagination">

            <button
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (p) => p - 1
                )
              }
            >
              ◀
            </button>

            <span>
              {currentPage} /{" "}
              {totalPages}
            </span>

            <button
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (p) => p + 1
                )
              }
            >
              ▶
            </button>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {selectedProduct && (

        <div className="custom-modal">

          <div className="modal-box">

            {/* <span
              className="close"
              onClick={() => {
                setSelectedProduct(
                  null
                );
                setShowForm(false);
              }}
            >
              ×
            </span> */}

            <span
  className="close"
  onClick={() => {

    setSelectedProduct(
      null
    );

    setShowForm(false);

    const basePath =
      isValidCity
        ? `/${citySlug}/items`
        : "/items";

    window.history.replaceState(
      {},
      "",
      basePath
    );
  }}
>
  ×
</span>

            <div className="row align-items-center">

              {/* IMAGE */}
              <div className="col-md-6 text-center">

                <div className="img-wrapper">

                  <img
                    src={
                      selectedProduct.image ||
                      "/no-image.png"
                    }
                    onError={(e) =>
                      (e.target.src =
                        "/no-image.png")
                    }
                  />

                </div>

              </div>

              {/* DETAILS */}
              <div className="col-md-6">

                <h3 className="fw-bold">
                  {selectedProduct.title}
                </h3>

                <p className="text-muted">
                  {selectedProduct.desc}
                </p>

                {/* SPECS */}
                <div className="spec-box">

                  <h6>
                    Specifications
                  </h6>

                  <div className="spec-grid">

                    {Object.entries(
                      selectedProduct
                    )
                      .filter(
                        ([key, val]) =>
                          ![
                            "id",
                            "title",
                            "desc",
                            "image",
                            "createdAt",
                            "isPublished"
                          ].includes(
                            key
                          ) && val
                      )
                      .map(([k, v]) => (

                        <div
                          key={k}
                          className="spec-item"
                        >

                          <span>
                            {k}
                          </span>

                          <strong>
                            {v}
                          </strong>

                        </div>

                      ))}

                  </div>

                </div>

                {/* BUTTONS */}
                <div className="mt-4">

                  {!showForm ? (

                    <div className="d-flex gap-2">

                      <button
                        className="btn btn-success w-100"
                        onClick={() =>
                          setQuoteModal(
                            true
                          )
                        }
                      >
                        Get Quote
                      </button>

                      <Link
                        href={`/${citySlug}/contact`}
                      >

                        <button className="btn btn-outline-dark w-100">

                          Enquiry

                        </button>

                      </Link>

                    </div>

                  ) : null}

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* QUOTE MODAL */}
      <Modal
        isOpen={quoteModal}
        onRequestClose={() =>
          setQuoteModal(false)
        }
        className="quote-modal-box"
        overlayClassName="quote-modal-overlay"
      >

        <h5 className="mb-3">
          Get Quote
        </h5>

        <div className="d-flex flex-column gap-2">

          <input
            name="name"
            placeholder="Your Name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Your Email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Your Phone"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
          />

          <button
            className="btn btn-success mt-2"
            onClick={handleSubmit}
          >
            Submit Request
          </button>
        </div>
      </Modal>
    </div>
  );
}