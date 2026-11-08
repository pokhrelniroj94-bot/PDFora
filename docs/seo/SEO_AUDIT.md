# SEO audit status

This is a factual implementation record for the current release candidate, not a
ranking, indexing, traffic or Search Console claim.

## Verified in source and regression checks

- English PDF and catalog tool routes have route-specific titles, descriptions and
  self-referencing canonical URLs; legacy root PDF routes are redirected to their
  canonical root paths.
- The catalog sitemap includes the English homepage, tools directory, market page,
  all registered English PDF routes, all catalog utility routes except the
  `pdf-tools` collection and OCR route, the English blog index and curated editorial
  articles, and English trust pages.
- OCR is excluded from the sitemap and marked noindex.
- Generated catalog-guide articles are excluded from the sitemap until editorial
  review.
- The Nepali tool-indexing policy is default-deny. Only the six explicitly reviewed
  Nepali PDF tool routes may be indexed and receive reciprocal English/Nepali
  hreflang. Other localized tool routes remain crawlable with noindex,follow and are
  excluded from localized tool sitemap entries and hreflang.
- The Nepali home, market, Resume Builder, blog, legal pages and curated localized
  blog articles are listed as separate localized destinations; this is distinct
  from the six approved localized tool pages.
- `robots.txt` allows crawling of page HTML so Google can read noindex directives
  and disallows API routes. It advertises the root sitemap.
- Global layout structured data declares WebSite and Organization. The
  SoftwareApplication entity is emitted only on the homepage, where the site is
  described as an application; WebSite inLanguage follows the rendered language.
- SEO regression tests check the default-deny localized indexability gate,
  canonical and reciprocal hreflang mappings, generated-guide sitemap exclusion,
  robots access to noindex pages and structured-data language.

## Google Search guidance applied

- Sitemap entries are absolute canonical URLs intended for search results. URLs
  marked noindex and generated unreviewed guides are not submitted as indexable
  sitemap entries.
- Sitemap priority and change-frequency fields are retained only as metadata;
  Google documents that it ignores these fields. No fabricated `lastmod` dates are
  added. Add `lastmod` only when a significant content change date can be verified.
- Tool functionality is the primary value of a tool page. Supporting guidance,
  examples, limitations and FAQs must be accurate and useful rather than duplicated
  keyword text. Financial and Nepal-specific claims require current assumptions and
  responsible-source verification.
- SEO scores, schema markup, sitemap submission and canonical declarations do not
  guarantee indexing or rankings.

## Remaining validation before release

- Run a deployed HTTP crawl for every sitemap URL and compare response status,
  canonical, robots directives, title and description.
- Validate rendered JSON-LD against visible page content for tool, blog and
  localized pages.
- Check Core Web Vitals and mobile rendering on representative tool categories.
- Review catalog-page content quality and source accuracy; keep weak or unfinished
  pages out of indexing until they provide distinct user value.
- After production release, submit or refresh the sitemap in Search Console and
  inspect representative URLs. Google decides whether and when to index them.

No ranking, indexing, traffic or Search Console submission is claimed by this audit.
