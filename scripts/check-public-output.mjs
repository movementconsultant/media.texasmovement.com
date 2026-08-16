#!/usr/bin/env node
/**
 * scripts/check-public-output.mjs
 *
 * Repo-local guard rail that runs AFTER `astro build`, against the built
 * `dist/` output. Complements the vendored `packages/constants/scripts/check.mjs`
 * (which checks the constants package source, not built HTML).
 *
 * Fails (exit 1) if, anywhere under dist/:
 *   1. The literal string "TBD" (or "__TBD__") appears in any .html, .xml,
 *      .json, or .txt file.
 *   2. Any <a href="mailto:...> or form action="..." references an address
 *      not in VERIFIED_INBOXES.
 *   3. sitemap*.xml or any <link rel="canonical"> references a property
 *      whose PROPERTIES[key].status !== "live".
 *   4. Global nav/footer markup links to a non-live property.
 *   5. A PUBLIC_PREVIEW=true build is missing the noindex robots marker.
 *
 * Usage: node scripts/check-public-output.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DIST = join(ROOT, "dist");

if (!existsSync(DIST)) {
  console.error(`check-public-output: no dist/ directory at ${DIST} — run "astro build" first.`);
  process.exit(1);
}

// These are plain-TypeScript source files. Rather than depend on a
// TS-stripping loader (Node's native TS support is version-dependent), this
// zero-dependency script extracts what it needs with small, targeted
// regexes — the same technique packages/constants/scripts/check.mjs itself
// uses to scan ecosystem.ts.
function extractVerifiedInboxes() {
  const src = readFileSync(join(ROOT, "src", "lib", "site.ts"), "utf8");
  const match = src.match(/VERIFIED_INBOXES:[^=]*=\s*\[([\s\S]*?)\];/);
  const body = match ? match[1] : "";
  return body
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .flatMap((line) => [...line.matchAll(/"([^"]+@[^"]+)"/g)].map((m) => m[1]));
}

function extractProperties() {
  const src = readFileSync(join(ROOT, "packages", "constants", "src", "ecosystem.ts"), "utf8");
  const blocks = src.split(/\n\s{2}[a-z]+:\s*\{/).slice(1);
  return blocks.map((b) => {
    const key = b.match(/key:\s*"([a-z]+)"/)?.[1] ?? "unknown";
    const status = b.match(/status:\s*"([a-z]+)"/)?.[1] ?? "unknown";
    const domainMatch = b.match(/domain:\s*(?:APEX|sub\("([a-z]+)"\)|"([a-z.]+)")/);
    let domain;
    if (domainMatch?.[1]) domain = `${domainMatch[1]}.texasmovement.com`; // sub("key")
    else if (domainMatch?.[2]) domain = domainMatch[2]; // literal "a.b.com"
    else domain = "texasmovement.com"; // APEX (tmi)
    return { key, domain, status };
  });
}

const VERIFIED_INBOXES = extractVerifiedInboxes();
const PROPERTIES = Object.fromEntries(extractProperties().map((p) => [p.key, p]));

const errors = [];
const err = (m) => errors.push(m);

const TEXT_EXT = new Set([".html", ".xml", ".json", ".txt"]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(DIST);
const textFiles = files.filter((f) => TEXT_EXT.has(extname(f)));

/* ---------- 1. TBD sentinel must never ship --------------------------- */
for (const f of textFiles) {
  const text = readFileSync(f, "utf8");
  if (text.includes("TBD") || text.includes("__TBD__")) {
    const rel = f.replace(DIST + "/", "");
    err(`${rel}: contains a literal "TBD"/"__TBD__" — unresolved fact leaked into public output.`);
  }
}

/* ---------- 2. mailto / form action must be a verified inbox ---------- */
const htmlFiles = files.filter((f) => extname(f) === ".html");
for (const f of htmlFiles) {
  const text = readFileSync(f, "utf8");
  const rel = f.replace(DIST + "/", "");

  for (const m of text.matchAll(/href="mailto:([^"?]+)/g)) {
    const addr = m[1];
    if (!VERIFIED_INBOXES.includes(addr)) {
      err(`${rel}: mailto:${addr} is not in VERIFIED_INBOXES — unverified inbox exposed in public output.`);
    }
  }
  for (const m of text.matchAll(/<form[^>]*action="mailto:([^"?]+)/g)) {
    const addr = m[1];
    if (!VERIFIED_INBOXES.includes(addr)) {
      err(`${rel}: form action mailto:${addr} is not in VERIFIED_INBOXES.`);
    }
  }
}

/* ---------- 3 & 4. only live properties in canonical/nav/sitemap ------ */
const liveDomains = new Set(
  Object.values(PROPERTIES)
    .filter((p) => p.status === "live")
    .map((p) => p.domain),
);
const allDomains = Object.values(PROPERTIES).map((p) => ({ domain: p.domain, status: p.status }));

function domainsIn(text) {
  return [...text.matchAll(/https?:\/\/([a-z0-9.-]+\.texasmovement\.com|texasmovement\.com|alexandermathai\.com)/gi)].map(
    (m) => m[1].toLowerCase(),
  );
}

for (const f of htmlFiles) {
  const text = readFileSync(f, "utf8");
  const rel = f.replace(DIST + "/", "");
  const isSitemapOrCanonical = /sitemap/i.test(rel) || text.includes('rel="canonical"');

  for (const d of domainsIn(text)) {
    const known = allDomains.find((p) => p.domain === d);
    if (known && known.status !== "live" && (isSitemapOrCanonical || /class="footer-links"|<footer|<nav/i.test(text))) {
      err(`${rel}: links to non-live property domain "${d}" (status: ${known.status}) from nav/footer/canonical/sitemap.`);
    }
  }
}

for (const f of files.filter((f) => /sitemap.*\.xml$/i.test(f))) {
  const text = readFileSync(f, "utf8");
  const rel = f.replace(DIST + "/", "");
  for (const d of domainsIn(text)) {
    if (!liveDomains.has(d)) {
      const known = allDomains.find((p) => p.domain === d);
      err(`${rel}: sitemap references non-live property domain "${d}" (status: ${known?.status ?? "unknown"}).`);
    }
  }
}

/* ---------- 5. preview builds must self-report noindex ----------------- */
const preview = process.env.PUBLIC_PREVIEW === "true";
if (preview) {
  for (const f of htmlFiles) {
    const text = readFileSync(f, "utf8");
    const rel = f.replace(DIST + "/", "");
    if (!/name="robots"\s+content="noindex/i.test(text)) {
      err(`${rel}: PUBLIC_PREVIEW=true build but missing <meta name="robots" content="noindex...">.`);
    }
  }
}

/* ---------- report ------------------------------------------------------ */
const line = "-".repeat(64);
console.log(`\ncheck-public-output\n${line}`);
console.log(`files scanned: ${files.length} (html: ${htmlFiles.length}, text: ${textFiles.length})`);
console.log(`preview mode: ${preview}`);
console.log(`\nErrors: ${errors.length}`);
errors.forEach((e) => console.log(`  X ${e}`));
console.log(line);

if (errors.length) {
  console.log("FAILED\n");
  process.exit(1);
}
console.log("PASS\n");
