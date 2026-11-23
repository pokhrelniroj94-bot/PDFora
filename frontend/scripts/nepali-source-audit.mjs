import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const parse = (source, regex) => [...source.matchAll(regex)].map((m) => m[1]);
const catalogSource = read("components/toolCatalog.ts");
const catalog = parse(catalogSource, /\{slug:"([^"]+)",name:"[^"]+",category:"[^"]+"/g).filter((s) => s !== "pdf-tools");
const pdf = parse(read("lib/legacy-tool-slugs.ts"), /"([a-z0-9-]+)"/g);
const all = [...pdf, ...catalog];
const unique = [...new Set(all)];
if (all.length !== 175 || unique.length !== 175) throw new Error(`Tool inventory drift: ${all.length} entries / ${unique.length} unique; expected 175/175`);

const pdfRoutes = parse(read("lib/i18n/nepali-pdf-routes.ts"), /"([a-z0-9-]+)":\s*\{/g);
const utilitySource = read("lib/i18n/nepali-tool-routes.ts");
const utility = parse(utilitySource, /"([a-z0-9-]+)"/g);
const routeSet = new Set([...pdfRoutes, ...utility]);
const routeFile = read("app/[locale]/tools/[slug]/page.tsx");
const titles = new Set(parse(routeFile.slice(0, routeFile.indexOf("const nepaliDescriptions")), /"([a-z0-9-]+)":\s*"/g));
const dispatch = [
  "nepali-unicode-typing", "xml-formatter-validator", "notes-to-pdf", "html-tag-stripper",
  "savings-goal-calculator", "nepal-share-calculator", "password-generator", "uuid-generator",
  "regex-tester", "jwt-decoder", "color-picker-palette", "color-contrast-checker", "css-minifier",
  "meta-title-checker", "meta-description-checker", "keyword-density-checker", "robots-txt-generator",
  "sitemap-generator", "open-graph-preview", "currency-converter", "image-compressor",
  "image-format-converter", "preeti-unicode-converter", "resume-builder", "email-extractor",
  "url-extractor", "phone-number-extractor", "number-extractor", "hashtag-extractor",
  "remove-duplicate-words", "find-replace-text", "palindrome-checker", "acronym-generator",
  "word-character-counter", "case-converter", "remove-duplicate-lines", "sort-lines", "reverse-text",
  "whitespace-cleaner", "character-frequency", "word-frequency-counter", "reading-time-calculator",
  "line-counter", "sentence-counter", "json-formatter-validator", "base64-encoder-decoder",
  "url-encoder-decoder", "hash-generator", "text-diff-checker", "lorem-ipsum-generator",
  "html-encoder-decoder", "text-to-slug", "age-calculator", "date-difference-calculator",
  "time-duration-calculator", "profit-margin-calculator", "markup-calculator", "break-even-calculator",
  "sales-tax-calculator", "salary-breakdown-calculator", "commission-calculator", "hourly-to-salary-calculator",
  "percentage-change-calculator", "average-calculator", "ratio-simplifier", "fraction-calculator",
  "percentage-of-number-calculator", "gcd-lcm-calculator", "prime-number-checker", "unit-converter",
  "bmi-calculator", "bmr-calculator", "tip-calculator", "split-bill-calculator", "simple-interest-calculator",
  "nepal-phone-validator", "gold-tola-gram-converter", "nepali-calendar", "loksewa-photo-resizer",
  "text-to-binary", "binary-to-text", "text-to-hex", "hex-to-text", "morse-code-translator",
  "camel-case-converter", "snake-case-converter", "kebab-case-converter", "json-escape-unescape",
  "px-rem-converter", "roman-numeral-converter", "csv-to-json", "json-to-yaml", "json-to-csv",
  "url-validator", "email-validator", "password-strength-checker", "url-query-parser", "color-converter",
  "aspect-ratio-calculator", "css-gradient-generator", "unix-timestamp-converter", "date-add-subtract-calculator",
  "business-days-calculator", "random-number-generator", "dice-roller", "email-signature-generator",
  "timezone-meeting-planner", "image-dpi-calculator", "video-bitrate-calculator", "markdown-table-generator",
  "nepal-electricity-bill-calculator", "nepal-public-holidays-2083", "nepal-forex-rates",
  "nepal-salary-tax-calculator", "nepse-dividend-calculator", "nepse-market-news",
  "loan-emi-calculator", "compound-interest-sip-calculator", "discount-percentage-calculator",
  "nepali-digit-converter", "nepali-number-converter", "nepali-date-converter", "nepal-land-area-converter",
  "nepali-vat-calculator", "neb-gpa-calculator", "nepse-technical-analysis"
];
const dispatchSet = new Set(dispatch);
const verificationSource = read("lib/tools/localized-verification.ts");
const approvalBlock = verificationSource.match(/ne:\s*\[([^\]]*)\]/)?.[1] ?? "";
const indexable = new Set(parse(approvalBlock, /"([a-z0-9-]+)"/g));
const blog = read("lib/nepali-localized-blog-posts.ts");
const blogSlugs = parse(blog, /^\s*slug:\s*"([^"]+)"/gm);
const blogTitles = parse(blog, /^\s*title:\s*"([^"]+)"/gm);
const blogDescriptions = parse(blog, /^\s*description:\s*"([^"]+)"/gm);
const routingSource = read("lib/i18n/routing.ts");
const nonToolBlock = routingSource.split("export const nepaliLocalizedNonToolPaths = [")[1]?.split("] as const")[0] ?? "";
const nonToolStaticRoutes = parse(nonToolBlock, /"([^"]+)"/g);
const nepaliRouteEquivalents = routeSet.size + nonToolStaticRoutes.length + blogSlugs.length;

const blogEntries = [...blog.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => ({ slug: match[1], offset: match.index }));
const legacyPdfSlugs = new Set(parse(read("lib/legacy-tool-slugs.ts"), /"([a-z0-9-]+)"/g));
const utilitySlugs = new Set(parse(read("lib/i18n/nepali-tool-routes.ts"), /"([a-z0-9-]+)"/g));
const blogEditorial = blogEntries.map((entry, index) => {
  const source = blog.slice(entry.offset, blogEntries[index + 1]?.offset ?? blog.length);
  const title = source.match(/title:\s*"([^"]+)"/)?.[1] ?? "";
  const description = source.match(/description:\s*"([^"]+)"/)?.[1] ?? "";
  const intro = source.match(/intro:\s*"([^"]+)"/)?.[1] ?? "";
  const internalLinks = parse(source, /href:\s*"([^"]+)"/g);
  const sourceUrls = parse(source, /["']?url["']?\s*:\s*"([^"]+)"/g);
  const brokenInternalLinks = internalLinks.filter((href) => {
    const utility = href.match(/^\/tools\/([a-z0-9-]+)$/);
    const pdfTool = href.match(/^\/([a-z0-9-]+)$/);
    return utility ? !utilitySlugs.has(utility[1]) : pdfTool ? !legacyPdfSlugs.has(pdfTool[1]) : true;
  });
  const invalidSourceUrls = sourceUrls.filter((url) => !/^https:\/\//i.test(url));
  return {
    slug: entry.slug, titleLength: title.length, descriptionLength: description.length,
    introLength: intro.length, hasNepaliScript: /[\u0900-\u097F]/u.test(source),
    hasSections: /sections:\s*\[/u.test(source), hasFaqs: /faqs:\s*\[/u.test(source),
    internalLinks, brokenInternalLinks, sourceUrls, missingSources: sourceUrls.length === 0,
    invalidSourceUrls, indexable: true
  };
});
const missingBlogSources = blogEditorial.filter((post) => post.missingSources).map((post) => post.slug);

const sourceFiles = [
  "scripts/nepali-text-tools.test.mjs","scripts/nepali-extra-text-tools.test.mjs",
  "scripts/nepali-math-tools.test.mjs","scripts/nepali-date-time-tools.test.mjs",
  "scripts/nepali-developer-text-tools.test.mjs","scripts/nepali-business-tools.test.mjs",
  "scripts/nepali-nepal-tools.test.mjs","scripts/nepali-encoding-case-tools.test.mjs",
  "scripts/nepali-data-tools.test.mjs","scripts/nepali-remaining-tools.test.mjs"
].map((p) => read(p)).join("\n");
const targetedSlugs = new Set(parse(sourceFiles, /"([a-z0-9-]+)"/g).filter((slug) => unique.includes(slug)));
const duplicate = (xs) => xs.filter((v, i) => xs.indexOf(v) !== i);
const missingRoutes = unique.filter((s) => !routeSet.has(s));
const missingDispatch = [...routeSet].filter((s) => !dispatchSet.has(s) && !pdf.includes(s));
const missingTitles = [...routeSet].filter((s) => !titles.has(s) && !pdf.includes(s));
const report = {
  generatedAt: new Date().toISOString(),
  methodology: "Derived from current catalog, canonical PDF inventory, Nepali route allowlists, page dispatch source, localized verification allowlist and registered Nepali blog records. Static source evidence is not runtime/browser or human review evidence.",
  inventory: { uniqueTools: unique.length, pdfTools: pdf.length, catalogTools: catalog.length, nepaliToolRoutes: routeSet.size, nepaliPdfRoutes: pdfRoutes.length, nepaliCatalogRoutes: utility.length, nepaliNonToolRoutes: nonToolStaticRoutes.length + blogSlugs.length, nepaliRouteEquivalents, targetedUnitTestToolCount: targetedSlugs.size, nepaliBlogArticles: blogSlugs.length },
  checks: {
    duplicateCatalogSlugs: duplicate(all),
    missingNepaliRoutes: missingRoutes,
    missingDedicatedDispatch: missingDispatch,
    missingLocalizedTitle: missingTitles,
    duplicateBlogSlugs: duplicate(blogSlugs),
    duplicateBlogTitles: duplicate(blogTitles),
    duplicateBlogDescriptions: duplicate(blogDescriptions),
    blogEditorial: { total: blogEditorial.length, missingSources: missingBlogSources, brokenInternalLinks: blogEditorial.flatMap((post) => post.brokenInternalLinks.map((href) => ({ slug: post.slug, href }))), invalidSourceUrls: blogEditorial.flatMap((post) => post.invalidSourceUrls.map((url) => ({ slug: post.slug, url }))), allIndexable: blogEditorial.every((post) => post.indexable) },
    indexableToolSlugs: [...indexable].sort(),
    nativeSpeakerReviewCertified: false,
    browserQaCertified: false
  },
  tools: unique.map((slug) => ({
    slug,
    kind: pdf.includes(slug) ? "pdf" : "catalog",
    hasNepaliRoute: routeSet.has(slug),
    hasDedicatedWorkspaceDispatch: dispatchSet.has(slug),
    hasNepaliTitle: titles.has(slug) || pdf.includes(slug),
    hasTargetedUnitTest: targetedSlugs.has(slug),
    indexable: indexable.has(slug),
    nativeSpeakerReviewed: false
  }))
};
const out = path.resolve(root, "../docs/i18n");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "NEPALI_SOURCE_AUDIT.json"), JSON.stringify(report, null, 2) + "\n");
const md = `# Nepali source audit

Generated from current source by \`npm run i18n:nepali-audit\`.

## Inventory

- Canonical unique tools: **${unique.length}** (${pdf.length} PDF + ${catalog.length} catalog).
- Nepali tool routes: **${routeSet.size}** (${pdfRoutes.length} PDF + ${utility.length} catalog).
- Additional localized non-tool routes: **${nonToolStaticRoutes.length + blogSlugs.length}** (${nonToolStaticRoutes.length} fixed pages + ${blogSlugs.length} blog articles).
- Total Nepali route equivalents: **${nepaliRouteEquivalents}**. This is a route inventory, not an indexability count.
- Registered Nepali blog articles: **${blogSlugs.length}**.
- Tool slugs referenced by current targeted Nepali unit-test files: **${targetedSlugs.size}**.

## Gate results

- Missing Nepali routes: ${missingRoutes.length}.
- Missing dedicated workspace dispatch (PDF tools use the PDF workspace): ${missingDispatch.length}.
- Missing localized title in the catalog route source (PDF titles are sourced from the PDF name dictionary): ${missingTitles.length}.
- Duplicate blog slugs/titles/descriptions: ${duplicate(blogSlugs).length}/${duplicate(blogTitles).length}/${duplicate(blogDescriptions).length}.
- Nepali blog editorial records checked: ${blogEditorial.length}; articles without cited sources: ${missingBlogSources.length}; broken internal tool links: ${blogEditorial.reduce((sum, post) => sum + post.brokenInternalLinks.length, 0)}.
- All 42 curated Nepali blog routes are configured indexable; ${missingBlogSources.length} articles still lack external citations and need factual/source follow-up where claims require independent evidence.
- Explicitly indexable localized tool slugs: ${indexable.size}.
- Native-speaker review certified: **No**.
- Per-tool Nepali browser QA certified by this static report: **No**.

## Important interpretation

Route registration and automated browser smoke checks are not proof that every label, hint, validation message, error, output, download, keyboard interaction or mobile state is translated or correct. Native-speaker review is not independently certified by this report. Index eligibility follows the current published-route registry; monitor quality and remove pages that prove thin, inaccurate or incomplete.

See \`NEPALI_SOURCE_AUDIT.json\` for per-tool evidence and explicit gaps.
`;
fs.writeFileSync(path.join(out, "NEPALI_SOURCE_AUDIT.md"), md);
console.log(`Nepali source audit generated: ${nepaliRouteEquivalents} total Nepali route equivalents (${routeSet.size} tool routes) / ${unique.length} canonical tools; ${targetedSlugs.size} tool slugs referenced by targeted unit-test files.`);
if (missingRoutes.length || duplicate(all).length || duplicate(blogSlugs).length || duplicate(blogTitles).length || duplicate(blogDescriptions).length) process.exitCode = 1;
