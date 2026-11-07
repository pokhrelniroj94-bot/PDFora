"use client";

import { useState } from "react";
import DateConverter from "../lib/nepali-date-converter";
import { convertTolaGrams, validateNepalMobileNumber } from "../lib/i18n/nepali-nepal-tools";

const months = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];
const weekdays = ["आइतबार", "सोमबार", "मङ्गलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"];
const toAsciiDigits = (value: string) => value.replace(/[०-९]/g, (digit) => String("०१२३४५६७८९".indexOf(digit)));
const toNepaliDigits = (value: string) => value.replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)]);
const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const button = "rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50";

function Output({ children }: { children: React.ReactNode }) {
  return <div aria-live="polite" className="mt-4 whitespace-pre-wrap break-words rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-7 text-teal-950 sm:p-5">{children}</div>;
}

function NepaliCalendar() {
  const [year, setYear] = useState("२०८३");
  const [month, setMonth] = useState("1");
  const [rows, setRows] = useState<{ day: number; ad: string; weekday: string }[]>([]);
  const [error, setError] = useState("");

  function buildCalendar() {
    try {
      const bsYear = Number(toAsciiDigits(year));
      const bsMonth = Number(month);
      if (!Number.isInteger(bsYear) || bsYear < 1975 || bsYear > 2099 || !Number.isInteger(bsMonth) || bsMonth < 1 || bsMonth > 12) {
        throw new Error("कृपया १९७५ देखि २०९९ सम्मको BS वर्ष र १ देखि १२ सम्मको महिना छान्नुहोस्।");
      }
      const start = new Date(Math.max(Date.UTC(bsYear - 57, 3, 1), Date.UTC(1918, 3, 13)));
      const end = new Date(Math.min(Date.UTC(bsYear - 56, 4, 15), Date.UTC(2043, 3, 13)));
      const found: { day: number; ad: string; weekday: string }[] = [];
      for (let date = new Date(start); date <= end; date.setUTCDate(date.getUTCDate() + 1)) {
        const ad = date.toISOString().slice(0, 10);
        const converted = new DateConverter(ad).toBs();
        if (converted.year === bsYear && converted.month === bsMonth) {
          found.push({ day: converted.date, ad, weekday: weekdays[date.getUTCDay()] });
        }
      }
      if (!found.length) throw new Error("यो महिना उपलब्ध पात्रो डाटामा भेटिएन।");
      setRows(found);
      setError("");
    } catch (cause) {
      setRows([]);
      setError(cause instanceof Error ? cause.message : "पात्रो तयार गर्न सकिएन।");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">नेपाली पात्रो (विक्रम संवत्)</h2>
        <p className="mt-1 text-sm text-slate-600">BS वर्ष र महिना छानेर सम्बन्धित AD मिति र बार हेर्नुहोस्। समर्थित दायरा: १९७५–२०९९ BS।</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label><span className={label}>BS वर्ष</span><input className={field} type="text" inputMode="numeric" maxLength={4} value={year} onChange={(event) => setYear(event.target.value)} /></label>
        <label><span className={label}>महिना</span><select className={field} value={month} onChange={(event) => setMonth(event.target.value)}>{months.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</select></label>
      </div>
      <button className={button} onClick={buildCalendar}>पात्रो देखाउनुहोस्</button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {rows.length > 0 && <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[360px] text-left text-sm"><thead className="bg-slate-100"><tr><th className="p-3">BS गते</th><th className="p-3">AD मिति</th><th className="p-3">बार</th></tr></thead><tbody>{rows.map((row) => <tr key={row.day} className="border-t border-slate-100"><td className="p-3 font-semibold">{toNepaliDigits(String(row.day))}</td><td className="p-3">{toNepaliDigits(row.ad)}</td><td className="p-3">{row.weekday}</td></tr>)}</tbody></table></div>}
      <p className="text-xs leading-5 text-slate-500">यस पात्रोमा सार्वजनिक बिदा, तिथि वा चाडपर्वको आधिकारिक सूची समावेश छैन। सरकारी कामका लागि सम्बन्धित निकायको सूचना जाँच्नुहोस्।</p>
    </div>
  );
}

function NepalPhoneValidator() {
  const [phone, setPhone] = useState("");
  const result = validateNepalMobileNumber(phone);
  return (
    <div className="space-y-4">
      <div><h2 className="text-lg font-bold">नेपाल मोबाइल नम्बर जाँच</h2><p className="mt-1 text-sm text-slate-600">नेपालको सामान्य १० अङ्कको मोबाइल नम्बर ढाँचा जाँच्नुहोस्। +977 सहितको नम्बर पनि स्वीकार हुन्छ।</p></div>
      <label className="block"><span className={label}>मोबाइल नम्बर</span><input className={field} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="९८XXXXXXXX वा +977 98XXXXXXXX" inputMode="tel" autoComplete="tel" /></label>
      {phone.trim() && <Output>{result.valid ? `ढाँचा मिल्यो।\nस्थानीय नम्बर: ${result.local}\nअन्तर्राष्ट्रिय ढाँचा: ${result.international}` : "यो नम्बर नेपालको सामान्य १० अङ्कको मोबाइल ढाँचासँग मिलेन। ९६, ९७ वा ९८ बाट सुरु हुने १० अङ्कको नम्बर जाँच्नुहोस्।"}</Output>}
      <p className="text-xs leading-5 text-slate-500">यो ढाँचा जाँच मात्र हो। यसले SIM सक्रिय छ, नम्बर कसैलाई दिइएको छ वा फोनमा सम्पर्क हुन्छ भन्ने पुष्टि गर्दैन।</p>
    </div>
  );
}

function TolaGramConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState<"tola" | "gram">("tola");
  const number = Number(value);
  const valid = value.trim() !== "" && Number.isFinite(number) && number >= 0;
  const converted = valid ? convertTolaGrams(number, from) : null;
  return (
    <div className="space-y-4">
      <div><h2 className="text-lg font-bold">तोला र ग्राम रूपान्तरण</h2><p className="mt-1 text-sm text-slate-600">सुन, चाँदी तथा अन्य वस्तुको तौल तोला र ग्रामबीच बदल्नुहोस्।</p></div>
      <label className="block"><span className={label}>रूपान्तरण दिशा</span><select className={field} value={from} onChange={(event) => setFrom(event.target.value as "tola" | "gram")}><option value="tola">तोला बाट ग्राम</option><option value="gram">ग्राम बाट तोला</option></select></label>
      <label className="block"><span className={label}>{from === "tola" ? "तौल (तोला)" : "तौल (ग्राम)"}</span><input className={field} type="number" min="0" step="any" value={value} onChange={(event) => setValue(event.target.value)} /></label>
      {converted !== null ? <Output>{from === "tola" ? `${converted.toFixed(4)} ग्राम` : `${converted.toFixed(4)} तोला`}\n१ तोला = ११.६६३८०३८ ग्राम</Output> : <p role="alert" className="text-sm text-red-700">शून्य वा सोभन्दा ठूलो मान्य तौल लेख्नुहोस्।</p>}
      <p className="text-xs leading-5 text-slate-500">यो तौल रूपान्तरण मात्र हो। यसले सुनको दैनिक मूल्य, शुद्धता, ज्याला वा गहना बनाउने शुल्क गणना गर्दैन।</p>
    </div>
  );
}

function LoksewaPhotoResizer() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [limit, setLimit] = useState("200");
  const [dimension, setDimension] = useState("600");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function resizePhoto() {
    if (!photo) { setMessage("पहिले फोटो छान्नुहोस्।"); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) { setMessage("JPEG, PNG वा WebP फोटो मात्र छान्नुहोस्।"); return; }
    if (photo.size > 20 * 1024 * 1024) { setMessage("फोटोको आकार २० MB भन्दा कम हुनुपर्छ।"); return; }
    setBusy(true);
    setMessage("");
    const sourceUrl = URL.createObjectURL(photo);
    try {
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("फोटो खोल्न सकिएन। अर्को फाइल प्रयास गर्नुहोस्।"));
        image.src = sourceUrl;
      });
      const sourcePixels = image.naturalWidth * image.naturalHeight;
      if (!image.naturalWidth || !image.naturalHeight || !Number.isSafeInteger(sourcePixels) || sourcePixels > 25_000_000) {
        throw new Error("फोटोको रिजोल्युसन धेरै ठूलो छ। २५ मेगापिक्सेलभन्दा कम भएको फोटो छान्नुहोस्।");
      }
      const max = Number(dimension);
      const scale = Math.min(1, max / image.naturalWidth, max / image.naturalHeight);
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("ब्राउजरको image canvas उपलब्ध भएन।");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      const maxBytes = Number(limit) * 1024;
      let blob: Blob | null = null;
      for (let quality = 0.92; quality >= 0.25; quality -= 0.07) {
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
        if (blob && blob.size <= maxBytes) break;
      }
      if (!blob || blob.size > maxBytes) throw new Error("तोकिएको KB सीमाभित्र फोटो बनाउन सकिएन। कम पिक्सेल वा ठूलो KB सीमा छान्नुहोस्।");
      const outputUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = outputUrl;
      anchor.download = "nepal-form-photo.jpg";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(outputUrl), 1000);
      setMessage(`फोटो तयार भयो: ${width} × ${height} px, ${(blob.size / 1024).toFixed(1)} KB। मूल फाइल: ${(photo.size / 1024).toFixed(1)} KB।`);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "फोटो सानो बनाउन सकिएन।");
    } finally {
      URL.revokeObjectURL(sourceUrl);
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div><h2 className="text-lg font-bold">लोकसेवा तथा अनलाइन फाराम फोटो रिसाइजर</h2><p className="mt-1 text-sm text-slate-600">फोटोको पिक्सेल आयाम र JPEG फाइल आकार घटाएर डाउनलोड गर्नुहोस्।</p></div>
      {photo && <p className="text-sm text-slate-600">छानिएको फाइल: {photo.name} · {(photo.size / 1024).toFixed(1)} KB</p>}
      <label className="block"><span className={label}>फोटो छान्नुहोस् (अधिकतम २० MB)</span><input className={field} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { setPhoto(event.target.files?.[0] ?? null); setMessage(""); }} /></label>
      <div className="grid grid-cols-2 gap-3">
        <label><span className={label}>अधिकतम फाइल आकार</span><select className={field} value={limit} onChange={(event) => setLimit(event.target.value)}><option value="50">५० KB</option><option value="100">१०० KB</option><option value="200">२०० KB</option></select></label>
        <label><span className={label}>अधिकतम चौडाइ/उचाइ</span><select className={field} value={dimension} onChange={(event) => setDimension(event.target.value)}><option value="600">६०० px</option><option value="800">८०० px</option><option value="1200">१२०० px</option></select></label>
      </div>
      <button className={button} onClick={() => void resizePhoto()} disabled={busy || !photo}>{busy ? "फोटो तयार हुँदैछ…" : "फोटो सानो बनाएर डाउनलोड गर्नुहोस्"}</button>
      {message && <Output>{message}</Output>}
      <p className="text-xs leading-5 text-slate-500">KB आकार मिल्दैमा फारामले फोटो स्वीकार गर्छ भन्ने ग्यारेन्टी हुँदैन। आवेदन सूचनामा दिइएको पिक्सेल, अनुपात, पृष्ठभूमि र अन्य सर्त छुट्टै जाँच्नुहोस्।</p>
    </div>
  );
}

export default function NepaliNepalToolsWorkspace({ slug }: { slug: string }) {
  if (slug === "nepal-phone-validator") return <NepalPhoneValidator />;
  if (slug === "gold-tola-gram-converter") return <TolaGramConverter />;
  if (slug === "nepali-calendar") return <NepaliCalendar />;
  if (slug === "loksewa-photo-resizer") return <LoksewaPhotoResizer />;
  return null;
}
