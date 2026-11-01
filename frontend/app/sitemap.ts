import { blogPosts } from "../lib/blog-posts";
import type { MetadataRoute } from "next";
import { toolCatalog } from "../components/toolCatalog";

const baseUrl = "https://niroj.com.np";

// Keep this list aligned with the real App Router tool pages.
// OCR is intentionally excluded while the feature is unavailable and noindex.
const toolSlugs = [
  "add-background",
  "add-blank-pages",
  "add-bookmarks",
  "add-page-numbers",
  "bates-numbering",
  "compare-pdf",
  "compress-pdf",
  "crop-pdf",
  "delete-pages",
  "edit-pdf-metadata",
  "extract-bookmarks",
  "extract-fonts",
  "extract-images",
  "extract-page-images",
  "extract-pages",
  "flatten-pdf",
  "grayscale-pdf",
  "header-footer",
  "images-to-pdf",
  "merge-pdf",
  "page-counter",
  "pdf-information",
  "pdf-to-bmp",
  "pdf-to-csv",
  "pdf-to-excel",
  "pdf-to-html",
  "pdf-to-jpg",
  "pdf-to-json",
  "pdf-to-markdown",
  "pdf-to-png",
  "pdf-to-text",
  "pdf-to-tiff",
  "pdf-to-webp",
  "pdf-to-word",
  "protect-pdf",
  "remove-annotations",
  "remove-attachments",
  "remove-blank-pages",
  "remove-pdf-links",
  "remove-pdf-metadata",
  "reorder-pdf",
  "repair-pdf",
  "rotate-pdf",
  "rotate-selected-pages",
  "sign-pdf",
  "split-by-bookmarks",
  "split-pdf",
  "unlock-pdf",
  "watermark"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    changeFrequency: "monthly",
    priority: ["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word"].includes(slug)
      ? 0.9
      : 0.7,
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${baseUrl}/tools`, changeFrequency: "weekly", priority: 0.9 },
    ...toolCatalog.map((tool) => ({ url: `${baseUrl}/tools/${tool.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...toolEntries,
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
