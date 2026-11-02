import * as Astronomy from "astronomy-engine";
import DateConverter from "./nepali-date-converter";

export const KUNDALI_PLACES = [
  { id: "kathmandu", name: "काठमाडौं", en: "Kathmandu", lat: 27.7172, lon: 85.3240 },
  { id: "ilam", name: "इलाम", en: "Ilam", lat: 26.9094, lon: 87.9282 },
  { id: "biratnagar", name: "विराटनगर", en: "Biratnagar", lat: 26.4525, lon: 87.2718 },
  { id: "pokhara", name: "पोखरा", en: "Pokhara", lat: 28.2096, lon: 83.9856 },
  { id: "janakpur", name: "जनकपुर", en: "Janakpur", lat: 26.7288, lon: 85.9263 },
  { id: "nepalgunj", name: "नेपालगञ्ज", en: "Nepalgunj", lat: 28.0500, lon: 81.6167 },
  { id: "dhangadhi", name: "धनगढी", en: "Dhangadhi", lat: 28.6950, lon: 80.5930 },
  { id: "birgunj", name: "वीरगञ्ज", en: "Birgunj", lat: 27.0104, lon: 84.8774 },
  { id: "dharan", name: "धरान", en: "Dharan", lat: 26.8125, lon: 87.2834 },
  { id: "butwal", name: "बुटवल", en: "Butwal", lat: 27.7006, lon: 83.4484 },
  { id: "bharatpur", name: "भरतपुर", en: "Bharatpur", lat: 27.6833, lon: 84.4333 },
] as const;

const SIGNS = ["मेष", "वृष", "मिथुन", "कर्कट", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"] as const;
const NAKSHATRAS = ["अश्विनी","भरणी","कृत्तिका","रोहिणी","मृगशिरा","आर्द्रा","पुनर्वसु","पुष्य","आश्लेषा","मघा","पूर्वाफाल्गुनी","उत्तराफाल्गुनी","हस्त","चित्रा","स्वाती","विशाखा","अनुराधा","ज्येष्ठा","मूल","पूर्वाषाढा","उत्तराषाढा","श्रवण","धनिष्ठा","शतभिषा","पूर्वाभाद्रपदा","उत्तराभाद्रपदा","रेवती"] as const;
const GRAHAS = [
  { key: "Sun", name: "सूर्य", short: "सू", body: Astronomy.Body.Sun },
  { key: "Moon", name: "चन्द्र", short: "च", body: Astronomy.Body.Moon },
  { key: "Mars", name: "मङ्गल", short: "मं", body: Astronomy.Body.Mars },
  { key: "Mercury", name: "बुध", short: "बु", body: Astronomy.Body.Mercury },
  { key: "Jupiter", name: "बृहस्पति", short: "गु", body: Astronomy.Body.Jupiter },
  { key: "Venus", name: "शुक्र", short: "शु", body: Astronomy.Body.Venus },
  { key: "Saturn", name: "शनि", short: "श", body: Astronomy.Body.Saturn },
] as const;
const DASHA = [
  { lord: "केतु", years: 7 }, { lord: "शुक्र", years: 20 }, { lord: "सूर्य", years: 6 },
  { lord: "चन्द्र", years: 10 }, { lord: "मङ्गल", years: 7 }, { lord: "राहु", years: 18 },
  { lord: "बृहस्पति", years: 16 }, { lord: "शनि", years: 19 }, { lord: "बुध", years: 17 },
] as const;
const NAKSHATRA_LORDS = ["केतु","शुक्र","सूर्य","चन्द्र","मङ्गल","राहु","बृहस्पति","शनि","बुध"] as const;
const DAY_MS = 86400000;
const norm = (angle: number) => ((angle % 360) + 360) % 360;
const rad = (deg: number) => deg * Math.PI / 180;
const deg = (r: number) => r * 180 / Math.PI;
const nepaliNumber = (value: number, digits = 2) => new Intl.NumberFormat("ne-NP", { maximumFractionDigits: digits }).format(value);

function localWallTimeToUtc(date: string, time: string, timeZone = "Asia/Kathmandu"): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const naive = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" }).formatToParts(naive);
  const offsetText = parts.find((part) => part.type === "timeZoneName")?.value ?? "";
  const match = offsetText.match(/^GMT([+-])(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) throw new Error("जन्मस्थानको समय क्षेत्र पत्ता लगाउन सकिएन।");
  const sign = match[1] === "-" ? -1 : 1;
  const offsetSeconds = sign * (Number(match[2]) * 3600 + Number(match[3]) * 60 + Number(match[4] ?? 0));
  const utc = new Date(naive.getTime() - offsetSeconds * 1000);
  const check = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(utc);
  const get = (type: string) => check.find((part) => part.type === type)?.value;
  if (Number(get("year")) !== year || Number(get("month")) !== month || Number(get("day")) !== day || Number(get("hour")) !== hour || Number(get("minute")) !== minute) {
    throw new Error("यो स्थानीय जन्म समय मान्य छैन। मिति र समय फेरि जाँच्नुहोस्।");
  }
  return utc;
}

function lahiriAyanamsa(date: Date): number {
  const jd = date.getTime() / DAY_MS + 2440587.5;
  const t = (jd - 2451545.0) / 36525;
  // Chitrapaksha/Lahiri practical polynomial, degrees; keep this convention explicit.
  return 23.857092 + 1.3969713 * t + 0.0003086 * t * t;
}

function meanObliquity(date: Date): number {
  const jd = date.getTime() / DAY_MS + 2440587.5;
  const t = (jd - 2451545.0) / 36525;
  const arcsec = 84381.406 - 46.836769 * t - 0.0001831 * t*t + 0.00200340*t**3 - 5.76e-7*t**4 - 4.34e-8*t**5;
  return arcsec / 3600;
}

function meanNode(date: Date): number {
  const jd = date.getTime() / DAY_MS + 2440587.5;
  const t = (jd - 2451545.0) / 36525;
  return norm(125.04452 - 1934.136261*t + 0.0020708*t*t + t*t*t/450000);
}

function siderealLongitude(body: Astronomy.Body, date: Date): number {
  return norm(Astronomy.EclipticLongitude(body, date) - lahiriAyanamsa(date));
}

function risingLongitude(date: Date, latitude: number, longitude: number): number {
  const theta = rad(norm(Astronomy.SiderealTime(date) * 15 + longitude));
  const phi = rad(latitude);
  const epsilon = rad(meanObliquity(date));
  const a = Math.cos(phi) * Math.cos(theta);
  const b = Math.cos(epsilon) * Math.cos(phi) * Math.sin(theta) + Math.sin(epsilon) * Math.sin(phi);
  return norm(deg(Math.atan2(a, -b)) - lahiriAyanamsa(date));
}

function nakshatraFor(longitude: number) {
  const span = 360 / 27;
  const position = norm(longitude) / span;
  const index = Math.floor(position);
  return { name: NAKSHATRAS[index], index, pada: Math.floor((position - index) * 4) + 1, progress: position - index };
}

function formatBS(date: Date): string {
  try {
    const y = date.getUTCFullYear(), m = String(date.getUTCMonth()+1).padStart(2,"0"), d = String(date.getUTCDate()).padStart(2,"0");
    const bs = new DateConverter(`${y}-${m}-${d}`).toBs();
    return `${nepaliNumber(bs.year,0)}-${nepaliNumber(bs.month,0).padStart(2,"0")}-${nepaliNumber(bs.date,0).padStart(2,"0")}`;
  } catch { return `${nepaliNumber(date.getUTCFullYear(),0)}-${nepaliNumber(date.getUTCMonth()+1,0).padStart(2,"0")}-${nepaliNumber(date.getUTCDate(),0).padStart(2,"0")} AD`; }
}

export interface KundaliInput {
  name: string;
  dateSystem: "AD" | "BS";
  birthDate: string;
  birthTime: string;
  placeId: string;
}

export interface KundaliPlanet {
  key: string; name: string; short: string; longitude: number; sign: string; signIndex: number;
  degree: number; minute: number; nakshatra: string; pada: number; house: number; retrograde: boolean;
}

export interface KundaliResult {
  name: string; birthDateAD: string; birthDateBS: string; birthTime: string; place: string;
  lagna: string; lagnaDegree: number; moonSign: string; janmaNakshatra: string; janmaPada: number;
  ayanamsa: number; planets: KundaliPlanet[]; houses: { house: number; sign: string; planets: string[] }[];
  dasha: { lord: string; start: string; end: string; years: number; current: boolean }[];
  currentDasha: string; method: string;
}

export function calculateJanmaKundali(input: KundaliInput): KundaliResult {
  const place = KUNDALI_PLACES.find((item) => item.id === input.placeId);
  if (!place) throw new Error("कृपया जन्मस्थान छान्नुहोस्।");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birthDate)) throw new Error("जन्ममिति YYYY-MM-DD ढाँचामा राख्नुहोस्।");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.birthTime)) throw new Error("जन्मसमय २४-घण्टाको HH:MM ढाँचामा राख्नुहोस्।");
  let dateAD = input.birthDate;
  if (input.dateSystem === "BS") {
    const ad = new DateConverter(input.birthDate).toAd();
    dateAD = `${ad.year}-${String(ad.month).padStart(2,"0")}-${String(ad.date).padStart(2,"0")}`;
  }
  const [year,month,day] = dateAD.split("-").map(Number);
  if (year < 1800 || year > 2100) throw new Error("हालको गणना १८०० देखि २१०० AD सम्मका जन्ममितिका लागि मात्र परीक्षण गरिएको छ।");
  const dateCheck = new Date(Date.UTC(year,month-1,day));
  if (dateCheck.getUTCFullYear()!==year || dateCheck.getUTCMonth()!==month-1 || dateCheck.getUTCDate()!==day) throw new Error("जन्ममिति मान्य छैन।");
  const birth = localWallTimeToUtc(dateAD,input.birthTime);
  if (birth.getTime() > Date.now()) throw new Error("भविष्यको जन्ममिति राख्न मिल्दैन।");
  const ayanamsa = lahiriAyanamsa(birth);
  const lagnaLong = risingLongitude(birth,place.lat,place.lon);
  const lagnaIndex = Math.floor(lagnaLong/30);
  const node = norm(meanNode(birth)-ayanamsa);
  const planetData: KundaliPlanet[] = GRAHAS.map((graha) => {
    const longitude = siderealLongitude(graha.body,birth);
    const before = siderealLongitude(graha.body,new Date(birth.getTime()-DAY_MS/2));
    const after = siderealLongitude(graha.body,new Date(birth.getTime()+DAY_MS/2));
    let delta = ((after-before+540)%360)-180;
    const speed = delta;
    const signIndex = Math.floor(longitude/30);
    const inSign = longitude-signIndex*30;
    const nak = nakshatraFor(longitude);
    return { key:graha.key,name:graha.name,short:graha.short,longitude,sign:SIGNS[signIndex],signIndex,degree:Math.floor(inSign),minute:Math.floor((inSign-Math.floor(inSign))*60),nakshatra:nak.name,pada:nak.pada,house:((signIndex-lagnaIndex+12)%12)+1,retrograde:speed<0 && graha.key!=="Sun" && graha.key!=="Moon" };
  });
  const rahuLong = node, ketuLong = norm(node+180);
  for (const [key,name,short,longitude] of [["Rahu","राहु","रा",rahuLong],["Ketu","केतु","के",ketuLong]] as const) {
    const signIndex=Math.floor(longitude/30), inSign=longitude-signIndex*30, nak=nakshatraFor(longitude);
    planetData.push({key,name,short,longitude,sign:SIGNS[signIndex],signIndex,degree:Math.floor(inSign),minute:Math.floor((inSign-Math.floor(inSign))*60),nakshatra:nak.name,pada:nak.pada,house:((signIndex-lagnaIndex+12)%12)+1,retrograde:key==="Rahu"});
  }
  const moon = planetData.find((planet)=>planet.key==="Moon")!;
  const moonNak = nakshatraFor(moon.longitude);
  const firstLordIndex = moonNak.index % 9;
  const firstLord = DASHA[firstLordIndex];
  const elapsedFraction = moonNak.progress;
  const remainingYears = firstLord.years * (1-elapsedFraction);
  let cursor = birth.getTime();
  const dasha: KundaliResult["dasha"] = [];
  for(let i=0;i<9;i++){
    const lord = DASHA[(firstLordIndex+i)%9];
    const years = i===0 ? remainingYears : lord.years;
    const start = new Date(cursor);
    const end = new Date(cursor + years*365.2425*DAY_MS);
    dasha.push({lord:lord.lord,start:formatBS(start),end:formatBS(end),years:Number(years.toFixed(2)),current:Date.now()>=start.getTime()&&Date.now()<end.getTime()});
    cursor=end.getTime();
  }
  const currentDasha = dasha.find((period)=>period.current)?.lord ?? "हालको महादशा यो १२०-वर्षे चक्रबाहिर छ";
  const houses = Array.from({length:12},(_,i)=>{
    const signIndex=(lagnaIndex+i)%12;
    return {house:i+1,sign:SIGNS[signIndex],planets:planetData.filter((planet)=>planet.house===i+1).map((planet)=>planet.short)};
  });
  const bsBirth = formatBS(new Date(Date.UTC(year,month-1,day)));
  return {name:input.name.trim(),birthDateAD:dateAD,birthDateBS:bsBirth,birthTime:input.birthTime,place:place.name,lagna:SIGNS[lagnaIndex],lagnaDegree:lagnaLong%30,moonSign:moon.sign,janmaNakshatra:moon.nakshatra,janmaPada:moon.pada,ayanamsa,planets:planetData,houses,dasha,currentDasha,method:"Astronomy Engine · geocentric apparent ecliptic positions · Lahiri/Chitrapaksha · whole-sign houses · mean lunar node · Vimshottari Dasha"};
}
