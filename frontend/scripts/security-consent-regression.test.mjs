import fs from "node:fs";
import assert from "node:assert/strict";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const config = read("../next.config.ts");
const consentHook = read("../app/components/useAdvertisingConsent.ts");
const popunder = read("../app/components/BlogPopunder.tsx");
const skyscraper = read("../app/components/AdsterraSkyscraper.tsx");
const banner = read("../app/components/Adsterra160x600.tsx");
const native = read("../app/components/AdsterraNative.tsx");
const cookieConsent = read("../components/CookieConsent.tsx");

const checks = [
  ["CSP has a self-only default", /default-src 'self'/.test(config)],
  ["CSP blocks plugin objects", /object-src 'none'/.test(config)],
  ["CSP blocks framing", /frame-ancestors 'none'/.test(config)],
  ["CSP restricts form destinations", /form-action 'self'/.test(config)],
  ["CSP does not enable unsafe-eval", (() => { const policy = config.match(/"Content-Security-Policy"[\s\S]*?value:\s*\[([\s\S]*?)\]\.join\("; "\)/)?.[1] ?? ""; return !/unsafe-eval/.test(policy); })()],
  ["CSP permits PDF worker blobs", /worker-src 'self' blob:/.test(config)],
  ["CSP permits PDF worker child contexts", /child-src 'self' blob:/.test(config)],
  ["CSP uses an explicit script host list", /script-src 'self' 'unsafe-inline'[^"]*https:\/\/www\.googletagmanager\.com/.test(config)],
  ["CSP does not allow runtime CDN script hosts (Nepali typing is bundled locally)", !/script-src[^"]*(unpkg\.com|cdn\.jsdelivr\.net)/.test(config)],
  ["CSP no longer permits retired popunder host", !/https:\/\/abscloud\.org/.test(config)],
  ["shared consent defaults to denied", /useState\(false\)/.test(consentHook)],
  ["shared consent requires explicit advertising true", /advertising === true/.test(consentHook)],
  ["blog popunder is fully disabled", /return null/.test(popunder) && !/next\/script|abscloud\.org/.test(popunder)],
  ["skyscraper uses shared consent before loading", /useAdvertisingConsent/.test(skyscraper) && /!allowed/.test(skyscraper)],
  ["160x600 banner uses shared consent before loading", /useAdvertisingConsent/.test(banner) && /if \(!allowed\) return null/.test(banner)],
  ["native ad requires advertising consent", /advertising === true/.test(native)],
  ["global ad script is consent-gated", /preferences\?\.advertising/.test(cookieConsent)],
  ["revoking ad consent reloads the document", /revokingAdvertising[\s\S]*window\.location\.reload\(\)/.test(cookieConsent)],
];

for (const [name, passed] of checks) {
  assert.equal(passed, true, name);
}
console.log(`Security and ad-consent regression checks passed: ${checks.length}/${checks.length}`);
