# Hindi completion status

Hindi (`hi`) is **unpublished**: routes are preview-only (`PDFORA_I18N_PREVIEW=1`), noindex, and absent from hreflang, sitemap and the language selector. Do not change `status` in `lib/i18n/config.ts` until every section below is done and verified.

## Implemented in source (preview-only; final QA still pending)
- 49 PDF tool pages are wired to the existing PDFora/Niroj processing workspaces (`app/[locale]/[slug]/page.tsx`), Hindi names and guides, translated PDF UI messages, and translated field placeholders. Routes remain preview-only/noindex; runtime/build verification for this branch is still pending.
- 13 math calculators: `lib/i18n/hindi-math-tools.ts`, `components/HindiMathUtilityWorkspace.tsx`, `scripts/hindi-math-tools.test.mjs`.
- 7 business calculators: `lib/i18n/hindi-business-tools.ts`, `components/HindiBusinessCalculatorWorkspace.tsx`, `scripts/hindi-business-tools.test.mjs`.
- Currency: Hindi money results use NPR with lakh/crore grouping, matching the Nepali tools. Use ₹ only for a tool with an explicit India context or currency choice.

## Additional Hindi interfaces implemented in this batch (build/test pending)
- 3 date/time calculator workspaces: age, date difference and time duration (`components/HindiDateTimeWorkspace.tsx`), wired into the Hindi localized tool route. Includes invalid-date checks, UTC calendar-day arithmetic, age in years/months/days, and overnight time-duration handling.
- 4 finance calculator workspaces: loan EMI, compound interest/SIP, discount percentage and savings goal (`components/HindiFinanceCalculatorWorkspace.tsx`), wired into the Hindi localized tool route. Includes input bounds, NPR formatting and calculation assumptions.
- 6 Nepal utility/calculator workspaces: VAT, land-area conversion, tola/gram conversion, Nepal mobile-number format checking, credit-weighted NEB GPA and an editable-assumptions NEPSE share profit/loss estimate (`components/HindiNepalToolsWorkspace.tsx`), wired into Hindi routes. These are local calculations/format checks, not live official data.
- 20 text utility routes wired to a Hindi workspace (`components/HindiTextToolsWorkspace.tsx`): counters, case conversion, line/word operations, reading time, extractors, find/replace, palindrome and acronym tools. Browser-local processing; extractor outputs are pattern matches, not verified contact data.
- 8 developer/encoding routes wired to a Hindi workspace (`components/HindiDeveloperToolsWorkspace.tsx`): JSON format/validation, Base64, URL encoding, SHA-256, line diff, Lorem Ipsum, HTML entities and URL slug generation.
- Remaining 11 catalog routes now have Hindi visible workspaces: resume builder; BS–AD date converter; Nepali calendar; Loksewa photo resizer; Preeti-to-Unicode; manual-rate forex calculator; salary tax estimate with user-entered rate; electricity estimate with user-entered single rate; transparent 2083 holiday planner (does not invent official holiday dates); Nepali Unicode typing; and NEPSE market-news feed. Components: `components/HindiNepalCatalogTools.tsx` and `components/HindiResumeBuilder.tsx`.
- Hindi homepage discovery, all 126 catalog tool names in the directory, category cards, 5 original Hindi guides, and localized About, Privacy, Terms and Contact pages are implemented. Legal and informational pages use self-canonical metadata and remain noindex while Hindi is unpublished.
- Unique Hindi title/description metadata is present for all 125 catalog tools; 49 PDF tools retain Hindi names, guides and field copy. Coverage matrix records 175/175 visible interface routes, but all Hindi routes remain noindex and functional tests/native review remain unverified.

## Pending publication gates
- Run a clean production build, TypeScript, ESLint, Jest and all i18n/tool tests after the latest source changes.
- Browser functional QA for all 175 tools, including PDF uploads/downloads, file-byte integrity, calculations, image workflows, copy/download controls and the NEPSE news endpoint.
- Mobile responsive and accessibility checks, including keyboard navigation, labels, contrast, screen-reader output and RTL regression on existing locales.
- Native Hindi editorial review of tool labels, instructions, errors, results, metadata, homepage, blog and legal pages. A Devanagari string check is not a native review.
- Confirm every page has the intended self-canonical, unique title/description, no Hindi hreflang while unpublished, and is absent from sitemap/language switcher.
- Only after all gates pass should Hindi be enabled in `lib/i18n/config.ts`, sitemap/hreflang be updated, and production deployed.

## Verification
- Passing: `npm run i18n:test` (Node, no install needed).
- A prior Vercel preview build reached TypeScript and failed on Hindi route typing and an undefined number-word helper; those source issues were corrected. The latest Vercel deployment API request is blocked by the Free plan daily deployment API limit (100 deployments/24h), so a fresh build cannot be launched from this session yet. TypeScript, ESLint, Jest, Next build, browser/mobile QA and native review remain unverified after the latest changes.

## Nepali typing reliability fix (2026-11-21)
- Replaced the runtime jsDelivr import in `components/NepaliTypingTool.tsx` with a locally vendored formatter based on `nepalify@0.5.0` (ISC license and upstream attribution included).
- Both Romanized and Traditional keyboard layouts are available without a network request.
- Added a regression test to `scripts/i18n.test.mjs` for both layouts, Devanagari digits, punctuation preservation and invalid-layout handling.
- CI and browser E2E verification for this commit are pending; do not mark the typing workflow verified until the 175-tool Chromium run passes.
