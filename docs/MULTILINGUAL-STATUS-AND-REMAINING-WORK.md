# PDFora multilingual implementation audit

Audit date: 2026-11-04  
Audited baseline: PR #55 head `f2ace933739e1e4989e033af4ef213b43be71f1`  
Audit branch: `integration/languages-ai-kundali-seo-2026-11-04`

## Executive finding

PDFora has a substantial multilingual **landing-page and directory foundation**, but the actual tool workspaces are not fully translated. Do not describe the 11-language tool experience as complete and do not add localized tool routes to the sitemap or index until each tool's visible content has been translated and reviewed.

No GitHub branch with `gravity`, `translation`, `i18n`, or `tools-language` in its branch name was found during this audit. The private repository's visible GitHub history therefore does not currently prove that a separate Gravity AI translation implementation was pushed. It may exist only in another local workspace or an unpushed branch.

## What is already present in PR #54 and #55

- PR #54 (`fix/multilingual-home-seo-2026-11-03`) adds 10 localized homepages: Nepali, Hindi, Spanish, French, German, Portuguese, Arabic, Bengali, Indonesian, plus the English default. It also adds localized SEO metadata for the 119 utility catalog entries and 49 PDF tools.
- PR #55 (`fix/add-chinese-japanese-home-locales`) adds Chinese and Japanese homepages, taking the locale set to 11 non-English locales plus English default.
- PR #55 adds localized all-tools directory UI and category labels for all 11 locales, and localized blog index shells.
- PR #55 adds locale-prefixed tool workspace routes. These routes intentionally use `noindex,follow` and canonicalize to the original English tool URL because the actual tool content is not translated.
- `frontend/components/AllTools.tsx` already has a small `workspaceCopy` dictionary for 11 locales. It translates only shared wrapper copy (back link, Nepal utility label, privacy note, estimate disclaimer, official-information notice); it does not translate tool-specific form controls or results.

## Confirmed untranslated workspace areas

The following components do not accept a locale prop and contain English UI strings:

- `frontend/components/AllTools.tsx` — `ToolBody({slug})` has English labels, placeholders, buttons, validation, errors and result messages.
- `frontend/components/QuickUtilityTools.tsx`
- `frontend/components/ExtraTools.tsx`
- `frontend/components/NepalTools.tsx`
- `frontend/components/NepalLiveTools.tsx`
- `frontend/components/NepaliTypingTool.tsx`
- `frontend/components/ResumeBuilder.tsx`
- `frontend/components/toolCatalog.ts` — tool names/descriptions remain English.
- PDF tool route pages and their tool-specific instructions remain English.
- The 11 localized blog index pages disclose that article bodies remain English; article bodies are not localized.

The catalog currently declares 119 utility slugs. The shared tool dispatcher has separate handlers in QuickUtilityTools, ExtraTools, NepalTools, NepalLiveTools and AllTools. Translation must cover every handler and every user-visible state, not only the directory.

## Integration hygiene corrections made during this audit

- Reverted the duplicate workspace-shell translation additions that had been layered over the existing PR #55 `workspaceCopy` dictionary. This avoids duplicating work already present in PR #55.
- Kept the language switcher in the isolated integration branch.
- Restored the localized tool subtree's canonical URL to `/tools` while its main content remains English. A locale-specific canonical would incorrectly signal a separate localized document before the page is genuinely translated.
- The localized tool routes remain `noindex,follow`. Do not add reciprocal hreflang alternates for untranslated tool workspaces.

## PR and release status checked

- PR #54 is open/draft, targets `master`, and GitHub reports it mergeable. Its description says the Vercel preview build completed; browser-level QA is still outstanding. GitHub Actions runs for its commit failed, and the job summaries returned no step details.
- PR #55 is open/draft, targets PR #54's branch, and GitHub reports it mergeable. Its Vercel preview comment reports a deployed preview. The commit workflow-run query returned no PR-triggered runs.
- PRs #56–#60 are integration-only drafts targeting this integration branch. GitHub reported them non-mergeable at the time checked; do not merge them blindly.
- PR #39 (Kundali/36 Guna/NEPSE) is a large open draft with 120 changed files and failed CI runs. PR #48 (AI writing) and #50/#51 (AI Help/market) are stacked feature work. PR #53 (backend/PDF audit) and #52 (new utilities) are also stacked. Their bases and overlapping files need controlled integration and fresh validation.
- No production merge or production deployment was performed.

## Required work, in order

### Phase 1 — establish one clean integration base
1. Resolve the release sequence for PR #54 then PR #55; retain their existing SEO and directory work.
2. Compare feature PRs by file overlap and dependency order. Rebase/retarget one feature family at a time; do not merge the same head branch through multiple PRs.
3. Preserve master and production until preview QA and explicit release approval.

### Phase 2 — implement real locale-aware tool UI
1. Add one typed locale dictionary and translation helper with English fallback; avoid DOM text replacement and runtime machine-translation APIs.
2. Pass the selected locale through ToolWorkspace into ToolBody, QuickUtilityTools, ExtraTools, NepalTools, NepalLiveTools, NepaliTypingTool and ResumeBuilder.
3. Translate tool names, descriptions, field labels, placeholders, options, buttons, helper text, validation messages, errors, loading states, empty states, success messages, downloadable filenames and result explanations.
4. Translate shared PDF tool UI and each PDF tool page's instructions, FAQs, related-tool labels and accessibility text.
5. Translate SEO title/description and visible guide content for each locale only when the page is genuinely translated.
6. Ensure Arabic uses RTL layout and locale-aware number/date formatting where appropriate.

### Phase 3 — automated completeness checks
1. Add a registry of all 119 utility slugs and all 49 PDF tool slugs.
2. Require every locale to have all required keys for every tool. Fail CI on missing keys or accidental English fallback for a page marked translated.
3. Add tests for language switching, all tool routes, validation/error/success states, RTL, and no broken links.
4. Keep untranslated routes `noindex,follow`, canonical to English, and out of hreflang/sitemap localized alternates. Only change this after translation review.

### Phase 4 — preview QA and release
1. Run catalog verification, TypeScript, ESLint, production build, frontend/backend tests and dependency audits.
2. Run route-level HTTP tests for every locale and tool family.
3. Complete mobile/desktop browser QA and verify rendered metadata and language direction.
4. Publish a release checklist and deploy only after explicit approval.

## Important validation limitation

GitHub Actions failures on the inspected PRs did not expose useful step-level logs through the available GitHub job summaries. A Vercel deployment reaching READY proves that Vercel produced a deployment, not that every tool works correctly in a browser. Browser-level QA is still required.
