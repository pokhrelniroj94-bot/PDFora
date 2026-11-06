# PDF tools multilingual rollout

## Google Search Central requirements
- Keep one stable URL per language version; English keeps the existing unprefixed URLs.
- Publish a localized PDF-tool URL only after the page's main content and user interface are translated, reviewed, and functionally tested.
- Add reciprocal, fully-qualified hreflang alternates only between genuinely equivalent published pages; include the page itself and x-default.
- Keep incomplete locale previews noindex and exclude them from sitemap/hreflang.
- Do not redirect visitors automatically based on browser language; provide an explicit language switcher.
- Use a consistent language for visible content and navigation on each localized page. The HTML lang attribute is useful accessibility metadata but is not Google's language-detection signal.

## This branch
- Adds reusable UI copy for the 9 non-English locales already listed in the i18n locale registry: Nepali, Hindi, Spanish, French, German, Arabic, Simplified Chinese, Japanese and Korean.
- Wires shared upload, file selection, size-limit, processing, status, privacy/benefit and how-to strings into both PDF upload components: Niroj77Tool and PDForaTool.
- Adds a dictionary coverage unit test for all 10 supported locales including English.

## Not yet complete; do not publish non-English PDF URLs
The reusable UI is only one layer. Each of the 49 enabled PDF tools still needs:
1. Translated tool-specific title, description, field labels, placeholders, options and validation.
2. Translated tool-specific instructions, FAQs and SEO guide content.
3. Localized page routes, canonical and reciprocal hreflang mapping.
4. A full language-specific browser test of upload, processing, errors and downloads.
5. Human review of technical PDF terminology and right-to-left layout where applicable.

OCR remains excluded from the 49 enabled PDF tools until its backend language-data support is verified.

## Validation
Run from frontend with Node 22:
- npm run i18n:test
- npm run i18n:check
- npm run lint
- npm run build

No locale should be marked published until all localized PDF pages pass the checks above.

## Latest implementation update (2026-11-06)

- Shared PDF workspace strings are wired into both shared PDF tool components for all 10 configured locales.
- The common SEO guide section headings now have locale-specific labels, and the active locale is passed from each tool workspace into the server-rendered guide component.
- This is heading-level localization only. The guide paragraphs, per-tool title/description, field labels, FAQs and related links are not yet fully localized. Do not mark any non-English locale as published on this basis.
- The remaining work is to create reviewed per-tool content for all 49 slugs, localize every visible control and FAQ, ensure locale-aware internal links, then run translation completeness checks, lint, build and browser tests.


## Step 2 — Nepali guide naming and FAQ questions (2026-11-06)

- Added Nepali display names for all 49 PDF tool guide headings.
- Added Nepali versions of the six FAQ questions on each guide.
- Related PDF-tool links now preserve the selected locale prefix when a localized route is available.
- This step does not translate the 49 tool-specific purpose/steps/caution fields or the FAQ answers and long-form SEO paragraphs. Those remain incomplete and non-English locales must remain unpublished/noindex.
- CI has not run for the latest commit; the Vercel status check is pending. Do not merge or deploy based on this partial work.


## Step 3 — Nepali tool-specific guide batch 1 (2026-11-06)

- Added reviewed Nepali purpose, three usage steps and cautions for 10 tools: add-background, add-blank-pages, add-bookmarks, add-page-numbers, bates-numbering, compare-pdf, compress-pdf, crop-pdf, delete-pages and edit-pdf-metadata.
- Wired these fields into the server-rendered guide content when the locale is Nepali. The first three FAQ answers now use the translated purpose, steps and caution; the related-task, mobile-use and original-copy answers also have Nepali text.
- Remaining tool-specific guide batch: 39 of 49 slugs. The longer SEO paragraphs, remaining FAQ content, tool-specific UI controls, and route/hreflang validation are still outstanding.
- This is partial Nepali content only. Keep Nepali and all other non-English locales unpublished/noindex until the full page content is translated, reviewed and tested.


## Step 4 — Nepali guide copy for all 49 PDF tools (2026-11-06)

- Added Nepali purpose, three practical steps and tool-specific cautions for every enabled PDF tool (49/49).
- Connected the guide dictionary to the server-rendered SEO guide component. Nepali pages now use the translated purpose, steps and cautions in the first three FAQ answers.
- Localized the shared Nepali SEO guide paragraphs covering preparation, workflow, PDF compatibility, output quality, privacy, troubleshooting and study/work document use.
- Localized related-tool link labels when a Nepali tool name exists.
- Added an automated coverage test that checks the catalog contains 49 tools and every slug has non-empty Nepali purpose, three steps and caution.
- This does not mean the localized pages are ready to index: tool workspace labels/options/validation still need per-tool translation and browser testing. Metadata/canonical/hreflang, sitemap policy and complete SEO review also remain release gates. Keep non-English locales unpublished/noindex.


## Step 5 — Search metadata and structured data (2026-11-06)

- Added a shared metadata helper that generates a distinct title, concise description, relevant keywords, self-canonical URL, Open Graph fields and Twitter card fields from each tool's reviewed guide.
- Replaced the standalone metadata blocks on all 49 PDF tool route pages with the shared helper, keeping existing English canonical URL paths.
- Added SoftwareApplication and BreadcrumbList JSON-LD to the per-tool guide alongside the visible FAQPage schema. Schema uses the actual tool name, purpose and canonical page URL; no ratings or unsupported claims are fabricated.
- Added automated checks for title/tool-name matching, 80–160 character descriptions, canonical URL and indexability for all 49 English tool pages.
- The non-English locale routes remain unpublished. This metadata work does not publish translations or add hreflang for incomplete localized routes.
