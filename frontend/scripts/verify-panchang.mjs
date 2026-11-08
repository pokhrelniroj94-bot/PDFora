import assert from "node:assert/strict";
import * as Astronomy from "astronomy-engine";

// Regression fixture: Kathmandu, 2 November 2026 (Asia/Kathmandu).
// Reference values are cross-checked against DrikPanchang Kathmandu day data:
// https://www.drikpanchang.com/panchang/month-panchang.html?geoname-id=1283240
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
assert.equal(tithiIndex, 22, "Kathmandu 2026-11-02 sunrise reference is Krishna Ashtami.");
assert.equal(nakshatraIndex, 8, "Kathmandu 2026-11-02 sunrise reference is Ashlesha nakshatra.");
assert.equal(yogaIndex, 22, "Kathmandu 2026-11-02 sunrise reference is Shubha yoga.");
assert.equal(karanaIndex, 45, "Kathmandu 2026-11-02 sunrise reference is Kaulava karana.");
const movableKaranas = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti"];
const karanaName = karanaIndex === 0 ? "Kimstughna" : karanaIndex <= 56 ? movableKaranas[(karanaIndex - 1) % 7] : ["Shakuni", "Chatushpada", "Naga"][karanaIndex - 57];
assert.equal(karanaName, "Kaulava", "Karana sequence must begin with Kimstughna, then cycle through the seven movable karanas.");
const localClock = (instant) => new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kathmandu", hour: "2-digit", minute: "2-digit", hour12: false,
}).format(instant);
assert.ok(localClock(sunrise.date) >= "06:00" && localClock(sunrise.date) <= "06:30", "Kathmandu sunrise should be close to the published 06:15 reference.");
assert.ok(localClock(sunset.date) >= "17:00" && localClock(sunset.date) <= "17:30", "Kathmandu sunset should be close to the published 17:19 reference.");
const daylight = sunset.date.getTime() - sunrise.date.getTime();
const rahuStart = new Date(sunrise.date.getTime() + daylight / 8);
const rahuEnd = new Date(sunrise.date.getTime() + daylight * 2 / 8);
assert.ok(localClock(rahuStart) >= "07:30" && localClock(rahuStart) <= "07:45", "Monday Rahu Kaal should begin close to 07:38.");
assert.ok(localClock(rahuEnd) >= "08:55" && localClock(rahuEnd) <= "09:10", "Monday Rahu Kaal should end close to 09:01.");
const angaIndexAt = (instant, key) => {
  const sun = Astronomy.SunPosition(instant).elon;
  const moon = Astronomy.EclipticGeoMoon(instant).lon;
  const elongationNow = normalize(moon - sun);
  const jdNow = instant.getTime() / 86400000 + 2440587.5;
  const tNow = (jdNow - 2451545) / 36525;
  const aya = 23.85709 + 1.3969713 * tNow + 0.0003086 * tNow * tNow;
  if (key === "tithi") return Math.floor(elongationNow / 12);
  if (key === "karana") return Math.floor(elongationNow / 6);
  if (key === "nakshatra") return Math.floor(normalize(moon - aya) / (360 / 27));
  return Math.floor(normalize(sun + moon - 2 * aya) / (360 / 27));
};
const nextBoundary = (key) => {
  const initial = angaIndexAt(sunrise.date, key);
  let previous = sunrise.date.getTime();
  for (let elapsed = 10 * 60 * 1000; elapsed <= 36 * 60 * 60 * 1000; elapsed += 10 * 60 * 1000) {
    const current = sunrise.date.getTime() + elapsed;
    if (angaIndexAt(new Date(current), key) !== initial) {
      let low = previous, high = current;
      for (let i = 0; i < 38; i++) {
        const middle = Math.floor((low + high) / 2);
        if (angaIndexAt(new Date(middle), key) === initial) low = middle;
        else high = middle;
      }
      return new Date(high);
    }
    previous = current;
  }
  throw new Error(`Could not find ${key} transition within 36 hours.`);
};
const tithiEnd = nextBoundary("tithi");
const nakshatraEnd = nextBoundary("nakshatra");
const yogaEnd = nextBoundary("yoga");
const karanaEnd = nextBoundary("karana");
assert.ok(localClock(tithiEnd) >= "13:15" && localClock(tithiEnd) <= "13:35", "Tithi should end close to the published 13:25 time.");
assert.ok(localDate(nakshatraEnd) === "2026-11-03" && localClock(nakshatraEnd) >= "03:50" && localClock(nakshatraEnd) <= "04:10", "Ashlesha should end close to 04:01 on the next day.");
assert.ok(localClock(yogaEnd) >= "12:10" && localClock(yogaEnd) <= "12:35", "Yoga should end close to the published 12:22 time.");
assert.ok(localClock(karanaEnd) >= "13:15" && localClock(karanaEnd) <= "13:35", "Karana should end close to the published 13:25 time.");

console.log(`Panchang astronomy smoke test passed for Kathmandu ${date}: sunrise ${sunrise.date.toISOString()}, sunset ${sunset.date.toISOString()}, tithi ${tithiIndex + 1}/30, nakshatra ${nakshatraIndex + 1}/27.`);

const indiaObserver = new Astronomy.Observer(28.6139, 77.2090, 216);
const indiaMidnight = new Date(`${date}T00:00:00+05:30`);
const indiaSunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, indiaObserver, +1, indiaMidnight, 1, 0);
const indiaSunset = indiaSunrise && Astronomy.SearchRiseSet(Astronomy.Body.Sun, indiaObserver, -1, indiaSunrise, 1, 0);
assert.ok(indiaSunrise && indiaSunset, "Sunrise and sunset should be calculable for Delhi.");
const indiaLocalDate = (instant) => {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(instant);
  const part = (type) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};
assert.equal(indiaLocalDate(indiaSunrise.date), date, "Delhi sunrise must fall on the selected India civil date.");
assert.equal(indiaLocalDate(indiaSunset.date), date, "Delhi sunset must fall on the selected India civil date.");
const indiaClock = (instant) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(instant);
assert.ok(indiaClock(indiaSunrise.date) >= "05:30" && indiaClock(indiaSunrise.date) <= "07:30", "Delhi sunrise should be displayed in India local time.");
assert.ok(indiaClock(indiaSunset.date) >= "16:30" && indiaClock(indiaSunset.date) <= "19:00", "Delhi sunset should be displayed in India local time.");
console.log(`India Panchang timezone smoke test passed for Delhi ${date}: sunrise ${indiaClock(indiaSunrise.date)}, sunset ${indiaClock(indiaSunset.date)} IST.`);
