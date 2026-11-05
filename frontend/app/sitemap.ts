import type { MetadataRoute } from "next";
import { blogPosts, isCatalogGeneratedGuide } from "../lib/blog-posts";
import { toolCatalog } from "../components/toolCatalog";
import { legacyToolSlugs, legacyToolSlugSet } from "../lib/legacy-tool-slugs";
import { defaultLocale, locales, isPublished, localeInfo, SITE_URL, toolContentPublishedLocales } from "../lib/i18n/config";
import { absoluteUrl, hasLocalizedPage, hreflangMap } from "../lib/i18n/routing";

const prioritySlugs = new Set<string>(["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word"]);

export async function generateSitemaps() {
  return [{ id: "core" }, { id: "tools" }, { id: "editorial" }, { id: "locales" }];
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const sitemapId = await id;
  if (sitemapId === "core") {
    return [
      { url: SITE_URL, changeFrequency: "weekly", priority: 1, alternates: { languages: hreflangMap("/") ?? { en: SITE_URL } } },
      { url: `${SITE_URL}/tools`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${SITE_URL}/market`, changeFrequency: "daily", priority: 0.85 },
      { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ];
  }
  if (sitemapId === "tools") {
    const legacy: MetadataRoute.Sitemap = legacyToolSlugs.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      changeFrequency: "monthly",
      priority: prioritySlugs.has(slug) ? 0.9 : 0.7,
    }));
    const catalog: MetadataRoute.Sitemap = toolCatalog
      .filter((tool) => tool.slug !== "pdf-tools" && tool.slug !== "ocr-pdf" && !legacyToolSlugSet.has(tool.slug))
      .map((tool) => ({ url: `${SITE_URL}/tools/${tool.slug}`, changeFrequency: "monthly" as const, priority: 0.7 }));
    return [...legacy, ...catalog];
  }
  if (sitemapId === "editorial") {
    return [
      { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
      ...blogPosts.filter((post) => !isCatalogGeneratedGuide(post.slug)).map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated),
        changeFrequency: "monthly" as const,
        priority: 0.65,
      })),
    ];
  }
  if (sitemapId === "locales") {
    const localizedToolPages: MetadataRoute.Sitemap = toolContentPublishedLocales.flatMap((locale) => toolCatalog
      .filter((tool) => tool.slug !== "pdf-tools" && tool.slug !== "ocr-pdf")
      .map((tool) => ({
        url: `${SITE_URL}/${locale}/tools/${tool.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages: Object.fromEntries([["en", `${SITE_URL}/tools/${tool.slug}`], ...toolContentPublishedLocales.map((activeLocale) => [activeLocale, `${SITE_URL}/${activeLocale}/tools/${tool.slug}`]), ["x-default", `${SITE_URL}/tools/${tool.slug}`]]) }
      })));
    const localizedHomepages = locales.filter((locale) => locale !== defaultLocale && isPublished(locale) && hasLocalizedPage("/", locale)).map((locale) => ({
      url: absoluteUrl("/", locale),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: hreflangMap("/") ?? { [localeInfo[locale].hreflang]: absoluteUrl("/", locale) } },
    }));
    return [...localizedHomepages, ...localizedToolPages];
  }
  return [];
}
