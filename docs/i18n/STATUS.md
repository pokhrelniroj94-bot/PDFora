# PDFora i18n rollout: status

Branch: codex/niroj-tools-development. Development-only work; not merged or deployed to production.

## Current implementation
- English retains its existing unprefixed URLs.
- Nepali homepage is integrated into the /[locale] route through components/NepaliHomePage.tsx; the duplicate app/ne/page.tsx route was removed.
- English and Nepali are the only published locales. Nepali has complete common, accessibility and SEO dictionaries.
- Hindi, Spanish, French, German, Arabic, Chinese, Japanese and Korean remain unpublished and are excluded from hreflang and sitemap output.
- proxy.ts forwards locale and direction headers to the root layout, which sets document-level lang and dir.
- Homepage hreflang is generated from the published-locale registry. Other paths are not offered as translations until equivalent localized pages exist.
- Sitemap output is partitioned into core, tools, editorial and published-locale sitemaps.
- Tool guides prefer per-tool guide data; editorial and tool-page links resolve to canonical tool paths.
- Loan & EMI homepage instructions now describe its actual inputs and outputs.

## Verification status
| Check | Status |
|---|---|
| Source integration | Implemented; source inspected |
| Nepali dictionaries | Added; parity check not rerun on latest commit |
| i18n unit tests | Updated; not re-executed on latest commit |
| TypeScript / ESLint / Next build | Not verified on latest commit |
| Sitemap runtime output | Not verified on latest commit |
| Production | Unchanged; no production deployment action taken |

Earlier Preview builds exposed two issues: an outdated test expectation that Nepali remain unpublished, and a missing site constant in the extracted Nepali component. Both were corrected in later commits. A full build of the latest commit has not run because Vercel reported its free daily deployment API allowance was exceeded. No build success is claimed.

## Remaining limitations
1. Only the homepage is genuinely localized in Nepali. Nepali tool and blog routes are not published equivalents.
2. Shared footer, tool directory and AI help UI may still contain English copy on the Nepali homepage.
3. Arabic RTL is wired at the document level but Arabic remains unpublished and needs visual QA.
4. Mobile rendering, Lighthouse and Core Web Vitals have not been measured.
5. Tool/API runtime behaviour is not established by source inspection.

## Next verification
After Vercel deployment allowance resets, build the latest development commit and inspect full logs. Require passing tool verification, i18n tests, i18n completeness, ESLint, TypeScript and Next.js build. Then verify / and /ne HTML, reciprocal hreflang, document lang/dir, sitemap partitions and canonical internal links on Preview.