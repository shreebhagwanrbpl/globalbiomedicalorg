import ProductDetails from "./ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params;
        const slug = resolvedParams?.slug || "";

        const productName = slug
            ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : "Medical Equipment";

        const title = `${productName} Supplier in India | Price, Dealer & Distributor | Global Biomedical`;

        const description = `Buy ${productName} at best price in India. Trusted supplier, dealer and distributor of ${productName} for hospitals, laboratories, diagnostic centers, research institutes and healthcare facilities. Contact Global Biomedical for latest quotation and product details.`;

        const url = `https://globalbiomedical.org/items/${slug}`;

        return {
            title,
            description,

            keywords: [
                productName,
                `${productName} Supplier`,
                `${productName} Dealer`,
                `${productName} Distributor`,
                `${productName} Manufacturer`,
                `${productName} Exporter`,
                `${productName} Price`,
                `${productName} Price in India`,
                `${productName} Supplier in India`,
                `${productName} Dealer in India`,
                `${productName} Distributor in India`,
                `Buy ${productName}`,
                `${productName} for Laboratory`,
                `${productName} for Hospital`,
                `${productName} for Diagnostic Center`,
                "Biomedical Equipment",
                "Medical Equipment",
                "Laboratory Equipment",
                "Diagnostic Equipment",
                "Hospital Equipment",
                "Healthcare Equipment",
                "Global Biomedical",
            ],

            alternates: {
                canonical: url,
            },

            openGraph: {
                title,
                description,
                url,
                siteName: "Global Biomedical",
                type: "website",
                locale: "en_IN",
            },

            twitter: {
                card: "summary_large_image",
                title,
                description,
            },

            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },

            metadataBase: new URL("https://globalbiomedical.org"),
        };
    } catch (err) {
        console.error("generateMetadata error:", err);
        return {
            title: "Biomedical & Diagnostic Equipment Supplier | Global Biomedical",
        };
    }
}

export default async function Page({ params }) {
    let slug = "";
    try {
        const resolvedParams = await params;
        slug = resolvedParams?.slug || "";
    } catch (err) {
        console.error("[ProductSlugPage] error resolving params:", err);
    }

    let product = null;
    try {
        if (slug) {
            const allProducts = await fetchFullCatalog();
            const targetSlug = (slug || "").toLowerCase().trim();
            product = allProducts.find((p) => {
                if (!p) return false;
                const prodSlug = (p.slug || "").toLowerCase().trim();
                const prodId = (p.id || "").toLowerCase().trim();
                const prodTitleSlug = (p.title || "")
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-");
                return (
                    prodSlug === targetSlug ||
                    prodId === targetSlug ||
                    prodTitleSlug === targetSlug ||
                    decodeURIComponent(targetSlug) === prodSlug
                );
            }) || null;
        }
    } catch (err) {
        console.error("[ProductSlugPage] Server fetch failed:", err);
    }

    return <ProductDetails slug={slug} product={product} />;
}