# Nepali blog duplicate-content audit

**Audit date:** 2026-11-08  
**Scope:** curated Nepali editorial articles in `frontend/lib/nepali-localized-blog-posts.ts`, page metadata, internal links, language alternates and sitemap wiring.

## Findings and changes

- Reworked the general BS calendar article to focus on reading a month grid, its AD equivalent and weekday. It now points date-conversion tasks to the separate BS–AD converter and no longer overlaps the dedicated public-holidays guide.
- Separated the application-upload 1 MB guide from the email-attachment guide. The former now covers application file limits, downloaded file-size verification and legibility of identity/academic documents. The latter covers recipient/provider limits, attachment-size overhead, safe file sharing and when splitting is appropriate.
- Clarified the Preeti guide as legacy font-encoded document conversion, distinct from Romanized typing for composing new Unicode Nepali text.
- Retained separate NEPSE profit and dividend guides because their reader tasks and outputs differ: buy/sell transaction charges and net proceeds versus declared cash dividends, bonus shares and book-closure eligibility.
- Retained separate PDF merge and image-to-PDF guides because combining existing PDF documents and creating a PDF from images are different workflows.
- Added same-language duplicate checks for repeated introductions and substantial paragraphs (80+ characters), in addition to unique slugs, titles and descriptions.
- Fixed Nepali blog article internal links: catalogue links now use /ne/tools/... and root-level PDF tool links use /ne/..., rather than sending Nepali readers to English routes.

## Technical SEO review

- Nepali article routes use the shared locale metadata builder for self-canonicals, language alternates and social metadata.
- The English and Nepali article pages use the shared hreflang registry.
- Nepali article sitemap entries are generated from the curated localized article collection.
- BlogPosting and BreadcrumbList data are derived from visible article content; visible FAQs remain reader-facing and are not represented as FAQPage rich-result markup.

## Limitations

This is a repository/source audit. It does not prove live HTTP status, Google canonical selection, Search Console indexing, source-link availability or native-speaker sign-off. Run a deployed crawl and human Nepali editorial review before claiming full language quality or indexing. Do not change article dates unless the content was materially updated. No ranking or traffic gains are guaranteed.

## Google Search Central references

- [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Canonicalization and duplicate content](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Localized versions and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Spam policies — scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies)
