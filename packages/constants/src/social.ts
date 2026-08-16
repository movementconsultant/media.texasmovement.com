/**
 * Channel registry.
 *
 * Every account has ONE owning lane and ONE approved destination.
 * If an account cannot be assigned a lane, it should not exist.
 */
import { TBD } from "./types.ts";
import type { SocialAccount } from "./types.ts";

export const ACCOUNTS: readonly SocialAccount[] = [
  // --- Founder ---
  {
    platform: "tiktok",
    handle: "@AlexanderVMathai",
    url: "https://www.tiktok.com/@alexandervmathai",
    lane: "founder",
    primaryDestination: "founder",
    role: "discovery",
  },
  {
    platform: "instagram",
    handle: "@alexanderofnazareth",
    url: "https://instagram.com/alexanderofnazareth",
    lane: "founder",
    primaryDestination: "founder",
    role: "discovery",
  },
  {
    platform: "linkedin",
    handle: "in/alexandermathai",
    url: "https://www.linkedin.com/in/alexandermathai",
    lane: "founder",
    primaryDestination: "founder",
    role: "authority",
  },
  {
    platform: "substack",
    handle: "texasmovement",
    url: "https://texasmovement.substack.com",
    lane: "founder",
    primaryDestination: "founder",
    role: "owned-editorial",
  },

  // --- Media ---
  {
    platform: "youtube",
    handle: "@texasmovementmedia",
    url: "https://youtube.com/@texasmovementmedia",
    lane: "media",
    primaryDestination: "media",
    role: "authority",
  },
  {
    platform: "instagram",
    handle: "@tmmediausa",
    url: "https://instagram.com/tmmediausa",
    lane: "media",
    primaryDestination: "media",
    role: "discovery",
  },
  {
    platform: "instagram",
    handle: "@tmmusa",
    url: "https://instagram.com/tmmusa",
    lane: "media",
    primaryDestination: "media",
    role: "discovery",
  },
  {
    platform: "linkedin",
    handle: "company/texasmovement",
    url: "https://www.linkedin.com/company/texasmovement",
    lane: "tmi",
    primaryDestination: "tmi",
    role: "authority",
  },
  {
    platform: "tiktok",
    handle: TBD,
    url: TBD,
    lane: "media",
    primaryDestination: "media",
    role: "discovery",
  },

  // --- HERO ---
  {
    platform: "tiktok",
    handle: "@herofootwear",
    url: "https://www.tiktok.com/@herofootwear",
    lane: "hero",
    primaryDestination: "hero",
    role: "commerce",
  },
  {
    platform: "instagram",
    handle: "@herofootwearusa",
    url: "https://instagram.com/herofootwearusa",
    lane: "hero",
    primaryDestination: "hero",
    role: "commerce",
  },
  {
    platform: "youtube",
    handle: "@herofootwear",
    url: "https://youtube.com/@herofootwear",
    lane: "hero",
    primaryDestination: "hero",
    role: "commerce",
  },

  // --- Performance ---
  {
    platform: "youtube",
    handle: "@texasmovementperformance",
    url: "https://youtube.com/@texasmovementperformance",
    lane: "performance",
    primaryDestination: "performance",
    role: "authority",
  },
  {
    platform: "instagram",
    handle: TBD,
    url: TBD,
    lane: "performance",
    primaryDestination: "performance",
    role: "discovery",
  },
] as const;

export function accountsForLane(lane: SocialAccount["lane"]): readonly SocialAccount[] {
  return ACCOUNTS.filter((a) => a.lane === lane);
}

export function accountsOn(platform: SocialAccount["platform"]): readonly SocialAccount[] {
  return ACCOUNTS.filter((a) => a.platform === platform);
}

/** Confirmed accounts only — safe to render in a footer. */
export function publishableAccounts(): readonly SocialAccount[] {
  return ACCOUNTS.filter((a) => a.url !== TBD);
}
