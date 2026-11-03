import { NextResponse } from "next/server";
import https from "node:https";
import tls from "node:tls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30;

const BACKEND_URL = (process.env.PDFORA_BACKEND_URL || "https://pdfora-493r.onrender.com").replace(/\/$/, "");
const NRB_URL = "https://www.nrb.org.np/api/forex/v1/rates";

// These are public CA certificates, not the NRB leaf/server certificate.
// Source: Sectigo's published DV R36 chain, cross-signed to USERTrust RSA.
const SECTIGO_DV_R36 = "-----BEGIN CERTIFICATE-----\nMIIGTDCCBDSgAwIBAgIQOXpmzCdWNi4NqofKbqvjsTANBgkqhkiG9w0BAQwFADBf\nMQswCQYDVQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTYwNAYDVQQD\nEy1TZWN0aWdvIFB1YmxpYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gUm9vdCBSNDYw\nHhcNMjEwMzIyMDAwMDAwWhcNMzYwMzIxMjM1OTU5WjBgMQswCQYDVQQGEwJHQjEY\nMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTcwNQYDVQQDEy5TZWN0aWdvIFB1Ymxp\nYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gQ0EgRFYgUjM2MIIBojANBgkqhkiG9w0B\nAQEFAAOCAY8AMIIBigKCAYEAljZf2HIz7+SPUPQCQObZYcrxLTHYdf1ZtMRe7Yeq\nRPSwygz16qJ9cAWtWNTcuICc++p8Dct7zNGxCpqmEtqifO7NvuB5dEVexXn9RFFH\n12Hm+NtPRQgXIFjx6MSJcNWuVO3XGE57L1mHlcQYj+g4hny90aFh2SCZCDEVkAja\nEMMfYPKuCjHuuF+bzHFb/9gV8P9+ekcHENF2nR1efGWSKwnfG5RawlkaQDpRtZTm\nM64TIsv/r7cyFO4nSjs1jLdXYdz5q3a4L0NoabZfbdxVb+CUEHfB0bpulZQtH1Rv\n38e/lIdP7OTTIlZh6OYL6NhxP8So0/sht/4J9mqIGxRFc0/pC8suja+wcIUna0HB\npXKfXTKpzgis+zmXDL06ASJf5E4A2/m+Hp6b84sfPAwQ766rI65mh50S0Di9E3Pn\n2WcaJc+PILsBmYpgtmgWTR9eV9otfKRUBfzHUHcVgarub/XluEpRlTtZudU5xbFN\nxx/DgMrXLUAPaI60fZ6wA+PTAgMBAAGjggGBMIIBfTAfBgNVHSMEGDAWgBRWc1hk\nlfmSGrASKgRieaFAFYghSTAdBgNVHQ4EFgQUaMASFhgOr872h6YyV6NGUV3LBycw\nDgYDVR0PAQH/BAQDAgGGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0lBBYwFAYI\nKwYBBQUHAwEGCCsGAQUFBwMCMBsGA1UdIAQUMBIwBgYEVR0gADAIBgZngQwBAgEw\nVAYDVR0fBE0wSzBJoEegRYZDaHR0cDovL2NybC5zZWN0aWdvLmNvbS9TZWN0aWdv\nUHVibGljU2VydmVyQXV0aGVudGljYXRpb25Sb290UjQ2LmNybDCBhAYIKwYBBQUH\nAQEEeDB2ME8GCCsGAQUFBzAChkNodHRwOi8vY3J0LnNlY3RpZ28uY29tL1NlY3Rp\nZ29QdWJsaWNTZXJ2ZXJBdXRoZW50aWNhdGlvblJvb3RSNDYucDdjMCMGCCsGAQUF\nBzABhhdodHRwOi8vb2NzcC5zZWN0aWdvLmNvbTANBgkqhkiG9w0BAQwFAAOCAgEA\nYtOC9Fy+TqECFw40IospI92kLGgoSZGPOSQXMBqmsGWZUQ7rux7cj1du6d9rD6C8\nze1B2eQjkrGkIL/OF1s7vSmgYVafsRoZd/IHUrkoQvX8FZwUsmPu7amgBfaY3g+d\nq1x0jNGKb6I6Bzdl6LgMD9qxp+3i7GQOnd9J8LFSietY6Z4jUBzVoOoz8iAU84OF\nh2HhAuiPw1ai0VnY38RTI+8kepGWVfGxfBWzwH9uIjeooIeaosVFvE8cmYUB4TSH\n5dUyD0jHct2+8ceKEtIoFU/FfHq/mDaVnvcDCZXtIgitdMFQdMZaVehmObyhRdDD\n4NQCs0gaI9AAgFj4L9QtkARzhQLNyRf87Kln+YU0lgCGr9HLg3rGO8q+Y4ppLsOd\nunQZ6ZxPNGIfOApbPVf5hCe58EZwiWdHIMn9lPP6+F404y8NNugbQixBber+x536\nWrZhFZLjEkhp7fFXf9r32rNPfb74X/U90Bdy4lzp3+X1ukh1BuMxA/EEhDoTOS3l\n7ABvc7BYSQubQ2490OcdkIzUh3ZwDrakMVrbaTxUM2p24N6dB+ns2zptWCva6jzW\nr8IWKIMxzxLPv5Kt3ePKcUdvkBU/smqujSczTzzSjIoR5QqQA6lN1ZRSnuHIWCvh\nJEltkYnTAH41QJ6SAWO66GrrUESwN/cgZzL4JLEqz1Y=\n-----END CERTIFICATE-----";

const nrbAgent = new https.Agent({
  ca: [...tls.rootCertificates, SECTIGO_DV_R36],
  rejectUnauthorized: true,
  keepAlive: true,
});

type NormalizedRate = { code: string; name: string; unit: number; buy: number; sell: number };

function positiveNumber(value: unknown, field: string): number {
  const parsed = typeof value === "number" ? value : Number(String(value ?? "").trim());
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`NRB returned an invalid ${field} value.`);
  return parsed;
}

function normalizeRates(items: unknown): NormalizedRate[] {
  if (!Array.isArray(items)) throw new Error("NRB rates field is not an array.");
  const rates = items.map((item: any) => {
    const currency = item?.currency ?? {};
    const code = String(currency.iso3 ?? currency.ISO3 ?? item?.code ?? "").trim().toUpperCase();
    const name = String(currency.name ?? item?.name ?? "").trim();
    if (!/^[A-Z]{3}$/.test(code) || !name) throw new Error("NRB returned invalid currency metadata.");
    return {
      code,
      name,
      unit: positiveNumber(currency.unit ?? item?.unit ?? 1, "currency unit"),
      buy: positiveNumber(item?.buy, "buy rate"),
      sell: positiveNumber(item?.sell, "sell rate"),
    };
  });
  if (!rates.length) throw new Error("NRB returned an empty rates list.");
  if (new Set(rates.map((rate) => rate.code)).size !== rates.length) {
    throw new Error("NRB returned duplicate currency codes.");
  }
  return rates;
}

function nrbRequest(url: URL): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      agent: nrbAgent,
      headers: { Accept: "application/json", "User-Agent": "PDFora/1.0 (+https://pd-fora.vercel.app)" },
    }, (res) => {
      const status = res.statusCode ?? 0;
      if (status < 200 || status >= 300) {
        res.resume();
        reject(new Error(`NRB API returned HTTP ${status}.`));
        return;
      }
      const chunks: Buffer[] = [];
      let bytes = 0;
      res.on("data", (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > 2 * 1024 * 1024) {
          req.destroy(new Error("NRB response exceeded 2 MB."));
          return;
        }
        chunks.push(chunk);
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
        } catch {
          reject(new Error("NRB returned invalid JSON."));
        }
      });
      res.on("error", reject);
    });
    req.setTimeout(10_000, () => req.destroy(new Error("NRB request timed out.")));
    req.on("error", reject);
  });
}

function normalizeNrbPayload(payload: any, requestedDate: string) {
  if (payload?.status?.code != null && Number(payload.status.code) !== 200) {
    throw new Error(`NRB API body status ${payload.status.code}.`);
  }
  const records = payload?.data?.payload;
  if (!Array.isArray(records)) throw new Error("NRB returned no published snapshots.");
  const valid = records.filter((record: any) =>
    /^\d{4}-\d{2}-\d{2}$/.test(String(record?.date ?? "")) && Array.isArray(record?.rates)
  );
  const latest = [...valid].sort((a: any, b: any) => b.date.localeCompare(a.date))[0];
  if (!latest) throw new Error("No published NRB rate was found for the requested date range.");
  return {
    source: "Nepal Rastra Bank",
    requestedDate,
    rateDate: latest.date,
    publishedOn: latest.published_on ?? null,
    updatedAt: new Date().toISOString(),
    rates: normalizeRates(latest.rates),
  };
}

function normalizeBackendPayload(payload: any, requestedDate: string) {
  const rates = normalizeRates(payload?.rates);
  const rateDate = String(payload?.rateDate ?? payload?.date ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rateDate)) {
    throw new Error("Forex backend returned an invalid rate date.");
  }
  return {
    source: String(payload?.source ?? "Nepal Rastra Bank"),
    requestedDate: String(payload?.requestedDate ?? requestedDate),
    rateDate,
    publishedOn: payload?.publishedOn ?? payload?.published_on ?? null,
    updatedAt: payload?.updatedAt ?? new Date().toISOString(),
    rates,
    ...(payload?.isStale === true ? { isStale: true, notice: "Showing the latest cached official rates; the upstream feed is temporarily unavailable." } : {}),
  };
}


function decodeHtml(value: string) {
  return value.replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function extractNnswDate(html: string): string | null {
  const inputDates = [...html.matchAll(/<input\b[^>]*?(?:name|id)=["'][^"']*(?:date|validity)[^"']*["'][^>]*>/gi)]
    .map((match) => match[0]);
  for (const input of inputDates) {
    const value = input.match(/value=["'](\d{4}-\d{2}-\d{2})["']/i)?.[1];
    if (value) return value;
  }
  const candidates = [...html.matchAll(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/g)];
  for (const match of candidates) {
    const [, y, m, d] = match;
    const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    if (date.getUTCFullYear() === Number(y) && date.getUTCMonth() + 1 === Number(m) && date.getUTCDate() === Number(d)) {
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
  }
  return null;
}

function parseNnswHtml(html: string, requestedDate: string) {
  if (!/Rastra Bank Exchange Rate/i.test(html)) throw new Error("NNSW page did not contain the Rastra Bank rate table.");
  const rateDate = extractNnswDate(html);
  if (!rateDate) throw new Error("NNSW did not expose a verifiable rate-validity date.");
  if (rateDate > requestedDate) throw new Error("NNSW returned a rate newer than the requested date.");
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) =>
    [...match[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      .map((cell) => decodeHtml(cell[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()))
  );
  const rates: NormalizedRate[] = [];
  for (const cells of rows) {
    if (cells.length < 6 || !/^[A-Z]{3}$/.test(cells[1].toUpperCase())) continue;
    const [code, name, buyRaw, sellRaw, unitRaw] = [cells[1].toUpperCase(), cells[2], cells[3], cells[4], cells[5]];
    const buy = Number(buyRaw.replace(/,/g, ""));
    const sell = Number(sellRaw.replace(/,/g, ""));
    const unit = Number(unitRaw.replace(/,/g, ""));
    if (!name || !Number.isFinite(buy) || buy <= 0 || !Number.isFinite(sell) || sell <= 0 ||
        !Number.isFinite(unit) || unit <= 0) continue;
    rates.push({ code, name, buy, sell, unit });
  }
  if (rates.length < 5 || new Set(rates.map((rate) => rate.code)).size !== rates.length) {
    throw new Error("NNSW rate table was incomplete or malformed.");
  }
  return {
    source: "Nepal National Single Window (NRB exchange-rate table)",
    requestedDate,
    rateDate,
    publishedOn: null,
    updatedAt: new Date().toISOString(),
    rates,
  };
}

async function fetchNnswRates(requestedDate: string) {
  const url = new URL("https://nnsw.gov.np/trade/customs/rates/search");
  url.searchParams.set("lang", "en");
  const response = await fetch(url, {
    headers: { Accept: "text/html", "User-Agent": "PDFora/1.0 (+https://pd-fora.vercel.app)" },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`NNSW returned HTTP ${response.status}.`);
  const html = await response.text();
  if (html.length > 3 * 1024 * 1024) throw new Error("NNSW page exceeded 3 MB.");
  return parseNnswHtml(html, requestedDate);
}

function nepalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const requestedDate = incoming.searchParams.get("date") || nepalDate();
  const parsedDate = new Date(`${requestedDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ||
      Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== requestedDate) {
    return NextResponse.json({ error: "Invalid date. Use YYYY-MM-DD." }, { status: 400 });
  }

  const [year, month, day] = requestedDate.split("-").map(Number);
  const fromDate = new Date(Date.UTC(year, month - 1, day));
  fromDate.setUTCDate(fromDate.getUTCDate() - 21);
  const from = fromDate.toISOString().slice(0, 10);
  const target = new URL(NRB_URL);
  target.search = new URLSearchParams({ from, to: requestedDate, per_page: "100", page: "1" }).toString();

  try {
    const raw = await nrbRequest(target);
    const data = normalizeNrbPayload(raw, requestedDate);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", "X-Forex-Source": "NRB" },
    });
  } catch (nrbError) {
    console.warn("[nepal-forex] Direct NRB API failed; trying NNSW's published NRB rate table:", nrbError);
  }

  try {
    const data = await fetchNnswRates(requestedDate);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", "X-Forex-Source": "NNSW" },
    });
  } catch (nnswError) {
    console.warn("[nepal-forex] NNSW fallback failed; trying Render cache:", nnswError);
  }

  try {
    const target = new URL("/api/nepal-forex", BACKEND_URL);
    target.searchParams.set("date", requestedDate);
    const response = await fetch(target, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Forex backend returned HTTP ${response.status}.`);
    const data = normalizeBackendPayload(await response.json(), requestedDate);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", "X-Forex-Source": "Render mirror" },
    });
  } catch (backendError) {
    console.error("[nepal-forex] NRB API, NNSW fallback and backend cache all failed:", backendError);
    return NextResponse.json(
      { error: "Official NRB exchange rates are temporarily unavailable. Please retry shortly." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
