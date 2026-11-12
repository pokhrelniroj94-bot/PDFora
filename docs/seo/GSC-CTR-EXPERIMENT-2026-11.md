# GSC CTR experiment: calculator and PDF landing pages

## Baseline (before the November 12, 2026 title and tool updates)

Google Search Console, 28-day performance window: **October 13–November 9, 2026**.

| Page / query group | Impressions | Clicks | Average position |
|---|---:|---:|---:|
| Reading Time Calculator guide | 661 | 0 | 6.1 |
| Savings Goal Calculator guide | 830 | 0 | 8.6 |
| Tip Calculator guide | 492 | 0 | 9.8 |
| Percentage Change Calculator guide | 258 | 0 | 9.0 |
| Query: “how to calculate tip” | 482 | 0 | 9.1 |

These are reported guide-page/query baseline figures, not country-specific ranking positions. Average position is aggregated and varies by location, device, query and date.

## Changes being tested

- **Reading Time:** title/snippet now communicates reading and speaking-time estimates; calculator supports separate reading and speaking WPM values.
- **Savings Goal:** title/snippet now communicates weekly or monthly deposits and an interest-rate estimate; calculator models regular end-of-period deposits.
- **Tip Calculator:** title/snippet surfaces common 10%, 15% and 20% tip use cases plus the bill split.
- **Percentage Change:** reverse calculation is now available in the tool; page title and description explain both forward and reverse use.
- **Meta Title / Description:** guide and tool intent are separated; the live preview remains explicitly illustrative because Google may choose different title links and snippets.
- **PDF operations:** Split PDF and Delete Pages now have more specific metadata, clearer use cases, relevant internal links and Adobe help references.

## Measurement protocol

1. Record the production deployment date and the first date Google has recrawled each changed URL, where available.
2. Wait at least 28 days after recrawl before judging CTR. Allow more time if impressions are sparse.
3. In Search Console, compare the same URL, search type, country, device and query set against a comparable 28-day baseline.
4. Record clicks, impressions, CTR and average position together. A CTR increase caused by a better average position is not proof that the title alone caused the change.
5. Compare page-level results and main query rows. Watch for cannibalisation between each tool page and its informational guide.
6. Change one major title/snippet variable at a time where practical. Avoid repeatedly rewriting pages during the observation window.

## Guardrails

- Google may generate title links and snippets from page content and other signals; the authored title and meta description are not guaranteed to display verbatim.
- Search Console average position is an aggregate metric, not a fixed live rank.
- No ranking, indexing or CTR outcome is guaranteed.
- Keep useful page content, canonical URLs, indexability and contextual internal links intact. Do not add keyword-stuffed copy or thin near-duplicate pages.
- Do not mark the experiment successful based only on impressions. Use clicks and CTR alongside position, country and query intent.

## Next review

Review the first comparable 28-day period after the production changes have been deployed and recrawled. Add the actual date range and measured values here; do not overwrite the baseline.
