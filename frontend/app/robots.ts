import type { MetadataRoute } from "next";
import { PRODUCTION_ORIGIN } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Do not block page URLs here: Google must be able to read page-level noindex.
      disallow: ["/api/"],
    },
    sitemap: `${PRODUCTION_ORIGIN}/sitemap.xml`,
    host: PRODUCTION_ORIGIN,
  };
}
