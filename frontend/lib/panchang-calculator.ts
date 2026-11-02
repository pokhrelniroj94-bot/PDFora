import * as Astronomy from "astronomy-engine";

export const NEPAL_LOCATIONS = [
  { id: "kathmandu", name: "Kathmandu", latitude: 27.7172, longitude: 85.3240, elevation: 1400 },
  { id: "ilam", name: "Ilam", latitude: 26.9094, longitude: 87.9282, elevation: 1200 },
  { id: "biratnagar", name: "Biratnagar", latitude: 26.4525, longitude: 87.2718, elevation: 80 },
  { id: "pokhara", name: "Pokhara", latitude: 28.2096, longitude: 83.9856, elevation: 822 },
  { id: "janakpur", name: "Janakpur", latitude: 26.7288, longitude: 85.9263, elevation: 74 },
  { id: "nepalgunj", name: "Nepalgunj", latitude: 28.0500, longitude: 81.6167, elevation: 150 },
  { id: "dhangadhi", name: "Dhangadhi", latitude: 28.6950, longitude: 80.5930, elevation: 109 },
  { id: "birgunj", name: "Birgunj", latitude: 27.0104, longitude: 84.8774, elevation: 92 },
  { id: "dharan", name: "Dharan", latitude: 26.8125, longitude: 87.2833, elevation: 349 },
  { id: "butwal", name: "Butwal", latitude: 27.7006, longitude: 83.4484, elevation: 150 },
  { id: "bharatpur", name: "Bharatpur", latitude: 27.6833, longitude: 84.4333, elevation: 208 },
] as const;

const NAKSHATRAS = [
  ["Ashwini", "अश्विनी"], ["Bharani", "भरणी"], ["Krittika", "कृत्तिका"],
  ["Rohini", "रोहिणी"], ["Mrigashira", "मृगशिरा"], ["Ardra", "आर्द्रा"],
  ["Punarvasu", "पुनर्वसु"], ["Pushya", "पुष्य"], ["Ashlesha", "आश्लेषा"],
  ["Magha", "मघा"], ["Purva Phalguni", "पूर्वाफाल्गुनी"], ["Uttara Phalguni", "उत्तराफाल्गुनी"],
  ["Hasta", "हस्त"], ["Chitra", "चित्रा"], ["Swati", "स्वाती"],
  ["Vishakha", "विशाखा"], ["Anuradha", "अनुराधा"], ["Jyeshtha", "ज्येष्ठा"],
  ["Mula", "मूल"], ["Purva Ashadha", "पूर्वाषाढा"], ["Uttara Ashadha", "उत्तराषाढा"],
  ["Shravana", "श्रवण"], ["Dhanishta", "धनिष्ठा"], ["Shatabhisha", "शतभिषा"],
  ["Purva Bhadrapada", "पूर्वाभाद्रपदा"], ["Uttara Bhadrapada", "उत्तराभाद्रपदा"], ["Revati", "रेवती"],
] as const;

const YOGAS = [
  ["Vishkambha", "विष्कम्भ"], ["Priti", "प्रीति"], ["Ayushman", "आयुष्मान"],
  ["Saubhagya", "सौभाग्य"], ["Shobhana", "शोभन"], ["Atiganda", "अतिगण्ड"],
  ["Sukarma", "सुकर्मा"], ["Dhriti", "धृति"], ["Shula", "शूल"],
  ["Ganda", "गण्ड"], ["Vriddhi", "वृद्धि"], ["Dhruva", "ध्रुव"],
  ["Vyaghata", "व्याघात"], ["Harshana", "हर्षण"], ["Vajra", "वज्र"],
  ["Siddhi", "सिद्धि"], ["Vyatipata", "व्यतीपात"], ["Variyana", "वरीयान्"],
  ["Parigha", "परिघ"], ["Shiva", "शिव"], ["Siddha", "सिद्ध"],
  ["Sadhya", "साध्य"], ["Shubha", "शुभ"], ["Shukla", "शुक्ल"],
  ["Brahma", "ब्रह्म"], ["Indra", "इन्द्र"], ["Vaidhriti", "वैधृति"],
] as const;

const TITHIS = [
  ["Pratipada", "प्रतिपदा"], ["Dvitiya", "द्वितीया"], ["Tritiya", "तृतीया"],
  ["Chaturthi", "चतुर्थी"], ["Panchami", "पञ्चमी"], ["Shashthi", "षष्ठी"],
  ["Saptami", "सप्तमी"], ["Ashtami", "अष्टमी"], ["Navami", "नवमी"],
  ["Dashami", "दशमी"], ["Ekadashi", "एकादशी"], ["Dwadashi", "द्वादशी"],
  ["Trayodashi", "त्रयोदशी"], ["Chaturdashi", "चतुर्दशी"],
] as const;

const MOVABLE_KARANAS = [
  ["Bava", "बव"], ["Balava", "बालव"], ["Kaulava", "कौलव"],
  ["Taitila", "तैतिल"], ["Garaja", "गर"], ["Vanija", "वणिज"], ["Vishti", "विष्टि"],
] as const;
const FIXED_KARANAS = [
  ["Kimstughna", "किंस्तुघ्न"], ["Shakuni", "शकुनि"], ["Chatushpada", "चतुष्पद"], ["Naga", "नाग"],
] as const;

const WEEKDAYS = [
  ["Sunday", "आइतबार"], ["Monday", "सोमबार"], ["Tuesday", "मङ्गलबार"],
  ["Wednesday", "बुधबार"], ["Thursday", "बिहीबार"], ["Friday", "शुक्रबार"], ["Saturday", "शनिबार"],
] as const;

type AngaKey = "tithi" | "nakshatra" | "yoga" | "karana";
type AngaIndices = Record<AngaKey, number>;

export interface PanchangInput {
  date: string;
  locationName: string;
  latitude: number;
  longitude: number;
  elevation?: number;
}

export interface PanchangResult {
  date: string;
  locationName: string;
  weekday: string;
  weekdayNp: string;
  sunrise: string;
  sunset: string;
  tithi: { name: string; nameNp: string; paksha: "Shukla" | "Krishna"; endsAt: string | null };
  nakshatra: { name: string; nameNp: string; pada: number; endsAt: string | null };
  yoga: { name: string; nameNp: string; endsAt: string | null };
  karana: { name: string; nameNp: string; endsAt: string | null };
  rahuKaal: string;
  yamaganda: string;
  gulika: string;
  ayanamsaDegrees: number;
  calculation: string;
}

const normalize = (angle: number) => ((angle % 360) + 360) % 360;
const NAKSHATRA_SPAN = 360 / 27;

function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/**
 * Lahiri/Chitrapaksha ayanamsa polynomial used by the displayed sidereal
 * Panchang convention. The chosen convention is explicit; other traditions
 * may differ slightly near a boundary.
 */
function lahiriAyanamsa(date: Date): number {
  const centuries = (julianDay(date) - 2451545) / 36525;
  return 23.85709 + 1.3969713 * centuries + 0.0003086 * centuries * centuries;
}

function indicesAt(date: Date): AngaIndices {
  const sun = Astronomy.SunPosition(date).elon;
  const moon = Astronomy.EclipticGeoMoon(date).lon;
  const elongation = normalize(moon - sun);
  const ayanamsa = lahiriAyanamsa(date);
  const siderealMoon = normalize(moon - ayanamsa);
  const siderealYoga = normalize(sun + moon - 2 * ayanamsa);

  return {
    tithi: Math.floor(elongation / 12),
    nakshatra: Math.floor(siderealMoon / NAKSHATRA_SPAN),
    yoga: Math.floor(siderealYoga / NAKSHATRA_SPAN),
    karana: Math.floor(elongation / 6),
  };
}

function findAngaEnds(sunrise: Date): Record<AngaKey, Date | null> {
  const initial = indicesAt(sunrise);
  const ends: Record<AngaKey, Date | null> = {
    tithi: null, nakshatra: null, yoga: null, karana: null,
  };
  const keys: AngaKey[] = ["tithi", "nakshatra", "yoga", "karana"];
  let previous = sunrise.getTime();
  const step = 10 * 60 * 1000;
  const max = 36 * 60 * 60 * 1000;

  for (let elapsed = step; elapsed <= max && keys.some((key) => ends[key] === null); elapsed += step) {
    const current = sunrise.getTime() + elapsed;
    const sample = indicesAt(new Date(current));

    for (const key of keys) {
      if (ends[key] !== null || sample[key] === initial[key]) continue;
      let low = previous;
      let high = current;
      for (let iteration = 0; iteration < 38; iteration++) {
        const middle = Math.floor((low + high) / 2);
        if (indicesAt(new Date(middle))[key] === initial[key]) low = middle;
        else high = middle;
      }
      ends[key] = new Date(high);
    }
    previous = current;
  }
  return ends;
}

function localTime(date: Date | null): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-NP", {
    timeZone: "Asia/Kathmandu",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function daylightPeriod(sunrise: Date, sunset: Date, segment: number): string {
  const duration = sunset.getTime() - sunrise.getTime();
  const start = new Date(sunrise.getTime() + duration * (segment - 1) / 8);
  const end = new Date(sunrise.getTime() + duration * segment / 8);
  return `${localTime(start)} – ${localTime(end)}`;
}

function localISODate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function dateIsValid(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const localMidnight = new Date(`${date}T00:00:00+05:45`);
  if (Number.isNaN(localMidnight.getTime())) return false;
  return localISODate(localMidnight) === date;
}

export function calculateNepalPanchang(input: PanchangInput): PanchangResult {
  if (!dateIsValid(input.date)) throw new Error("Enter a valid Gregorian date in YYYY-MM-DD format.");
  const dateYear = Number(input.date.slice(0, 4));
  if (dateYear < 1900 || dateYear > 2100) throw new Error("The astronomical calculator supports dates from 1900 through 2100.");
  if (!Number.isFinite(input.latitude) || input.latitude < 26 || input.latitude > 31) throw new Error("Latitude must be within Nepal (26°N–31°N).");
  if (!Number.isFinite(input.longitude) || input.longitude < 80 || input.longitude > 89) throw new Error("Longitude must be within Nepal (80°E–89°E).");
  const elevation = input.elevation ?? 0;
  if (!Number.isFinite(elevation) || elevation < -500 || elevation > 9000) throw new Error("Enter a valid elevation in metres.");

  // Nepal uses UTC+05:45 year-round. SearchRiseSet returns UTC instants.
  const localMidnightUtc = new Date(`${input.date}T00:00:00+05:45`);
  const observer = new Astronomy.Observer(input.latitude, input.longitude, elevation);
  const sunriseEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, localMidnightUtc, 1, 0);
  if (!sunriseEvent) throw new Error("Sunrise could not be calculated for this location and date.");
  const sunsetEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseEvent, 1, 0);
  if (!sunsetEvent) throw new Error("Sunset could not be calculated for this location and date.");

  const sunrise = sunriseEvent.date;
  const sunset = sunsetEvent.date;
  const localSunriseDate = localISODate(sunrise);
  const localSunsetDate = localISODate(sunset);
  if (localSunriseDate !== input.date || localSunsetDate !== input.date || sunset <= sunrise) {
    throw new Error("Sunrise or sunset did not fall on the selected Nepal civil date. Please verify the location.");
  }

  const indices = indicesAt(sunrise);
  const elongation = normalize(Astronomy.EclipticGeoMoon(sunrise).lon - Astronomy.SunPosition(sunrise).elon);
  const siderealMoon = normalize(Astronomy.EclipticGeoMoon(sunrise).lon - lahiriAyanamsa(sunrise));
  const nakshatraPada = Math.floor((siderealMoon % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1;
  const ends = findAngaEnds(sunrise);
  const tithiOrdinal = indices.tithi % 15;
  const tithi = indices.tithi === 14
    ? ["Purnima", "पूर्णिमा"]
    : indices.tithi === 29
      ? ["Amavasya", "अमावस्या"]
      : TITHIS[tithiOrdinal];
  const paksha = indices.tithi < 15 ? "Shukla" : "Krishna";
  const karana = indices.karana === 0
    ? FIXED_KARANAS[0]
    : indices.karana <= 56
      ? MOVABLE_KARANAS[(indices.karana - 1) % 7]
      : FIXED_KARANAS[indices.karana - 56];
  const weekdayIndex = new Date(`${input.date}T00:00:00Z`).getUTCDay();
  const [weekday, weekdayNp] = WEEKDAYS[weekdayIndex];
  const rahuSegments = [8, 2, 7, 5, 6, 4, 3];
  const yamaSegments = [5, 4, 3, 2, 1, 7, 6];
  const gulikaSegments = [7, 6, 5, 4, 3, 2, 1];
  const ayanamsaDegrees = lahiriAyanamsa(sunrise);

  return {
    date: input.date,
    locationName: input.locationName,
    weekday,
    weekdayNp,
    sunrise: localTime(sunrise) ?? "Unavailable",
    sunset: localTime(sunset) ?? "Unavailable",
    tithi: {
      name: tithi[0], nameNp: tithi[1], paksha,
      endsAt: localTime(ends.tithi),
    },
    nakshatra: {
      name: NAKSHATRAS[indices.nakshatra][0],
      nameNp: NAKSHATRAS[indices.nakshatra][1],
      pada: nakshatraPada,
      endsAt: localTime(ends.nakshatra),
    },
    yoga: {
      name: YOGAS[indices.yoga][0],
      nameNp: YOGAS[indices.yoga][1],
      endsAt: localTime(ends.yoga),
    },
    karana: {
      name: karana[0], nameNp: karana[1],
      endsAt: localTime(ends.karana),
    },
    rahuKaal: daylightPeriod(sunrise, sunset, rahuSegments[weekdayIndex]),
    yamaganda: daylightPeriod(sunrise, sunset, yamaSegments[weekdayIndex]),
    gulika: daylightPeriod(sunrise, sunset, gulikaSegments[weekdayIndex]),
    ayanamsaDegrees,
    calculation: "Astronomy Engine 2.1.19 · geocentric true ecliptic longitudes · Lahiri/Chitrapaksha ayanamsa · Panchang limbs anchored to local sunrise · Nepal civil time UTC+05:45.",
  };
}
