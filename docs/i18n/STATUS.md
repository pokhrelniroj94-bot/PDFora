# PDFora i18n rollout: status

Branch: `i18n/global-multilingual` (from `feat/pdf-ora-ai-help-market-signals` @ 8cf31b8). Not merged, not deployed.

## Execution limits (verified in this sandbox)
- `npm ci` / `next build` / lint / tsc: BLOCKED. npm crashes and the egress proxy answers 403 for registry.npmjs.org. Nothing has been built or tested; no result below is a PASS.
- Existing `npm run verify:tools` FAILS on this branch before any i18n change: "Homepage is not using the canonical tool directory" (scripts/verify-tool-catalog.mjs:87). The homepage moved to `components/HomePageClient.tsx` while the script reads `app/page.tsx`. Needs a reviewed fix; the test was not edited or removed.

## Inventory (static parse, see inventory.json)
- Page routes 63, API routes 6, catalog entries 125 (10 categories), 49 legacy root-level PDF slugs.
- Hand-written blog slugs: 8 (blog-posts.ts) + 19 (nepal-blog-posts.ts); tool-guides.ts adds posts at runtime (count to confirm at build time).
- Branch-specific features to preserve: NEPSE market/research/lab, forex, news APIs, AI writing (`/api/ai-writing`, Upstash + Cloudflare rate limiting), SiteAIHelp, SmartToolCenter, MarketIntelligence.

## Status table
| Phase | Status |
|---|---|
| 1 Discovery | PARTIALLY COMPLETE (static only) |
| 2 Core i18n | NOT STARTED (needs build) |
| 3 Shared UI | NOT STARTED |
| 4 Tools (125) | NOT STARTED |
| 5 Blog | NOT STARTED |
| 6 Static pages | NOT STARTED |
| 7 SEO | NOT STARTED |
| 8 Security/perf | NOT STARTED |
| 9 Regression | NOT STARTED |
