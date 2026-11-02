# PDFora Nepali Janma Kundali — calculation notes

## Inputs
- Date: Gregorian (AD) or Bikram Sambat (BS). BS conversion is restricted to the checked-in calendar table, 1975–2083 BS.
- Time: local wall-clock time at the Nepal birthplace, entered to the nearest minute.
- Place: a supported Nepal city-centre coordinate or user-entered latitude/longitude.
- Time zone: IANA `Asia/Kathmandu`, including historical UTC offsets.

## Calculation conventions
- Ephemeris: MIT-licensed Astronomy Engine 2.1.19.
- Planetary positions: geocentric apparent ecliptic longitudes (SunPosition for Sun, EclipticGeoMoon for Moon, and GeoVector → Ecliptic for planets; never heliocentric EclipticLongitude).
- Zodiac: sidereal, Lahiri/Chitrapaksha approximation.
- Ascendant: local apparent sidereal time, true obliquity of date and ecliptic/horizon intersection.
- Houses: whole-sign houses counted from the ascendant sign.
- Rahu/Ketu: mean lunar node and its exact opposite.
- Nakshatra: 27 equal sectors of 13°20′; pada: four equal quarters.
- Vimshottari Mahadasha: 120-year lord sequence, with the birth balance derived from the Moon's progress through its birth nakshatra; year length used here is 365.2425 days.

## Accuracy, licensing and verification
Astronomy Engine documents a design target of approximately ±1 arcminute against NOVAS for its astronomical calculations. This is not a guarantee of identical astrological output across different software: ayanamsha conventions, true/mean node selection, house systems, time-zone history, coordinates and dasha-year conventions can all cause differences.

Swiss Ephemeris is not bundled. Its authors require a developer to choose AGPL (with corresponding source-licensing obligations for the combined project) or obtain a professional license before distributing a product or activating a public service. See https://www.astro.com/swisseph/swephinfo_e.htm.

The exact calculation settings used internally by Hamro Patro are not publicly confirmed in the material reviewed. Do not advertise this implementation as an exact Hamro Patro clone. Compare independent reference charts with identical date, time, coordinates, ayanamsha, node and house settings before claiming parity.

## Known limitations
- Tested date range is restricted to 1800–2100 AD.
- BS input is available only within the converter's verified 1975–2083 BS data.
- The city selector uses approximate city-centre coordinates; exact coordinates should be entered for rural birthplaces or when the ascendant is close to a sign boundary.
- Birth time is entered to the nearest minute. An inaccurate or rounded birth time can change the ascendant and house placement.
- This first release does not calculate Navamsa/D9, other divisional charts, Ashtakoota/36-guna matching, Mangal dosha or personalized muhurta.
- Astrological interpretations are traditional beliefs, not scientifically validated predictions.

## Privacy
The birth-chart calculations run in the user's browser. Do not send name, date, time or coordinates to an external calculation API or persist them without explicit user consent.
