"use client";

import Image from "next/image";
import Link from "next/link";

// Sample data — replace with articles fetched from your API/Redux store.
// Keep this exact shape so swapping in real data later is a straight
// fetch → map, no restructuring needed:
//   { id, href, image, category, title, description, author: { name, handle, avatar }, date }
// `category` and `author.handle` are optional — leave them "" / undefined
// and the badge / handle line just won't render.
const ARTICLES = [
  {
    id: 1,
    href: "/articles/designing-spaces-that-feel-alive",
    image: "/images/blog1.jpg",
    category: "GREEN LIVING",
    title: "Designing Spaces That Feel Alive With Nature",
    description:
      "Discover how thoughtful interiors, organic textures, and natural elements create calming spaces that feel elegant, timeless, and connected to everyday living. Explore beautifully curated spaces where minimal design meets natural warmth to create environments that inspire comfort and creativity.",
    author: {
      name: "Onur Eren",
      handle: "@createonur",
      avatar: "/images/blog1-writer.png",
    },
    date: "07/05/2026",
  },
  { 
    id: 2,
    href: "/articles/designing-spaces-that-feel-alive-2",
    image: "/images/blog1.jpg",
    category: "GREEN LIVING",
    title: "Designing Spaces That Feel Alive With Nature",
    description:
      "Discover how thoughtful interiors, organic textures, and natural elements create calming spaces that feel elegant, timeless, and connected to everyday living. Explore beautifully curated spaces where minimal design meets natural warmth to create environments that inspire comfort and creativity.",
    author: {
      name: "Onur Eren",
      handle: "@createonur",
      avatar: "/images/blog1-writer.png",
    },
    date: "07/05/2026",
  },
  {
    id: 3,
    href: "/articles/glide-certified-winners",
    image: "/images/blog2.jpg",
    category: "GREEN LIVING",
    title: "Meet your Glide Certified community winners",
    description:
      "Discover how thoughtful interiors, organic textures, and natural elements create calming spaces that feel elegant, timeless, and connected to everyday living.",
    author: {
      name: "Andy Claremont",
      handle: "",
      avatar: "/images/blog2-writer.png",
    },
    date: "07/05/2026",
  },
  {
    id: 4,
    href: "/articles/glide-certified-winners-recap",
    image: "/images/blog2.jpg",
    category: "GREEN LIVING",
    title: "Meet your Glide Certified community winners",
    description:
      "Discover how thoughtful interiors, organic textures, and natural elements create calming spaces that feel elegant.",
    author: {
      name: "Andy Claremont",
      handle: "",
      avatar: "/images/blog2-writer.png",
    },
    date: "07/05/2026",
  },
];

/**
 * Layout mapping (mirrors the design):
 *   - articles[0], articles[1] -> left column, large horizontal cards
 *   - articles[2]              -> right column, featured card (image on top)
 *   - articles[3]              -> right column, compact card (small thumbnail)
 *
 * When this is wired up to the API/Redux, just make sure the fetched list
 * is ordered the same way (or reorder/slice it before passing as the
 * `articles` prop) — the component itself stays dumb/presentational.
 */
export default function LatestArticles({ articles = ARTICLES, isLoading = false }) {
  const [primary, secondary, featured, compact] = articles;
  const leftArticles = [primary, secondary].filter(Boolean);

  return (
    <section className="latest-section">
      <div className="container">
        <h2 className="latest-heading">
          Latest <span className="latest-heading-accent">Articles</span>
        </h2>

        {isLoading ? (
          <p className="latest-empty">Loading articles…</p>
        ) : !articles || articles.length === 0 ? (
          <p className="latest-empty">No articles yet.</p>
        ) : (
          <div className="latest-grid">
            <div className="latest-col latest-col-primary">
              {leftArticles.map((article) => (
                <ArticleCardHorizontal key={article.id} article={article} />
              ))}
            </div>

            <div className="latest-col latest-col-secondary">
              {featured && <ArticleCardFeatured article={featured} />}
              {compact && <ArticleCardCompact article={compact} />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleCardHorizontal({ article }) {
  const { href, image, category, title, description } = article;
  return (
    <Link href={href} className="article-card article-card-horizontal">
      <div className="article-card-image-wrap article-card-image-wrap-horizontal">
        <Image src={image} alt={title} fill className="article-card-image" />
      </div>
      <div className="article-card-body">
        <div className="article-card-body-top">
          {category && <span className="article-card-badge">{category}</span>}
          <h3 className="article-card-title">{title}</h3>
          <p className="article-card-desc">{description}</p>
        </div>
        <ArticleCardFooter article={article} spread />
      </div>
    </Link>
  );
}

function ArticleCardFeatured({ article }) {
  const { href, image, category, title, description } = article;
  return (
    <Link href={href} className="article-card article-card-featured">
      <div className="article-card-image-wrap article-card-image-wrap-featured">
        <Image src={image} alt={title} fill className="article-card-image" />
      </div>
      <div className="article-card-body">
        <span
          className={`article-card-badge ${!category ? "article-card-badge-empty" : ""}`}
        >
          {category}
        </span>
        <h3 className="article-card-title article-card-title-lg">{title}</h3>
        <p className="article-card-desc">{description}</p>
        <ArticleCardFooter article={article} />
      </div>
    </Link>
  );
}

function ArticleCardCompact({ article }) {
  const { href, image, category, title, description } = article;
  return (
    <Link href={href} className="article-card article-card-compact">
      <div className="article-card-image-wrap article-card-image-wrap-compact">
        <Image src={image} alt={title} fill className="article-card-image" />
      </div>
      <div className="article-card-body">
        <span
          className={`article-card-badge ${!category ? "article-card-badge-empty" : ""}`}
        >
          {category}
        </span>
        <h3 className="article-card-title article-card-title-sm">{title}</h3>
        <p className="article-card-desc article-card-desc-sm">{description}</p>
        <ArticleCardFooter article={article} />
      </div>
    </Link>
  );
}

// `spread`: avatar+name/handle on the left, date pinned right (horizontal cards).
// default: avatar, name, and date all sit inline together (featured/compact cards).
function ArticleCardFooter({ article, spread = false }) {
  const { author, date } = article;

  return (
    <div className={`article-card-footer ${spread ? "article-card-footer-spread" : ""}`}>
      <div className="article-card-author">
        {author?.avatar && (
          <span className="article-card-avatar-wrap">
            <Image src={author.avatar} alt={author?.name || ""} fill className="article-card-avatar" />
          </span>
        )}
        <div
          className={`article-card-author-info ${
            spread ? "article-card-author-info-stacked" : "article-card-author-info-inline"
          }`}
        >
          <span className="article-card-author-name">{author?.name}</span>
          {spread ? (
            author?.handle && <span className="article-card-author-handle">{author.handle}</span>
          ) : (
            <span className="article-card-date">{date}</span>
          )}
        </div>
      </div>
      {spread && <span className="article-card-date">{date}</span>}
    </div>
  );
}