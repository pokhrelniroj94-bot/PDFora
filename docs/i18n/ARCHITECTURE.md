# PDFora i18n architecture

Branch: codex/niroj-tools-development. Development-only implementation; not merged or deployed to production.

## URL scheme
English retains every existing URL. A non-English locale is prefixed and is only published when its content is complete.

| URL | Meaning |
|---|---|
| /, /merge-pdf, /tools/loan-emi-calculator, /blog/x | English, unchanged |
| /ne | Published Nepali homepage, rendered through app/[locale]/page.tsx and components/NepaliHomePage.tsx |
| /hi, /es, /fr, /de, /ar, /zh, /ja, /ko | Unpublished locale routes; 404 in production unless preview is enabled; preview metadata is noindex |
| /ne/tools/x, /ne/blog/x | Not localized or published; excluded from switcher and hreflang |
| /en, /en/anything | Permanent redirect to unprefixed English URL |

## Locale and document metadata
- lib/i18n/config.ts owns locale codes, native names, direction, HTML language, hreflang and publication status.
- Only English and Nepali are published. Nepali dictionaries cover all currently registered namespaces: common, accessibility and seo.
- proxy.ts identifies the first URL segment and forwards x-pdfora-html-lang and x-pdfora-dir to the root layout.
- app/layout.tsx reads those request headers and sets document-level html lang and dir.
- app/[locale]/layout.tsx validates locale routes and scopes lang/dir on the locale content wrapper.
- lib/i18n/routing.ts is the source of truth for localized URLs and reciprocal hreflang. The registry currently contains only the localized homepage path.
- lib/i18n/metadata.ts creates self-referencing canonical URLs and only includes alternates for published, genuinely localized equivalents.

## Publishing policy
A locale is publishable only after all namespaces registered in messages.ts exist, have matching keys and placeholders, contain no empty strings, and have been reviewed. Unpublished locales are excluded from hreflang and sitemap output and have noindex metadata. Preview mode does not make incomplete content indexable.

## Sitemap
app/sitemap.ts uses Next.js generateSitemaps() to partition core, tools, editorial and published-locale sitemap files. Catalog-generated noindex guides and OCR are excluded. The root robots.txt continues to reference /sitemap.xml, the generated sitemap index.

## Internal links and guide content
- Blog articles link to their declared tool links, normalized to canonical tool URLs.
- Tool pages identify matching guides by canonical and legacy tool paths.
- Tool pages receive matching ToolGuide data where available, including purpose, actionable steps and cautions.
- Generic SEO boilerplate was removed from catalog-guide fallback content; fallback copy uses the specific tool name and description. Existing per-tool advice remains preferred.

## Verification and limitations
The latest source changes have not passed a full Preview build. Earlier Preview runs exposed and helped fix an outdated publishing-policy test and a missing constant in the extracted Nepali component. Vercel then rejected a new Preview deployment because its free daily deployment API allowance had been exceeded. Do not treat earlier failed Preview deployments as verification of the latest commit.

Still required after a Preview build is available:
1. Run tool verification, i18n tests, i18n completeness, ESLint, TypeScript and Next.js build.
2. Inspect rendered / and /ne HTML for reciprocal hreflang, canonical, lang and dir.
3. Fetch each generated sitemap and verify only published/indexable URLs appear.
4. Check internal links and representative tool guides in the browser.
5. Run mobile/Lighthouse/Core Web Vitals tests; no performance score is claimed here.

Only the homepage is localized in Nepali. Shared footer, directory and help UI may still contain English copy. Arabic is configured for RTL but remains unpublished and untested visually.