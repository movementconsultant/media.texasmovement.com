/**
 * Small helpers. Use these instead of string concatenation in apps.
 */
import { PROPERTIES } from "./ecosystem.ts";
import type { PropertyKey } from "./types.ts";
import type { UtmSource } from "./analytics.ts";

/** Absolute URL for a path on a given property. Never build these by hand. */
export function url(property: PropertyKey, path = "/"): string {
  const base = PROPERTIES[property].url;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || base;
}

/** Canonical URL for a page. Always absolute, always trailing-slash-free. */
export function canonical(property: PropertyKey, path: string): string {
  return url(property, path);
}

export interface UtmOptions {
  source: UtmSource;
  medium: "social" | "video" | "email" | "referral" | "print";
  campaign: string;
  content?: string;
}

/** Tag an outbound link. Every social/YouTube link gets one. */
export function withUtm(target: string, o: UtmOptions): string {
  const u = new URL(target);
  u.searchParams.set("utm_source", o.source);
  u.searchParams.set("utm_medium", o.medium);
  u.searchParams.set("utm_campaign", o.campaign);
  if (o.content) u.searchParams.set("utm_content", o.content);
  return u.toString();
}

/** mailto: for a lane, so inboxes are never typed inline in markup. */
export function mailto(address: string, subject?: string): string {
  return subject
    ? `mailto:${address}?subject=${encodeURIComponent(subject)}`
    : `mailto:${address}`;
}
