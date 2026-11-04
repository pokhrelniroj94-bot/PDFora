# PDFora baseline report (static analysis only)

Date: 2026-11-04. Branch: `chore/ecc-integration-hardening` (from `master` @ 0f0f171). No code changed.

## Execution status: BLOCKED
pypi.org, files.pythonhosted.org and registry.npmjs.org are refused by the sandbox egress proxy (403 / connection rejected).
Not run: backend pytest, ESLint, TypeScript, production build, pip-audit, npm audit.
Already present in sandbox: pypdf, pdfplumber, pillow, openpyxl, python-docx, starlette, pytest. Missing: fastapi, pymupdf (fitz), httpx, redis, all npm packages.
`python -m py_compile backend/main.py` passed (the only check that ran).

## ECC (affaan-m/everything-claude-code @ b38be6a, MIT)
71 agents, 314 skills, 98 commands, 23 rules, 7 hooks. Candidate agents that exist in the repo:
architect, code-reviewer, security-reviewer, python-reviewer, typescript-reviewer, react-reviewer,
fastapi-reviewer, tdd-guide, performance-optimizer, silent-failure-hunter, seo-specialist, doc-updater, e2e-runner.
Not yet installed. Install only after dependencies are verified.

## The five suspected issues (code evidence)

| # | Issue | Verdict | Evidence |
|---|-------|---------|----------|
| 1 | Decompression / render bomb | CONFIRMED (high) | `/api/pdf-to-jpg` has no page cap beyond the 1,000 from `read_pdf` and no page-dimension cap. A tiny PDF with a huge MediaBox makes `get_pixmap(Matrix(1.5,1.5))` allocate huge memory. `_render_pdf_images` (png/webp/tiff/bmp) caps 200 pages but not pixels (Matrix 2x). Images-to-PDF already has pixel caps (25 MP / 40 MP total), so that pattern can be reused. |
| 2 | Multi-file upload size | PARTIAL (low-medium) | `merge` and `images-to-pdf` enforce a combined 50 MB. `compare` has no combined cap (2 x 50 MB). The only other guard is the `Content-Length` middleware (52 MB), which chunked requests without that header skip. In `merge`, the total is checked after each file is saved, so worst case is about 100 MB on disk, not unbounded. |
| 3 | Local rate-limit memory growth | CONFIRMED (medium) | Keys include the minute/hour bucket, so each IP x path x minute is a new key. Cleanup runs only when `len > 10000` and removes only expired entries. Unexpired entries can grow unbounded, and every request over the threshold scans the whole dict while holding the async lock (CPU DoS). |
| 4 | Sync work inside async handlers | CONFIRMED (high) | 60 `async def` handlers, only 2 uses of `run_in_threadpool/to_thread/run_in_executor`. fitz, pypdf, pdfplumber and Pillow calls run on the event loop, so one heavy PDF blocks every request including `/health` (a Render health-check risk). Needs measurement once dependencies install. |
| 5 | Dependency pinning / reproducible builds | CONFIRMED (medium) | `requirements.txt` pins only `openpyxl`; there is no lockfile. CI uses Python 3.12 but the stated production runtime is 3.13. Two overlapping backend workflows (`backend-validation.yml`, `pdfora-quality.yml`). `upgrade-frontend-security.yml` runs `npm install next@16.4.3` plus `npm audit fix`, which mutates dependencies in CI. |

## Backup files and committed test PDFs (nothing removed)
- `backend/backend/server.before-{tools,all-tools,pdf-jpg}.js`: no references found anywhere in the repo.
- `backend/backend/server.js` + `package.json` and root `server.js`: a second, Node-based backend. No `render.yaml` in the repo, so I cannot confirm which service Render actually runs. Do NOT delete until you confirm the Render start command is the Python `main.py`.
- `backend/{test1,test2,merged-test}.pdf` (5.5 MB): not referenced by name in tests. Check the tests' fixtures and git history before removal.
- `setup-v3.ps1` (30 KB): purpose unknown, not referenced.

## Other observations (unverified)
- CORS allowlist hardcodes two Vercel preview URLs.
- `read_pdf` uses a `;` after `raise`, and compact one-line handlers in the tools section reduce reviewability.
- `Content-Length` rate-limit and security checks are bypassable only for size, not for rate.
- Several tools (`ocr`, `pdf-to-word`) not yet reviewed.

## Planned fixes once dependencies are available (each with tests)
1. Page-dimension and pixel budget in all rendering endpoints (413 on exceed), plus a PDF-bomb test fixture.
2. Shared combined-size guard for every multi-file endpoint including `compare`.
3. Bounded rate-limit store (hard cap with eviction, no full scan under lock).
4. Run CPU-bound work via `run_in_threadpool` with a concurrency semaphore; measure before/after.
5. Pin `requirements.txt` (generated from a working env), align CI to Python 3.13, merge duplicate workflows.
