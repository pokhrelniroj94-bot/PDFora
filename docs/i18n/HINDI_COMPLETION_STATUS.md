# Hindi completion status

Hindi (`hi`) is **unpublished**: routes are preview-only (`PDFORA_I18N_PREVIEW=1`), noindex, and absent from hreflang, sitemap and the language selector. Do not change `status` in `lib/i18n/config.ts` until every section below is done and verified.

## Done (preview-only, Node-tested)
- 49 PDF tool pages are wired to the existing PDFora/Niroj processing workspaces (`app/[locale]/[slug]/page.tsx`), Hindi names and guides, translated PDF UI messages, and translated field placeholders. Routes remain preview-only/noindex; runtime/build verification for this branch is still pending.
- 13 math calculators: `lib/i18n/hindi-math-tools.ts`, `components/HindiMathUtilityWorkspace.tsx`, `scripts/hindi-math-tools.test.mjs`.
- 7 business calculators: `lib/i18n/hindi-business-tools.ts`, `components/HindiBusinessCalculatorWorkspace.tsx`, `scripts/hindi-business-tools.test.mjs`.
- Currency: Hindi money results use NPR with lakh/crore grouping, matching the Nepali tools. Use ₹ only for a tool with an explicit India context or currency choice.

## Implemented in current batch (build/test pending)
- 3 date/time calculator workspaces: age, date difference and time duration (`components/HindiDateTimeWorkspace.tsx`), wired into the Hindi localized tool route. Includes invalid-date checks, UTC calendar-day arithmetic, age in years/months/days, and overnight time-duration handling.
- 4 finance calculator workspaces: loan EMI, compound interest/SIP, discount percentage and savings goal (`components/HindiFinanceCalculatorWorkspace.tsx`), wired into the Hindi localized tool route. Includes input bounds, NPR formatting and calculation assumptions.
- 6 Nepal utility/calculator workspaces: VAT, land-area conversion, tola/gram conversion, Nepal mobile-number format checking, credit-weighted NEB GPA and an editable-assumptions NEPSE share profit/loss estimate (`components/HindiNepalToolsWorkspace.tsx`), wired into Hindi routes. These are local calculations/format checks, not live official data.
- 20 text utility routes wired to a Hindi workspace (`components/HindiTextToolsWorkspace.tsx`): counters, case conversion, line/word operations, reading time, extractors, find/replace, palindrome and acronym tools. Browser-local processing; extractor outputs are pattern matches, not verified contact data.
- 8 developer/encoding routes wired to a Hindi workspace (`components/HindiDeveloperToolsWorkspace.tsx`): JSON format/validation, Base64, URL encoding, SHA-256, line diff, Lorem Ipsum, HTML entities and URL slug generation.

## Pending
- Calculators/Nepal tools: forex, salary tax, dividend, Nepali date conversion, calendar, photo resizer, other tools. The date/time, finance and Nepal utility components above are implemented but not yet build/test verified.
- Remaining text tools (password and other catalog tools), image tools, and remaining Nepal tools.
- Remaining catalog tool families and any catalog pages that still use the English fallback notice.
- 16 English blog articles plus Nepali-parity review.
- Homepage, tools directory, categories, Resume Builder, About, Contact, Privacy, Terms, help, cookie consent, nav/footer, 404.
- Per-page SEO metadata, canonical/hreflang, sitemap eligibility, language selector, publish switch.

## Verification
- Passing: `npm run i18n:test` (Node, no install needed).
- Blocked in the authoring environment (package installs are refused): `tsc`, ESLint, Jest, `next build`, browser and mobile tests. The new `.tsx` components and route changes still need `npm run build` before merging.
