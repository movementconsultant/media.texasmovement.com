/**
 * The editorial loop and taxonomy.
 *
 * TMM does not invent content calendars. It documents work the other
 * lanes already produced.
 */
import type { EditorialCategory, PropertyKey } from "./types.ts";

export const CATEGORIES: Readonly<
  Record<EditorialCategory, { label: string; owningLane: PropertyKey }>
> = {
  systems: { label: "Systems", owningLane: "consulting" },
  performance: { label: "Performance", owningLane: "performance" },
  product: { label: "Product", owningLane: "hero" },
  founder: { label: "Founder", owningLane: "founder" },
  culture: { label: "Culture", owningLane: "social" },
  "field-notes": { label: "Field Notes", owningLane: "media" },
} as const;

/** Six content pillars carried from the 2027 blueprint. */
export const PILLARS = [
  "digital-empire-building",
  "brand-strategy",
  "entrepreneurship",
  "performance",
  "culture-and-identity",
  "build-in-public",
] as const;

/** The compounding engine. Every asset must be able to name its stage. */
export const LOOP = [
  "work_completed",
  "documented_by_media",
  "longform_published",
  "shortform_extracted",
  "routed_to_landing_page",
  "conversion_or_brief",
] as const;

/** Platform jobs. One job per platform. No platform does two jobs. */
export const PLATFORM_JOBS = {
  youtube: "authority-and-discovery",
  substack: "owned-editorial",
  instagram: "visual-identity",
  tiktok: "discovery",
  facebook: "community",
  linkedin: "b2b-authority",
  websites: "ownership-and-conversion",
} as const;

/** Publishing checklist. Nothing ships public without all boxes true. */
export const PUBLISH_CHECKLIST = [
  "category_assigned",
  "owning_lane_assigned",
  "single_destination_url_set",
  "utm_tagged",
  "claims_verified_or_removed",
  "consent_obtained_for_any_named_person",
  "no_private_client_health_or_legal_detail",
  "disclaimer_present_if_lane_requires_one",
  "og_image_and_meta_set",
] as const;
