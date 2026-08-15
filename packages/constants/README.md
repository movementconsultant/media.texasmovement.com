# @tmi/constants

The single operating spine for the Texas Movement International ecosystem.

Every domain, brand label, lane role, primary CTA, inbox, social handle, routing
rule, analytics event name, and legal disclaimer lives here — **once**.

If a fact about the ecosystem appears in two files, one of them is wrong.

---

## The four rules

1. **Import, never re-declare.** No app file may contain the string
   `texasmovement.com` or `alexandermathai.com`. `scripts/check.mjs` will find it.
2. **`key` is permanent.** `consulting`, `hero`, `founderlink` etc. are used by
   analytics, UTM tags, and routing. Renaming one silently breaks the dashboard.
3. **One primary CTA per property.** The check script enforces this.
4. **Unknown ≠ blank.** Anything unconfirmed is `TBD`, never an empty string and
   never a guess. The check script prints every outstanding one.

---

## Install into an app

In the app's `package.json`:

```json
{
  "dependencies": {
    "@tmi/constants": "workspace:*"
  }
}
```

Then `pnpm install` from the repo root.

## Use it

```ts
import { PROPERTIES, URLS, GLOBAL_FOOTER, routeInquiry, url, withUtm } from "@tmi/constants";

const consulting = PROPERTIES.consulting;
consulting.primaryCta.label;   // "Start a diagnostic"
consulting.mustNotBecome;      // scope guard — read before adding a page

URLS.hero;                     // "https://hero.texasmovement.com"

routeInquiry("unclear_or_cross_lane");
// { url: "https://founderlink.texasmovement.com/brief", inbox: "...", responseTargetHours: 72 }

url("media", "/series");       // absolute, no trailing slash
withUtm(URLS.consulting, { source: "youtube", medium: "video", campaign: "systems-ep01" });
```

In an Astro component:

```astro
---
import { GLOBAL_FOOTER, LEGAL_LINKS, footerFor } from "@tmi/constants";
const items = footerFor("consulting");
---
<footer>
  {items.map((i) => i.isCurrent
    ? <span>{i.label}</span>
    : <a href={i.href}>{i.label}</a>)}
</footer>
```

---

## Files

| File | Holds |
|---|---|
| `types.ts` | Every shape. Add the type before you add the data. |
| `org.ts` | Legal entity, founder identity, inboxes, disclaimers |
| `ecosystem.ts` | **The registry.** 11 properties: domain, role, CTA, scope guard |
| `nav.ts` | Global footer contract + legal links |
| `routing.ts` | Inquiry kind → destination, inbox, response-time promise |
| `social.ts` | Every account, its owning lane, its one approved destination |
| `editorial.ts` | Taxonomy, pillars, the content loop, publish checklist |
| `analytics.ts` | Standard event names, weekly KPIs, UTM vocabulary |
| `seo.ts` | Title/description limits, OG paths, Organization + Person JSON-LD |
| `utils.ts` | `url()`, `canonical()`, `withUtm()`, `mailto()` |

---

## Commands

```
node scripts/check.mjs           # report: TBDs, drift, structural errors
node scripts/check.mjs --strict  # same, exits 1 on error (this is what CI runs)
npx tsc --noEmit                 # typecheck
```

---

## Migration note — read this before wiring it in

`packages/content/lanes.ts` currently defines the nine lanes independently.
Do **not** leave two definitions alive. Replace its contents with a re-export:

```ts
// packages/content/lanes.ts
export { PROPERTIES, PROPERTY_ORDER, ALL_PROPERTIES, URLS } from "@tmi/constants";
```

Fix the import sites the compiler flags, then delete the old literals. Two
sources of truth is the exact failure this package exists to prevent.

---

## Outstanding TBDs

Run `node scripts/check.mjs` for the live list. As shipped, these are open:

- `ORG.stateOfFormation`, `ORG.formationYear` — from the filed Certificate of Formation
- `ORG.mailingAddress.street` / `.postalCode` — use a registered agent or mailbox, **not a home address**
- TMM TikTok handle
- TMP Instagram handle

Every inbox in `org.ts` is written to the lane pattern. Confirm each one actually
exists and forwards before publishing it — a dead inbox on a live CTA is worse
than no CTA.
