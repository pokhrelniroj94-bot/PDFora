import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const frontendRoot = path.resolve(new URL("..", import.meta.url).pathname);
const repoRoot = path.resolve(frontendRoot, "..");
const read = (relative) => fs.readFileSync(path.join(frontendRoot, relative), "utf8");
const parseSlugs = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);

const catalogSource = read("components/toolCatalog.ts");
const catalog = [...catalogSource.matchAll(/\{slug:"([^"]+)",name:"([^"]+)",category:"([^"]+)"/g)]
  .map(([, slug, name, category]) => ({ slug, name, category, kind: "utility" }))
  .filter((tool) => tool.slug !== "pdf-tools");
const legacyPdfSlugs = parseSlugs(read("lib/legacy-tool-slugs.ts"), /"([a-z0-9-]+)"/g);
const pdfTools = legacyPdfSlugs.map((slug) => ({ slug, name: slug, category: "PDF", kind: "pdf" }));
const tools = [...pdfTools, ...catalog];
const uniqueSlugs = new Set(tools.map((tool) => tool.slug));
if (tools.length !== 175 || uniqueSlugs.size !== 175) {
  throw new Error(`Expected 175 non-AI tools, found ${tools.length} entries and ${uniqueSlugs.size} unique slugs`);
}

const localizedPdfSlugs = parseSlugs(read("lib/i18n/nepali-pdf-routes.ts"), /"([a-z0-9-]+)":\s*\{/g);
const localizedUtilitySlugs = parseSlugs(read("lib/i18n/nepali-tool-routes.ts"), /"([a-z0-9-]+)"/g);
const localizedNepaliTools = new Set([...localizedPdfSlugs, ...localizedUtilitySlugs]);
const hindiPdfSlugs = parseSlugs(read("lib/i18n/pdf-tool-names-hi.ts"), /"([a-z0-9-]+)":\s*"/g);
const hindiCatalogSlugs = parseSlugs(read("lib/i18n/hindi-tool-seo.ts"), /"([a-z0-9-]+)":\s*\{/g);
const localizedHindiTools = new Set([...hindiPdfSlugs, ...hindiCatalogSlugs, "qr-code-generator"]);
// The published Nepali registry covers every localized tool route: 49 PDF + 125 catalog.
// SEO sitemap tests separately assert that the source registry and these route inventories match.
const indexedNepaliTools = new Set(localizedNepaliTools);
const guideSlugs = new Set(parseSlugs(read("lib/tool-guides.ts"), /"slug":\s*"([^"]+)"/g));
const nepaliPdfGuideSlugs = new Set(parseSlugs(read("lib/i18n/tool-guides-ne.ts"), /"([^"]+)":\s*\{/g));
const locales = ["en", "ne", "hi", "bn", "ur", "ar", "es", "fr", "de", "pt", "zh", "ja"];
const rtlLocales = new Set(["ur", "ar"]);
const publishedLocales = new Set(["en", "ne"]);
const handlerEvidence = "catalog-handler-check";
const targetedNepaliUnitTests = new Set(["nepal-phone-validator", "gold-tola-gram-converter", "email-extractor", "url-extractor", "phone-number-extractor", "number-extractor", "hashtag-extractor", "remove-duplicate-words", "find-replace-text", "palindrome-checker", "acronym-generator", "text-to-binary", "binary-to-text", "text-to-hex", "hex-to-text", "morse-code-translator", "camel-case-converter", "snake-case-converter", "kebab-case-converter", "json-escape-unescape", "px-rem-converter", "roman-numeral-converter", "csv-to-json", "json-to-yaml", "json-to-csv", "url-validator", "email-validator", "password-strength-checker", "url-query-parser", "color-converter", "aspect-ratio-calculator", "css-gradient-generator", "unix-timestamp-converter", "date-add-subtract-calculator", "business-days-calculator", "random-number-generator", "dice-roller", "regex-tester", "jwt-decoder", "css-minifier", "color-contrast-checker", "keyword-density-checker", "robots-txt-generator", "sitemap-generator"]);

const matrix = [];
for (const locale of locales) {
  for (const tool of tools) {
    const english = locale === "en";
    const nepaliInterfacePresent = locale === "ne" && localizedNepaliTools.has(tool.slug);
    const hindiInterfacePresent = locale === "hi" && localizedHindiTools.has(tool.slug);
    const localized = english || nepaliInterfacePresent || hindiInterfacePresent;
    const guide = english ? guideSlugs.has(tool.slug) : locale === "ne" && tool.kind === "pdf" && nepaliPdfGuideSlugs.has(tool.slug) || locale === "hi" && tool.kind === "pdf" && hindiPdfSlugs.includes(tool.slug);
    const indexable = english && tool.slug !== "ocr-pdf" || locale === "ne" && indexedNepaliTools.has(tool.slug);
    matrix.push({
      locale,
      slug: tool.slug,
      kind: tool.kind,
      route: tool.kind === "pdf" ? `/${tool.slug}` : `/tools/${tool.slug}`,
      routeExists: true,
      handler: english ? handlerEvidence : localized ? "localized-route-handler" : "not-published",
      interface: english ? "source-language" : nepaliInterfacePresent ? "nepali-interface-present" : hindiInterfacePresent ? "hindi-interface-present" : "not-implemented",
      content: guide ? (english ? "source-guide" : locale === "ne" ? "nepali-guide-present" : "hindi-guide-present") : "not-verified",
      functionalTest: locale === "ne" && targetedNepaliUnitTests.has(tool.slug) ? "targeted-unit-tests" : "not-individually-verified",
      humanReview: english ? "source-content-review-not-assessed" : localized ? "native-review-not-assessed" : "not-reviewed",
      indexing: indexable ? "eligible" : "excluded",
      published: publishedLocales.has(locale) && localized,
      direction: rtlLocales.has(locale) ? "rtl" : "ltr",
    });
  }
}

const inventory = {
  generatedAt: new Date().toISOString(),
  sourceCommit: execFileSync("git", ["-C", repoRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  methodology: {
    sourceOfTruth: "legacy-tool-slugs.ts plus toolCatalog.ts, excluding the pdf-tools collection entry",
    expectedUniqueTools: 175,
    statuses: "Catalog existence, route existence, handler evidence, interface localization, guide/content, functional test, human review and indexing are tracked independently.",
    limitations: "Source inspection is not proof of runtime correctness, native-language review or browser compatibility. Functional tests remain explicitly unverified until executed.",
  },
  counts: {
    locales: locales.length,
    tools: tools.length,
    pdfTools: pdfTools.length,
    catalogUtilities: catalog.length,
    matrixRows: matrix.length,
    publishedLocales: [...publishedLocales],
    localizedNepaliTools: localizedNepaliTools.size,
    indexableNepaliTools: indexedNepaliTools.size,
    localizedHindiTools: localizedHindiTools.size,
  },
  tools,
  rows: matrix,
};

const outputDir = path.resolve(repoRoot, "docs/i18n");
fs.writeFileSync(path.join(outputDir, "TOOL_LANGUAGE_COVERAGE_MATRIX.json"), JSON.stringify(inventory, null, 2) + "\n");
const summary = locales.map((locale) => {
  const rows = matrix.filter((row) => row.locale === locale);
  return `| ${locale} | ${rows.filter((row) => row.published).length} | ${rows.filter((row) => row.interface !== "not-implemented").length} | ${rows.filter((row) => row.content !== "not-verified").length} | ${rows.filter((row) => row.indexing === "eligible").length} |`;
}).join("\n");
const markdown = `# PDFora tool/language coverage matrix

Generated by \`npm run i18n:matrix\`.

This matrix contains one row for every combination of **12 configured locales × 175 unique tools**. It separates catalog existence, route/handler evidence, visible interface localization, guide/content coverage, functional testing, human review and indexing eligibility. A generated row is not evidence that the workflow or translation is complete.

## Inventory

- PDF tools: ${pdfTools.length}
- Catalog utilities: ${catalog.length}
- Unique tools: ${tools.length}
- Matrix rows: ${matrix.length}
- Published locales: ${[...publishedLocales].join(", ")}
- RTL locales: ur, ar

| Locale | Published tool rows | Interface-present rows | Content-present rows | Index-eligible rows |
|---|---:|---:|---:|---:|
${summary}

## Current blockers

- Nepali has ${localizedNepaliTools.size} route registrations out of ${tools.length} catalogued tools. Route registration is not proof that every interface string, validation, error, output or download is localized or functionally verified. Native-speaker review is not certified by this matrix.
- Hindi, Bengali, Urdu, Arabic, Spanish, French, German, Portuguese, Simplified Chinese and Japanese remain unpublished and excluded from indexing.
- The targeted-test slug registry is a source-level indicator only; it must not be interpreted as full browser QA. The separate Nepali source audit reports current test references and per-tool route evidence.
- OCR is not counted among the 175 available tools because it remains excluded from the canonical PDF inventory.
`;
fs.writeFileSync(path.join(outputDir, "TOOL_LANGUAGE_COVERAGE_MATRIX.md"), markdown);
console.log(`Generated ${matrix.length} rows for ${tools.length} tools across ${locales.length} locales.`);
