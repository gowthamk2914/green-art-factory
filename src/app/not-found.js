"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* Every real top-level page of the site. Used only for the
   "Did you mean...?" suggestion. Add new pages here later. */
const KNOWN_ROUTES = [
  "/about",
  "/contact",
  "/careers",
  "/blogs",
  "/portfolio",
  "/products-list",
  "/services",
  "/terms-and-privacy",
];

// Number of single-character edits between two strings
function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// "/careerss/apply" -> compares "/careerss" -> suggests "/careers"
function findClosest(pathname) {
  const first = "/" + (pathname.split("/").filter(Boolean)[0] || "");
  const typed = first.toLowerCase();

  let best = null;
  let bestScore = Infinity;

  for (const route of KNOWN_ROUTES) {
    const score = distance(typed, route);
    if (score < bestScore) {
      bestScore = score;
      best = route;
    }
  }

  // Only suggest when it is really close (1–2 typos)
  return bestScore <= 2 ? best : null;
}

export default function NotFound() {
  const pathname = usePathname() || "/";
  const suggestion = findClosest(pathname);

  return (
    <section className="gaf-404-section">
      <div className="gaf-404-glow gaf-404-glow--one" aria-hidden="true" />
      <div className="gaf-404-glow gaf-404-glow--two" aria-hidden="true" />

      <div className="gaf-404-card">
        <span className="gaf-404-badge">Error 404</span>

        <div className="gaf-404-number" aria-hidden="true">
          4
          <span className="gaf-404-leaf">
            <svg width="1em" height="1em" viewBox="0 0 64 64" fill="none">
              <path
                d="M52 10C28 10 12 24 12 44c0 4 1 7 3 10 3-14 12-24 26-30-10 7-17 16-20 29 3 1 5 1 8 1 20 0 31-16 31-44Z"
                fill="currentColor"
              />
            </svg>
          </span>
          4
        </div>

        <h1 className="gaf-404-title">
          This page has <span className="gaf-404-accent">gone green</span>
        </h1>

        <p className="gaf-404-text">
          The page you’re looking for may have been moved, renamed or never
          existed. Let’s get you back to something beautiful.
        </p>

        {suggestion && (
          <p className="gaf-404-suggest">
            Did you mean{" "}
            <Link href={suggestion} className="gaf-404-suggest-link">
              {suggestion}
            </Link>
            ?
          </p>
        )}

        <div className="gaf-404-actions">
          <Link href="/" className="gaf-404-btn gaf-404-btn--primary">
            Back to Home
          </Link>
          <Link href="/contact" className="gaf-404-btn gaf-404-btn--ghost">
            Contact Us
          </Link>
        </div>

        <div className="gaf-404-links">
          <span>Or visit:</span>
          <Link href="/about">About Us</Link>
          <Link href="/blogs">Blogs</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </section>
  );
}