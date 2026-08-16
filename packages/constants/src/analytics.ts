/**
 * Standardized event names across the whole ecosystem.
 *
 * Separate analytics properties are fine. Event names are NOT.
 * If you invent a new event name in an app, the weekly dashboard breaks.
 */
import type { AnalyticsEventName, PropertyKey } from "./types.ts";

export const EVENTS: Readonly<Record<AnalyticsEventName, string>> = {
  lane_click: "lane_click",
  form_start: "form_start",
  form_submit: "form_submit",
  email_signup: "email_signup",
  product_click: "product_click",
  checkout_start: "checkout_start",
  yt_subscribe_click: "yt_subscribe_click",
  yt_watch_click: "yt_watch_click",
  outbound_click: "outbound_click",
  brief_submit: "brief_submit",
  booking_click: "booking_click",
} as const;

/** Every event carries these. No exceptions. */
export interface EventPayload {
  readonly property: PropertyKey;
  readonly lane: PropertyKey;
  readonly destination?: PropertyKey;
  readonly label?: string;
}

/** The weekly dashboard. If a metric is not here, it is not a KPI yet. */
export const WEEKLY_KPIS = [
  "qualified_founderlink_briefs",
  "consulting_leads",
  "performance_leads",
  "hero_email_captures",
  "hero_orders",
  "youtube_subscribers_delta",
  "youtube_watch_hours",
  "referral_sessions_by_channel",
] as const;

/** UTM source values. Fixed vocabulary — do not free-type these. */
export const UTM_SOURCES = [
  "youtube",
  "instagram",
  "tiktok",
  "linkedin",
  "substack",
  "facebook",
  "x",
  "email",
  "qr",
  "direct-print",
] as const;

export type UtmSource = (typeof UTM_SOURCES)[number];
