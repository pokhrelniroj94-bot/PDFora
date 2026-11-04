#!/usr/bin/env python3
"""Independent reference calculations for utility tools.

Values are computed from first principles, not by importing PDFora code.
Compare these against live UI outputs during manual or browser automation QA.
"""
from __future__ import annotations

import math


def emi(principal: float, annual_rate: float, months: int) -> float:
    r = annual_rate / 12.0
    if r == 0:
        return principal / months
    return principal * r * (1 + r) ** months / ((1 + r) ** months - 1)


def simple_interest(p: float, rate: float, years: float) -> float:
    return p * rate * years


def bmi(kg: float, m: float) -> float:
    return kg / (m * m)


def pct_change(old: float, new: float) -> float:
    return (new - old) / old * 100.0


def nepal_vat_inclusive(exclusive: float, rate: float = 0.13) -> float:
    return exclusive * (1 + rate)


def compound_sip_fv(monthly: float, annual_rate: float, months: int) -> float:
    r = annual_rate / 12.0
    return monthly * (((1 + r) ** months - 1) / r) * (1 + r)


CASES = [
    ("emi_100k_10pct_12m", round(emi(100_000, 0.10, 12), 2), 8791.59),
    ("simple_interest_1k_5pct_2y", simple_interest(1000, 0.05, 2), 100.0),
    ("bmi_70_1.75", round(bmi(70, 1.75), 2), 22.86),
    ("pct_100_to_150", pct_change(100, 150), 50.0),
    ("vat_13_on_100", round(nepal_vat_inclusive(100), 2), 113.0),
    ("gcd_48_18", math.gcd(48, 18), 6),
    ("lcm_4_6", abs(4 * 6) // math.gcd(4, 6), 12),
    ("sip_1k_12pct_12m", round(compound_sip_fv(1000, 0.12, 12), 2), 12809.33),
]


def main() -> int:
    fails = 0
    for name, got, expected in CASES:
        ok = abs(got - expected) < 0.05 if isinstance(expected, float) else got == expected
        print(("PASS" if ok else "FAIL"), name, "got=", got, "expected=", expected)
        if not ok:
            fails += 1
    print(f"Utility reference suite: {len(CASES) - fails}/{len(CASES)} PASS")
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main())
