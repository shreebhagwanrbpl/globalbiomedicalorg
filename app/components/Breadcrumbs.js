import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/seo-utils";

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  const breadcrumbSchema = generateBreadcrumbSchema(items);

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      <nav aria-label="breadcrumb" className="my-3 text-sm text-muted">
        <ol className="d-flex flex-wrap align-items-center gap-2 list-unstyled m-0 p-0 fs-7">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="d-flex align-items-center gap-2">
                {index > 0 && <span className="text-secondary">/</span>}
                {isLast ? (
                  <span className="text-dark fw-semibold" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-decoration-none text-muted hover-red"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
