"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

// Sample data — replace with items from your API. Keep this shape:
//   { id, title, description, href, image, thumbnails: [4 image URLs] }
// Layout alternates automatically based on array position (see
// `imageFirst` below) — the API/CMS doesn't need to know which side of
// the row anything renders on, just send the items in display order.
// `thumbnails` is expected to always be exactly 4 entries.
// Titles below are taken from the real product-category API response
// (ordered by that response's `id` field: 1 -> 8). Everything else here
// (description, image, thumbnails, href) is still placeholder sample data
// — this is NOT wired to the API yet, only the titles were swapped in.
const ITEMS = [
  {
    id: "moss-creations",
    title: "Moss Creations",
    description:
      "Create captivating interiors with our bespoke Moss Creations, thoughtfully designed to introduce the beauty of nature into modern spaces without the need for ongoing maintenance. From elegant moss walls and artistic feature installations to custom branding elements and decorative panels, every creation is handcrafted using premium preserved moss to deliver exceptional texture, visual depth, and timeless appeal. Ideal for offices, hotels, restaurants, retail environments, and luxury residences, our moss designs enhance interiors with sustainable beauty while creating calming, inspiring, and memorable experiences.",
    href: "/services/moss-creations",
    image: "/images/moss1.jpg",
    thumbnails: [
      "/images/moss2.jpg",
      "/images/moss3.jpg",
      "/images/moss4.jpg",
      "/images/moss5.jpg",
    ],
  },

  {
    id: "bespoke-artificial-trees",
    title: "Bespoke Artificial Trees",
    description:
      "Bring elegance and sophistication to any environment with our custom-designed Bespoke Artificial Trees. Crafted using premium-quality materials and highly realistic foliage, our trees replicate the beauty of natural greenery while eliminating the need for watering, pruning, or maintenance. Perfect for hotels, commercial spaces, shopping malls, restaurants, corporate offices, and luxury residences, each tree is tailored to complement your interior design and architectural vision while delivering year-round greenery that never fades.",
    href: "/services/bespoke-artificial-trees",
    image: "/images/bespoke1.jpg",
    thumbnails: [
      "/images/bespoke2.jpg",
      "/images/bespoke3.jpg",
      "/images/bespoke4.jpg",
      "/images/bespoke5.jpg",
    ],
  },

  {
    id: "green-walls",
    title: "Green Walls",
    description:
      "Transform ordinary walls into extraordinary living masterpieces with our innovative Green Wall solutions. Combining preserved moss, artificial foliage, and premium botanical elements, our installations create vibrant vertical landscapes that enhance aesthetics, improve ambiance, and strengthen the connection between people and nature. Whether for offices, hospitality venues, retail stores, healthcare facilities, or residential interiors, our green walls provide a striking visual impact with minimal maintenance and lasting beauty.",
    href: "/services/green-walls",
    image: "/images/green-wall1.jpg",
    thumbnails: [
      "/images/green-wall2.jpg",
      "/images/green-wall3.jpg",
      "/images/green-wall4.jpg",
      "/images/green-wall5.jpg",
    ],
  },

  {
    id: "biophilic-designs-indoor-landscapes",
    title: "Biophilic Designs & Indoor Landscapes",
    description:
      "Experience the transformative power of nature through our Biophilic Design and Indoor Landscape solutions. We thoughtfully integrate greenery, natural textures, lighting, water features, and architectural elements to create healthier, more productive, and visually inspiring environments. Every design is tailored to your space, whether it's a corporate office, hotel, restaurant, educational institution, healthcare facility, or luxury residence, delivering timeless elegance while promoting wellbeing and a stronger connection with nature.",
    href: "/services/biophilic-designs-indoor-landscapes",
    image: "/images/biophilic-1.jpg",
    thumbnails: [
      "/images/biophilic-2.jpg",
      "/images/biophilic-3.jpg",
      "/images/biophilic-4.jpg",
      "/images/biophilic-5.jpg",
    ],
  },

  {
    id: "garden-pot-planters",
    title: "Garden Pot Planters",
    description:
      "Elevate your indoor and outdoor spaces with our premium collection of Garden Pot Planters, available in a wide variety of styles, materials, finishes, and sizes. Designed to complement both modern and traditional landscapes, our planters provide the perfect foundation for natural plants, artificial greenery, and decorative arrangements. Ideal for homes, hotels, restaurants, offices, commercial buildings, and outdoor gardens, they combine durability, elegance, and functionality to create visually appealing green environments.",
    href: "/services/garden-pot-planters",
    image: "/images/planter-1.jpg",
    thumbnails: [
      "/images/planter-2.jpg",
      "/images/planter-3.jpg",
      "/images/planter-4.jpg",
      "/images/planter-5.jpg",
    ],
  },

  {
    id: "living-plants",
    title: "Living Plants",
    description:
      "Bring freshness, vitality, and natural beauty into your surroundings with our carefully curated Living Plant solutions. We provide expert consultation, plant selection, installation, and maintenance services tailored to suit residential, commercial, hospitality, and corporate environments. From elegant indoor plants and statement trees to lush office greenery, every installation is designed to improve air quality, promote wellbeing, and create healthier, more vibrant spaces that leave a lasting impression.",
    href: "/services/living-plants",
    image: "/images/living-1.jpg",
    thumbnails: [
      "/images/living-2.jpg",
      "/images/living-3.jpg",
      "/images/living-4.jpg",
      "/images/living-5.jpg",
    ],
  },

  {
    id: "water-features",
    title: "Water Features",
    description:
      "Enhance your environment with beautifully crafted Water Features that combine movement, sound, and elegance to create calming, luxurious spaces. Our custom-designed fountains, cascading waterfalls, reflective pools, and decorative water installations are tailored for residential landscapes, hotels, resorts, offices, restaurants, and commercial developments. Every feature is designed to complement its surroundings while delivering a peaceful atmosphere and an unforgettable visual centerpiece.",
    href: "/services/water-features",
    image: "/images/water-1.jpg",
    thumbnails: [
      "/images/water-2.jpg",
      "/images/water-3.jpg",
      "/images/water-4.jpg",
      "/images/water-5.jpg",
    ],
  },

  {
    id: "bark-panels",
    title: "Bark Panels",
    description:
      "Introduce authentic natural texture and warmth into your interiors with our handcrafted Bark Panel installations. Carefully designed using premium bark materials, these decorative panels create distinctive feature walls that blend organic beauty with contemporary design. Perfect for hotels, restaurants, offices, retail stores, and luxury homes, our bark panels offer a sophisticated aesthetic that celebrates the timeless appeal of nature while adding depth, character, and visual interest to every space.",
    href: "/services/bark-panels",
    image: "/images/bark-1.jpg",
    thumbnails: [
      "/images/bark-2.jpg",
      "/images/bark-3.jpg",
      "/images/bark-4.jpg",
      "/images/bark-5.jpg",
    ],
  },
];

export default function GreenShowcase({ items = ITEMS }) {
  return (
    <section className="showcase-section">
      <div className="container">
      <div className="showcase-wrapper">
        {items.map((item, i) => {
          // even index -> image on the left, text on the right
          // odd index  -> text on the left, image on the right
          const imageFirst = i % 2 === 0;

          return (
            <div className="showcase-row" key={item.id}>
              {imageFirst ? (
                <>
                  <ShowcaseMedia item={item} />
                  <ShowcaseText item={item} />
                </>
              ) : (
                <>
                  <ShowcaseText item={item} />
                  <ShowcaseMedia item={item} />
                </>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}

function ShowcaseMedia({ item }) {
  return (
    <div className="showcase-media">
      <div className="showcase-media-hero">
        <Image src={item.image} alt={item.title} fill className="showcase-media-image" />
      </div>

      {item.thumbnails?.length > 0 && (
        <div className="showcase-thumbs">
          {item.thumbnails.slice(0, 4).map((thumb, i) => (
            <div className="showcase-thumb" key={i}>
              <Image src={thumb} alt="" fill className="showcase-thumb-image" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShowcaseText({ item }) {
  return (
    <div className="showcase-text">
      <h3 className="showcase-title">{item.title}</h3>
      <p className="showcase-desc">{item.description}</p>
      <Link href={item.href} className="showcase-btn">
        <span className="showcase-btn-label">View Now</span>
        <span className="showcase-btn-icon">
          <FiArrowUpRight />
        </span>
      </Link>
    </div>
  );
}