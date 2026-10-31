import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://niroj77.com.np/sitemap.xml",
    host: "https://pd-fora.vercel.app",
  };
}
