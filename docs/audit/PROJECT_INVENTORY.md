# PDFora project inventory

Updated on 2026-11-14 from the current localization work branch. Machine-readable
counts are in `docs/audit/inventory.json`.

## Verified source inventory

| Area | Count | Evidence |
|---|---:|---|
| Frontend page source files | 70 | Recursive repository tree: `frontend/app/**/page.tsx` |
| API route files | 5 | Recursive repository tree: `frontend/app/api/**/route.ts` |
| Catalog utility entries | 120 | `frontend/components/toolCatalog.ts`, excluding the `pdf-tools` collection entry |
| Legacy PDF tool entries | 49 | `frontend/lib/legacy-tool-slugs.ts` |
| Unique tools in canonical inventory | **169** | 120 catalog utilities + 49 PDF tools; 169 unique slugs |
| Catalog categories | 10 | Catalog source |
| Editorial blog articles | 8 | `frontend/lib/blog-posts.ts` |
| Nepal blog articles | 19 | `frontend/lib/nepal-blog-posts.ts` |
| Nepali dedicated tool interfaces | 151/169 | Current i18n coverage matrix and PR #162 source |
| Nepali utility route equivalents | 93 | `frontend/lib/i18n/nepali-tool-routes.ts` |
| Published Nepali PDF routes | 6 | `frontend/lib/i18n/nepali-pdf-routes.ts` |
| Published locales | 2 | English and Nepali |
| Unpublished locales | 10 | Locale publication registry |

The canonical source inventory is **169 unique tools**, not 173 or 174. Older
reports that used 173 homepage/directory entries or 174 live homepage entries
refer to earlier or differently counted UI inventories and must not be treated as
the current canonical tool count. The production/live discrepancy still requires
a separate runtime verification; this source count alone does not establish what
is currently deployed.

## Localization and publication policy

English is the source language. Nepali has 151 dedicated tool interfaces recorded
in the current branch; 18 utility interfaces remain unimplemented. The Nepali
coverage count does not mean every interface has completed independent
native-speaker review or browser QA.

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
