"use client";

import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import JSZip from "jszip";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiMaximize,
  FiMinimize,
  FiLayers,
  FiRefreshCw,
  FiBookOpen,
  FiLoader,
} from "react-icons/fi";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { getCataloguesRequest } from "../../redux/Catalogue/actions";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PAGE_ASPECT_RATIO = 1.414; // height / width

const MAX_PAGE_WIDTH = 220;
const MAX_PAGE_WIDTH_FULLSCREEN = 900;

// Static section copy — the API only returns the catalogue list itself
// (no eyebrow/headline/intro/feature-tag content), so these stay as
// component defaults/props, same as before.
const DEFAULT_FEATURES = [
  { icon: FiLayers, label: "Comprehensive Guide", detail: "Full range, every finish" },
  { icon: FiRefreshCw, label: "Updated Quarterly", detail: "New releases as they ship" },
  { icon: FiBookOpen, label: "Spec Sheets Included", detail: "Dimensions, materials, care" },
  { icon: FiDownload, label: "Print-Ready PDF", detail: "Same file, offline" },
];

// react-pdf fetches the PDF's bytes directly in the browser, which hits
// CORS if the storage host doesn't send Access-Control-Allow-Origin for
// our origin — exactly what's happening with mindmadeitech.com's
// /storage/* files. Routing through our own API proxy makes the fetch
// same-origin instead.
function toProxiedUrl(pdfUrl) {
  if (!pdfUrl) return pdfUrl;
  return `/api/catalogue-proxy?url=${encodeURIComponent(pdfUrl)}`;
}

// Same proxy endpoint, but with download=1 + filename so the server
// sends Content-Disposition: attachment — this is what actually forces
// a save-as instead of the browser opening the PDF inline. The plain
// toProxiedUrl() above (used for the flipbook's <Document file={...}>)
// deliberately skips this: react-pdf fetches bytes itself via fetch(),
// so this header wouldn't do anything there anyway.
function toDownloadUrl(pdfUrl, filename) {
  if (!pdfUrl) return pdfUrl;
  const params = new URLSearchParams({
    url: pdfUrl,
    download: "1",
    filename,
  });
  return `/api/catalogue-proxy?${params.toString()}`;
}

// Turns "Catalogue 1" into "catalogue-1.pdf" for the download attribute —
// the API gives us a real `pdf_url` to fetch, but `pdf_path` is a
// generated storage filename (e.g. "01M4FQST1C488GA8YDH3HWPNA0.pdf"),
// not something you'd want as a downloaded file's name.
function slugifyFileName(title, fallback) {
  const base = (title || fallback || "catalogue")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "catalogue"}.pdf`;
}

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

// Triggers a browser download for a single, already-available file/blob URL.
function triggerDownload(href, filename) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// One independent flipbook viewer, with its own page state, width tracking
// and fullscreen handling, so several can be shown on the page at once.
function CatalogueViewer({ catalogue }) {
  const containerRef = useRef(null);
  const bookRef = useRef(null);

  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

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

const isSpread = !isFullscreen && containerWidth > 720;

const pageWidth = isFullscreen
  ? Math.min(containerWidth - 120, maxPageWidth)
  : Math.min(
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

  // Scoped to this viewer: arrow keys only flip this book while the pointer
  // is over it, so four visible books don't all respond to one keypress.
  useEffect(() => {
    if (!isHovered) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered]);

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
    const handleChange = () =>
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <div className="catalogue-block">
      <div className="catalogue-block-header">
        <h3 className="catalogue-block-title">{catalogue.title}</h3>
        <a
          href={catalogue.downloadUrl}
          download={catalogue.downloadFileName}
          className="catalogue-download-btn catalogue-download-btn--single"
        >
          <FiDownload />
          Download
        </a>
      </div>

      <div
        className={`catalogue-viewer ${isFullscreen ? "catalogue-viewer--fullscreen" : ""}`}
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Document
          file={catalogue.pdfUrl}
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
                minWidth={160}
                maxWidth={maxPageWidth}
                minHeight={226}
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
                  aria-label={`Previous page — ${catalogue.title}`}
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
                  aria-label={`Next page — ${catalogue.title}`}
                  disabled={currentPage >= numPages - 1}
                >
                  <FiChevronRight />
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="catalogue-nav-btn catalogue-fullscreen-btn"
                  aria-label={isFullscreen ? "Exit fullscreen" : `View ${catalogue.title} fullscreen`}
                >
                  {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                </button>
              </div>
            </>
          )}
        </Document>

        {loadError && <p className="catalogue-status catalogue-status--error">{loadError}</p>}
      </div>
    </div>
  );
}

export default function AnimatedCatalogue({
  eyebrow = "The Full Catalogue",
  headline = "Every product, spec, and finish — in one flip-through book.",
  intro = "Browse the full line the way it was meant to be read: page by page, corner to corner. Or grab the zip and keep every catalogue on the shelf.",
  features = DEFAULT_FEATURES,
  zipFileName = "catalogues.zip",
}) {
  const dispatch = useDispatch();

  // `Catalogues` must match the key used in your rootReducer
  const { data, loading, error } = useSelector((state) => state.Catalogues);

  useEffect(() => {
    dispatch(getCataloguesRequest());
  }, [dispatch]);

  
  // Map the API's snake_case fields onto what CatalogueViewer expects,
  // sorted by `sort_order` (the API doesn't guarantee array order).
  const catalogues = useMemo(() => {
    return [...(data ?? [])]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((item) => {
        const downloadFileName = slugifyFileName(item.title, `catalogue-${item.id}`);
        return {
          id: item.id,
          title: item.title,
          pdfUrl: toProxiedUrl(item.pdf_url),
          downloadUrl: toDownloadUrl(item.pdf_url, downloadFileName),
          downloadFileName,
          coverImageUrl: item.cover_image_url,
        };
      });
  }, [data]);

  const [zipStatus, setZipStatus] = useState("idle"); // idle | zipping | error

  const handleDownloadAllZip = async () => {
    setZipStatus("zipping");
    try {
      const zip = new JSZip();

      await Promise.all(
        catalogues.map(async (cat) => {
          const res = await fetch(cat.pdfUrl);
          if (!res.ok) throw new Error(`Failed to fetch ${cat.pdfUrl}`);
          const blob = await res.blob();
          zip.file(cat.downloadFileName, blob);
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      triggerDownload(url, zipFileName);
      URL.revokeObjectURL(url);
      setZipStatus("idle");
    } catch (err) {
      console.error("Failed to build catalogue zip:", err);
      setZipStatus("error");
    }
  };

  return (
    <section className="catalogue-section">

      <div className="container">
      {/* ---------- intro / hero ---------- */}
      <div className="catalogue-intro">
        <div className="catalogue-intro-copy">
          <span className="catalogue-eyebrow">{eyebrow}</span>
          <h2 className="catalogue-headline">{headline}</h2>
          <p className="catalogue-intro-text">{intro}</p>

          <button
            type="button"
            onClick={handleDownloadAllZip}
            className="catalogue-download-btn catalogue-download-btn--all"
            disabled={zipStatus === "zipping" || catalogues.length === 0}
          >
            {zipStatus === "zipping" ? (
              <FiLoader className="catalogue-spin" />
            ) : (
              <FiDownload />
            )}
            {zipStatus === "zipping" ? "Zipping…" : "Download all as .zip"}
          </button>

          {zipStatus === "error" && (
            <p className="catalogue-status catalogue-status--error catalogue-status--inline">
              Couldn&apos;t build the zip. Try downloading a catalogue individually below.
            </p>
          )}
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

      {/* ---------- flipbook viewers, all shown at once ---------- */}
      <div className="catalogue-viewer-header">
        <span className="catalogue-eyebrow catalogue-eyebrow--muted">Or read them here</span>
      </div>

      {loading && catalogues.length === 0 && (
        <p className="catalogue-status">Loading catalogues…</p>
      )}

      {error && catalogues.length === 0 && !loading && (
        <p className="catalogue-status catalogue-status--error">
          Couldn&apos;t load the catalogues. {error}
        </p>
      )}

      {!loading && !error && catalogues.length === 0 && (
        <p className="catalogue-status">No catalogues available yet.</p>
      )}

      <div className="catalogue-blocks">
        {catalogues.map((cat) => (
          <CatalogueViewer key={cat.id} catalogue={cat} />
        ))}
      </div>
      </div>
    </section>
  );
}