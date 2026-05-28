import { adminDb }
from "@/lib/firebase-admin";

export default async function sitemap() {
  const baseUrl =
    "https://globalbiomedical.org";

  const staticPages = [
    "",
    "/about",
    "/contact",
    "/services",
    "/items",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified:
      new Date(),
  }));

  try {
    const snapshot =
      await adminDb
        .collection(
          "websites"
        )
        .doc(
          "globalbiomedicalorg"
        )
        .collection(
          "districts"
        )
        .get();

    const districtPages =
      snapshot.docs.flatMap(
        (doc) => {
          const slug =
            doc.id;

          return [
            {
              url: `${baseUrl}/${slug}`,
            },

            {
              url: `${baseUrl}/${slug}/items`,
            },

            {
              url: `${baseUrl}/${slug}/about`,
            },

            {
              url: `${baseUrl}/${slug}/contact`,
            },

            {
              url: `${baseUrl}/${slug}/services`,
            },
          ];
        }
      );

    return [
      ...staticPages,
      ...districtPages,
    ];
  } catch (err) {
    console.error(
      "Sitemap Error:",
      err
    );

    return staticPages;
  }
}