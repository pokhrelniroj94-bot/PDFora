# Remaining work

## Required before claiming full 12-language support

1. Translate and review shared UI, metadata, tool interfaces, guides, blogs, forms,
   errors, legal pages and accessibility labels for each unpublished locale.
2. Add real localized route equivalents only after the complete page content exists.
3. Add native or qualified human review status for every published translation.
4. Expand RTL and CJK browser checks across representative tools and mobile layouts.
5. Add localized content for the remaining blogs, guides and remaining utilities.
   Three Nepali articles and four Nepali legal/static pages are implemented and
   measured; broader editorial and utility localization remains.
6. Execute the 2,076-row tool-language workflow matrix with browser and functional
   evidence; the current matrix records source/route status but does not claim every
   workflow has been individually tested.

## Stage B completed in this continuation

- Shared footer and PDF directory copy is centralized for English and Nepali.
- Shared UI tests verify required labels, category coverage and localized-route
  behavior.
- Cookie consent copy is now localized for English and Nepali, including dialog,
  settings, optional categories and accessibility labels.
- Nepali now has a localized homepage, six reviewed PDF route pages, six reviewed utility route pages, seven financial/news/calculator route pages, three career/AI routes, a market dashboard, a blog index, three reviewed articles and four reviewed legal/static pages. The 33-route count is derived from the shared route registry.
- The remaining English/Nepali route surfaces still require page-specific migration,
  especially the remaining blogs, guides, utilities and form/error messages.
- The new tool-language matrix accounts for all 12 locales and 173 unique tools;
  Hindi, Bengali, Urdu, Arabic, Spanish, French, German, Portuguese, Simplified
  Chinese and Japanese remain unpublished.

## Required before merge

1. Run backend pytest, dependency audits and representative PDF workflows.
2. Run route, sitemap, canonical, hreflang, structured-data and accessibility checks.
3. Keep the Next.js `proxy.ts` convention aligned with future framework upgrades.
4. Review the generated coverage report and update publication status only for
   genuinely reviewed content.
5. Inspect PR checks and preview HTTP responses; do not merge or deploy without
   explicit approval.

Current verification evidence:
- Frontend Jest: 5/5.
- i18n/rendered-content tests: 30/30; translation coverage: 2/2; tool-language matrix: 2/2.
- Catalog verification: 173 unique available tools (49 PDF + 124 catalog utilities).
- Frontend production build: PASS, 399 generated routes.
- Backend pytest: 27 passed in an isolated environment with project requirements.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- `pip-audit -r backend/requirements.txt`: no known vulnerabilities.

## Explicitly not claimed

- No language is claimed as fully translated merely because its locale is registered.
- No search traffic, ranking, indexing or Search Console result is claimed.
- No production deployment was performed by this branch.
- Nepali privacy, terms, about and contact routes are published only after
  rendered-content checks; other static/editorial routes remain on honest fallback
  routing.
