# PR #64 — PDFora bilingual SEO production release checklist

**Release policy:** keep unfinished locale/tool pairs noindex,nofollow and out of the indexable sitemap. Do not switch all 49 pages to indexable in one global change.

## Per-tool QA matrix

| # | Slug | EN copy | NE copy | /en route | /ne route | Metadata + hreflang | Sitemap | Browser QA | Release |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | add-background | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 2 | add-blank-pages | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 3 | add-bookmarks | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 4 | add-page-numbers | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 5 | bates-numbering | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 6 | compare-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 7 | compress-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 8 | crop-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 9 | delete-pages | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 10 | edit-pdf-metadata | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 11 | extract-bookmarks | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 12 | extract-fonts | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 13 | extract-images | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 14 | extract-page-images | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 15 | extract-pages | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 16 | flatten-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 17 | grayscale-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 18 | header-footer | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 19 | images-to-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 20 | merge-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 21 | page-counter | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 22 | pdf-information | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 23 | pdf-to-bmp | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 24 | pdf-to-csv | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 25 | pdf-to-excel | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 26 | pdf-to-html | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 27 | pdf-to-jpg | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 28 | pdf-to-json | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 29 | pdf-to-markdown | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 30 | pdf-to-png | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 31 | pdf-to-text | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 32 | pdf-to-tiff | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 33 | pdf-to-webp | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 34 | pdf-to-word | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 35 | protect-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 36 | remove-annotations | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 37 | remove-attachments | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 38 | remove-blank-pages | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 39 | remove-pdf-links | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 40 | remove-pdf-metadata | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 41 | reorder-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 42 | repair-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 43 | rotate-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 44 | rotate-selected-pages | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 45 | sign-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 46 | split-by-bookmarks | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 47 | split-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 48 | unlock-pdf | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |
| 49 | watermark | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | HOLD |

## Technical acceptance gates

- [ ] Both locale routes return HTTP 200 and render the correct language server-side.
- [ ] Each locale has a self-referencing canonical.
- [ ] Reciprocal en, ne and x-default alternates are emitted only when BOTH translations are complete and reviewed.
- [ ] Incomplete locale returns noindex,nofollow and is absent from the indexable sitemap.
- [ ] Final rendered title is under 60 characters and description under 160 characters; check after title templates.
- [ ] JSON-LD matches visible page content; omit FAQPage if there are no visible FAQs.
- [ ] Nepali font uses Noto Sans Devanagari with font-display: swap; preload only the used weight on Nepali routes.
- [ ] No automatic IP-based redirect; language switcher links only to real equivalent pages.
- [ ] All 49 tools pass mobile and desktop upload, options, processing, error and download smoke tests.
- [ ] verify:tools, i18n:test, i18n:check, lint and production build pass on the exact release SHA.
- [ ] Vercel deployment is READY and its commit SHA equals the PR head SHA.
- [ ] Search Console inspection confirms intended canonical and indexability after deployment.

## Current blockers to resolve

- English currently uses unprefixed URLs; /en redirects to root.
- Nepali is unpublished in the locale configuration.
- Localized route registry currently has only the home page, not all 49 PDF tools.
- Existing PDF tool metadata and sitemap use root tool URLs, not paired /en and /ne URLs.
- Root layout currently uses Geist; the Nepali font utility must be wired into a locale-specific layout.
- Vercel previously returned build-rate-limit; the exact latest commit still needs a successful deployment.

## Vercel recovery sequence

1. Batch reviewed code changes to avoid unnecessary duplicate builds.
2. Run all local validation commands before requesting another deployment.
3. Wait for available build quota/window; do not bypass failing checks.
4. Trigger one preview build and verify its SHA matches the PR head.
5. Run browser QA against that preview before enabling any locale indexing.
6. Publish locale/tool pairs only after their own checklist row is fully passed.