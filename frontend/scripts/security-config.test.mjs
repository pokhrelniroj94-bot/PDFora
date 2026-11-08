import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const nextConfig = read("../next.config.ts");
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

assert.ok(!fs.existsSync(new URL("../app/api/ai-writing", import.meta.url)), "Retired AI writing API must not exist");
assert.ok(!fs.existsSync(new URL("../app/api/ai-writing/route.ts", import.meta.url)), "Retired AI writing route must not exist");
for (const [name, source] of [["next.config.ts", nextConfig], ["privacy page", privacy], ["backend", backend]]) {
  assert.doesNotMatch(source, /cloudflare workers ai|PDFORA_AI_|UPSTASH_REDIS_REST/i, `${name} must not reference retired AI provider configuration`);
}

assert.doesNotMatch(privacy, /cloudflare workers ai/);
assert.match(privacy, /adsterra/);
assert.match(privacy, /after processing/);
assert.match(robots, /disallow:\s*\["\/api\/"\]/);
assert.match(sitemap, /!isCatalogGeneratedGuide\(post\.slug\)/);

console.log("Security configuration checks passed: response headers, restricted CORS, upload cleanup, rate limits, AI-free privacy disclosures and crawl controls.");
