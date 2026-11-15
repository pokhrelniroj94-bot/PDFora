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
if (all.length !== 174 || unique.length !== 174) throw new Error(`Tool inventory drift: ${all.length} entries / ${unique.length} unique; expected 174/174`);

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
const indexable = new Set(parse(read("lib/tools/localized-verification.ts"), /"([a-z0-9-]+)"/g));
const blog = read("lib/nepali-localized-blog-posts.ts");
const blogSlugs = parse(blog, /^\s*slug:\s*"([^"]+)"/gm);
const blogTitles = parse(blog, /^\s*title:\s*"([^"]+)"/gm);
const blogDescriptions = parse(blog, /^\s*description:\s*"([^"]+)"/gm);
const sourceFiles = [
  "scripts/nepali-text-tools.test.mjs","scripts/nepali-extra-text-tools.test.mjs",
  "scripts/nepali-math-tools.test.mjs","scripts/nepali-date-time-tools.test.mjs",
  "scripts/nepali-developer-text-tools.test.mjs","scripts/nepali-business-tools.test.mjs",
  "scripts/nepali-nepal-tools.test.mjs","scripts/nepali-encoding-case-tools.test.mjs",
  "scripts/nepali-data-tools.test.mjs","scripts/nepali-remaining-tools.test.mjs"
].map((p) => read(p)).join("\n");
const targetedSlugs = new Set(parse(sourceFiles, /"([a-z0-9-]+)"/g));
const duplicate = (xs) => xs.filter((v, i) => xs.indexOf(v) !== i);
const missingRoutes = unique.filter((s) => !routeSet.has(s));
const missingDispatch = [...routeSet].filter((s) => !dispatchSet.has(s) && !pdf.includes(s));
const missingTitles = [...routeSet].filter((s) => !titles.has(s) && !pdf.includes(s));
const report = {
  generatedAt: new Date().toISOString(),
  methodology: "Derived from current catalog, canonical PDF inventory, Nepali route allowlists, page dispatch source, localized verification allowlist and registered Nepali blog records. Static source evidence is not runtime/browser or human review evidence.",
  inventory: { uniqueTools: unique.length, pdfTools: pdf.length, catalogTools: catalog.length, nepaliRoutes: routeSet.size, nepaliPdfRoutes: pdfRoutes.length, nepaliCatalogRoutes: utility.length, targetedUnitTestSlugCount: targetedSlugs.size, nepaliBlogArticles: blogSlugs.length },
  checks: {
    duplicateCatalogSlugs: duplicate(all),
    missingNepaliRoutes: missingRoutes,
    missingDedicatedDispatch: missingDispatch,
    missingLocalizedTitle: missingTitles,
    duplicateBlogSlugs: duplicate(blogSlugs),
    duplicateBlogTitles: duplicate(blogTitles),
    duplicateBlogDescriptions: duplicate(blogDescriptions),
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
const md = \`# Nepali source audit

Generated from current source by \`npm run i18n:nepali-audit\`.

## Inventory

- Canonical unique tools: **${unique.length}** (${pdf.length} PDF + ${catalog.length} catalog).
- Nepali route allowlist: **${routeSet.size}** (${pdfRoutes.length} PDF + ${utility.length} catalog).
- Registered Nepali blog articles: **${blogSlugs.length}**.
- Tool slugs referenced by current targeted Nepali unit-test files: **${targetedSlugs.size}**.

## Gate results

- Missing Nepali routes: ${missingRoutes.length}.
- Missing dedicated workspace dispatch (PDF tools use the PDF workspace): ${missingDispatch.length}.
- Missing localized title in the catalog route source (PDF titles are sourced from the PDF name dictionary): ${missingTitles.length}.
- Duplicate blog slugs/titles/descriptions: ${duplicate(blogSlugs).length}/${duplicate(blogTitles).length}/${duplicate(blogDescriptions).length}.
- Explicitly indexable localized tool slugs: ${indexable.size}.
- Native-speaker review certified: **No**.
- Per-tool Nepali browser QA certified by this static report: **No**.

## Important interpretation

Route registration is not proof that every label, hint, validation message, error, output, download, keyboard interaction or mobile state is translated or correct. Dedicated workspace dispatch is not the same as an individually tested implementation. Native-speaker review is never inferred from source text. Keep pages noindex until content and functional review have actually passed.

See \`NEPALI_SOURCE_AUDIT.json\` for per-tool evidence and explicit gaps.
`;
fs.writeFileSync(path.join(out, "NEPALI_SOURCE_AUDIT.md"), md);
console.log(`Nepali source audit generated: ${routeSet.size} localized route registrations / ${unique.length} canonical tools; ${targetedSlugs.size} tool slugs referenced by targeted unit-test files.`);
if (missingRoutes.length || duplicate(all).length || duplicate(blogSlugs).length || duplicate(blogTitles).length || duplicate(blogDescriptions).length) process.exitCode = 1;
