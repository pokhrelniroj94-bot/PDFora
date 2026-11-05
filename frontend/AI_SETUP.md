# PDFora AI setup (free-only)

PDFora's site AI uses Cloudflare Workers AI on its Workers Free allocation. The route does not call Anthropic, OpenAI, or any paid fallback. If the free daily quota is exhausted, requests should fail until the quota resets; do not upgrade to a paid plan just to keep AI running.

## Required Vercel Preview environment variables

Add these variables to the PDFora Vercel project for Preview first:

- `PDFORA_AI_PROVIDER=cloudflare`
- `CLOUDFLARE_ACCOUNT_ID=<your Cloudflare account ID>`
- `CLOUDFLARE_API_TOKEN=<token with the required Workers AI permission>`
- `PDFORA_CF_WORKERS_FREE_PLAN=true` only when the Cloudflare account is on the Workers Free plan.
- `PDFORA_AI_ENABLED=true` only after the abuse controls below are configured.
- `UPSTASH_REDIS_REST_URL=<your Upstash Redis REST URL>`
- `UPSTASH_REDIS_REST_TOKEN=<your Upstash Redis REST token>`
- `PDFORA_AI_RATE_LIMIT_READY=true` only after the Upstash Free database is provisioned and Preview rate-limit tests pass.

Keep all credentials server-side in Vercel Environment Variables. Never use `NEXT_PUBLIC_*` names, commit credentials, or paste keys into chat.

## Free-tier limits and billing safety

- Cloudflare Workers AI documents 10,000 Neurons per day at no charge on Workers Free. Requests stop working after the free allocation is exhausted; do not switch the account to Workers Paid.
- Upstash Redis offers a $0 Free tier with 500,000 commands/month, 256 MB data and 10 GB monthly bandwidth. Keep the database on Free; do not enable Pay as You Go or a paid Fixed plan.
- Provider selection is Cloudflare-only. There is no automatic paid-provider fallback.
- The current model is `@cf/meta/llama-3.2-3b-instruct`.
- The route accepts request bodies up to 64 KiB and caps the assembled prompt at 18,000 characters. It uses an atomic Redis Lua counter through Upstash REST (8 requests per IP per 60 seconds). IP addresses are SHA-256 hashed before being used as Redis keys. If Upstash is missing or unavailable, the API fails closed and does not call the model.

## Preview test checklist

1. Configure only free-tier Preview credentials.
2. Verify Cloudflare account billing remains on Workers Free and Upstash remains on Free.
3. Deploy a Preview build and test a harmless prompt.
4. Verify invalid JSON, oversized bodies, missing credentials, provider errors, and 429 responses fail safely.
5. Verify requests stop when the Cloudflare free allocation is exhausted; never enable a paid upgrade to resolve quota errors.
6. Confirm multilingual inputs (including Nepali Unicode) stay within the documented body and prompt limits.
7. Keep Production disabled until build and browser QA pass.

Official limits: https://developers.cloudflare.com/workers-ai/platform/pricing/ and https://upstash.com/pricing/redis
