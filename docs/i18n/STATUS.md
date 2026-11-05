# PDFora i18n rollout: status

Branch: `codex/niroj-tools-development`. Development-only work; not merged to `master` and not deployed to production.

## Locale and publishing policy
- Configured locales: `en`, `ne`, `hi`, `es`, `fr`, `de`, `ar`, `zh`, `ja`, `ko`.
- English remains the default and keeps its existing unprefixed URLs.
- Nepali is published for the localized homepage only. Its `common`, `accessibility` and `seo` dictionaries are present; tool, guide, calculator and FAQ content is not complete.
- Hindi, Spanish, French, German, Arabic, Chinese, Japanese and Korean remain unpublished and excluded from production hreflang and sitemap output.
- Arabic is configured as RTL (`dir: rtl`) but is unpublished and has not passed visual QA.
- Tool-content publication is separately gated by `toolContentPublishedLocales`; it is currently empty. Do not enable a locale there until all required slug-level content is translated and reviewed.

## Dictionary inventory
English defines seven registered namespaces: `common`, `accessibility`, `seo`, `tools`, `guides`, `calculators` and `faqs`.
The non-English tool/content dictionaries are incomplete. For example, the Nepali `tools.json` currently contains the translated UI labels but an empty `entries` object. Other locale dictionaries must be checked against the English key/type/placeholder schema before being considered complete.
The i18n checker now distinguishes the published homepage shell from separately gated tool content: published homepage locales are checked for the three namespaces they actually ship, while unpublished locales continue to receive full-schema work-in-progress diagnostics. This is a validation-scope correction, not a claim that all seven namespaces are translated.

## Implementation notes
- `proxy.ts` forwards locale and direction headers to the root layout, which sets document-level `lang` and `dir`.
- Homepage hreflang is generated from the published-locale registry. Other paths are not offered as translations until equivalent localized pages exist.
- Sitemap output is partitioned into core, tools, editorial and published-locale sitemaps.
- Tool guides prefer per-tool guide data; editorial and tool-page links resolve to canonical tool paths.
- Loan & EMI homepage instructions describe their actual inputs and outputs.

## Verification status
| Check | Status |
|---|---|
| Locale configuration and routing | Source inspected |
| Nepali homepage dictionaries | Files inspected; three homepage namespaces present |
| Tool/guide/calculator/FAQ translation coverage | Incomplete; tool content is not published |
| i18n checker scope | Corrected in development branch; not executed in this environment |
| i18n unit tests | Not executed on latest commit |
| Tool catalog verification | Not executed on latest commit |
| TypeScript / ESLint / Next.js build | Not verified on latest commit |
| Sitemap runtime output | Not verified on latest commit |
| Production | Unchanged; no production deployment action taken |

Earlier Preview builds exposed two issues: an outdated test expectation that Nepali remain unpublished, and a missing site constant in the extracted Nepali component. Both were corrected in later commits. A full build of the latest commit has not run because Vercel reported its free daily deployment API allowance was exceeded. No build success is claimed.

## Remaining work and release gates
1. Complete genuine translations and exact schema parity for all required namespaces in the intended locales; do not fill gaps with English and call them translated.
2. Add and review localized tool, guide, calculator and FAQ entries before enabling any locale in `toolContentPublishedLocales`.
3. Keep non-ready locales unpublished, noindex and absent from production hreflang/sitemaps.
4. Visually QA Arabic RTL, responsive layouts, language switching and accessibility.
5. Run `npm run i18n:check`, `npm run i18n:test`, `npm run i18n:content-check`, `npm run verify:tools`, `npx tsc --noEmit`, `npm run lint` and `npm run build` in the actual frontend workspace; inspect complete logs.
6. Verify Preview HTML, canonical/hreflang, sitemap partitions, internal links and key tool/API runtime behaviour before any release.

## Current limitation
Repository source can be inspected and changed on this branch, but the user's Windows workspace is not available to this session. Local npm commands and browser QA cannot be truthfully reported as completed here.
