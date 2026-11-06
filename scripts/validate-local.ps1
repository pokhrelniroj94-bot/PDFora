$ErrorActionPreference = "Stop"

function Invoke-Check {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Command,
        [Parameter(Mandatory = $true)][string[]]$Arguments
    )

    Write-Host "`n=== $Name ===" -ForegroundColor Cyan
    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Name failed with exit code $LASTEXITCODE"
    }
}

$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root "frontend"
$backend = Join-Path $root "backend"
$venvPython = Join-Path $backend ".venv\Scripts\python.exe"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js 22 is required. Install Node.js 22 and reopen PowerShell."
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm was not found. Reinstall Node.js 22 with npm."
}
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    throw "Python 3.12 is required. Install Python 3.12 and reopen PowerShell."
}

$nodeVersion = node -p "process.versions.node"
$nodeParts = $nodeVersion.Split(".")
$nodeMajor = [int]$nodeParts[0]
$nodeMinor = [int]$nodeParts[1]
if ($nodeMajor -lt 20 -or ($nodeMajor -eq 20 -and $nodeMinor -lt 9)) {
    throw "Node.js 20.9+ is required; Node.js 22 is recommended to match CI. Detected: $nodeVersion"
}

$pythonVersion = python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"
if ($pythonVersion -ne "3.12") {
    throw "Python 3.12 is required to match CI. Detected: $pythonVersion"
}

Write-Host "PDFora local validation (no GitHub Actions billing required)" -ForegroundColor Green

Invoke-Check "Legacy Express syntax" "node" @("--check", (Join-Path $backend "backend\server.js"))

if (-not (Test-Path $venvPython)) {
    Invoke-Check "Create backend virtual environment" "python" @("-m", "venv", (Join-Path $backend ".venv"))
}

Invoke-Check "Install backend dependencies" $venvPython @("-m", "pip", "install", "--upgrade", "pip")
Invoke-Check "Install backend requirements" $venvPython @("-m", "pip", "install", "-r", (Join-Path $backend "requirements.txt"))
Invoke-Check "Install backend test and audit tools" $venvPython @("-m", "pip", "install", "pytest", "httpx", "requests", "pip-audit")
Invoke-Check "Compile Python backend" $venvPython @("-m", "compileall", "-q", $backend)
Invoke-Check "Run backend regression tests" $venvPython @("-m", "pytest", "-q", (Join-Path $backend "tests"))
Invoke-Check "Audit Python dependencies" $venvPython @("-m", "pip_audit", "-r", (Join-Path $backend "requirements.txt"))

Push-Location $frontend
try {
    Invoke-Check "Install frontend dependencies" "npm" @("ci")
    Invoke-Check "Verify tool catalog" "npm" @("run", "verify:tools")
    Invoke-Check "Run i18n unit tests" "npm" @("run", "i18n:test")
    Invoke-Check "Check i18n content" "npm" @("run", "i18n:check")
    Invoke-Check "Run TypeScript check" "npx" @("tsc", "--noEmit")
    Invoke-Check "Run frontend lint" "npm" @("run", "lint")
    Invoke-Check "Build frontend for production" "npm" @("run", "build")
    Invoke-Check "Audit production npm dependencies" "npm" @("audit", "--omit=dev", "--audit-level=high")
}
finally {
    Pop-Location
}

Write-Host "`nAll local validation steps passed." -ForegroundColor Green
