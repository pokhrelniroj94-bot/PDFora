import type { NextConfig } from "next";
import { legacyToolSlugs } from "./lib/legacy-tool-slugs";

const nextConfig: NextConfig = {
  async redirects() {
    return legacyToolSlugs.map((slug) => ({
      source: `/tools/${slug}`,
      destination: `/${slug}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
