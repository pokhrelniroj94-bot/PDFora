import {
  average, bmi, bmr, businessDaysInclusive, convertUnit, discountedPrice, fractionOperation,
  loanEmi, percentageChange, simplifyRatio, sipFutureValue,
} from "../lib/catalog-calculations";

describe("catalog calculation engine", () => {
  test("loan EMI handles reducing balance and zero interest", () => {
    expect(loanEmi(100000, 12, 12)).toBeCloseTo(8884.88, 2);
    expect(loanEmi(1200, 0, 12)).toBe(100);
  });

  test("SIP future value uses month-end contributions", () => {
    expect(sipFutureValue(1000, 1, 0, 0)).toBe(12000);
    expect(sipFutureValue(1000, 1, 12, 0)).toBeCloseTo(12682.50, 2);
  });

  test("discount and percentage calculations reject invalid denominators", () => {
    expect(discountedPrice(1000, 20)).toEqual({ final: 800, saved: 200 });
    expect(percentageChange(100, 125)).toBe(25);
    expect(() => percentageChange(0, 1)).toThrow("zero");
    expect(() => discountedPrice(100, 101)).toThrow("0–100");
  });

  test("statistics, ratios and fractions are independently correct", () => {
    expect(average([1, 2, 2, 4])).toEqual({ mean: 2.25, median: 2, mode: [2], range: 3 });
    expect(simplifyRatio(12, 18)).toBe("2:3");
    expect(fractionOperation(1, 2, 1, 3, "+")).toEqual({ numerator: 5, denominator: 6, value: 5 / 6 });
    expect(fractionOperation(1, -2, 0, 1, "+")).toEqual({ numerator: -1, denominator: 2, value: -0.5 });
    expect(fractionOperation(1, 2, 1, -3, "+")).toEqual({ numerator: -1, denominator: 6, value: -1 / 6 });
    expect(() => fractionOperation(Number.MAX_SAFE_INTEGER, 1, 1, 1, "+")).toThrow("safe integer range");
    expect(() => fractionOperation(1.5, 2, 1, 3, "+")).toThrow("safe whole-number");
    expect(() => fractionOperation(1, 2, 0, 3, "/")).toThrow("zero");
  });

  test("unit, health and calendar calculations handle boundaries", () => {
    expect(convertUnit(1, "km", "m")).toBe(1000);
    expect(convertUnit(32, "f", "c")).toBe(0);
    expect(bmi(65, 170)).toBeCloseTo(22.491, 3);
    expect(Math.round(bmr(65, 170, 25, false))).toBe(1593);
    expect(businessDaysInclusive("2026-11-02", "2026-11-06")).toBe(5);
    expect(businessDaysInclusive("2026-11-06", "2026-11-02")).toBe(5);
    expect(businessDaysInclusive("2026-11-07", "2026-11-08")).toBe(0);
    expect(() => businessDaysInclusive("2026-02-30", "2026-03-02")).toThrow("valid calendar");
    expect(() => businessDaysInclusive("11/02/2026", "2026-11-06")).toThrow("YYYY-MM-DD");
    expect(() => convertUnit(1, "m", "kg")).toThrow("compatible");
  });
});
