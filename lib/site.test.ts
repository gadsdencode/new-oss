// lib/site.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SITE_ORIGIN, SITE_WWW_HOST, absoluteUrl } from "./site";
import { coePageMetadata } from "./coe/page-seo";

describe("site origin conventions", () => {
  it("prefers apex overture-systems.com", () => {
    assert.equal(SITE_ORIGIN, "https://overture-systems.com");
    assert.equal(SITE_WWW_HOST, "www.overture-systems.com");
  });

  it("builds absolute URLs on the preferred host", () => {
    assert.equal(absoluteUrl("/ai-center-of-excellence"), "https://overture-systems.com/ai-center-of-excellence");
    assert.equal(absoluteUrl("contact"), "https://overture-systems.com/contact");
  });
});

describe("coePageMetadata canonicalization", () => {
  it("sets absolute canonical and OG url without query strings", () => {
    const meta = coePageMetadata({
      title: "Getting Started",
      description: "Tier finder",
      path: "/ai-center-of-excellence/getting-started?stage=planning",
      ogImage: "/images/coe/coe-getting-started-og.jpg",
    });
    assert.equal(
      meta.alternates?.canonical,
      "https://overture-systems.com/ai-center-of-excellence/getting-started"
    );
    assert.equal(
      meta.openGraph && "url" in meta.openGraph ? meta.openGraph.url : null,
      "https://overture-systems.com/ai-center-of-excellence/getting-started"
    );
  });
});
