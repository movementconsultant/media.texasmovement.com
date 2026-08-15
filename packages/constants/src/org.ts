/**
 * Legal + identity constants.
 *
 * Anything that appears in a footer, a contract, a schema.org block, an
 * email signature, or a policy page comes from HERE. Not from a template.
 */
import { TBD } from "./types.ts";

export const ORG = {
  /** Exact legal name. Use verbatim in policies, contracts, and JSON-LD. */
  legalName: "Texas Movement International LLC",
  /** Short form for UI. */
  shortName: "Texas Movement",
  /** Initialism. Never expand it inconsistently. */
  initials: "TMI",
  entityType: "LLC",
  /** Fill from the filed Certificate of Formation. */
  stateOfFormation: TBD,
  formationYear: TBD,
  /** Public-facing mailing address. Do NOT publish a home address. */
  mailingAddress: {
    street: TBD,
    city: "Chicago",
    region: "IL",
    postalCode: TBD,
    country: "US",
  },
  tagline: "Systems for people who move",
  /** One sentence. This is the boilerplate used everywhere. */
  boilerplate:
    "Texas Movement International is a systems company building infrastructure for founders, athletes, and cities.",
} as const;

export const FOUNDER = {
  legalName: "Alexander Varghese Mathai",
  publicName: "Alexander Mathai",
  brandName: "Lex Mathai",
  title: "Founder & President",
  site: "https://alexandermathai.com",
  /** Do not publish a personal Gmail anywhere. Ever. */
  publicEmail: "alexander@texasmovement.com",
} as const;

/**
 * Lane inboxes. Pattern: <lane>@texasmovement.com
 * One inbox per lane. No shared catch-all as a primary CTA.
 */
export const INBOXES = {
  general: "hello@texasmovement.com",
  founder: "alexander@texasmovement.com",
  founderlink: "founderlink@texasmovement.com",
  consulting: "consulting@texasmovement.com",
  performance: "performance@texasmovement.com",
  health: "health@texasmovement.com",
  media: "media@texasmovement.com",
  distribution: "distribution@texasmovement.com",
  reparations: "reparations@texasmovement.com",
  hero: "support@texasmovement.com",
  press: "press@texasmovement.com",
  legal: "legal@texasmovement.com",
  privacy: "privacy@texasmovement.com",
} as const;

/** Language that must appear on the relevant lanes. Non-negotiable. */
export const DISCLAIMERS = {
  performance:
    "Texas Movement Performance provides movement education, assessment, and training. It does not diagnose, treat, or provide medical care. Consult a licensed clinician for medical concerns.",
  health:
    "Information provided is educational and is not medical advice. No statement here has been evaluated by the FDA and nothing is intended to diagnose, treat, cure, or prevent any disease.",
  reparations:
    "Research and systems-design work. Nothing published constitutes legal, tax, or investment advice.",
  results:
    "Outcomes described reflect specific engagements and are not a guarantee of future results.",
  legal:
    "Nothing on this site is legal advice and no attorney-client relationship is created by contacting us.",
} as const;
