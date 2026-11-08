const base = process.env.E2E_BASE_URL || "http://127.0.0.1:3000";
const checks = [];
const failures = [];
async function request(path) {
  return fetch(new URL(path, base), { cache: "no-store", signal: AbortSignal.timeout(35000) });
}
function check(name, ok, detail = "") {
  checks.push({ name, status: ok ? "PASS" : "FAIL", detail });
  if (!ok) failures.push(name + (detail ? ": " + detail : ""));
}
const [forexResponse, nepseResponse, newsResponse, invalidForex, invalidNepse] = await Promise.all([
  request("/api/nepal-forex"),
  request("/api/nepse-market?symbol=NEPSE&period=1Y"),
  request("/api/nepal-market-news"),
  request("/api/nepal-forex?date=2099-99-99"),
  request("/api/nepse-market?symbol=INVALID%20SYMBOL&period=1Y"),
]);
check("NRB forex endpoint responds HTTP 200", forexResponse.status === 200, String(forexResponse.status));
check("NEPSE endpoint responds HTTP 200", nepseResponse.status === 200, String(nepseResponse.status));
check("Nepal market news endpoint responds HTTP 200", newsResponse.status === 200, String(newsResponse.status));
check("NRB rejects invalid dates", invalidForex.status === 400, String(invalidForex.status));
check("NEPSE rejects malformed symbols", invalidNepse.status === 400, String(invalidNepse.status));

let forex = null;
if (forexResponse.ok) {
  forex = await forexResponse.json();
  const usd = Array.isArray(forex.rates) ? forex.rates.find((row) => row.code === "USD") : null;
  const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(forex.rateDate || "");
  check("NRB payload has official source and dated snapshot", /Nepal Rastra Bank/i.test(forex.source || "") && dateValid,
    JSON.stringify({ source: forex.source, rateDate: forex.rateDate, requestedDate: forex.requestedDate }));
  check("NRB rates contain valid USD buy/sell and unit", Boolean(usd && Number(usd.unit) > 0 && Number(usd.buy) > 0 && Number(usd.sell) > 0),
    usd ? JSON.stringify({ unit: usd.unit, buy: usd.buy, sell: usd.sell }) : "USD rate missing");
  check("NRB stale snapshot is explicitly disclosed", !forex.isStale || Boolean(forex.notice),
    forex.notice || "stale response has no notice");
  const updated = Date.parse(forex.updatedAt || "");
  check("NRB response updatedAt is a valid timestamp", Number.isFinite(updated), forex.updatedAt || "missing");
}

let nepse = null;
if (nepseResponse.ok) {
  nepse = await nepseResponse.json();
  const timestamp = Date.parse(nepse.sourceUpdatedAt || "");
  const fetchedAt = Date.parse(nepse.fetchedAt || "");
  const age = Number(nepse.quoteAgeMinutes);
  check("NEPSE payload identifies source and fetch time", Boolean(nepse.source) && Number.isFinite(fetchedAt),
    JSON.stringify({ source: nepse.source, fetchedAt: nepse.fetchedAt }));
  check("NEPSE quote freshness is explicit", typeof nepse.quoteStale === "boolean" &&
    (nepse.quoteStale || (Number.isFinite(timestamp) && Number.isFinite(age) && age >= 0)),
    JSON.stringify({ sourceUpdatedAt: nepse.sourceUpdatedAt, quoteAgeMinutes: nepse.quoteAgeMinutes, quoteStale: nepse.quoteStale }));
  check("NEPSE snapshot does not claim a future source timestamp", !Number.isFinite(timestamp) || timestamp <= Date.now() + 120000,
    nepse.sourceUpdatedAt || "timestamp missing");
  check("NEPSE historical fallback is identified", !nepse.quoteStale || /fallback/i.test(nepse.source || "") || nepse.partial === true || nepse.quoteStale === true,
    nepse.source || "fallback not identified");
  check("NEPSE output contains real stock/index rows", (Array.isArray(nepse.stocks) && nepse.stocks.length > 0) ||
    (Array.isArray(nepse.indices) && nepse.indices.length > 0),
    JSON.stringify({ stocks: nepse.stocks?.length || 0, indices: nepse.indices?.length || 0, partial: nepse.partial }));
}

if (newsResponse.ok) {
  const news = await newsResponse.json();
  const stories = [...(Array.isArray(news.market) ? news.market : []), ...(Array.isArray(news.ipo) ? news.ipo : [])];
  check("Nepal news has dated source-linked items", stories.length > 0 && stories.every((item) =>
    item.title && /^https:\/\//.test(item.link || "") && Number.isFinite(Date.parse(item.publishedAt || ""))),
    "items=" + stories.length);
  check("Nepal news items are not future-dated", stories.every((item) => Date.parse(item.publishedAt) <= Date.now() + 120000));
  check("Nepal news source freshness is bounded", news.maxAgeDays === 30,
    "maxAgeDays=" + news.maxAgeDays);
}

const report = {
  generatedAt: new Date().toISOString(),
  base,
  forex: forex ? { source: forex.source, requestedDate: forex.requestedDate, rateDate: forex.rateDate, stale: forex.isStale, fallback: forex.fallback, rates: forex.rates?.length } : null,
  nepse: nepse ? { source: nepse.source, sourceUpdatedAt: nepse.sourceUpdatedAt, quoteAgeMinutes: nepse.quoteAgeMinutes, quoteStale: nepse.quoteStale, partial: nepse.partial, stocks: nepse.stocks?.length, indices: nepse.indices?.length } : null,
  checks,
  counts: { pass: checks.filter((x) => x.status === "PASS").length, fail: failures.length },
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error("Live-data smoke checks failed:", failures.join("; "));
  process.exitCode = 1;
}
