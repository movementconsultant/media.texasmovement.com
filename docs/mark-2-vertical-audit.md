# media.texasmovement.com — Mark 2 release-readiness audit

Performed as part of the ecosystem-wide release sprint, applying the governance patterns
established by texasmovement.com and alexandermathai.com (verified-inbox gating, `verified`/TBD
social-link gating, honest status vocabulary).

## Repository and current branch

`movementconsultant/media.texasmovement.com`, branch `claude/texas-movement-rebuild-pq14fo`
(PR #2, open, draft, base `main`). Audited at HEAD `8759870` (`875987090dd6da03d60d9cd5157b8ee6dc0c4937`
prior to this audit's commit). Worktree was clean at audit start.

## Existing public hostname/domain

`media.texasmovement.com` — evidenced by `CNAME` (repo root and `public/CNAME`, both verbatim
`media.texasmovement.com`) and `astro.config.mjs`'s `SITE = "https://media.texasmovement.com"`.
`main` (untouched by this branch) still serves the **legacy static HTML** at this hostname via
GitHub Pages, per `CLAUDE.md`/`docs/MIGRATION_INVENTORY.md`. I could not independently confirm
current reachability of `media.texasmovement.com` from this sandbox — outbound access to that
domain is blocked by this environment's egress proxy (`EGRESS_BLOCKED` on `WebFetch`) — so I am
relying on the repo's own documentation, not a live check, for the legacy-Pages claim.

## Current build/deploy stack

Astro 5 (`output: "static"`), `@astrojs/sitemap`, vendored `@tmi/constants` control-plane package
at `packages/constants/` (`file:./packages/constants` in `package.json` — documented as
**temporary vendoring**, pending a real `@movementconsultant/constants` npm package; see
`docs/MIGRATION_INVENTORY.md`'s "Known follow-up"). `wrangler.toml` scaffolds a Cloudflare Pages
deployment (`pages_build_output_dir = "dist"`) but **no hosting is connected** — no Cloudflare
credentials are available in this or prior build sessions, and there is no evidence anywhere in
the repo (secrets, CI config, deployment logs) of an actual live Cloudflare Pages deployment for
this branch.

## CI/build/test result

All commands run for real in this session, from a clean `npm install`-free tree (`node_modules`
was already present):

```
$ npm run check:constants     # node packages/constants/scripts/check.mjs --strict
Errors: 0 — PASS
(8 known TBDs reported in org.ts/social.ts; 41 "hard-codes a domain" drift warnings, all inside
legacy-site/ reference copies or informational string matches — none block --strict, exit 0)

$ PUBLIC_PREVIEW=true npm run build
7 page(s) built, 0 build errors
postbuild check-public-output.mjs: files scanned 12 (html 7, text 8), preview mode: true, Errors: 0 — PASS
robots.txt: "User-agent: *\nDisallow: /"
index.html: <meta name="robots" content="noindex, nofollow">, canonical = https://media.texasmovement.com

$ rm -rf dist && PUBLIC_PREVIEW=false npm run build
7 page(s) built, 0 build errors
postbuild check-public-output.mjs: files scanned 14 (html 7, text 10), preview mode: false, Errors: 0 — PASS
robots.txt: "User-agent: *\nAllow: /\n\nSitemap: https://media.texasmovement.com/sitemap-index.xml"
index.html: <meta name="robots" content="index, follow, max-image-preview:large">, canonical = https://media.texasmovement.com
sitemap-0.xml: exactly 6 indexable URLs (/, /accessibility, /collaborate, /privacy, /series, /terms) — /404 correctly excluded

$ npx astro check
Result (35 files): 0 errors, 0 warnings, 0 hints

$ npx vitest run
Test Files  1 passed (1)
Tests  10 passed (10)   # src/lib/site.ts contract

$ node scripts/a11y-and-screens.mjs   # axe-core via Playwright against `astro preview`
/ (home): 0 violations
/series: 0 violations
/collaborate: 0 violations
/privacy: 0 violations
/terms: 0 violations
/accessibility: 0 violations
/404: 0 violations
(all 7 routes scanned successfully with 0 violations each — the core a11y gate. The script's
secondary, non-CI screenshot-capture step (for the PR's visual diff) hung/crashed partway through
on this sandbox's headless Chromium after axe-core finished, timing out on the "collaborate"
screenshot with "Target page, context or browser has been closed" — this is a script robustness
issue local to screenshot capture, not part of `npm run ci`, and does not affect the audited a11y
result above.)

$ npm run ci   # check:constants && build && typecheck && test
Exit 0, full pass (build in production mode, 0 postbuild errors, 0 typecheck errors, 10/10 tests)
```

CLAUDE.md's claimed status ("7 routes built, astro check 0 errors, vitest 10/10, axe-core 0
violations across all routes, check-public-output.mjs 0 errors in both preview modes") is
independently confirmed accurate by the above.

## Real content/pages available

7 routes: `/`, `/series`, `/collaborate`, `/privacy`, `/terms`, `/accessibility`, `/404`. Content
is migrated from the real legacy site (`legacy-site/index.html`, `media-index.html`), not
fabricated — home page (hero, "who it's for", ecosystem connections, FAQ), `/series` (real
"Shades of AI" YouTube playlist link, real Texas Movement Media / HERO / Performance YouTube
channel links pulled live from `@tmi/constants`), `/collaborate` (honest "intake is not open yet"
state), and honest "policy content pending" stubs for `/privacy`, `/terms`, `/accessibility`.
`legacy-site/` (preserved original files) is not included in the built `dist/` output — confirmed
by grepping `dist/` for any reference to it (none found).

## Public claims and unsupported-content risks

No fabricated clients, metrics, testimonials, partnerships, or team members found anywhere in
`src/` or the vendored `packages/constants/`. The **"2.1M+ cumulative views across platforms"**
claim (asserted elsewhere in the ecosystem, on alexandermathai.com, per this audit's brief) does
**not appear anywhere in this repo** — not in any `.astro` page, not in `packages/constants/`. No
action needed here: there is nothing in this repo asserting that figure that would need
owner-confirmation treatment. If it is ever added to this property in the future, it should carry
the same "needs owner verification" flag as it presumably does on alexandermathai.com.

## Social/external links and verification state

This repo does not use a `verified: true/false` boolean flag (unlike alexandermathai.com's
`src/data/social.ts` pattern). Instead it uses an equivalent TBD-sentinel gate:
`packages/constants/src/social.ts`'s `publishableAccounts()` filters out any account whose `url`
is still the `TBD` sentinel, and `src/lib/site.ts`'s `liveSocialAccounts()` wraps that for this
property. `Footer.astro` and `series.astro` both render only through `liveSocialAccounts()` /
`accountsForLane()`, so unresolved (TBD) social accounts (Media's TikTok, Performance's Instagram)
are mechanically excluded from every live surface — confirmed by `check:constants` reporting the
8 TBDs and by `test/site.test.ts`'s `liveSocialAccounts` never-TBD assertion passing.

One drift found, **not fixed** (functionally correct, just architecturally inconsistent): `index.astro`
hard-codes two external links directly in the template — `https://alexandermathai.com` and
`https://www.linkedin.com/in/alexandermathai` — instead of resolving them through
`accountsForLane("founder")` / `PROPERTIES.founder.url` like the rest of the site does for other
links. Both targets are real, already-verified (non-TBD) entries elsewhere in
`packages/constants/src/social.ts` and `ecosystem.ts` (`founder.status === "live"`), so this is
not a release-safety defect — no unverified or invented URL is exposed — but it is exactly the
kind of hard-coded-domain pattern `check:constants --strict` flags as a drift warning (2 of the 41
warnings). Left as-is per the instruction to fix only narrow, high-confidence defects; noting it
here as a possible follow-up cleanup, not a launch blocker.

**Separately worth flagging (not touched):** the vendored `packages/constants/src/ecosystem.ts`
marks `PROPERTIES.media.status` as `"live"` — the same registry this repo's own `liveFooterFor()`
and `check-public-output.mjs` treat as authoritative for "is this property safe to link to as
live." This is inherited, unedited, from the shared control-plane package (documented as
"temporary vendoring" in `docs/MIGRATION_INVENTORY.md`) and reflects the ecosystem's intended
end-state, not a per-repo deployment check. It does not cause a defect *within this repo* (this
property naturally treats itself as current/self, not as an external "live" link target), but it
is worth the owner's awareness: any other property that reads this same shared registry and links
out to `media.texasmovement.com` as `status: "live"` would currently be linking to an actually-live
hostname (the legacy site on `main`/GitHub Pages), not to this undeployed rebuild — so the registry
entry isn't wrong per se, just decoupled from "has this specific Astro rebuild shipped." Not
something this narrow audit should resolve by editing shared state.

## Contact/commerce status

No commerce on this property. Contact: `VERIFIED_INBOXES` in `src/lib/site.ts` is empty (both
`hello@texasmovement.com` and `media@texasmovement.com` are un-verified), so
`verifiedGeneralContact()` and `verifiedMediaContact()` both return `null`, and no page renders a
live `mailto:`, `<form>`, or fabricated success state anywhere — confirmed by
`check-public-output.mjs`'s mailto/form-action scan passing with 0 errors in both preview modes,
and by `test/site.test.ts` asserting both helpers return `null`. `/collaborate` renders an honest
"Intake is not open yet" notice instead of a CTA. Two conflicting legacy addresses
(`Media@TexasMovement.com` and a personal `texasmovementmedia@gmail.com`) were found during
migration and correctly **not** carried forward — documented in `docs/LAUNCH_BLOCKERS.md`.

## SEO/indexing behavior

Verified directly against built output (see CI section above): preview builds
(`PUBLIC_PREVIEW=true`) emit `<meta name="robots" content="noindex, nofollow">` on every page and
`robots.txt` disallows all crawling, with the sitemap integration correctly producing zero URLs
("No pages found!" from `@astrojs/sitemap`, by design). Production builds
(`PUBLIC_PREVIEW=false`) emit `index, follow, max-image-preview:large`, `robots.txt` allows all and
points at a real sitemap, and the sitemap contains exactly the 6 indexable routes (not `/404`).
Canonical URLs in both modes point at the real `https://media.texasmovement.com` domain — never
localhost, `pages.dev`, or a guessed staging host. This property correctly does not emit
`organizationJsonLd()` (owned exclusively by texasmovement.com, by ecosystem convention) — no
JSON-LD found in built output.

## Accessibility status

`npx astro check` and dedicated `test/site.test.ts` pass. `node scripts/a11y-and-screens.mjs`
(axe-core via Playwright against a real `astro preview` server) ran successfully in this session
and reported **0 violations on all 7 routes** — this is a real, freshly-run result, not a
paraphrase of CLAUDE.md's claim. Spot-checked manually: exactly one `<h1>` per page (all 7 routes
checked via `grep` on built HTML), a real skip link (`<a class="skip-link" href="#main">`) target
matching `<main id="main">`, a `prefers-reduced-motion: reduce` media query in `global.css`, and
zero `<img>` tags anywhere in `src/` (so no alt-text risk on this build). Mobile nav uses a real
`aria-expanded` disclosure button rather than a CSS-only hidden nav.

## Ecosystem classification: Building

Independent justification, not a default assumption:

- This is a genuinely fuller Astro rebuild with 7 real routes, a real design system, a real
  content migration, real automated governance tooling (`check-public-output.mjs`,
  `check.mjs --strict`), and a real, currently-passing test/a11y suite — clearly more substantial
  than a minimal "private shell" vertical, so **Building** (not Reserve) is the right lane.
- It is **not Live**: there is no evidence anywhere in the repo of an actual connected Cloudflare
  Pages deployment — `wrangler.toml` is explicitly scaffolded-but-unconnected
  ("connecting the repository requires a human with dashboard access — not available to an agent
  session"), no deployment credentials exist, and CLAUDE.md/LAUNCH_BLOCKERS.md both state plainly
  that nothing in this branch is deployed anywhere. I could not reach `media.texasmovement.com`
  from this sandbox to check independently (egress blocked), so I am not claiming it's down —
  only that this specific rebuild has no evidence of being the thing served there.
- It is **not quite Route** either in the strict sense (a property with no independent deployment
  that honestly routes visitors elsewhere) — this build *is* a full standalone site with its own
  real content and its own primary CTA (`/series`), not a redirect-to-parent-hub pattern. The one
  exception, `/collaborate`, correctly behaves like a "Route"-style honest placeholder (no dead
  end, no fabricated CTA) for the one surface that depends on unverified inbox data.
- **Building** best matches the definition given: real repo/work exists, nothing deployed
  publicly, honest status badges throughout (every placeholder page says so explicitly), no
  external link or CTA that overstates readiness.

## Launch recommendation

Do not merge PR #2 or connect hosting yet. The build itself is clean and release-gate-passing;
what's blocking is entirely external data the agent cannot supply: a verified inbox, real legal
copy, and human-only Cloudflare dashboard access. Once those are resolved, this branch is close to
mergeable as-is from a code-safety standpoint — no code changes were required by this audit.

## Required owner verification

1. Confirm which (if either) of `media@texasmovement.com` / the legacy
   `texasmovementmedia@gmail.com` should be the real collaboration inbox, verify it forwards, and
   add it to `VERIFIED_INBOXES` in `src/lib/site.ts` before `/collaborate` gets a live CTA.
2. Fill in real `stateOfFormation`, `formationYear`, `mailingAddress.street`/`postalCode` in
   `org.ts`, and real `/privacy`, `/terms`, `/accessibility` policy text.
3. Fill in Media's TikTok and Performance's Instagram handles in `social.ts`, if/when real.
4. Decide whether the "2.1M+ cumulative views" figure asserted elsewhere in the ecosystem (on
   alexandermathai.com) should ever be added to this property's own content, and if so, confirm it
   the same way other cross-property facts require confirmation.
5. Connect Cloudflare Pages (dashboard access required) and merge PR #2 when ready — a decision
   this audit explicitly does not make.
6. Decide (separately) whether anything from the untouched `tmm-hub-redesign` branch should ever
   be ported — see `docs/MIGRATION_INVENTORY.md`'s "worth porting" section.

## Exact blockers

- No verified inbox → no live `/collaborate` CTA.
- No real legal copy → `/privacy`, `/terms`, `/accessibility` remain honest placeholders.
- No Cloudflare Pages connection → no live URL for this rebuild, full stop.
- `org.ts` TBDs (formation state/year, mailing address) block a complete `Organization`-adjacent
  data set, though this property doesn't emit `organizationJsonLd()` itself.

## Safe next action

Owner verifies the media inbox and connects Cloudflare Pages hosting; once both are done, PR #2
can be reviewed for merge with confidence that the build itself is clean (this audit found zero
code-level release-safety defects requiring a fix). No code changes were made by this audit.
