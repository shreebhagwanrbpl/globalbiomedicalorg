"use client";
import { usePathname, useRouter } from "next/navigation";
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

const getTextValue = (
  value
) => {
  if (!value) return "";

  if (
    typeof value ===
      "string" ||
    typeof value ===
      "number"
  ) {
    return String(value);
  }

  if (
    typeof value ===
    "object"
  ) {
    return String(
      value.text ||
      value.richText ||
      value.value ||
      value.label ||
      ""
    );
  }

  return "";
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
 const filtered =
  products.filter((p) =>
    getTextValue(p.title)
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );

  // TOTAL PAGES
// TOTAL PAGES + SAFE PAGINATION
const safeItemsPerPage =
  itemsPerPage === "all"
    ? filtered.length
    : Number(itemsPerPage) || 10;

const totalPages = Math.max(
  1,
  Math.ceil(
    filtered.length /
      safeItemsPerPage
  )
);

const safeCurrentPage =
  Math.min(
    currentPage,
    totalPages
  );

const paginatedProducts =
  itemsPerPage === "all"
    ? filtered
    : filtered.slice(
        (safeCurrentPage - 1) *
          safeItemsPerPage,
        safeCurrentPage *
          safeItemsPerPage
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
  // 

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
            `Enquiry for product: ${selectedProduct?.title || ""
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
  if (loadingProducts) {
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
            Biomedical & Diagnostic Products

            {isValidCity
              ? ` in ${cityName}`
              : ""}
          </h1>

          <p className="text-muted">
            Explore biomedical, pathology, diagnostic
            machines and laboratory equipment

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
                      alt={item.title}
                    />

                    <div className="p-3">
                      <h2 className="h5">
                        Product:  {item.title}
                      </h2>

                      <p className="text-muted small">
                        Brand: {item.brand}
                      </p>
                      <p className="text-muted small">
                        Throughput: {item.throughput}
                      </p>
                      <p className="text-muted small">
                        Instrument: {item.instrument}
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
                  : parseInt(
                      e.target.value,
                      10
                    );

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
            safeCurrentPage === 1
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
              {safeCurrentPage} / {totalPages}
            </span>

            <button
            disabled={
              safeCurrentPage ===
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
              <div className="modal-content-scroll">
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
                    alt={selectedProduct.title}
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

                <p className="text-muted desc-scroll">
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

                          <strong
                            className={
                              k.toLowerCase() === "capacity"
                                ? "capacity-scroll"
                                : ""
                            }
                          >
                            {v}
                          </strong>

                        </div>
                      ))}
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="modal-footer-fixed">
                  {!showForm ? (
                    <div className="d-flex gap-2">
                 <button
                  className="btn"
                  style={{
                    backgroundColor: "#C08081",
                    borderColor: "#C08081",
                    color: "#fff",
                    width: "389px",
                  }}
                  onClick={() =>
                    setQuoteModal(true)
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
          className="btn mt-2 w-100"
          style={{
            backgroundColor: "#C08081",
            borderColor: "#C08081",
            color: "#fff",
          }}
          onClick={handleSubmit}
        >
          Submit Request
        </button>
        </div>
      </Modal>
    </div>
  );
}