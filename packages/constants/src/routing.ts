/**
 * One intake logic.
 *
 * Specific need -> specific lane form.
 * Ambiguous, multi-lane, partnership, press, or institutional -> FounderLink.
 */
import { INBOXES } from "./org.ts";
import { PROPERTIES } from "./ecosystem.ts";
import type { InquiryKind, RoutingRule, PropertyKey } from "./types.ts";

export const ROUTING: Readonly<Record<InquiryKind, RoutingRule>> = {
  consulting_project: {
    kind: "consulting_project",
    destination: "consulting",
    path: "/start",
    ownerInbox: INBOXES.consulting,
    responseTargetHours: 48,
  },
  performance_training: {
    kind: "performance_training",
    destination: "performance",
    path: "/evaluation",
    ownerInbox: INBOXES.performance,
    responseTargetHours: 48,
  },
  health_recovery: {
    kind: "health_recovery",
    destination: "health",
    path: "/contact",
    ownerInbox: INBOXES.health,
    responseTargetHours: 72,
  },
  hero_order_support: {
    kind: "hero_order_support",
    destination: "hero",
    path: "/pages/contact",
    ownerInbox: INBOXES.hero,
    responseTargetHours: 24,
  },
  media_collaboration: {
    kind: "media_collaboration",
    destination: "media",
    path: "/collaborate",
    ownerInbox: INBOXES.media,
    responseTargetHours: 72,
  },
  distribution_rights: {
    kind: "distribution_rights",
    destination: "distribution",
    path: "/request",
    ownerInbox: INBOXES.distribution,
    responseTargetHours: 48,
  },
  reparations_research: {
    kind: "reparations_research",
    destination: "reparations",
    path: "/contact",
    ownerInbox: INBOXES.reparations,
    responseTargetHours: 72,
  },
  speaking_or_press: {
    kind: "speaking_or_press",
    destination: "founder",
    path: "/contact",
    ownerInbox: INBOXES.press,
    responseTargetHours: 48,
  },
  partnership: {
    kind: "partnership",
    destination: "founderlink",
    path: "/brief",
    ownerInbox: INBOXES.founderlink,
    responseTargetHours: 72,
  },
  institutional: {
    kind: "institutional",
    destination: "founderlink",
    path: "/brief",
    ownerInbox: INBOXES.founderlink,
    responseTargetHours: 72,
  },
  unclear_or_cross_lane: {
    kind: "unclear_or_cross_lane",
    destination: "founderlink",
    path: "/brief",
    ownerInbox: INBOXES.founderlink,
    responseTargetHours: 72,
  },
} as const;

/** The default when you cannot classify. Never leave a visitor with no route. */
export const DEFAULT_ROUTE: InquiryKind = "unclear_or_cross_lane";

/** Resolve an inquiry to a real, absolute destination URL. */
export function routeInquiry(kind: InquiryKind = DEFAULT_ROUTE): {
  url: string;
  inbox: string;
  responseTargetHours: number;
  destination: PropertyKey;
} {
  const rule = ROUTING[kind] ?? ROUTING[DEFAULT_ROUTE];
  return {
    url: `${PROPERTIES[rule.destination].url}${rule.path}`,
    inbox: rule.ownerInbox,
    responseTargetHours: rule.responseTargetHours,
    destination: rule.destination,
  };
}

/** Fields every FounderLink brief must capture. Keep this list stable. */
export const BRIEF_FIELDS = [
  "name",
  "email",
  "organization",
  "lane_guess",
  "problem_statement",
  "current_state",
  "desired_outcome",
  "timeline",
  "budget_range",
  "how_found_us",
  "consent_to_contact",
] as const;
