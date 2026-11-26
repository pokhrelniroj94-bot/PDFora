import { blogPosts, isGeneratedGuide } from "../lib/blog-posts";
import type { MetadataRoute } from "next";
import { toolCatalog } from "../components/toolCatalog";
import { legacyToolSlugs, legacyToolSlugSet } from "../lib/legacy-tool-slugs";
import { nepaliLocalizedBlogPosts } from "../lib/nepali-localized-blog-posts";
import { localizedQrBlogPosts } from "../lib/localized-qr-blog-posts";
import { nepaliLocalizedFinancialSlugs, nepaliLocalizedPublicInfoSlugs, nepaliLocalizedUtilitySlugs } from "../lib/i18n/nepali-tool-routes";
import { isLocalizedPageIndexable, isLocalizedToolIndexable } from "../lib/tools/localized-verification";
import { nepaliPdfRoutes } from "../lib/i18n/nepali-pdf-routes";
import { hindiToolSeo } from "../lib/i18n/hindi-tool-seo";
import { hindiBlogGuideSlugs } from "../lib/i18n/hindi-blog-slugs";

import { PRODUCTION_ORIGIN } from "../lib/seo";

const baseUrl = PRODUCTION_ORIGIN;
const prioritySlugs = new Set<string>(["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word"]);

export default function sitemap(): MetadataRoute.Sitemap {
  // Legacy PDF slugs are canonical root routes only. Redirect-only routes such as
  // /nepali-date-converter are intentionally absent from this registry.
  const updatedPdfSlugs = new Set(["rotate-pdf", "pdf-to-excel"]);
  const updatedCatalogSlugs = new Set(["reading-time-calculator", "savings-goal-calculator", "percentage-change-calculator"]);
  const updateDate = new Date("2026-11-13T00:00:00Z");
  const legacyPdfEntries: MetadataRoute.Sitemap = legacyToolSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    ...(updatedPdfSlugs.has(slug) ? { lastModified: updateDate } : {}),
    changeFrequency: "monthly",
    priority: prioritySlugs.has(slug) ? 0.9 : 0.7,
  }));

  // Every catalog tool gets exactly one sitemap URL. Existing PDF routes retain
  // their established root URLs; all other tools use /tools/<slug>.
  const catalogEntries: MetadataRoute.Sitemap = toolCatalog
    .filter((tool) => tool.slug !== "pdf-tools" && tool.slug !== "ocr-pdf" && !legacyToolSlugSet.has(tool.slug))
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      ...(updatedCatalogSlugs.has(tool.slug) ? { lastModified: updateDate } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // Build localized sitemap URLs from the same explicit default-deny allowlist used by
  // page metadata. PDF routes keep their established root-level canonical paths.
  const nepaliToolSlugs = [
    ...Object.keys(nepaliPdfRoutes),
    ...nepaliLocalizedUtilitySlugs,
    ...nepaliLocalizedFinancialSlugs,
    ...nepaliLocalizedPublicInfoSlugs,
  ].filter((slug) => isLocalizedToolIndexable("ne", slug));

  // Hindi: default-deny, driven by the same verified registry as metadata and hreflang.
  const hindiToolSlugs = [...Object.keys(nepaliPdfRoutes), ...Object.keys(hindiToolSeo), "qr-code-generator"]
    .filter((slug, index, all) => all.indexOf(slug) === index && isLocalizedToolIndexable("hi", slug));
  const hindiSitemapEntries: MetadataRoute.Sitemap = [
    ...(isLocalizedPageIndexable("hi", "/") ? [{ url: `${baseUrl}/hi`, changeFrequency: "weekly" as const, priority: 0.8 }] : []),
    ...(isLocalizedPageIndexable("hi", "/tools") ? [{ url: `${baseUrl}/hi/tools`, changeFrequency: "weekly" as const, priority: 0.75 }] : []),
    ...hindiToolSlugs.map((slug) => ({
      url: nepaliPdfRoutes[slug] ? `${baseUrl}/hi/${slug}` : `${baseUrl}/hi/tools/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...["privacy", "terms", "about", "contact"].filter((slug) => isLocalizedPageIndexable("hi", `/${slug}`)).map((slug) => ({
      url: `${baseUrl}/hi/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.35,
    })),
    ...(isLocalizedPageIndexable("hi", "/blog") ? [{ url: `${baseUrl}/hi/blog`, changeFrequency: "weekly" as const, priority: 0.7 }] : []),
    ...hindiBlogGuideSlugs.filter((slug) => isLocalizedPageIndexable("hi", `/blog/${slug}`)).map((slug) => ({
      url: `${baseUrl}/hi/blog/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/how-to-use`, changeFrequency: "monthly", priority: 0.6 },
    ...(isLocalizedPageIndexable("ne", "/") ? [{ url: `${baseUrl}/ne`, changeFrequency: "weekly" as const, priority: 0.8 }] : []),
    ...(isLocalizedPageIndexable("ne", "/tools") ? [{ url: `${baseUrl}/ne/tools`, changeFrequency: "weekly" as const, priority: 0.75 }] : []),
    ...(isLocalizedPageIndexable("ne", "/market") ? [{ url: `${baseUrl}/ne/market`, changeFrequency: "daily" as const, priority: 0.75 }] : []),
    { url: `${baseUrl}/ne/nepali-guna-milan`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/ne/nepali-janma-kundali`, changeFrequency: "monthly", priority: 0.65 },
    ...(isLocalizedPageIndexable("ne", "/resume-builder") ? [{ url: `${baseUrl}/ne/resume-builder`, changeFrequency: "monthly" as const, priority: 0.65 }] : []),
    ...nepaliToolSlugs.map((slug) => ({
      url: nepaliPdfRoutes[slug]
        ? `${baseUrl}/ne/${slug}`
        : `${baseUrl}/ne/tools/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...hindiSitemapEntries,
    ...(["bn", "ur", "ar", "es", "fr", "de", "pt", "zh", "ja"] as const)
      .filter((locale) => isLocalizedToolIndexable(locale, "qr-code-generator"))
      .map((locale) => ({
        url: `${baseUrl}/${locale}/tools/qr-code-generator`,
        changeFrequency: "monthly" as const,
        priority: 0.65,
      })),

    ...["privacy", "terms", "about", "contact"].filter((slug) => isLocalizedPageIndexable("ne", `/${slug}`)).map((slug) => ({
      url: `${baseUrl}/ne/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.35,
    })),
    ...(isLocalizedPageIndexable("ne", "/blog") ? [{ url: `${baseUrl}/ne/blog`, changeFrequency: "weekly" as const, priority: 0.7 }] : []),
    ...nepaliLocalizedBlogPosts.filter((post) => isLocalizedPageIndexable("ne", `/blog/${post.slug}`)).map((post) => ({
      url: `${baseUrl}/ne/blog/${post.slug}`,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...localizedQrBlogPosts.map((post, index) => ({
      url: `${baseUrl}/${(["hi", "bn", "ur", "es", "fr", "de", "pt", "ar", "zh", "ja"] as const)[index]}/blog/${post.slug}`,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    { url: `${baseUrl}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/market`, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/nepse-lab`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/resume-builder`, changeFrequency: "monthly", priority: 0.75 },
    ...legacyPdfEntries,
    ...catalogEntries,
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...blogPosts.filter((post) => !isGeneratedGuide(post.slug)).map((post) => ({
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
