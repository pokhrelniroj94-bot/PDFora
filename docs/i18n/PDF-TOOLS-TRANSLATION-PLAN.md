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
