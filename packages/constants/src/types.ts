/**
 * @tmi/constants — shared types
 *
 * RULE: every literal fact about the ecosystem is typed here first,
 * then filled in exactly once elsewhere in this package.
 */

/** Sentinel for values that are not confirmed yet. */
export const TBD = "__TBD__";
export type Tbd = typeof TBD;

/** A value that may not be confirmed yet. `scripts/check.mjs` reports every one. */
export type Maybe<T extends string> = T | Tbd;

export type PropertyKey =
  | "tmi"
  | "founderlink"
  | "consulting"
  | "performance"
  | "health"
  | "hero"
  | "media"
  | "distribution"
  | "reparations"
  | "social"
  | "founder";

export type Platform = "astro-cloudflare" | "shopify" | "external";

export type PropertyStatus = "live" | "building" | "planned" | "retired";

export interface Property {
  /** Stable machine key. NEVER rename — used in analytics, UTM, and routing. */
  readonly key: PropertyKey;
  /** Full public name. */
  readonly name: string;
  /** Short label used in the global footer. */
  readonly label: string;
  /** Hostname with no protocol and no trailing slash. */
  readonly domain: string;
  /** Canonical absolute origin. */
  readonly url: string;
  /** Where it is built and hosted. */
  readonly platform: Platform;
  /** Monorepo app directory, or null if it does not live in tmi-web. */
  readonly app: string | null;
  /** One sentence: the job this property does in the system. */
  readonly role: string;
  /** The single primary conversion. One per property. Not two. */
  readonly primaryCta: Cta;
  /** The failure mode this property must never drift into. */
  readonly mustNotBecome: string;
  /** Lane-specific inbox. */
  readonly inbox: Maybe<string>;
  readonly status: PropertyStatus;
  /** Include in the global ecosystem footer? */
  readonly inGlobalNav: boolean;
}

export interface Cta {
  readonly label: string;
  /** Absolute URL, or a path resolved against the property's own origin. */
  readonly href: string;
  readonly event: AnalyticsEventName;
}

export type AnalyticsEventName =
  | "lane_click"
  | "form_start"
  | "form_submit"
  | "email_signup"
  | "product_click"
  | "checkout_start"
  | "yt_subscribe_click"
  | "yt_watch_click"
  | "outbound_click"
  | "brief_submit"
  | "booking_click";

export type SocialPlatform =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "substack"
  | "facebook"
  | "x";

export interface SocialAccount {
  readonly platform: SocialPlatform;
  /** @handle including the @, or company slug for LinkedIn. */
  readonly handle: Maybe<string>;
  readonly url: Maybe<string>;
  /** Exactly one lane owns each account. No shared ownership. */
  readonly lane: PropertyKey;
  /** The one approved destination for this account's links. */
  readonly primaryDestination: PropertyKey;
  readonly role: "discovery" | "authority" | "owned-editorial" | "community" | "commerce";
}

export type InquiryKind =
  | "consulting_project"
  | "performance_training"
  | "health_recovery"
  | "hero_order_support"
  | "media_collaboration"
  | "distribution_rights"
  | "reparations_research"
  | "speaking_or_press"
  | "partnership"
  | "institutional"
  | "unclear_or_cross_lane";

export interface RoutingRule {
  readonly kind: InquiryKind;
  readonly destination: PropertyKey;
  readonly path: string;
  readonly ownerInbox: Maybe<string>;
  /** Stated publicly. If you cannot hold it, change the number, not the promise. */
  readonly responseTargetHours: number;
}

export type EditorialCategory =
  | "systems"
  | "performance"
  | "product"
  | "founder"
  | "culture"
  | "field-notes";
