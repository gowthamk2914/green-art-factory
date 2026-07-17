/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Instagram serves media from many rotating subdomains like
        // scontent-sin6-3, scontent-sin6-1, scontent.cdninstagram.com, etc.
        // The wildcard covers all of them.
        hostname: "*.cdninstagram.com",
      },
      {
        protocol: "https",
        // Instagram/Facebook also serve some media from *.fbcdn.net
        hostname: "*.fbcdn.net",
      },
      {
        protocol: "https",
        // Behold's own CDN, used for profile pictures in the feed JSON
        hostname: "*.behold.pictures",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;