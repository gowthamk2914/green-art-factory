"use client";


import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiMaximize,
  FiMinimize,
  FiLayers,
  FiRefreshCw,
  FiBookOpen,
} from "react-icons/fi";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";


pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const PAGE_ASPECT_RATIO = 1.414; // height / width


const MAX_PAGE_WIDTH = 480;
const MAX_PAGE_WIDTH_FULLSCREEN = 780;


const DEFAULT_FEATURES = [
  { icon: FiLayers, label: "Comprehensive Guide", detail: "Full range, every finish" },
  { icon: FiRefreshCw, label: "Updated Quarterly", detail: "New releases as they ship" },
  { icon: FiBookOpen, label: "Spec Sheets Included", detail: "Dimensions, materials, care" },
  { icon: FiDownload, label: "Print-Ready PDF", detail: "Same file, offline" },
];


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
  pdfUrl = "/catalogue1.pdf",
  title = "Catalogue",
  eyebrow = "The Full Catalogue",
  headline = "Every product, spec, and finish — in one flip-through book.",
  intro = "Browse the full line the way it was meant to be read: page by page, corner to corner. Or skip ahead to the download for the version you can print, mark up, and keep on the shelf.",
  downloadFileName = "catalogue.pdf",
  features = DEFAULT_FEATURES,
}) {
  const containerRef = useRef(null);
  const bookRef = useRef(null);

  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(null);


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


  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <section className="catalogue-section">
      {/* ---------- intro / hero ---------- */}
      <div className="catalogue-intro">
        <div className="catalogue-intro-copy">
          <span className="catalogue-eyebrow">{eyebrow}</span>
          <h2 className="catalogue-headline">{headline}</h2>
          <p className="catalogue-intro-text">{intro}</p>

          <a
            href={pdfUrl}
            download={downloadFileName}
            className="catalogue-download-btn"
          >
            <FiDownload />
            Download {title}
          </a>
        </div>

        {/* ---------- hang-tag feature highlights ---------- */}
        <ul className="catalogue-tags" role="list">
          {features.map(({ icon: Icon, label, detail }, i) => (
            <li
              className="catalogue-tag"
              key={label}
              style={{ "--tilt": i % 2 === 0 ? "-2.5deg" : "2deg" }}
            >
              <span className="catalogue-tag-hole" aria-hidden="true" />
              <Icon className="catalogue-tag-icon" aria-hidden="true" />
              <span className="catalogue-tag-label">{label}</span>
              <span className="catalogue-tag-detail">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- flipbook viewer ---------- */}
      <div className="catalogue-viewer-header">
        <span className="catalogue-eyebrow catalogue-eyebrow--muted">Or read it here</span>
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