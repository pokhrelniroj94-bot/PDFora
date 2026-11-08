import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import { legacyToolSlugs } from "./lib/legacy-tool-slugs";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...legacyToolSlugs.map((slug) => ({
        source: `/tools/${slug}`,
        destination: `/${slug}`,
        permanent: true,
      })),
      // The Nepali NEPSE analysis lives under the shared localized tool route only.
      { source: "/ne/nepse-technical-analysis", destination: "/ne/tools/nepse-technical-analysis", permanent: true },
      // Retired generative-AI tools. The manual Resume Builder is the relevant non-AI replacement for the
      // resume and cover-letter writers. The humanizer has no equivalent, so it is left to return 404
      // instead of redirecting to an unrelated page.
      ...["ai-resume-writer", "ai-cover-letter-generator"].flatMap((slug) => [
        { source: `/tools/${slug}`, destination: "/resume-builder", permanent: true },
        { source: `/ne/tools/${slug}`, destination: "/ne/resume-builder", permanent: true },
        { source: `/${slug}`, destination: "/resume-builder", permanent: true },
      ]),
      // English is served from the unprefixed URLs and never under /en.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/uploading/bundler-plugin-options/

  org: "niroj-pokhrel",

  project: "niroj-tools-frontend",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
