import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import {
  WEBSITE_ID,
  COMPANY_ID,
  SQLITE_DB_PATH,
  isItemVisibleOnWebsite,
  normalizeDomainId,
  makeSlug,
} from "./catalog-utils.js";

function resolveDbPath() {
  if (process.env.SQLITE_DB_PATH && fs.existsSync(process.env.SQLITE_DB_PATH)) {
    return path.resolve(process.env.SQLITE_DB_PATH);
  }
  const superAdminDb = path.resolve(process.cwd(), "..", "SuperAdminRBPL", "data", "catalog.db");
  if (fs.existsSync(superAdminDb)) {
    return superAdminDb;
  }
  const localDb = path.resolve(process.cwd(), "data", "catalog.db");
  return localDb;
}

let dbPath = resolveDbPath();
let database;

export function getDatabase() {
  if (!database) {
    dbPath = resolveDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    database = new DatabaseSync(dbPath);
    database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      PRAGMA read_uncommitted = ON;
      CREATE TABLE IF NOT EXISTS documents (
        path TEXT PRIMARY KEY,
        collection_path TEXT,
        doc_id TEXT,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_documents_path ON documents(path);
      CREATE TABLE IF NOT EXISTS contact_queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS product_queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return database;
}

export function getSqlitePath() {
  return dbPath;
}

export function getDocument(docPath) {
  const row = getDatabase()
    .prepare("SELECT data FROM documents WHERE path = ? LIMIT 1")
    .get(docPath);
  if (!row) return null;
  try {
    return JSON.parse(row.data);
  } catch {
    return null;
  }
}

export function listDocuments(collectionPath) {
  const prefix = collectionPath.replace(/\/+$/, "") + "/";
  const rows = getDatabase()
    .prepare("SELECT path, data FROM documents WHERE path LIKE ? ORDER BY path")
    .all(`${prefix}%`);
  const result = [];
  for (const row of rows) {
    const rest = row.path.slice(prefix.length);
    if (!rest || rest.includes("/")) continue;
    try {
      result.push({ id: rest, path: row.path, data: JSON.parse(row.data) });
    } catch {}
  }
  return result;
}

export function saveDocument(docPath, data) {
  const parts = docPath.split("/");
  const docId = parts[parts.length - 1];
  const collPath = parts.slice(0, -1).join("/");
  getDatabase()
    .prepare(
      "INSERT INTO documents(path, collection_path, doc_id, data, updated_at) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(path) DO UPDATE SET data=excluded.data, updated_at=CURRENT_TIMESTAMP"
    )
    .run(docPath, collPath, docId, JSON.stringify(data ?? {}));
}

export function saveQuery(type, data) {
  const db = getDatabase();
  const table = type === "product" ? "product_queries" : "contact_queries";
  db.prepare(`INSERT INTO ${table}(data) VALUES(?)`).run(
    JSON.stringify(data ?? {})
  );
}

export function listQueries(type, limit = 100) {
  const table = type === "product" ? "product_queries" : "contact_queries";
  return getDatabase()
    .prepare(`SELECT id, data, created_at FROM ${table} ORDER BY id DESC LIMIT ?`)
    .all(Number(limit))
    .map((row) => {
      let data = {};
      try {
        data = JSON.parse(row.data);
      } catch {}
      return { id: row.id, ...data, createdAt: row.created_at };
    });
}

function normalizeTitleKey(t = "") {
  return String(t || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Extracts and filters products from the SQLite DB adhering strictly to:
 * 1. WEBSITE_ID exact matching & visibility rules
 * 2. Cascading Category -> Subcategory -> Product hierarchy
 * 3. 0-delay instant updates from SQLite WAL buffer
 */
export function getProductsFromDb(
  targetWebsiteId = WEBSITE_ID,
  targetCompanyId = COMPANY_ID
) {
  try {
    const db = getDatabase();

    // 1. Fetch categories to check category-level visibility
    const catRows = db
      .prepare(
        "SELECT path, data FROM documents WHERE path LIKE 'companies/%/categories/%' AND path NOT LIKE '%/subcategories/%'"
      )
      .all();

    const categoryVisibilityMap = new Map();
    for (const cr of catRows) {
      try {
        const catData = JSON.parse(cr.data);
        const parts = cr.path.split("/");
        const comp = parts[1];
        const catId = parts[3];
        const isVisible = isItemVisibleOnWebsite(catData, targetWebsiteId, true, true);
        categoryVisibilityMap.set(`${comp}/${catId}`, isVisible);
        categoryVisibilityMap.set(catId, isVisible);
      } catch {}
    }

    // 2. Fetch subcategories and embedded products
    const subRows = db
      .prepare(
        "SELECT path, data FROM documents WHERE path LIKE 'companies/%/categories/%/subcategories/%' OR path LIKE 'websites/%/pages/categoryproducts/categories/%/subcategories/%' ORDER BY CASE WHEN path LIKE 'companies/global%' THEN 0 WHEN path LIKE 'companies/human%' THEN 1 ELSE 2 END"
      )
      .all();

    const productsMap = new Map();

    for (const row of subRows) {
      try {
        const data = JSON.parse(row.data);
        const parts = row.path.split("/");
        const company = parts[1] || targetCompanyId;
        const catSlug = parts[3] || "test-strips";
        const subcatSlug = parts[5] || parts[parts.length - 1] || "test-strips";

        // Check Cascading Category Visibility
        const catKey = `${company}/${catSlug}`;
        const isCatVisible = categoryVisibilityMap.has(catKey)
          ? categoryVisibilityMap.get(catKey)
          : categoryVisibilityMap.has(catSlug)
            ? categoryVisibilityMap.get(catSlug)
            : true;

        if (!isCatVisible) {
          // Entire category is hidden -> cascade hide all subcategories & products
          continue;
        }

        // Check Cascading Subcategory Visibility
        const isSubVisible = isItemVisibleOnWebsite(
          data,
          targetWebsiteId,
          isCatVisible,
          true
        );

        if (!isSubVisible) {
          // Subcategory is hidden -> cascade hide its products
          continue;
        }

        const subcatProducts = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data)
            ? data
            : [];

        const categoryName = data.category || "Test Strips";
        const subCategoryName =
          data.subCategory ||
          data.name ||
          subcatSlug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

        for (const p of subcatProducts) {
          if (!p || typeof p !== "object") continue;

          // Check Product-level Visibility
          const isProdVisible = isItemVisibleOnWebsite(
            p,
            targetWebsiteId,
            isCatVisible,
            isSubVisible
          );

          if (!isProdVisible) {
            continue;
          }

          const rawTitle = (p.title || p.name || "").trim();

          // Skip empty placeholder headers
          if (
            !rawTitle ||
            (rawTitle.toLowerCase() === "test strips" &&
              !p.price &&
              !p.desc &&
              !p.description &&
              !p.brand)
          ) {
            continue;
          }

          const key = normalizeTitleKey(rawTitle);
          if (productsMap.has(key)) continue;

          const id = p.id || p.productId || p.uid || makeSlug(rawTitle);
          const formattedImages =
            Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : p.image
                ? [p.image]
                : Array.isArray(p.originalImages) && p.originalImages.length > 0
                  ? p.originalImages
                  : ["/HA.png"];

          const prodObj = {
            ...p,
            id,
            productId: p.productId || id,
            uid: p.uid || id,
            title: rawTitle,
            name: rawTitle,
            category: categoryName,
            subCategory: subCategoryName,
            categoryId: catSlug,
            subcategoryId: subcatSlug,
            slug: p.slug || makeSlug(rawTitle),
            images: formattedImages,
            image: formattedImages[0] || "/HA.png",
            brand: p.brand || "Global Biomedical",
            model: p.model || "Standard",
            instrument: p.instrument || categoryName,
            automation: p.automation || "Semi-Automated",
            throughput: p.throughput || "Rapid Testing",
            usage: p.usage || "Clinical Laboratory & Hospital",
            capacity: p.capacity || p.size || "Standard Pack",
            availability: p.availability || "In Stock - Pan India Delivery",
            description:
              p.description ||
              p.desc ||
              `${rawTitle} - High-accuracy diagnostic test strips for medical laboratories and healthcare centers.`,
            desc:
              p.desc ||
              p.description ||
              `${rawTitle} - High-accuracy diagnostic test strips for medical laboratories and healthcare centers.`,
            companyId: targetCompanyId,
            websiteIds: Array.isArray(p.websiteIds) && p.websiteIds.length > 0 ? p.websiteIds : ["all", targetWebsiteId],
            isPublished: p.isPublished !== undefined ? p.isPublished : true,
          };

          productsMap.set(key, prodObj);
        }
      } catch (err) {}
    }

    return Array.from(productsMap.values());
  } catch (error) {
    console.error("[sqlite.js] Error in getProductsFromDb:", error);
    return [];
  }
}

/**
 * Extracts and formats website-level documents from SQLite.
 */
export function getSiteDocFromDb(
  type,
  websiteId = WEBSITE_ID,
  district = null
) {
  try {
    const db = getDatabase();

    if (type === "district" && district) {
      const candidates = [
        `websites/${websiteId}/districts/${district}`,
        `websites/${COMPANY_ID}/${websiteId}/districts/${district}`,
        `websites/global/${websiteId}/districts/${district}`,
      ];
      for (const p of candidates) {
        const row = db.prepare("SELECT data FROM documents WHERE path = ? LIMIT 1").get(p);
        if (row) {
          try {
            return JSON.parse(row.data);
          } catch {}
        }
      }
      return null;
    }

    if (type === "districts") {
      const rows = db
        .prepare("SELECT path, data FROM documents WHERE path LIKE '%/districts/%'")
        .all();
      const list = [];
      for (const r of rows) {
        try {
          list.push(JSON.parse(r.data));
        } catch {}
      }
      return list;
    }

    // Try matching specific website page paths
    const paths = [
      `websites/${websiteId}/pages/${type}`,
      `websites/${COMPANY_ID}/${websiteId}/pages/${type}`,
      `websites/global/${websiteId}/pages/${type}`,
      `websites/global/globalbiomedicalorg/pages/${type}`,
      `websites/global/globalbiomedicalin/pages/${type}`,
      `websites/global/globalbiomedicalcoin/pages/${type}`,
    ];

    for (const p of paths) {
      const row = db.prepare("SELECT data FROM documents WHERE path = ? LIMIT 1").get(p);
      if (row) {
        try {
          const parsed = JSON.parse(row.data);
          if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
            if (type === "services" && (!parsed.services || parsed.services.length === 0)) {
              continue;
            }

            if (type === "contact") {
              const infoList = Array.isArray(parsed.contactInfo) ? parsed.contactInfo : [];

              // Extract address
              const addrItem = infoList.find(
                (i) =>
                  i &&
                  typeof i.label === "string" &&
                  (i.label.toLowerCase().includes("address") ||
                    i.label.toLowerCase().includes("location"))
              );
              const address =
                parsed.address ||
                (addrItem ? (Array.isArray(addrItem.value) ? addrItem.value.join(", ") : String(addrItem.value || "")) : "") ||
                "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, Ajmer-Delhi Bypass Rd, Jaipur, Rajasthan 302021, India";

              // Extract email
              const emailItem = infoList.find(
                (i) =>
                  i &&
                  typeof i.label === "string" &&
                  (i.label.toLowerCase().includes("email") ||
                    i.label.toLowerCase().includes("mail"))
              );
              const email =
                parsed.email ||
                (emailItem ? (Array.isArray(emailItem.value) ? emailItem.value[0] : String(emailItem.value || "")) : "") ||
                "info@globalbiomedical.org";

              // Extract phone numbers (handles array of phones from AdminContact)
              const extractedPhones = [];
              if (Array.isArray(parsed.phones)) {
                extractedPhones.push(...parsed.phones.flat());
              } else if (typeof parsed.phone === "string") {
                extractedPhones.push(parsed.phone);
              }

              for (const item of infoList) {
                if (!item || !item.label) continue;
                const lbl = item.label.toLowerCase();
                if (
                  lbl.includes("phone") ||
                  lbl.includes("mobile") ||
                  lbl.includes("tel") ||
                  lbl.includes("call") ||
                  lbl.includes("hotline") ||
                  lbl.includes("whatsapp")
                ) {
                  if (Array.isArray(item.value)) {
                    extractedPhones.push(...item.value);
                  } else if (typeof item.value === "string" && item.value.trim()) {
                    extractedPhones.push(item.value.trim());
                  }
                }
              }

              const cleanPhones = Array.from(
                new Set(
                  extractedPhones
                    .map((p) => String(p || "").trim())
                    .filter((p) => p && p.length >= 8)
                )
              );

              const phones =
                cleanPhones.length > 0
                  ? cleanPhones
                  : ["+91 9257984336", "+91 8529833535", "+91 9983301657", "+91 8318368383"];

              // Extract working hours
              const hoursItem = infoList.find(
                (i) =>
                  i &&
                  typeof i.label === "string" &&
                  (i.label.toLowerCase().includes("hour") ||
                    i.label.toLowerCase().includes("timing"))
              );
              const workingHours =
                parsed.workingHours ||
                (hoursItem ? (Array.isArray(hoursItem.value) ? hoursItem.value.join(", ") : String(hoursItem.value || "")) : "") ||
                "Mon - Sat: 9:30 AM - 6:30 PM";

              const formattedContactInfo =
                infoList.length > 0
                  ? infoList.map((ci) => ({
                      label: ci.label || "Contact",
                      value: Array.isArray(ci.value) ? ci.value.join(", ") : String(ci.value || ""),
                    }))
                  : [
                      { label: "Address", value: address },
                      { label: "Email", value: email },
                      ...phones.map((p, idx) => ({ label: idx === 0 ? "Phone" : `Phone ${idx + 1}`, value: p })),
                      { label: "Working Hours", value: workingHours },
                    ];

              return {
                address,
                email,
                phones,
                workingHours,
                contactInfo: formattedContactInfo,
                updatedAt: parsed.updatedAt || new Date().toISOString(),
              };
            }

            return parsed;
          }
        } catch {}
      }
    }

    return null;
  } catch (error) {
    console.error("[sqlite.js] Error in getSiteDocFromDb:", error);
    return null;
  }
}

export function closeDatabase() {
  if (database) {
    database.close();
    database = undefined;
  }
}
