# 173-tool browser QA — 2026-11-07

## Run evidence

- GitHub Actions run: [42383209742](https://github.com/pokhrelniroj94-bot/PDFora/actions/runs/42383209742)
- Branch: `qa/173-tool-browser-e2e-rebased`
- Workflow head recorded during the run: `b5c7baa4cb72ad384af269ce5f9fadb447e3bb53`
- Browser: headless Chromium via Chrome DevTools Protocol
- Inventory asserted by the runner: 49 PDF routes + 124 catalog tools = 173

## Results

| Result | Count |
|---|---:|
| Browser E2E PASS | 172 |
| PARTIAL | 1 |
| FAIL | 0 |
| Total | 173 |

The only partial route is `market-ai`. The route rendered, but live model execution was not called because it requires the protected Preview provider configuration.

The three AI writing routes (Resume Writer, Cover Letter Generator and Humanizer) were exercised with mocked API responses. This verifies their UI request/response wiring, **not** real Cloudflare Workers AI availability, provider quality, production credentials or Redis rate-limit behavior.

The EMI browser check exercised invalid and fractional input retention and recovery to a known expected EMI. Resume Builder checks covered its 20 templates, live preview, personal details, summary, skills and PDF/print export.

## What PASS means — and does not mean

The runner checks route rendering, selects a generated PDF fixture for PDF tools, invokes the available processing action, and inspects the resulting UI state. Catalog tools are tested according to their available interaction pattern; tools with explicit expected-output assertions receive PASS.

This is a broad automated browser regression sweep, **not complete certification** of all possible inputs, files, browsers or devices. The run does not establish:
- exhaustive boundary, malformed-file and large-file behavior for every tool;
- independent parsing/semantic validation of every downloaded PDF or archive;
- mobile visual quality at all breakpoints;
- keyboard-only and screen-reader accessibility;
- real provider execution for AI features;
- live market-data correctness outside the captured run.

Those are separate release gates. In particular, the browser run's summary reports `aiExecutionSkipped: 4`; do not interpret the mocked AI UI checks as live AI success.

## CI status

- Backend job: PASS.
- Frontend job: PASS, including catalog inventory, i18n checks, lint, Next.js build, npm audit and the 173-route browser sweep.
- Production job: SKIPPED by design. No production deployment was performed by this run.

## Evidence provenance caveat

The generated `FUNCTIONAL_TOOL_AUDIT.json` reports source commit `4d427f7232e0492ef4e4121b632655c659b3fba9`, while the workflow run metadata identifies head `b5c7baa4cb72ad384af269ce5f9fadb447e3bb53`. Preserve this mismatch as an unresolved provenance issue; regenerate the report with an explicitly injected workflow head SHA before treating it as a release artifact.

## Next required QA

1. Reconcile report provenance and update the generated functional audit from the same checked-out commit.
2. Run mobile viewport and keyboard/accessibility checks.
3. Independently validate representative downloaded PDF and archive bytes and content.
4. Exercise live AI on protected Preview with synthetic data, verify Cloudflare Workers AI and Upstash rate limiting, and confirm fail-closed behavior.
5. Re-run the complete release workflow after all fixes. Production remains gated.
