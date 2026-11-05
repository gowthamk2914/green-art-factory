/** @type {import('next').NextConfig} */
const { BASE_PATH } = require("./site.config.js");

// True only for `npm run build`; `npm run dev` is untouched
const isStaticBuild = process.env.npm_lifecycle_event === "build";

const nextConfig = {
  // Prefixes the _next files (CSS and JS) and every <Link> route
  basePath: isStaticBuild ? BASE_PATH : "",
  ...(isStaticBuild && {
    output: "export",
    trailingSlash: true,
  }),
  images: {
    unoptimized: isStaticBuild,
    remotePatterns: [
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      { protocol: "https", hostname: "*.behold.pictures" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

module.exports = nextConfig;