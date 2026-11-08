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
- Added SoftwareApplication and BreadcrumbList JSON-LD to the per-tool guide using the actual tool name, purpose and canonical page URL. FAQPage markup was subsequently removed because Google no longer shows FAQ rich results in Search; visible FAQs remain for readers.
- Added automated checks for title/tool-name matching, 80–160 character descriptions, canonical URL and indexability for all 49 English tool pages.
- The non-English locale routes remain unpublished. This metadata work does not publish translations or add hreflang for incomplete localized routes.


## Validation status (2026-11-06)

- Static source checks confirm 49 unique Nepali guide entries and exactly 49 purpose, steps and caution fields.
- All 49 standalone PDF route files were checked to confirm they use the shared metadata helper.
- Automated tests have been added for guide completeness and metadata shape, but they have not been executed in a project runtime in this session.
- GitHub reports no workflow runs for the latest commits. The Vercel status check on the latest docs commit failed with a Vercel build-rate-limit/upgrade notice; this is not evidence of a source-code build failure or success.
- Do not merge or deploy until the build-rate-limit issue is resolved and the full test, lint, build and browser QA suite passes.


## Step 6 — Nepali workspace headings and form fields (2026-11-06)

- Extracted the 49 reviewed Nepali tool names into a shared module.
- Both PDF workspace components now display the Nepali tool title and the tool-specific Nepali purpose as the main description on Nepali paths.
- Added translations for the PDF workspace's known tool-specific labels and placeholders, including page ranges, watermark, password, rotation, Bates numbering, metadata, bookmarks, headers/footers and image quality.
- Added tests for representative field-label translations. Unknown labels intentionally remain visible in their source language rather than disappearing.
- The page-level wrapper headings and custom explanatory copy in some standalone route files are still English. The non-English route publishing gate remains closed until those page shells and all workspace options are translated and browser-tested.


## Step 7 — Workspace heading hierarchy and navigation (2026-11-06)

- Removed the duplicate H1 from the shared upload workspaces. Each of the 49 route pages keeps its route-level H1 as the primary page heading; the workspace title is now a subordinate heading.
- Nepali tool names and purpose copy remain visible in the shared workspace heading area when the locale is Nepali.
- Home/back navigation now preserves the selected locale prefix.
- Default text examples such as DRAFT and the Bates prefix are translated only for Nepali; numeric and API enum values are left unchanged.

## Step 8 — SEO copy review and build-time quality gates (2026-11-06)

- Removed the unsupported claim that people search for a particular phrase; the guide introduction now explains the actual task workflow in natural language.
- Made the related-task FAQ question tool-specific instead of repeating the same generic question on every page.
- Extracted the PDF metadata generator into a pure helper so its title, description, canonical, robots, Open Graph and Twitter output can be unit-tested without Node module-resolution workarounds.
- Added tests for all 49 Nepali tool display names and uniqueness/length/canonical/indexing of all 49 English metadata descriptions.
- Added build-time gates for the 124-tool catalog verification, the 19 i18n/SEO tests, the locale completeness check and ESLint.
- Vercel preview build for commit e07a166 passed the catalog check, all 19 tests, locale check with no blocking problems, TypeScript and optimized Next.js build; deployment reached READY. This was a preview deployment, not a production promotion.
- Latest commit adds ESLint to the same prebuild gates; its Vercel check is still running and must be confirmed before calling the branch fully validated.
- Non-English locales remain unpublished/noindex. The guide translations alone do not make the entire page workspace and route shells ready for indexing.
