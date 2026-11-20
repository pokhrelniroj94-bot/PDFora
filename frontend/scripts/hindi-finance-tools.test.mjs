import assert from "node:assert/strict";
import fs from "node:fs";
import { hindiSipFutureValue, hindiSavingsGoalDeposit } from "../lib/i18n/hindi-finance-math.ts";
import { sipFutureValue, loanEmi, discountedPrice } from "../lib/catalog-calculations.ts";

const close = (a, b, msg) => assert.ok(Math.abs(a - b) <= Math.max(1e-6, Math.abs(b) * 1e-9), `${msg}: ${a} vs ${b}`);

// Hindi SIP (month-by-month loop) must equal the shared closed-form English implementation.
for (const [m, y, r, i] of [[5000, 10, 10, 0], [5000, 10, 10, 100000], [0, 5, 7.5, 250000], [12000, 25, 0, 0], [1, 1, 100, 0], [2500, 30, 12.25, 5000]]) {
  close(hindiSipFutureValue(m, y, r, i), sipFutureValue(m, y, r, i), `SIP ${m}/${y}/${r}/${i}`);
}
// Known value: 5,000/month, 10 years, 10% p.a., month-end deposits.
// 5000 * ((1 + 0.1/12)^120 - 1) / (0.1/12) = 5000 * 204.845 = 1,024,224.89
assert.ok(Math.abs(hindiSipFutureValue(5000, 10, 10, 0) - 1024224.89) < 0.01, "SIP known value");
close(hindiSipFutureValue(1000, 1, 0, 0), 12000, "SIP zero-rate");

// Savings goal: same formula as the Nepali tool, (goal-saved) * r / ((1+r)^n - 1).
for (const [goal, saved, n, rate] of [[500000, 50000, 24, 5], [1000000, 0, 60, 8.5], [200000, 199999, 3, 12]]) {
  const r = rate / 1200;
  const nepali = (goal - saved) * (r / (Math.pow(1 + r, n) - 1));
  close(hindiSavingsGoalDeposit(goal, saved, n, rate).deposit, nepali, `savings ${goal}/${saved}/${n}/${rate}`);
}
close(hindiSavingsGoalDeposit(120000, 0, 12, 0).deposit, 10000, "savings zero-rate");
assert.deepEqual(hindiSavingsGoalDeposit(1000, 5000, 12, 5), { remaining: 0, deposit: 0 }, "goal already reached");
// Depositing the computed amount monthly must actually reach the goal.
{
  const { deposit, remaining } = hindiSavingsGoalDeposit(500000, 50000, 24, 5);
  close(sipFutureValue(deposit, 2, 5, 0), remaining, "deposit reaches remaining goal");
}

// EMI and discount come from the shared functions the English tools use.
assert.ok(Math.abs(loanEmi(1000000, 10, 60) - 21247.04) < 0.01, "EMI known value");
assert.equal(discountedPrice(1000, 20).final, 800);
assert.equal(discountedPrice(1000, 20).saved, 200);

// Component still uses the extracted math and shared EMI, with NPR and every input editable.
const ui = fs.readFileSync(new URL("../components/HindiFinanceCalculatorWorkspace.tsx", import.meta.url), "utf8");
assert.match(ui, /hindiSipFutureValue\(/);
assert.match(ui, /hindiSavingsGoalDeposit\(/);
assert.match(ui, /loanEmi\(/);
assert.doesNotMatch(ui, /₹/);
console.log("Hindi finance calculator tests passed.");
