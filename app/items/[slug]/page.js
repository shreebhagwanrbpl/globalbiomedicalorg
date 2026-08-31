import ProductDetails from "./ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { generateProductMetadata, generateProductSchema, makeSlug } from "@/lib/seo-utils";
import InternalLinkEngine from "@/app/components/InternalLinkEngine";

export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params;
        const slug = resolvedParams?.slug || "";

        const allProducts = await fetchFullCatalog();
        const targetSlug = (slug || "").toLowerCase().trim();
        const product = allProducts.find((p) => {
            if (!p) return false;
            const prodSlug = (p.slug || "").toLowerCase().trim();
            const prodId = (p.id || "").toLowerCase().trim();
            return (
                prodSlug === targetSlug ||
                prodId === targetSlug ||
                makeSlug(p.title) === targetSlug
            );
        });

        // Generate metadata canonicalized to primary product URL /products/[slug]
        const metadata = generateProductMetadata(product || { title: slug.replace(/-/g, " "), slug });
        metadata.alternates = {
            canonical: `https://globalbiomedical.org/products/${slug}`,
        };
        return metadata;
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
    let allProducts = [];
    try {
        if (slug) {
            allProducts = await fetchFullCatalog();
            const targetSlug = (slug || "").toLowerCase().trim();
            product = allProducts.find((p) => {
                if (!p) return false;
                const prodSlug = (p.slug || "").toLowerCase().trim();
                const prodId = (p.id || "").toLowerCase().trim();
                return (
                    prodSlug === targetSlug ||
                    prodId === targetSlug ||
                    makeSlug(p.title) === targetSlug
                );
            }) || null;
        }
    } catch (err) {
        console.error("[ProductSlugPage] Server fetch failed:", err);
    }

    const categories = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));
    const brands = Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean)));
    const canonicalUrl = `https://globalbiomedical.org/products/${slug}`;
    const productSchema = generateProductSchema(product, canonicalUrl);

    return (
        <>
            {productSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
                />
            )}
            <ProductDetails slug={slug} product={product} />
            <div className="container pb-5">
                <InternalLinkEngine
                    categories={categories}
                    brands={brands}
                    currentCategory={product?.category}
                    currentBrand={product?.brand}
                />
            </div>
        </>
    );
}