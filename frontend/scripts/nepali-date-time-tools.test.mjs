import assert from "node:assert/strict";
import { runNepaliDateTimeTool } from "../lib/i18n/nepali-date-time-tools.ts";

assert.match(runNepaliDateTimeTool("age-calculator", { birth: "2000-01-15", asOf: "2026-11-07" }), /उमेर: 26 वर्ष, 9 महिना, 23 दिन/);
assert.match(runNepaliDateTimeTool("age-calculator", { birth: "2026-11-08", asOf: "2026-11-07" }), /पछाडि हुन मिल्दैन/);
assert.match(runNepaliDateTimeTool("age-calculator", { birth: "2026-02-30", asOf: "2026-11-07" }), /मान्य जन्म मिति/);
assert.match(runNepaliDateTimeTool("date-difference-calculator", { start: "2026-01-01", end: "2026-01-08" }), /मिति अन्तर: 7 दिन/);
assert.match(runNepaliDateTimeTool("date-difference-calculator", { start: "2026-01-08", end: "2026-01-01" }), /मिति अन्तर: 7 दिन/);
assert.match(runNepaliDateTimeTool("date-difference-calculator", { start: "2026-02-30", end: "2026-03-01" }), /मान्य मिति/);
assert.match(runNepaliDateTimeTool("time-duration-calculator", { start: "09:30", end: "17:15" }), /7 घण्टा 45 मिनेट/);
assert.match(runNepaliDateTimeTool("time-duration-calculator", { start: "22:30", end: "01:15" }), /2 घण्टा 45 मिनेट/);
assert.match(runNepaliDateTimeTool("time-duration-calculator", { start: "25:00", end: "01:00" }), /२४-घण्टे/);
console.log("Nepali date/time functional tests passed (9 assertions).");
