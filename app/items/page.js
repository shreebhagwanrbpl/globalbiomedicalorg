"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import "./products.css";
import Modal from "react-modal";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import ProductsBanner from "../items/AP.png";
import { useMemo } from "react";


import {
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";


export default function ItemsPage({ city }) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const [products, setProducts] =
    useState([]);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(12);

  const [quoteModal, setQuoteModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);
  const [categorySearch, setCategorySearch] = useState("");
  const [openedCategory, setOpenedCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [allCategories, setAllCategories] = useState([]);
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
  const filteredProducts =
    useMemo(() => {

      return products.filter((item) =>
        item.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

    }, [products, search]);

  const groupedProducts =
    useMemo(() => {

      const obj = {};

      filteredProducts.forEach((item) => {

        if (!obj[item.category]) {
          obj[item.category] = [];
        }

        obj[item.category].push(item);

      });

      return obj;

    }, [filteredProducts]);
  const categories = Object.keys(groupedProducts);

  const toggleCategory = (category) => {
    if (openedCategory === category) {
      setOpenedCategory("");
      setActiveCategory("");
      return;
    }

    setOpenedCategory(category);
    setActiveCategory(category);
  };

  const scrollToProduct = (slug, category) => {
    setOpenedCategory(category);
    setActiveCategory(category);

    const el = document.getElementById(slug);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };



  // TOTAL PAGES + SAFE PAGINATION
  const safeItemsPerPage =
    itemsPerPage === "all"
      ? filteredProducts.length
      : Number(itemsPerPage) || 12;
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
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
      ? filteredProducts
      : filteredProducts.slice(
        (safeCurrentPage - 1) *
        safeItemsPerPage,
        safeCurrentPage *
        safeItemsPerPage
      );

  const paginatedGroupedProducts = useMemo(() => {
    const obj = {};

    paginatedProducts.forEach((item) => {
      if (!obj[item.category]) {
        obj[item.category] = [];
      }

      obj[item.category].push(item);
    });

    return obj;
  }, [paginatedProducts]);

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

        const allProducts = [];
        const categoryList = [];

        categorySnap.forEach((categoryDoc) => {

          const data = categoryDoc.data();

          categoryList.push({
            id: categoryDoc.id,
            category: data.category || categoryDoc.id
          });

          const products =
            (data.products || [])
              .filter(
                (p) => p.isPublished !== false
              )
              .map((item, index) => ({
                ...item,
                uid: `${categoryDoc.id}-${index}`,
                category:
                  data.category || categoryDoc.id,

                slug:
                  item.slug ||
                  item.title
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")
              }));

          allProducts.push(...products);

        });

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
            (oldSnap.data().products || [])
              .filter(
                (p) => p.isPublished !== false
              )
              .map((item, index) => ({
                ...item,
                uid: `other-${index}`,
                category:
                  item.category ||
                  "Other Products"
              }));

          allProducts.push(...oldProducts);
        }

        setProducts(allProducts);

        setAllCategories(categoryList);

      } catch (err) {

        console.log(err);

      }

      setLoading(false);
      setLoadingProducts(false);

    };

    fetchProducts();

  }, []);
  useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 500) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }

    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

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
  const scrollToTop = () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
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

      <section className="contactt-hero">
        <Image
          src={ProductsBanner}
          alt="Biomedical & Diagnostic Products"
          fill
          priority
          className="hero-banner"
        />
      </section>

      <section className="product-page">

        <div className="container-fluid">

          <div className="row">

            {/* LEFT SIDEBAR */}

            <div className="col-lg-3">

              <div className="category-sidebar">

                <div className="sidebar-title">
                  Categories
                </div>

                <div className="sidebar-search">

                  <input
                    type="text"
                    placeholder="Search Category..."
                    value={categorySearch}
                    onChange={(e) =>
                      setCategorySearch(e.target.value)
                    }
                  />

                </div>

                <div className="category-list">

                  {Object.keys(groupedProducts)
                    .filter((category) =>
                      category
                        .toLowerCase()
                        .includes(
                          categorySearch.toLowerCase()
                        )
                    )
                    .map((category) => (

                      <div
                        key={category}
                        className="category-item"
                      >

                        <button
                          className={`category-btn ${activeCategory === category
                            ? "active"
                            : ""
                            }`}
                          onClick={() => {

                            if (
                              openedCategory === category
                            ) {
                              setOpenedCategory("");
                              setActiveCategory("");
                            } else {
                              setOpenedCategory(category);
                              setActiveCategory(category);
                            }

                          }}
                        >

                          <span>

                            {openedCategory === category
                              ? <FiChevronDown />
                              : <FiChevronRight />}

                            {category}

                          </span>

                          <span className="count">
                            {
                              filteredProducts.filter(
                                (p) => p.category === category
                              ).length
                            }
                          </span>

                        </button>

                        <div
                          className="category-content"
                          style={{
                            maxHeight:
                              openedCategory === category
                                ? groupedProducts[
                                  category
                                ].length *
                                45 +
                                "px"
                                : "0px",
                          }}
                        >

                          {groupedProducts[
                            category
                          ].map((item) => (

                            <button
                              key={item.uid}
                              className="product-link"
                              onClick={() => {

                                const el =
                                  document.getElementById(
                                    item.slug
                                  );

                                if (el) {

                                  el.scrollIntoView({
                                    behavior:
                                      "smooth",
                                    block:
                                      "start",
                                  });

                                }

                              }}
                            >

                              {item.title}

                            </button>

                          ))}

                        </div>

                      </div>

                    ))}

                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="col-lg-9">

              <div className="filter-card">

                <div className="row">

                  <div className="col-lg-10">

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Product..."
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="col-lg-2">

                    <button
                      className="btn-reset"
                      onClick={() =>
                        setSearch("")
                      }
                    >
                      Reset
                    </button>

                  </div>

                </div>


              </div>

              {Object.entries(paginatedGroupedProducts).map(
                ([category, list]) => (

                  <div
                    key={category}
                    className="product-section"
                  >

                    <div className="section-titlee">

                      <h3>
                        {category}
                      </h3>

                      <span>
                        {list.length} Products Per Page
                      </span>

                    </div>

                    {list.map((item) => (

                      <div
                        key={item.uid}
                        id={item.slug}
                        className="product-list-card"
                      >

                        <div className="row align-items-center">

                          <div className="col-lg-3">

                            <div className="list-image">

                              <img
                                src={
                                  item.image ||
                                  "/no-image.png"
                                }
                                alt={
                                  item.title
                                }
                              />

                            </div>

                          </div>

                          <div className="col-lg-6">

                            <div className="list-content">

                              <h4>
                                {item.title}
                              </h4>

                              <p>
                                {item.desc ||
                                  "No description"}
                              </p>

                              <div className="spec-grid">

                                <div>
                                  <b>Brand</b>
                                  <span>
                                    {item.brand ||
                                      "-"}
                                  </span>
                                </div>

                                <div>
                                  <b>Usage</b>
                                  <span>
                                    {item.usage ||
                                      "-"}
                                  </span>
                                </div>

                                <div>
                                  <b>Model</b>
                                  <span>
                                    {item.model ||
                                      "-"}
                                  </span>
                                </div>

                                <div>
                                  <b>Size</b>
                                  <span>
                                    {item.size ||
                                      "-"}
                                  </span>
                                </div>

                              </div>

                            </div>

                          </div>

                          <div className="col-lg-3">

                            <div className="product-action">

                              <button
                                className="btn-view"
                                onClick={() => {

                                  window.location.href =
                                    isValidCity
                                      ? `/${citySlug}/items/${item.slug}`
                                      : `/items/${item.slug}`;

                                }}
                              >

                                View Details

                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )
              )}

              {/* NO PRODUCTS */}

              {filteredProducts.length === 0 && (

                <div className="no-products-found">

                  <div className="no-products-icon">
                    🔬
                  </div>

                  <h2>No Products Found</h2>

                  <p>
                    We couldn't find any products
                    matching your search.
                  </p>

                  <button
                    className="btn-reset"
                    onClick={() => setSearch("")}
                  >
                    View All Products
                  </button>

                </div>

              )}

              {/* PAGINATION */}

              {filteredProducts.length > 0 && totalPages > 1 && (

                <div className="custom-pagination">

                  <button
                    disabled={safeCurrentPage === 1}
                    onClick={() =>
                      setCurrentPage((p) => p - 1)
                    }
                  >
                    ← Previous
                  </button>

                  <span>
                    Page {safeCurrentPage} of {totalPages}
                  </span>

                  <button
                    disabled={
                      safeCurrentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage((p) => p + 1)
                    }
                  >
                    Next →
                  </button>

                </div>

              )}
            </div>

          </div>

        </div>

      </section>
      {showTopBtn && (

        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
        >
          ↑
        </button>

      )}
    </div>
  );
}