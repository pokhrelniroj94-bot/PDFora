# SEO audit status

This is a factual implementation record for the current branch, not a ranking or
traffic claim.

## Verified

- English tool pages use shared `getPdfToolMetadata()` and retain unique titles,
  descriptions and self-referencing canonicals.
- Existing `/about`, `/privacy`, `/terms` and `/contact` metadata use their own
  canonical URLs.
- Published Nepali equivalents use self-referencing canonicals and reciprocal
  English/Nepali hreflang.
- Unpublished locales are not included in hreflang or the sitemap.
- The sitemap contains English routes and only the six reviewed Nepali PDF routes.
- Root `/en` redirects to the unprefixed English URL.
- Structured data and useful tool-guide content were preserved.

## Remaining validation

- Run a deployed HTTP crawl for every sitemap URL and compare status, canonical and
  robots output.
- Validate JSON-LD against rendered page content for tools, blogs and localized
  routes.
- Add reciprocal hreflang only when a translated equivalent has been reviewed and
  published.
- Localize metadata together with each future page; do not promote dictionary-only
  translations.

No ranking, indexing, traffic or Search Console submission is claimed by this audit.


## Live crawl findings — 2026-11-07

A live crawl of `/merge-pdf` exposed the same PDF practical guide twice in the rendered page. Source inspection confirmed that the guide was rendered both by the route layout and again inside the shared `PDForaTool` client component. This duplicated the full guide and its FAQ/schema output on standalone PDF tool pages that use both layers.

The release branch `seo/duplicate-content-audit-fix-2026-11-07` removes the second render from `PDForaTool`, leaving the route layout as the single owner of the English PDF SEO guide. A regression assertion now guards this ownership. The Nepali dynamic PDF route continues to render its dedicated `ToolGuide` separately.

The same live crawl also found older, page-specific how-to and FAQ blocks on `/merge-pdf` that overlap with the shared guide. These are being removed from that route so the tool page has one clear guide structure. Other standalone PDF routes still require an individual rendered-page comparison before their legacy copy can safely be consolidated.

## Metadata inventory checks — 2026-11-07

A source-level inventory of all 124 English catalogue tools found 124 unique tool names, 124 unique source descriptions and 124 unique keyword fields. The metadata generator currently has 50 explicit SEO overrides and nine category fallbacks; the resulting 124 English catalogue titles and descriptions were checked for duplicates and short/empty descriptions, with no duplicates or descriptions under 70 characters. All 124 catalogue tools also have a tool-specific advice entry in `CatalogToolSEOContent.tsx`. These checks establish metadata uniqueness and coverage, not the quality of every rendered page or its ability to rank.

A regression check is being added to `verify-tool-catalog.mjs` so future catalogue edits cannot silently introduce duplicate names, descriptions, titles or meta descriptions.

## Quality risks requiring page-level review

- Catalog tool pages use shared category guidance and category-based FAQ fallbacks. This is useful baseline help, but it is not a substitute for tool-specific examples, supported-input details, edge cases and output limitations. Keep each page indexable only when its actual tool functionality and page content provide distinct value.
- The English blog index contains many catalogue-generated guides with similar title/description patterns. These are excluded from the sitemap and marked noindex where generated; preserve that gate until each guide has been independently edited and verified.
- Nepali publication is intentionally limited: the current indexable localized PDF allowlist contains six routes. The other localized tool interfaces remain noindex and out of sitemap/hreflang pending full translation, functional QA and human review.
- Do not merge language variants into one canonical URL. Each genuinely translated page needs its own self-canonical and reciprocal hreflang only when both versions are complete and indexable.
- Search Console indexing, impressions, clicks and query performance cannot be inferred from a code audit. Those require the connected Search Console property and post-deployment data.

