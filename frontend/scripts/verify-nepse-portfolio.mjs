import assert from "node:assert/strict";
import { calculatePortfolio, isTrade } from "../lib/nepse-portfolio-math.ts";

const trade = (id, date, side, quantity, price, fee = 0) => ({
  id, createdAt: Number(id), date, symbol: "NABIL", side, quantity, price, fee,
});
const history = [
  trade("1", "2026-01-01", "buy", 10, 100, 10),
  trade("2", "2026-01-02", "buy", 10, 120, 10),
  trade("3", "2026-01-03", "sell", 5, 130, 5),
];
const partial = calculatePortfolio(history);
assert.equal(partial.holdings[0].quantity, 15);
assert.equal(partial.holdings[0].averageCost, 111);
assert.equal(partial.holdings[0].invested, 1665);
assert.equal(partial.realized, 90);
assert.throws(() => calculatePortfolio([...history, trade("4", "2026-01-04", "sell", 16, 115)]), /exceeds recorded holdings/);

const closed = calculatePortfolio([...history, trade("4", "2026-01-04", "sell", 15, 115, 5)]);
assert.equal(closed.holdings.length, 0);
assert.equal(closed.realized, 145);
assert.equal(isTrade(trade("5", "2026-02-28", "buy", 1, 10)), true);
assert.equal(isTrade(trade("6", "2026-02-31", "buy", 1, 10)), false);
assert.equal(isTrade(trade("7", "2026-02-28", "buy", 0, 10)), false);
assert.throws(() => calculatePortfolio([trade("8", "2026-02-28", "buy", Number.MAX_VALUE, Number.MAX_VALUE)]), /supported calculation range/);
console.log("Verified NEPSE portfolio cost basis, fees, realized P/L, oversell protection, and transaction validation.");

