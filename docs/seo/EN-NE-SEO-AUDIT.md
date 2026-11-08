# English and Nepali SEO audit

Audit scope: English and Nepali blog index/article routes, English catalog tool routes, Nepali localized catalog tool routes, metadata generation, canonical/hreflang policy, robots and sitemap. This report describes source-level findings; it is not a Google indexing or ranking report.

## Current source inventory

- English catalog: 124 catalog entries; 123 use `/tools/<slug>` and Resume Builder uses its dedicated `/resume-builder` route. The non-tool `pdf-tools` directory entry is excluded from the tool page count.
- English catalog tool metadata: 123 unique title/description pairs. 50 tools have dedicated title and description overrides; the other 73 use a unique title from the catalog name and a catalog description with category-specific usage guidance. Resume Builder has a separate dedicated title, description and canonical.
- Nepali catalog equivalents: 123 registered tool routes with 123 distinct Nepali title and description entries. Resume Builder has its own dedicated localized metadata.
- Nepali localized tools: remain `noindex,follow` until each page has native-speaker review, functional verification and explicit release approval. The six already-approved Nepali PDF routes remain the only localized tool URLs eligible for indexing and hreflang.
- PDF tools: all 49 English and all 49 Nepali PDF tool pages have unique tool-specific titles and descriptions. The Nepali versions use self-canonicals; only six are indexable under the current verification allowlist.
- Editorial guides: 8 English PDF guides, 19 English Nepal guides and 27 Nepali translated editorial guides. The Nepali blog routes and translations are checked by the existing blog regression suite.
- Generated catalog helper guides remain excluded from the sitemap and noindex. Do not publish/index them just to increase URL count.

## Verified source-level safeguards

- English and Nepali tool pages generate page-specific titles and descriptions; English metadata has canonical, Open Graph and Twitter fields.
- Nepali tool metadata uses the explicit route dictionaries and shared locale metadata builder.
- Locale routing emits hreflang only for real published equivalents and includes a reciprocal self-reference plus x-default.
- Sitemap entries use the same localized indexability allowlist as metadata. Generated catalog guides are filtered out.
- Robots allows crawlers to read page-level noindex directives and disallows API routes.
- Editorial checks enforce unique titles/descriptions within each content collection, meaningful introductions/sections/FAQs, valid internal tool links, and primary sources for selected high-impact Nepal finance, tax and public-information topics.

## Risks and work still required

1. Metadata uniqueness does not prove search intent fit, click-through rate, factual accuracy, native-language quality or ranking potential. Review each title/H1/description against the actual tool UI and likely query before publishing.
2. 74 English tools still use catalog-derived fallback descriptions rather than hand-written per-tool search snippets. They are unique and grounded in the catalog, but should be prioritized for manual refinement using Search Console query/impression data.
3. Tool-page explanatory content uses reusable category guidance. The interactive tool is the main utility, but generic copy should not be expanded into many near-duplicate indexable guide pages. Add original tool-specific examples, input/output explanations and limitations only where they materially help users.
4. Nepali tool pages should not be moved into the indexability allowlist until a native Nepali reviewer has checked terminology, form labels, errors, result text and metadata, and the exact page has passed browser tests on desktop and mobile.
5. Verify rendered production HTML, HTTP status, canonical, hreflang reciprocity, sitemap fetch and robots directives after an approved preview/release. Source tests alone do not verify the deployed output.
6. Use Search Console performance and indexing reports to prioritize updates. Never promise traffic, indexing or rankings based on metadata changes alone.

## Google Search Central principles used

- Unique, concise and accurate page titles; unique, relevant descriptions; and page content that supports the title.
- Locale-specific URLs and reciprocal hreflang for actual translated equivalents only.
- People-first, original, accurate content with visible sources and transparent authorship where appropriate.
- Avoid scaled content that exists primarily to manipulate rankings; exclude thin/unreviewed generated pages from Search.
- Structured data must describe visible page content and meet Google's quality policies.

References:
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/essentials/spam-policies
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
