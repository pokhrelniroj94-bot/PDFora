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

export async function loadI18n() {
  const src = path.join(frontendRoot, "lib", "i18n");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pdfora-i18n-"));
  fs.writeFileSync(path.join(tmp, "package.json"), '{"type":"module"}');
  for (const file of fs.readdirSync(src)) {
    if (!file.endsWith(".ts") || file === "messages.ts") continue;
    const code = fs.readFileSync(path.join(src, file), "utf8").replace(/from\s+"(\.\/[^".]+)"/g, 'from "$1.ts"');
    fs.writeFileSync(path.join(tmp, file), code);
  }
  const mods = {};
  for (const name of ["config", "routing", "translate", "format", "preference", "switcher", "metadata"]) {
    mods[name] = await import(pathToFileURL(path.join(tmp, `${name}.ts`)).href);
  }
  return mods;
}
