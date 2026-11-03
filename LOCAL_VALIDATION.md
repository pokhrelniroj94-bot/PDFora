# PDFora local validation (no GitHub Actions billing)

GitHub Actions is currently blocked by the repository owner's billing/spending-limit status. You do not need to pay GitHub Actions to run the project checks: run them on a Windows computer with Node.js and Python installed.

## Requirements

- Git
- Node.js 22 (Node.js 20.9+ is the minimum for the current Next.js version)
- Python 3.12
- Internet access to install npm and Python dependencies

## Run all checks on Windows

Open PowerShell in the repository root and run:

```powershell
git checkout feat/ai-writing-market-intelligence
git pull
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\validate-local.ps1
```

The script checks the legacy Express server syntax, installs backend dependencies into a repository-local `backend/.venv`, compiles Python, runs backend tests, audits Python dependencies, installs frontend dependencies, verifies the tool catalog, runs ESLint, builds Next.js, and audits production npm dependencies.

## Important

- This runs checks on your computer; it does not make GitHub Actions green or change GitHub billing.
- The first run can take several minutes and needs internet access.
- If a check fails, copy the complete PowerShell output from the first failure and share it before attempting a deployment.
- A successful local build is not a substitute for production smoke tests or a full security review.
- Do not commit `.env`, API tokens, passwords, or generated secrets. Keep Cloudflare credentials server-side only.
- GitHub Actions workflows are intentionally retained. They can run again if GitHub restores runner access.
