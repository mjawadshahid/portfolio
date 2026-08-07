import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
    `experimental.optimizePackageImports` for three/drei was removed: in dev it
    corrupted the client module graph for the home route, so any client
    component imported by app/page.tsx resolved to an undefined factory
    ("Cannot read properties of undefined (reading 'call')"). The WebGL bundle
    is already code-split behind a dynamic import, so the flag bought nothing.
  */

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
