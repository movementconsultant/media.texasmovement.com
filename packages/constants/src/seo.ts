/**
 * SEO defaults + structured data.
 *
 * Every page: unique title, unique description, canonical, OG image,
 * sitemap entry, robots directive. No page ships without all six.
 */
import { ORG, FOUNDER } from "./org.ts";
import { PROPERTIES } from "./ecosystem.ts";
import { publishableAccounts } from "./social.ts";
import type { PropertyKey } from "./types.ts";

export const TITLE_SEPARATOR = " — ";
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** Default OG image path, resolved per property. Ship a real 1200x630 for each. */
export function ogImage(property: PropertyKey): string {
  return `${PROPERTIES[property].url}/og-${property}.png`;
}

export function pageTitle(property: PropertyKey, page: string): string {
  const brand = PROPERTIES[property].name;
  const t = page ? `${page}${TITLE_SEPARATOR}${brand}` : brand;
  return t.length > TITLE_MAX ? `${page}${TITLE_SEPARATOR}${PROPERTIES[property].label}` : t;
}

/** schema.org Organization. Emit ONCE, on texasmovement.com. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG.legalName,
    alternateName: ORG.shortName,
    url: PROPERTIES.tmi.url,
    logo: `${PROPERTIES.tmi.url}/logo.png`,
    description: ORG.boilerplate,
    founder: {
      "@type": "Person",
      name: FOUNDER.legalName,
      alternateName: FOUNDER.publicName,
      jobTitle: FOUNDER.title,
      url: FOUNDER.site,
    },
    sameAs: publishableAccounts().map((a) => a.url),
  };
}

/** schema.org Person. Emit ONCE, on alexandermathai.com. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: FOUNDER.legalName,
    alternateName: [FOUNDER.publicName, FOUNDER.brandName],
    jobTitle: FOUNDER.title,
    url: FOUNDER.site,
    worksFor: { "@type": "Organization", name: ORG.legalName, url: PROPERTIES.tmi.url },
    sameAs: publishableAccounts()
      .filter((a) => a.lane === "founder")
      .map((a) => a.url),
  };
}

/** Robots defaults. Staging and preview hosts must be noindex. */
export const ROBOTS = {
  production: "index, follow, max-image-preview:large",
  staging: "noindex, nofollow",
} as const;
