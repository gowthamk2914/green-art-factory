"use client";

import Image from "next/image";
import Link from "next/link";

// Sample data — replace with articles fetched from your API.
// `imageWidth`/`imageHeight` are the image's *natural* dimensions (most
// APIs/CMSs return these alongside the asset, e.g. Sanity/Contentful image
// metadata). The card uses them to size each image at its own aspect
// ratio instead of forcing every card to a fixed height — which is why
// column 2 and 4 render taller than 1 and 3 here, purely driven by data,
// not by index/position. If your API doesn't return dimensions, just omit
// them and the card falls back to a sensible default ratio.
const ARTICLES = [
  {
    id: 1,
    href: "/articles/greenhouse-walkway",
    image: "/images/related-blog-1.jpg",
    imageWidth: 4,
    imageHeight: 3,
    date: "May 20, 2025",
    title: "Indoor Living Plants",
    description:
      "Indoor Living Plants Bring Natural Beauty, Fresh Air, And A Calming Atmosphere To Any Interior Space, Creating Healthier And More Inviting Environments.",
  },
  {
    id: 2,
    href: "/articles/dracaena-corner",
    image: "/images/related-blog-2.jpg",
    imageWidth: 3,
    imageHeight: 4,
    date: "May 20, 2025",
    title: "Indoor Living Plants",
    description:
      "Indoor Living Plants Bring Natural Beauty, Fresh Air, And A Calming Atmosphere To Any Interior Space, Creating Healthier And More Inviting Environments.",
  },
  {
    id: 3,
    href: "/articles/moss-wall-lounge",
    image: "/images/related-blog-3.jpg",
    imageWidth: 4,
    imageHeight: 3,
    date: "May 20, 2025",
    title: "Indoor Living Plants",
    description:
      "Indoor Living Plants Bring Natural Beauty, Fresh Air, And A Calming Atmosphere To Any Interior Space, Creating Healthier And More Inviting Environments.",
  },
  {
    id: 4,
    href: "/articles/moss-world-map-install",
    image: "/images/related-blog-4.jpeg",
    imageWidth: 3,
    imageHeight: 4,
    date: "May 20, 2025",
    title: "Indoor Living Plants",
    description:
      "Indoor Living Plants Bring Natural Beauty, Fresh Air, And A Calming Atmosphere To Any Interior Space, Creating Healthier And More Inviting Environments.",
  },
];

const DEFAULT_ASPECT_RATIO = "4 / 3";

export default function RelatedArticles({ articles = ARTICLES }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="related-articles-section">
      <div className="related-articles-container">
        <h3 className="related-articles-heading">Recommended Articles</h3>
        <div className="related-articles-grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }) {
  const { href, image, imageWidth, imageHeight, date, title, description } = article;

  const aspectRatio =
    imageWidth && imageHeight ? `${imageWidth} / ${imageHeight}` : DEFAULT_ASPECT_RATIO;

  return (
    <Link href={href} className="related-article-card">
      <div className="related-article-image-wrap" style={{ aspectRatio }}>
        <Image src={image} alt={title} fill className="related-article-image" />
      </div>

      {date && <p className="related-article-date">{date}</p>}
      <h3 className="related-article-title">{title}</h3>
      <p className="related-article-desc">{description}</p>
    </Link>
  );
}