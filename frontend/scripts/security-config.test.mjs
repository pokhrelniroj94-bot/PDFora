import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const nextConfig = read("../next.config.ts");
const aiRoute = read("../app/api/ai-writing/route.ts");
const privacy = read("../app/privacy/page.tsx").toLowerCase();
const robots = read("../app/robots.ts");
const sitemap = read("../app/sitemap.ts");
const backend = read("../../backend/main.py");
const backendTests = read("../../backend/tests/test_tool_api.py");

assert.match(nextConfig, /Strict-Transport-Security/);
assert.match(nextConfig, /X-Content-Type-Options/);
assert.match(nextConfig, /Referrer-Policy/);
assert.match(nextConfig, /Permissions-Policy/);
assert.match(nextConfig, /object-src 'none'/);
assert.match(nextConfig, /base-uri 'self'/);
assert.match(nextConfig, /frame-ancestors 'none'/);

assert.match(backend, /allow_origin_regex=r"\^https:\/\/pd-fora-\[a-z0-9-\]\+-pokhrelniroj94-7012s-projects\\\.vercel\\\.app\$"/);
assert.match(backend, /allow_credentials=False/);
assert.match(backendTests, /test_current_and_future_project_vercel_preview_origins_are_allowed_by_cors/);
assert.match(backendTests, /hostile_origin/);
assert.match(backendTests, /test_temp_job_is_removed_after_file_response/);
assert.match(backendTests, /test_cleanup_endpoint_is_not_public_without_admin_secret/);
assert.match(backendTests, /test_rate_limit_returns_429_for_api_post/);

assert.match(aiRoute, /TRUSTED_PREVIEW_ORIGIN/);
assert.match(aiRoute, /isAllowedBrowserOrigin/);
assert.match(aiRoute, /ORIGIN_NOT_ALLOWED/);
assert.match(aiRoute, /PDFORA_AI_ENABLED/);
assert.match(aiRoute, /PDFORA_AI_RATE_LIMIT_READY/);
assert.match(aiRoute, /UPSTASH_REDIS_REST_URL/);
assert.match(aiRoute, /SHARED_RATE_LIMIT_UNAVAILABLE/);
assert.match(aiRoute, /AbortSignal\.timeout\(25_000\)/);
assert.match(aiRoute, /const NO_STORE/);
assert.match(read("../app/api/ai-writing/route.test.ts"), /rejects untrusted browser origins before contacting providers/);
assert.match(read("../app/api/ai-writing/route.test.ts"), /allows this project's exact Vercel Preview origin/);
assert.doesNotMatch(aiRoute, /console\.(?:log|error)\([^\n]*(?:prompt|body\.text|cloudflareToken)/i);

assert.match(privacy, /cloudflare workers ai/);
assert.match(privacy, /adsterra/);
assert.match(privacy, /after processing/);
assert.match(robots, /disallow:\s*\["\/api\/"\]/);
assert.match(sitemap, /!isCatalogGeneratedGuide\(post\.slug\)/);

console.log("Security configuration checks passed: response headers, restricted CORS, upload cleanup, rate limits, AI fail-closed/no-store, privacy disclosures and crawl controls.");
