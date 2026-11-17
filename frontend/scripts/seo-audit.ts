#!/usr/bin/env npx tsx
/**
 * Static Next.js App Router SEO inventory audit.
 * Run from frontend/: npx tsx scripts/seo-audit.ts
 * Strict mode: npx tsx scripts/seo-audit.ts --strict
 *
 * Static source checks cannot prove rendered metadata or translation quality.
 * Follow with a production crawl and native-speaker review.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP = path.join(ROOT, "app");
const LIB = path.join(ROOT, "lib");
const OUT = path.join(ROOT, "seo-audit-report.json");
const STRICT = process.argv.includes("--strict");

const NEPALI_CANDIDATES = [
  "Enter amount", "Enter value", "Enter date", "Select an option",
  "Choose file", "Upload file", "Download", "Calculate", "Reset",
  "Clear all", "Copy result", "Invalid input", "Please try again",
  "Something went wrong", "No results found", "Loading...", "Submit",
  "Enter text", "Search", "Next", "Previous",
];

type Issue = { severity: "error" | "warning" | "review"; file: string; message: string };
type RouteRecord = { route: string; pageFile: string; metadataOwner?: string; metadataScope: "route" | "root-fallback" | "missing"; dynamic: boolean };

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function read(file: string): string {
  return fs.readFileSync(file, "utf8");
}

function routeFromPage(file: string): string {
  const relative = path.relative(APP, path.dirname(file)).split(path.sep)
    .filter((part) => part && !(part.startsWith("(") && part.endsWith(")")));
  return relative.length ? "/" + relative.join("/") : "/";
}

function metadataIn(source: string): boolean {
  return /export\s+(?:const\s+metadata\s*:|async\s+function\s+generateMetadata|function\s+generateMetadata)/.test(source);
}

function nearestMetadataOwner(pageFile: string): { file?: string; scope: "route" | "root-fallback" | "missing" } {
  let dir = path.dirname(pageFile);
  while (dir.startsWith(APP)) {
    for (const name of ["page.tsx", "page.ts", "layout.tsx", "layout.ts"]) {
      const candidate = path.join(dir, name);
      if (fs.existsSync(candidate) && metadataIn(read(candidate))) return { file: path.relative(ROOT, candidate), scope: dir === APP ? "root-fallback" : "route" };
    }
    if (dir === APP) break;
    dir = path.dirname(dir);
  }
  return undefined;
}

function extractStaticValues(source: string, key: "title" | "description"): string[] {
  const pattern = key === "title"
    ? /title\s*:\s*["'\`]([^"'\`]{3,240})["'\`]/g
    : /description\s*:\s*["'\`]([^"'\`]{10,500})["'\`]/g;
  return [...source.matchAll(pattern)].map((match) => match[1].replace(/\s+/g, " ").trim());
}

function main() {
  if (!fs.existsSync(APP)) throw new Error("Run this script from the frontend directory containing app/.");

  const issues: Issue[] = [];
  const pages = walk(APP).filter((file) => /^page\.(tsx|ts|jsx|js)$/.test(path.basename(file)));
  const routes: RouteRecord[] = pages.map((pageFile) => ({
    route: routeFromPage(pageFile),
    pageFile: path.relative(ROOT, pageFile),
    metadataOwner: nearestMetadataOwner(pageFile),
    dynamic: routeFromPage(pageFile).includes("["),
  }));

  for (const route of routes) {
    if (!route.metadataOwner) {
      issues.push({ severity: "error", file: route.pageFile, message: "No metadata export/generator found in page/layout ancestry." });
    }
  }

  const sourceFiles = [...walk(APP), ...walk(LIB)].filter((file) => /\.(tsx|ts|jsx|js)$/.test(file));
  const titleOwners = new Map<string, string[]>();

  for (const file of sourceFiles) {
    const source = read(file);
    const relative = path.relative(ROOT, file);

    for (const title of extractStaticValues(source, "title")) {
      const key = title.toLocaleLowerCase();
      titleOwners.set(key, [...(titleOwners.get(key) ?? []), relative]);
      if (title.length > 65) {
        issues.push({ severity: "warning", file: relative, message: "Static title exceeds 65 characters (" + title.length + "): " + title });
      }
    }

    for (const description of extractStaticValues(source, "description")) {
      if (description.length < 60) {
        issues.push({ severity: "warning", file: relative, message: "Static description is under 60 characters (" + description.length + "); assess usefulness rather than padding." });
      }
      if (description.length > 160) {
        issues.push({ severity: "warning", file: relative, message: "Static description exceeds 160 characters (" + description.length + ")." });
      }
    }

    if (/(nepali|localized)/i.test(relative)) {
      for (const phrase of NEPALI_CANDIDATES) {
        if (source.toLocaleLowerCase().includes(phrase.toLocaleLowerCase())) {
          issues.push({ severity: "review", file: relative, message: 'Possible untranslated UI candidate: "' + phrase + '". Inspect the actual user-facing context.' });
        }
      }
    }
  }

  for (const [title, owners] of titleOwners) {
    const unique = [...new Set(owners)];
    if (unique.length > 1) {
      issues.push({ severity: "warning", file: unique.join(", "), message: 'Duplicate static title candidate: "' + title + '"' });
    }
  }

  const routingFile = path.join(LIB, "i18n", "routing.ts");
  if (fs.existsSync(routingFile)) {
    const routing = read(routingFile);
    if (!routing.includes('map["x-default"]')) {
      issues.push({ severity: "error", file: path.relative(ROOT, routingFile), message: "Shared hreflang generator does not visibly add x-default." });
    }
    if (!routing.includes("hasIndexableLocalizedPage")) {
      issues.push({ severity: "error", file: path.relative(ROOT, routingFile), message: "hreflang is not visibly gated by localized indexability." });
    }
  }

  const sitemapFile = path.join(APP, "sitemap.ts");
  if (!fs.existsSync(sitemapFile)) {
    issues.push({ severity: "error", file: "app/sitemap.ts", message: "Next.js sitemap route is missing." });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    routeCount: routes.length,
    dynamicRouteCount: routes.filter((route) => route.dynamic).length,
    routesWithoutMetadataOwner: routes.filter((route) => !route.metadataOwner).map((route) => route.route),
    issueCounts: {
      errors: issues.filter((issue) => issue.severity === "error").length,
      warnings: issues.filter((issue) => issue.severity === "warning").length,
      translationReviewCandidates: issues.filter((issue) => issue.severity === "review").length,
    },
    routes,
    issues,
    limitations: [
      "Dynamic metadata values are not evaluated by this static source scanner.",
      "Duplicate static strings may be intentional shared metadata; inspect each occurrence.",
      "English technical terms in Nepali source are candidates for human review, not automatic translation failures.",
      "Rendered canonical, robots and hreflang tags require a production HTTP crawl.",
      "Translation correctness requires native-speaker review.",
    ],
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log("PDFora source SEO audit: " + routes.length + " App Router pages; " + issues.length + " findings.");
  console.log(JSON.stringify(report.issueCounts, null, 2));
  console.log("Report: " + OUT);

  if (STRICT && issues.some((issue) => issue.severity === "error")) process.exitCode = 1;
}

main();
