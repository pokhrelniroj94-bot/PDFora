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

## Measured source inventory and focused comparison (2026-11-05)

A fresh read of the seven English JSON dictionaries on this branch counted the following leaf values (nested object leaves and array/scalar leaves counted as individual values):

| Namespace | English leaf values |
|---|---:|
| common | 5 |
| accessibility | 2 |
| seo | 2 |
| tools | 755 |
| guides | 547 |
| calculators | 675 |
| faqs | 764 |
| **Total** | **2,750** |

A key-by-key structural comparison was completed for Nepali's three published homepage namespaces against English:
- `common`: 5/5 keys present; 0 missing, 0 extra, 0 type mismatches, 0 placeholder mismatches, 0 empty strings; 1 string leaf exactly matches English.
- `accessibility`: 2/2 keys present; 0 missing, 0 extra, 0 type mismatches, 0 placeholder mismatches, 0 empty strings; 0 string leaves exactly match English.
- `seo`: 2/2 keys present; 0 missing, 0 extra, 0 type mismatches, 0 placeholder mismatches, 0 empty strings; 0 string leaves exactly match English.

This establishes 9/9 (100%) structural key presence for the inspected Nepali homepage dictionaries, not human translation approval or semantic quality. The one identical English leaf is retained as a proper noun/brand only if a reviewer confirms that context; otherwise it should be translated. No all-locale or all-seven-namespace parity percentage is claimed: the 70-file exhaustive comparison remains outstanding. The 2,750 English leaf count is the measured denominator for future coverage reporting, not a translation completion score.

## RTL and accessibility source review (2026-11-05)

- `proxy.ts` resolves the first URL segment through the locale registry and forwards `x-pdfora-html-lang` and `x-pdfora-dir`; the root layout applies those values to `<html lang dir>`. Arabic's configured `dir` is `rtl`.
- The language switcher uses a native `details/summary`, translated accessible label props, `lang`/`hreflang`, and logical `text-start`/`end-0` positioning.
- Global CSS includes Arabic font fallbacks, an RTL icon-flip helper and an LTR isolation helper for URLs/numbers.
- Gaps found in source review: the root footer's link labels are hard-coded English; global RTL rules do not establish a complete logical alignment/layout policy for all components; no component-level RTL visual, keyboard, screen-reader or responsive QA was possible. Financial calculator and tool-panel alignment is therefore **not verified**.
- Arabic remains unpublished, so the current production route gate prevents treating the Arabic layout as release-ready. Do not publish Arabic until full visual and accessibility QA is performed.

## Implementation notes
- `proxy.ts` forwards locale and direction headers to the root layout, which sets document-level `lang` and `dir`.
- Homepage hreflang is generated from the published-locale registry. Other paths are not offered as translations until equivalent localized pages exist.
- Sitemap output is partitioned into core, tools, editorial and published-locale sitemaps.
- Tool guides prefer per-tool guide data; editorial and tool-page links resolve to canonical tool paths.
- Loan & EMI homepage instructions describe their actual inputs and outputs.

## Verification status
| Check | Status |
|---|---|
| Locale configuration and routing | Source inspected; root lang/dir binding verified statically |
| Nepali homepage dictionaries | 9/9 structural keys present across common/accessibility/seo; semantic review still required |
| All-locale, seven-namespace schema parity | Not completed; no all-locale percentage claimed; 2,750 English leaf-value baseline measured |
| i18n checker scope | Corrected in development branch; not executed in this environment |
| i18n unit tests | Not executed on latest commit |
| Tool catalog verification | Not executed on latest commit |
| TypeScript / ESLint / Next.js build | Not verified on latest commit |
| Sitemap runtime output | Static source inspected; runtime output not executed |
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
