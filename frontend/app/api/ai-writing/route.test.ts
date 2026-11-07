/** @jest-environment node */

import { POST } from "./route";

const ENV_KEYS = [
  "PDFORA_AI_ENABLED",
  "PDFORA_AI_RATE_LIMIT_READY",
  "PDFORA_AI_PROVIDER",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_API_TOKEN",
  "PDFORA_CF_WORKERS_FREE_PLAN",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
] as const;

const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://pdfora.test/api/ai-writing", {
    method: "POST",
    headers: { "content-type": "application/json", "x-vercel-forwarded-for": "203.0.113.10", ...headers },
    body: JSON.stringify(body),
  });
}

function configureAI() {
  process.env.PDFORA_AI_ENABLED = "true";
  process.env.PDFORA_AI_RATE_LIMIT_READY = "true";
  process.env.PDFORA_AI_PROVIDER = "cloudflare";
  process.env.CLOUDFLARE_ACCOUNT_ID = "test-account";
  process.env.CLOUDFLARE_API_TOKEN = "test-token";
  process.env.PDFORA_CF_WORKERS_FREE_PLAN = "true";
  process.env.UPSTASH_REDIS_REST_URL = "https://test-redis.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-redis-token";
}

function mockSuccessfulProviders() {
  const fetchMock = jest.spyOn(global, "fetch").mockImplementation(async (input) => {
    const url = String(input);
    if (url.includes("upstash.io")) {
      return Response.json({ result: 1 });
    }
    if (url.includes("api.cloudflare.com")) {
      return Response.json({ success: true, result: { response: "Generated safely." } });
    }
    throw new Error("Unexpected external request");
  });
  return fetchMock;
}

describe("POST /api/ai-writing", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    for (const key of ENV_KEYS) delete process.env[key];
    configureAI();
  });

  afterAll(() => {
    for (const key of ENV_KEYS) {
      const value = originalEnv[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    jest.restoreAllMocks();
  });

  it("rejects non-JSON requests without contacting providers", async () => {
    const fetchMock = jest.spyOn(global, "fetch");
    const response = await POST(new Request("https://pdfora.test/api/ai-writing", {
      method: "POST", headers: { "content-type": "text/plain" }, body: "hello",
    }));
    expect(response.status).toBe(415);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects untrusted browser origins before contacting providers", async () => {
    const fetchMock = jest.spyOn(global, "fetch");
    const response = await POST(request(
      { kind: "site-help", question: "Synthetic origin security test" },
      { Origin: "https://attacker.example" },
    ));
    expect(response.status).toBe(403);
    expect((await response.json()).code).toBe("ORIGIN_NOT_ALLOWED");
    expect(response.headers.get("cache-control")).toMatch(/no-store/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allows this project's exact Vercel Preview origin", async () => {
    mockSuccessfulProviders();
    const response = await POST(request(
      { kind: "site-help", question: "How do I merge PDF files?" },
      { Origin: "https://pd-fora-git-qa-173-tool-br-168b6d-pokhrelniroj94-7012s-projects.vercel.app" },
    ));
    expect(response.status).toBe(200);
    expect((await response.json()).provider).toBe("Cloudflare Workers AI (Free allocation)");
  });

  it("rejects malformed JSON and unsupported tasks", async () => {
    const invalid = await POST(new Request("https://pdfora.test/api/ai-writing", {
      method: "POST", headers: { "content-type": "application/json" }, body: "{",
    }));
    expect(invalid.status).toBe(400);
    const unsupported = await POST(request({ kind: "unknown-task" }));
    expect(unsupported.status).toBe(400);
  });

  it("rejects oversized bodies before contacting providers", async () => {
    const fetchMock = jest.spyOn(global, "fetch");
    const response = await POST(new Request("https://pdfora.test/api/ai-writing", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "20000" },
      body: JSON.stringify({ kind: "ai-humanizer", text: "x" }),
    }));
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when a required provider credential is missing", async () => {
    delete process.env.CLOUDFLARE_API_TOKEN;
    const fetchMock = jest.spyOn(global, "fetch");
    const response = await POST(request({ kind: "site-help", question: "How do I use this?" }));
    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("AI_NOT_CONFIGURED");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when the shared limiter is missing", async () => {
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    const fetchMock = jest.spyOn(global, "fetch");
    const response = await POST(request({ kind: "site-help", question: "Help" }));
    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("AI_NOT_CONFIGURED");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["ai-resume-writer", { role: "Analyst", skills: "Excel", experience: "Intern" }],
    ["ai-cover-letter-generator", { role: "Analyst", company: "Example Ltd", skills: "Excel" }],
    ["ai-humanizer", { text: "This is a sentence to rewrite." }],
    ["market-explain", { analysis: "RSI 45", research: "No research records" }],
    ["site-help", { question: "How do I merge PDF files?" }],
    ["forex-explain", { source: "NRB", rateDate: "2026-11-07", rates: "[]" }],
  ])("generates a bounded response for %s", async (kind, fields) => {
    const fetchMock = mockSuccessfulProviders();
    const response = await POST(request({ kind, ...fields }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      text: "Generated safely.",
      provider: "Cloudflare Workers AI (Free allocation)",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const cloudflareCall = fetchMock.mock.calls.find(([url]) => String(url).includes("api.cloudflare.com"));
    expect(cloudflareCall).toBeDefined();
    expect(JSON.stringify(cloudflareCall)).not.toContain("test-token");
  });

  it("bounds large market research payloads and still generates a response", async () => {
    const fetchMock = mockSuccessfulProviders();
    const response = await POST(request({
      kind: "market-explain",
      analysis: "A".repeat(4200),
      research: "R".repeat(8500),
      question: "Explain the supplied market data.",
    }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ text: "Generated safely." });
    const cloudflareCall = fetchMock.mock.calls.find(([url]) => String(url).includes("api.cloudflare.com"));
    const requestBody = JSON.parse(String(cloudflareCall?.[1]?.body));
    const prompt = requestBody.messages[1].content;
    expect(prompt.length).toBeLessThanOrEqual(14000);
    expect(prompt).toContain("R".repeat(6000));
    expect(prompt).not.toContain("R".repeat(6001));
  });

  it("stops at the shared eight-request limit and returns Retry-After", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(Response.json({ result: 9 }));
    const response = await POST(request({ kind: "site-help", question: "Help" }));
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns a safe provider error without exposing upstream details", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockImplementation(async (input) => {
      if (String(input).includes("upstash.io")) return Response.json({ result: 1 });
      return Response.json({ success: false, errors: [{ message: "private upstream detail" }] }, { status: 429 });
    });
    const response = await POST(request({ kind: "ai-humanizer", text: "Rewrite this." }));
    expect(response.status).toBe(429);
    const payload = await response.json();
    expect(payload.code).toBe("AI_RATE_LIMITED");
    expect(JSON.stringify(payload)).not.toContain("private upstream detail");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("fails closed when Upstash is unreachable and never contacts Cloudflare", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockRejectedValue(new Error("private network detail"));
    const response = await POST(request({ kind: "site-help", question: "Help" }));
    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("RATE_LIMIT_UNAVAILABLE");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not cache generated responses", async () => {
    mockSuccessfulProviders();
    const response = await POST(request({ kind: "ai-humanizer", text: "Rewrite this." }));
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
});
