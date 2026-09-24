/**
 * One-time migration helper: Firestore -> SQLite.
 * No Firebase SDK is required. It uses the Firestore REST API and a service-account JWT.
 * Run only while you still have Firestore access/quota available.
 */
import fs from "node:fs";
import crypto from "node:crypto";
import { saveDocuments, getSqlitePath, closeDatabase } from "../lib/sqlite.js";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;

function base64url(value) { return Buffer.from(value).toString("base64url"); }

function loadCredentials() {
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const json = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    return { projectId: json.project_id, clientEmail: json.client_email, privateKey: json.private_key };
  }
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY, or FIREBASE_SERVICE_ACCOUNT_FILE.");
  }
  return { projectId, clientEmail, privateKey };
}

const creds = loadCredentials();

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: creds.clientEmail,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = signer.sign(creds.privateKey, "base64url");
  const assertion = `${unsigned}.${signature}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!response.ok) throw new Error(`OAuth token request failed: ${response.status} ${await response.text()}`);
  return (await response.json()).access_token;
}

function decodeValue(v) {
  if (v === null || v === undefined) return null;
  if (Object.hasOwn(v, "nullValue")) return null;
  if (Object.hasOwn(v, "booleanValue")) return v.booleanValue;
  if (Object.hasOwn(v, "integerValue")) return Number(v.integerValue);
  if (Object.hasOwn(v, "doubleValue")) return v.doubleValue;
  if (Object.hasOwn(v, "timestampValue")) return v.timestampValue;
  if (Object.hasOwn(v, "stringValue")) return v.stringValue;
  if (Object.hasOwn(v, "bytesValue")) return v.bytesValue;
  if (Object.hasOwn(v, "referenceValue")) return v.referenceValue;
  if (Object.hasOwn(v, "geoPointValue")) return v.geoPointValue;
  if (Object.hasOwn(v, "arrayValue")) return (v.arrayValue?.values || []).map(decodeValue);
  if (Object.hasOwn(v, "mapValue")) return Object.fromEntries(Object.entries(v.mapValue?.fields || {}).map(([k, value]) => [k, decodeValue(value)]));
  return null;
}

function decodeFields(fields = {}) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));
}

const token = await accessToken();
const base = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(creds.projectId)}/databases/(default)/documents`;
const headers = { Authorization: `Bearer ${token}` };
const migrated = [];

async function postListCollectionIds(parent) {
  const ids = [];
  let pageToken = "";
  do {
    const url = `${parent}:listCollectionIds?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
    const r = await fetch(url, { method: "POST", headers });
    if (!r.ok) throw new Error(`listCollectionIds failed: ${r.status} ${await r.text()}`);
    const j = await r.json();
    ids.push(...(j.collectionIds || []));
    pageToken = j.nextPageToken || "";
  } while (pageToken);
  return ids;
}

async function listDocs(collectionUrl) {
  const docs = [];
  let pageToken = "";
  do {
    const url = `${collectionUrl}?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
    const r = await fetch(url, { headers });
    if (!r.ok) throw new Error(`listDocuments failed: ${r.status} ${await r.text()}`);
    const j = await r.json();
    docs.push(...(j.documents || []));
    pageToken = j.nextPageToken || "";
  } while (pageToken);
  return docs;
}

async function walkCollection(collectionUrl, sqlitePrefix) {
  const docs = await listDocs(collectionUrl);
  for (const doc of docs) {
    const relativeId = doc.name.split("/documents/")[1];
    migrated.push({ path: relativeId, data: decodeFields(doc.fields || {}) });
    const subcollections = await postListCollectionIds(doc.name);
    for (const sub of subcollections) {
      await walkCollection(`${doc.name}/${sub}`, relativeId);
    }
    if (migrated.length % 250 === 0) {
      saveDocuments(migrated.splice(0, migrated.length));
      console.log(`Migrated documents: ${migrated.length} pending, SQLite: ${getSqlitePath()}`);
    }
  }
}

const roots = await postListCollectionIds(`${base}`);
console.log(`Found root collections: ${roots.join(", ") || "none"}`);
for (const collectionId of roots) {
  console.log(`Migrating ${collectionId}...`);
  await walkCollection(`${base}/${collectionId}`, collectionId);
}
if (migrated.length) saveDocuments(migrated);
console.log(`Migration complete. SQLite database: ${getSqlitePath()}`);
closeDatabase();
