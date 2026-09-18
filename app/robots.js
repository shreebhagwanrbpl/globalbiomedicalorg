export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/*?*search=",
          "/*?*filter=",
          "/*?*sort=",
        ],
      },
    ],
    sitemap: "https://globalbiomedical.org/sitemap.xml",
  };
}