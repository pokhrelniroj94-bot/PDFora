# PDFora SEO, UX, reliability and security audit

Date: 2026-11-03
Scope: repository code review of the integrated feature branch `feat/pdf-ora-ai-help-market-signals` (PR #50), with focused review of the shared tool catalog, tool-page metadata, sitemap/robots, NEPSE Quant Lab, AI API, site-wide AI help and Next.js response headers.

## Changes made on this audit branch

1. **Backtest correctness**
   - Profit factor now uses compounded portfolio P&L per closed trade instead of adding trade return percentages. Summing percentages can materially misstate profit factor after position sizes change.
   - Precomputes the close-price array once instead of rebuilding it on every session.
   - Results display the symbol whose history was actually loaded, not a newly edited symbol input that has not yet been reloaded.
   - RSI strategy is labelled as a simple-average RSI implementation, avoiding an implied claim that it is Wilder-smoothed RSI.

2. **Browser security headers**
   - Expanded the existing CSP with `object-src 'none'`, `base-uri 'self'` and `form-action 'self'`.
   - Added Cross-Origin-Opener-Policy and X-Download-Options.
   - Kept existing frame, MIME-sniffing, referrer, permissions and HSTS protections.
   - This is a defence-in-depth improvement, not a complete strict script/style CSP. A nonce-based CSP needs a separate compatibility pass against Next.js scripts, inline styles, analytics and third-party embeds.

3. **AI Help performance and privacy**
   - Page-specific market/forex context is now fetched only after the visitor opens AI Help, rather than automatically on every matching page visit.
   - Browser chat history is bounded to the latest 40 messages.

4. **SEO discoverability**
   - Added the public `/nepse-lab` page to the XML sitemap.

## Findings that need runtime or owner-side verification

- The existing tool-catalog verification script is extensive and asserts 124 utility catalog entries, 49 available PDF routes, 173 total routes, handler coverage, dedicated guide coverage and SEO advice coverage. It has not been executed in this environment.
- PR #50 records a Vercel deployment quota failure. There is no fresh Preview URL for the current branch, so rendered pages, mobile breakpoints, metadata output, browser console, network failures, PDF processing, and live API behavior remain unverified.
- AI is intentionally disabled until Cloudflare Workers Free credentials and Upstash shared rate limiting are configured and tested. Do not enable the environment flags without verifying the actual account plans and limiter.
- NEPSE data providers are third-party/unofficial or community archives. Verify timestamps, market-session behavior, symbols, history completeness and fallback behavior against current sources before presenting any panel as real-time.
- NRB rates are daily published reference rates, not bank/remittance executable quotes. Test weekend/holiday stale-date handling against the official NRB page.
- Dependency security needs actual `npm audit --omit=dev --audit-level=high`, Python `pip-audit`, ESLint, TypeScript/Next production build and backend tests. These commands are documented in `scripts/validate-local.ps1` but were not run here.
- A complete security review still needs upload limits/content-type checks, PDF parser and image-processing isolation, API abuse controls, secret scanning, dependency advisories, cookie consent/analytics behavior and browser-level CSP compatibility.
- SEO needs Search Console verification after deployment: canonical selection, sitemap fetch/indexing, robots, Core Web Vitals, duplicate/thin pages, title/description rendering and structured-data validation.

## Important deployment boundary

This branch contains proposed changes only. It has not been merged into the feature branch, deployed to Vercel, or deployed to Production. The live PDFora site and existing Render backend were not modified.
