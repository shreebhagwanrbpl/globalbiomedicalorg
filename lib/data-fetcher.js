import { db } from "./firebase.js";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import {
  getDetectedCompanyId,
  getDetectedWebsiteId,
  isItemVisibleOnWebsite,
  makeSlug,
} from "./catalog-config.js";

// In-memory single-flight promise cache (only prevents duplicate simultaneous requests in flight)
let inFlightCatalogPromise = null;

/**
 * Fetch a single document from Firestore.
 */
export async function fetchDocCached(path) {
  try {
    const parts = path.split("/").filter(Boolean);
    const docRef = doc(db, ...parts);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.error(`Error fetching doc at ${path}:`, err);
    throw err;
  }
}

/**
 * Fetch and process the entire products catalog from the Master Catalog (`companies/{companyId}`).
 * Applies bulletproof cascading visibility rules:
 * - Category hidden -> all subcategories & products hidden
 * - Subcategory hidden -> all products hidden
 * - Product hidden -> product hidden
 *
 * @param {Object} options
 * @param {boolean} options.forceRefresh - Bypass any in-flight cache
 * @param {string} options.targetWebsiteId - Website ID to filter by
 * @param {string} options.targetCompanyId - Company ID to fetch from
 * @returns {Promise<Array>} Array of visible, formatted product objects
 */
export async function fetchFullCatalog(options = {}) {
  const {
    forceRefresh = false,
    targetWebsiteId = null,
    targetCompanyId = null,
  } = options;

  if (forceRefresh) {
    inFlightCatalogPromise = null;
  }

  if (inFlightCatalogPromise) {
    return inFlightCatalogPromise;
  }

  inFlightCatalogPromise = (async () => {
    const startTime = performance.now();
    const companyId = targetCompanyId || getDetectedCompanyId();
    const websiteId = targetWebsiteId || getDetectedWebsiteId();

    try {
      const allProducts = [];
      const seenProductKeys = new Set();

      // Helper to add unique product
      const addProductIfUnique = (prod) => {
        if (!prod || !prod.title) return;
        const key = (prod.id || prod.productId || prod.slug || prod.title).toLowerCase().trim();
        if (!seenProductKeys.has(key)) {
          seenProductKeys.add(key);
          allProducts.push(prod);
        }
      };

      // 1. Fetch Master Categories from companies/{companyId}/categories
      const categoriesCol = collection(db, "companies", companyId, "categories");
      const categorySnap = await getDocs(categoriesCol);

      if (!categorySnap.empty) {
        // Parallel fetch for all categories and their subcategories
        await Promise.all(
          categorySnap.docs.map(async (categoryDoc) => {
            const catData = categoryDoc.data();
            const catId = categoryDoc.id;
            const categoryName = catData.name || catData.category || catId;

            // Check Category Visibility
            const isCatVisible = isItemVisibleOnWebsite(
              { ...catData, id: catId },
              websiteId,
              true,
              true
            );

            // If Category is hidden -> HIDE ALL subcategories & products underneath
            if (!isCatVisible) {
              return;
            }

            // A. Fetch Subcategories: companies/{companyId}/categories/{categoryId}/subcategories
            try {
              const subcategoriesCol = collection(
                db,
                "companies",
                companyId,
                "categories",
                catId,
                "subcategories"
              );
              const subcategoriesSnap = await getDocs(subcategoriesCol);

              subcategoriesSnap.forEach((subDoc) => {
                const subData = subDoc.data();
                const subId = subDoc.id;
                const subCategoryName = subData.name || subData.subCategory || subId;

                // Check Subcategory Visibility
                const isSubVisible = isItemVisibleOnWebsite(
                  { ...subData, id: subId },
                  websiteId,
                  true,
                  true
                );

                // If Subcategory is hidden -> HIDE ALL products underneath
                if (!isSubVisible) {
                  return;
                }

                // Parse products array inside subcategory document
                const rawProducts = Array.isArray(subData.products) ? subData.products : [];
                rawProducts.forEach((item, index) => {
                  const isProdVisible = isItemVisibleOnWebsite(
                    item,
                    websiteId,
                    true,
                    true
                  );

                  if (isProdVisible) {
                    const formattedImages = Array.isArray(item.images) && item.images.length > 0
                      ? item.images
                      : (item.image ? [item.image] : (item.originalImages || []));

                    const formattedProd = {
                      ...item,
                      id: item.id || item.productId || item.categoryProductId || `${catId}-${subId}-${index}`,
                      productId: item.productId || item.id || `${catId}-${subId}-${index}`,
                      categoryProductId: item.categoryProductId || item.id || `${catId}-${subId}-${index}`,
                      uid: item.uid || `${catId}-${subId}-${item.id || index}`,
                      title: item.title || item.name || "Untitled Product",
                      name: item.name || item.title || "Untitled Product",
                      category: categoryName,
                      subCategory: subCategoryName,
                      categoryId: catId,
                      subcategoryId: subId,
                      slug: item.slug || makeSlug(item.title || item.name),
                      images: formattedImages,
                      image: formattedImages[0] || "",
                      companyId: item.companyId || companyId,
                      websiteIds: item.websiteIds || subData.websiteIds || catData.websiteIds || [],
                      isPublished: item.isPublished !== undefined ? item.isPublished : true,
                    };

                    addProductIfUnique(formattedProd);
                  }
                });
              });
            } catch (subErr) {
              console.error(`Error fetching subcategories for category ${catId}:`, subErr);
            }

            // B. Check direct products attached to category document (if any)
            if (Array.isArray(catData.products) && catData.products.length > 0) {
              catData.products.forEach((item, index) => {
                const isProdVisible = isItemVisibleOnWebsite(
                  item,
                  websiteId,
                  true,
                  true
                );

                if (isProdVisible) {
                  const formattedImages = Array.isArray(item.images) && item.images.length > 0
                    ? item.images
                    : (item.image ? [item.image] : []);

                  const formattedProd = {
                    ...item,
                    id: item.id || item.productId || `${catId}-direct-${index}`,
                    productId: item.productId || item.id || `${catId}-direct-${index}`,
                    uid: item.uid || `${catId}-direct-${item.id || index}`,
                    title: item.title || item.name || "Untitled Product",
                    name: item.name || item.title || "Untitled Product",
                    category: categoryName,
                    subCategory: item.subCategory || categoryName,
                    categoryId: catId,
                    subcategoryId: item.subcategoryId || null,
                    slug: item.slug || makeSlug(item.title || item.name),
                    images: formattedImages,
                    image: formattedImages[0] || "",
                    companyId: item.companyId || companyId,
                    websiteIds: item.websiteIds || catData.websiteIds || [],
                    isPublished: item.isPublished !== undefined ? item.isPublished : true,
                  };

                  addProductIfUnique(formattedProd);
                }
              });
            }
          })
        );
      }

      // 2. Fetch Master Normal Products from companies/{companyId}/products (if any)
      try {
        const normalProductsCol = collection(db, "companies", companyId, "products");
        const normalProductsSnap = await getDocs(normalProductsCol);

        normalProductsSnap.forEach((prodDoc) => {
          const item = prodDoc.data();
          const isProdVisible = isItemVisibleOnWebsite(
            { ...item, id: prodDoc.id },
            websiteId,
            true,
            true
          );

          if (isProdVisible) {
            const formattedImages = Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : (item.image ? [item.image] : []);

            const formattedProd = {
              ...item,
              id: item.id || prodDoc.id,
              productId: item.productId || prodDoc.id,
              uid: item.uid || `normal-${prodDoc.id}`,
              title: item.title || item.name || "Untitled Product",
              name: item.name || item.title || "Untitled Product",
              category: item.category || "Other Products",
              subCategory: item.subCategory || item.category || "Other Products",
              categoryId: item.categoryId || null,
              subcategoryId: item.subcategoryId || null,
              slug: item.slug || makeSlug(item.title || item.name),
              images: formattedImages,
              image: formattedImages[0] || "",
              companyId: item.companyId || companyId,
              websiteIds: item.websiteIds || [],
              isPublished: item.isPublished !== undefined ? item.isPublished : true,
            };

            addProductIfUnique(formattedProd);
          }
        });
      } catch (normalErr) {
        console.error("Error fetching normal products from master:", normalErr);
      }

      // 3. Fallback: If Master Catalog returned 0 items, check legacy website path
      if (allProducts.length === 0) {
        try {
          const legacyCategorySnap = await getDocs(
            collection(db, "websites", websiteId, "pages", "categoryproducts", "categories")
          );

          await Promise.all(
            legacyCategorySnap.docs.map(async (categoryDoc) => {
              const data = categoryDoc.data();
              const categoryName = data.category || data.name || categoryDoc.id;

              try {
                const legacySubSnap = await getDocs(
                  collection(
                    db,
                    "websites",
                    websiteId,
                    "pages",
                    "categoryproducts",
                    "categories",
                    categoryDoc.id,
                    "subcategories"
                  )
                );

                legacySubSnap.forEach((subDoc) => {
                  const subData = subDoc.data();
                  const subCategoryName = subData.subCategory || subData.name || subDoc.id;

                  (subData.products || [])
                    .filter((p) => isItemVisibleOnWebsite(p, websiteId))
                    .forEach((item, index) => {
                      const formattedImages = Array.isArray(item.images) && item.images.length > 0
                        ? item.images
                        : (item.image ? [item.image] : []);

                      addProductIfUnique({
                        ...item,
                        id: item.id || `${categoryDoc.id}-${subDoc.id}-${index}`,
                        uid: `${categoryDoc.id}-${subDoc.id}-${index}`,
                        category: categoryName,
                        subCategory: subCategoryName,
                        slug: item.slug || makeSlug(item.title),
                        images: formattedImages,
                        image: formattedImages[0] || "",
                      });
                    });
                });
              } catch (subErr) {
                // Ignore fallback subcategory errors
              }
            })
          );
        } catch (legacyErr) {
          // Ignore legacy fallback errors
        }
      }

      const duration = performance.now() - startTime;
      console.log(
        `[data-fetcher] Master Catalog fetch completed in ${duration.toFixed(1)}ms. Visible products for ${websiteId} (${companyId}): ${allProducts.length}`
      );

      return allProducts;
    } catch (err) {
      console.error("Error in Master Catalog fetchFullCatalog:", err);
      throw err;
    } finally {
      // Clear in-flight promise after resolution so subsequent requests always get fresh data
      inFlightCatalogPromise = null;
    }
  })();

  return inFlightCatalogPromise;
}

/**
 * Helpers for cached document retrieval across pages
 */
export async function fetchHomeData() {
  const websiteId = getDetectedWebsiteId();
  return fetchDocCached(`websites/${websiteId}/pages/home`);
}

export async function fetchContactData() {
  const websiteId = getDetectedWebsiteId();
  return fetchDocCached(`websites/${websiteId}/pages/contact`);
}

export async function fetchServicesData() {
  const websiteId = getDetectedWebsiteId();
  return fetchDocCached(`websites/${websiteId}/pages/services`);
}

export async function fetchDistrictData(district) {
  if (!district) return null;
  const websiteId = getDetectedWebsiteId();
  return fetchDocCached(`websites/${websiteId}/districts/${district}`);
}
