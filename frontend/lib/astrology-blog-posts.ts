import type { BlogPost } from "./blog-posts";

export const astrologyBlogPosts: BlogPost[] = [
  {
    slug: "how-to-read-a-janam-kundli-lagna-rashi-nakshatra-dasha",
    title: "How to Read a Janam Kundli: Lagna, Rashi, Nakshatra and Dasha Explained",
    description: "A practical guide to Vedic birth charts, Lagna, Moon sign, nakshatra, houses and Vimshottari dasha for readers in India and Nepal.",
    keyword: "janam kundli online, Vedic birth chart, lagna rashi nakshatra dasha, kundali India",
    updated: "2026-11-02", readTime: "7 min read",
    intro: "A Janam Kundli is a traditional Vedic astrology chart calculated from birth date, local birth time and birthplace. Time zone and coordinates matter because the same clock time can represent a different astronomical instant in different places. Astrology is a traditional belief system, not a scientifically proven way to predict life events.",
    sections: [
      { heading: "1. Enter the correct birth details", paragraphs: ["Use the date and time from a reliable birth record and select the actual birthplace. India uses Asia/Kolkata while Nepal uses Asia/Kathmandu; these time zones differ by 15 minutes. Do not use Nepal's time zone for an Indian birth.", "City-centre coordinates are approximate. For a village or a birth close to an ascendant boundary, enter more precise coordinates and verify the time zone."] },
      { heading: "2. Lagna, Rashi and the twelve houses", paragraphs: ["Lagna (Ascendant) is the sign rising on the eastern horizon at the birth moment. Rashi often means the Moon sign in common Indian usage. The D1 chart places planets in signs and houses according to a selected house convention. Lagna and Moon sign are not interchangeable.", "House systems and calculation settings vary. Check ayanamsha, node selection and house system before comparing charts from different websites."] },
      { heading: "3. Nakshatra and pada", paragraphs: ["The sidereal zodiac is commonly divided into 27 nakshatras of 13 degrees and 20 minutes each. Every nakshatra has four padas. Small differences in ayanamsha or birth time can matter near a boundary."] },
      { heading: "4. Vimshottari Mahadasha", paragraphs: ["Vimshottari is a traditional 120-year planetary-period sequence. Its starting period and birth balance are derived from the Moon's position in its birth nakshatra. Dates depend on the chosen year-length convention and precise lunar longitude."] },
      { heading: "5. Compare charts responsibly", paragraphs: ["Compare identical date, local time, coordinates, time zone, ayanamsha, node and house settings. Different conventions can produce different results.", "Astrological interpretations are not scientifically validated predictions. Do not use a chart as a substitute for medical, legal, financial or other professional advice."] }
    ],
    faqs: [
      { question: "Can I create a Kundli for someone born in India?", answer: "Yes. Select a supported Indian city or enter exact coordinates and the correct IANA time zone, such as Asia/Kolkata." },
      { question: "What is the difference between Lagna and Rashi?", answer: "Lagna is the sign rising at the eastern horizon at birth. Rashi commonly refers to the Moon sign. They are different chart factors." },
      { question: "Does an inaccurate birth time affect Kundli?", answer: "Yes. Ascendant and house placements can change with birth time, especially near sign boundaries." },
      { question: "Are online Kundli predictions scientifically proven?", answer: "No. Astrology is a traditional belief system and its predictive claims are not scientifically established." }
    ],
    toolLinks: [{ label: "Janma Kundali / Birth Chart", href: "/tools/nepali-janma-kundali" }, { label: "Hindu Panchang Calculator", href: "/tools/nepal-panchang-calculator" }]
  },
  {
    slug: "hindu-panchang-tithi-nakshatra-yoga-karana-guide",
    title: "Hindu Panchang Explained: Tithi, Nakshatra, Yoga and Karana",
    description: "Understand the five limbs of Hindu Panchang and why tithi, sunrise, location and regional calendar traditions matter in India and Nepal.",
    keyword: "Hindu panchang, tithi today, nakshatra today, panchang calculator India Nepal",
    updated: "2026-11-02", readTime: "6 min read",
    intro: "A Hindu Panchang is a traditional lunisolar almanac. Its five main limbs are tithi, vara (weekday), nakshatra, yoga and karana. Displayed values and festival observances can depend on local sunrise, geography and regional tradition.",
    sections: [
      { heading: "1. What is a Tithi?", paragraphs: ["A tithi is based on the angular separation of the geocentric Moon and Sun. There are 30 tithis in a lunar month: 15 in Shukla Paksha and 15 in Krishna Paksha. A tithi can begin or end at any time, not only midnight."] },
      { heading: "2. Nakshatra, Yoga and Karana", paragraphs: ["Nakshatra tracks the Moon through 27 sidereal sectors. Yoga is calculated from the combined sidereal longitudes of the Sun and Moon. Karana is half of a tithi. Regional almanacs may apply additional traditional rules for observances."] },
      { heading: "3. Why city and sunrise matter", paragraphs: ["Sunrise and sunset depend on latitude, longitude, elevation and date. A Panchang for Delhi should not reuse Kathmandu sunrise. Local time-zone conversion is also required.", "India and Nepal share many calendar concepts but do not necessarily follow the same official or regional almanac for every festival. Confirm important observances with a trusted local Panchang."] },
      { heading: "4. Calculation conventions and limitations", paragraphs: ["Online calculations may use different ephemerides, ayanamsha values, sunrise definitions and rounding rules. City-centre coordinates are approximate. Compare calculation settings and source data, not only the displayed tithi name."] }
    ],
    faqs: [
      { question: "Is tithi the same everywhere in India?", answer: "The astronomical tithi is global at a given instant, but the tithi assigned to a local Panchang day and festival observance can depend on local sunrise and regional rules." },
      { question: "Why can a tithi span two dates?", answer: "A tithi can begin or end at any time of day and may cross local midnight or sunrise." },
      { question: "Can I use this Panchang calculator in India?", answer: "Yes, supported Indian cities use Asia/Kolkata for local time display. It is an astronomical reference, not a replacement for a regional official almanac." }
    ],
    toolLinks: [{ label: "Hindu Panchang Calculator", href: "/tools/nepal-panchang-calculator" }, { label: "Janma Kundali / Birth Chart", href: "/tools/nepali-janma-kundali" }]
  }
];
