#!/usr/bin/env node
/**
 * scripts/a11y-and-screens.mjs
 *
 * One-off local verification script (not part of the npm "ci" pipeline):
 *   1. Runs axe-core against every built route via astro preview.
 *   2. Screenshots the OLD legacy-site/index.html (opened directly as a
 *      file:// URL) and the NEW astro-preview home/series pages at the same
 *      viewport, for the PR's before/after visual-diff section.
 *
 * Requires `astro preview` NOT already running on PORT (this script starts
 * its own preview instance and kills it on exit) and the pre-installed
 * Playwright Chromium at /opt/pw-browsers.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";

const PORT = 4322;
const BASE = `http://localhost:${PORT}`;
const ROUTES = ["/", "/series", "/collaborate", "/privacy", "/terms", "/accessibility", "/404"];
const OUT_DIR = new URL("../docs/screenshots/", import.meta.url).pathname;
mkdirSync(OUT_DIR, { recursive: true });

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(url, tries = 30) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // not up yet
    }
    await wait(500);
  }
  throw new Error(`Server at ${url} did not come up in time`);
}

const preview = spawn("npx", ["astro", "preview", "--port", String(PORT)], {
  cwd: new URL("..", import.meta.url).pathname,
  stdio: "ignore",
  env: { ...process.env },
});

let exitCode = 0;

try {
  await waitForServer(`${BASE}/`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  console.log("\n=== axe-core accessibility scan (NEW Astro build) ===");
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 15000 });
    const results = await new AxeBuilder({ page }).analyze();
    const label = route === "/" ? "/ (home)" : route;
    console.log(`\n--- ${label} ---`);
    console.log(`violations: ${results.violations.length}`);
    if (results.violations.length) {
      exitCode = 1;
      for (const v of results.violations) {
        console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
        for (const n of v.nodes) {
          console.log(`      target: ${n.target.join(" ")}`);
          console.log(`      html: ${n.html.slice(0, 200)}`);
          if (n.any?.length) console.log(`      summary: ${n.any[0].message}`);
        }
      }
    }
  }

  console.log("\n=== Screenshots ===");
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const mobile = await mobileCtx.newPage();
  const desktop = await desktopCtx.newPage();

  for (const [name, route] of [
    ["home", "/"],
    ["series", "/series"],
    ["collaborate", "/collaborate"],
  ]) {
    await desktop.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 15000 });
    await desktop.screenshot({ path: `${OUT_DIR}new-${name}-desktop.png`, fullPage: true });
    await mobile.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 15000 });
    await mobile.screenshot({ path: `${OUT_DIR}new-${name}-mobile.png`, fullPage: true });
    console.log(`captured new-${name}-desktop.png / new-${name}-mobile.png`);
  }

  // Old static HTML, opened directly as a file:// URL (no server needed).
  const legacyRoot = new URL("../legacy-site/", import.meta.url).pathname;
  for (const [name, file] of [
    ["home", "index.html"],
    ["media-index", "media-index.html"],
  ]) {
    await desktop.goto(`file://${legacyRoot}${file}`, { waitUntil: "load", timeout: 15000 });
    await desktop.screenshot({ path: `${OUT_DIR}old-${name}-desktop.png`, fullPage: true });
    await mobile.goto(`file://${legacyRoot}${file}`, { waitUntil: "load", timeout: 15000 });
    await mobile.screenshot({ path: `${OUT_DIR}old-${name}-mobile.png`, fullPage: true });
    console.log(`captured old-${name}-desktop.png / old-${name}-mobile.png`);
  }

  await browser.close();
} finally {
  preview.kill();
}

process.exit(exitCode);
