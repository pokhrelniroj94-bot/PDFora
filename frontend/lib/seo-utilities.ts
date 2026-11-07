export interface MetaLengthReport {
  characters: number;
  guidance: string;
  preview: string;
}

function countCharacters(value: string): number {
  return Array.from(value).length;
}

export function analyzeMetaTitle(input: string): MetaLengthReport {
  const preview = input.trim();
  const characters = countCharacters(preview);
  return {
    characters,
    guidance: characters >= 30 && characters <= 60
      ? "Within a common 30–60 character review range; Google may display a different title."
      : "Review the title for clarity and usefulness. Character count is not a Google ranking rule.",
    preview,
  };
}

export function analyzeMetaDescription(input: string): MetaLengthReport {
  const preview = input.trim();
  const characters = countCharacters(preview);
  return {
    characters,
    guidance: characters >= 120 && characters <= 160
      ? "Within a practical 120–160 character review range; Google may generate a different snippet."
      : "Review the description for clarity and usefulness. There is no fixed Google character limit.",
    preview,
  };
}

function tokenize(input: string): string[] {
  return input.normalize("NFC").toLocaleLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
}

export function calculateKeywordDensity(text: string, keyword: string) {
  const words = tokenize(text);
  const target = tokenize(keyword);
  if (target.length === 0) throw new Error("Enter a target keyword.");
  if (words.length === 0) return { wordCount: 0, occurrences: 0, density: 0 };
  let occurrences = 0;
  for (let i = 0; i <= words.length - target.length; i += 1) {
    if (target.every((word, offset) => words[i + offset] === word)) occurrences += 1;
  }
  return { wordCount: words.length, occurrences, density: occurrences / words.length * 100 };
}

function safeHttpUrl(value: string, label: string): string {
  const trimmed = value.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(label + " must be an absolute HTTP or HTTPS URL.");
  }
  if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) {
    throw new Error(label + " must be an absolute HTTP or HTTPS URL without credentials.");
  }
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) throw new Error(label + " contains invalid control characters.");
  return parsed.toString();
}

export function generateRobotsTxt(disallowPath: string, sitemapUrl: string): string {
  const path = disallowPath.trim();
  const sitemap = sitemapUrl.trim();
  if (/[\r\n\u0000]/.test(path)) throw new Error("Disallow path cannot contain line breaks.");
  if (path && (!path.startsWith("/") || path.startsWith("//"))) {
    throw new Error("Disallow path must start with a single slash.");
  }
  if (/[\r\n\u0000]/.test(sitemap)) throw new Error("Sitemap URL cannot contain line breaks.");
  const lines = ["User-agent: *", "Allow: /"];
  if (path) lines.push("Disallow: " + path);
  if (sitemap) lines.push("Sitemap: " + safeHttpUrl(sitemap, "Sitemap URL"));
  return lines.join("\n");
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function generateSitemapXml(input: string): string {
  const rawUrls = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (rawUrls.length === 0) throw new Error("Enter at least one URL.");
  const urls = [...new Set(rawUrls.map((value) => {
    if (/[\u0000-\u001f\u007f]/.test(value)) throw new Error("URLs cannot contain control characters.");
    const normalized = safeHttpUrl(value, "Every sitemap URL");
    const parsed = new URL(normalized);
    if (parsed.hash) throw new Error("Sitemap URLs must not contain fragments.");
    return normalized;
  }))];
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((url) => "  <url><loc>" + escapeXml(url) + "</loc></url>").join("\n") +
    "\n</urlset>";
}

function escapeHtmlAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function buildOpenGraphPreview(input: { title: string; description: string; imageUrl: string; pageUrl: string }): string {
  const title = input.title.trim();
  const description = input.description.trim();
  const imageUrl = input.imageUrl.trim() ? safeHttpUrl(input.imageUrl, "Image URL") : "";
  const pageUrl = input.pageUrl.trim() ? safeHttpUrl(input.pageUrl, "Page URL") : "";
  const tags = [
    ["og:title", title],
    ["og:description", description],
    ["og:image", imageUrl],
    ["og:url", pageUrl],
  ] as const;
  return "og:title: " + title + "\nog:description: " + description +
    "\nog:image: " + imageUrl + "\nog:url: " + pageUrl + "\n\n" +
    tags.map(([property, content]) => '<meta property="' + property + '" content="' + escapeHtmlAttribute(content) + '">').join("\n");
}
