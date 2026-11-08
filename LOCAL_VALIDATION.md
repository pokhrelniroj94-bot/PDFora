# PDFora local validation

Use this script to validate the audit-fix branch on Windows without relying on GitHub Actions runner availability.

## Requirements

- Git
- Node.js 22 (Node.js 20.9+ is the minimum for the current Next.js version; Node 22 is required by the i18n check script)
- Python 3.12
- Internet access to install npm and Python dependencies

## Get the exact audit-fix branch

Open PowerShell in the repository root and run:

```powershell
git fetch origin fix/168-tool-audit-followups-2026-11-05
git checkout -B fix/168-tool-audit-followups-2026-11-05 origin/fix/168-tool-audit-followups-2026-11-05
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\validate-local.ps1
```

If you already have the branch checked out, use `git pull origin fix/168-tool-audit-followups-2026-11-05` before running the script.

## What the script checks

- Legacy Express server syntax.
- Backend dependency installation, Python compilation, and backend regression tests.
- Python dependency audit.
- Frontend dependency installation.
- Unified tool catalogue and handler consistency.
- i18n runtime unit tests and translation-file consistency.
- TypeScript type-check, ESLint, and production Next.js build.
- Production npm dependency audit.

The script stops at the first failing check and prints the exact stage. The first run can take several minutes and requires internet access.

## Important

- Local checks do not change GitHub Actions status or billing.
- A successful local build is not a substitute for production smoke tests or full browser QA.
- Do not commit `.env`, API tokens, passwords, or generated secrets. Keep any integration credentials server-side only.
- Do not merge or deploy to Production until local validation, NRB/NEPSE/Forex smoke tests, and browser QA have passed.
- OCR remains excluded from the available tools until backend OCR language data is installed and its end-to-end test passes.
- Generative AI features and their API endpoint have been retired from the application; do not reintroduce AI provider credentials or routes without a separate security and product review.
