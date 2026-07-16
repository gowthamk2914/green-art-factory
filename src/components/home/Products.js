"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const slides = [
  {
    id: 1,
    viewAllLink: "/products/moss-designs",
    viewAllText: "View All",
    items: [
      {
        title: "Moss Walls",
        image: "/images/moss1.jpg",
        buttonText: "Explore Moss Walls",
        link: "/products/moss-walls",
        large: true,
      },
      {
        title: "Moss Logos",
        image: "/images/moss2.jpg",
        buttonText: "Explore Moss Logos",
        link: "/products/moss-logos",
      },
      {
        title: "Moss Frames",
        image: "/images/moss3.jpg",
        buttonText: "Explore Moss Frames",
        link: "/products/moss-frames",
      },
      {
        title: "Moss Panels",
        image: "/images/moss4.jpg",
        buttonText: "Explore Moss Panels",
        link: "/products/moss-panels",
      },
      {
        title: "Moss Art",
        image: "/images/moss5.jpg",
        buttonText: "Explore Moss Art",
        link: "/products/moss-art",
      },
    ],
  },

  {
    id: 2,
    viewAllLink: "/products/bespoke-designs",
    viewAllText: "View All",
    items: [
      {
        title: "Olive Tree",
        image: "/images/bespoke1.jpg",
        buttonText: "Explore Olive Tree",
        link: "/products/olive-tree",
        large: true,
      },
      {
        title: "Ficus Tree",
        image: "/images/bespoke2.jpg",
        buttonText: "Explore Ficus Tree",
        link: "/products/ficus-tree",
      },
      {
        title: "Cherry Blossom Tree",
        image: "/images/bespoke3.jpg",
        buttonText: "Explore Cherry Blossom Tree",
        link: "/products/cherry-blossom-tree",
      },
      {
        title: "Palm Tree",
        image: "/images/bespoke4.jpg",
        buttonText: "Explore Palm Tree",
        link: "/products/palm-tree",
      },
      {
        title: "Custom Tree",
        image: "/images/bespoke5.jpg",
        buttonText: "Explore Custom Tree",
        link: "/products/custom-tree",
      },
    ],
  },

  {
    id: 3,
    viewAllLink: "/products/green-walls",
    viewAllText: "View All",
    items: [
      {
        title: "Artificial Green Wall",
        image: "/images/green-wall1.jpg",
        buttonText: "Explore Artificial Green Wall",
        link: "/products/artificial-green-wall",
        large: true,
      },
      {
        title: "Natural Green Wall",
        image: "/images/green-wall2.jpg",
        buttonText: "Explore Natural Green Wall",
        link: "/products/natural-green-wall",
      },
      {
        title: "Indoor Green Wall",
        image: "/images/green-wall3.jpg",
        buttonText: "Explore Indoor Green Wall",
        link: "/products/indoor-green-wall",
      },
      {
        title: "Outdoor Green Wall",
        image: "/images/green-wall4.jpg",
        buttonText: "Explore Outdoor Green Wall",
        link: "/products/outdoor-green-wall",
      },
      {
        title: "Custom Green Wall",
        image: "/images/green-wall5.jpg",
        buttonText: "Explore Custom Green Wall",
        link: "/products/custom-green-wall",
      },
    ],
  },

{
  id: 4,
  viewAllLink: "/products/biophilic-design-or-indoor-landscape",
  viewAllText: "View All",
  items: [
    {
      title: "Bespoke Plants & Varieties of Pots",
      image: "/images/biophilic-1.jpg",
      buttonText: "Explore Bespoke Plants & Pots",
      link: "/products/bespoke-plants-varieties-of-pots",
      large: true,
    },
    {
      title: "Partition Planters",
      image: "/images/biophilic-2.jpg",
      buttonText: "Explore Partition Planters",
      link: "/products/partition-planters",
    },
    {
      title: "Living Plants",
      image: "/images/biophilic-3.jpg",
      buttonText: "Explore Living Plants",
      link: "/products/living-plants",
    },
    {
      title: "Artificial Topiary",
      image: "/images/biophilic-4.jpg",
      buttonText: "Explore Artificial Topiary",
      link: "/products/artificial-topiary",
    },
    {
      title: "Plants on Ceiling & Hanging Plants",
      image: "/images/biophilic-5.jpg",
      buttonText: "Explore Ceiling & Hanging Plants",
      link: "/products/plants-on-ceiling-hanging-plants",
    },
  ],
},

{
  id: 5,
  viewAllLink: "/products/garden-pot-planters",
  viewAllText: "View All",
  items: [
    {
      title: "FRP Planters",
      image: "/images/planter-1.jpg",
      buttonText: "Explore FRP Planters",
      link: "/products/frp-planters",
      large: true,
    },
    {
      title: "Metal Planters",
      image: "/images/planter-2.jpg",
      buttonText: "Explore Metal Planters",
      link: "/products/metal-planters",
    },
    {
      title: "Concrete Planters",
      image: "/images/planter-3.jpg",
      buttonText: "Explore Concrete Planters",
      link: "/products/concrete-planters",
    },
    {
      title: "Wooden Planters",
      image: "/images/planter-4.jpg",
      buttonText: "Explore Wooden Planters",
      link: "/products/wooden-planters",
    },
    {
      title: "Designer Planters",
      image: "/images/planter-5.jpg",
      buttonText: "Explore Designer Planters",
      link: "/products/designer-planters",
    },
  ],
},

{
  id: 6,
  viewAllLink: "/products/living-plants",
  viewAllText: "View All",
  items: [
    {
      title: "Indoor Foliage Plants",
      image: "/images/living-1.jpg",
      buttonText: "Explore Indoor Foliage Plants",
      link: "/products/indoor-foliage-plants",
      large: true,
    },
    {
      title: "Flowering Plants",
      image: "/images/living-2.jpg",
      buttonText: "Explore Flowering Plants",
      link: "/products/flowering-plants",
    },
    {
      title: "Air Purifying Plants",
      image: "/images/living-3.jpg",
      buttonText: "Explore Air Purifying Plants",
      link: "/products/air-purifying-plants",
    },
    {
      title: "Office Plants",
      image: "/images/living-4.jpg",
      buttonText: "Explore Office Plants",
      link: "/products/office-plants",
    },
    {
      title: "Landscape Plants",
      image: "/images/living-5.jpg",
      buttonText: "Explore Landscape Plants",
      link: "/products/landscape-plants",
    },
  ],
},

   {
  id: 7,
  viewAllLink: "/products/water-features",
  viewAllText: "View All",
  items: [
    {
      title: "Water Fountains",
      image: "/images/water-1.jpg",
      buttonText: "Explore Water Fountains",
      link: "/products/water-fountains",
      large: true,
    },
    {
      title: "Water Curtains",
      image: "/images/water-2.jpg",
      buttonText: "Explore Water Curtains",
      link: "/products/water-curtains",
    },
    {
      title: "Water Walls",
      image: "/images/water-3.jpg",
      buttonText: "Explore Water Walls",
      link: "/products/water-walls",
    },
    {
      title: "Pond Features",
      image: "/images/water-4.jpg",
      buttonText: "Explore Pond Features",
      link: "/products/pond-features",
    },
    {
      title: "Cascade Water Features",
      image: "/images/water-5.jpg",
      buttonText: "Explore Cascade Water Features",
      link: "/products/cascade-water-features",
    },
  ],
},

   {
  id: 8,
  viewAllLink: "/products/bark-panels",
  viewAllText: "View All",
  items: [
    {
      title: "Natural Bark Panels",
      image: "/images/bark-1.jpg",
      buttonText: "Explore Natural Bark Panels",
      link: "/products/natural-bark-panels",
      large: true,
    },
    {
      title: "Decorative Bark Panels",
      image: "/images/bark-2.jpg",
      buttonText: "Explore Decorative Bark Panels",
      link: "/products/decorative-bark-panels",
    },
    {
      title: "Interior Bark Cladding",
      image: "/images/bark-3.jpg",
      buttonText: "Explore Interior Bark Cladding",
      link: "/products/interior-bark-cladding",
    },
    {
      title: "Feature Wall Bark Panels",
      image: "/images/bark-4.jpg",
      buttonText: "Explore Feature Wall Bark Panels",
      link: "/products/feature-wall-bark-panels",
    },
    {
      title: "Custom Bark Installations",
      image: "/images/bark-5.jpg",
      buttonText: "Explore Custom Bark Installations",
      link: "/products/custom-bark-installations",
    },
  ],
},
];

const Products = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".product-stack-item").forEach((card) => {
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
            end: "top 20%",
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <section className="products-section">
      <div className="products-top-curve"></div>

      <div className="container products-section-wrapper">
        <h2 className="products-title">OUR PRODUCTS</h2>

        <div className="products-stack-container">
          {slides.map((item, slideIndex) => (
            <div
              key={item.id}
              className="product-stack-item"
              style={{
                top: `120px`,
                zIndex: slideIndex + 1,
              }}
            > 
              <div className="product-grid-control-wrapper">
                <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 product-grid-wrapper animate-fadeUp">

                  {/* Left Big Card */}
                  <div className="group relative h-[420px] overflow-hidden rounded-xl transition-all duration-500">
                    <Image
                      src={item.items[0].image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"></div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-[#ffffffd8] px-5 py-3">
                      <span className="text-[30px] font-medium">
                        {item.items[0].title}
                      </span>

                      <Link href={item.items[0].link}>
                        <button className="rounded-full bg-white px-5 py-2 text-sm transition-all duration-300 hover:bg-[#66711E] hover:text-white hover:shadow-2xl">
                          {item.items[0].buttonText}
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Grid */}
                  <div className="col-span-2 grid grid-cols-2 gap-4 product-grid-wrapper-right">
                    {item.items.slice(1).map((product, index) => (
                      <div
                        key={index}
                        className="group relative h-[202px] overflow-hidden rounded-xl transition-all duration-500"
                      >
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/30"></div>

                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-xl bg-white/80 backdrop-blur-md px-3 py-2 transition-all duration-500 group-hover:bg-white/90">
                          <span className="text-sm font-medium">
                            {product.title}
                          </span>

                          <Link href={product.link}>
                            <button className="rounded-full bg-white px-3 py-1 text-[11px] transition-all duration-300 hover:bg-[#66711E] hover:text-white">
                              {product.buttonText}
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="product-bottom-control bg-transparent">
                  <div className="flex justify-center">
                    <Link href={item.viewAllLink}>
                      <button className="products-view-all-btn group flex items-center gap-4 rounded-full bg-[#66711E] px-8 py-3 text-white transition-all duration-500 hover:scale-105 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
                        {item.viewAllText}

                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-500 group-hover:rotate-45">
                          <FiArrowUpRight />
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;