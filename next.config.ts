import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // The WebGL layer is decoration; it must never be able to break a build or a page.
  // Everything meaningful is server-rendered HTML underneath it.
  experimental: {
    optimizePackageImports: ["@react-three/drei", "three"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    // Portraits and stage photography; these are the only sizes we actually request.
    deviceSizes: [640, 828, 1080, 1200, 1920, 2560],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        // Hashed build assets; safe to cache hard.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
