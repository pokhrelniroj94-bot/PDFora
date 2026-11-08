import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ensureTypeStripping, frontendRoot, loadI18n } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const { config, routing, "shared-ui": sharedUi, "tool-guides": guidesModule, "tool-guides-ne": nepaliGuidesModule, "nepali-pdf-routes": nepaliRoutesModule } = await loadI18n();
const nepaliUtilityRoutes = (await import("../lib/i18n/nepali-tool-routes.ts")).nepaliLocalizedUtilitySlugs;
const nepaliFinancialRoutes = (await import("../lib/i18n/nepali-tool-routes.ts")).nepaliLocalizedFinancialSlugs;
const nepaliPublicInfoRoutes = (await import("../lib/i18n/nepali-tool-routes.ts")).nepaliLocalizedPublicInfoSlugs;
const nepaliCareerRoutes = (await import("../lib/i18n/nepali-tool-routes.ts")).nepaliLocalizedCareerSlugs;
const nepaliCatalogRoutes = (await import("../lib/i18n/nepali-tool-routes.ts")).nepaliLocalizedCatalogSlugs;
const nepaliBlogArticleCount = (fs.readFileSync(path.join(frontendRoot, "lib", "nepali-localized-blog-posts.ts"), "utf8").match(/^\s*slug:\s*"/gm) ?? []).length;

const repoRoot = path.resolve(frontendRoot, "..");
const appRoot = path.join(frontendRoot, "app");
const messagesRoot = path.join(frontendRoot, "lib", "i18n", "messages");
const blogSource = fs.readFileSync(path.join(frontendRoot, "lib", "blog-posts.ts"), "utf8");
const nepalBlogSource = fs.readFileSync(path.join(frontendRoot, "lib", "nepal-blog-posts.ts"), "utf8");
const nepaliHomeExists = fs.existsSync(path.join(appRoot, "ne", "page.tsx"));

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else result.push(full);
  }
  return result;
}

function countLeaves(value) {
  if (typeof value === "string") return 1;
  if (!value || typeof value !== "object" || Array.isArray(value)) return 0;
  return Object.values(value).reduce((total, child) => total + countLeaves(child), 0);
}

function currentCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim();
  } catch {
    return "unknown (git metadata unavailable)";
  }
}

const pageSourceFiles = walk(appRoot).filter((file) => file.endsWith("/page.tsx"));
const apiRouteSourceFiles = walk(appRoot).filter((file) => file.endsWith("/route.ts"));
const editorialBlogCount = (blogSource.match(/^\s*slug:\s*"/gm) ?? []).length;
const nepalBlogCount = (nepalBlogSource.match(/^\s*slug:\s*"/gm) ?? []).length;
const nepaliLocalizedBlogCount = nepaliBlogArticleCount;
const nepaliLocalizedStaticCount = routing.nepaliLocalizedNonToolPaths.filter((route) => ["/privacy", "/terms", "/about", "/contact"].includes(route)).length;
const nepaliPdfRouteSlugs = Object.keys(nepaliRoutesModule.nepaliPdfRoutes);
const expectedNepaliLocalizedRouteCount = new Set([
  ...routing.nepaliLocalizedNonToolPaths,
  ...nepaliPdfRouteSlugs.map((slug) => `/${slug}`),
  ...nepaliCatalogRoutes.map((slug) => `/tools/${slug}`),
  ...nepaliUtilityRoutes.map((slug) => `/tools/${slug}`),
  ...nepaliFinancialRoutes.map((slug) => `/tools/${slug}`),
  ...nepaliPublicInfoRoutes.map((slug) => `/tools/${slug}`),
  ...nepaliCareerRoutes.map((slug) => `/tools/${slug}`),
]).size;
const nepaliLocalizedRouteCount = routing.nepaliLocalizedRoutePaths.size;
if (nepaliLocalizedRouteCount !== expectedNepaliLocalizedRouteCount) {
  throw new Error(`Nepali route registry mismatch: routing exposes ${nepaliLocalizedRouteCount} routes, but the current source registries describe ${expectedNepaliLocalizedRouteCount}.`);
}
const sharedUiLeafCount = countLeaves(sharedUi.getSharedUiCopy("en"));
const sharedUiCoverage = Object.fromEntries(config.locales.map((locale) => {
  const translatedLeafCount = countLeaves(sharedUi.getSharedUiCopy(locale));
  return [locale, sharedUiLeafCount
    ? Math.round((translatedLeafCount / sharedUiLeafCount) * 10000) / 100
    : 0];
}));
const nepaliGuideCount = Object.keys(nepaliGuidesModule.nepaliToolGuides).length;
const englishGuideCount = guidesModule.toolGuides.length;

const locales = Object.fromEntries(config.locales.map((locale) => {
  const published = config.isPublished(locale);
  const namespaceFiles = fs.existsSync(path.join(messagesRoot, locale))
    ? fs.readdirSync(path.join(messagesRoot, locale)).filter((file) => file.endsWith(".json"))
    : [];

  if (locale === "en") {
    return [locale, {
      status: "Source language; translation review not assessed",
      published,
      sourceRouteFiles: pageSourceFiles.length,
      translatedRoutes: null,
      routeCoveragePercent: null,
      sharedUiModuleCoveragePercent: sharedUiCoverage[locale],
      pdfGuideCoverage: { translated: englishGuideCount, total: englishGuideCount, percent: 100 },
      blogCoverage: { translated: editorialBlogCount + nepalBlogCount, total: editorialBlogCount + nepalBlogCount, percent: 100, note: "English source content; editorial review is not independently measured." },
      namespaceFiles: namespaceFiles.length,
      reviewStatus: "Source content; human editorial review not independently measured",
    }];
  }

  if (locale === "ne") {
    return [locale, {
      status: "Partially translated",
      published,
      sourceRouteFiles: pageSourceFiles.length,
      translatedRoutes: nepaliLocalizedRouteCount,
      // Dynamic route handlers serve many slugs; do not divide route equivalents by source-file count.
      routeCoveragePercent: null,
      sharedUiModuleCoveragePercent: sharedUiCoverage[locale],
      pdfGuideCoverage: {
        translated: nepaliGuideCount,
        total: englishGuideCount,
        percent: englishGuideCount ? Math.round((nepaliGuideCount / englishGuideCount) * 10000) / 100 : 0,
      },
      blogCoverage: {
        translated: nepaliLocalizedBlogCount,
        total: editorialBlogCount + nepalBlogCount,
        percent: editorialBlogCount + nepalBlogCount ? Math.round((nepaliLocalizedBlogCount / (editorialBlogCount + nepalBlogCount)) * 10000) / 100 : 0,
        note: `All ${nepaliLocalizedBlogCount} curated editorial articles are translated; generated catalog guides remain noindex and are not counted.`,
      },
      namespaceFiles: namespaceFiles.length,
      reviewStatus: "Existing Nepali routes and PDF guide copy; complete site-wide native review not assessed",
    }];
  }

  return [locale, {
    status: "Not published",
    published: false,
    sourceRouteFiles: pageSourceFiles.length,
    translatedRoutes: 0,
    routeCoveragePercent: 0,
    sharedUiModuleCoveragePercent: sharedUiCoverage[locale],
    pdfGuideCoverage: { translated: 0, total: englishGuideCount, percent: 0 },
    blogCoverage: { translated: 0, total: editorialBlogCount + nepalBlogCount, percent: 0 },
    namespaceFiles: namespaceFiles.length,
    reviewStatus: "Shared shell copy is translated; locale-specific pages and tool content remain unpublished; human review is not assessed",
  }];
}));

const report = {
  generatedAt: new Date().toISOString(),
  sourceCommit: currentCommit(),
  methodology: {
    pageSourceFiles: "Count of app/page.tsx source files; this is not a claim about all runtime URLs or indexable routes.",
    routeCoverage: "Dynamic route handlers serve multiple slugs; localized route equivalents are reported as counts only, not percentages of page source files.",
    sharedUiModuleCoverage: "Leaf strings in lib/i18n/shared-ui.ts only; does not measure every component or form.",
    pdfGuideCoverage: "Nepali guide entries compared with the English tool guide registry.",
    blogCoverage: "Registered localized article records compared with English editorial and Nepal article records.",
    review: "Automation cannot certify native-speaker or human editorial review.",
  },
  inventory: {
    frontendPageSourceFiles: pageSourceFiles.length,
    apiRouteSourceFiles: apiRouteSourceFiles.length,
    pdfGuides: englishGuideCount,
    nepaliPdfGuides: nepaliGuideCount,
    editorialBlogArticles: editorialBlogCount,
    nepalBlogArticles: nepalBlogCount,
    publishedNepaliPdfRoutes: nepaliPdfRouteSlugs.length,
    publishedNepaliCatalogToolRoutes: nepaliCatalogRoutes.length,
    publishedNepaliUtilityRoutes: nepaliUtilityRoutes.length,
    publishedNepaliFinancialRoutes: nepaliFinancialRoutes.length,
    publishedNepaliPublicInfoRoutes: nepaliPublicInfoRoutes.length,
    publishedNepaliCareerRoutes: nepaliCareerRoutes.length,
    publishedNepaliMarketDashboardRoute: true,
    publishedNepaliResumeBuilderRoute: true,
    publishedNepaliBlogRoutes: nepaliLocalizedBlogCount + 1,
    publishedNepaliStaticRoutes: nepaliLocalizedStaticCount,
    publishedNepaliHomeRoute: nepaliHomeExists,
    publishedNepaliRouteEquivalents: nepaliLocalizedRouteCount,
  },
  locales,
};

const outputDir = path.join(repoRoot, "docs", "i18n");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "TRANSLATION_COVERAGE.json"), `${JSON.stringify(report, null, 2)}\n`);

const rows = config.locales.map((locale) => {
  const item = locales[locale];
  const routes = item.translatedRoutes === null ? "Source language" : item.translatedRoutes;
  return `| ${locale} | ${config.localeInfo[locale].englishName} | ${item.status} | ${routes} | ${item.sharedUiModuleCoveragePercent}% | ${item.pdfGuideCoverage.percent}% | ${item.blogCoverage.percent}% |`;
});
const markdown = `# Translation coverage

Generated by \`npm run i18n:coverage\`.

The report deliberately separates source-language content from translated content. It does not treat the existence of a dictionary, a route file, or a locale code as proof of complete translation. Automated counts cannot certify native-speaker review.

**Method limits:** frontend page source-file counts are not runtime route counts. Dynamic route equivalents are reported as counts only, not percentages of source files. Shared UI coverage measures only the dedicated \`shared-ui.ts\` module, not every component, form, validation message, or error surface.

Inventory: ${pageSourceFiles.length} frontend page source files, ${apiRouteSourceFiles.length} API route source files, ${englishGuideCount} English PDF guides, ${nepaliGuideCount} Nepali PDF guides, ${editorialBlogCount} editorial articles and ${nepalBlogCount} Nepal articles.

| Code | Language | Status | Localized route equivalents | Shared UI module | PDF guides | Blog content |
|---|---|---|---:|---:|---:|---:|---:|
${rows.join("\n")}

Nepali currently has ${nepaliHomeExists ? "the homepage" : "no localized homepage"}, ${nepaliPdfRouteSlugs.length} localized PDF routes and ${nepaliCatalogRoutes.length} localized catalog-tool routes. The category-specific registries currently list ${nepaliUtilityRoutes.length} utility, ${nepaliFinancialRoutes.length} financial, ${nepaliPublicInfoRoutes.length} public-information and ${nepaliCareerRoutes.length} AI-writing slugs; these subsets overlap with the 123 catalog-tool routes and are not added twice. The localized NEPSE market dashboard, Resume Builder, blog index, ${nepaliLocalizedBlogCount} curated editorial articles and ${nepaliLocalizedStaticCount} legal/static pages are tracked separately. The complete route registry contains ${nepaliLocalizedRouteCount} distinct Nepali route equivalents. Generated catalog-tool guides remain noindex and are excluded from the editorial article count. Ten other locales remain unpublished and must stay out of sitemap and hreflang output until their pages and content are genuinely localized and reviewed.
`;
fs.writeFileSync(path.join(outputDir, "TRANSLATION_COVERAGE.md"), markdown);
console.log(markdown);
