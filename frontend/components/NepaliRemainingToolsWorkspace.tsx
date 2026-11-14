"use client";

import { useEffect, useMemo, useState } from "react";
import { analyzeKeywordDensity, buildRobotsTxt, buildSitemap, calculateContrast, decodeJwt, findRegexMatches, minifyCss } from "../lib/i18n/nepali-remaining-tools";

declare global { interface Window { PreetiConverter?: new () => { convert: (text: string) => string; reverseConvert: (text: string) => string } } }

const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const panel = "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800";
const copy = (value: string) => void navigator.clipboard?.writeText(value);


export default function NepaliRemainingToolsWorkspace({ slug }: { slug: string }) {
  const [source, setSource] = useState("");
  const [secondary, setSecondary] = useState("");
  const [third, setThird] = useState("");
  const [flags, setFlags] = useState("g");
  const [length, setLength] = useState("20");
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generated, setGenerated] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFormat, setImageFormat] = useState("image/webp");
  const [imageQuality, setImageQuality] = useState("0.8");
  const [imageBusy, setImageBusy] = useState(false);
  const [currencyAmount, setCurrencyAmount] = useState("1");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("NPR");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeDate, setExchangeDate] = useState("");
  const [exchangeError, setExchangeError] = useState("");
  const [exchangeBusy, setExchangeBusy] = useState(false);
  const [preetiReady, setPreetiReady] = useState(false);
  const [preetiInput, setPreetiInput] = useState("");
  const [preetiOutput, setPreetiOutput] = useState("");
  const [preetiDirection, setPreetiDirection] = useState<"to-unicode" | "to-preeti">("to-unicode");
  useEffect(() => {
    if (slug !== "preeti-unicode-converter") return;
    if (window.PreetiConverter) { setPreetiReady(true); return; }
    const existing = document.querySelector<HTMLScriptElement>('script[data-pdfora-preeti]');
    if (existing) {
      const onLoad = () => setPreetiReady(!!window.PreetiConverter);
      const onError = () => setError("Preeti रूपान्तरण इन्जिन लोड भएन। पृष्ठ पुनःलोड गरेर प्रयास गर्नुहोस्।");
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", onError, { once: true });
      return () => { existing.removeEventListener("load", onLoad); existing.removeEventListener("error", onError); };
    }
    const script = document.createElement("script");
    script.src = "/vendor/preeti-to-unicode.js";
    script.dataset.pdforaPreeti = "true";
    script.async = true;
    script.onload = () => setPreetiReady(!!window.PreetiConverter);
    script.onerror = () => setError("Preeti रूपान्तरण इन्जिन लोड भएन। पृष्ठ पुनःलोड गरेर प्रयास गर्नुहोस्।");
    document.head.appendChild(script);
    return () => { script.onload = null; };
  }, [slug]);

  const result = useMemo(() => {
    try {
      if (slug === "regex-tester") {
        if (!source) return { text: "", error: "" };
        const matches = findRegexMatches(source, secondary, flags);
        return { text: matches.length ? matches.map((match) => String(match.index) + ". " + match.value + " (index: " + match.offset + ")").join("\n") : "कुनै मिल्दो अंश भेटिएन।", error: "" };
      }
      if (slug === "jwt-decoder") {
        const decoded = decodeJwt(source);
        return { text: JSON.stringify({ header: decoded.header, payload: decoded.payload, note: "Signature यहाँ verify गरिएको छैन।" }, null, 2), error: "" };
      }
      if (slug === "css-minifier") {
        return { text: minifyCss(source), error: "" };
      }
      if (slug === "keyword-density-checker") {
        const analysis = analyzeKeywordDensity(source, secondary);
        if (!secondary.trim()) return { text: "कुल शब्द: " + analysis.totalWords + "\nविश्लेषणका लागि keyword लेख्नुहोस्।", error: "" };
        return { text: "कुल शब्द: " + analysis.totalWords + "\nKeyword: " + secondary.trim() + "\nआवृत्ति: " + analysis.count + "\nघनत्व: " + analysis.density.toFixed(2) + "%\nयो साधारण exact-match अनुमान हो।", error: "" };
      }
      if (slug === "meta-title-checker") return { text: `अक्षर संख्या: ${source.length}\nसुझाव: ३०–६० अक्षरको दायरालाई प्रारम्भिक guideline मान्नुहोस्। वास्तविक SERP प्रदर्शन फरक हुन सक्छ।`, error: "" };
      if (slug === "meta-description-checker") return { text: `अक्षर संख्या: ${source.length}\nसुझाव: करिब १२०–१६० अक्षरमा स्पष्ट, पृष्ठसँग मेल खाने विवरण लेख्नुहोस्। Google ले snippet फरक देखाउन सक्छ।`, error: "" };
      if (slug === "color-contrast-checker") {
        const contrast = calculateContrast(source, secondary);
        return { text: "Contrast ratio: " + contrast.ratio.toFixed(2) + ":1\nWCAG AA सामान्य text: " + (contrast.aaNormal ? "PASS" : "FAIL") + "\nWCAG AA ठूलो text: " + (contrast.aaLarge ? "PASS" : "FAIL") + "\nWCAG AAA सामान्य text: " + (contrast.aaaNormal ? "PASS" : "FAIL"), error: "" };
      }
      if (slug === "open-graph-preview") {
        return { text: "", error: "" };
      }
      if (slug === "robots-txt-generator") {
        return { text: buildRobotsTxt(secondary, third.split(/\r?\n/)), error: "" };
      }
      if (slug === "sitemap-generator") {
        if (!source.trim()) return { text: "", error: "" };
        return { text: buildSitemap(source.split(/\r?\n/)), error: "" };
      }
      return { text: "", error: "" };
    } catch (cause) {
      return { text: "", error: cause instanceof Error ? cause.message : "इनपुट जाँच गर्नुहोस्।" };
    }
  }, [slug, source, secondary, third, flags]);

  const generatePassword = () => {
    const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ" + (includeNumbers ? "23456789" : "") + (includeSymbols ? "!@#$%&*+-_?" : "");
    const size = Math.max(8, Math.min(128, Number(length) || 20));
    const limit = Math.floor(0x100000000 / alphabet.length) * alphabet.length;
    const chosen: string[] = [];
    while (chosen.length < size) {
      const random = new Uint32Array(Math.max(16, size - chosen.length));
      crypto.getRandomValues(random);
      for (const value of random) {
        if (value < limit) chosen.push(alphabet[value % alphabet.length]);
        if (chosen.length === size) break;
      }
    }
    setGenerated(chosen.join(""));
  };
  const generateUuid = () => setGenerated(crypto.randomUUID());

  if (slug === "preeti-unicode-converter") {
    const convert = () => {
      try {
        if (!window.PreetiConverter) throw new Error("Preeti रूपान्तरण इन्जिन लोड भएको छैन। पृष्ठ पुनःलोड गरेर प्रयास गर्नुहोस्।");
        const converter = new window.PreetiConverter();
        setPreetiOutput(preetiDirection === "to-unicode" ? converter.convert(preetiInput) : converter.reverseConvert(preetiInput));
        setError("");
      } catch (cause) { setError(cause instanceof Error ? cause.message : "रूपान्तरण गर्न सकिएन।"); }
    };
    return <section className="space-y-4">
      <h2 className="text-xl font-black">Preeti ↔ Unicode रूपान्तरण</h2>
      <p className="text-sm text-slate-600">Preeti font मा लेखिएको पुरानो नेपाली पाठलाई Unicode मा बदल्नुहोस्। Reverse conversion अनुमानित हुन्छ; नतिजा जाँच गर्नुहोस्।</p>
      <label className="block"><span className={label}>रूपान्तरण दिशा</span><select className={input} value={preetiDirection} onChange={(e) => setPreetiDirection(e.target.value as "to-unicode" | "to-preeti")}><option value="to-unicode">Preeti बाट Unicode</option><option value="to-preeti">Unicode बाट Preeti</option></select></label>
      <label className="block"><span className={label}>इनपुट पाठ</span><textarea className={input + " min-h-36"} value={preetiInput} onChange={(e) => setPreetiInput(e.target.value)} /></label>
      <button disabled={!preetiReady} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50" onClick={convert}>{preetiReady ? "रूपान्तरण गर्नुहोस्" : "इन्जिन लोड हुँदैछ..."}</button>
      <label className="block"><span className={label}>रूपान्तरण नतिजा</span><textarea className={input + " min-h-36"} value={preetiOutput} onChange={(e) => setPreetiOutput(e.target.value)} /></label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {preetiOutput && <button className="underline" onClick={() => copy(preetiOutput)}>नतिजा कपी गर्नुहोस्</button>}
      <p className="text-xs text-slate-500">यो tool ले पुरानो font encoding map प्रयोग गर्छ। सबै custom glyph र formatting पूर्ण रूपमा मिल्ने ग्यारेन्टी छैन।</p>
    </section>;
  }

  if (slug === "currency-converter") {
    const convert = async () => {
      const amount = Number(currencyAmount);
      if (!currencyAmount.trim() || !Number.isFinite(amount) || amount < 0) {
        setExchangeError("शून्य वा सकारात्मक मान्य रकम प्रविष्ट गर्नुहोस्।");
        setExchangeRate(null);
        return;
      }
      setExchangeBusy(true);
      setExchangeError("");
      try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(currencyFrom)}`);
        if (!response.ok) throw new Error("विनिमय दर सेवा अहिले उपलब्ध छैन।");
        const data = await response.json();
        const rate = data?.rates?.[currencyTo];
        if (typeof rate !== "number" || !Number.isFinite(rate)) throw new Error("छानिएको मुद्रा उपलब्ध छैन।");
        setExchangeRate(rate);
        setExchangeDate(String(data.time_last_update_utc ?? ""));
      } catch (cause) {
        setExchangeError(cause instanceof Error ? cause.message : "विनिमय दर ल्याउन सकिएन।");
        setExchangeRate(null);
      } finally { setExchangeBusy(false); }
    };
    return <section className="space-y-4">
      <h2 className="text-xl font-black">मुद्रा रूपान्तरण</h2>
      <p className="text-sm text-slate-600">सार्वजनिक विनिमय-दर API बाट दर ल्याइन्छ। दर ढिलाइ हुन सक्छ; बैंक वा कारोबारका लागि आधिकारिक दर पुष्टि गर्नुहोस्।</p>
      <label className="block"><span className={label}>रकम</span><input className={input} type="number" min="0" value={currencyAmount} onChange={(e) => { setCurrencyAmount(e.target.value); setExchangeRate(null); }} /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label><span className={label}>बाट</span><select className={input} value={currencyFrom} onChange={(e) => { setCurrencyFrom(e.target.value); setExchangeRate(null); }}><option>USD</option><option>NPR</option><option>INR</option><option>EUR</option><option>GBP</option><option>AUD</option><option>CAD</option><option>JPY</option><option>CNY</option><option>AED</option></select></label>
        <label><span className={label}>मा</span><select className={input} value={currencyTo} onChange={(e) => { setCurrencyTo(e.target.value); setExchangeRate(null); }}><option>NPR</option><option>USD</option><option>INR</option><option>EUR</option><option>GBP</option><option>AUD</option><option>CAD</option><option>JPY</option><option>CNY</option><option>AED</option></select></label>
      </div>
      <button disabled={exchangeBusy} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50" onClick={() => void convert()}>{exchangeBusy ? "दर ल्याउँदै..." : "रूपान्तरण गर्नुहोस्"}</button>
      {exchangeError && <p role="alert" className="text-sm text-red-700">{exchangeError}</p>}
      {exchangeRate !== null && <div className={panel}>१ {currencyFrom} = {exchangeRate.toLocaleString("en-US", { maximumFractionDigits: 6 })} {currencyTo}<br/><strong>{Number(currencyAmount).toLocaleString("en-US")} {currencyFrom} = {(Number(currencyAmount) * exchangeRate).toLocaleString("en-US", { maximumFractionDigits: 4 })} {currencyTo}</strong><p className="mt-2 text-xs text-slate-500">अन्तिम अद्यावधिक: {exchangeDate || "स्रोतले मिति दिएको छैन"}</p></div>}
    </section>;
  }

  if (slug === "image-compressor" || slug === "image-format-converter") {
    const processImage = async () => {
      if (!imageFile) { setError("पहिले तस्बिर छान्नुहोस्।"); return; }
      if (imageFile.size > 50 * 1024 * 1024) { setError("५० MB भन्दा सानो तस्बिर छान्नुहोस्।"); return; }
      const quality = Number(imageQuality);
      if (slug === "image-compressor" && (!Number.isFinite(quality) || quality < 0.1 || quality > 1)) { setError("गुणस्तर ०.१ देखि १.० बीच हुनुपर्छ।"); return; }
      setImageBusy(true); setError("");
      let sourceUrl = "";
      let outputUrl = "";
      try {
        sourceUrl = URL.createObjectURL(imageFile);
        const image = new Image();
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("यो image format पढ्न सकिएन।"));
          image.src = sourceUrl;
        });
        if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40_000_000) throw new Error("तस्बिरको dimensions अमान्य वा अत्यधिक ठूलो छ (अधिकतम ४० मेगापिक्सेल)।");
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("ब्राउजरमा image canvas उपलब्ध छैन।");
        const mime = slug === "image-compressor" ? "image/webp" : imageFormat;
        if (mime === "image/jpeg") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height); }
        context.drawImage(image, 0, 0);
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("यो output format ब्राउजरले समर्थन गर्दैन।")), mime, quality));
        outputUrl = URL.createObjectURL(blob);
        const extension = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
        const anchor = document.createElement("a");
        anchor.href = outputUrl;
        anchor.download = imageFile.name.replace(/\.[^.]+$/, "") + (slug === "image-compressor" ? "-compressed." : "-converted.") + extension;
        document.body.appendChild(anchor); anchor.click(); anchor.remove();
        setGenerated(`मूल आकार: ${(imageFile.size / 1024).toFixed(1)} KB · नयाँ आकार: ${(blob.size / 1024).toFixed(1)} KB`);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "तस्बिर प्रक्रिया गर्न सकिएन।");
      } finally {
        if (sourceUrl) URL.revokeObjectURL(sourceUrl);
        if (outputUrl) window.setTimeout(() => URL.revokeObjectURL(outputUrl), 1500);
        setImageBusy(false);
      }
    };
    return <section className="space-y-4">
      <h2 className="text-xl font-black">{slug === "image-compressor" ? "तस्बिर कम्प्रेसर" : "तस्बिर Format रूपान्तरण"}</h2>
      <p className="text-sm text-slate-600">PNG, JPEG, WebP, GIF वा BMP छान्नुहोस्। HEIC समर्थित छैन। Animated GIF को पहिलो frame मात्र रूपान्तरण हुन्छ। प्रक्रिया तपाईंको ब्राउजरमै हुन्छ; फाइल सर्भरमा पठाइँदैन।</p>
      <label className="block"><span className={label}>तस्बिर छान्नुहोस् (अधिकतम ५० MB)</span><input className={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp" onChange={(e) => { setImageFile(e.target.files?.[0] ?? null); setGenerated(""); setError(""); }} /></label>
      {imageFile && <p className="text-sm text-slate-600">{imageFile.name} · {(imageFile.size / 1024).toFixed(1)} KB</p>}
      {slug === "image-compressor" ? <label><span className={label}>गुणस्तर (०.१–१.०)</span><input className={input} type="number" min="0.1" max="1" step="0.1" value={imageQuality} onChange={(e) => setImageQuality(e.target.value)} /></label> : <label><span className={label}>नयाँ format</span><select className={input} value={imageFormat} onChange={(e) => setImageFormat(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select></label>}
      <button disabled={imageBusy || !imageFile} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50" onClick={() => void processImage()}>{imageBusy ? "प्रक्रिया हुँदैछ..." : slug === "image-compressor" ? "तस्बिर कम्प्रेस गर्नुहोस्" : "Format बदल्नुहोस्"}</button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {generated && <div role="status" className={panel}>{generated}</div>}
    </section>;
  }

  if (slug === "password-generator" || slug === "uuid-generator") return <section className="space-y-4">
    <h2 className="text-xl font-black">{slug === "password-generator" ? "सुरक्षित पासवर्ड बनाउने" : "UUID बनाउने"}</h2>
    {slug === "password-generator" && <><label className="block"><span className={label}>लम्बाइ (८–१२८)</span><input className={input} type="number" min="8" max="128" value={length} onChange={(e) => setLength(e.target.value)} /></label><label className="flex gap-2 text-sm"><input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} /> अंक समावेश गर्ने</label><label className="flex gap-2 text-sm"><input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} /> चिन्ह समावेश गर्ने</label></>}
    <button className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={slug === "password-generator" ? generatePassword : generateUuid}>नयाँ {slug === "password-generator" ? "पासवर्ड" : "UUID"} बनाउनुहोस्</button>
    {generated && <div className={panel}><code className="break-all">{generated}</code><button className="ml-3 underline" onClick={() => copy(generated)}>कपी</button></div>}
    <p className="text-xs text-slate-500">गोपनीयता: उत्पादन तपाईंको ब्राउजरमै हुन्छ; कुनै सर्भरमा पठाइँदैन।</p>
  </section>;

  if (slug === "color-picker-palette") return <section className="space-y-4"><h2 className="text-xl font-black">रङ छान्ने तथा प्यालेट</h2><label className="block"><span className={label}>रङ छान्नुहोस्</span><input className="h-16 w-full rounded-xl border p-2" type="color" value={source || "#0d9488"} onChange={(e) => setSource(e.target.value)} /></label><div className={panel}>HEX: {source || "#0d9488"}<br/>RGB: {source ? source.match(/[\da-f]{2}/gi)?.map((v) => parseInt(v,16)).join(", ") : "13, 148, 136"}</div><button className="underline" onClick={() => copy(source || "#0d9488")}>HEX कपी गर्नुहोस्</button></section>;

  if (slug === "meta-title-checker" || slug === "meta-description-checker") return <section className="space-y-4"><h2 className="text-xl font-black">{slug === "meta-title-checker" ? "Meta Title जाँच" : "Meta Description जाँच"}</h2><textarea className={input + " min-h-28"} value={source} onChange={(e) => setSource(e.target.value)} placeholder="पृष्ठको meta text लेख्नुहोस्..." /><div className={panel}>{result.text}</div><p className="text-xs text-slate-500">यो अक्षर-आधारित सुझाव मात्र हो, Google मा देखिने snippet को ग्यारेन्टी होइन।</p></section>;

  if (slug === "regex-tester") return <section className="space-y-4"><h2 className="text-xl font-black">Regex Tester</h2><label className="block"><span className={label}>Regular expression</span><input className={input + " font-mono"} value={secondary} onChange={(e) => setSecondary(e.target.value)} placeholder="\\d+" /></label><label className="block"><span className={label}>Flags</span><input className={input} value={flags} onChange={(e) => setFlags(e.target.value)} /></label><label className="block"><span className={label}>जाँच गर्ने पाठ</span><textarea className={input + " min-h-28"} value={source} onChange={(e) => setSource(e.target.value)} /></label><div role="status" className={panel}>{result.error || result.text || "Regex र पाठ लेख्नुहोस्।"}</div></section>;

  if (slug === "jwt-decoder") return <section className="space-y-4"><h2 className="text-xl font-black">JWT Decoder</h2><textarea className={input + " min-h-28 font-mono"} value={source} onChange={(e) => setSource(e.target.value)} placeholder="eyJhbGciOi..." /><div role="alert" className={panel}>{result.error || result.text || "JWT token राख्नुहोस्।"}</div><p className="text-xs text-red-700">सावधानी: यहाँ token को signature verify हुँदैन। संवेदनशील वा वास्तविक production token सार्वजनिक/अविश्वसनीय उपकरणमा नराख्नुहोस्।</p></section>;

  if (slug === "css-minifier") return <section className="space-y-4"><h2 className="text-xl font-black">CSS Minifier</h2><textarea className={input + " min-h-40 font-mono"} value={source} onChange={(e) => setSource(e.target.value)} placeholder="/* CSS */ .box { color: teal; }" /><div className={panel}><pre className="whitespace-pre-wrap break-all">{result.text}</pre></div><button className="underline" onClick={() => copy(result.text)}>Minified CSS कपी गर्नुहोस्</button></section>;

  if (slug === "keyword-density-checker") return <section className="space-y-4"><h2 className="text-xl font-black">Keyword Density Checker</h2><input className={input} value={secondary} onChange={(e) => setSecondary(e.target.value)} placeholder="जाँच्ने keyword" /><textarea className={input + " min-h-40"} value={source} onChange={(e) => setSource(e.target.value)} placeholder="आफ्नो लेख वा सामग्री यहाँ राख्नुहोस्..." /><div className={panel}>{result.text}</div><p className="text-xs text-slate-500">Keyword density ranking लक्ष्य होइन; स्वाभाविक, उपयोगी सामग्रीलाई प्राथमिकता दिनुहोस्।</p></section>;

  if (slug === "color-contrast-checker") return <section className="space-y-4"><h2 className="text-xl font-black">रङ Contrast जाँच</h2><div className="grid gap-3 sm:grid-cols-2"><label><span className={label}>Foreground HEX</span><input className={input} value={source} onChange={(e) => setSource(e.target.value)} placeholder="#111827" /></label><label><span className={label}>Background HEX</span><input className={input} value={secondary} onChange={(e) => setSecondary(e.target.value)} placeholder="#ffffff" /></label></div><div className={panel}>{result.error || result.text || "दुवै HEX रङ प्रविष्ट गर्नुहोस्।"}</div></section>;

  if (slug === "robots-txt-generator") return <section className="space-y-4"><h2 className="text-xl font-black">robots.txt Generator</h2><label><span className={label}>Sitemap URL (ऐच्छिक)</span><input className={input} value={secondary} onChange={(e) => setSecondary(e.target.value)} placeholder="https://example.com/sitemap.xml" /></label>
      <label><span className={label}>Disallow paths (प्रत्येक लाइनमा एउटा)</span><textarea className={input + " min-h-24 font-mono"} value={third} onChange={(e) => setThird(e.target.value)} placeholder="/admin/\n/private/" /></label><pre className={panel}>{result.text}</pre><button className="underline" onClick={() => copy(result.text)}>robots.txt कपी गर्नुहोस्</button><p className="text-xs text-slate-500">यसलाई deploy गर्नुअघि आफ्नो वास्तविक private routes र crawler policy जाँच्नुहोस्।</p></section>;

  if (slug === "sitemap-generator") return <section className="space-y-4"><h2 className="text-xl font-black">XML Sitemap Generator</h2><label><span className={label}>प्रत्येक लाइनमा एउटा canonical URL</span><textarea className={input + " min-h-40 font-mono"} value={source} onChange={(e) => setSource(e.target.value)} placeholder="https://example.com/\nhttps://example.com/about" /></label><div className={panel}>{result.error || <pre className="whitespace-pre-wrap break-all">{result.text || "URL राख्नुहोस्।"}</pre>}</div>{result.text && <button className="underline" onClick={() => copy(result.text)}>XML कपी गर्नुहोस्</button>}<p className="text-xs text-slate-500">केवल canonical, indexable र 200-status URL समावेश गर्नुहोस्।</p></section>;

  if (slug === "open-graph-preview") return <section className="space-y-4"><h2 className="text-xl font-black">Open Graph Preview</h2><label><span className={label}>og:title</span><input className={input} value={source} onChange={(e) => setSource(e.target.value)} placeholder="पृष्ठ शीर्षक" /></label><label><span className={label}>og:description</span><textarea className={input} value={secondary} onChange={(e) => setSecondary(e.target.value)} /></label><label><span className={label}>og:image URL</span><input className={input} value={third} onChange={(e) => setThird(e.target.value)} placeholder="https://example.com/image.jpg" /></label><div className="overflow-hidden rounded-2xl border border-slate-200"><div className="aspect-[1.91/1] bg-slate-100">{third && <img src={third} alt="Open Graph preview" className="h-full w-full object-cover" onError={() => setError("तस्बिर URL लोड भएन।")} />}</div><div className="p-4"><p className="text-xs uppercase text-slate-500">WEBSITE PREVIEW</p><h3 className="font-bold">{source || "पृष्ठ शीर्षक"}</h3><p className="text-sm text-slate-600">{secondary || "पृष्ठको संक्षिप्त विवरण यहाँ देखिन्छ।"}</p>{error && <p role="alert" className="text-xs text-red-700">{error}</p>}</div></div></section>;

  return null;
}
