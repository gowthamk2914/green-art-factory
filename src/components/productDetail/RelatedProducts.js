
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FALLBACK_IMAGE = "/images/product-detail-common-img.png";

function RelatedCard({ item }) {
  return (
    <Link
      href={item?.cta_url || "#"}
      className="relatedProductsCard"
    >
      <div className="relatedProductsImageFrame">
        <Image
          src={item?.cover_image || FALLBACK_IMAGE}
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

export default function RelatedProducts({ items = [] }) {
  const scrollerRef = useRef(null);
  const animationRef = useRef(null);

  const [isOverflowing, setIsOverflowing] = useState(false);

  if (!items?.length) {
    return null;
  }

  // Check whether products actually overflow the screen
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
  }, [items]);

  // Continuous automatic sliding
  useEffect(() => {
    const element = scrollerRef.current;

    if (!element || !isOverflowing) {
      return;
    }

    let lastTime = performance.now();

    // Pixels per second
    const speed = 35;

    const animate = (currentTime) => {
      const delta = currentTime - lastTime;

      lastTime = currentTime;

      element.scrollLeft += (speed * delta) / 1000;

      // Restart from beginning when reaching the end
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}

