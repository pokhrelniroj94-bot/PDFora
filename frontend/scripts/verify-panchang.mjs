import assert from "node:assert/strict";
import * as Astronomy from "astronomy-engine";

// Regression fixture: Kathmandu, 2 November 2026 (Asia/Kathmandu).
// The fixture validates the ephemeris API, local-day boundaries and the
// mathematical domains used by the Panchang engine; it is not a religious
// calendar certification.
const date = "2026-11-02";
const observer = new Astronomy.Observer(27.7172, 85.3240, 1400);
const localMidnight = new Date(`${date}T00:00:00+05:45`);
const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, localMidnight, 1, 0);
assert.ok(sunrise, "Sunrise should be calculable for Kathmandu.");
const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunrise, 1, 0);
assert.ok(sunset, "Sunset should be calculable for Kathmandu.");
const localDate = (instant) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(instant);
  const part = (type) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};
assert.equal(localDate(sunrise.date), date, "Sunrise must fall on the requested Nepal civil date.");
assert.equal(localDate(sunset.date), date, "Sunset must fall on the requested Nepal civil date.");
assert.ok(sunset.date > sunrise.date, "Sunset must follow sunrise.");

const sunLongitude = Astronomy.SunPosition(sunrise.date).elon;
const moonLongitude = Astronomy.EclipticGeoMoon(sunrise.date).lon;
const normalize = (angle) => ((angle % 360) + 360) % 360;
const elongation = normalize(moonLongitude - sunLongitude);
const tithiIndex = Math.floor(elongation / 12);
const karanaIndex = Math.floor(elongation / 6);
const jd = sunrise.date.getTime() / 86400000 + 2440587.5;
const centuries = (jd - 2451545) / 36525;
const ayanamsa = 23.85709 + 1.3969713 * centuries + 0.0003086 * centuries * centuries;
const nakshatraIndex = Math.floor(normalize(moonLongitude - ayanamsa) / (360 / 27));
const yogaIndex = Math.floor(normalize(sunLongitude + moonLongitude - 2 * ayanamsa) / (360 / 27));

assert.ok(tithiIndex >= 0 && tithiIndex < 30, "Tithi index must be in the 30-tithi cycle.");
assert.ok(karanaIndex >= 0 && karanaIndex < 60, "Karana index must be in the 60-karana cycle.");
assert.ok(nakshatraIndex >= 0 && nakshatraIndex < 27, "Nakshatra index must be in the 27-nakshatra cycle.");
assert.ok(yogaIndex >= 0 && yogaIndex < 27, "Yoga index must be in the 27-yoga cycle.");
assert.ok(ayanamsa > 20 && ayanamsa < 30, "Lahiri ayanamsa must remain within a plausible range.");

console.log(`Panchang astronomy smoke test passed for Kathmandu ${date}: sunrise ${sunrise.date.toISOString()}, sunset ${sunset.date.toISOString()}, tithi ${tithiIndex + 1}/30, nakshatra ${nakshatraIndex + 1}/27.`);
