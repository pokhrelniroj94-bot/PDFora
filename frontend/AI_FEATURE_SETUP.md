# PDFora AI features — free-plan setup

## Zero-spend policy

The AI writing endpoints use Cloudflare Workers AI only. They do not have a paid provider fallback. The API route remains disabled unless all required settings below are present, including explicit operator enablement and a shared edge rate-limit confirmation.

1. Create or use a Cloudflare account on the **Workers Free** plan.
2. Create an API token restricted to the minimum Workers AI permissions needed to run models. Do not use an account-wide token.
3. Add the account ID, token, and explicit free-plan confirmation to the frontend deployment environment.

Required environment variables:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `PDFORA_CF_WORKERS_FREE_PLAN=true`
- `PDFORA_AI_ENABLED=true` (keep `false` until ready for public launch)
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Upstash Redis Free REST credentials used by the API's atomic shared limiter)

The `UPSTASH_REDIS_REST_URL` must be the HTTPS REST endpoint copied from the Upstash database's **REST API** section (normally `https://<database>.<region>.upstash.io`). Do not paste the Redis TCP connection string beginning with `redis://` or `rediss://`. The API validates HTTPS format before making a request and emits only a fixed diagnostic code; it never logs the URL or token.
- `PDFORA_AI_RATE_LIMIT_READY=true` (only after the Upstash Free database is provisioned and the shared Redis limiter has been tested)

**Important:** Do not upgrade the Cloudflare account to Workers Paid for this zero-cost configuration. Workers AI includes a limited daily free allocation; on the Workers Free plan, requests stop after the allocation is exhausted. They should not switch to a paid provider or paid fallback. Check the current Cloudflare pricing and model catalogue before changing the model.

The current model configured in the route is `@cf/meta/llama-3.2-3b-instruct`. If Cloudflare retires or changes access to this model, update it only after confirming the replacement is available under the Free plan. The `PDFORA_CF_WORKERS_FREE_PLAN` setting is an operator confirmation only; it does not query Cloudflare to verify the account plan. Keep it `false` until you have checked the Cloudflare dashboard. The daily free allocation is shared with other Workers AI usage in the account.

Official reference: https://developers.cloudflare.com/workers-ai/platform/pricing/

## Features

- `/tools/ai-resume-writer`: honest resume content generation
- `/tools/ai-cover-letter-generator`: job-specific cover letter
- `/tools/ai-humanizer`: natural rewriting while preserving facts
- `/tools/market-ai`: deterministic technical analysis for NEPSE or CSV OHLCV uploads for Forex/Crypto, with optional AI explanation
- `/resume-builder`: existing visual CV builder and PDF print/export, now linked to the AI writer

## Market data limitations

- NEPSE analysis uses the existing PDFora market endpoint and its currently configured YONEPSE public dataset. The feed is not an official NEPSE public API and may be delayed or unavailable.
- Forex and Crypto analysis currently accepts broker/exchange CSV exports. The app intentionally does not scrape public vendor feeds whose free plans or terms do not grant public commercial display and analysis rights. For example, CoinGecko states that its Demo plan does not include commercial rights (https://support.coingecko.com/articles/1043089972-what-are-the-differences-between-commercial-and-custom-licenses); Twelve Data describes individual/free use as personal or internal and non-production (https://support.twelvedata.com/en/articles/5332349-commercial-and-personal-usage); and TradingView restricts use of its market data for automated algorithmic decision-making (https://www.tradingview.com/policies/). Review current terms before adding a live provider.
- The market engine uses transparent indicator rules (EMA, RSI, MACD, volatility, support/resistance). It does not claim a probability of profit or guarantee a buy/sell outcome.
- Do not use TradingView display widgets as an input to automated calculations; TradingView's terms restrict non-display use of its market data.

## Privacy

AI writing inputs are sent to Cloudflare Workers AI when configured. Do not submit passwords, identity numbers, private keys, or confidential documents. The AI route does not persist prompts or generated text. The endpoint rejects request bodies larger than 16 KB, applies field-level length limits, disables response caching, avoids logging prompts or credentials, and uses an atomic shared Upstash Redis counter (8 requests per IP hash per 60 seconds). If Redis is missing or unavailable, the route fails closed instead of sending a request to the model. The route fails closed until the owner explicitly enables AI and confirms that the Upstash Redis shared rate limiter is configured and tested. Do not set `PDFORA_AI_RATE_LIMIT_READY=true` until the edge rule is live and tested. Set a Cloudflare account spending/billing safeguard as well; the environment flag alone cannot enforce a free account plan.
