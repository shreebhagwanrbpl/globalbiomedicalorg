import { adminDb } from "./firebase-admin.js";
import { fetchFullCatalog as fetchFullCatalogClient } from "./data-fetcher.js";
import {
  getDetectedCompanyId,
  getDetectedWebsiteId,
  isItemVisibleOnWebsite,
  makeSlug,
} from "./catalog-config.js";
import { cache } from "react";

/**
 * Server-side Master Catalog fetcher using Firebase Admin SDK.
 * Fetches fresh data with zero stale caching.
 */
async function fetchMasterCatalogServer(targetWebsiteId = null, targetCompanyId = null) {
  const companyId = targetCompanyId || getDetectedCompanyId();
  const websiteId = targetWebsiteId || getDetectedWebsiteId();

  // If adminDb is not initialized, fallback to client fetcher
  if (!adminDb) {
    console.warn("[data-fetcher-server] adminDb not initialized, using client SDK fetcher.");
    return fetchFullCatalogClient({ targetWebsiteId: websiteId, targetCompanyId: companyId });
  }

  const startTime = performance.now();
  try {
    const allProducts = [];
    const seenProductKeys = new Set();

    const addProductIfUnique = (prod) => {
      if (!prod || !prod.title) return;
      const key = (prod.id || prod.productId || prod.slug || prod.title).toLowerCase().trim();
      if (!seenProductKeys.has(key)) {
        seenProductKeys.add(key);
        allProducts.push(prod);
      }
    };

    // 1. Fetch categories from companies/{companyId}/categories
    const compRef = adminDb.collection("companies").doc(companyId);
    const categorySnap = await compRef.collection("categories").get();

    if (!categorySnap.empty) {
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

          // Fetch Subcategories: companies/{companyId}/categories/{categoryId}/subcategories
          try {
            const subcategoriesSnap = await categoryDoc.ref.collection("subcategories").get();

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
            console.error(`[data-fetcher-server] Error fetching subcategories for category ${catId}:`, subErr);
          }

          // Direct category products (if any)
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
      const normalSnap = await compRef.collection("products").get();
      normalSnap.forEach((prodDoc) => {
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
      console.error("[data-fetcher-server] Error fetching normal products from master:", normalErr);
    }

    // 3. Fallback: If Master Catalog returned 0 items, check legacy website path
    if (allProducts.length === 0) {
      try {
        const legacyRef = adminDb.collection("websites").doc(websiteId);
        const legacyCatSnap = await legacyRef.collection("pages").doc("categoryproducts").collection("categories").get();

        await Promise.all(
          legacyCatSnap.docs.map(async (catDoc) => {
            const data = catDoc.data();
            const categoryName = data.category || data.name || catDoc.id;

            try {
              const legacySubSnap = await catDoc.ref.collection("subcategories").get();
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
                      id: item.id || `${catDoc.id}-${subDoc.id}-${index}`,
                      uid: `${catDoc.id}-${subDoc.id}-${index}`,
                      category: categoryName,
                      subCategory: subCategoryName,
                      slug: item.slug || makeSlug(item.title),
                      images: formattedImages,
                      image: formattedImages[0] || "",
                    });
                  });
              });
            } catch (subErr) {
              // Ignore legacy subcategory errors
            }
          })
        );
      } catch (legacyErr) {
        // Ignore legacy fallback errors
      }
    }

    const duration = performance.now() - startTime;
    console.log(
      `[data-fetcher-server] Master Catalog server fetch completed in ${duration.toFixed(1)}ms. Visible products: ${allProducts.length}`
    );

    return allProducts;
  } catch (err) {
    console.error("[data-fetcher-server] Error in fetchMasterCatalogServer:", err);
    // Fallback to client fetcher on server error
    return fetchFullCatalogClient({ targetWebsiteId: websiteId, targetCompanyId: companyId });
  }
}

/**
 * React cache() wrapper for single-request deduplication during SSR.
 * Does NOT persist across HTTP requests (zero stale caching).
 */
export const fetchFullCatalog = cache(async (targetWebsiteId = null, targetCompanyId = null) => {
  return fetchMasterCatalogServer(targetWebsiteId, targetCompanyId);
});
