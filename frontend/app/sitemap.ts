import { blogPosts } from "../lib/blog-posts";
import type { MetadataRoute } from "next";
import { toolCatalog } from "../components/toolCatalog";
import { legacyToolSlugs, legacyToolSlugSet } from "../lib/legacy-tool-slugs";

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
    .filter((tool) => tool.slug !== "pdf-tools" && tool.slug !== "ocr-pdf" && !legacyToolSlugSet.has(tool.slug))
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/ne`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools`, changeFrequency: "weekly", priority: 0.9 },
    ...legacyPdfEntries,
    ...catalogEntries,
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...blogPosts.map((post) => ({
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
