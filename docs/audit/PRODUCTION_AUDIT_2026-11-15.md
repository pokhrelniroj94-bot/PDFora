# PDFora production audit — 2026-11-15

## Scope and evidence

- The first SEO guide patch exposed a missing comma during CI lint; it was corrected in commit `7950bdd94476f1fb58048dab9deac480fa14d6a0`. The corrected commit still requires its own passing CI run.

Reviewed the `master` source at `a4fabaaf143dc5fda2e43a97c3d7c1ad401cc881`, the completed production QA workflow [#43681868550](https://github.com/pokhrelniroj94-bot/PDFora/actions/runs/43681868550), its functional browser report, the production Lighthouse artifact, selected SEO tool pages, the FastAPI route definitions, and the Render service inventory.

### Verified results

- Inventory: **174 tools** = 49 PDF tools + 125 catalog utilities.
- Chromium functional audit: **174 PASS, 0 PARTIAL, 0 FAIL, 0 NOT TESTED**.
- Mobile viewport and keyboard reachability checks: **174/174 PASS**.
- Basic automated accessibility checks: **174/174 PASS**. This is not a WCAG or screen-reader certification.
- PDF outputs: 48 workflows had downloaded-file byte/signature checks; Extract Fonts was checked through its expected negative path.
- Backend test suite, Python dependency audit, frontend lint/build, production npm dependency audit, i18n checks, sitemap route smoke, local security/privacy/SEO smoke, live-data smoke, and live-production checks all passed in workflow #43681868550.
- The workflow confirmed the removed AI-writing endpoint is absent in Production.
- Production sitemap/robots checks and all URLs in the generated sitemap route smoke passed.
- Mobile Lighthouse sample: performance scores ranged **82–96**, LCP **0.9–3.4 s**, CLS **0**, and lab TBT **220–500 ms** across 20 sampled pages. These are lab measurements, not field Core Web Vitals or CrUX INP.

## Security findings

### Controls confirmed in source and CI

- FastAPI production docs/OpenAPI are disabled when Render production mode is active.
- CORS uses explicit production origins and an anchored Vercel preview-host regex; credentials are disabled.
- PDF upload code checks filename, declared content type, PDF signature, bounded file size and page count.
- Request temporary directories are cleaned after the response; abandoned jobs older than six hours are removed.
- `POST /api/cleanup` returns 404 unless a configured `CLEANUP_ADMIN_TOKEN` matches using constant-time comparison.
- Upload POST endpoints are rate-limited; the shared Redis limiter is used when configured.
- Production frontend security smoke passed for HSTS, nosniff, referrer policy, frame denial, CSP framing restriction, permissions policy and non-wildcard credentialed CORS checks.
- Source searches found no AWS access-key or PEM private-key pattern and no obvious hard-coded provider secret. Public Sentry DSN and public service URLs are configuration, not private credentials.

### Remaining security risks / checks

1. **CSP is incomplete.** Current frontend policy sets `object-src 'none'`, `base-uri 'self'` and `frame-ancestors 'none'`, but does not define a restrictive `default-src`, `script-src`, `style-src`, `img-src` or `connect-src`. Do not tighten it blindly: Next.js, Sentry, analytics and advertising require a tested allowlist/nonce strategy.
2. **GET API abuse protection.** The FastAPI middleware rate-limits POST `/api/*` requests, not GET endpoints. The five Next.js API routes are public data proxies. Add bounded caching and/or edge-level per-IP throttling where appropriate, especially for uncached research responses.
3. **Rate-limit fallback scope.** If `RATE_LIMIT_REDIS_URL` is absent or unavailable, rate limiting falls back to process-local memory. It does not coordinate across instances and resets on process restart. CI confirms fail-closed upload handling if the limiter itself fails, but does not prove a distributed limit when Redis is not configured.
4. **Secret-manager verification is incomplete.** Repository source searches do not inspect Vercel/Render secret values or the full Git history. Vercel environment metadata access returned 403, so no variable values were requested or exposed. Verify secret names, scopes and rotation status in the hosting dashboards without copying values into logs or source.
5. **PDF resource exhaustion.** Upload size and page count are bounded, but complex/malicious PDFs can still consume disproportionate CPU or memory. Keep parser dependencies patched and monitor processing time/memory; consider worker-level timeouts and concurrency limits.

The backend currently declares 56 FastAPI routes (51 POST, 5 GET). The frontend contains five Next.js API route handlers: global news, Nepal forex, Nepal market news, NEPSE market and NEPSE research.

## SEO and tool quality

- The six catalog SEO tools are browser-tested: Meta Title Checker, Meta Description Checker, Keyword Density Checker, Robots.txt Generator, XML Sitemap Generator and Open Graph Preview.
- Shared SEO utility tests cover Unicode character counts, keyword phrase matching, robots.txt line-injection prevention, HTTP(S)-only sitemap URLs, XML escaping, duplicate URL removal, fragment rejection and Open Graph attribute escaping.
- The live Meta Title Checker page has task-specific guidance and correctly explains that Google can rewrite title links.
- The live Robots.txt Generator page was found to use generic, repeated step-by-step copy rather than instructions tailored to robots.txt. This is a content-quality/SEO issue, not a runtime failure. PR #171 adds specific steps and accuracy guidance for the Keyword Density, Robots.txt, Sitemap and Open Graph tools.
- The SEO audit is not a claim that every page is indexed, ranks, or has unique editorial content. Tool-page SEO status remains separate from functional PASS. Continue manual review of page-specific usefulness, visible output, internal links, canonical/robots metadata, and native-language quality before indexing more localized pages.
- Do not use keyword density as a ranking target. Do not publish duplicate/near-duplicate pages or generic boilerplate as a substitute for tool-specific instructions.

## Duplicate-file and service findings

### Removed on PR #171 (not yet merged)

- Two byte-for-byte identical obsolete Express backend snapshots: `backend/backend/server.before-all-tools.js` and `backend/backend/server.before-pdf-jpg.js`.
- One unused earlier Express server stub: `backend/backend/server.before-tools.js`.
- One duplicate copy of the Preeti-to-Unicode MIT license. The more descriptive `PRETTI-TO-UNICODE-MIT-LICENSE.txt` copy is retained.

These files were not referenced by the active FastAPI start command or the source search. No runtime route or dependency was removed.

### Intentionally retained identical-content files

- `frontend/sentry.edge.config.ts` and `frontend/sentry.server.config.ts` have identical content but are separate Next.js runtime entry points.
- `frontend/app/icon.svg` and `frontend/public/pdfora-mark.svg` have identical SVG bytes but serve different Next.js icon and public-brand paths.

### Duplicate Render service configuration — confirmation needed

Render lists two active Free web services, both connected to the same repository, `master` branch, `backend` root directory and FastAPI start command:

- `PDFora` → `https://pdfora-493r.onrender.com` (referenced by the frontend and backend defaults).
- `PDFora-backend` → `https://pdfora-backend.onrender.com` (no reference found in the current repository source).

Both report the same live backend commit. The second service appears redundant, but it was not deleted or changed because it may have external consumers not visible in this repository.

## Release status

PR [#171](https://github.com/pokhrelniroj94-bot/PDFora/pull/171) contains the obsolete-file cleanup and SEO guide improvements. Its CI must pass before merge. No Production environment settings were changed and no deployment was triggered by this audit.

## Access limitations

- Hosting environment-variable values were not inspected.
- GitHub secret-scanning alerts and full historical-secret scanning were not available through the connected read-only repository inspection.
- A manual WCAG screen-reader/contrast audit, full PDF fuzzing, authenticated secret rotation review, and field Core Web Vitals review remain outside this automated run.
