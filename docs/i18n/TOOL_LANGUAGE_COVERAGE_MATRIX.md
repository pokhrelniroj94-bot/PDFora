# PDFora tool/language coverage matrix

Generated from the source registries by `npm run i18n:matrix`.

This matrix contains one row for every combination of **12 configured locales × 174 unique tools**. It separates catalog existence, route/handler evidence, visible interface localization, guide/content coverage, functional testing, human review and indexing eligibility. A generated row is not evidence that the workflow or translation is complete.

## Inventory

- PDF tools: 49
- Catalog utilities: 125
- Unique tools: 174
- Matrix rows: 2088
- Published locales: en, ne
- RTL locales: ur, ar

| Locale | Published tool rows | Interface-present rows | Content-present rows | Index-eligible rows |
|---|---:|---:|---:|---:|
| en | 174 | 174 | 49 | 174 |
| ne | 174 | 174 | 49 | 6 |
| hi | 0 | 0 | 0 | 0 |
| bn | 0 | 0 | 0 | 0 |
| ur | 0 | 0 | 0 | 0 |
| ar | 0 | 0 | 0 | 0 |
| es | 0 | 0 | 0 | 0 |
| fr | 0 | 0 | 0 | 0 |
| de | 0 | 0 | 0 | 0 |
| pt | 0 | 0 | 0 | 0 |
| zh | 0 | 0 | 0 | 0 |
| ja | 0 | 0 | 0 | 0 |

## Current blockers

- Nepali has **174/174 source-registered tool interfaces** (49 PDF + 125 catalog utilities). The five restored browser-only utilities have dedicated Nepali presentation and translated visible copy. Independent native-language review and individual functional verification remain outstanding; source presence is not a native-speaker sign-off.
- Only 44/174 Nepali interfaces currently have targeted tool-specific unit-test coverage recorded in the matrix. Browser QA and targeted unit tests are separate evidence.
- Only six Nepali PDF tool URLs are approved for indexing. The 125 catalog utility routes remain noindex and excluded from sitemap/hreflang pending individual editorial and functional approval.
- Hindi, Bengali, Urdu, Arabic, Spanish, French, German, Portuguese, Simplified Chinese and Japanese remain unpublished and excluded from indexing.
- OCR is not counted among the 174 available tools because it remains excluded from the canonical PDF inventory.
