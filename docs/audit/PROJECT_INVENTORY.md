# PDFora project inventory

Generated on 2026-11-06 from branch `feature/complete-12-language-platform`, based
on commit `8323820`. Machine-readable data is in `docs/audit/inventory.json`.

| Area | Count | Evidence |
|---|---:|---|
| Frontend page files | 66 | `frontend/app/**/page.tsx` |
| API route files | 6 | `frontend/app/api/**/route.ts` |
| Catalog tool entries | 125 | `frontend/components/toolCatalog.ts` |
| Unified homepage/directory entries | 173 | `npm run verify:tools` |
| Catalog categories | 10 | Catalog source |
| PDF guides | 49 | `frontend/lib/tool-guides.ts` |
| Editorial blog articles | 8 | `frontend/lib/blog-posts.ts` |
| Nepal blog articles | 19 | `frontend/lib/nepal-blog-posts.ts` |
| Published Nepali PDF routes | 6 | `frontend/lib/i18n/nepali-pdf-routes.ts` |
| Published localized locales | 2 | English and Nepali |
| Unpublished locales | 10 | Locale publication registry |

The source contains generated catalog guides in addition to the 49 PDF guides and
the 27 hand-written articles. Generated guides are intentionally not counted as
human-reviewed translated content.

## Route and publication policy

English remains unprefixed. Nepali has the existing homepage and six reviewed PDF
equivalents. Hindi, Bengali, Urdu, Arabic, Spanish, French, German, Portuguese,
Simplified Chinese and Japanese are registered but unpublished. They are excluded
from sitemap and hreflang output and use an explicit localized fallback rather than
displaying English content under a translated URL.
