import { describe, it, expect } from "vitest";
import {
  VERIFIED_INBOXES,
  isVerifiedInbox,
  liveFooterFor,
  liveSocialAccounts,
  verifiedGeneralContact,
  verifiedMediaContact,
  PROPERTIES,
  LEGAL_LINKS,
} from "../src/lib/site.ts";

describe("VERIFIED_INBOXES", () => {
  it("is empty until a human confirms an inbox", () => {
    expect(VERIFIED_INBOXES).toEqual([]);
  });

  it("isVerifiedInbox rejects everything while the list is empty", () => {
    expect(isVerifiedInbox("hello@texasmovement.com")).toBe(false);
    expect(isVerifiedInbox("media@texasmovement.com")).toBe(false);
    expect(isVerifiedInbox(undefined)).toBe(false);
    expect(isVerifiedInbox(null)).toBe(false);
  });
});

describe("verifiedGeneralContact / verifiedMediaContact", () => {
  it("return null when nothing is verified — never a placeholder CTA", () => {
    expect(verifiedGeneralContact()).toBeNull();
    expect(verifiedMediaContact()).toBeNull();
  });
});

describe("liveFooterFor", () => {
  it("only includes status: live properties", () => {
    const footer = liveFooterFor("media");
    for (const item of footer) {
      expect(PROPERTIES[item.key].status).toBe("live");
    }
  });

  it("excludes known building properties (distribution, reparations, social)", () => {
    const footer = liveFooterFor("media");
    const keys = footer.map((f) => f.key);
    expect(keys).not.toContain("distribution");
    expect(keys).not.toContain("reparations");
    expect(keys).not.toContain("social");
  });

  it("marks the current property (media) as isCurrent", () => {
    const footer = liveFooterFor("media");
    const mediaEntry = footer.find((f) => f.key === "media");
    expect(mediaEntry?.isCurrent).toBe(true);
  });
});

describe("liveSocialAccounts", () => {
  it("never includes an unresolved (TBD) url", () => {
    const accounts = liveSocialAccounts();
    for (const a of accounts) {
      expect(a.url).not.toBe("__TBD__");
    }
  });
});

describe("LEGAL_LINKS", () => {
  it("has the three required routes", () => {
    const hrefs = LEGAL_LINKS.map((l) => l.href);
    expect(hrefs).toEqual(["/privacy", "/terms", "/accessibility"]);
  });
});

describe("PROPERTIES.media", () => {
  it("has exactly the expected non-inbox-dependent primary CTA", () => {
    expect(PROPERTIES.media.primaryCta).toEqual({
      label: "Watch the series",
      href: "/series",
      event: "yt_watch_click",
    });
  });

  it("mustNotBecome guard is present and unmodified", () => {
    expect(PROPERTIES.media.mustNotBecome).toBe("A miscellaneous content dump.");
  });
});
