# PDFora Top-5 Organic Search Roadmap
**Prepared:** 16 November 2026  
**Property:** https://pd-fora.vercel.app/  
**Repository:** pokhrelniroj94-bot/PDFora  
**Purpose:** Build a measurable, Google Search Central-aligned route toward top-five organic positions for the most valuable query clusters. This is an optimization target, not a ranking guarantee.

## Executive assessment

PDFora has a broad catalogue, but broad coverage alone will not put every URL in the top five. The current opportunity is to grow a smaller number of strong page clusters, then expand only where search demand and product quality justify it.

The first priority is not another batch of generic articles. It is:
1. Protect the high-intent pages already appearing around positions 5–10.
2. Improve the usefulness and task-specific clarity of calculator and PDF landing pages.
3. Resolve pages that Google has crawled but not indexed.
4. Build differentiated topical authority for Nepal-specific utilities.
5. Measure organic clicks and useful tool starts/completions, not impressions alone.

## Evidence baseline

### Search Console: latest complete 28-day period available

The connected verified Search Console property returned the period **17 October–13 November 2026** for the last complete 28-day reporting window.

- Page-dimension report: **17,617 impressions and 6 clicks** (approximately **0.03% CTR** across the rows returned by the report).
- Device breakdown: Desktop **14,524 impressions / 5 clicks**; Mobile **1,464 / 1**; Tablet **18 / 0**.
- Country examples: United States **3,776 impressions / 2 clicks** (average position 61.1); Brazil **3,041 / 0** (13.5); Russia **804 / 2** (17.7); United Kingdom **1,139 / 0** (72.8). These are country aggregates, not proof that a single query ranks at those positions.
- Search Console page and query totals can differ by dimension, and anonymised queries are not all exposed. Treat average position as an aggregate, not a fixed rank for every searcher.

### Pages closest to page one

| Page | Impressions | Average position | Interpretation |
|---|---:|---:|---|
| /blog/savings-goal-calculator-guide | 1,476 | 8.6 | High-priority guide |
| /blog/reading-time-calculator-guide | 1,042 | 6.8 | High-priority guide |
| /tools/reading-time-calculator | 963 | 7.3 | High-priority tool |
| /blog/tip-calculator-guide | 1,179 | 9.7 | High-priority guide |
| /tools/tip-calculator | 207 | 8.0 | High-priority tool |
| /tools/savings-goal-calculator | 580 | 9.0 | High-priority tool |
| /blog/percentage-change-calculator-guide | 339 | 8.9 | High-priority guide |
| /tools/percentage-change-calculator | 418 | 10.3 | High-priority tool |

All eight of these priority URLs were **indexed**, fetched successfully by Google, allowed by robots, and had Google canonicals matching the declared canonical when inspected on 16 November. Their last recorded crawls were 11–13 November. Their weak click totals therefore cannot be explained simply by those URLs being blocked or missing from the index.

The query/page inspection also shows that **“how to calculate tip”** maps to the tip guide, while **“tip calculator”** maps primarily to the actual calculator. Preserve this separation: the guide answers the how-to intent; the tool fulfils the calculation intent.

### Indexing and crawl risks

- The sitemap endpoint was reported as submitted with **437 URLs**, with **0 warnings and 0 errors** on 16 November. A submitted URL count is not an indexed-URL count and does not guarantee indexing.
- URL inspection found **/merge-pdf** and **/rotate-pdf** in “Crawled – currently not indexed”; both were crawl-allowed and fetched successfully. **/pdf-to-excel** was also “Crawled – currently not indexed” and its last recorded crawl was **22 September 2026**.
- The latest saved technical crawl (13 November) sampled **50 pages** and reported 327 URLs not crawled because the 50-page limit was reached. The result is not a complete 437-URL technical audit.
- The current sitemap and localized indexing gates should be preserved. Unreviewed generated guide pages must remain out of the index until they provide distinct, reviewed value.

## Competitor and search-intent research

This is a representative live SERP/page comparison, not a paid keyword-volume or full backlink study. OpenSEO keyword/SERP/backlink credits were unavailable (zero remaining), so no search volume, difficulty, backlink count or exact competitor position is claimed.

### Generic PDF tools

The generic PDF market is dominated by established products and suites such as iLovePDF, Smallpdf and PDF24. Their scale makes broad head terms such as “PDF tools” or “merge PDF” expensive to compete for quickly. PDFora should target specific workflows and long-tail needs first: selected-page extraction, page rotation, metadata editing, bookmarks, text-based table extraction, and clearly explained file limits and privacy/processing behaviour.

### Reading-time calculator

Representative competitor pages offer a clear input-to-result flow, adjustable WPM, reading/speaking estimates, and sometimes listening/skimming or language-specific baselines. PDFora already offers reading and speaking estimates. Its useful differentiators should be accurate word-count behaviour, editable speeds, transparent limits (whitespace-separated words), and practical examples—not unsupported claims that one WPM speed fits everyone.

### Savings-goal calculator

Competitor examples commonly explain the target, existing savings, deadline, interest assumption and regular deposit amount; some also offer reverse planning, inflation and progress charts. PDFora's current tool estimates weekly or monthly deposits with periodic compounding. Clearly explain that model, show a zero-interest baseline, and never imply that assumed interest is guaranteed.

### Tip calculator

Competitor examples often add tax treatment, adjustable tip bases, rounding and richer split options. PDFora currently calculates tip amount, bill plus tip and an equal per-person split, while warning users to check service charges. Keep the existing simple workflow honest; do not advertise tax or item-by-item splitting until implemented.

### Percentage change

Useful competitors explain the original-value baseline and the difference between percentage change and percentage points. PDFora's forward and reverse modes are a useful feature. Make the mode, the values being entered and the non-zero/greater-than-minus-100% constraints unmistakable.

Representative competitor pages reviewed:
- Reading: https://www.readcalc.com/tools/ ; https://rankato.com/tools/reading-time-calculator
- Savings: https://a2z.tools/savings-goal-calculator ; https://infochef.online/tools/savings-goal-calculator
- Tip: https://www.pearson.com/channels/calculators/tip-calculator
- Percentage change: https://czoa.com/tools/percentage-calculator ; https://freetoolr.com/calculators/percentage-change-calculator
- PDF comparison examples: https://kitset.app/task/merge-pdf/ ; https://rankite.com/blog/best-free-pdf-merger-tools

## Prioritized execution plan

### P0 — protect indexation and crawl quality

1. Inspect every canonical URL in the sitemap, not just the first 50. Record HTTP status, indexability, canonical, robots directives, title, description, H1, hreflang reciprocity, redirect destination and internal-link discovery.
2. Separate sitemap membership from actual indexing. Remove only URLs that are genuinely non-canonical, redirected, unavailable, noindex or not useful; do not blanket-submit or repeatedly request indexing for unchanged pages.
3. For Merge PDF, Rotate PDF and PDF to Excel, review rendered content, distinct task value, internal links, page speed and tool reliability before requesting another crawl. Do not manufacture extra text just to force indexing.
4. Keep unpublished/incompletely translated locales and unreviewed generated guides out of the index. Never publish language alternates for pages that are not genuinely equivalent.

### P1 — win the existing page-one opportunities

1. Keep separate tool and guide targets when their intent differs. The GSC evidence supports this for tip calculator versus “how to calculate tip”.
2. Improve the actual task instructions, examples, limitations and output explanations on Reading Time, Savings Goal and Percentage Change tools.
3. Preserve concise, descriptive titles and useful meta descriptions already reviewed in the recent SEO work. Do not change titles in bulk or chase a fixed character count as a ranking factor.
4. Review query-to-page and country/device data after each change. Change one meaningful element at a time and allow enough data to evaluate it.
5. Track consent-approved tool starts, completions and guide-to-tool clicks so rankings translate into real use.

### P2 — build differentiated topic clusters

**PDF workflow cluster:** Merge, split, compress, rotate, extract/delete selected pages, PDF to Word/Excel/Text/Image, bookmarks and metadata. Each landing page must explain its own supported input, limits, actual processing location, output and failure cases. Create a guide only when it answers a distinct workflow question.

**Calculator cluster:** Reading time, savings goal, tip, percentage change, prime number, discount, business days, salary and other calculators. Use tested examples and explain formulas, units, edge cases and assumptions.

**Nepal utilities cluster:** BS–AD date, land units, Tola–Gram, NRB rates, VAT, salary tax, NEA electricity, NEB GPA, Loksewa photo and NEPSE tools. Prioritise authoritative Nepal sources, the correct fiscal/calendar year, explicit update timestamps and safe limitations. This is a stronger differentiation opportunity than competing for every generic PDF term globally.

**Developer/text/image cluster:** Prioritise tools with real query evidence and strong local utility. Avoid publishing large numbers of near-identical tool guides.

### P3 — trust, authority and backlinks

1. Earn relevant editorial mentions from Nepal technology/education resources, universities, student communities and practical software/tool directories.
2. Publish genuinely useful examples or comparisons that another site would want to cite; do not buy links, use link farms, or post repetitive promotional Reddit comments.
3. Keep About, Contact, Privacy, Terms and editorial/source information accurate and easy to find.
4. Use official or primary references for changing Nepal financial, tax, electricity and market information. Record the source and the date checked.

### P4 — performance and real-user quality

1. Run Lighthouse/Core Web Vitals on representative high-traffic pages and mobile devices; do not infer speed from server response time alone.
2. Browser-test the highest priority PDF flows and calculators, including invalid input, boundary values, output download/copy, keyboard use and narrow mobile layouts.
3. Check the full sitemap in batches and investigate all 4xx/5xx responses, redirect chains, duplicate canonicals and unintentional noindex pages.
4. Ensure the first screen makes the tool's main task and controls obvious; keep intrusive advertising from obscuring the tool.

## Measurement and gates

Use a 28-day baseline and compare with the preceding 28 days; use 90-day trend views for low-volume pages. Review by query, page, country and device.

Primary KPIs:
- Organic clicks and non-branded clicks by target cluster.
- Impressions, CTR and average position for query/page pairs.
- Number of target queries in positions 1–5, 6–10, 11–20 and beyond 20.
- Indexed status for canonical priority URLs.
- Consent-approved tool starts/completions and guide-to-tool click-through.
- Mobile usability and Core Web Vitals status.

A page moves into the “Top 5 achieved” group only when its **primary query cluster** shows a sustained position 1–5 trend across a meaningful period and target market, not from one daily fluctuation. Rankings differ by country, device and query; there is no honest way to guarantee Top 5 for every page.

## Google Search Central guardrails

- Build helpful, reliable, people-first pages with original information and a satisfying task outcome.
- Make titles, headings and internal links descriptive and aligned with the actual page.
- Use crawlable internal links and a valid sitemap to help discovery; sitemap submission does not guarantee crawling, indexing or ranking.
- Avoid scaled, near-duplicate or low-value pages; do not add keyword stuffing, fabricated reviews, unsupported claims or features the tool does not perform.
- Treat technical accessibility as a prerequisite, not proof that Google must index or rank a URL.

Primary guidance:
- Search Essentials: https://developers.google.com/search/docs/essentials
- Creating helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Title links: https://developers.google.com/search/docs/appearance/title-link
- Snippets: https://developers.google.com/search/docs/appearance/snippet
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## Work initiated in this change

- Added dedicated, real-input instructions to the Reading Time Calculator, Savings Goal Calculator and Percentage Change Calculator SEO content. The guidance matches the current controls and calculation assumptions rather than repeating generic steps.
- Added regression assertions to keep these three high-intent pages task-specific.
- This is a focused first implementation, not a complete site-wide SEO execution. Full sitemap crawling, Core Web Vitals, all-page browser QA, index coverage reconciliation and authority work remain separate execution gates.


## Additional homepage audit reconciliation — 16 November 2026

A third-party SEO Ninja scan of the homepage reported 98/100, grade A, 31 passes, 7 warnings and 0 issues. Its own disclaimer confirms this is a **single-URL/page-level report**, not a site-wide audit. It should be treated as a diagnostic checklist, not a Google score or ranking forecast.

### Live checks against the production response

The live homepage was fetched successfully on 16 November 2026 at 14:29 UTC (HTTP 200). Its response headers and rendered HTML show:

| SEO Ninja finding | Live evidence | Assessment |
|---|---|---|
| HSTS missing | `strict-transport-security: max-age=31536000; includeSubDomains; preload` | False positive |
| Content Security Policy missing | A CSP header is present with explicit source directives and `frame-ancestors 'none'` | False positive; policy can be hardened later, but it is not absent |
| X-Frame-Options missing | `x-frame-options: DENY` | False positive; stricter than SAMEORIGIN for embedding |
| Server compression not detected | Homepage response and CSS asset return `content-encoding: br` | False positive |
| Browser caching: no Cache-Control header | Homepage HTML has `private, no-cache, no-store, max-age=0, must-revalidate`; hashed CSS has `public,max-age=31536000,immutable` | Header exists; HTML caching is intentionally disabled while static assets are long-cached |
| Canonical domain redirect | Plain HTTP homepage returned HTTP 308 to HTTPS | HTTP-to-HTTPS redirect confirmed; project has only `pd-fora.vercel.app` attached, with no `www.pd-fora.vercel.app` project domain |
| Entity schema missing | Live homepage contains WebSite and Organization JSON-LD in the root layout, plus SoftwareApplication markup on the homepage | False positive / parser gap |

The project-domain lookup for `www.pd-fora.vercel.app` returned not found. Do not add a `www` alias for a Vercel-owned `vercel.app` hostname solely to satisfy a generic checker. Keep the one configured canonical hostname. Revisit domain variants only if PDFora moves to a custom domain that it controls.

### Recommendations from the scanner that should not be implemented blindly

- **llms.txt:** Google Search Central's AI optimization guidance updated in June 2026 says these files are not needed for Google Search or its generative AI features and do not improve or harm visibility/rankings. Do not spend ranking work on this file.
- **FAQPage schema:** Google removed its FAQ rich-result documentation in June 2026 because the feature is no longer shown in Google Search. Keep useful visible FAQs for readers, but do not add FAQPage markup as an SEO shortcut.
- **Question-style headings and 40–60-word answers:** This can help a reader when a page naturally answers a question, but there is no Google rule requiring every heading to be a question or every answer to contain 40–60 words. Do not restructure the homepage around a third-party AEO score.
- **Flesch 19/100:** Treat it as an editorial signal, not a Google score. The homepage hero lead sentence was rewritten as shorter task-focused sentences and the H1 now emits an explicit text space between “for” and “PDF”. The page contains technical product names, so do not distort accurate feature descriptions just to hit an arbitrary readability number.
- **1,476-word homepage:** Word count is not a ranking target. Keep sections that help users discover tools; remove copy only when it is genuinely repetitive or unhelpful.

### Further work retained

1. Investigate whether public caching can safely be enabled for the homepage HTML without leaking/serving the wrong language or stale data. Do not change the global Cache-Control policy until route variation and live-data pages have been checked.
2. The current CSP is present but still allows inline scripts for the Next.js App Router. A nonce-based tightening can be considered as a separate security hardening task after complete route/worker compatibility tests.
3. Run PageSpeed Insights/Lighthouse and Search Console Core Web Vitals when data is available; this scan did not provide field data and must not be treated as a CWV result.
4. Expand the scan to representative tool and guide pages, then the entire canonical sitemap. Do not call the 98/100 homepage score a domain-wide score.

### Authoritative Google references checked 16 November 2026

- Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Page experience and ranking context: https://developers.google.com/search/docs/appearance/page-experience
- Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- Google AI optimization guidance (including llms.txt clarification): https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Search documentation updates, including June 2026 llms.txt and FAQ feature changes: https://developers.google.com/search/updates
