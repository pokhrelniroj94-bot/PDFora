# PDFora NEPSE Quant Research Engine — methodology and source policy

## What the report does
The NEPSE Market Intelligence tool combines deterministic price/volume indicators with a grounded AI explanation. For an individual listed company, the report endpoint attempts to retrieve matching records from the YONEPSE public dataset:
- company financial reports and profile
- proposed dividend history
- exchange disclosures and notices

The model is instructed to separate facts from interpretation, report missing fields as unavailable, avoid inventing ratios or corporate actions, and disclose source/freshness limitations. The model cannot change the deterministic technical signal.

## Data provenance
- The current market endpoint uses a NEPSE-session feed where available and YONEPSE public historical datasets as fallback.
- YONEPSE documents its project as an independent community data project and attributes some data to NEPSE, ShareSansar, Merolagani and other open-data maintainers. It is not an official NEPSE developer API and must not be labelled as such.
- Company research endpoint uses the YONEPSE public JSON files. It matches records by explicit symbol fields or symbol-keyed objects only. Missing records are not interpreted as zero, negative or a clean bill of health.
- News headlines are a screening source only; the report must not claim to have read full articles unless the text is actually supplied.

## Research framework
A useful Nepal equity research note should cover, when source fields exist:
1. Business/profile and sector context.
2. Earnings quality and trend: revenue, operating profit, net profit, EPS, reserves, net worth and capital.
3. Valuation: P/E and P/B only where valid, comparable period and units are clear.
4. Sector-specific risk: e.g. NPL, capital adequacy and cost of funds for banks; generation, capacity, PPA and hydrology for hydropower; claims/solvency for insurers. Never infer absent fields.
5. Dividend/corporate actions and dated exchange disclosures.
6. Technical trend: EMA, RSI, MACD, volatility, support/resistance and volume only where present.
7. Liquidity, price gaps, corporate-action adjustment, stale-data, fees and slippage.
8. Bull/base/bear conditions and what evidence would invalidate the thesis. No price targets or win probabilities without a validated methodology.

## Regulatory and investor-protection context
SEBON is Nepal's apex securities-market regulator under the Securities Act, 2006. Its functions include regulating securities issuance/trading, licensing market intermediaries and preventing insider trading and other securities offences. Consult current SEBON acts, regulations, guidelines, circulars and notices; do not hard-code draft proposals as binding rules.

Useful primary references:
- SEBON: https://sebon.gov.np/
- SEBON laws and regulations: https://sebon.gov.np/compiled-laws
- SEBON guidelines: https://sebon.gov.np/guidelines
- NEPSE: https://www.nepalstock.com/

## Important limitations
This is research assistance, not a licensed investment advisory service. It does not access a user's TMS, Demat, broker account or private portfolio. It must not execute trades. Data rights, upstream availability, timestamp coverage, corporate-action adjustments and field definitions must be reviewed before commercial redistribution or claims of real-time accuracy.


## Offline-first deterministic analysis (November 2026)

The core NEPSE analysis must remain useful when every AI provider is disabled or unavailable. AI is an optional explanation layer only; it must never create, suppress, or rewrite a deterministic technical/fundamental result.

Current offline-first behavior:
- Technical indicators and confluence scoring are computed locally from daily price history. A failed headline/news request no longer prevents technical analysis.
- Headline screening is shown as separate context. Headline keyword sentiment is not a reliable substitute for reading an exchange filing and must not alter the technical signal.
- Company fundamentals are displayed from explicitly matched structured financial reports: reported EPS, P/E, profit, paid-up capital and net worth per share. Indicative P/B is calculated only when both market price and positive book value per share exist.
- EPS/profit growth is calculated only against the same quarter in an earlier fiscal year. If no comparable report exists, growth is unavailable; missing data is never converted to zero.
- Company financial records are preserved in a bounded structured response so the browser can render a non-AI fundamental snapshot. The dataset may be manually refreshed and is not guaranteed to be current.
- Nepal-time freshness checks reject malformed or future-dated candles. NEPSE weekly closures are Friday and Saturday; public holidays and source outages still require explicit freshness caveats.
- Flat-price RSI is neutral (50), not 100.

## Nepal market drivers to model as separate evidence

Do not treat one macro variable as a deterministic cause of a stock move. Research by Nepal Rastra Bank and Nepal-based academic studies has found relationships between market performance and broad money/liquidity, lending rates, monetary-policy changes and political conditions, but effects vary by period and methodology. These belong in a separate market-regime/context layer with source dates, not in a fabricated per-stock forecast.

For company-level work, use sector-aware fundamentals only when the underlying report fields exist. For banks, relevant fields include NPL, capital adequacy, cost of funds and net interest margin; for hydropower, generation, capacity, PPA and hydrology; for insurers, claims and solvency. The currently exposed compact financial schema does not guarantee all these fields, so the engine must explicitly mark them unavailable rather than infer them.

## Validation requirements before production claims

- Run TypeScript, ESLint, production build and browser-level tests on the exact commit.
- Verify the technical engine against hand-calculated indicator fixtures and synthetic edge cases (flat series, missing volume, duplicate dates, stale/future dates, splits/bonus adjustments).
- Backtest with next-session execution, realistic brokerage/SEBON/DP fees, price bands/circuit limits, liquidity constraints and out-of-sample periods. Report sample size, benchmark, max drawdown, exposure and profit factor; never present historical win rate as a future probability.
- Confirm upstream data timestamps and source attribution on every report. Do not label community datasets as official NEPSE APIs.
- Keep a hard no-signal state when required price history is insufficient, stale, malformed or materially inconsistent.


## Live-data provider hierarchy and licensing

The market endpoint supports this provider order:
1. **ShareHub NEPSE Data API**, when server-side `SHAREHUB_EMAIL` and `SHAREHUB_PASSWORD` are configured and its live services work. It provides a documented licensed REST API; its documentation states approximately 20-second refresh during trading and 5-minute refresh while closed. It requires a Data API licence, enabled endpoint packages and an allow-listed server IP. Never put credentials in browser code or `NEXT_PUBLIC_*` variables.
2. **NEPSEman unofficial session API**, when it returns a sufficiently broad, timestamp-verified snapshot.
3. **YONEPSE public open dataset**, used for archived OHLCV/history and as the public fallback. YONEPSE attributes its live snapshot upstream to the official NEPSE API, but remains an independent community project and is not an official NEPSE developer service.

ShareHub integration is conditional, not automatically active: no licence or credentials are assumed. Its API may be paid/licensed; confirm current pricing, redistribution/display rights, enabled package, server egress IP allow-list and terms with ShareHub before enabling it. Its documented API uses bearer authentication with short-lived access tokens; this server route keeps credentials out of the client and refreshes tokens in process memory. Serverless cold starts may authenticate again. If a stable outbound IP is required and the deployment platform cannot provide one, use an approved fixed-egress backend or ask ShareHub about test mode; do not bypass the IP allow-list.

NEPSE itself operates the primary exchange data service at https://www.nepalstock.com/. A public, supported developer API suitable for unauthenticated third-party commercial use was not identified in this review. Some open-source projects reverse-engineer its client authentication, but that is brittle and can break when NEPSE changes its web application. Do not build a production dependency on reverse-engineered authentication without reviewing the exchange terms and operational risk.

## Additional deterministic context panels

- Market regime: calculate 20/50-session index returns, EMA alignment and realized volatility from index history.
- Market breadth: count advancers, decliners and unchanged stocks only when daily percentage-change fields exist.
- Sector rotation: rank sector index daily changes; this is relative performance, not evidence of actual fund flows.
- Relative strength: compare the selected symbol and NEPSE over overlapping dated observations.
- Advanced diagnostics: ATR(14), ADX(14), latest volume versus prior 20-session average and OBV direction. ATR/ADX require OHLC data; volume/OBV require complete volume data. Missing inputs are explicitly unavailable.

## Deterministic calculation and validation notes (November 2026)

- Daily history is normalized to valid ISO calendar dates, positive closes and one observation per date (last source row wins). Invalid dates, non-positive closes and malformed observations are dropped before analysis.
- RSI(14) uses Wilder's initial arithmetic averages and subsequent Wilder smoothing. A completely flat sequence returns neutral RSI 50.
- The index regime requires at least 51 valid dated closes to calculate a true 50-session return. Realized volatility is the population standard deviation of the latest 20 daily returns annualized by √252.
- ATR(14) and directional movement use Wilder smoothing. ADX is a trend-strength measure, not a direction forecast. OHLC fields must be present and valid; missing OHLC does not get reconstructed from close prices.
- Volume ratio compares the latest volume with the prior 20 available sessions (at least 10 valid observations). OBV is shown only when the full series has valid volume.
- Backtest signals are evaluated from the previous completed close and filled at the next available daily close. The user-entered cost estimate is applied on both entry and exit. The buy-and-hold benchmark starts on the same first test session as the strategy. Open positions are marked at estimated net liquidation value; holding exposure counts entry and exit sessions.
- Large daily price changes (20% or more) are flagged for manual corporate-action/source review. They may be real market moves, bonus/right-share/split effects or data errors. No automatic adjustment is made because an unverified adjustment factor could distort results.
- Deterministic numerical fixtures cover Wilder RSI, invalid/duplicate date handling, 20/50-session market regime, Wilder ATR/ADX, volume ratio, OBV, price-gap flags, flat-price backtests, trend crossover, benchmark alignment and round-trip costs.

Still not validated with provider credentials or exchange-adjusted source data: licensed ShareHub response schemas, corporate-action adjustment factors, circuit-limit fills, liquidity/market impact, taxes and out-of-sample performance. Those are production validation gates, not assumptions.

## Official Nepal macro-data sources and integration boundary

For future macro-regime coverage, prefer primary NRB/IMF-distributed datasets over copied market commentary:
- NRB Statistics & Data Links: https://www.nrb.org.np/departments/statistics-data-links/ — monthly macroeconomic situation, policy/deposit/lending rates, central-bank survey/liquidity position, BFI statistics and forex.
- NRB National Summary Data Page (NSDP): https://www.nrb.org.np/nsdp/ — downloadable SDMX datasets for CPI, interest rates, depository corporations survey, central-bank survey, stock market and balance of payments.
- NRB Forex API documentation: https://www.nrb.org.np/api-docs-v1/ — documented JSON API for daily FX rates; this API is for forex, not a general macroeconomic indicator endpoint.
- NRB homepage indicators: https://www.nrb.org.np/ — headline deposit/credit, interbank rate, inflation, broad-money and private-credit figures are displayed with reporting dates.

The official sources reviewed expose macro data through a mix of monthly publications, SDMX downloads and a dedicated forex API. A stable, documented, unauthenticated JSON endpoint for the complete monthly macro series was not established in this implementation. Therefore the deterministic NEPSE engine does not fabricate or silently scrape macro values. Until a schema-stable source is verified, show macro indicators as unavailable or source-linked context; preserve the publication date, fiscal period, unit, revision status and source URL for every imported observation.
