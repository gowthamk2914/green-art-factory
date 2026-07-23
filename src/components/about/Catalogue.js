"use client";

/**
 * AnimatedCatalogue
 * ------------------
 * Renders a real PDF as an interactive, animated page-flip book (drag,
 * swipe, click-corner-to-turn) using react-pdf (pdf.js under the hood) to
 * rasterize each page onto a canvas, and react-pageflip to drive the 3D
 * turning animation. Includes prev/next controls, a page counter,
 * keyboard arrow-key navigation, a fullscreen toggle, and a real
 * "Download Catalogue" button that serves the actual PDF file.
 *
 * REQUIRED PACKAGES (not preinstalled — run this in your project):
 *   npm install react-pdf react-pageflip
 *
 * Do NOT also run `npm install pdfjs-dist` separately — react-pdf already
 * ships its own pinned pdfjs-dist internally. Installing a second, newer
 * copy at the top level is exactly what causes an "API version does not
 * match Worker version" error, since Node then has two different
 * versions to choose between. If you already ran that install, it's
 * safe to remove: `npm uninstall pdfjs-dist`.
 *
 * IMPORTANT — Next.js usage:
 * Both react-pdf and react-pageflip touch browser-only APIs (canvas,
 * window, DOMMatrix) at import time, so this component must never be
 * evaluated on the server. If the parent that renders this is a Server
 * Component, don't import it directly — use a small "use client" wrapper
 * that does:
 *
 *   import dynamic from "next/dynamic";
 *   export default dynamic(() => import("./AnimatedCatalogue"), { ssr: false });
 *
 * Drop your actual PDF file in /public (e.g. /public/catalogue.pdf) and
 * point `pdfUrl` at it. `downloadFileName` controls what the browser
 * names the file when someone clicks "Download Catalogue".
 */

import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiMaximize,
  FiMinimize,
} from "react-icons/fi";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Pin the worker to pdfjs.version — the version string read directly off
// react-pdf's own bundled pdfjs-dist instance, guaranteed to match the
// API. Resolving a *locally installed* pdfjs-dist package (via
// import.meta.url) is what caused the "API version does not match Worker
// version" error: a separately npm-installed pdfjs-dist can end up on a
// different major version than the one react-pdf ships internally, and
// Node module resolution has no way to know which one you meant. Pinning
// to pdfjs.version on a CDN URL sidesteps that entirely — it always
// matches, no matter what else is in node_modules.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// A4-ish portrait aspect ratio for page sizing. Adjust if your catalogue
// pages are a different shape (e.g. square, landscape).
const PAGE_ASPECT_RATIO = 1.414; // height / width

// Normal (non-fullscreen) and fullscreen page-width caps. Fullscreen gets
// a much larger cap so the book actually grows to fill the screen instead
// of staying pinned at its normal small size inside a big black backdrop.
const MAX_PAGE_WIDTH = 480;
const MAX_PAGE_WIDTH_FULLSCREEN = 780;

// A single catalogue page — react-pdf's <Page> renders straight onto a
// <canvas>. Wrapped in forwardRef because react-pageflip clones each
// child and needs a ref to the DOM node to animate it.
const CataloguePage = forwardRef(({ pageNumber, width }, ref) => (
  <div className="catalogue-page" ref={ref}>
    <Page
      pageNumber={pageNumber}
      width={width}
      renderAnnotationLayer={false}
      renderTextLayer={false}
      loading={<div className="catalogue-page-loading" />}
      onRenderError={(err) =>
        console.error(`Catalogue page ${pageNumber} failed to render:`, err)
      }
    />
  </div>
));
CataloguePage.displayName = "CataloguePage";

export default function AnimatedCatalogue({
  pdfUrl = "/catalogue.pdf",
  title = "Catalogue",
  downloadFileName = "catalogue.pdf",
}) {
  const containerRef = useRef(null);
  const bookRef = useRef(null);

  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Measure available width so the book scales responsively instead of
  // using a hardcoded pixel size. This also re-fires automatically when
  // entering/exiting fullscreen, since the container's actual size
  // changes with it.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (width) setContainerWidth(width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maxPageWidth = isFullscreen ? MAX_PAGE_WIDTH_FULLSCREEN : MAX_PAGE_WIDTH;

  // Two-page spread on wide screens, single page on narrow ones.
  const isSpread = containerWidth > 720;
  const pageWidth = Math.min(
    isSpread ? containerWidth / 2 - 24 : containerWidth - 24,
    maxPageWidth
  );
  const pageHeight = pageWidth * PAGE_ASPECT_RATIO;

  const pageNumbers = useMemo(
    () => Array.from({ length: numPages }, (_, i) => i + 1),
    [numPages]
  );

  const handleFlip = (e) => setCurrentPage(e.data);

  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => bookRef.current?.pageFlip()?.flipNext();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Single source of truth for fullscreen state — driven by the browser
  // event, not by the button click, so it stays correct even if the user
  // exits fullscreen via Esc instead of the button.
  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <section className="catalogue-section">
      <div className="catalogue-header">
        <h2 className="catalogue-title">{title}</h2>

        <a
          href={pdfUrl}
          download={downloadFileName}
          className="catalogue-download-btn"
        >
          <FiDownload />
          Download Catalogue
        </a>
      </div>

      <div
        className={`catalogue-viewer ${isFullscreen ? "catalogue-viewer--fullscreen" : ""}`}
        ref={containerRef}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          onLoadError={(err) => setLoadError(err?.message || "Failed to load PDF")}
          loading={<p className="catalogue-status">Loading catalogue…</p>}
          error={<p className="catalogue-status catalogue-status--error">Couldn&apos;t load the catalogue PDF.</p>}
        >
          {containerWidth > 0 && numPages > 0 && (
            <>
              <HTMLFlipBook
                ref={bookRef}
                width={pageWidth}
                height={pageHeight}
                size="stretch"
                minWidth={500}
                maxWidth={maxPageWidth}
                minHeight={311}
                maxHeight={maxPageWidth * PAGE_ASPECT_RATIO}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={handleFlip}
                className="catalogue-flipbook"
                flippingTime={700}
                maxShadowOpacity={0.5}
              >
                {pageNumbers.map((n) => (
                  <CataloguePage key={n} pageNumber={n} width={pageWidth} />
                ))}
              </HTMLFlipBook>

              <div className="catalogue-controls">
                <button
                  type="button"
                  onClick={goPrev}
                  className="catalogue-nav-btn"
                  aria-label="Previous page"
                  disabled={currentPage === 0}
                >
                  <FiChevronLeft />
                </button>

                <span className="catalogue-page-counter">
                  {currentPage + 1} / {numPages}
                </span>

                <button
                  type="button"
                  onClick={goNext}
                  className="catalogue-nav-btn"
                  aria-label="Next page"
                  disabled={currentPage >= numPages - 1}
                >
                  <FiChevronRight />
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="catalogue-nav-btn catalogue-fullscreen-btn"
                  aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
                >
                  {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                </button>
              </div>
            </>
          )}
        </Document>

        {loadError && <p className="catalogue-status catalogue-status--error">{loadError}</p>}
      </div>
    </section>
  );
}