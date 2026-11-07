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
- Page-relevant structured data and useful tool-guide content were preserved; obsolete FAQPage markup was removed from generic tool and blog pages because Google no longer shows FAQ rich results for ordinary sites.

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

A live crawl of `/merge-pdf` exposed the same PDF practical guide twice in the rendered page. Source inspection confirmed that the guide was rendered both by the route layout and again inside the shared `PDForaTool` and `Niroj77Tool` client components. This duplicated the full guide and its FAQ/schema output on standalone PDF tool pages that use both layers.

The release branch `seo/duplicate-content-audit-fix-2026-11-07` removes the second render from both shared workspaces, leaving each route layout as the single owner of the English PDF SEO guide. A regression assertion now guards this ownership. The Nepali dynamic PDF route continues to render its dedicated `ToolGuide` separately.

The same live crawl also found older, page-specific how-to and FAQ blocks on `/merge-pdf` and `/delete-pages` that overlap with the shared guide. These are being removed from those routes so the tool page has one clear guide structure. The same cleanup has now been applied to eight additional legacy PDF pages with large overlapping feature/how-to/FAQ blocks: `/compress-pdf`, `/extract-pages`, `/images-to-pdf`, `/pdf-to-excel`, `/pdf-to-jpg`, `/pdf-to-word`, `/split-pdf` and `/watermark`. Each keeps its original title, description and actual tool workspace; the route layout owns the full practical guide. Other standalone PDF routes still require an individual rendered-page comparison before their legacy copy can safely be consolidated.

## Metadata inventory checks — 2026-11-07

A source-level inventory of all 124 English catalogue tools found 124 unique tool names, 124 unique source descriptions and 124 unique keyword fields. The metadata generator has 50 explicit SEO overrides; all other tools now use their own catalog description directly rather than appending category-level boilerplate. The source descriptions range from 45 to 148 characters and are unique; no artificial minimum length is imposed because relevance is more important than padding. All 124 catalogue tools have an explicit advice entry with a task-specific example, accuracy note, workflow and common mistakes in `CatalogToolSEOContent.tsx`. Regression tests now check coverage and substantive field lengths.

A regression check is being added to `verify-tool-catalog.mjs` so future catalogue edits cannot silently introduce duplicate names, descriptions, titles or meta descriptions. A separate inventory of the 49 PDF route guides also found 49 unique names, target phrases and purposes; every guide has three task-specific steps and a caution of at least 60 characters. These source checks do not replace rendered-page QA.

## Quality risks requiring page-level review

- Catalog tool pages use shared category guidance and category-based FAQ fallbacks. This is useful baseline help, but it is not a substitute for tool-specific examples, supported-input details, edge cases and output limitations. Keep each page indexable only when its actual tool functionality and page content provide distinct value.
- The English blog index contains many catalogue-generated guides with similar title/description patterns. These are excluded from the sitemap and marked noindex where generated; preserve that gate until each guide has been independently edited and verified.
- Nepali publication is intentionally limited: the current indexable localized PDF allowlist contains six routes. The other localized tool interfaces remain noindex and out of sitemap/hreflang pending full translation, functional QA and human review.
- Do not merge language variants into one canonical URL. Each genuinely translated page needs its own self-canonical and reciprocal hreflang only when both versions are complete and indexable.
- Search Console indexing, impressions, clicks and query performance cannot be inferred from a code audit. Those require the connected Search Console property and post-deployment data.



## Search Console content opportunities — 2026-11-07

The connected Search Console property `https://pd-fora.vercel.app/` returned 860 search-analytics rows for the available 28-day window (2026-10-10 to 2026-11-06): 1,304 impressions, 1 click, 86 distinct landing pages and 414 distinct queries. These are small-sample observations, not a traffic forecast.

The strongest immediate opportunity is `/tools/tip-calculator`: 120 impressions, including 115 for “tip calculator”, at an impression-weighted average position of about 6.2, but no clicks in the returned window. The live page title still displays “Free Tip Calculator Online | PDFora”, while the current repository source has a more descriptive title override (“Tip Calculator – Calculate Tip, Total & Split the Bill”). The production deployment is behind the current repository, so the source override is not yet live.

The generated `/blog/tip-calculator-guide` received 102 impressions, mainly for “how to calculate tip”, at average position about 9.7. Its current live copy is a short shared-template guide and is noindex in the source. It is being replaced in the release branch by a genuinely editorial English guide plus a full Nepali translation at `/blog/how-to-calculate-tip-and-split-the-bill`, with the old generated URL redirected to the reviewed article. This converts an observed query opportunity into useful content rather than simply removing the page or making thin copy indexable.

Other priorities from the same window:
- `/delete-pages`: 205 impressions but average position about 74.5; needs a dedicated page-level content and SERP review.
- `/blog/meta-title-checker-guide`: 212 impressions but average position about 80.8; it remains a generated noindex guide until it can be rewritten with original, accurate Google title-link guidance.
- `/blog/split-pdf-and-extract-selected-pages`: 139 impressions at average position about 84.5; needs query-to-content relevance review before any rewrite.

The Search Console connector data is delayed by several days, so the 28-day window is not a real-time report. Organic traffic and rankings are not guaranteed by these changes.


## Search Console sitemap status — 2026-11-07

The connected Search Console Sitemaps report shows `https://pd-fora.vercel.app/sitemap.xml` with 257 submitted URLs, zero reported errors and zero warnings. The deprecated sitemap `indexed` field is not used as an index-coverage measure. The sitemap report confirms successful retrieval, not that every submitted URL is indexed.

The two reviewed bilingual articles increase the curated Nepali localized blog collection from 27 to 29 posts. The old generated `tip-calculator-guide` remains a noindex redirect source; the new reviewed article has a distinct slug and a self-canonical localized counterpart.

## Google Search Central references

- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — original, useful content; no target word count; avoid mass-produced search-first pages.
- [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization) and [consolidating duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) — choose one representative URL and use redirects/canonicals consistently.
- [Localized versions of pages](https://developers.google.com/search/docs/specialty/international/localized-versions) — fully translated language variants, reciprocal hreflang and distinct language URLs.
- [Google Search Essentials](https://developers.google.com/search/docs/essentials) — crawlable links, descriptive page titles and appropriate search appearance controls.



## Second Search Console-driven article — 2026-11-07

The generated `/blog/meta-title-checker-guide` page received 212 impressions in the 28-day Search Console sample, mainly for “seo title check” (73 impressions) and “meta title check” (46 impressions), at average position about 80.8. Its prior copy was a generic shared-template guide and remained noindex. The release branch now redirects that old URL to a new original English article, `/blog/how-to-write-seo-page-titles-google-title-links`, with a full Nepali translation and links to Google's primary title-link documentation. It explains that Google can generate title links from multiple page signals, that Google does not publish a fixed title character limit, and that title/meta descriptions cannot guarantee ranking or display.

The curated Nepali localized blog collection now contains 29 articles. The new English and Nepali versions have distinct language URLs, self-canonicals and reciprocal hreflang through the shared route registry.

## Expanded 173-tool and site-page audit — 2026-11-07

The unified catalogue is confirmed as 173 unique tools: 49 established PDF routes and 124 catalogue utilities. The 124 utility entries have unique names and descriptions, and each has four dedicated guidance fields (example, accuracy, workflow and mistakes). The shared utility page renderer also retains tool-specific questions where available and category-level fallback questions; visible FAQs remain on the page, but FAQPage JSON-LD has been removed from utility pages, English/Nepali articles, English/Nepali PDF guides and the Nepali homepage. Google announced in May 2026 that FAQ rich results are no longer shown in Search; FAQ text remains useful for readers and can still inform ordinary snippets.

The utility metadata fallback now uses each tool's own catalogue description directly instead of appending a generic category paragraph. The fallback title identifies the actual tool and PDFora. Existing 50 reviewed title/description overrides are retained. The route continues to emit a self-canonical URL, Open Graph and Twitter metadata, BreadcrumbList and SoftwareApplication structured data. OCR remains excluded from indexing until its processing backend is available.

The audit also found missing social preview metadata on the NEPSE market page, NEPSE strategy lab and resume builder. Open Graph/Twitter metadata has been added to those landing pages. The About title was made more descriptive. Main landing-page and article regression tests now cover canonical, Open Graph, Twitter and indexing metadata.

Nepali catalogue tool routes remain default-deny for indexing. The current explicit localized utility route list is not itself an indexing approval: only the six reviewed Nepali PDF equivalents are indexable and included in hreflang/sitemap. Nepali home, blog, policy, market and resume routes use the shared locale metadata builder. Generated catalogue blog guides remain excluded from the sitemap and noindex until individually edited and reviewed.

## Remaining work after source changes

- Complete CI (catalog/i18n, lint, production build, backend regression tests and dependency audits) for the final branch head.
- Run an HTTP crawl of all 173 tool URLs and the rest of the sitemap against the deployed release; compare rendered title, description, canonical, robots, hreflang, JSON-LD, response status and page content.
- Verify every tool's actual rendered instructions and output against its implementation, including edge cases and mobile behavior. Source-level advice coverage is not proof that a tool works.
- Reconcile sitemap URLs with Search Console indexed/not-indexed reports after deployment. Do not claim indexing or traffic improvement before Google recrawls the pages.
- Review all non-generated editorial articles for first-hand value, accurate references, dates and non-overlapping search intent.
