
"use client";

import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";

function buildCtas(item, reversed) {
  const gallery = item?.gallery_url
    ? {
        label: "View Gallery",
        href: item.gallery_url,
        variant: "dark",
      }
    : null;

  const project = item?.project_url
    ? {
        label: "View Project",
        href: item.project_url,
        variant: reversed ? "outline" : "solid",
      }
    : null;

  return reversed
    ? [project, gallery].filter(Boolean)
    : [gallery, project].filter(Boolean);
}

const CTA_VARIANT_CLASS = {
  dark: "productDetailCtaDark",
  solid: "productDetailCtaSolid",
  outline: "productDetailCtaOutline",
};

function CtaButton({ cta }) {
  return (
    <Link
      href={cta.href}
      className={`productDetailCta ${CTA_VARIANT_CLASS[cta.variant]}`}
    >
      {cta.label}
    </Link>
  );
}

function ProductRow({ item, reversed }) {
  const ctas = buildCtas(item, reversed);

  return (
    <article
      className={`productDetailRow ${
        reversed ? "productDetailRowReversed" : ""
      }`}
    >
      <div className="productDetailMediaCol">
        <div className="productDetailImageFrame">
          <Image
            src={item?.image || FALLBACK_IMAGE}
            alt={item?.name || "Product"}
            fill
            sizes="(max-width: 860px) 100vw, 55vw"
            className="productDetailImage"
            priority={item?.display_no === "01"}
          />
        </div>

        {item?.spec && (
          <div className="productDetailBadge">
            <span className="productDetailBadgeLabel">
              {item.spec.label}
            </span>

            <p className="productDetailBadgeTitle">
              {item.spec.value}
            </p>

            {item.spec.tags?.length > 0 && (
              <ul className="productDetailBadgeTags">
                {item.spec.tags.map((tag, index) => (
                  <li key={`${tag}-${index}`}>{tag}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="productDetailTextCol">
        <div
          className={`productDetailTextPanel ${
            reversed
              ? "productDetailPanelAlt"
              : "productDetailPanelBase"
          }`}
        >
          <h3 className="productDetailHeading">
            {reversed ? (
              <>
                {item?.name}
                <span className="productDetailIndex">
                  {item?.display_no}
                </span>
              </>
            ) : (
              <>
                <span className="productDetailIndex">
                  {item?.display_no}
                </span>
                {item?.name}
              </>
            )}
          </h3>

          <p className="productDetailDescription">
            {item?.description}
          </p>

          {ctas.length > 0 && (
            <div className="productDetailCtaRow">
              {ctas.map((cta) => (
                <CtaButton
                  key={`${cta.label}-${cta.href}`}
                  cta={cta}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProductShowcase({ variants = [] }) {
  if (!variants?.length) {
    return null;
  }

  return (
    <section
      className="productDetailSection"
      aria-label="Product range"
    >
      <div className="productDetailInner">
        {variants.map((item, index) => (
          <ProductRow
            key={item?.id ?? item?.slug ?? index}
            item={item}
            reversed={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

