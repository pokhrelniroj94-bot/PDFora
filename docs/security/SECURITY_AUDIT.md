# Security audit status

## Controls verified or implemented on the QA branch

- FastAPI request-size limits, PDF MIME/signature checks and bounded upload reads.
- Request-scoped temporary-file cleanup after response completion; abandoned jobs are cleaned on startup.
- The administrative `/api/cleanup` endpoint requires the configured `CLEANUP_ADMIN_TOKEN`.
- The AI writing endpoint, AI provider credentials and the Upstash AI rate limiter have been removed from the frontend. `scripts/security-config.test.mjs` asserts that `app/api/ai-writing` does not exist and that no retired AI provider configuration is referenced; the production smoke suite expects the retired endpoint not to be served. These are source-level checks until the post-merge production smoke run is reported.
- Security headers include HSTS, X-Content-Type-Options, X-Frame-Options, CSP frame/object/base restrictions, Referrer-Policy and Permissions-Policy.
- The read-only production smoke suite checks robots, sitemap, privacy disclosures, canonical metadata, headers and hostile-origin rejection. A separate local-build smoke check is wired into CI so the QA branch can be tested without weakening Production protection.

## Known release gates

- Retired AI endpoints must return 404 in Production. This is verified in source only; confirm it against the deployed site after the integration PR is merged and deployed.
- The existing CSP is a limited policy (object-src, base-uri and frame-ancestors); it is not a complete restrictive script/style policy. A stricter CSP needs a measured Next.js/Sentry/third-party allowlist and browser regression testing before rollout.
- Protected Preview checks may receive Vercel Authentication HTTP 401 unless a `VERCEL_AUTOMATION_BYPASS_SECRET` is supplied to CI. No protection has been disabled.
- Full WCAG contrast and screen-reader review is not covered by the automated route smoke suite.
- Production CORS, rate limits and cleanup must be rechecked from an authenticated CI runner after release.
- Privacy-policy wording must be reviewed against actual retention and third-party processing before any additional locale is indexed.

No Production settings were weakened or changed by this QA work. Automated checks do not replace a security review or prove the absence of vulnerabilities.
