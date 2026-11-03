import assert from "node:assert/strict";
import { guardNepseSignalFreshness } from "../lib/nepse-signal-freshness.mjs";

const now = new Date("2026-11-03T12:00:00.000Z");
assert.equal(guardNepseSignalFreshness("Potential BUY setup", "2026-11-01", now).signal, "Potential BUY setup");
assert.equal(guardNepseSignalFreshness("Potential SELL / EXIT setup", "2026-11-01", now).stale, false);

for (const signal of ["Potential BUY setup", "Potential SELL / EXIT setup", "Potential SELL / SHORT setup"]) {
  const result = guardNepseSignalFreshness(signal, "2026-10-30", now);
  assert.equal(result.signal, "Wait / neutral", `${signal} must be suppressed when history is stale`);
  assert.equal(result.stale, true);
  assert.match(result.reason || "", /4 calendar days old/);
}

assert.equal(guardNepseSignalFreshness("Potential BUY setup", undefined, now).signal, "Wait / neutral");
assert.equal(guardNepseSignalFreshness("Potential BUY setup", "2026-11-04", now).stale, true);
console.log("Verified fresh-history signal retention and suppression for stale, missing, invalid and future NEPSE history dates.");

