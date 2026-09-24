import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const dbPath = path.resolve(process.env.SQLITE_DB_PATH || path.join(process.cwd(), "data", "catalog.db"));
let database;

function getDatabase() {
  if (!database) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    database = new DatabaseSync(dbPath);
    database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS documents (
        path TEXT PRIMARY KEY,
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
  const row = getDatabase().prepare("SELECT data FROM documents WHERE path = ? LIMIT 1").get(docPath);
  if (!row) return null;
  try { return JSON.parse(row.data); } catch { return null; }
}

export function listDocuments(collectionPath) {
  const prefix = collectionPath.replace(/\/+$/, "") + "/";
  const rows = getDatabase().prepare("SELECT path, data FROM documents WHERE path LIKE ? ORDER BY path").all(`${prefix}%`);
  const result = [];
  for (const row of rows) {
    const rest = row.path.slice(prefix.length);
    if (!rest || rest.includes("/")) continue;
    try { result.push({ id: rest, path: row.path, data: JSON.parse(row.data) }); } catch {}
  }
  return result;
}

export function saveDocument(docPath, data) {
  getDatabase().prepare(
    "INSERT INTO documents(path, data, updated_at) VALUES(?, ?, CURRENT_TIMESTAMP) ON CONFLICT(path) DO UPDATE SET data=excluded.data, updated_at=CURRENT_TIMESTAMP"
  ).run(docPath, JSON.stringify(data ?? {}));
}

export function saveDocuments(documents = []) {
  const db = getDatabase();
  const stmt = db.prepare(
    "INSERT INTO documents(path, data, updated_at) VALUES(?, ?, CURRENT_TIMESTAMP) ON CONFLICT(path) DO UPDATE SET data=excluded.data, updated_at=CURRENT_TIMESTAMP"
  );
  db.exec("BEGIN");
  try {
    for (const doc of documents) stmt.run(doc.path, JSON.stringify(doc.data ?? {}));
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function saveQuery(type, data) {
  const db = getDatabase();
  const table = type === "product" ? "product_queries" : "contact_queries";
  db.prepare(`INSERT INTO ${table}(data) VALUES(?)`).run(JSON.stringify(data ?? {}));
}

export function listQueries(type, limit = 100) {
  const table = type === "product" ? "product_queries" : "contact_queries";
  return getDatabase().prepare(`SELECT id, data, created_at FROM ${table} ORDER BY id DESC LIMIT ?`).all(Number(limit)).map((row) => {
    let data = {};
    try { data = JSON.parse(row.data); } catch {}
    return { id: row.id, ...data, createdAt: row.created_at };
  });
}

export function countDocuments() {
  return getDatabase().prepare("SELECT COUNT(*) AS count FROM documents").get().count;
}

export function closeDatabase() {
  if (database) { database.close(); database = undefined; }
}
