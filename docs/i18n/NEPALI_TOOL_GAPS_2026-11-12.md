# Nepali tool localization backlog — 2026-11-12

Generated from a source-level comparison of `frontend/components/toolCatalog.ts` (120 canonical catalog utilities) against `frontend/lib/i18n/nepali-tool-routes.ts` (70 Nepali catalog-tool route entries).

**Current inventory:** 49 PDF tools + 70 Nepali catalog utility route entries = 119 route entries. **50 catalog utilities have no Nepali route entry yet.** This is a route-registry audit, not a claim that all 119 existing entries have complete translations or have passed native-speaker and end-to-end review.

## Missing Nepali catalog tool routes (50)

### Career, finance and conversion
- [ ] `resume-builder`
- [ ] `currency-converter`
- [ ] `savings-goal-calculator`
- [ ] `nepal-share-calculator`

### Image and design
- [ ] `image-compressor`
- [ ] `image-format-converter`
- [ ] `color-picker-palette`
- [ ] `color-contrast-checker`
- [ ] `color-converter`
- [ ] `css-gradient-generator`
- [ ] `aspect-ratio-calculator`
- [ ] `px-rem-converter`

### Security and developer tools
- [ ] `password-generator`
- [ ] `uuid-generator`
- [ ] `regex-tester`
- [ ] `jwt-decoder`
- [ ] `css-minifier`
- [ ] `json-to-csv`
- [ ] `xml-formatter-validator`
- [ ] `url-query-parser`
- [ ] `url-validator`
- [ ] `email-validator`
- [ ] `password-strength-checker`
- [ ] `csv-to-json`
- [ ] `json-to-yaml`
- [ ] `json-escape-unescape`

### SEO and publishing
- [ ] `meta-title-checker`
- [ ] `meta-description-checker`
- [ ] `keyword-density-checker`
- [ ] `robots-txt-generator`
- [ ] `sitemap-generator`
- [ ] `open-graph-preview`

### Text and encoding
- [ ] `text-to-binary`
- [ ] `binary-to-text`
- [ ] `text-to-hex`
- [ ] `hex-to-text`
- [ ] `morse-code-translator`
- [ ] `camel-case-converter`
- [ ] `snake-case-converter`
- [ ] `kebab-case-converter`
- [ ] `html-tag-stripper`
- [ ] `notes-to-pdf`
- [ ] `preeti-unicode-converter`
- [ ] `nepali-unicode-typing`

### Date, time and math
- [ ] `random-number-generator`
- [ ] `dice-roller`
- [ ] `unix-timestamp-converter`
- [ ] `date-add-subtract-calculator`
- [ ] `business-days-calculator`
- [ ] `roman-numeral-converter`

## Implementation gate for each tool

Do not mark a slug complete merely by adding a localized route or translated title. Each localized tool must include:
1. Natural Nepali tool title, description, instructions and relevant examples.
2. Nepali labels, placeholders, options, validation, errors, progress and result copy.
3. Correct locale-preserving navigation, `lang="ne"`, self-canonical metadata and translated SEO description.
4. Functional equivalence with the English implementation, including edge cases and unchanged numerical results.
5. Keyboard/mobile checks and native-speaker review.
6. Explicit owner approval before adding the page to the localized indexing allowlist, hreflang and sitemap.

Until all gates pass, keep the route out of indexable metadata. Do not copy English content into a Nepali URL and do not bulk-publish machine-translated filler.
