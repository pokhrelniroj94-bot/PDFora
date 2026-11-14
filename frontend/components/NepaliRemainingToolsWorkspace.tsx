"use client";

import { useMemo, useState } from "react";

const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const panel = "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800";
const copy = (value: string) => void navigator.clipboard?.writeText(value);

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

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

  const result = useMemo(() => {
    try {
      if (slug === "regex-tester") {
        if (!source) return { text: "", error: "" };
        const regex = new RegExp(secondary, flags.replace(/[^dgimsuvy]/g, ""));
        const matches = [...source.matchAll(regex)];
        return { text: matches.length ? matches.map((m, i) => `${i + 1}. ${m[0]} (index: ${m.index})`).join("\n") : "कुनै मिल्दो अंश भेटिएन।", error: "" };
      }
      if (slug === "jwt-decoder") {
        const parts = source.trim().split(".");
        if (parts.length !== 3) throw new Error("JWT मा header, payload र signature गरी तीन भाग हुनुपर्छ।");
        return { text: JSON.stringify({ header: JSON.parse(base64UrlDecode(parts[0])), payload: JSON.parse(base64UrlDecode(parts[1])), note: "Signature यहाँ verify गरिएको छैन।" }, null, 2), error: "" };
      }
      if (slug === "css-minifier") {
        const minified = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
        return { text: minified, error: "" };
      }
      if (slug === "keyword-density-checker") {
        const words = source.toLocaleLowerCase().match(/[\p{L}\p{N}_-]+/gu) ?? [];
        const needle = secondary.trim().toLocaleLowerCase();
        if (!needle) return { text: `कुल शब्द: ${words.length}\nविश्लेषणका लागि keyword लेख्नुहोस्।`, error: "" };
        const count = words.filter((word) => word === needle).length;
        return { text: `कुल शब्द: ${words.length}\nKeyword: ${needle}\nआवृत्ति: ${count}\nघनत्व: ${words.length ? (count / words.length * 100).toFixed(2) : "0.00"}%\nयो साधारण exact-match अनुमान हो।`, error: "" };
      }
      if (slug === "meta-title-checker") return { text: `अक्षर संख्या: ${source.length}\nसुझाव: ३०–६० अक्षरको दायरालाई प्रारम्भिक guideline मान्नुहोस्। वास्तविक SERP प्रदर्शन फरक हुन सक्छ।`, error: "" };
      if (slug === "meta-description-checker") return { text: `अक्षर संख्या: ${source.length}\nसुझाव: करिब १२०–१६० अक्षरमा स्पष्ट, पृष्ठसँग मेल खाने विवरण लेख्नुहोस्। Google ले snippet फरक देखाउन सक्छ।`, error: "" };
      if (slug === "color-contrast-checker") {
        const parse = (hex: string) => {
          const clean = hex.trim().replace(/^#/, "");
          if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(clean)) throw new Error("रङ #RGB वा #RRGGBB ढाँचामा लेख्नुहोस्।");
          const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
          const rgb = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
          return rgb.map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
        };
        const a = parse(source), b = parse(secondary);
        const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
        return { text: `Contrast ratio: ${ratio.toFixed(2)}:1\nWCAG AA सामान्य text: ${ratio >= 4.5 ? "PASS" : "FAIL"}\nWCAG AA ठूलो text: ${ratio >= 3 ? "PASS" : "FAIL"}\nWCAG AAA सामान्य text: ${ratio >= 7 ? "PASS" : "FAIL"}`, error: "" };
      }
      if (slug === "open-graph-preview") {
        return { text: "", error: "" };
      }
      if (slug === "robots-txt-generator") {
        const sitemap = secondary.trim();
        return { text: `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\n${sitemap ? `Sitemap: ${sitemap}\n` : ""}`, error: "" };
      }
      if (slug === "sitemap-generator") {
        const urls = source.split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
        const invalid = urls.filter((url) => { try { return !["http:", "https:"].includes(new URL(url).protocol); } catch { return true; } });
        if (invalid.length) throw new Error(`अमान्य URL: ${invalid[0]}`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</loc></url>`).join("\n")}\n</urlset>`;
        return { text: xml, error: "" };
      }
      return { text: "", error: "" };
    } catch (cause) {
      return { text: "", error: cause instanceof Error ? cause.message : "इनपुट जाँच गर्नुहोस्।" };
    }
  }, [slug, source, secondary, flags]);

  const generatePassword = () => {
    const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ" + (includeNumbers ? "23456789" : "") + (includeSymbols ? "!@#$%&*+-_?" : "");
    const size = Math.max(8, Math.min(128, Number(length) || 20));
    const random = new Uint32Array(size);
    crypto.getRandomValues(random);
    setGenerated(Array.from(random, (n) => alphabet[n % alphabet.length]).join(""));
  };
  const generateUuid = () => setGenerated(crypto.randomUUID());

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

  if (slug === "robots-txt-generator") return <section className="space-y-4"><h2 className="text-xl font-black">robots.txt Generator</h2><label><span className={label}>Sitemap URL (ऐच्छिक)</span><input className={input} value={secondary} onChange={(e) => setSecondary(e.target.value)} placeholder="https://example.com/sitemap.xml" /></label><pre className={panel}>{result.text}</pre><button className="underline" onClick={() => copy(result.text)}>robots.txt कपी गर्नुहोस्</button><p className="text-xs text-slate-500">यसलाई deploy गर्नुअघि आफ्नो वास्तविक private routes र crawler policy जाँच्नुहोस्।</p></section>;

  if (slug === "sitemap-generator") return <section className="space-y-4"><h2 className="text-xl font-black">XML Sitemap Generator</h2><label><span className={label}>प्रत्येक लाइनमा एउटा canonical URL</span><textarea className={input + " min-h-40 font-mono"} value={source} onChange={(e) => setSource(e.target.value)} placeholder="https://example.com/\nhttps://example.com/about" /></label><div className={panel}>{result.error || <pre className="whitespace-pre-wrap break-all">{result.text || "URL राख्नुहोस्।"}</pre>}</div>{result.text && <button className="underline" onClick={() => copy(result.text)}>XML कपी गर्नुहोस्</button>}<p className="text-xs text-slate-500">केवल canonical, indexable र 200-status URL समावेश गर्नुहोस्।</p></section>;

  if (slug === "open-graph-preview") return <section className="space-y-4"><h2 className="text-xl font-black">Open Graph Preview</h2><label><span className={label}>og:title</span><input className={input} value={source} onChange={(e) => setSource(e.target.value)} placeholder="पृष्ठ शीर्षक" /></label><label><span className={label}>og:description</span><textarea className={input} value={secondary} onChange={(e) => setSecondary(e.target.value)} /></label><label><span className={label}>og:image URL</span><input className={input} value={third} onChange={(e) => setThird(e.target.value)} placeholder="https://example.com/image.jpg" /></label><div className="overflow-hidden rounded-2xl border border-slate-200"><div className="aspect-[1.91/1] bg-slate-100">{third && <img src={third} alt="Open Graph preview" className="h-full w-full object-cover" onError={() => setError("तस्बिर URL लोड भएन।")} />}</div><div className="p-4"><p className="text-xs uppercase text-slate-500">WEBSITE PREVIEW</p><h3 className="font-bold">{source || "पृष्ठ शीर्षक"}</h3><p className="text-sm text-slate-600">{secondary || "पृष्ठको संक्षिप्त विवरण यहाँ देखिन्छ।"}</p>{error && <p role="alert" className="text-xs text-red-700">{error}</p>}</div></div></section>;

  return null;
}
