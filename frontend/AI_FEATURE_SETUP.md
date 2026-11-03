# PDFora AI features — free-plan setup

## Zero-spend policy

The AI writing endpoints use Cloudflare Workers AI only. They do not have a paid provider fallback. The API route remains disabled unless all three settings below are present.

1. Create or use a Cloudflare account on the **Workers Free** plan.
2. Create an API token restricted to the minimum Workers AI permissions needed to run models. Do not use an account-wide token.
3. Add the account ID, token, and explicit free-plan confirmation to the frontend deployment environment.

Required environment variables:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `PDFORA_CF_WORKERS_FREE_PLAN=true`

**Important:** Do not upgrade the Cloudflare account to Workers Paid for this zero-cost configuration. Workers AI includes a limited daily free allocation; on the Workers Free plan, requests stop after the allocation is exhausted. They should not switch to a paid provider or paid fallback. Check the current Cloudflare pricing and model catalogue before changing the model.

The current model configured in the route is `@cf/meta/llama-3.2-3b-instruct`. If Cloudflare retires or changes access to this model, update it only after confirming the replacement is available under the Free plan.

## Features

- `/tools/ai-resume-writer`: honest resume content generation
- `/tools/ai-cover-letter-generator`: job-specific cover letter
- `/tools/ai-humanizer`: natural rewriting while preserving facts
- `/tools/market-ai`: deterministic technical analysis for NEPSE or CSV OHLCV uploads for Forex/Crypto, with optional AI explanation
- `/resume-builder`: existing visual CV builder and PDF print/export, now linked to the AI writer

## Market data limitations

- NEPSE analysis uses the existing PDFora market endpoint and its currently configured YONEPSE public dataset. The feed is not an official NEPSE public API and may be delayed or unavailable.
- Forex and Crypto analysis currently accepts broker/exchange CSV exports. The app intentionally does not scrape public vendor feeds whose free plans or terms do not grant public commercial display and analysis rights.
- The market engine uses transparent indicator rules (EMA, RSI, MACD, volatility, support/resistance). It does not claim a probability of profit or guarantee a buy/sell outcome.
- Do not use TradingView display widgets as an input to automated calculations; TradingView's terms restrict non-display use of its market data.

## Privacy

AI writing inputs are sent to Cloudflare Workers AI when configured. Do not submit passwords, identity numbers, private keys, or confidential documents. The AI route does not persist prompts or generated text.
