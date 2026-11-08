# PDFora localization status

This file is a short guide to the generated localization reports. Do not use historical counts from older commits as current coverage.

## Source of truth

Run these commands from `frontend/` after localization changes:

- `npm run i18n:coverage` — route equivalents, shared UI dictionary coverage, Nepali PDF guide coverage and editorial blog coverage.
- `npm run i18n:matrix` — per-tool, per-locale interface, guide, test, review and indexing status.
- `npm run i18n:test` — localization route, content and regression tests.
- `npm run i18n:check` — message namespace and placeholder consistency.

The generated JSON reports under `docs/i18n/` are authoritative for current counts. A route registry entry does not prove that every control, error, placeholder, help message or validation response is translated.

## Nepali publication and indexing

- Nepali is published, but site-wide localization remains partial.
- The six explicitly approved Nepali PDF routes remain the only Nepali tool routes eligible for indexing unless the default-deny verification allowlist is deliberately updated after complete UI, content and functional review.
- Unreviewed or partially translated routes must remain `noindex` and excluded from the sitemap.
- Do not add Nepali URLs to the sitemap or hreflang output solely because a translated route exists.
- Native-language review must be recorded only after a real Nepali-language review; automation cannot certify it.

## Content quality

Follow Google Search Central people-first content guidance. Each indexable tool page needs a working tool, accurate and distinct title/description, original instructions and examples, meaningful limitations, and content that solves the user's task. Avoid scaled thin pages, repeated generic FAQs, keyword-only articles, and machine-translated pages that have not been reviewed.

## Product scope

Generative AI tools and their API endpoints have been retired. Resume Builder remains a manual, browser-based CV builder. The NEPSE Market Desk and its deterministic indicators are separate from generative AI and must disclose data sources, timestamps, missing data and limitations.
