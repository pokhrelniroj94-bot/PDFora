# PDFora NEPSE Research AI — methodology and source policy

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
