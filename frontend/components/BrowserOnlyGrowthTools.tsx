"use client";

import React, { useMemo, useState, type ReactNode } from "react";
type ToolLocale = "en" | "ne";
const neText: Record<string,string> = {"Full name":"पूरा नाम","Job title":"पद","Company":"कम्पनी","Email address":"इमेल ठेगाना","Phone (optional)":"फोन (ऐच्छिक)","Website (https:// URL)":"वेबसाइट (https:// URL)","Accent colour":"मुख्य रङ","Live preview":"प्रत्यक्ष पूर्वावलोकन","Copy HTML":"HTML प्रतिलिपि गर्नुहोस्","Download HTML":"HTML डाउनलोड गर्नुहोस्","Your name":"तपाईंको नाम","Clipboard access is unavailable. Select and copy the output manually.":"क्लिपबोर्ड उपलब्ध छैन। आउटपुट छानेर आफैँ प्रतिलिपि गर्नुहोस्।","Copied to clipboard.":"क्लिपबोर्डमा प्रतिलिपि भयो।","Copy was blocked by the browser. Select the output and copy it manually.":"ब्राउजरले प्रतिलिपि गर्न दिएन। आउटपुट छानेर आफैँ प्रतिलिपि गर्नुहोस्।","Your details are used only in this page to create the signature. Nothing is uploaded. Paste the HTML into your email app's signature editor and send a test email; some email clients remove unsupported styles.":"तपाईंका विवरण यही पृष्ठमा हस्ताक्षर बनाउन मात्र प्रयोग हुन्छन्; कुनै फाइल सर्भरमा पठाइँदैन। HTML आफ्नो इमेल एपको हस्ताक्षर सेटिङमा राखेर परीक्षण इमेल पठाउनुहोस्। केही इमेल एपले समर्थन नभएका शैली हटाउन सक्छन्।","Meeting date":"बैठकको मिति","Local meeting time":"स्थानीय बैठक समय","Time zone for entered time":"दिइएको समयको समय क्षेत्र","Compare time zones":"समय क्षेत्र तुलना","Select up to 8 cities":"८ वटासम्म सहर छान्नुहोस्","Choose a meeting date and time to compare local times.":"स्थानीय समय तुलना गर्न बैठकको मिति र समय छान्नुहोस्।","This local time may not exist because of a daylight-saving clock change.":"डेलाइट सेभिङ समय परिवर्तनका कारण यो स्थानीय समय अस्तित्वमा नहुन सक्छ।","That local time is invalid or falls inside a daylight-saving clock change. Choose another time.":"यो स्थानीय समय अमान्य छ वा डेलाइट सेभिङ परिवर्तनको अवधिमा पर्छ। अर्को समय छान्नुहोस्।","Uses the time-zone database built into your browser. No account, API or server request is required. During the autumn clock change, a local time can occur twice; verify the intended offset for important meetings.":"यो ब्राउजरमै उपलब्ध समय क्षेत्र डाटाबेस प्रयोग गर्छ। खाता, API वा सर्भर अनुरोध आवश्यक छैन। घडी पछाडि सारिने बेला एउटै स्थानीय समय दुईपटक आउन सक्छ; महत्त्वपूर्ण बैठकअघि समय अन्तर पुष्टि गर्नुहोस्।","Image width (pixels)":"तस्बिरको चौडाइ (पिक्सेल)","Image height (pixels)":"तस्बिरको उचाइ (पिक्सेल)","Printed width":"प्रिन्ट चौडाइ","Printed height":"प्रिन्ट उचाइ","Print measurement unit":"प्रिन्ट नाप्ने एकाइ","Inches":"इन्च","Centimetres":"सेन्टिमिटर","Millimetres":"मिलिमिटर","Target print resolution (PPI)":"लक्षित प्रिन्ट रिजोल्युसन (PPI)","72 PPI — screen / draft":"७२ PPI — स्क्रिन / प्रारम्भिक","150 PPI — basic print":"१५० PPI — सामान्य प्रिन्ट","300 PPI — common high-quality print":"३०० PPI — राम्रो गुणस्तरको प्रिन्ट","600 PPI — detailed print":"६०० PPI — उच्च विवरणको प्रिन्ट","Effective horizontal resolution":"प्रभावकारी तेर्सो रिजोल्युसन","Effective vertical resolution":"प्रभावकारी ठाडो रिजोल्युसन","Pixels needed at":"आवश्यक पिक्सेल","Your current image is":"तपाईंको हालको तस्बिर","at or above":"बराबर वा बढी","below":"भन्दा कम","the selected target on its lower-resolution dimension.":"कम रिजोल्युसन भएको दिशामा चयन गरिएको लक्ष्य।","Enter positive pixel dimensions, print sizes and a target resolution.":"पिक्सेल आकार, प्रिन्ट नाप र लक्षित रिजोल्युसन शून्यभन्दा ठूलो राख्नुहोस्।","PPI describes image pixels per printed inch. DPI technically describes printer dot placement; many print services use DPI informally when they mean image PPI. This calculator does not resample or upload your image.":"PPI ले प्रिन्टको प्रति इन्चमा तस्बिरका पिक्सेल जनाउँछ। प्राविधिक रूपमा DPI ले प्रिन्टरका डट जनाउँछ। धेरै सेवाले PPI कै अर्थमा DPI भन्छन्। यो क्याल्कुलेटरले तस्बिर परिवर्तन वा अपलोड गर्दैन।","Video duration (minutes)":"भिडियो अवधि (मिनेट)","Additional seconds":"थप सेकेन्ड","Target file size (MB, decimal)":"लक्षित फाइल आकार (MB, दशमलव)","Audio bitrate (kbps)":"अडियो बिटरेट (kbps)","Container / overhead allowance (%)":"कन्टेनर / अतिरिक्त स्थान (%)","Estimated total bitrate":"अनुमानित कुल बिटरेट","Suggested video bitrate":"सुझाव गरिएको भिडियो बिटरेट","Estimated size at these bitrates":"यी बिटरेटमा अनुमानित आकार","The target file size is too small for the selected audio bitrate and overhead. Increase the size or lower the audio bitrate.":"चयन गरिएको अडियो बिटरेट र अतिरिक्त स्थानका लागि लक्षित फाइल आकार सानो छ। आकार बढाउनुहोस् वा अडियो बिटरेट घटाउनुहोस्।","Enter a positive duration and file size, a non-negative audio bitrate, and overhead from 0% to under 50%.":"अवधि र फाइल आकार शून्यभन्दा ठूलो, अडियो बिटरेट शून्य वा बढी, र अतिरिक्त स्थान ०% देखि ५०% भन्दा कम राख्नुहोस्।","This is a planning estimate using average bitrate. Variable-bitrate encoding, codec efficiency, frame rate, scene complexity, subtitles and container metadata can change the actual file size.":"यो औसत बिटरेटमा आधारित योजना अनुमान हो। Variable bitrate, codec, frame rate, दृश्यको जटिलता, subtitle र metadata ले वास्तविक फाइल आकार फरक पार्न सक्छ।","Paste tab-separated data (first row becomes the header)":"Tab ले छुट्याएको डाटा राख्नुहोस् (पहिलो पङ्क्ति शीर्षक हुन्छ)","Markdown output":"Markdown नतिजा","Enter at least one row.":"कम्तीमा एउटा पङ्क्ति राख्नुहोस्।","Copy Markdown":"Markdown प्रतिलिपि गर्नुहोस्","Download .md":".md डाउनलोड गर्नुहोस्","Reset example":"उदाहरण पुनःस्थापित गर्नुहोस्","Use tabs between columns and new lines between rows. The first row is treated as the header. All conversion happens locally in your browser.":"स्तम्भ छुट्याउन Tab र पङ्क्ति छुट्याउन नयाँ लाइन प्रयोग गर्नुहोस्। पहिलो पङ्क्ति शीर्षक मानिन्छ। सबै रूपान्तरण ब्राउजरमै हुन्छ।","Communication tool":"सञ्चारसम्बन्धी टुल","Create a professional email signature":"व्यावसायिक इमेल हस्ताक्षर बनाउनुहोस्","Build a clean, copy-ready HTML email signature with your name, role, company and contact details.":"आफ्नो नाम, पद, कम्पनी र सम्पर्क विवरण राखेर प्रयोग गर्न मिल्ने HTML इमेल हस्ताक्षर तयार गर्नुहोस्।","Time planning tool":"समय योजना टुल","Compare meeting times across time zones":"विभिन्न समय क्षेत्रका बैठक समय तुलना गर्नुहोस्","Choose a date, local time and source time zone, then compare the meeting time in other cities.":"मिति, स्थानीय समय र आधार समय क्षेत्र छानेर अन्य सहरको बैठक समय तुलना गर्नुहोस्।","Image and print tool":"तस्बिर तथा प्रिन्ट टुल","Calculate image DPI and print resolution":"तस्बिरको DPI र प्रिन्ट रिजोल्युसन गणना गर्नुहोस्","Find the effective pixels per inch for a print size and calculate the pixel dimensions needed for a target resolution.":"प्रिन्ट आकारअनुसार प्रति इन्च पिक्सेल (PPI) निकाल्नुहोस् र चाहिएको रिजोल्युसनका लागि आवश्यक पिक्सेल आकार गणना गर्नुहोस्।","Video planning tool":"भिडियो योजना टुल","Calculate video bitrate and file size":"भिडियो बिटरेट र फाइल आकार गणना गर्नुहोस्","Estimate a video bitrate from its duration and target file size, including an audio bitrate and container overhead allowance.":"अवधि, लक्षित फाइल आकार, अडियो बिटरेट र कन्टेनरको अतिरिक्त स्थानका आधारमा भिडियो बिटरेट अनुमान गर्नुहोस्।","Writing and developer tool":"लेखन तथा डेभलपर टुल","Convert tab-separated text into a Markdown table":"Tab ले छुट्याएको पाठलाई Markdown तालिकामा बदल्नुहोस्","Turn rows and columns into a Markdown table that you can paste into README files, documentation and notes.":"पङ्क्ति र स्तम्भलाई README, कागजात वा नोटमा राख्न मिल्ने Markdown तालिकामा बदल्नुहोस्।","Free · No sign-up · Browser-based · No API":"निःशुल्क · दर्ता आवश्यक छैन · ब्राउजरमै चल्ने · API आवश्यक छैन","Privacy: inputs are processed on this device and are not sent to PDFora servers by this tool. No API key, external service or account is required. Keep sensitive information out of shared devices and clear any downloaded files when finished.":"गोपनीयता: यस टुलले इनपुट यही उपकरणमा प्रशोधन गर्छ र PDFora सर्भरमा पठाउँदैन। API key, बाह्य सेवा वा खाता आवश्यक छैन। साझा उपकरणमा संवेदनशील विवरण नराख्नुहोस् र कामपछि डाउनलोड गरिएका फाइल हटाउनुहोस्।","← All tools":"← सबै टुल","New York":"न्युयोर्क","Los Angeles":"लस एन्जलस","Chicago":"शिकागो","London":"लन्डन","Berlin":"बर्लिन","Dubai":"दुबई","Kathmandu":"काठमाडौं","New Delhi":"नयाँ दिल्ली","Singapore":"सिङ्गापुर","Tokyo":"टोकियो","Sydney":"सिड्नी","Auckland":"अकल्यान्ड"};
function trText(value: string, locale: ToolLocale) { return locale === "ne" ? (neText[value] ?? value) : value; }
function trTree(node: ReactNode, locale: ToolLocale): ReactNode {
 if (typeof node === "string") return trText(node,locale);
 if (Array.isArray(node)) return node.map(child=>trTree(child,locale));
 if (!node || typeof node !== "object" || !("props" in node)) return node;
 const element=node as React.ReactElement<Record<string,unknown>>;
 const props:Record<string,unknown>={...element.props};
 if(typeof props.label==="string") props.label=trText(props.label,locale);
 for(const key of ["aria-label","title","placeholder"]) if(typeof props[key]==="string") props[key]=trText(props[key] as string,locale);
 if(props.children!==undefined) props.children=trTree(props.children as ReactNode,locale);
 return React.cloneElement(element,props);
}


type ToolSlug = "email-signature-generator" | "timezone-meeting-planner" | "image-dpi-calculator" | "video-bitrate-calculator" | "markdown-table-generator";

const inputClass = "min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";
const panelClass = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6";
const buttonClass = "min-h-11 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2";
const secondaryClass = "min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block min-w-0"><span className={labelClass}>{label}</span>{children}</label>;
}
function copyText(value: string, setMessage: (message: string) => void) {
  if (!navigator.clipboard?.writeText) { setMessage("Clipboard access is unavailable. Select and copy the output manually."); return; }
  navigator.clipboard.writeText(value).then(() => setMessage("Copied to clipboard.")).catch(() => setMessage("Copy was blocked by the browser. Select the output and copy it manually."));
}
function saveText(filename: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}
function SignatureTool({locale="en"}:{locale?:ToolLocale}) {
  const [name, setName] = useState("Alex Morgan");
  const [role, setRole] = useState("Product Designer");
  const [company, setCompany] = useState("Company name");
  const [email, setEmail] = useState("alex@example.com");
  const [phone, setPhone] = useState("+1 555 010 2020");
  const [website, setWebsite] = useState("https://example.com");
  const [accent, setAccent] = useState("#0f766e");
  const [message, setMessage] = useState("");

  const safeWebsite = /^https?:\/\//i.test(website.trim()) ? website.trim() : "";
  const html = useMemo(() => {
    const c = accent;
    const link = (label: string, href: string) => href ? '<a href="' + escapeHtml(href) + '" style="color:' + c + ';text-decoration:none">' + escapeHtml(label) + "</a>" : "";
    return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;border-collapse:collapse"><tr><td style="border-left:4px solid ' + c + ';padding:2px 0 2px 14px"><div style="font-size:16px;font-weight:700;color:#111827">' + escapeHtml(name || "Your name") + '</div><div style="font-size:13px;color:#475569;padding-top:3px">' + escapeHtml([role, company].filter(Boolean).join(" · ")) + '</div><div style="font-size:13px;line-height:1.8;padding-top:8px">' + (email ? link(email, "mailto:" + email) : "") + (phone ? (email ? " &nbsp;|&nbsp; " : "") + escapeHtml(phone) : "") + (safeWebsite ? '<br>' + link(safeWebsite.replace(/^https?:\/\//i, ""), safeWebsite) : "") + '</div></td></tr></table>';
  }, [name, role, company, email, phone, safeWebsite, accent]);
  const ui = <div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name"><input className={inputClass} value={name} onChange={e => setName(e.target.value)} maxLength={80} /></Field>
      <Field label="Job title"><input className={inputClass} value={role} onChange={e => setRole(e.target.value)} maxLength={80} /></Field>
      <Field label="Company"><input className={inputClass} value={company} onChange={e => setCompany(e.target.value)} maxLength={80} /></Field>
      <Field label="Email address"><input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={120} /></Field>
      <Field label="Phone (optional)"><input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} maxLength={50} /></Field>
      <Field label="Website (https:// URL)"><input className={inputClass} value={website} onChange={e => setWebsite(e.target.value)} maxLength={180} /></Field>
      <Field label="Accent colour"><div className="flex h-11 items-center gap-3 rounded-xl border border-slate-300 px-3"><input aria-label="Signature accent colour" type="color" value={accent} onChange={e => setAccent(e.target.value)} className="h-8 w-10 cursor-pointer border-0 bg-transparent" /><span className="font-mono text-sm text-slate-600">{accent.toUpperCase()}</span></div></Field>
    </div>
    <div className={panelClass}><p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Live preview</p><div className="overflow-x-auto rounded-xl bg-slate-50 p-5" dangerouslySetInnerHTML={{ __html: html }} /></div>
    <div className="flex flex-wrap gap-2"><button className={buttonClass} onClick={() => copyText(html, setMessage)}>Copy HTML</button><button className={secondaryClass} onClick={() => saveText("email-signature.html", "<!doctype html><html><body>" + html + "</body></html>", "text/html;charset=utf-8")}>Download HTML</button></div>
    {message && <p role="status" className="text-sm text-teal-800">{message}</p>}
    <p className="text-xs leading-6 text-slate-500">Your details are used only in this page to create the signature. Nothing is uploaded. Paste the HTML into your email app&apos;s signature editor and send a test email; some email clients remove unsupported styles.</p>
  </div>;
  return trTree(ui,locale);
}

 = [
  ["America/New_York", "New York"], ["America/Los_Angeles", "Los Angeles"], ["America/Chicago", "Chicago"],
  ["Europe/London", "London"], ["Europe/Berlin", "Berlin"], ["Asia/Dubai", "Dubai"],
  ["Asia/Kathmandu", "Kathmandu"], ["Asia/Kolkata", "New Delhi"], ["Asia/Singapore", "Singapore"],
  ["Asia/Tokyo", "Tokyo"], ["Australia/Sydney", "Sydney"], ["Pacific/Auckland", "Auckland"]
];
function zonedLocalToDate(date: string, time: string, zone: string): Date | null {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) return null;
  const target = Date.UTC(year, month - 1, day, hour, minute);
  let guess = target;
  const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  for (let i = 0; i < 4; i++) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(guess)).map(part => [part.type, part.value]));
    const represented = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
    const delta = target - represented;
    if (delta === 0) break;
    guess += delta;
  }
  const result = new Date(guess);
  const check = Object.fromEntries(formatter.formatToParts(result).map(part => [part.type, part.value]));
  if (Number(check.year) !== year || Number(check.month) !== month || Number(check.day) !== day || Number(check.hour) !== hour || Number(check.minute) !== minute) return null;
  return result;
}
function TimezoneTool({locale="en"}:{locale?:ToolLocale}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [source, setSource] = useState("America/New_York");
  const [selected, setSelected] = useState(["America/New_York", "Europe/London", "Asia/Kathmandu", "Asia/Tokyo"]);

  const instant = useMemo(() => zonedLocalToDate(date, time, source), [date, time, source]);
  const fmt = (zone: string) => instant ? new Intl.DateTimeFormat(locale === "ne" ? "ne-NP" : undefined, { timeZone: zone, weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(instant) : "This local time may not exist because of a daylight-saving clock change.";
  const toggle = (zone: string) => setSelected(current => current.includes(zone) ? current.filter(item => item !== zone) : current.length < 8 ? [...current, zone] : current);
  return <div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-3">
      <Field label="Meeting date"><input className={inputClass} type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
      <Field label="Local meeting time"><input className={inputClass} type="time" value={time} onChange={e => setTime(e.target.value)} /></Field>
      <Field label="Time zone for entered time"><select className={inputClass} value={source} onChange={e => setSource(e.target.value)}>{zones.map(([zone, city]) => <option key={zone} value={zone}>{city} ({zone})</option>)}</select></Field>
    </div>
    <div className={panelClass}><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-slate-900">Compare time zones</h3><span className="text-xs text-slate-500">Select up to 8 cities</span></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{zones.map(([zone, city]) => <label key={zone} className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><input type="checkbox" checked={selected.includes(zone)} onChange={() => toggle(zone)} />{city}</label>)}</div></div>
    {!date ? <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Choose a meeting date and time to compare local times.</p> : instant ? <div className="grid gap-3 sm:grid-cols-2">{selected.map(zone => <div key={zone} className="rounded-xl border border-teal-100 bg-teal-50/60 p-4"><p className="text-xs font-bold uppercase tracking-wide text-teal-800">{zones.find(item => item[0] === zone)?.[1] ?? zone}</p><p className="mt-2 text-lg font-bold text-slate-950">{fmt(zone)}</p><p className="mt-1 break-all text-xs text-slate-500">{zone}</p></div>)}</div> : <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">That local time is invalid or falls inside a daylight-saving clock change. Choose another time.</p>}
    <p className="text-xs leading-6 text-slate-500">Uses the time-zone database built into your browser. No account, API or server request is required. During the autumn clock change, a local time can occur twice; verify the intended offset for important meetings.</p>
  </div>;
  return trTree(ui,locale);
}

({locale="en"}:{locale?:ToolLocale}) {
  const [width, setWidth] = useState("2400");
  const [height, setHeight] = useState("3000");
  const [printWidth, setPrintWidth] = useState("8");
  const [printHeight, setPrintHeight] = useState("10");
  const [unit, setUnit] = useState("in");
  const [target, setTarget] = useState("300");

  const w = Number(width), h = Number(height), pw = Number(printWidth), ph = Number(printHeight), dpi = Number(target);
  const factor = unit === "in" ? 1 : unit === "cm" ? 1 / 2.54 : 1 / 25.4;
  const valid = [w,h,pw,ph,dpi].every(Number.isFinite) && w > 0 && h > 0 && pw > 0 && ph > 0 && dpi > 0 && dpi <= 9600;
  const ppiX = valid ? w / (pw * factor) : 0;
  const ppiY = valid ? h / (ph * factor) : 0;
  const reqW = valid ? Math.round(pw * factor * dpi) : 0;
  const reqH = valid ? Math.round(ph * factor * dpi) : 0;
  return <div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Image width (pixels)"><input className={inputClass} type="number" min="1" value={width} onChange={e => setWidth(e.target.value)} /></Field>
      <Field label="Image height (pixels)"><input className={inputClass} type="number" min="1" value={height} onChange={e => setHeight(e.target.value)} /></Field>
      <Field label="Printed width"><input className={inputClass} type="number" min="0.01" step="any" value={printWidth} onChange={e => setPrintWidth(e.target.value)} /></Field>
      <Field label="Printed height"><input className={inputClass} type="number" min="0.01" step="any" value={printHeight} onChange={e => setPrintHeight(e.target.value)} /></Field>
      <Field label="Print measurement unit"><select className={inputClass} value={unit} onChange={e => setUnit(e.target.value)}><option value="in">Inches</option><option value="cm">Centimetres</option><option value="mm">Millimetres</option></select></Field>
      <Field label="Target print resolution (PPI)"><select className={inputClass} value={target} onChange={e => setTarget(e.target.value)}><option value="72">72 PPI — screen / draft</option><option value="150">150 PPI — basic print</option><option value="300">300 PPI — common high-quality print</option><option value="600">600 PPI — detailed print</option></select></Field>
    </div>
    {valid ? <div className="grid gap-3 sm:grid-cols-2"><div className={panelClass}><p className="text-sm text-slate-500">Effective horizontal resolution</p><p className="mt-2 text-3xl font-black text-teal-800">{ppiX.toFixed(1)} <span className="text-base">PPI</span></p></div><div className={panelClass}><p className="text-sm text-slate-500">Effective vertical resolution</p><p className="mt-2 text-3xl font-black text-teal-800">{ppiY.toFixed(1)} <span className="text-base">PPI</span></p></div><div className={panelClass + " sm:col-span-2"}><p className="font-bold text-slate-900">Pixels needed at {dpi} PPI</p><p className="mt-2 text-xl font-black text-slate-950">{reqW.toLocaleString()} × {reqH.toLocaleString()} px</p><p className="mt-1 text-sm text-slate-600">Your current image is {Math.min(ppiX, ppiY) >= dpi ? "at or above" : "below"} the selected target on its lower-resolution dimension.</p></div></div> : <p role="alert" className="text-sm text-red-700">Enter positive pixel dimensions, print sizes and a target resolution.</p>}
    <p className="text-xs leading-6 text-slate-500">PPI describes image pixels per printed inch. DPI technically describes printer dot placement; many print services use DPI informally when they mean image PPI. This calculator does not resample or upload your image.</p>
  </div>;
  return trTree(ui,locale);
}

({locale="en"}:{locale?:ToolLocale}) {
  const [minutes, setMinutes] = useState("10");
  const [seconds, setSeconds] = useState("0");
  const [size, setSize] = useState("500");
  const [audio, setAudio] = useState("192");
  const [overhead, setOverhead] = useState("5");
  const duration = Number(minutes) * 60 + Number(seconds);
  const sizeMb = Number(size), audioKbps = Number(audio), overheadPct = Number(overhead);
  const valid = [duration,sizeMb,audioKbps,overheadPct,Number(seconds)].every(Number.isFinite) && duration > 0 && sizeMb > 0 && audioKbps >= 0 && Number(seconds) >= 0 && Number(seconds) <= 59 && Number.isInteger(Number(seconds)) && overheadPct >= 0 && overheadPct < 50;
  const totalKbps = valid ? sizeMb * 8 * 1000 / duration : 0;
  const usableKbps = totalKbps * (1 - overheadPct / 100);
  const videoKbps = usableKbps - audioKbps;
  const estimateMb = valid ? (Math.max(0, videoKbps) + audioKbps) * duration / 8000 / (1 - overheadPct / 100) : 0;
  return <div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Video duration (minutes)"><input className={inputClass} type="number" min="0" value={minutes} onChange={e => setMinutes(e.target.value)} /></Field>
      <Field label="Additional seconds"><input className={inputClass} type="number" min="0" max="59" value={seconds} onChange={e => setSeconds(e.target.value)} /></Field>
      <Field label="Target file size (MB, decimal)"><input className={inputClass} type="number" min="0.01" step="any" value={size} onChange={e => setSize(e.target.value)} /></Field>
      <Field label="Audio bitrate (kbps)"><input className={inputClass} type="number" min="0" value={audio} onChange={e => setAudio(e.target.value)} /></Field>
      <Field label="Container / overhead allowance (%)"><input className={inputClass} type="number" min="0" max="49" step="0.5" value={overhead} onChange={e => setOverhead(e.target.value)} /></Field>
    </div>
    {valid && videoKbps > 0 ? <div className="grid gap-3 sm:grid-cols-2"><div className={panelClass}><p className="text-sm text-slate-500">Estimated total bitrate</p><p className="mt-2 text-3xl font-black text-teal-800">{Math.round(totalKbps).toLocaleString()} <span className="text-base">kbps</span></p></div><div className={panelClass}><p className="text-sm text-slate-500">Suggested video bitrate</p><p className="mt-2 text-3xl font-black text-teal-800">{Math.round(videoKbps).toLocaleString()} <span className="text-base">kbps</span></p></div><div className={panelClass + " sm:col-span-2"}><p className="font-bold text-slate-900">Estimated size at these bitrates</p><p className="mt-2 text-2xl font-black text-slate-950">{estimateMb.toFixed(1)} MB</p><p className="mt-1 text-sm text-slate-600">Audio: {audioKbps} kbps · Overhead allowance: {overheadPct}%</p></div></div> : <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{valid ? "The target file size is too small for the selected audio bitrate and overhead. Increase the size or lower the audio bitrate." : "Enter a positive duration and file size, a non-negative audio bitrate, and overhead from 0% to under 50%."}</p>}
    <p className="text-xs leading-6 text-slate-500">This is a planning estimate using average bitrate. Variable-bitrate encoding, codec efficiency, frame rate, scene complexity, subtitles and container metadata can change the actual file size.</p>
  </div>;
  return trTree(ui,locale);
}

({locale="en"}:{locale?:ToolLocale}) {
  const [source, setSource] = useState("Name\tRole\tLocation\nAlex\tDesigner\tLondon\nSam\tDeveloper\tKathmandu");
  const [message, setMessage] = useState("");

  const markdown = useMemo(() => {
    const rows = source.split(/\r?\n/).filter(line => line.length > 0).map(line => line.split("\t").map(cell => cell.trim().replace(/\|/g, "\\|").replace(/\r?\n/g, " ")));
    if (!rows.length) return "";
    const columns = Math.max(...rows.map(row => row.length));
    const normalized = rows.map(row => Array.from({ length: columns }, (_, index) => row[index] ?? ""));
    const header = normalized[0];
    const body = normalized.slice(1);
    return [header, header.map(() => "---"), ...body].map(row => "| " + row.join(" | ") + " |").join("\n");
  }, [source]);
  return <div className="space-y-4">
    <Field label="Paste tab-separated data (first row becomes the header)"><textarea className={inputClass + " min-h-44 font-mono text-sm"} value={source} onChange={e => setSource(e.target.value)} spellCheck={false} /></Field>
    <div className={panelClass}><div className="mb-2 flex items-center justify-between gap-2"><h3 className="font-bold text-slate-900">Markdown output</h3><span className="text-xs text-slate-500">Live preview</span></div><pre className="max-h-80 overflow-auto whitespace-pre rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{markdown || "Enter at least one row."}</pre></div>
    <div className="flex flex-wrap gap-2"><button className={buttonClass} disabled={!markdown} onClick={() => copyText(markdown, setMessage)}>Copy Markdown</button><button className={secondaryClass} disabled={!markdown} onClick={() => saveText("markdown-table.md", markdown, "text/markdown;charset=utf-8")}>Download .md</button><button className={secondaryClass} onClick={() => { setSource("Name\tRole\tLocation\nAlex\tDesigner\tLondon\nSam\tDeveloper\tKathmandu"); setMessage(""); }}>Reset example</button></div>
    {message && <p role="status" className="text-sm text-teal-800">{message}</p>}
    <p className="text-xs leading-6 text-slate-500">Use tabs between columns and new lines between rows. The first row is treated as the header. All conversion happens locally in your browser.</p>
  </div>;
  return trTree(ui,locale);
}

({ slug }: { slug: ToolSlug }) {
  const content: Record<ToolSlug, { eyebrow: string; title: string; intro: string; component: React.ReactNode }> = {
    "email-signature-generator": { eyebrow: "Communication tool", title: "Create a professional email signature", intro: "Build a clean, copy-ready HTML email signature with your name, role, company and contact details.", component: <SignatureTool locale={locale} /> },
    "timezone-meeting-planner": { eyebrow: "Time planning tool", title: "Compare meeting times across time zones", intro: "Choose a date, local time and source time zone, then compare the meeting time in other cities.", component: <TimezoneTool locale={locale} /> },
    "image-dpi-calculator": { eyebrow: "Image and print tool", title: "Calculate image DPI and print resolution", intro: "Find the effective pixels per inch for a print size and calculate the pixel dimensions needed for a target resolution.", component: <DpiTool locale={locale} /> },
    "video-bitrate-calculator": { eyebrow: "Video planning tool", title: "Calculate video bitrate and file size", intro: "Estimate a video bitrate from its duration and target file size, including an audio bitrate and container overhead allowance.", component: <VideoBitrateTool locale={locale} /> },
    "markdown-table-generator": { eyebrow: "Writing and developer tool", title: "Convert tab-separated text into a Markdown table", intro: "Turn rows and columns into a Markdown table that you can paste into README files, documentation and notes.", component: <MarkdownTableTool locale={locale} /> }
  };
  const tool = content[slug];
  return <main className="pdfora-tool-page mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
    <a href={locale === "ne" ? "/ne/tools" : "/tools"} className="text-sm font-semibold text-teal-700 hover:underline">{trText("← All tools",locale)}</a>
    <header className="mb-7 mt-5"><p className="text-xs font-black uppercase tracking-[.18em] text-teal-700">{trText(tool.eyebrow,locale)}</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{trText(tool.title,locale)}</h1><p className="mt-3 max-w-3xl leading-7 text-slate-600">{trText(tool.intro,locale)}</p><p className="mt-3 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">{trText("Free · No sign-up · Browser-based · No API",locale)}</p></header>
    <section className={panelClass}>{tool.component}</section>
    <p className="mt-5 text-xs leading-6 text-slate-500">{trText("Privacy: inputs are processed on this device and are not sent to PDFora servers by this tool. No API key, external service or account is required. Keep sensitive information out of shared devices and clear any downloaded files when finished.",locale)}</p>
  </main>;
}
