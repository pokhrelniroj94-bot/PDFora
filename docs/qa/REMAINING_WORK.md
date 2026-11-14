# PDFora — Remaining work and verified QA evidence

Updated: 2026-11-14
Working PR: https://github.com/pokhrelniroj94-bot/PDFora/pull/162
Working branch: `feat/nepali-encoding-case-tools-2026-11-14`
Latest completed full-browser run: GitHub Actions run #3105, branch head `dc612a91a813e979da70c867278d7ba415db7978`.

## Superseding full-tool QA evidence — 2026-11-14 (run #3105)

The latest completed GitHub Actions run **43609001348** passed frontend and backend jobs. The live-production job was skipped because this was a pull-request run.

- Canonical inventory: **174 tools** (49 PDF + 125 catalog utilities).
- Chromium: **174/174 PASS, 0 PARTIAL, 0 FAIL**. All five restored browser-only tools have dedicated behaviour assertions: email signature preview and unsafe-protocol handling; timezone conversion and DST-invalid-time handling; DPI/PPI and centimetre conversion; bitrate calculation and impossible audio-bitrate validation; Markdown table generation and pipe escaping.
- Mobile: **174/174 PASS** at 390px with no horizontal overflow.
- Keyboard: **174/174 PASS** for Tab reachability.
- Basic accessibility: **173 PASS, 1 PARTIAL**. The remaining issue is the English `loksewa-photo-resizer` file input. The Nepali workspace input was labelled first, but the English route was the actual failing control. The English input now has an explicit accessible name; the next CI run must confirm the fix. This is not a WCAG certification.
- Functional audit: 174 PASS, 0 PARTIAL, 0 FAIL, 0 NOT TESTED under the runner's explicit expected-output checks. This browser workflow audit is not exhaustive boundary testing for every possible input.
- 48 PDF workflows validated downloaded file bytes/signatures; Extract Fonts was checked through its expected negative-path handling. Merge PDF validated reordered page sequence and output bytes.
- Backend tests, catalog verification, i18n runtime/content checks, ESLint, Next.js build, npm audit, local security/privacy/SEO smoke, sitemap/robots checks and 17 live-data checks passed.
- Report artifact: `pdfora-browser-e2e-174-report`, artifact ID `14119562810`. Browser and functional reports share the same pull-request merge-test source commit.
- Production spot-check: homepage, Nepali homepage, a tool, blog index/article, robots.txt and sitemap.xml returned HTTP 200. Sitemap contains 307 unique URLs. Social Bar is site-wide; Popunder is on blog index/articles and absent from sampled homepage/tool routes. The public personal email was removed from Contact, Privacy and Terms; the public issue tracker is limited to non-sensitive requests and no private support channel is claimed. Production remains on master commit `3312302d040cd1ec6eff047179eb33c8afebd2b3`; PR #162 is not deployed.

Historical audit sections below are retained for traceability; older counts are superseded by run #3105.

## Canonical source inventory

The source-generated tool matrix in `docs/i18n/TOOL_LANGUAGE_COVERAGE_MATRIX.json` defines the current inventory:

- **174 tools total**: 49 PDF tools + 125 catalog utilities; 2,088 locale/tool matrix rows.
- The five utilities missing from the 169-tool localization branch were confirmed in the production source commit `982b5b5d73b77edbee516bce22af7dc03723c49d` and restored to the branch catalog/workspace: Email Signature Generator, Time Zone Meeting Planner, Image DPI & PPI Calculator, Video Bitrate Calculator, and Markdown Table Generator.
- Nepali coverage is now honestly recorded as **169/174**. The five restored tools remain English-only and are not published under `/ne` until translated and reviewed.

## Localization status

### Nepali

- 169/174 tool interfaces are present in Nepali: 49 PDF + 120 catalog utilities. The five restored browser-only utilities remain English-only and are explicitly marked not implemented for Nepali.
- All 120 currently localized catalog interfaces are present, including: `currency-converter`, `image-compressor`, `image-format-converter`, `color-picker-palette`, `password-generator`, `uuid-generator`, `regex-tester`, `jwt-decoder`, `color-contrast-checker`, `css-minifier`, `meta-title-checker`, `meta-description-checker`, `keyword-density-checker`, `robots-txt-generator`, `sitemap-generator`, `open-graph-preview`, `preeti-unicode-converter`, `nepali-unicode-typing`. Five other restored catalog tools remain English-only.
- The five earlier additions (`xml-formatter-validator`, `notes-to-pdf`, `html-tag-stripper`, `savings-goal-calculator`, `nepal-share-calculator`) remain present. The latest batch adds 18 more interfaces through the shared Nepali remaining-tools workspace; all 23 are still subject to individual functional QA.
- 44 Nepali tools have targeted unit-test coverage recorded by the matrix, including seven newly tested developer/SEO logic helpers. The other tools are not individually functionally verified.
- Native-language review is not independently recorded as complete for the 169 Nepali interfaces.
- Only six Nepali PDF tools are in the explicit indexing allowlist. Localized catalog utilities remain excluded from indexing until their individual approval gates pass.

### Other locales

Hindi, Bengali, Urdu, Arabic, Spanish, French, German, Portuguese, Simplified Chinese and Japanese remain unpublished. Shared dictionary key/placeholder parity is not evidence that tool interfaces, editorial pages or the whole site are translated. RTL and CJK browser QA and native review remain pending.

## CI evidence for PR #162 (latest verified revision)

### Full 174-tool Chromium run — 2026-11-14

The first all-tool browser run (GitHub Actions run 43606393770, report artifact `pdfora-browser-e2e-174-report`) exercised all 174 routes: **169 PASS, 5 PARTIAL, 0 FAIL**. All 174 routes passed the 390px overflow and keyboard Tab reachability checks. The five PARTIAL rows are the five restored browser-only utilities; the runner rendered them but lacked dedicated output assertions. The 49 PDF routes still have a basic file-input accessibility audit issue; do not claim complete WCAG conformance. The live-production job was skipped; this run did not deploy production.

A follow-up test patch adds dedicated behaviour assertions for the five browser-only tools (email signature preview/unsafe URL handling, timezone conversion/DST invalid time, DPI unit conversion, bitrate calculation/invalid audio bitrate, and Markdown table escaping). The next CI run must verify these before any PASS claim is updated.

Latest verified PR head: `b986eba48018028c60856972c92a5a8b067a43a9`.
GitHub Actions run **43604659883** (run 3094) completed with overall conclusion **success** on 2026-11-14.

- Frontend job: 24 steps completed successfully.
- Backend job: 13 steps completed successfully.
- The separate `live-production` job was skipped because this was a pull-request run; no production deployment was performed.
- Catalog implementation verification, i18n runtime/content tests, ESLint and Next.js production build passed.
- ESLint reported no source warnings after replacing the Open Graph preview `img` with `next/image` and fixing the Nepali typing effect dependency.
- npm production dependency audit passed.
- Read-only production security/privacy/SEO smoke checks passed.
- Sitemap check: **307 URLs**, every URL returned HTTP 200 with no redirects; robots and duplicate/unpublished-route checks passed.
- Live-data smoke: **17/17 checks passed**. NRB returned 22 rates for 2026-11-14 from the official source; the fallback flag was true. NEPSE returned 349 stocks and 4 indices from YONEPSE, with source timestamp 2026-11-13 14:59:59 +05:45 (1,746 minutes old at test time). The API returned `quoteStale=false`, but users must still see the actual source timestamp; this is a last snapshot, not a claim of live intraday trades. Nepal market news returned 10 dated source-linked items.
- Local security/privacy/SEO smoke: **20/20 checks passed**.
- Chromium Merge PDF E2E: **1/1 PASS**. Two distinct PDFs were uploaded, reordered, merged, downloaded and byte/signature/page-order validated; invalid PDF input showed an error. At 390px, no horizontal overflow was found. One visible field lacked an accessible name, so accessibility remains PARTIAL for this workflow.
- The uploaded functional audit covers all 174 tools: **1 PASS, 69 PARTIAL, 0 FAIL, 104 NOT TESTED**. Mobile: 1 PASS / 173 NOT TESTED. Keyboard: 1 PASS / 173 NOT TESTED. Accessibility: 0 PASS / 1 PARTIAL / 173 NOT TESTED.
- Artifact: `pdfora-browser-e2e-174-report`, artifact ID `14117497583`. The report's source commit and functional-audit source commit match the CI merge-test commit.

The earlier stale 169-tool assertion in the browser runner was corrected to 174. A separate follow-up build error caused by shadowing the native `Image` constructor was also fixed; the latest run above verifies the corrected `NextImage` alias.

The build's `prebuild` lifecycle also runs the configured catalog, tool UI, Jest, i18n and lint checks. A separate `npx tsc --noEmit` command was not recorded as a standalone CI step; the Next.js build passed its build-time checks.

## Follow-up CI correction

The earlier 151/169 revision exposed stale localized-route and Nepal share-calculator assertions. Those were corrected. The latest branch now adds 18 localized utility routes and updates the expected Nepali route-equivalent count from 196 to 214. The 18 new interfaces are explicitly asserted as present and noindex. The latest CI run confirms the route and i18n checks pass; per-tool functional and native-language review remain separate.

## Executed browser / functional evidence

CI artifact `pdfora-browser-e2e-174-report` and its functional audit were downloaded and inspected. The artifact was generated against the PR merge-test commit `7bf9b4b39318001758f097d8eaad82e47fd3f983`.

### Baseline browser audit (169 tools; before restoring five production utilities)

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
- Latest PR head at the time of the earlier production inspection: `d1f49ec1726163ccfaf81697f2a57dfa94b98280`. The current branch head is recorded at the top of this document.
- Vercel's latest listed production deployment was READY but used commit `982b5b5d73b77edbee516bce22af7dc03723c49d` from branch `feat/browser-only-tools-2026-11-13`, not PR #162.
- Production homepage opened successfully and rendered a 174-tool count.
- No deployment of PR #162 is claimed or performed.

## Remaining work before full completion

1. Run functional and browser QA for the 18 newly implemented Nepali utility interfaces; fix any failures without changing existing English behavior.
2. Rebuild the source-generated coverage matrix after each batch; keep translation, functional test, native review, indexing and publication statuses separate.
3. Extend browser coverage beyond the current all-174 expected-output smoke suite with deeper boundary, malformed-input, accessibility and downloaded-file checks for individual tools.
4. Re-run the 174-tool suite after the English Loksewa photo upload label fix; then complete manual screen-reader, contrast and visual accessibility review. Do not claim WCAG conformance from automated checks alone.
5. Translate all shared UI, tool interfaces, guides, blogs, legal/static pages and metadata for the ten other locales. Keep them unpublished until complete and reviewed.
6. Complete Urdu/Arabic RTL and Chinese/Japanese CJK browser testing, including mixed-direction text and file names.
7. Audit every blog/guide/static route for unique useful content, internal links, metadata and language correctness. Avoid thin or duplicate translated pages.
8. Translate and review the five restored English-only utilities before claiming full Nepali coverage; preserve their English routes and keep their Nepali routes unpublished until then.
9. Recheck live sitemap, robots, canonical, reciprocal hreflang, structured data, redirects and all included URLs. Keep the default-deny localized indexing policy.
10. Use Search Console data to improve pages with demonstrated impressions; do not promise rankings or create keyword-only pages.
11. Continue deeper per-tool boundary and malformed-input testing; the production build type-checks the frontend and its prebuild runs the configured unit/regression suites.
12. Review the complete PR diff and all checks before merge. Deploy only after critical checks pass and deployment authorization is explicit; then verify the actual production deployment and live routes.

## Explicit limitations

- No native reviewer confirmation is available in this QA evidence.
- A complete 174-route Chromium suite has passed in run #3105. It is a workflow smoke suite, not exhaustive certification of all possible inputs.
- All 174 routes have expected-output browser checks, but exhaustive edge-case, screen-reader, contrast and visual accessibility certification remains incomplete.
- No claim is made that the ten additional locales are translated or publishable.
- Search Console data is available, but its returned dimensions have different aggregation totals.
- No PR #162 production deployment, merge, indexing outcome or traffic improvement is claimed. The live production site remains on master commit `3312302d040cd1ec6eff047179eb33c8afebd2b3`.
