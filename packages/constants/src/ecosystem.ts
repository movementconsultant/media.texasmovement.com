/**
 * THE REGISTRY.
 *
 * Every domain, every role, every primary CTA. If a URL, brand label, or
 * lane description appears anywhere in tmi-web, it is imported from here.
 *
 * Hard rules:
 *  1. `key` is permanent. Analytics, UTM tags, and routing all depend on it.
 *  2. Exactly ONE primary CTA per property.
 *  3. `mustNotBecome` is a scope guard. Read it before adding a page.
 */
import { INBOXES } from "./org.ts";
import type { Property, PropertyKey } from "./types.ts";

const APEX = "texasmovement.com";
const sub = (s: string) => `${s}.${APEX}`;

export const PROPERTIES: Readonly<Record<PropertyKey, Property>> = {
  tmi: {
    key: "tmi",
    name: "Texas Movement International",
    label: "TMI HQ",
    domain: APEX,
    url: `https://${APEX}`,
    platform: "astro-cloudflare",
    app: "apps/www",
    role: "Parent-company hub: thesis, lane map, governance, proof.",
    primaryCta: { label: "Find your lane", href: "/lanes", event: "lane_click" },
    mustNotBecome: "A duplicate of every sub-brand site.",
    inbox: INBOXES.general,
    status: "live",
    inGlobalNav: true,
  },

  founderlink: {
    key: "founderlink",
    name: "FounderLink",
    label: "FounderLink",
    domain: sub("founderlink"),
    url: `https://${sub("founderlink")}`,
    platform: "astro-cloudflare",
    app: "apps/founderlink",
    role: "Central intake, qualification, routing, and relationship record.",
    primaryCta: { label: "Submit a brief", href: "/brief", event: "brief_submit" },
    mustNotBecome: "A vague contact page.",
    inbox: INBOXES.founderlink,
    status: "live",
    inGlobalNav: true,
  },

  consulting: {
    key: "consulting",
    name: "Texas Movement Consulting",
    label: "Consulting",
    domain: sub("consulting"),
    url: `https://${sub("consulting")}`,
    platform: "astro-cloudflare",
    app: "apps/consulting",
    role: "Systems diagnostics, AI and operations builds, workshops, retainers.",
    primaryCta: { label: "Start a diagnostic", href: "/start", event: "form_start" },
    mustNotBecome: "A generic agency site.",
    inbox: INBOXES.consulting,
    status: "live",
    inGlobalNav: true,
  },

  performance: {
    key: "performance",
    name: "Texas Movement Performance",
    label: "Performance",
    domain: sub("performance"),
    url: `https://${sub("performance")}`,
    platform: "astro-cloudflare",
    app: "apps/performance",
    role: "Movement education, evaluation, training, biomechanics.",
    primaryCta: { label: "Request an evaluation", href: "/evaluation", event: "form_start" },
    mustNotBecome: "A medical-claims site.",
    inbox: INBOXES.performance,
    status: "live",
    inGlobalNav: true,
  },

  health: {
    key: "health",
    name: "Texas Movement Health",
    label: "Health",
    domain: sub("health"),
    url: `https://${sub("health")}`,
    platform: "astro-cloudflare",
    app: "apps/health",
    role: "Recovery-adjacent education. Herbs-only scope, explicitly non-clinical.",
    primaryCta: { label: "Read the approach", href: "/approach", event: "outbound_click" },
    mustNotBecome: "A treatment or supplement-claims site.",
    inbox: INBOXES.health,
    status: "live",
    inGlobalNav: true,
  },

  hero: {
    key: "hero",
    name: "HERO Footwear",
    label: "HERO",
    domain: sub("hero"),
    url: `https://${sub("hero")}`,
    // Commerce stays on Shopify. Do not rebuild checkout in Astro.
    platform: "shopify",
    app: null,
    role: "Retail and product lane: footwear, apparel, visual culture.",
    primaryCta: { label: "Shop the drop", href: "/collections/all", event: "product_click" },
    mustNotBecome: "A consulting or content hub.",
    inbox: INBOXES.hero,
    status: "live",
    inGlobalNav: true,
  },

  media: {
    key: "media",
    name: "Texas Movement Media",
    label: "Media",
    domain: sub("media"),
    url: `https://${sub("media")}`,
    platform: "astro-cloudflare",
    app: "apps/media",
    role: "Documentation and signal layer: series, long-form, live programming.",
    primaryCta: { label: "Watch the series", href: "/series", event: "yt_watch_click" },
    mustNotBecome: "A miscellaneous content dump.",
    inbox: INBOXES.media,
    status: "live",
    inGlobalNav: true,
  },

  distribution: {
    key: "distribution",
    name: "Texas Movement Distribution",
    label: "Distribution",
    domain: sub("distribution"),
    url: `https://${sub("distribution")}`,
    platform: "astro-cloudflare",
    app: "apps/distribution",
    role: "Rights, takedowns, and platform operations.",
    primaryCta: { label: "Open a rights request", href: "/request", event: "form_start" },
    mustNotBecome: "A general legal-services page.",
    inbox: INBOXES.distribution,
    status: "building",
    inGlobalNav: true,
  },

  reparations: {
    key: "reparations",
    name: "TM Reparations Partners",
    label: "Reparations",
    domain: sub("reparations"),
    url: `https://${sub("reparations")}`,
    platform: "astro-cloudflare",
    app: "apps/reparations",
    role: "Reparative capital research and systems design.",
    primaryCta: { label: "Read the research", href: "/research", event: "outbound_click" },
    mustNotBecome: "A fundraising or advocacy solicitation page.",
    inbox: INBOXES.reparations,
    status: "building",
    inGlobalNav: true,
  },

  social: {
    key: "social",
    name: "Texas Movement Social",
    label: "Social",
    domain: sub("social"),
    url: `https://${sub("social")}`,
    platform: "astro-cloudflare",
    app: "apps/social",
    role: "Public layer and events. The gather point, not the source of record.",
    primaryCta: { label: "See what's next", href: "/events", event: "outbound_click" },
    mustNotBecome: "The primary source of information about the business.",
    inbox: INBOXES.general,
    status: "building",
    inGlobalNav: true,
  },

  founder: {
    key: "founder",
    name: "Alexander Mathai",
    label: "Founder",
    domain: "alexandermathai.com",
    url: "https://alexandermathai.com",
    platform: "astro-cloudflare",
    app: null, // separate repo: lexmathai/AVM
    role: "Founder authority, selected thinking, speaking, ecosystem navigation.",
    primaryCta: { label: "Speaking & press", href: "/contact", event: "booking_click" },
    mustNotBecome: "A competing version of TMI.",
    inbox: INBOXES.founder,
    status: "live",
    inGlobalNav: true,
  },
} as const;

/** Ordered list. This order IS the global footer order. */
export const PROPERTY_ORDER: readonly PropertyKey[] = [
  "tmi",
  "consulting",
  "performance",
  "health",
  "hero",
  "media",
  "distribution",
  "reparations",
  "social",
  "founderlink",
  "founder",
] as const;

export const ALL_PROPERTIES: readonly Property[] = PROPERTY_ORDER.map((k) => PROPERTIES[k]);

/** Short lookup used everywhere instead of hard-coded strings. */
export const URLS = Object.fromEntries(
  PROPERTY_ORDER.map((k) => [k, PROPERTIES[k].url]),
) as Readonly<Record<PropertyKey, string>>;

export function getProperty(key: PropertyKey): Property {
  return PROPERTIES[key];
}

export function livePropertiesOnly(): readonly Property[] {
  return ALL_PROPERTIES.filter((p) => p.status === "live");
}
