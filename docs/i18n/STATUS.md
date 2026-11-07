# PDFora i18n rollout: status

## Current continuation status — 2026-11-07 (master `defdd43`; PR #104 continuation)

Master baseline `defdd43ee53ecfc7e4341a95329ade6a02f2c2ec` merges PR #102. All current localization work remains on the separate Draft PR #104 branch; no Production deployment or merge has been made.

- **12 locales are registered.** English and Nepali are published. Hindi, Bengali, Urdu, Arabic, Spanish, French, German, Portuguese, Simplified Chinese and Japanese remain intentionally unpublished and excluded from indexing. Urdu and Arabic require RTL visual QA before publication.
- **Shared-shell translation exists for all 12 locales.** The typed `shared-ui.ts` module supplies footer, directory, cookie and language-selector copy; the `common`, `accessibility` and `seo` namespaces have locale files and static loaders for all 12. This is shared chrome only, not full-site translation.
- **Master baseline:** 148 Nepali localized route equivalents; 114 localized tool equivalents (49 PDF tools, 64 catalog routes and the dedicated Resume Builder).
- **Current PR #104 candidate:** 198 Nepali localized route equivalents; 164/173 localized tool equivalents (49 PDF tools, 114 catalog routes and Resume Builder), leaving **9 tools** without a completed Nepali workspace.
- **Latest Nepali workspace batch:** 26 catalog tools now have explicit Nepali route dispatch, title/description metadata and localized labels/actions. Existing client-side logic is reused for the relevant converters, SEO utilities, random/dice tools, date calculations, colour helpers and savings calculator. Machine-readable JSON/CSV/XML/CSS/robots.txt output is intentionally preserved rather than translated.
- **Earlier PR #104 additions:** 24 catalog routes relative to master: email/URL/phone/number/hashtag extractors, duplicate-word remover, find/replace, palindrome and acronym tools; text/binary/hex and Morse converters; camel/snake/kebab case converters; HTML tag stripper; JSON escape/unescape; URL query parser/validator; email validator; password strength checker; and UUID generator.
- **Nepali editorial coverage:** 49/49 PDF guide entries and 27/27 curated editorial articles (19 Nepal-focused guides and eight PDF workflow tutorials). Generated catalog guides are excluded from this count and remain noindex until individually reviewed.
- **Indexing remains default-deny.** Six Nepali PDF tool routes are currently allowlisted. On this branch, 158 of 164 localized tool equivalents remain noindex and excluded from sitemap/hreflang pending individual review, functional verification and explicit approval.
- **Remaining 9 catalog tools:** currency converter; image compressor; image format converter; color picker/palette; Notes to PDF; NEPSE share calculator; Preeti–Unicode converter; Nepali Unicode typing; and Market AI. Market AI remains deferred under the earlier instruction not to work on AI tools.
- **The ten additional locales remain unpublished.** Their shared-shell dictionaries do not establish complete localized routes, tool-specific labels, forms, errors, help content or editorial content.
- **Human review is not certified by automation.** Translation dictionaries, unit tests and route counts do not prove native-speaker quality. Native-language review and browser QA remain release gates.
- **Google Search safeguards:** distinct locale URLs, user-controlled language switching, self-referencing canonicals, hreflang only for real published equivalents, and noindex/default-deny for unreviewed localized tool pages. Google indexing is not guaranteed.
- **CI:** the stale route assertion was corrected from 157 to the measured 172 route equivalents. Run #1756 passed frontend and backend checks before the latest 26-tool batch. The new batch has its own CI run pending; no success is claimed until that run completes.
- Production deployment and Google indexing are separate gates. Search Console validation, sitemap resubmission and URL inspection must happen only after an approved production release.

Next work: implement the remaining eight non-AI tools with complete Nepali interfaces, accurate metadata, accessible forms, input validation, error states, real processing and individual regression tests. Keep each route noindex until its own review gate passes. Market AI remains deferred unless the owner explicitly reopens AI-tool work.

The authoritative tool-language matrix contains 2,076 rows (12 locales × 173 tools) and separately records route, handler, visible UI, guide, functional test, human review and indexing eligibility.

## Nepali Nepal utility batch 2 — merged in PR #102

PR #102 was merged into `master` on 2026-11-07 with merge commit `defdd43ee53ecfc7e4341a95329ade6a02f2c2ec`. It adds six Nepali workspaces for Nepal mobile-number validation, tola/gram conversion, BS calendar, Loksewa photo resizing, public-holiday search and official electricity-bill guidance.

The six routes remain noindex and excluded from sitemap/hreflang pending native-language review and explicit indexing approval. The calendar's supported range and exclusion of tithi/holiday calculations are disclosed. The photo resizer processes locally in the browser, restricts supported file types, and enforces file/pixel limits. Electricity content links to the official ERC calculator and tariff directive instead of presenting stale fixed-rate estimates. The public-holiday list is a dated static reference, not a live feed.

PR #102's stated validation was GitHub Actions run #1639, which passed backend and frontend CI. The separate 173-tool Chromium sweep in PR #101 is not implied by that CI result.

## Historical 12-language foundation snapshot (superseded)

Branch: `i18n/12-language-foundation`, based on master `6cc1f06`. This branch is not
merged or deployed. It registers exactly the requested locales: English, Nepali, Hindi,
Bengali, Urdu, Arabic, Spanish, French, German, Portuguese, Simplified Chinese and
Japanese.

English and the existing reviewed Nepali pages remain published. The other ten locales
are intentionally unpublished: their locale home routes provide a localized,
`noindex` fallback explaining that the requested page is not translated, while fake
localized tool/blog URLs are not advertised in hreflang or the sitemap. Arabic and Urdu
use RTL direction. The language selector exposes all requested languages and preserves
the current route only when a reviewed equivalent exists; otherwise it preserves the
destination in a fallback link.

The proxy now passes the locale's BCP-47 HTML language and direction to the root
layout, so the initial server-rendered `<html>` has the correct `lang` and `dir`.

Current truthful coverage: English is complete for the existing published site; Nepali
is complete only for the existing homepage and six PDF routes plus the reviewed shared
namespaces/guides already present in the repository; Hindi, Bengali, Urdu, Arabic,
Spanish, French, German, Portuguese, Chinese and Japanese are not translated or
published.

Verification performed on this branch:
- `npm run verify:tools`: PASS (124 catalog tools, 173 unified homepage/directory tools)
- `npm run i18n:test`: PASS (20/20)
- `npm run i18n:check`: PASS with ten locales explicitly reported as unpublished
- `npx tsc --noEmit`: PASS
- `npm run lint -- --quiet`: PASS (existing non-blocking `<img>` warning is suppressed)
- `npm run build`: PASS (390 generated routes; locale handling uses the Next 16 `proxy.ts` convention)

Stage B progress on the continuation branch:
- Shared footer and PDF directory copy now uses a centralized typed UI copy module.
- English and Nepali footer labels, directory headings, category labels and route links
  are covered by executable i18n tests.
- Nepali directory links use the localized `/ne/...` path only for the six reviewed
  equivalents; all other links remain explicitly English rather than pretending to be
  translated.
- Published Nepali PDF route components now pass localized tool names and guide
  descriptions into the processing UI instead of retaining the English registry labels.

Branch: `i18n/global-multilingual` (from `feat/pdf-ora-ai-help-market-signals` @ 8cf31b8). Not merged, not deployed.

## Historical execution limits

The earlier authoring environment could not run npm installation commands. Those
historical limitations are superseded by the verification results above and in
`docs/qa/TEST_RESULTS.md`.
- Existing `npm run verify:tools` FAILS on this branch before any i18n change: "Homepage is not using the canonical tool directory" (scripts/verify-tool-catalog.mjs:87). The homepage moved to `components/HomePageClient.tsx` while the script reads `app/page.tsx`. Needs a reviewed fix; the test was not edited or removed.

## Inventory (static parse, see inventory.json)
- Page routes 63, API routes 6, catalog entries 125 (10 categories), 49 legacy root-level PDF slugs.
- Hand-written blog slugs: 8 (blog-posts.ts) + 19 (nepal-blog-posts.ts); tool-guides.ts adds posts at runtime (count to confirm at build time).
- Branch-specific features to preserve: NEPSE market/research/lab, forex, news APIs, AI writing (`/api/ai-writing`, Upstash + Cloudflare rate limiting), SiteAIHelp, SmartToolCenter, MarketIntelligence.

## Status table
| Phase | Status |
|---|---|
| 1 Discovery | PARTIALLY COMPLETE (static only) |
| 2 Core i18n | PARTIALLY COMPLETE: library tested by execution; Next.js integration written but NOT BUILT |
| 3 Shared UI | NOT STARTED |
| 4 Tools (125 catalog entries) | NOT STARTED |
| 5 Blog | NOT STARTED |
| 6 Static pages | COMPLETE for privacy, terms, about and contact; other static/editorial pages remain |
| 7 SEO | PARTIAL: localized route registry and sitemap omissions fixed; full SEO audit remains |
| 8 Security/perf | NOT STARTED |
| 9 Regression | NOT STARTED |

## Verification log (only things actually executed)
Local run by the project owner on Windows, commit 2131ace (output reviewed):
| Check | Result |
|---|---|
| `npm ci` | PASS (366 packages; 8 moderate audit findings, pre-existing, for Phase 8) |
| `npm run verify:tools` | PASS |
| `npm run i18n:test` | PASS 13/13 |
| `npm run i18n:check` | PASS (English valid; 9 locales unpublished) |
| `npx tsc --noEmit` | PASS (no output) |
| `npm run build` | PASS (Next 16.4.3 Turbopack; `/[locale]` dynamic, `/ne` static, existing routes intact) |
| `npm run lint` | FAIL: 2 errors, 3 warnings. 2 in LanguageSwitcher.tsx were caused by this work (fixed afterwards, see below); 3 are pre-existing in NepalLiveTools.tsx (error), NepseAlphaLab.tsx and SiteAIHelp.tsx (warnings) |

After the lint fix (authoring sandbox only; lint/tsc/build must be re-run locally):
| Check | Result |
|---|---|
| `verify:tools`, `i18n:test` (14 tests), `i18n:check` | PASS |
| `lint`, `tsc`, `build` of the fix | NOT RUN |

Not yet tested by anyone: runtime behavior of /ar, /de etc. in preview mode, 404 without preview, /en redirect, switcher keyboard use.

## Phase 2 lint cleanup (commit follows 43b98f3)
Pre-existing findings fixed with minimal edits, no behavior change:
- NepalLiveTools.tsx:175 `today's` -> `today&apos;s` (renders identically).
- NepseAlphaLab.tsx: removed `result`/`setResult` state that was only ever set to null and never read (displayed results come from the `metrics` useMemo).
- SiteAIHelp.tsx: effect deps `[pathname]` -> `[pathname, pagePath]`; pagePath is derived from pathname, so run timing is unchanged.
Authoring sandbox re-ran verify:tools, i18n:test (14/14), i18n:check: PASS. lint/tsc/build: NOT RUN here; pending owner's local run.

## Local verification at 4591021 (owner's Windows run, output reviewed)
| Check | Result |
|---|---|
| `npm run lint` | PASS: no output (0 errors, 0 warnings) |
| `npx tsc --noEmit` | PASS: no output |
| `npm run build` | PASS: Next 16.4.3 Turbopack, 384 static pages; route list identical to the pre-fix build (`/[locale]` dynamic, `/ne` static, all existing routes, 6 API routes, 193 blog and 124 tool SSG paths) |
Earlier on the same commit family: verify:tools, i18n:test (14/14), i18n:check passed locally.
Still NOT verified: runtime behavior in a browser (preview-mode /ar and /de, 404 without preview, /en redirect, switcher keyboard use).
Phase 2 status: PARTIALLY COMPLETE until the browser checks are reported.

## Tool adapter + localized tool route (catalog utilities)
Verified here (authoring sandbox, commands actually run): `verify:tools` PASS; `i18n:test` 14/14; `i18n:check` no blocking problems; `tools:test` 12/12 (4 injected defects were each caught by the suite); bun syntax check of the 5 new TS/TSX files OK; partial strict `tsc` on the 4 pure modules reports nothing beyond the expected missing-`next`/`process` types.
Browser/HTTP checks remain pending; build, lint and TypeScript have since been run successfully on the continuation branch.
Unchanged by this work (git diff vs HEAD empty): `app/tools`, `app/sitemap.ts`, `app/robots.ts`, all of `components/`.
Status: adapter PARTIALLY COMPLETE (catalog utilities only; PDF tools deferred); localized route WRITTEN, NOT BUILT; indexing: DISABLED by default (nothing verified); sitemap: UNCHANGED.
Latest verified Nepali route evidence (commit `ba93eeb`): 24 route equivalents are
measured, including three AI writing routes (Resume Writer, Cover Letter Generator and
Humanizer). This does not include the Resume Builder, blogs, legal/static pages or
remaining utilities; those remain unpublished through fallback routing until reviewed.
