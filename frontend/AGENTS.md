<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Google Search Central SEO rules (mandatory for every frontend change)

Treat the current Google Search Central documentation and `docs/seo/SEO_AUDIT.md` as default project requirements. Apply these rules even when a task does not explicitly mention SEO.

- Build for people first. Each indexable page must solve a distinct user task with accurate, genuinely useful instructions, examples, supported-input details, limitations and next steps. Do not add words, FAQs or keywords merely to hit a length target.
- Do not publish scaled, repetitive or doorway-like pages. Generated catalogue guides and generated PDF blog variants stay `noindex,follow`, outside the editorial blog index and sitemap, and must not be linked from the canonical tool page. Promote a generated guide only after it is independently edited, fact-checked and materially useful.
- Keep one preferred URL per page. Use a self-referencing canonical for unique indexable pages; redirect retired duplicates where appropriate. Sitemap entries must be canonical, indexable, successful URLs only. Do not block a `noindex` page in robots.txt.
- The root layout owns the `| PDFora` title suffix. Page-level `metadata.title` values must not append `| PDFora` themselves, except when using `title.absolute`. Open Graph/Twitter titles are separate and may include the brand. Titles and descriptions must describe the actual page; never pad or stuff keywords.
- Do not emit meta-keywords for SEO. Keep catalog search keywords in application data only.
- Structured data must describe visible, real page content and use supported types only. Do not emit `FAQPage` or `HowTo` markup for Google rich results; FAQ/how-to text may remain visible and useful to readers. Never invent ratings, reviews, authors, dates or capabilities.
- Publish localized pages only after the interface, instructions, errors, metadata and examples are genuinely translated and reviewed. Each published language version needs its own self-canonical URL and reciprocal hreflang. Keep unreviewed locales and tools default-deny (`noindex,follow`, no sitemap, no hreflang).
- Internal links must be useful, working and language-correct. Do not link users from a Nepali page to a generated English duplicate when a reviewed Nepali equivalent exists.
- For every SEO-affecting change, update or add regression tests for canonical, robots, hreflang, title-template behavior, unique metadata, sitemap eligibility and duplicate-guide suppression. Run the relevant i18n/catalog tests, lint and production build before proposing release.
- Never claim indexing, ranking or traffic gains from source edits alone. Verify deployed HTTP responses and use Search Console after Google recrawls the release.

