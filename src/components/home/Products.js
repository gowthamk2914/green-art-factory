"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getProductsPreviewRequest } from "../../redux/Products/actions";

gsap.registerPlugin(ScrollTrigger); // register once, at module scope

// Skeleton mirrors the real card heights/grid so the page height barely
// shifts once real data + images arrive — this is what keeps ScrollTrigger
// from having to correct a large layout jump.
const ProductSkeleton = () => (
  <div className="product-stack-item" style={{ top: "120px" }}>
    <div className="product-grid-control-wrapper">
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 product-grid-wrapper">
        <div className="h-[420px] rounded-xl bg-gray-200 animate-pulse" />
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[202px] rounded-xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Products = () => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const { loading, data: products, error } = useSelector(
    (state) => state.Products
  );

  const sortedProducts = products?.slice().sort((a, b) => a.id - b.id);

  useEffect(() => {
    dispatch(getProductsPreviewRequest());
  }, [dispatch]);

useEffect(() => {
  if (
    loading ||
    !sortedProducts?.length ||
    !containerRef.current
  ) {
    return;
  }

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.utils
        .toArray(".product-stack-item")
        .forEach((card) => {
          gsap.fromTo(
            card,
            {
              y: 120,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        });
    });
  }, containerRef);

  return () => {
    ctx.revert();
  };
}, [loading, sortedProducts?.length]);

  if (error) {
    return (
      <section className="products-section py-20">
        <div className="container text-center text-red-500">
          Failed to load products.
        </div>
      </section>
    );
  }

  return (
    <section className="products-section" ref={containerRef}>
      <div className="products-top-curve"></div>

      <div className="container products-section-wrapper">
        <h2 className="products-title">OUR PRODUCTS</h2>

        <div className="products-stack-container">
          {loading || !sortedProducts?.length
            ? // Show 2 skeleton rows while loading — keeps section height stable
              Array.from({ length: 2 }).map((_, i) => (
                <ProductSkeleton key={`skeleton-${i}`} />
              ))
            : sortedProducts.map((category, slideIndex) => {
                const featuredProduct = category.variants?.[0];
                const remainingProducts = category.variants?.slice(1);

                return (
                  <div
                    key={category.id}
                    className="product-stack-item"
                    style={{ top: "120px", zIndex: slideIndex + 1 }}
                  >
                    <div className="product-grid-control-wrapper">
                      <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 product-grid-wrapper animate-fadeUp">
                        {featuredProduct && (
                          <div className="group relative h-[420px] overflow-hidden rounded-xl transition-all duration-500">
                            <Image
                              src={featuredProduct.image}
                              alt={featuredProduct.name}
                              fill
                              priority={slideIndex === 0}
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-[#ffffffd8] px-5 py-3">
                              <span className="text-[30px] font-medium">
                                {featuredProduct.name}
                              </span>
                              {/* <Link href={featuredProduct.cta_url}> */}
                              <Link href="#">
                                <button className="rounded-full bg-white px-5 py-2 text-sm transition-all duration-300 hover:bg-[#66711E] hover:text-white hover:shadow-2xl">
                                  Explore
                                </button>
                              </Link>
                            </div>
                          </div>
                        )}

                        <div className="col-span-2 grid grid-cols-2 gap-4 product-grid-wrapper-right">
                          {remainingProducts?.map((product) => (
                            <div
                              key={product.id}
                              className="group relative h-[202px] overflow-hidden rounded-xl transition-all duration-500"
                            >
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                priority={slideIndex === 0}
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/30"></div>
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-xl bg-white/80 backdrop-blur-md px-3 py-2 transition-all duration-500 group-hover:bg-white/90">
                                <span className="text-sm font-medium">
                                  {product.name}
                                </span>
                                {/* <Link href={product.cta_url}> */}
                                <Link href="#">
                                  <button className="rounded-full bg-white px-3 py-1 text-[11px] transition-all duration-300 hover:bg-[#66711E] hover:text-white">
                                    Explore
                                  </button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="product-bottom-control bg-transparent">
                        <div className="flex justify-center">
                          <Link href={category.cta_url}>
                            <button className="products-view-all-btn group flex items-center gap-4 rounded-full bg-[#66711E] px-8 py-3 text-white transition-all duration-500 hover:scale-105 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
                              View All
                              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-500 group-hover:rotate-45">
                                <FiArrowUpRight />
                              </span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default Products;