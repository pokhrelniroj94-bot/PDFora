# PDFora project inventory

Updated on 2026-11-14 from the current localization work branch. Machine-readable
counts are in `docs/audit/inventory.json`.

## Verified source inventory

| Area | Count | Evidence |
|---|---:|---|
| Frontend page source files | 70 | Recursive repository tree: `frontend/app/**/page.tsx` |
| API route files | 5 | Recursive repository tree: `frontend/app/api/**/route.ts` |
| Catalog utility entries | 125 | `frontend/components/toolCatalog.ts`, excluding the `pdf-tools` collection entry |
| Legacy PDF tool entries | 49 | `frontend/lib/legacy-tool-slugs.ts` |
| Unique tools in canonical inventory | **174** | 125 catalog utilities + 49 PDF tools; 174 unique slugs |
| Catalog categories | 10 | Catalog source |
| Editorial blog articles | 8 | `frontend/lib/blog-posts.ts` |
| Nepal blog articles | 19 | `frontend/lib/nepal-blog-posts.ts` |
| Nepali dedicated tool interfaces | 169/174 | 49 PDF routes and 120 catalog utilities have Nepali route/workspace coverage; five restored legacy utilities remain English-only |
| Nepali utility route equivalents | 111 | `frontend/lib/i18n/nepali-tool-routes.ts` |
| Localized Nepali PDF route equivalents | 49 | `frontend/lib/i18n/nepali-pdf-routes.ts` |
| Indexable Nepali PDF routes | 6 | `frontend/lib/tools/localized-verification.ts` allowlist |
| Published locales | 2 | English and Nepali |
| Unpublished locales | 10 | Locale publication registry |

The reconciled source inventory is **174 unique tools**: 49 PDF tools and 125 catalog utilities. Five browser-only utilities existed in the production source but were omitted from the localization branch; they have now been restored. The earlier 169 count was incomplete.

## Localization and publication policy

English is the source language. Nepali now has route/workspace coverage for 169 of 174 canonical tools (49 PDF tools and 120 catalog utilities). Five restored utilities remain English-only until localized and reviewed. This is interface
presence, not proof that every workflow passed functional/browser QA or that all
copy received independent native-speaker review. Newly added utility interfaces
remain excluded from indexing until the relevant QA and review are complete.

Hindi, Bengali, Urdu, Arabic, Spanish, French, German, Portuguese, Simplified
Chinese and Japanese are registered but unpublished. They remain excluded from
production routing, sitemap and hreflang until all required user-facing content,
tool workflows, tests and language reviews are complete.

## Evidence limitations

Repository source counts are not runtime or deployment evidence. Tool inventory,
route availability, translated interface coverage, content coverage, functional
testing, human review and indexing eligibility are tracked separately in
`docs/i18n/TOOL_LANGUAGE_COVERAGE_MATRIX.json` and
`docs/qa/REMAINING_WORK.md`. Do not mark a test or review complete unless its
execution result is recorded.
