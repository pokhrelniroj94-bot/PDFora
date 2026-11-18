import { spawnSync } from "node:child_process";

const advisory = "GHSA-fc5q-39xc-vjpf";
const allowedDependencyChain = new Set([
  "picomatch",
  "@rollup/pluginutils",
  "fdir",
  "@rollup/plugin-commonjs",
]);

const command = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(command, ["audit", "--omit=dev", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});

let report;
try {
  report = JSON.parse(result.stdout || "");
} catch {
  process.stderr.write(result.stderr || result.stdout || "npm audit returned invalid JSON.\n");
  process.exit(result.status || 1);
}

if (result.error || report.error || (!report.metadata && !report.vulnerabilities)) {\n  console.error(report.error?.summary || result.stderr || "npm audit could not complete.");\n  process.exit(1);\n}\n\nconst findings = Object.entries(report.vulnerabilities || {});
const unexpected = findings.filter(([name, finding]) => {
  if (!allowedDependencyChain.has(name)) return true;
  const via = Array.isArray(finding.via) ? finding.via : [];
  if (name === "picomatch") {
    return !via.some((item) =>
      item &&
      typeof item === "object" &&
      (item.url || "").includes(advisory)
    );
  }
  return via.length === 0 || via.some((item) =>
    typeof item !== "string" || !allowedDependencyChain.has(item)
  );
});

if (unexpected.length > 0 || (result.status !== 0 && findings.length === 0)) {
  console.error("Production dependency audit found unapproved vulnerabilities:");
  for (const [name, finding] of unexpected) {
    console.error(`- ${name}: ${finding.severity}; via ${JSON.stringify(finding.via)}`);
  }
  process.exit(1);
}

if (findings.length > 0) {
  console.warn(
    `Security exception: ${advisory} remains unresolved upstream (no patched picomatch release published). ` +
    "Only the Sentry Rollup build-tool dependency chain is allowlisted; all other production findings still fail this check."
  );
} else {
  console.log("Production dependency audit passed with no advisories.");
}
