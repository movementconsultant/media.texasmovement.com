/**
 * The global navigation contract.
 *
 * Every property renders the SAME ecosystem footer, in the SAME order.
 * Page-level nav is separate and belongs to the individual property.
 */
import { PROPERTIES, PROPERTY_ORDER } from "./ecosystem.ts";
import type { PropertyKey } from "./types.ts";

export interface NavItem {
  readonly key: PropertyKey;
  readonly label: string;
  readonly href: string;
}

/** Ecosystem footer. Identical on all 11 properties. */
export const GLOBAL_FOOTER: readonly NavItem[] = PROPERTY_ORDER.filter(
  (k) => PROPERTIES[k].inGlobalNav,
).map((k) => ({ key: k, label: PROPERTIES[k].label, href: PROPERTIES[k].url }));

/** Legal links required on every property. */
export const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
] as const;

/**
 * Build the footer for a given property with the current site marked,
 * so you never link a page to itself.
 */
export function footerFor(current: PropertyKey): readonly (NavItem & { isCurrent: boolean })[] {
  return GLOBAL_FOOTER.map((item) => ({ ...item, isCurrent: item.key === current }));
}
