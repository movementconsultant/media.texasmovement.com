# Launch blockers — Texas Movement Media

## Legal / organization data (blocks: Organization JSON-LD completeness, footer legal text, policy pages)
- [ ] `ORG.stateOfFormation` — TBD in `@tmi/constants` `org.ts`
- [ ] `ORG.formationYear` — TBD
- [ ] `ORG.mailingAddress.street` — TBD (do not use a home address)
- [ ] `ORG.mailingAddress.postalCode` — TBD
- [ ] No real `/privacy`, `/terms`, or `/accessibility` policy text exists yet. All three routes are live and linked from the footer, but each renders an honest "policy content pending" placeholder instead of real legal text. Real copy is needed before production launch — see `src/pages/privacy.astro`, `src/pages/terms.astro`, `src/pages/accessibility.astro`.
- [ ] This property does **not** emit `organizationJsonLd()` (that block is owned exclusively by texasmovement.com, per the manifest's rule) — this is by design, not a gap, noted here only for completeness.

## Inbox verification (blocks: `/collaborate` CTA, any live mailto)
- [ ] `media@texasmovement.com` (`INBOXES.media`) — not in `VERIFIED_INBOXES`. This is the inbox the property's own routing rule (`routing.ts`: `media_collaboration` → `/collaborate`) is supposed to deliver to. Until verified, `/collaborate` renders an honest "intake is not open yet" state instead of a live mailto or form action.
- [ ] `hello@texasmovement.com` (`INBOXES.general`) — not in `VERIFIED_INBOXES`. No general-contact CTA is exposed anywhere on this property as a result (`verifiedGeneralContact()` in `src/lib/site.ts` returns `null` and is unused by any page — kept only because the common `site.ts` contract requires it to exist).
- [ ] **Two conflicting, unverified addresses were found in the legacy content** during migration and were NOT carried forward as live links: `Media@TexasMovement.com` (from `main`'s `index.html`, matches `INBOXES.media`) and `texasmovementmedia@gmail.com` (from `main`'s `media-index.html` "Become a host" section — a personal Gmail address, not a `texasmovement.com` address, and not present in `@tmi/constants` at all). Neither is live anywhere in the new build. Whoever verifies the media inbox should also resolve which of these (if either) is the correct destination before `VERIFIED_INBOXES` is updated. See `docs/MIGRATION_INVENTORY.md` for full detail.
- [ ] `tmm-hub-redesign` (the untouched, unmerged sibling branch) contains its own unverified `mailto:` target (`tmm+shows@texasmovement.com`) with an explicit in-source `TODO` from whoever built that branch — flagged here for awareness only, since that branch is out of scope for this build.

## Social handles (blocks: footer/nav social icons, `sameAs`-style listings)
- [ ] Media TikTok handle/url — TBD in `social.ts` (`ACCOUNTS` entry with `lane: "media"`, `platform: "tiktok"`). Automatically excluded from every live rendering by `publishableAccounts()`/`liveSocialAccounts()` — no action needed to keep this out of public output, just noting the gap for whoever owns filling it in.
- [ ] Performance Instagram handle/url — TBD in `social.ts`. Same as above; excluded automatically, listed here for completeness since `/series`'s "Network" section pulls performance's YouTube (which IS resolved) but would also want Instagram once it exists.

## Hosting / preview (blocks: live PR preview URL)
- [ ] No Cloudflare Pages / Netlify credentials available to this build. `wrangler.toml` is configured for a static Pages deployment (`pages_build_output_dir = "dist"`, `PUBLIC_PREVIEW` var scaffold) and the project builds cleanly, but connecting the repository to a hosting provider and producing a real preview URL requires a human with dashboard access. Verified locally instead: `astro build` succeeds, `astro preview` serves all routes with HTTP 200, and axe-core accessibility scans + before/after screenshots were captured against that local preview server. See the PR description for exact commands and results.

## Anything else discovered during this build
- [ ] **`tmm-hub-redesign` branch** (untouched, not merged — see `docs/MIGRATION_INVENTORY.md` for the full diff) proposes a materially different six-vertical content strategy (including a "Shame of Emperors" series not mentioned anywhere on `main`) with a completely different visual design. This is a content/strategy decision for Alexander to make, not something this rebuild resolved — flagging so it doesn't get lost.
- [ ] `og-image.png`/`og-square.png` on `main` were partially unwired: `index.html`'s actual OG tags pointed at an image on the parent `texasmovement.com` domain, not at this repo's own OG kit. This rebuild wires `seo.ts`'s `ogImage("media")` helper to a real file (`public/og-media.png`, copied from the legacy `og-image.png`) so the property now serves its own OG image consistently — noting here since it's a behavior change from what was live, in case a different image is actually preferred.
- [ ] Playwright is pinned to an exact version (`1.56.1`) in `package.json` to match the Chromium revision pre-installed in this build environment. A future `npm update` of `playwright` should be checked against whatever browser binaries are actually available in CI/deploy, or paired with a real `playwright install`.
