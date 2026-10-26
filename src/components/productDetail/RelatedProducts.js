
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";

function RelatedCard({ item, relatedProductsData }) {
  const relatedProduct = relatedProductsData?.[item?.slug];

  const firstVariantImage =
    relatedProduct?.variants?.[0]?.images?.[0];

  const productImage =
    (typeof firstVariantImage === "string" &&
    firstVariantImage.trim()
      ? firstVariantImage
      : null) ||
    item?.cover_image ||
    FALLBACK_IMAGE;


  return (
    <Link
      href={item?.cta_url || "#"}
      className="relatedProductsCard"
    >
      <div className="relatedProductsImageFrame">
        <Image
          src={productImage}
          alt={item?.name || "Related product"}
          fill
          sizes="(max-width: 640px) 70vw, 280px"
          className="relatedProductsImage"
        />

        <div className="relatedProductsOverlay" />

        <div className="relatedProductsCaption">
          <span className="relatedProductsLabel">
            Collection
          </span>

          <h3 className="relatedProductsName">
            {item?.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default function RelatedProducts({
  items = [],
  relatedProductsData = {},
}) {
  const scrollerRef = useRef(null);
  const animationRef = useRef(null);

  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const element = scrollerRef.current;

      if (!element) return;

      setIsOverflowing(
        element.scrollWidth > element.clientWidth + 1
      );
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [items, relatedProductsData]);

  useEffect(() => {
    const element = scrollerRef.current;

    if (!element || !isOverflowing) {
      return;
    }

    let lastTime = performance.now();
    const speed = 35;

    const animate = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      element.scrollLeft += (speed * delta) / 1000;

      if (
        element.scrollLeft + element.clientWidth >=
        element.scrollWidth - 1
      ) {
        element.scrollLeft = 0;
      }

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOverflowing]);

  if (!items?.length) {
    return null;
  }

  return (
    <section
      className="relatedProductsSection"
      aria-label="Related products"
    >
      <div className="relatedProductsInner">
        <h2 className="relatedProductsTitle">
          Related{" "}
          <span className="relatedProductsTitleAccent">
            Products
          </span>
        </h2>

        <div
          ref={scrollerRef}
          className="relatedProductsScroller"
        >
          {items.map((item, index) => (
            <RelatedCard
              key={item?.id ?? item?.slug ?? index}
              item={item}
              relatedProductsData={relatedProductsData}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
