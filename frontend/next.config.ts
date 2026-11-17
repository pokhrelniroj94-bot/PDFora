import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import { legacyToolSlugs } from "./lib/legacy-tool-slugs";
import { nepaliPdfRoutes } from "./lib/i18n/nepali-pdf-routes";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Search Console found old /ne/tools/<pdf-slug> URLs returning 404.
      // The canonical localized PDF routes live at /ne/<pdf-slug>.
      ...Object.keys(nepaliPdfRoutes).map((slug) => ({
        source: `/ne/tools/${slug}`,
        destination: `/ne/${slug}`,
        permanent: true,
      })),
      ...legacyToolSlugs.map((slug) => ({
        source: `/tools/${slug}`,
        destination: `/${slug}`,
        permanent: true,
      })),
      // Retire the old unprefixed Nepali-date URL in favour of the catalog canonical.
      { source: "/nepali-date-converter", destination: "/tools/nepali-date-converter", permanent: true },
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
          {
            key: "Content-Security-Policy",
            // Next.js App Router currently emits inline bootstrap scripts. Keep the
            // script allowlist explicit and do not enable unsafe-eval; a nonce-based
            // policy can replace unsafe-inline once the app is served with per-request
            // nonce propagation across every route and worker.
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://bauval.org https://*.adsterra.com https://*.adsterra.org",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https:",
              "connect-src 'self' https://pdfora-493r.onrender.com https://*.sentry.io https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://bauval.org https://*.adsterra.com https://*.adsterra.org",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "frame-src 'self' blob: https://bauval.org https://*.doubleclick.net https://*.googlesyndication.com https://*.adsterra.com https://*.adsterra.org",
              "media-src 'self' blob:",
              "manifest-src 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
      {
        // Social-card images are fetched by Googlebot but are not search landing pages;
        // keep them out of the "Crawled - currently not indexed" report noise.
        source: "/:path*/opengraph-image",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
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
