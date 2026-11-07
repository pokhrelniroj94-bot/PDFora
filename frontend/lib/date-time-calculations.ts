type CalendarDate = { year: number; month: number; day: number };

function parseCalendarDate(value: string): CalendarDate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Enter dates in YYYY-MM-DD format.");
  }
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    throw new Error("Enter a valid calendar date.");
  }
  return { year, month, day };
}

function toUtcDate({ year, month, day }: CalendarDate): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function addMonthsClamped(date: CalendarDate, months: number): CalendarDate {
  const targetMonthIndex = date.year * 12 + date.month - 1 + months;
  const year = Math.floor(targetMonthIndex / 12);
  const month = targetMonthIndex % 12 + 1;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { year, month, day: Math.min(date.day, daysInMonth) };
}

export function dateDifferenceDays(start: string, end: string): number {
  const a = toUtcDate(parseCalendarDate(start));
  const b = toUtcDate(parseCalendarDate(end));
  return Math.abs((b.getTime() - a.getTime()) / 86_400_000);
}

export function calculateAge(birthDate: string, asOfDate: string): { years: number; months: number; days: number } {
  const birth = parseCalendarDate(birthDate);
  const asOf = parseCalendarDate(asOfDate);
  const start = toUtcDate(birth);
  const end = toUtcDate(asOf);
  if (end < start) throw new Error("Birth date cannot be after the calculation date.");

  let totalMonths = (asOf.year - birth.year) * 12 + asOf.month - birth.month;
  if (toUtcDate(addMonthsClamped(birth, totalMonths)) > end) totalMonths -= 1;
  const anniversary = toUtcDate(addMonthsClamped(birth, totalMonths));
  const days = (end.getTime() - anniversary.getTime()) / 86_400_000;
  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12, days };
}


export function addCalendarDays(dateValue: string, days: number): string {
  if (!Number.isInteger(days)) throw new Error("Enter a whole number of days.");
  const date = toUtcDate(parseCalendarDate(dateValue));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function timeDurationMinutes(start: string, end: string): number {
  const parseTime = (value: string): number => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
      throw new Error("Enter valid 24-hour times in HH:MM format.");
    }
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  const duration = endMinutes - startMinutes;
  return duration < 0 ? duration + 1440 : duration;
}
