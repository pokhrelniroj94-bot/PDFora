# PDFora i18n architecture (Phase 2)

Branch `i18n/global-multilingual`. Not merged, not deployed. See `STATUS.md` for verification state.

## URL scheme

English keeps every existing URL. Other locales are prefixed.

| URL | Meaning |
|---|---|
| `/`, `/merge-pdf`, `/tools/loan-emi-calculator`, `/blog/x` | English, unchanged |
| `/ar`, `/de`, `/ja` ... | Locale home shell (Phase 2). 404 unless the locale is published or preview is on |
| `/ar/tools/x` | Reserved pattern. Not built yet, so it 404s (Phase 3/4) |
| `/en`, `/en/anything` | 301 to the unprefixed English URL (never a duplicate) |
| `/ne` | Existing hand-written Nepali page. Static route; untouched and still wins over `[locale]` |

## Modules (`frontend/lib/i18n`)

- `config.ts`: the 10 locales, native names, `dir`, `htmlLang`, `hreflang`, Intl tag, **publish status**, preview flag.
- `routing.ts`: `localizePath`, `stripLocale`, `absoluteUrl`, `hreflangMap`, and the registry of paths that have a real localized page.
- `translate.ts`: `{placeholder}` interpolation, Intl plural categories, English fallback that is always reported through `onMissing`.
- `messages.ts` + `messages/<locale>/<namespace>.json`: per-namespace dictionaries, loaded on demand (a page loads only what it renders). English namespaces now: `common`, `accessibility`, `seo`.
- `format.ts`: number/currency/date through `Intl`. Latin digits by default so calculator output never changes numerals. BS dates stay with `lib/nepali-date-converter`.
- `preference.ts`: `pdfora-locale` cookie and browser-language matching. Used only to *suggest*; nothing redirects. zh-TW/zh-HK/zh-Hant are never mapped to Simplified.
- `switcher.ts`: language options for a page. Lists only locales that are servable **and** have a real equivalent, so a switch cannot land on a 404.
- `metadata.ts`: self-referencing canonical; hreflang only for published + localized pages; unpublished locales are `noindex, nofollow`.

## Publishing policy (enforced in code)

All non-English locales are `unpublished`. Unpublished means: no hreflang, no sitemap entry, `noindex`, and 404 in production. To review one locally set `PDFORA_I18N_PREVIEW=1` on the server. A locale becomes `published` only by editing its `status` in `config.ts` after `npm run i18n:check` reports it complete (key parity, placeholder parity, no empty strings) **and** a human has reviewed the translations.

## Arabic RTL isolation

`app/[locale]/layout.tsx` wraps content in `<div lang dir>`. Only `ar` has `dir="rtl"`. CSS helpers are scoped to `[dir="rtl"]`, and `:lang()` font stacks only match their own language.

## Known limitations

1. **Nothing here has been compiled, type-checked, linted or built.** npm is blocked in the authoring sandbox. Verified by execution: `verify:tools`, `i18n:test` (13 tests, Node type stripping, not `tsc`), `i18n:check`. Unverified: `app/[locale]/*`, `LanguageSwitcher.tsx`, `next.config.ts`, `globals.css`.
2. Next 16 docs (`node_modules/next/dist/docs`, required by `AGENTS.md`) could not be read. Only long-stable App Router APIs are used (async `params`, `notFound`, `generateMetadata`); confirm with the first local build.
3. `<html lang>` is still `en` for every route. The locale wrapper carries `lang`/`dir`. The root layout's footer, tool directory and cookie banner still render in English inside locale pages. Phase 3 decision: per-locale root layouts via route groups (moves ~60 route folders and needs import fixes, so it should follow a green local build) or another approach.
4. Only the locale home shell exists. `/ar/merge-pdf` and similar 404.
5. No non-English translations exist yet. In preview, missing text falls back to English with a banner and a server warning.
6. The existing `/ne` page and the homepage's current `en`/`ne` hreflang are unchanged. `ne` migrates into this system in a later phase.
7. The language suggestion banner (browser-language detection) is tested as logic but not mounted; there is nothing published to suggest yet.
8. The preference cookie is client-set and holds only a locale code. It must be described in the Cookie/Privacy policy (Phase 6).
9. Sitemap and robots are unchanged (no locale URLs are published).
10. `zh`: `htmlLang` is `zh-Hans`, `hreflang` is `zh`.

## verify:tools fix (commit d7da3a1)

The script failed before any i18n work. Cause 1: the homepage UI moved to `components/HomePageClient.tsx` while the script read only the thin `app/page.tsx`; it now reads both. Cause 2: `app/api/nepse-market/route.ts` was rewritten (each `read<...>()` now passes a `60` cache argument; `source:` reports three feeds), so five file-mapping assertions now expect `, 60` and the source assertion requires all three labels. No assertion was removed. **Please review these assertion edits** since they describe your NEPSE feature.

## Tool adapter and localized tool route (scope: catalog utilities)

Route: `app/[locale]/tools/[slug]/page.tsx` -> `/ne/tools/loan-emi-calculator`, `/ar/tools/<slug>`, ... English is unchanged at `/tools/<slug>` and `/en/*` still 301s to it.

- `lib/tools/adapter.ts`: `resolveCatalogTool(slug)` returns a discriminated result: `{ ok: true, implementation: { kind: "catalog-workspace", slug, entry } }` or `{ ok: false, reason }` with reasons `invalid-slug`, `reserved-entry` (`pdf-tools` placeholder), `pdf-root-tool` (the root PDF pages, not served yet), `unknown-tool`, `incomplete-entry`. It renders nothing; accepted slugs are handed to the existing `ToolWorkspace` (`components/AllTools.tsx`), which keeps dispatching to its own specialized handlers. No second workspace, no fallback tool.
- `lib/tools/localized-route.ts`: validates locale + slug together. 404 reasons: `invalid-locale`, `locale-not-served` (English, or an unpublished locale without `PDFORA_I18N_PREVIEW=1`), or the adapter reason.
- `lib/tools/localized-metadata.ts`: title/description only from the catalog entry (English source text; no localized tool copy exists yet), self-referencing canonical, no hreflang. Robots is **default-deny**: indexable only if the locale is published AND the slug is listed in `lib/tools/localized-verification.ts` (empty today). The sitemap is not touched.
- The page declares the tool UI as `lang="en" dir="ltr"` (it is not translated), shows a notice with a link to the English tool, and adds no page-level JSON-LD.

Not covered yet: the 49 PDF tools (separate root pages with inline `PDForaTool` / `Niroj77Tool` props). They return 404 under `/<locale>/tools/<slug>` (for example `/ne/tools/compress-pdf`) by design. Next step: extract their inline props into a registry with a drift test, then add a `/[locale]/<slug>` route.

Known limits of this route:
1. The root layout's site-wide `WebSite`/`Organization`/`SoftwareApplication` JSON-LD (`inLanguage: "en"`) still appears on every page, including localized ones.
2. English chrome (footer, cookie banner, AI help) still wraps localized routes; the tool's own "All tools" links go to the English directory.
3. Static checks (`npm run tools:test`) cover logic and source contracts only; real status codes need the HTTP checks below.

HTTP checks (preview on, `npm run dev`): `/ne/tools/loan-emi-calculator` 200, `noindex`, canonical `https://pd-fora.vercel.app/ne/tools/loan-emi-calculator`, no `hreflang` links; `/ne/tools/not-a-tool`, `/ne/tools/pdf-tools`, `/ne/tools/compress-pdf`, `/xx/tools/loan-emi-calculator`, `/en/tools/loan-emi-calculator` (301 to `/tools/loan-emi-calculator`) behave as described. Without preview, `/ne/tools/loan-emi-calculator` is 404.
