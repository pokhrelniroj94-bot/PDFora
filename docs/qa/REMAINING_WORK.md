# Remaining work

## Required before claiming full 12-language support

1. Translate and review shared UI, metadata, tool interfaces, guides, blogs, forms,
   errors, legal pages and accessibility labels for each unpublished locale.
2. Add real localized route equivalents only after the complete page content exists.
3. Add native or qualified human review status for every published translation.
4. Expand RTL and CJK browser checks across representative tools and mobile layouts.
5. Add localized content for calculators, Nepal utilities, NEPSE, Forex, CV and AI
   workflows rather than treating shared dictionaries as completion.

## Stage B completed in this continuation

- Shared footer and PDF directory copy is centralized for English and Nepali.
- Shared UI tests verify required labels, category coverage and localized-route
  behavior.
- Cookie consent copy is now localized for English and Nepali, including dialog,
  settings, optional categories and accessibility labels.
- Nepali now has a localized homepage, six reviewed PDF route pages, and six reviewed utility route pages; all other
  Nepali destinations remain explicit fallback routes until their full content is
  translated and reviewed.
- The remaining English/Nepali route surfaces still require page-specific migration,
  especially blogs, legal pages, calculators, market tools and form/error messages.

## Required before merge

1. Run backend pytest, dependency audits and representative PDF workflows.
2. Run route, sitemap, canonical, hreflang, structured-data and accessibility checks.
3. Keep the Next.js `proxy.ts` convention aligned with future framework upgrades.
4. Review the generated coverage report and update publication status only for
   genuinely reviewed content.
5. Inspect PR checks and preview HTTP responses; do not merge or deploy without
   explicit approval.

## Explicitly not claimed

- No language is claimed as fully translated merely because its locale is registered.
- No search traffic, ranking, indexing or Search Console result is claimed.
- No production deployment was performed by this branch.
