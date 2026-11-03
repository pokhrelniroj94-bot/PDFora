# PDFora AI provider setup

PDFora AI can use Anthropic Claude or Cloudflare Workers AI. Provider credentials are read only by the server-side API route at `/api/ai-writing`; never expose them through a `NEXT_PUBLIC_*` variable or commit them to Git.

## Recommended Claude configuration

In the Vercel project for PDFora, add these Environment Variables for Preview first:

- `PDFORA_AI_PROVIDER=anthropic`
- `ANTHROPIC_API_KEY=<your Anthropic Console API key>`
- `ANTHROPIC_MODEL=claude-haiku-5-5` (fast, cost-conscious default; change to a model enabled for your Anthropic account if needed)
- `PDFORA_AI_ENABLED=true` only after the AI usage limits and abuse controls are configured.
- `UPSTASH_REDIS_REST_URL=<your Upstash Redis REST URL>`\n- `UPSTASH_REDIS_REST_TOKEN=<your Upstash Redis REST token>`\n- `PDFORA_AI_RATE_LIMIT_READY=true` only after the Upstash database is provisioned and a Preview request confirms atomic rate limiting.

Do not add the API key to the repository, browser code, client environment variables, screenshots, or chat messages. Store it only in Vercel Environment Variables. Set it for Preview first, then test a Preview deployment before considering Production.

## Provider behavior

- `PDFORA_AI_PROVIDER=anthropic` selects Claude.
- `PDFORA_AI_PROVIDER=cloudflare` selects Cloudflare Workers AI and requires `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and `PDFORA_CF_WORKERS_FREE_PLAN=true`.
- If the provider variable is omitted, the route selects Anthropic when `ANTHROPIC_API_KEY` exists; otherwise it selects Cloudflare.
- The route does not silently switch to a paid provider when the selected provider fails.
- The Claude model defaults to `claude-haiku-5-5`; `ANTHROPIC_MODEL` can override it.
- The route uses an atomic Redis Lua counter through Upstash REST (8 requests per IP per 60 seconds). IP addresses are SHA-256 hashed before being used as Redis keys. If Upstash is missing or unavailable, the API fails closed and does not call the model.

## Test checklist

1. Configure Preview variables only.
2. Deploy a Preview build and verify the API returns a normal response for a harmless test prompt.
3. Verify invalid JSON, oversized bodies, missing API key, provider errors, and 429 responses fail safely.
4. Verify prompts and credentials are not written to logs.
5. Verify the shared Upstash rate limiter from separate Preview instances and confirm requests above the limit return HTTP 429.
6. Only after browser QA and spend limits are confirmed should the owner enable Production.

Claude API reference: https://platform.claude.com/docs/en/api/messages/create
