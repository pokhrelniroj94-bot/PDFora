const base = process.env.PDFORA_AI_PREVIEW_URL;
if (!base) {
  console.log(JSON.stringify({ status: "NOT_CONFIGURED", reason: "PDFORA_AI_PREVIEW_URL was not supplied; no provider request was sent." }));
  process.exit(0);
}
// Protected Preview requires the Vercel automation bypass secret.
// Do not send unauthenticated requests that only test the login wall.
// Keep the result explicitly BLOCKED, not PASS.
if (!process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
  console.log(JSON.stringify({
    status: "BLOCKED",
    reason: "Protected Preview requires the GitHub Actions secret VERCEL_AUTOMATION_BYPASS_SECRET. No AI provider requests were sent.",
  }));
  process.exit(0);
}

const cases = [
  { kind: "ai-resume-writer", payload: { name: "QA Sample", role: "Junior Analyst", experience: "Completed a fictional classroom spreadsheet exercise.", education: "BBA student", skills: "Excel, PowerPoint", jobDescription: "Entry-level analyst" } },
  { kind: "ai-cover-letter-generator", payload: { name: "QA Sample", role: "Junior Analyst", company: "Example Company", experience: "Completed a fictional classroom spreadsheet exercise.", skills: "Excel, PowerPoint", education: "BBA student", jobDescription: "Entry-level analyst" } },
  { kind: "ai-humanizer", payload: { text: "The sample report describes a fictional classroom project. It must preserve the stated facts and should not add new achievements." } },
  { kind: "market-explain", payload: { analysis: "Synthetic test only. NEPSE quote timestamp unavailable. No real price or trading data supplied.", research: "", question: "Explain why missing market data must not be treated as a buy signal." } },
  { kind: "site-help", payload: { page: "/tools/merge-pdf", question: "How do I merge two PDF files safely?" } },
  { kind: "forex-explain", payload: { source: "Synthetic QA fixture, not a real rate", rateDate: "2026-11-06", requestedDate: "2026-11-07", isStale: "true", rates: JSON.stringify([{ code: "USD", unit: 1, buy: 100, sell: 101 }]), question: "Explain the stale reference rate and why this is not a bank quote." } },
];
const checks = [];
const failures = [];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function call(testCase) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  // Optional Vercel Automation Bypass secret; never print or persist its value.
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers["x-vercel-protection-bypass"] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  }
  return fetch(new URL("/api/ai-writing", base), {
    method: "POST",
    headers,
    body: JSON.stringify({ kind: testCase.kind, ...testCase.payload }),
    cache: "no-store",
    signal: AbortSignal.timeout(40000),
  });
}
for (const testCase of cases) {
  let response;
  try {
    response = await call(testCase);
    if (response.status === 429) {
      const retry = Math.min(60, Math.max(1, Number(response.headers.get("retry-after") || 60)));
      await sleep(retry * 1000);
      response = await call(testCase);
    }
    const payload = await response.json().catch(() => ({}));
    const valid = response.ok && typeof payload.text === "string" && payload.text.trim().length >= 20 &&
      payload.provider === "Cloudflare Workers AI (Free allocation)" &&
      /no-store/i.test(response.headers.get("cache-control") || "");
    checks.push({
      kind: testCase.kind,
      status: valid ? "PASS" : "FAIL",
      httpStatus: response.status,
      provider: payload.provider || null,
      outputLength: typeof payload.text === "string" ? payload.text.length : 0,
      responseCode: payload.code || null,
      noStore: /no-store/i.test(response.headers.get("cache-control") || ""),
    });
    if (!valid) failures.push(testCase.kind + " returned " + response.status + " (" + (payload.code || "invalid response") + ")");
  } catch (error) {
    checks.push({ kind: testCase.kind, status: "FAIL", error: error instanceof Error ? error.name : "UnknownError" });
    failures.push(testCase.kind + " request failed");
  }
  // Keep the six synthetic requests below the shared 8/minute quota even if
  // CI retries a transient case.
  await sleep(1500);
}
const report = {
  generatedAt: new Date().toISOString(),
  previewHost: new URL(base).host,
  cases: checks,
  counts: { pass: checks.filter((x) => x.status === "PASS").length, fail: failures.length },
  note: "Synthetic inputs only. No real user data or financial instructions were submitted.",
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error("Live Preview AI checks failed:", failures.join("; "));
  process.exitCode = 1;
}
