# Production dependency audit exception

**Advisory:** [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) — picomatch ReDoS (CVE-2026-112366)  
**Review date:** 2026-11-18  
**Status:** Temporary, narrowly scoped exception; upstream has not published a patched release.

## Why this is allowlisted

The affected package is reached through the Sentry Next.js Rollup bundler chain:
`@sentry/nextjs -> @rollup/plugin-commonjs / @rollup/pluginutils / fdir -> picomatch`.
This chain is used by the build/bundler integration. It is not a PDFora API route or a market-data parsing dependency. The advisory currently lists picomatch through 4.0.7 as affected and does not specify a fixed version. The published npm version remains 4.0.7.

## Guardrails

- Do not downgrade or remove Sentry merely to silence the scanner.
- The CI exception accepts only this exact advisory and only the known dependency chain: `picomatch`, `@rollup/pluginutils`, `fdir`, and `@rollup/plugin-commonjs`.
- Any additional production advisory, changed dependency path, or unrecognized finding fails CI.
- Recheck the advisory and remove this exception as soon as upstream publishes a verified fix.
- This exception is not a claim that the advisory is fixed; it records a temporary risk decision so the remaining build, route, browser, and live-data tests can run.

## Separate Next.js patch

Next.js is upgraded to 16.4.6 to include the fixes for the two November 2026 cache-related advisories affecting 16.4.3.
