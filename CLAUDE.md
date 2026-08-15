# CLAUDE.md — media.texasmovement.com

## Scope / property role

This repo is the **media/documentation lane** of the Texas Movement ecosystem — an Astro
static site (`output: "static"`), on the shared design system, wired through the vendored
`@tmi/constants` control-plane package (`packages/constants/`, temporary vendoring — see
`docs/MIGRATION_INVENTORY.md`'s "Known follow-up").

Current build is a **preview PR** (`claude/texas-movement-rebuild-pq14fo`, PR #2). `main` is
untouched and still serves the legacy static HTML via GitHub Pages. Nothing in this repo is
deployed anywhere yet.

Routes: `/`, `/series`, `/collaborate`, `/privacy`, `/terms`, `/accessibility`, `/404`.

- **`/series` is live and YouTube-linked** — the flagship "Shades of AI" playlist, the Texas
  Movement Media channel, and cross-network YouTube channels (HERO, Performance), all pulled
  from `@tmi/constants`'s `social.ts` via `accountsForLane()` / `liveSocialAccounts()`, not
  hand-typed or inbox-dependent. Safe to keep live as-is.
- **`/collaborate` is a safe placeholder** pending inbox verification. It renders no `<form>`,
  no `<input>`, no live mailto — `verifiedMediaContact()` in `src/lib/site.ts` returns `null`
  because `media@texasmovement.com` is not in `VERIFIED_INBOXES`, so the page shows an honest
  "intake is not open yet" state instead of a CTA.
- **`tmm-hub-redesign` branch is protected reference material — do not touch.** It is a
  materially different, unmerged six-vertical redesign left untouched by this build. Full diff
  and "worth porting" notes (labeled clearly as unapproved) are in
  `docs/MIGRATION_INVENTORY.md`. Never merge, overwrite, delete, or port anything from it
  without Alexander's explicit approval.

## Public-output safety rules (sharper policy — applies to everything that ships in `dist/`)

These rules cover **every surface**, not just visible page text: rendered DOM, HTML comments
(Astro ships template `<!-- -->` comments verbatim into `dist/`, unlike frontmatter `//`
comments), JSON-LD, `<script>` blocks and inline JS string literals, `aria-label`/`data-*`
attributes, meta tags, sitemap/robots output, and static files (`CNAME`, `_redirects`, etc).

- No `mailto:` / email address anywhere, in any form — verified or not, linked or plain text.
- No contact/newsletter/booking/collaboration-submission form (`<form>`, `<input>`) without a
  verified destination in `VERIFIED_INBOXES`.
- No literal `TBD` / `__TBD__`.
- No fabricated legal, social, or contact data.
- No unresolved social link (a placeholder URL, an account with `url: TBD` in `social.ts`).
- No non-live property (`PROPERTIES[key].status !== "live"`) as a clickable link anywhere
  (nav, footer, canonical, sitemap).

`scripts/check-public-output.mjs` enforces the mechanical parts of this (TBD strings, unverified
mailto/form actions, non-live property links, missing preview noindex) as a `postbuild` hook —
but it is a floor, not a substitute for manual review of new pages/components.

## Build / test commands

```
npm run check:constants     # node packages/constants/scripts/check.mjs --strict
PUBLIC_PREVIEW=true  npm run build   # astro build + postbuild check-public-output.mjs
PUBLIC_PREVIEW=false npm run build   # production mode: real sitemap, no noindex
npx astro check              # typecheck
npx vitest run                # unit tests (src/lib/site.ts contract)
node scripts/a11y-and-screens.mjs   # axe-core via Playwright against `astro preview` (not in `ci`)
npm run ci                    # check:constants && build && typecheck && test
```

## Deployment / rollback assumptions

- No hosting is currently connected. `wrangler.toml` is scaffolded for Cloudflare Pages
  (`pages_build_output_dir = "dist"`) but connecting the repo requires a human with dashboard
  access — not available to an agent session.
- `main`'s GitHub Pages deploy is untouched and unaffected by this branch/PR.
- Rollback is a no-op unless/until PR #2 is merged: delete the feature branch, `main` still
  serves the legacy site.

## Known launch blockers

See `docs/LAUNCH_BLOCKERS.md` for the full list. Summary: legal/org data (`org.ts` TBDs, no
real privacy/terms/accessibility copy), inbox verification (`media@texasmovement.com` unverified
— two conflicting legacy addresses found and neither carried forward), two TBD social handles,
and no hosting credentials.

## Needs owner (Alexander) approval

- Verifying `media@texasmovement.com` (or resolving which of the two conflicting legacy
  addresses, if either, is correct) before any `/collaborate` CTA goes live.
- Any decision to port content/strategy ideas from `tmm-hub-redesign` (six-vertical taxonomy,
  "Shame of Emperors," "Start Here" onboarding concept) — see `docs/MIGRATION_INVENTORY.md`'s
  "worth porting" section, explicitly unapplied recommendations only.
- Connecting real hosting (Cloudflare Pages / GitHub Pages) and merging PR #2.
- Filling in real legal/org data and policy copy.

## Current implementation status

7 routes built, `astro check` 0 errors, `npx vitest run` 10/10 passing, axe-core 0 violations
across all routes, `check-public-output.mjs` 0 errors in both preview modes. `tmm-hub-redesign`
remains unmerged and unmodified.
