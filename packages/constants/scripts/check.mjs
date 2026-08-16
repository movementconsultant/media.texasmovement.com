#!/usr/bin/env node
/**
 * check.mjs — the guard rail. Zero dependencies. Runs anywhere Node runs.
 *
 *   node scripts/check.mjs            report only
 *   node scripts/check.mjs --strict   exit 1 on any error (use in CI)
 *
 * It catches the three ways this package rots:
 *   1. Unfilled TBD values shipping to production.
 *   2. Apps hard-coding a domain instead of importing from here.
 *   3. Structural mistakes (dupe keys, http://, trailing slashes).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const STRICT = process.argv.includes("--strict");
const HERE = new URL("..", import.meta.url).pathname;
const SRC = join(HERE, "src");
// Walk up to the repo root (packages/constants -> packages -> root)
const REPO = join(HERE, "..", "..");

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const readSrc = (f) => readFileSync(join(SRC, f), "utf8");

/* ---------- 1. TBD inventory ---------------------------------------- */
const tbdReport = [];
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".ts"))) {
  const lines = readSrc(file).split("\n");
  lines.forEach((line, i) => {
    const isNoise =
      /^\s*(\*|\/\/)/.test(line) ||
      /import\s*\{/.test(line) ||
      /export (type|const) /.test(line) ||
      /[!=]==\s*TBD/.test(line);
    if (/\bTBD\b/.test(line) && !isNoise) {
      tbdReport.push(`${file}:${i + 1}  ${line.trim()}`);
    }
  });
}

/* ---------- 2. Structural checks on the registry --------------------- */
const eco = readSrc("ecosystem.ts");

const keys = [...eco.matchAll(/^\s{4}key:\s*"([a-z]+)"/gm)].map((m) => m[1]);
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dupes.length) err(`Duplicate property keys: ${[...new Set(dupes)].join(", ")}`);

const blocks = eco.split(/\n\s{2}[a-z]+:\s*\{/).slice(1);
blocks.forEach((b) => {
  const name = b.match(/key:\s*"([a-z]+)"/)?.[1] ?? "unknown";
  const ctas = (b.match(/primaryCta:/g) || []).length;
  if (ctas !== 1) err(`Property "${name}" has ${ctas} primaryCta entries. Must be exactly 1.`);
});

for (const m of eco.matchAll(/url:\s*[`"]([^`"]+)[`"]/g)) {
  const u = m[1];
  if (u.includes("${")) continue;
  if (u.startsWith("http://")) err(`Insecure URL in registry: ${u}`);
  if (u.endsWith("/")) err(`Trailing slash in registry URL: ${u}`);
}

/* ---------- 3. Drift: hard-coded domains outside this package -------- */
const DOMAIN_RE = /(texasmovement\.com|alexandermathai\.com)/;
const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", ".astro", ".turbo", "build",
  ".wrangler", "coverage", ".vercel", ".next",
]);
const SCAN_EXT = [".ts", ".tsx", ".js", ".jsx", ".astro", ".svelte", ".vue", ".html"];
const CONSTANTS_DIR = join("packages", "constants");

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    if (SKIP_DIRS.has(e)) continue;
    const p = join(dir, e);
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) walk(p, out);
    else if (SCAN_EXT.some((x) => e.endsWith(x))) out.push(p);
  }
  return out;
}

let scanned = 0;
for (const file of walk(REPO)) {
  const rel = relative(REPO, file);
  if (rel.startsWith(CONSTANTS_DIR + sep) || rel.startsWith(CONSTANTS_DIR + "/")) continue;
  scanned++;
  const text = readFileSync(file, "utf8");
  text.split("\n").forEach((line, i) => {
    if (DOMAIN_RE.test(line) && !line.trimStart().startsWith("//") && !line.trimStart().startsWith("*")) {
      warn(`${rel}:${i + 1} hard-codes a domain — import it from @tmi/constants instead`);
    }
  });
}

/* ---------- report --------------------------------------------------- */
const line = "-".repeat(64);
console.log(`\n@tmi/constants check\n${line}`);
console.log(`properties: ${keys.length}   files scanned for drift: ${scanned}`);

console.log(`\nUnconfirmed values (TBD): ${tbdReport.length}`);
tbdReport.forEach((t) => console.log(`  ~ ${t}`));

console.log(`\nDrift warnings: ${warnings.length}`);
warnings.slice(0, 40).forEach((w) => console.log(`  ! ${w}`));
if (warnings.length > 40) console.log(`  ... and ${warnings.length - 40} more`);

console.log(`\nErrors: ${errors.length}`);
errors.forEach((e) => console.log(`  X ${e}`));
console.log(line);

if (errors.length && STRICT) {
  console.log("FAILED (strict mode)\n");
  process.exit(1);
}
console.log(errors.length ? "FAILED — fix errors above\n" : "PASS\n");
if (errors.length) process.exit(1);
