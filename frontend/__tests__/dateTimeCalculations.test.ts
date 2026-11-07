import { addCalendarDays, calculateAge, dateDifferenceDays, timeDurationMinutes } from "../lib/date-time-calculations";

describe("date and time utility calculations", () => {
  test("age calculation handles month ends and leap-day birthdays", () => {
    expect(calculateAge("2000-01-31", "2000-03-01")).toEqual({ years: 0, months: 1, days: 1 });
    expect(calculateAge("2000-02-29", "2001-02-28")).toEqual({ years: 1, months: 0, days: 0 });
    expect(() => calculateAge("2026-11-08", "2026-11-07")).toThrow("after the calculation date");
  });

  test("calendar dates are strictly validated and date differences are timezone-independent", () => {
    expect(dateDifferenceDays("2026-11-02", "2026-11-07")).toBe(5);
    expect(dateDifferenceDays("2026-11-07", "2026-11-02")).toBe(5);
    expect(() => dateDifferenceDays("2026-02-30", "2026-03-02")).toThrow("valid calendar date");
    expect(() => dateDifferenceDays("11/02/2026", "2026-11-07")).toThrow("YYYY-MM-DD");
  });

  test("date addition validates dates and handles leap years without timezone drift", () => {
    expect(addCalendarDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addCalendarDays("2024-03-01", -1)).toBe("2024-02-29");
    expect(() => addCalendarDays("2026-02-30", 1)).toThrow("valid calendar date");
    expect(() => addCalendarDays("2026-11-07", 1.5)).toThrow("whole number");
  });

  test("time duration validates 24-hour input and supports overnight periods", () => {
    expect(timeDurationMinutes("09:00", "17:30")).toBe(510);
    expect(timeDurationMinutes("22:30", "01:15")).toBe(165);
    expect(timeDurationMinutes("09:00", "09:00")).toBe(0);
    expect(() => timeDurationMinutes("25:00", "26:00")).toThrow("HH:MM");
    expect(() => timeDurationMinutes("9:00", "17:00")).toThrow("HH:MM");
  });
});
