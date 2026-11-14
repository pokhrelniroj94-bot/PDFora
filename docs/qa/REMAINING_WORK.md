# PDFora — Remaining work and verified QA evidence

Updated: 2026-11-14
Working PR: https://github.com/pokhrelniroj94-bot/PDFora/pull/162
Working branch: `feat/nepali-encoding-case-tools-2026-11-14`
PR head at this report: `d1f49ec1726163ccfaf81697f2a57dfa94b98280`

## Canonical source inventory

The source-generated tool matrix in `docs/i18n/TOOL_LANGUAGE_COVERAGE_MATRIX.json` defines the current inventory:

- **169 tools total**: 49 PDF tools + 120 catalog utilities.
- 12 configured locale rows per tool; 2,028 locale/tool matrix rows.
- The older 173-tool / 124-utility counts are stale and must not be reused.
- Production homepage currently renders “174 tools”; the latest Vercel production deployment metadata points to commit `982b5b5d73b77edbee516bce22af7dc03723c49d`, not PR #162. Reconcile the production/source inventory before merging or deploying this PR.

## Localization status

### Nepali

- 145/169 tool interfaces are present: 49 PDF + 96 catalog utilities.
- 24 catalog interfaces remain unimplemented:
  `resume-builder`, `currency-converter`, `image-compressor`, `image-format-converter`, `color-picker-palette`, `password-generator`, `uuid-generator`, `regex-tester`, `jwt-decoder`, `color-contrast-checker`, `css-minifier`, `meta-title-checker`, `meta-description-checker`, `keyword-density-checker`, `robots-txt-generator`, `sitemap-generator`, `open-graph-preview`, `savings-goal-calculator`, `xml-formatter-validator`, `notes-to-pdf`, `html-tag-stripper`, `nepal-share-calculator`, `preeti-unicode-converter`, `nepali-unicode-typing`.
- 37 Nepali tools have targeted unit-test coverage recorded by the matrix. The other tools are not individually functionally verified.
- Native-language review is not independently recorded as complete for all 145 interfaces.
- Only six Nepali PDF tools are in the explicit indexing allowlist. Localized catalog utilities remain excluded from indexing until their individual approval gates pass.

### Other locales

Hindi, Bengali, Urdu, Arabic, Spanish, French, German, Portuguese, Simplified Chinese and Japanese remain unpublished. Shared dictionary key/placeholder parity is not evidence that tool interfaces, editorial pages or the whole site are translated. RTL and CJK browser QA and native review remain pending.

## CI evidence for PR #162

GitHub Actions run **43596956402** completed with overall conclusion **success**. The frontend and backend jobs both passed.

Frontend job steps recorded as successful include:

- Dependency installation with `npm ci`.
- Catalog implementation verification.
- i18n runtime and content checks.
- ESLint.
- Next.js production build.
- npm dependency audit.
- Local production security, privacy and SEO smoke checks.
- Headless Chrome installation and local production-server startup.
- Sitemap URL / robots-policy check.
- Live NRB, NEPSE and Nepal-news freshness/fallback checks.
- Local build security/privacy/SEO checks.
- Merge PDF browser E2E.
- Functional audit report generation and artifact upload.

Backend job steps recorded as successful include Python/legacy backend syntax checks, dependency installation, backend functional regression tests and Python dependency audit.

The build's `prebuild` lifecycle also runs the configured catalog, tool UI, Jest, i18n and lint checks. A separate `npx tsc --noEmit` command was not recorded as a standalone CI step; the Next.js build passed its build-time checks.

The separate `live-production` job was skipped. CI success does not mean PR #162 was deployed.

## Executed browser / functional evidence

CI artifact `pdfora-browser-e2e-173-report` and its functional audit were downloaded and inspected. The artifact was generated against the PR merge-test commit `7bf9b4b39318001758f097d8eaad82e47fd3f983`.

### All 169 tools

| Evidence status | Count |
|---|---:|
| Functional PASS | 1 |
| Functional PARTIAL | 69 |
| Functional FAIL | 0 |
| Functional NOT TESTED | 99 |

### PDF tools (49)

- 1 browser workflow PASS: Merge PDF.
- 48 PARTIAL: backend/worker evidence exists, but individual browser workflow and downloaded-output verification is incomplete.
- Backend regression suite passed, including the available-PDF-tools processing test; that does not certify every browser interaction or every downloaded file.

### Catalog utilities (120)

- 21 PARTIAL.
- 99 NOT TESTED.
- No catalog utility had a complete browser E2E PASS in this artifact.

### Mobile, keyboard and accessibility

- 390px mobile viewport: 1 PASS, 168 NOT TESTED.
- Keyboard Tab progression: 1 PASS, 168 NOT TESTED.
- Basic accessibility status: 0 PASS, 1 PARTIAL, 168 NOT TESTED.
- Screen-reader, WCAG contrast, visual comparison and manual assistive-technology review remain outstanding.

### Merge PDF workflow details

The browser test selected two distinct PDFs, reordered them, processed the files and validated the downloaded PDF signature/bytes and three-page order. Invalid PDF input produced a visible error. The 390px viewport had no horizontal overflow. One visible field lacked an accessible name and requires review.

## Google Search Console evidence

Connected Search Console property: `https://pd-fora.vercel.app/`.

Latest available site-level daily data returned for the requested 28-day window covered **2026-10-17 through 2026-11-10** (25 days of returned rows):

- 11,334 impressions.
- 5 clicks.
- 0.044% CTR.
- Impression-weighted average position: 41.31.

Query and page dimensions return different totals because Search Console dimensions can omit anonymized/low-volume rows and aggregate differently. Do not add those dimension totals together or present them as site-level totals.

Notable query rows:
- “how to calculate tip”: 486 impressions, average position 9.09, 0 clicks.
- “seo title check”: 376 impressions, average position 78.62, 0 clicks.
- “tip calculator”: 167 impressions, average position 5.68, 0 clicks.

Notable page rows:
- `/blog/savings-goal-calculator-guide`: 1,090 impressions, average position 8.80.
- `/blog/reading-time-calculator-guide`: 978 impressions, average position 6.80.
- `/tools/meta-title-checker`: 951 impressions, average position 79.58.
- `/tools/meta-description-checker`: 540 impressions, average position 79.43.

Search Console sitemap data for the last 30 days reports `/sitemap.xml` with 307 submitted URLs, 0 errors and 0 warnings; last submitted and downloaded on 2026-11-14. This is Google Search Console evidence, not a substitute for independently fetching every live sitemap URL.

## Technical SEO and publication controls

Source review confirms:

- `robots.ts` allows the public site and disallows `/api/`.
- `sitemap.ts` builds English routes and uses an explicit Nepali tool allowlist for localized tool entries.
- `localized-verification.ts` uses default-deny indexing; the current Nepali tool allowlist contains six PDF tools.
- Unpublished locales are excluded from production routing and must remain out of sitemap/hreflang.
- English URLs remain unprefixed; `/en` redirects to the corresponding English URL.
- The CI local sitemap/robots validation step passed.

Live `robots.txt` and `sitemap.xml` could not be fetched directly from this execution environment. Their live HTTP response, every included URL, canonical and reciprocal hreflang must be rechecked before release.

## Production / deployment status

- PR #162 remains open and draft; it has not been merged by this work.
- Latest PR head at the time of inspection: `d1f49ec1726163ccfaf81697f2a57dfa94b98280`.
- Vercel's latest listed production deployment was READY but used commit `982b5b5d73b77edbee516bce22af7dc03723c49d` from branch `feat/browser-only-tools-2026-11-13`, not PR #162.
- Production homepage opened successfully and rendered a 174-tool count.
- No deployment of PR #162 is claimed or performed.

## Remaining work before full completion

1. Implement and test the 24 missing Nepali interfaces. Preserve the existing 145 interfaces and all English tool behavior.
2. Rebuild the source-generated coverage matrix after each batch; keep translation, functional test, native review, indexing and publication statuses separate.
3. Complete route-level browser QA for all 169 tools where feasible, including all 49 PDF upload/process/download workflows and all 120 catalog utilities.
4. Complete mobile, keyboard, accessibility and downloaded-file integrity checks. Do not convert PARTIAL/NOT TESTED to PASS without new evidence.
5. Translate all shared UI, tool interfaces, guides, blogs, legal/static pages and metadata for the ten other locales. Keep them unpublished until complete and reviewed.
6. Complete Urdu/Arabic RTL and Chinese/Japanese CJK browser testing, including mixed-direction text and file names.
7. Audit every blog/guide/static route for unique useful content, internal links, metadata and language correctness. Avoid thin or duplicate translated pages.
8. Reconcile the 169-tool source inventory with the 174-tool production homepage and identify the five-item difference.
9. Recheck live sitemap, robots, canonical, reciprocal hreflang, structured data, redirects and all included URLs. Keep the default-deny localized indexing policy.
10. Use Search Console data to improve pages with demonstrated impressions; do not promise rankings or create keyword-only pages.
11. Run the full requested standalone command set, including `npx tsc --noEmit`, plus backend, PDF worker, browser E2E, accessibility and mobile checks.
12. Review the complete PR diff and all checks before merge. Deploy only after critical checks pass and deployment authorization is explicit; then verify the actual production deployment and live routes.

## Explicit limitations

- No native reviewer confirmation is available in this QA evidence.
- No complete 169-route browser suite was executed; only Merge PDF has a browser E2E PASS.
- No claim is made that all 49 PDF tools or all 120 utilities are fully functionally certified.
- No claim is made that the ten additional locales are translated or publishable.
- Search Console data is available, but its returned dimensions have different aggregation totals.
- No PR #162 production deployment, merge, indexing outcome or traffic improvement is claimed.
