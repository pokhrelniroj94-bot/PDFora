export const MAX_NEPSE_HISTORY_AGE_DAYS = 3;

function nepalCalendarDate(now) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function guardNepseSignalFreshness(signal, latestDate, now = new Date()) {
  const today = nepalCalendarDate(now);
  const latestTimestamp = typeof latestDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(latestDate)
    ? Date.parse(`${latestDate}T00:00:00.000Z`)
    : Number.NaN;
  const validDate = Number.isFinite(latestTimestamp) && new Date(latestTimestamp).toISOString().slice(0, 10) === latestDate;

  if (!validDate) {
    return {
      signal: "Wait / neutral",
      stale: true,
      reason: "The latest NEPSE history date is missing or invalid, so a directional setup is withheld.",
    };
  }

  const ageDays = (Date.parse(`${today}T00:00:00.000Z`) - latestTimestamp) / 86_400_000;
  if (ageDays < 0) {
    return {
      signal: "Wait / neutral",
      stale: true,
      reason: `The latest NEPSE history date (${latestDate}) is in the future; a directional setup is withheld.`,
    };
  }
  if (ageDays <= MAX_NEPSE_HISTORY_AGE_DAYS) return { signal, stale: false };

  return {
    signal: "Wait / neutral",
    stale: true,
    reason: `The latest NEPSE history is ${ageDays} calendar days old (${latestDate}); refresh the data before considering a directional setup.`,
  };
}

