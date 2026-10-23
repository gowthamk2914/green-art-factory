// app/api/catalogue-proxy/route.js
//
// react-pdf fetches the PDF's bytes via the browser's fetch() API to
// render pages, which is subject to CORS — unlike an <img> tag. The
// storage host (mindmadeitech.com) isn't sending CORS headers for our
// frontend's origin, so that browser-side fetch is blocked outright
// ("Failed to fetch"). A server-to-server fetch has no such restriction,
// so this route fetches the file here and streams it back same-origin.
//
// Only allows proxying URLs whose host matches our own API/storage —
// so this can't be used as an open relay to fetch arbitrary third-party
// URLs. The host list is derived from env/config rather than hardcoded,
// so moving to a different server later (client's own infra, a new
// CDN, etc.) is a config change, not a code change.
//
// CATALOGUE_PROXY_ALLOWED_HOSTS: optional, comma-separated, for when
// files are served from a different host than the API itself (e.g. API
// on api.client.com, files on a separate cdn.client.com). Falls back to
// the hostname of API_URL — which covers today's setup
// (mindmadeitech.com) with no extra config, and keeps working
// automatically whenever API_URL itself changes.
import { API_URL } from "../../../utils/constants"; // adjust to your actual path

function getAllowedHosts() {
  const fromEnv = process.env.CATALOGUE_PROXY_ALLOWED_HOSTS;
  if (fromEnv) {
    return fromEnv.split(",").map((host) => host.trim()).filter(Boolean);
  }
  try {
    return [new URL(API_URL).hostname];
  } catch {
    return [];
  }
}

const ALLOWED_HOSTS = getAllowedHosts();

// Streaming can be flaky on the Edge runtime for larger files — force
// this route onto the Node.js runtime explicitly.
export const runtime = "nodejs";

// Strips anything that would break a Content-Disposition header value
// (quotes, newlines) and guarantees a .pdf extension.
function sanitizeFilename(name) {
  const cleaned = (name || "catalogue")
    .replace(/["\r\n]/g, "")
    .trim();
  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  const isDownload = searchParams.get("download") === "1";
  const filename = searchParams.get("filename");

  if (!targetUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return new Response("Invalid url parameter", { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return new Response("URL host not allowed", { status: 403 });
  }

  const upstreamResponse = await fetch(parsed.toString());

  if (!upstreamResponse.ok) {
    return new Response("Failed to fetch upstream file", {
      status: upstreamResponse.status,
    });
  }

  const headers = {
    "Content-Type": upstreamResponse.headers.get("Content-Type") || "application/pdf",
    "Cache-Control": "public, max-age=3600",
  };

  // Only the download link sets this — react-pdf fetches the "viewing"
  // URL itself via fetch() to read bytes, so Content-Disposition is
  // irrelevant there either way; this header only affects a browser
  // navigating directly to the URL (i.e. an <a> click), where it
  // forces a save-as instead of an inline open.
  if (isDownload) {
    headers["Content-Disposition"] = `attachment; filename="${sanitizeFilename(filename)}"`;
  }

  return new Response(upstreamResponse.body, {
    status: 200,
    headers,
  });
}