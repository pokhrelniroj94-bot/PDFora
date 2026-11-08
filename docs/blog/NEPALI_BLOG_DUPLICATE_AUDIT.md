# Nepali blog duplicate-content audit

**Audit date:** 2026-11-07  
**Scope:** 27 curated Nepali editorial articles in `frontend/lib/nepali-localized-blog-posts.ts`, their page metadata, language alternates and sitemap wiring.

## Findings

- 27/27 slugs are unique.
- 27/27 titles are unique.
- 27/27 meta descriptions are unique.
- 27/27 introductions are unique.
- No identical substantial paragraph (80+ characters) was found across two Nepali articles after normalization.
- One redundant official-source citation was shared by the general Nepali calendar guide and the public-holidays guide. The Ministry of Home Affairs holiday source remains on the dedicated public-holidays article; the general calendar article retains the Panchanga authority reference.
- Similarity screening surfaced related subjects, not proof of duplicate pages. Shared topic vocabulary and shared tool links are expected when articles serve different tasks.

## Content changes made

1. **BS–AD converter vs Nepali calendar:** the calendar guide now focuses on reading a BS month grid, matching the displayed AD date and weekday. It explicitly sends date-conversion tasks to the separate BS–AD converter and no longer claims to be a holiday list.
2. **PDF under 1 MB vs email attachments:** the 1 MB guide now focuses on application upload limits, preserving legibility of identity/academic documents and checking the actual downloaded file size. The email guide focuses on recipient/provider attachment limits, splitting only when multiple attachments are accepted, and safe file-sharing alternatives.
3. **Preeti–Unicode conversion vs Romanized typing:** the Preeti guide now clearly targets legacy font-encoded documents. The typing guide targets composing new Nepali Unicode text from Romanized pronunciation input.
4. **NEPSE profit vs dividend guides:** reviewed and retained as separate intents. One explains buy/sell transaction costs and estimated net proceeds; the other explains declared cash dividends, bonus shares and book-closure eligibility. They are not merged because the reader tasks and outputs differ.
5. **PDF merge vs image-to-PDF guides:** reviewed and retained as separate workflows (combining existing PDFs versus creating a PDF from phone images).

## Regression protection

`frontend/scripts/blog-quality.test.mjs` now checks, within each language collection:
- unique titles, descriptions and introductions;
- no repeated substantial body paragraph across different articles;
- existing section, FAQ, source, internal-link and placeholder requirements.

The existing Nepali blog test also checks unique localized slugs and matching translated article routes.

## Technical SEO source review

- Nepali article routes use `buildLocaleMetadata`, which creates a self-referencing canonical for the localized path.
- Language alternates are generated from the shared `hreflangMap` registry; the English article page uses the same registry.
- Nepali article pages are statically enumerated from the 27 curated localized records.
- The sitemap includes the Nepali blog index and each curated Nepali article URL.
- BlogPosting, BreadcrumbList and FAQ structured data are rendered from visible article content. FAQ markup is not a promise of FAQ rich results.

## Limitations

This is a repository/source audit, not a live crawl or a Search Console inspection. It does not prove that every deployed URL returns HTTP 200, that Google selected the declared canonical, that external source pages remain available, or that every article has passed native-speaker editorial review. Re-run production URL inspection and representative mobile/browser checks after the change is deployed. Do not claim that Google will index every URL.

## Google Search Central references

- [Canonicalization and duplicate content](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Localized versions and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Canonical URL best practices](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Canonicalization troubleshooting](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting)
- [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
