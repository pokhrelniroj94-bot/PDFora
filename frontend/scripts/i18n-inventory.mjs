// Static inventory of routes, tools, categories and blog posts for the i18n rollout.
// Read-only: parses source files with regexes, needs no dependencies and no build.
// Usage: node scripts/i18n-inventory.mjs > ../docs/i18n/inventory.json
import fs from "node:fs";
import path from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

// 1. Routes: every app/**/page.tsx and route.ts
const routes = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(rel);
    else if (/^(page|route)\.(tsx|ts)$/.test(entry.name)) {
      const url = "/" + dir.replace(/^app\/?/, "");
      routes.push({ url: url === "/" ? "/" : url.replace(/\/$/, ""), file: rel, kind: entry.name.startsWith("page") ? "page" : "api" });
    }
  }
};
walk("app");

// 2. Tool catalog
const catalogSrc = read("components/toolCatalog.ts");
const tools = [...catalogSrc.matchAll(/\{slug:"([^"]+)",name:"([^"]*)",category:"([^"]*)"/g)].map((m) => ({ slug: m[1], name: m[2], category: m[3] }));
const categories = {};
for (const t of tools) categories[t.category] = (categories[t.category] || 0) + 1;

// 3. Legacy (root-level) PDF slugs
const legacy = [...read("lib/legacy-tool-slugs.ts").matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);

// 4. Blog posts (hand-written files only; tool-guides.ts generates more at runtime)
const slugsIn = (p) => [...read(p).matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
const blog = { "lib/blog-posts.ts": slugsIn("lib/blog-posts.ts"), "lib/nepal-blog-posts.ts": slugsIn("lib/nepal-blog-posts.ts"), "lib/tool-guides.ts": slugsIn("lib/tool-guides.ts") };

console.log(JSON.stringify({
  generatedFrom: "static source parse (no build)",
  counts: {
    pageRoutes: routes.filter((r) => r.kind === "page").length,
    apiRoutes: routes.filter((r) => r.kind === "api").length,
    catalogEntries: tools.length,
    categories: Object.keys(categories).length,
    legacyRootPdfSlugs: legacy.length,
    blogSlugLiterals: Object.fromEntries(Object.entries(blog).map(([k, v]) => [k, v.length])),
  },
  categories, routes, tools, legacy, blog,
}, null, 2));
