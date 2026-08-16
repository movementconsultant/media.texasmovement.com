// src/lib/site.ts
//
// Thin, repo-local wrapper around the vendored @tmi/constants package
// (packages/constants). It enforces the launch-safety rules that the raw
// constants package does NOT enforce by itself (raw GLOBAL_FOOTER/footerFor()
// includes "building" properties too; raw INBOXES has no "verified" concept).
//
// Every page, layout, nav, footer, and JSON-LD block in this repo must go
// through this file — never import "@tmi/constants" primitives directly in
// a .astro template.
import {
  PROPERTIES,
  PROPERTY_ORDER,
  footerFor,
  LEGAL_LINKS,
  publishableAccounts,
  url,
  canonical,
  mailto,
} from "@tmi/constants";
import { TBD } from "@tmi/constants";
import type { PropertyKey } from "@tmi/constants";

/**
 * Inboxes confirmed live and forwarding as of this build.
 * EMPTY by default — nothing is verified until a human confirms it.
 * Edit this list only after manually confirming an inbox forwards.
 * This is intentionally NOT sourced from org.ts — org.ts lists every
 * inbox that SHOULD exist, not every inbox confirmed to exist.
 */
export const VERIFIED_INBOXES: readonly string[] = [
  // "hello@texasmovement.com",  <- uncomment only after confirming
  // "media@texasmovement.com",  <- uncomment only after confirming
];

export function isVerifiedInbox(address: string | undefined | null): boolean {
  return !!address && VERIFIED_INBOXES.includes(address);
}

/** Live-only nav/footer — filters out "building"/"planned"/"retired" properties
 *  even though raw footerFor() would include them if inGlobalNav is true. */
export function liveFooterFor(current: PropertyKey) {
  return footerFor(current).filter((item) => PROPERTIES[item.key].status === "live");
}

/** Live-only social accounts, further filtered to ones with a resolved (non-TBD) url. */
export function liveSocialAccounts() {
  return publishableAccounts(); // already excludes TBD entries
}

/**
 * The ONE contact route this build is allowed to expose.
 * Returns null if nothing is verified — callers MUST render no CTA in that case,
 * never a placeholder, never a raw mailto to an unverified address.
 */
export function verifiedGeneralContact(): { href: string; label: string } | null {
  const general = "hello@texasmovement.com"; // INBOXES.general
  if (!isVerifiedInbox(general)) return null;
  return { href: mailto(general), label: "Email us" };
}

/**
 * Media's own lane inbox (INBOXES.media = media@texasmovement.com), used for
 * the /collaborate surface (routing.ts: media_collaboration -> /collaborate).
 * Returns null until verified — callers MUST render an honest "not open yet"
 * state in that case, never a live mailto/form action to an unverified inbox.
 */
export function verifiedMediaContact(): { href: string; label: string } | null {
  const media = PROPERTIES.media.inbox;
  if (media === TBD || !isVerifiedInbox(media)) return null;
  return { href: mailto(media), label: "Email the media team" };
}

export { PROPERTIES, PROPERTY_ORDER, LEGAL_LINKS, url, canonical };
