# Migration inventory — media.texasmovement.com

Survey taken at the start of this rebuild, before any scaffolding was touched.

## Branches at time of survey

| Branch | Head SHA | Notes |
|---|---|---|
| `main` | `3e1708132f4a57493e4895087247393903724d01` | Live production content. Static HTML + CNAME, no build tooling. |
| `tmm-hub-redesign` | `45e989382e618e1d4696c28272bc91de12c63da2` | Hand-edited, in-progress alternate `index.html` + its own `CNAME`. **Not on `main`.** See dedicated diff section below. |
| `claude/texas-movement-rebuild-pq14fo` | (this branch, created fresh from `main`) | This rebuild. |

`main`'s remote HEAD points at `main`. No other branches existed at survey time.

## Every file in the repo at start of work (on `main`)

| Path | Purpose | Referenced by |
|---|---|---|
| `CNAME` | GitHub Pages custom-domain file, content: `media.texasmovement.com` | GitHub Pages hosting config (not linked from HTML) |
| `README.md` | "OG kit" install notes for `og-image.png`/`og-square.png`/`meta-tags.html` | Not linked from any page; internal maintainer doc |
| `index.html` | The live homepage. Full page: hero, "who it's for", Shades of AI series feature, content systems, ecosystem connections, FAQ, contact (mailto). | Served at `/` |
| `media-index.html` | A **second, differently-designed** full page — "Underreported stories, turned into economic leverage" framing. Formats (Pro Talks / Productions / Shorts), a channels/network grid, and a "Become a host" application section with a `mailto:texasmovementmedia@gmail.com` form action. Not linked from `index.html`'s nav — reachable only as a direct URL (`/media-index.html`). | Not linked from `index.html`; orphaned from primary nav but a real, indexable, bookmarkable path |
| `meta-tags.html` | A head-tag snippet reference fragment (OG/Twitter meta only) meant to be pasted into `<head>`, per `README.md`. Not a full HTML document intended as its own route, though it is technically reachable at `/meta-tags.html` as a raw fragment. | Referenced only by `README.md`'s install instructions |
| `og-image.png` | 1200×630 PNG. Open Graph / Twitter card image. | Referenced by `meta-tags.html` and inline OG tags in `index.html` (via `texasmovement.com/05_banner_header.png` on the TMI apex domain, not this file directly — see note below) |
| `og-square.png` | 1200×1200 PNG. Square variant for feed/profile use. | Not referenced by any HTML in this repo; distributed via the "OG kit" for manual social-profile use per `README.md` |

**Note on `og-image.png`:** `index.html`'s actual `og:image`/`twitter:image` tags point at `https://texasmovement.com/05_banner_header.png` (an image on the **parent** TMI domain), not at this repo's own `og-image.png`. `meta-tags.html` (the unused reference snippet) is the one that points `og:image` at this repo's own `https://media.texasmovement.com/og-image.png`. So `og-image.png`/`og-square.png` were live-produced assets that were never actually wired into the page that shipped.

None of the above files were orphaned in the sense of "unused code" — every file is either served directly or is real install documentation for a real (if partially unwired) asset kit.

## Static assets

| Path | Dimensions | Format | Used by |
|---|---|---|---|
| `og-image.png` | 1200×630 | PNG, 8-bit RGB | `meta-tags.html` (not `index.html`, see note above) |
| `og-square.png` | 1200×1200 | PNG, 8-bit RGB | Not referenced by any HTML; manual social use per `README.md` |

External images referenced by `index.html` (hosted on the parent `texasmovement.com` domain, not in this repo): `01_primary_stacked_transparent.png` (header logo), `05_banner_header.png` (OG image).

## CNAME content

```
media.texasmovement.com
```

Exact, verbatim, single line, no trailing content beyond a newline.

## What this rebuild did with the above

All real content from `main` was migrated into the new Astro build — nothing was dropped:

- `index.html`'s hero, "who it's for", ecosystem-connections, and FAQ content → `src/pages/index.astro` (`/`).
- `index.html`'s "Shades of AI" flagship-series feature (real playlist + channel links) → `src/pages/series.astro` (`/series`), which is also where the property's `primaryCta` ("Watch the series") resolves.
- `media-index.html`'s three-format breakdown (Pro Talks / Productions / Shorts) and its "content systems" framing → merged into `src/pages/series.astro` (`/series`).
- `media-index.html`'s channel/network grid → `src/pages/series.astro`'s "Network" section, rebuilt to pull channel handles/URLs live from `packages/constants` (`social.ts`) instead of being hand-typed, so it can't silently drift from the source of truth.
- `media-index.html`'s "Become a host" application (criteria list, pipeline copy) + `index.html`'s FAQ "how do I propose a collaboration" answer + `index.html`'s contact-section copy → consolidated into `src/pages/collaborate.astro` (`/collaborate`), which is the property's one `media_collaboration` intake surface per `routing.ts`.
- `meta-tags.html` → superseded entirely by the `@tmi/constants` `seo.ts` metadata framework (`src/layouts/BaseLayout.astro`); not migrated as content because it was documented as a reference snippet, not a page.
- `og-image.png` → copied to `public/og-media.png` so `seo.ts`'s `ogImage("media")` helper (`/og-${property}.png`) resolves to a real file. `og-square.png` is preserved as-is in `legacy-site/` (not currently wired into any meta tag, matching its state on `main`).
- `CNAME` → preserved verbatim at the repo root, and also copied into `public/CNAME` so a static Cloudflare Pages / GitHub Pages build carries it into `dist/`.
- The **entire original file set** (`index.html`, `media-index.html`, `meta-tags.html`, `README.md`, `og-image.png`, `og-square.png`) was moved, unedited, into `legacy-site/` at the repo root — nothing was deleted. `git mv` was used so history is preserved.

### Contact-address discrepancy found during migration (flag only, not resolved here)

`index.html`'s contact section and JSON-LD use `Media@TexasMovement.com` (i.e. `INBOXES.media` from `org.ts`). `media-index.html`'s "Become a host" section instead uses `texasmovementmedia@gmail.com` — a personal Gmail address, not a `texasmovement.com` address, and not present anywhere in `@tmi/constants`. Neither address is in `VERIFIED_INBOXES` (which is empty). Per the common brief's rule ("do not expose a lane CTA, contact form, mailto link ... unless its destination is verified" and "do not publish a personal Gmail anywhere, ever" for the analogous founder-email rule), **neither address was carried into the new build as a live `mailto:` or form action.** The `/collaborate` page renders an honest "not open yet" state instead. See `docs/LAUNCH_BLOCKERS.md`.

## `tmm-hub-redesign` diff (branch `tmm-hub-redesign`, head `45e9893`)

**DO NOT MERGE OR DISCARD THIS BRANCH WITHOUT ALEXANDER'S APPROVAL.** It was left completely untouched by this rebuild — not merged, not modified, not deleted. This section only documents what is unique about it, for the owner's review.

### Files unique to `tmm-hub-redesign`

| Path | vs. `main` |
|---|---|
| `index.html` | Completely different design and content from `main`'s `index.html` — see below. |
| `CNAME` | Same content (`media.texasmovement.com`) — no diff of substance. |

`tmm-hub-redesign` has **only** `index.html` and `CNAME` — it does not carry `media-index.html`, `meta-tags.html`, `README.md`, or the two OG PNGs from `main`.

### Structural differences

`tmm-hub-redesign`'s `index.html` is a **client-side single-page app** (all "pages" are `<section class="page">` blocks toggled by a `showPage()` JS function driven by nav buttons), not a set of real routes. It uses a completely different visual system from the Texas Movement design system used everywhere else in the ecosystem (see `DESIGN_SYSTEM.md`): dark theme (`#0b0c0e` background), Bebas Neue + DM Sans typography (not IBM Plex / Space Grotesk), red accent (`#e8321a`), rounded card UI. It does **not** use the shared `--paper`/`--ink`/`--compression`/`--tension` token system at all — it's a from-scratch design, not a variant of the production brand.

Its six "pages" (all client-side, no real URLs): **Home**, **Start Here**, **Watch**, **Work With Us**, **Submit a Show**, **About**.

### Copy/content unique to `tmm-hub-redesign`

- Positions TMM as "content that moves culture" / "media infrastructure" across **six verticals**: Shame of Emperors, Pro Talks, HERO / Performance, Consulting / B2B, TMM Onramp, Shorts / Clips. This taxonomy does not exist anywhere on `main` — `main` only ever mentions Shades of AI (flagship) and, separately, Pro Talks / Productions / Shorts as formats.
- "Shame of Emperors" (diaspora audits / systems analysis) is a series name that appears **only** on this branch — it is not mentioned anywhere on `main`.
- A "Start Here" onboarding page: five numbered episodes framed as the fastest on-ramp into the network. Concept and copy do not exist on `main`.
- A "Watch" page listing all six series with YouTube playlist links — **every single playlist URL is a placeholder** (`https://youtube.com/playlist?list=SHAME_OF_EMPERORS_PLACEHOLDER`, `..._PRO_TALKS_PLACEHOLDER`, etc.) — none of these are real, resolvable YouTube URLs.
- A "Submit a Show" page with a real `<form>` (name/email/role/title/format/lane/pitch/links) that on submit builds a `mailto:` with a hard-coded `TO='tmm+shows@texasmovement.com'` address, explicitly flagged in the branch's own source with two `TODO` comments: *"change submission email below ... to the real inbox before go-live"*. This inbox is not in `@tmi/constants` (`org.ts` `INBOXES` has no `shows` key) and is not verified.
- An "About" page lists four contact addresses as plain text (not live links): `hello@texasmovement.com`, `shows@texasmovement.com`, `partners@texasmovement.com`, `press@texasmovement.com`. Of these, only `press@texasmovement.com` and `hello@texasmovement.com` (as `INBOXES.general`) exist in `org.ts`; `shows@` and `partners@` do not exist in the constants registry at all.
- Footer copyright reads "© 2025 TMM" (stale year relative to the current build date).

### What's worth porting — explicit recommendation, not applied

This rebuild deliberately did **not** pull any of the above into the Astro build. Flagging for the owner's review, in case some of it is worth carrying forward on a future branch:

1. **The "Start Here" onboarding concept** (a short, numbered on-ramp for first-time visitors) is a genuinely useful pattern that `main`'s content doesn't have. If Media ever wants a fast on-ramp, this is worth revisiting — but the current five "episodes" reference real-sounding but unconfirmed series (Shame of Emperors, "The Operator," etc.) that would need to be verified as real, published episodes before reuse.
2. **The "Shame of Emperors" series name and six-vertical taxonomy** are a substantially different content strategy from what's live on `main` (which centers on the single Shades of AI flagship series plus generic Pro Talks/Productions/Shorts formats). This looks like it could be a genuine content-roadmap expansion in progress, but none of the six playlists are real yet (all placeholder URLs) — worth a direct conversation with the owner about whether "Shame of Emperors" is a real, upcoming series before any copy referencing it ships anywhere.
3. **Do not** port the submission form or its `mailto:` target — it has the exact same unverified-inbox problem this rebuild is designed to avoid, and the branch's own `TODO` comments confirm the address isn't final.

## Rollback plan

To roll back: `git checkout main` — `main` is untouched. Delete the feature branch (`claude/texas-movement-rebuild-pq14fo`) if desired. The live GitHub Pages deploy was never repointed at this branch or at this PR. Nothing in this migration touches `main` or the Pages deploy source, so rollback is a no-op unless and until someone merges the PR.

## Known follow-up

- **`@tmi/constants` vendoring is temporary.** `packages/constants/` in this repo is a verbatim copy of the shared constants package, depended on via `"@tmi/constants": "file:./packages/constants"` in `package.json` (per `site-lib-spec.md`; repo-creation for the real `movementconsultant/tmi-constants` package failed with a GitHub App permission error at the time of this build). Import statements were kept exactly as documented (`import { X } from "@tmi/constants"`), so once the real package exists, the only change needed is swapping the `package.json` dependency line to `"@tmi/constants": "npm:@movementconsultant/constants@^0.1.0"` — no import rewrites required anywhere in `src/`.
- **Playwright is pinned to an exact version (`1.56.1`)**, not a semver range, because it must match the pre-installed Chromium revision (`1194`) available in this build environment at `/opt/pw-browsers`. Bumping this dependency later requires either re-verifying the bundled Chromium revision matches what's available, or running a real `playwright install`.
