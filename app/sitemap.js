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
    const districtSnapshot =
      await adminDb
        .collection("websites")
        .doc("globalbiomedicalorg")
        .collection("districts")
        .get();

    console.log(
      "District Count:",
      districtSnapshot.size
    );

    for (const districtDoc of districtSnapshot.docs) {
      const districtSlug =
        districtDoc.id;

      // district pages
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

      // items fetch
      try {
        const itemsSnapshot =
          await adminDb
            .collection("websites")
            .doc(
              "globalbiomedicalorg"
            )
            .collection(
              "districts"
            )
            .doc(
              districtSlug
            )
            .collection("items")
            .get();

        console.log(
          `${districtSlug} items:`,
          itemsSnapshot.size
        );

        itemsSnapshot.docs.forEach(
          (itemDoc) => {
            urls.push({
              url: `${baseUrl}/${districtSlug}/items/${itemDoc.id}`,
              lastModified: now,
            });
          }
        );
      } catch (error) {
        console.error(
          `Error in ${districtSlug}`,
          error
        );
      }
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