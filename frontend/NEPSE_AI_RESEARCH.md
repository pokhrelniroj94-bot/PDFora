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
