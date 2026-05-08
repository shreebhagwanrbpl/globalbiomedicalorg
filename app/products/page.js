"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./products.css"
import Modal from "react-modal";
import toast, { Toaster } from "react-hot-toast";
 import { addDoc, collection, serverTimestamp } from "firebase/firestore";
export default function Products() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [quoteModal, setQuoteModal] = useState(false);
const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
// FILTER
const filtered = products.filter((p) =>
  p.title?.toLowerCase().includes(search.toLowerCase())
);

// TOTAL PAGES
const totalPages =
  itemsPerPage === "all"
    ? 1
    : Math.ceil(filtered.length / itemsPerPage);

// PAGINATED DATA
const paginatedProducts =
  itemsPerPage === "all"
    ? filtered
    : filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      useEffect(() => {
  Modal.setAppElement("body");
}, []);
useEffect(() => {
  setCurrentPage(1);
}, [search]);
  // 🔥 FETCH FROM FIRESTORE (ADMIN DATA)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "globalbiomedicalorg", "pages", "products")
        );

        if (snap.exists()) {
          const data = snap.data().products || [];

          // only published
          const visibleProducts = data.filter(p => p.isPublished !== false);

          setProducts(visibleProducts);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
if (!form.email || !form.phone) {
  return toast.error("Please fill all details");
}

  try {
    await addDoc(
      collection(db, "websitesQueries", "globalbiomedicalorg", "productQueries"),
      {
        name: form.name,
        email: form.email,
        phone: form.phone,

        // 🔥 PRODUCT NAME AUTO
        productName: selectedProduct?.title || "",

        // 🔥 AUTO MESSAGE
        message: `Enquiry for product: ${selectedProduct?.title || ""}`,

        createdAt: serverTimestamp()
      }
    );

   toast.success("Quote Request Sent ");

    // 🔥 RESET FORM
    setForm({
      name: "",
      email: "",
      phone: ""
    });

    setQuoteModal(false);

  } catch (err) {
    console.error(err);
   toast.error("Error sending request");
  }
};

  return (
    <div className="products-page">
<Toaster
  position="top-right"
  containerStyle={{
    zIndex: 9999999,  // 🔥 VERY HIGH
  }}
/>
      <section className="contactt-hero text-center">
        <div className="container">
          <h1 className="fw-bold display-4">Our Products</h1>
          <p className="text-muted">Explore our wide range of diagnostic products</p>

          <div className="search-box mt-4">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 🔥 PRODUCTS GRID */}
<div className="container-fluid px-5 pb-5">
  <div className="row g-4">

    {loading ? (
      <div className="text-center w-100 py-5">
        <h5>Loading Product list...</h5>
      </div>
    ) : paginatedProducts.length === 0 ? (
      <div className="text-center w-100 py-5">
        <h5>No Products Found</h5>
      </div>
    ) : (
      paginatedProducts.map((item, i) => (
        <div className="col-md-3" key={item.id || i}>
          <div className="product-card">

            <img
              src={item.image || "/no-image.png"}
              className="product-img-top"
            />

            <div className="p-3">
              <h5>{item.title}</h5>

              <p className="text-muted small">
                {item.desc}
              </p>

              <button
                className="btn btn-success w-100"
                onClick={() => setSelectedProduct(item)}
              >
                View Details
              </button>
            </div>

          </div>
        </div>
      ))
    )}

  </div>
</div>
<div className="pagination-card">

  <div className="pagination-wrapper">

    {/* LEFT - ITEMS */}
    <div className="page-size">
      <span>Item Per Page :</span>

      <select
        value={itemsPerPage}
        onChange={(e) => {
          const value = e.target.value === "all" ? "all" : Number(e.target.value);
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value="all">All</option>
      </select>
    </div>

    {/* RIGHT - PAGINATION */}
    <div className="simple-pagination">

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
      >
        ◀
      </button>

      <span>
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
      >
        ▶
      </button>

    </div>

  </div>

</div>

      {/* 🔥 MODAL */}
      {selectedProduct && (
        <div className="custom-modal">
          <div className="modal-box">

            <span
              className="close"
              onClick={() => {
                setSelectedProduct(null);
                setShowForm(false);
              }}
            >
              ×
            </span>

            <div className="row align-items-center">

              {/* IMAGE */}
              <div className="col-md-6 text-center">
                <div className="img-wrapper">
               <img
  src={selectedProduct.image || "/no-image.png"}
  onError={(e) => (e.target.src = "/no-image.png")}
/>
                </div>
              </div>

              {/* DETAILS */}
              <div className="col-md-6">

                <h3 className="fw-bold">{selectedProduct.title}</h3>
                <p className="text-muted">{selectedProduct.desc}</p>

                {/* 🔥 SPECIFICATIONS (dynamic from admin fields) */}
                <div className="spec-box">
                  <h6>Specifications</h6>

                  <div className="spec-grid">
                    {Object.entries(selectedProduct)
                      .filter(([key, val]) =>
                        !["id", "title", "desc", "image", "createdAt", "isPublished"].includes(key) && val
                      )
                      .map(([k, v]) => (
                        <div key={k} className="spec-item">
                          <span>{k}</span>
                          <strong>{v}</strong>
                        </div>
                      ))}
                  </div>
                </div>

                {/* FORM */}
                <div className="mt-4">

                  {!showForm ? (
                    <div className="d-flex gap-2">
<button
  className="btn btn-success w-100"
  onClick={() => setQuoteModal(true)}
>
  Get Quote
</button>

                      <Link href="/contact">
                        <button className="btn btn-outline-dark w-100">
                          Enquiry
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="quote-box mt-3">

                      <div
                        className="back-btn"
                        onClick={() => setShowForm(false)}
                      >
                        ← Back
                      </div>

                      <div className="d-flex flex-column gap-2">

                        <input
                          name="name"
                          placeholder="Name"
                          className="form-control"
                          value={form.name}
                          onChange={handleChange}
                        />

                        <input
                          name="email"
                          placeholder="Email"
                          className="form-control"
                          value={form.email}
                          onChange={handleChange}
                        />

                        <input
                          name="phone"
                          placeholder="Phone"
                          className="form-control"
                          value={form.phone}
                          onChange={handleChange}
                        />

                        <button
                          className="btn btn-success"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>

                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* 🔥 QUOTE MODAL */}
<Modal
  isOpen={quoteModal}
  onRequestClose={() => setQuoteModal(false)}
  className="quote-modal-box"
  overlayClassName="quote-modal-overlay"
>
  <h5 className="mb-3">Get Quote</h5>

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