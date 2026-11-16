# Hindi completion status

Hindi (`hi`) is **unpublished**: routes are preview-only (`PDFORA_I18N_PREVIEW=1`), noindex, and absent from hreflang, sitemap and the language selector. Do not change `status` in `lib/i18n/config.ts` until every section below is done and verified.

## Done (preview-only, Node-tested)
- 49 PDF tool names, guides, field text and UI messages (earlier work).
- 13 math calculators: `lib/i18n/hindi-math-tools.ts`, `components/HindiMathUtilityWorkspace.tsx`, `scripts/hindi-math-tools.test.mjs`.
- 7 business calculators: `lib/i18n/hindi-business-tools.ts`, `components/HindiBusinessCalculatorWorkspace.tsx`, `scripts/hindi-business-tools.test.mjs`.
- Currency: Hindi money results use NPR with lakh/crore grouping, matching the Nepali tools. Use ₹ only for a tool with an explicit India context or currency choice.

## Implemented in current batch (build/test pending)
- 3 date/time calculator workspaces: age, date difference and time duration (`components/HindiDateTimeWorkspace.tsx`), wired into the Hindi localized tool route. Includes invalid-date checks, UTC calendar-day arithmetic, age in years/months/days, and overnight time-duration handling.
- 4 finance calculator workspaces: loan EMI, compound interest/SIP, discount percentage and savings goal (`components/HindiFinanceCalculatorWorkspace.tsx`), wired into the Hindi localized tool route. Includes input bounds, NPR formatting and calculation assumptions.

## Pending
- Calculators: NEB GPA, VAT, share, land area, gold tola, forex, salary tax, dividend, others. The six date/time and finance calculators above are implemented but not yet build/test verified.
- Text tools (counters, case, duplicates, diff, lorem, password, extractors, etc.), developer/encoding tools, image tools, Nepal tools.
- PDF tool pages (Hindi UI wired to real tool workspaces) and tool pages that still show English with a notice.
- 16 English blog articles plus Nepali-parity review.
- Homepage, tools directory, categories, Resume Builder, About, Contact, Privacy, Terms, help, cookie consent, nav/footer, 404.
- Per-page SEO metadata, canonical/hreflang, sitemap eligibility, language selector, publish switch.

## Verification
- Passing: `npm run i18n:test` (Node, no install needed).
- Blocked in the authoring environment (package installs are refused): `tsc`, ESLint, Jest, `next build`, browser and mobile tests. The new `.tsx` components and route changes still need `npm run build` before merging.
