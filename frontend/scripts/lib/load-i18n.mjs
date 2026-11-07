// Loads the pure i18n modules (lib/i18n/*.ts) for Node scripts without a build step.
// Copies them to a temp dir, adds ".ts" to relative imports, and imports them through Node's
// built-in TypeScript type stripping (Node 22.6+; enabled by default from 22.18).
// messages.ts is skipped: it uses bundler-only JSON imports and is exercised by `next build`.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const frontendRoot = fileURLToPath(new URL("../../", import.meta.url));

/** Re-runs the calling script with --experimental-strip-types when this Node needs the flag. */
export function ensureTypeStripping() {
  if (process.features.typescript) return;
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 6)) {
    console.error(`Node ${process.versions.node} cannot run TypeScript directly. Use Node 22.6 or newer.`);
    process.exit(2);
  }
  const result = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", ...process.argv.slice(1)], { stdio: "inherit" });
  process.exit(result.status ?? 1);
}

/**
 * Copies the listed frontend-relative .ts files into a temp tree (same relative layout),
 * adds ".ts" to extensionless relative imports, and imports them via Node type stripping.
 * Returns { [basename without extension]: module }.
 */
async function loadTsFiles(relFiles) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pdfora-ts-"));
  fs.writeFileSync(path.join(tmp, "package.json"), '{"type":"module"}');
  for (const rel of relFiles) {
    const target = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const code = fs.readFileSync(path.join(frontendRoot, rel), "utf8").replace(/from\s+"(\.{1,2}\/[^"]+?)"/g, (m, spec) => (/\.(ts|tsx|json|mjs|js)$/.test(spec) ? m : `from "${spec}.ts"`));
    fs.writeFileSync(target, code);
  }
  const out = {};
  for (const rel of relFiles) out[path.basename(rel).replace(/\.ts$/, "")] = await import(pathToFileURL(path.join(tmp, rel)).href);
  return out;
}

/** Pure i18n modules. messages.ts and client.ts are skipped (bundler JSON imports / React hooks). */
export async function loadI18n() {
  const dir = path.join(frontendRoot, "lib", "i18n");
  const skip = new Set(["messages.ts", "client.ts", "shell.ts"]);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && !skip.has(f)).map((f) => `lib/i18n/${f}`);
  // pdf-tool-seo.ts imports the shared guide catalog; copy it into the same temp tree
  // so extension-rewritten relative imports resolve during the i18n test run.
  files.push("lib/tool-guides.ts", "lib/nepali-localized-blog-posts.ts", "lib/tools/localized-verification.ts", "components/toolCatalog.ts", "lib/tool-directory.ts");
  return loadTsFiles(files);
}

/** Tool adapter, localized-route resolver and metadata, with the real catalog and legacy slugs. */
export async function loadToolAdapter() {
  return loadTsFiles([
    "lib/i18n/config.ts",
    "lib/i18n/routing.ts",
    "lib/i18n/nepali-tool-routes.ts",
    "lib/i18n/nepali-pdf-routes.ts",
    "lib/nepali-localized-blog-posts.ts",
    "lib/i18n/metadata.ts",
    "components/toolCatalog.ts",
    "lib/legacy-tool-slugs.ts",
    "lib/tools/adapter.ts",
    "lib/tools/localized-verification.ts",
    "lib/tools/localized-route.ts",
    "lib/tools/localized-metadata.ts",
  ]);
}
