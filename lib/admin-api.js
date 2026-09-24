/**
 * Central Admin API client.
 * Website content/catalog lives in the SuperAdmin SQLite database.
 * The website never opens its own SQLite database for CMS/catalog reads.
 */

const DEFAULT_ADMIN_API_URL = "https://admin.rajbiosis.app";

export function getAdminApiUrl() {
  return (
    process.env.ADMIN_API_URL ||
    process.env.NEXT_PUBLIC_ADMIN_API_URL ||
    DEFAULT_ADMIN_API_URL
  ).replace(/\/$/, "");
}

export async function fetchAdminJson(path, options = {}) {
  const url = `${getAdminApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Admin API ${response.status}: ${url}`);
  }

  return response.json();
}
