# OG kit — Texas Movement Media

Drop-in social / link-preview kit for **https://media.texasmovement.com/**

## Files
- `og-image.png` — 1200×630. Link preview (texts, LinkedIn, Facebook, X, Slack, Discord, WhatsApp).
- `og-square.png` — 1200×1200. Square variant for feed posts / profile use.
- `meta-tags.html` — paste inside the page `<head>`.

## Install (this site's GitHub Pages repo)
1. Commit `og-image.png` + `og-square.png` to the **repo root** (next to `index.html`).
2. Paste `meta-tags.html` into the `<head>` of `index.html`.
3. Push and let Pages publish.

`og:image` is an absolute URL on purpose — crawlers need a full URL, so the PNG must sit at the domain root.

## After publishing — force a re-scrape (previews are cached)
- LinkedIn → https://www.linkedin.com/post-inspector/
- Facebook / Messenger / WhatsApp / iMessage → https://developers.facebook.com/tools/debug/
- X → Card Validator, or post the link once

## Edit the words
Title / description / alt live in `meta-tags.html` (no regen needed). Image text is baked in — ask me to regenerate to change it.
