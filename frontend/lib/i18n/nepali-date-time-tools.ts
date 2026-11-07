export type NepaliDateTimeSlug = "age-calculator" | "date-difference-calculator" | "time-duration-calculator";
type Values = Record<string, string>;

const parseDate = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
};
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86_400_000);
const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export function runNepaliDateTimeTool(slug: NepaliDateTimeSlug, values: Values): string {
  if (slug === "age-calculator") {
    const birth = parseDate(values.birth ?? "");
    const asOf = parseDate(values.asOf ?? "");
    if (!birth || !asOf) return "कृपया YYYY-MM-DD ढाँचामा मान्य जन्म मिति र गणना मिति प्रविष्ट गर्नुहोस्।";
    if (birth > asOf) return "जन्म मिति गणना मितिभन्दा पछाडि हुन मिल्दैन।";
    let years = asOf.getUTCFullYear() - birth.getUTCFullYear();
    let months = asOf.getUTCMonth() - birth.getUTCMonth();
    let days = asOf.getUTCDate() - birth.getUTCDate();
    if (days < 0) {
      months -= 1;
      const previousMonthLastDay = new Date(Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), 0)).getUTCDate();
      days += previousMonthLastDay;
    }
    if (months < 0) { years -= 1; months += 12; }
    const totalDays = daysBetween(birth, asOf);
    return `उमेर: ${years} वर्ष, ${months} महिना, ${days} दिन\nकुल दिन: ${totalDays.toLocaleString("en-US")}\nजन्म मिति: ${formatDate(birth)}\nगणना मिति: ${formatDate(asOf)}`;
  }
  if (slug === "date-difference-calculator") {
    const start = parseDate(values.start ?? "");
    const end = parseDate(values.end ?? "");
    if (!start || !end) return "कृपया YYYY-MM-DD ढाँचामा दुवै मान्य मिति प्रविष्ट गर्नुहोस्।";
    const difference = Math.abs(daysBetween(start, end));
    const earlier = start <= end ? start : end;
    const later = start <= end ? end : start;
    return `मिति अन्तर: ${difference.toLocaleString("en-US")} दिन\nहप्ता: ${(difference / 7).toFixed(2)}\nमहिना (औसत): ${(difference / 30.436875).toFixed(2)}\nसुरु: ${formatDate(earlier)}\nअन्त्य: ${formatDate(later)}\nनोट: सुरु र अन्त्य दुवै दिन समावेश गर्दा कुल दिनमा १ थपिन्छ।`;
  }
  if (slug === "time-duration-calculator") {
    const start = values.start ?? "";
    const end = values.end ?? "";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(end)) return "कृपया २४-घण्टे HH:MM ढाँचामा समय प्रविष्ट गर्नुहोस्।";
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;
    const overnight = endMinutes < startMinutes;
    if (overnight) endMinutes += 1440;
    const duration = endMinutes - startMinutes;
    return `समय अन्तर: ${Math.floor(duration / 60)} घण्टा ${duration % 60} मिनेट\nकुल मिनेट: ${duration}\nअवधि: ${(duration / 60).toFixed(2)} घण्टा\n${overnight ? "अन्त्य समय अर्को दिन परेको मानिएको छ।" : "दुवै समय एउटै दिनका हुन्।"}`;
  }
  return "";
}
