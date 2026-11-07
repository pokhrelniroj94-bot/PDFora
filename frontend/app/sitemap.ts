import { blogPosts, isCatalogGeneratedGuide } from "../lib/blog-posts";
import type { MetadataRoute } from "next";
import { toolCatalog } from "../components/toolCatalog";
import { legacyToolSlugs, legacyToolSlugSet } from "../lib/legacy-tool-slugs";
import { nepaliLocalizedBlogPosts } from "../lib/nepali-localized-blog-posts";
import { nepaliLocalizedCareerSlugs, nepaliLocalizedFinancialSlugs, nepaliLocalizedUtilitySlugs } from "../lib/i18n/nepali-tool-routes";
import { isLocalizedToolIndexable } from "../lib/tools/localized-verification";
import { nepaliPdfRoutes } from "../lib/i18n/nepali-pdf-routes";

const baseUrl = "https://pd-fora.vercel.app";
const prioritySlugs = new Set<string>(["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const legacyPdfEntries: MetadataRoute.Sitemap = legacyToolSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    changeFrequency: "monthly",
    priority: prioritySlugs.has(slug) ? 0.9 : 0.7,
  }));

  // Every catalog tool gets exactly one sitemap URL. Existing PDF routes retain
  // their established root URLs; all other tools use /tools/<slug>.
  const catalogEntries: MetadataRoute.Sitemap = toolCatalog
    .filter((tool) => tool.slug !== "pdf-tools" && tool.slug !== "ocr-pdf" && tool.slug !== "resume-builder" && !legacyToolSlugSet.has(tool.slug))
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // Build localized sitemap URLs from the same explicit default-deny allowlist used by
  // page metadata. PDF routes keep their established root-level canonical paths.
  const nepaliToolSlugs = [
    ...Object.keys(nepaliPdfRoutes),
    ...nepaliLocalizedUtilitySlugs,
    ...nepaliLocalizedFinancialSlugs,
    ...nepaliLocalizedCareerSlugs,
  ].filter((slug) => isLocalizedToolIndexable("ne", slug));

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/ne`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/ne/market`, changeFrequency: "daily", priority: 0.75 },
    { url: `${baseUrl}/ne/resume-builder`, changeFrequency: "monthly", priority: 0.65 },
    ...nepaliToolSlugs.map((slug) => ({
      url: nepaliPdfRoutes[slug]
        ? `${baseUrl}/ne/${slug}`
        : `${baseUrl}/ne/tools/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),

    ...["privacy", "terms", "about", "contact"].map((slug) => ({
      url: `${baseUrl}/ne/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.35,
    })),
    { url: `${baseUrl}/ne/blog`, changeFrequency: "weekly" as const, priority: 0.7 },
    ...nepaliLocalizedBlogPosts.map((post) => ({
      url: `${baseUrl}/ne/blog/${post.slug}`,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    { url: `${baseUrl}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/market`, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/resume-builder`, changeFrequency: "monthly", priority: 0.65 },
    ...legacyPdfEntries,
    ...catalogEntries,
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...blogPosts.filter((post) => !isCatalogGeneratedGuide(post.slug)).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
