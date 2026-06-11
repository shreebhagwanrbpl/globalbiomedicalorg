import { adminDb } from "@/lib/firebase-admin";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export default async function sitemap() {
  const baseUrl =
    "https://globalbiomedical.org";

  const now = new Date();

  const urls = [
    "",
    "/about",
    "/contact",
    "/services",
    "/items",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
  }));

  try {
    const websiteRef =
      adminDb
        .collection("websites")
        .doc(
          "globalbiomedicalorg"
        );

    // check document exists
    const websiteDoc =
      await websiteRef.get();

    console.log(
      "Website Exists:",
      websiteDoc.exists
    );

    const districtSnapshot =
      await websiteRef
        .collection(
          "districts"
        )
        .get();

    console.log(
      "District Count:",
      districtSnapshot.size
    );

    for (const districtDoc of districtSnapshot.docs) {
      const districtSlug =
        districtDoc.id;

      urls.push(
        {
          url: `${baseUrl}/${districtSlug}`,
          lastModified: now,
        },
        {
          url: `${baseUrl}/${districtSlug}/items`,
          lastModified: now,
        },
        {
          url: `${baseUrl}/${districtSlug}/about`,
          lastModified: now,
        },
        {
          url: `${baseUrl}/${districtSlug}/contact`,
          lastModified: now,
        },
        {
          url: `${baseUrl}/${districtSlug}/services`,
          lastModified: now,
        }
      );

      // items
      const itemsSnapshot =
        await websiteRef
          .collection(
            "districts"
          )
          .doc(
            districtSlug
          )
          .collection("items")
          .get();

      itemsSnapshot.forEach(
        (itemDoc) => {
          urls.push({
            url: `${baseUrl}/${districtSlug}/items/${itemDoc.id}`,
            lastModified: now,
          });
        }
      );
    }

    console.log(
      "Final URL Count:",
      urls.length
    );

    return urls;
  } catch (error) {
    console.error(
      "Sitemap Error:",
      error
    );

    return urls;
  }
}