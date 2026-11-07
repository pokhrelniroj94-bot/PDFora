# Security audit status

## Controls verified or implemented on the QA branch

- FastAPI request-size limits, PDF MIME/signature checks and bounded upload reads.
- Request-scoped temporary-file cleanup after response completion; abandoned jobs are cleaned on startup.
- The administrative `/api/cleanup` endpoint requires the configured `CLEANUP_ADMIN_TOKEN`.
- Upload and AI rate limits fail closed when the shared Upstash limiter is unavailable or invalid.
- AI provider credentials remain server-side; generated responses use `Cache-Control: no-store`; provider errors and secrets are not returned to callers.
- The AI writing endpoint now rejects a mismatched browser `Origin` with HTTP 403 before reading or parsing the request body. Same-origin requests proceed to normal validation; requests without an Origin header remain available to server-side callers and are still rate-limited.
- Security headers include HSTS, X-Content-Type-Options, X-Frame-Options, CSP frame/object/base restrictions, Referrer-Policy and Permissions-Policy.
- The read-only production smoke suite checks robots, sitemap, privacy disclosures, canonical metadata, headers and hostile-origin rejection. A separate local-build smoke check is wired into CI so the QA branch can be tested without weakening Production protection.

## Known release gates

- The deployed Production AI endpoint returned HTTP 400 for the hostile-Origin smoke probe rather than the expected HTTP 403 on the previous run. The new Origin guard is present on the QA branch but is not active in Production until the PR is reviewed, merged and deployed.
- The existing CSP is a limited policy (object-src, base-uri and frame-ancestors); it is not a complete restrictive script/style policy. A stricter CSP needs a measured Next.js/Sentry/third-party allowlist and browser regression testing before rollout.
- Protected Preview AI checks currently receive Vercel Authentication HTTP 401 unless a `VERCEL_AUTOMATION_BYPASS_SECRET` is supplied to CI. The workflow supports this secret as an optional GitHub Actions secret; no protection has been disabled.
- Full WCAG contrast and screen-reader review is not covered by the automated route smoke suite.
- Production CORS, rate limits and cleanup must be rechecked from an authenticated CI runner after release.
- Privacy-policy wording must be reviewed against actual retention and third-party processing before any additional locale is indexed.

No Production settings were weakened or changed by this QA work. Automated checks do not replace a security review or prove the absence of vulnerabilities.
