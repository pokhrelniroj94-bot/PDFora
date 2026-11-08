# PDFora: 49-tool bilingual SEO content generation standard

Status: implementation specification. This file does not certify that localized routes are published or indexable.

## Purpose

Generate genuinely useful, tool-specific English and Nepali page content for each of the 49 standalone PDF tools. Content must describe the shipped implementation, not an imagined feature set.

## Required input record per tool

Provide these verified fields from the actual route and UI before writing:
- `slug`, `displayNameEn`, `displayNameNe`
- `actualPurpose`
- `supportedInputTypes`
- `minimumFiles` / `maximumFiles`, when applicable
- `actualOptions`
- `processingLocation` (browser or server, verified from code)
- `downloadBehaviour`
- `knownLimitations`
- `relatedToolSlugs`
- `verifiedNepaliSearchTerms` (optional; sourced from Search Console or keyword research)

Never infer file limits, privacy guarantees, encryption, batch support, OCR, speed, or browser-side processing.

## Reusable generation prompt

> You are PDFora's senior technical SEO editor and native-level English–Nepali localization specialist. Write two independently useful, tool-specific landing pages from the verified input record below.
>
> **English locale:** professional US/global English for users searching to complete this exact PDF task.
>
> **Nepali locale:** natural, professional Nepali in Devanagari. Translate intent and instructions, not English sentence structure. Keep unavoidable technical terms and file-format names where they improve clarity. Do not insert Romanized Nepali search phrases unless the supplied verified search-term list contains them.
>
> **Accuracy:** describe only supplied and verified functionality. If a fact is missing, write `NEEDS VERIFICATION` in the audit output and do not make a claim about it. Never claim “100% secure”, “fastest”, “no limits”, “client-side”, “files never leave your device”, or “no signup” unless explicitly verified.
>
> **For each locale produce:**
> 1. A distinct meta title under 60 characters.
> 2. A distinct meta description under 160 characters.
> 3. One clear H1 matching the user's task.
> 4. A concise introduction explaining what the tool does and when to use it.
> 5. A numbered, accurate how-to guide using the actual controls.
> 6. Feature highlights tied to verified implementation.
> 7. Practical use cases, without keyword stuffing.
> 8. Limitations and troubleshooting that set realistic expectations.
> 9. Five or six useful FAQs with complete answers.
> 10. A direct, localized CTA.
>
> Use one H1, logical H2 sections, and H3 only where they clarify a subsection. Do not repeat the same generic paragraphs across tools. Use primary and secondary terms naturally; do not invent search volume, difficulty, rankings, or user queries.
>
> **Output machine-readable content data** with locale, slug, title, description, H1, introduction, steps, feature bullets, use cases, limitations, FAQs, CTA, and a list of facts requiring verification. Escape strings correctly. Also provide the human-readable page copy.
>
> **Final self-audit:** count title/description characters; confirm no unsupported feature claims; confirm the Nepali is natural Devanagari; confirm the two locales are independently written; mark every unchecked technical fact as NOT VERIFIED. Do not label content production-ready if any required input is missing.

## URL, canonical and hreflang contract

For the target architecture, each tool must have two real, rendered routes:

- English: `https://pd-fora.vercel.app/en/{slug}`
- Nepali: `https://pd-fora.vercel.app/ne/{slug}`

When both translations are complete and reviewed, both pages must emit the same reciprocal alternate set:

```html
<link rel="alternate" hreflang="en" href="https://pd-fora.vercel.app/en/{slug}" />
<link rel="alternate" hreflang="ne" href="https://pd-fora.vercel.app/ne/{slug}" />
<link rel="alternate" hreflang="x-default" href="https://pd-fora.vercel.app/en/{slug}" />
```

Each page must have its own self-referencing canonical:
- English canonical points to its `/en/{slug}` URL.
- Nepali canonical points to its `/ne/{slug}` URL.

Do not emit an alternate for a translation that does not exist, is not equivalent, or is not indexable. Do not publish an `x-default` target that redirects to a different canonical URL.

## Indexing release gate

A locale is indexable only when all of the following are true:
- Its route returns HTTP 200 and renders the correct language on the server.
- Tool controls, labels, errors, progress, success messages, FAQ, metadata, headings, alt text, and CTA are translated.
- The content accurately matches the actual tool implementation.
- Its title, description, canonical, hreflang, and structured data are correct.
- The page is useful and distinct, not a thin translation shell.
- Automated tests and a real browser smoke test pass.

Until then, return `noindex, nofollow` for that locale and omit its URL from the indexable sitemap. A completed Nepali guide dictionary alone is not proof that the entire interactive page is localized.

## Font and rendering

Use a properly subsetted Noto Sans Devanagari font for Nepali, with only required weights. Configure `font-display: swap`. Preload only the actual above-the-fold font file/weight used by the Nepali route; do not preload every weight or preload it on English pages. Verify font requests and layout stability in a production browser trace.

## Structured data

Emit JSON-LD only when it matches visible page content:
- `SoftwareApplication` only for the actual tool/application.
- `BreadcrumbList` for visible navigation.
- Do not emit `FAQPage` JSON-LD. Keep useful FAQs visible to readers, but Google no longer shows FAQ rich results in Search (May 2026 update).

Do not add fabricated ratings, reviews, aggregate ratings, endorsements, or feature claims.

## 49-tool release checklist

For every slug, record separate statuses for:
- English content reviewed
- Nepali content reviewed
- English route and UI verified
- Nepali route and UI verified
- Canonical verified
- Reciprocal hreflang verified
- Sitemap inclusion verified
- Structured data validated
- Browser functionality smoke-tested

The release is not complete until all 49 tools pass both locale checks. Keep unfinished locale pages noindex; never use a global switch to index all 49 at once.
