import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveNavigationTarget } from "./site-routes";

describe("published navigation validation", () => {
  it("allows published paths, section anchors, and known contact intents", () => {
    const services = resolveNavigationTarget("/consulting", "services");
    assert.equal(services.ok, true);
    if (services.ok) {
      assert.equal(services.href, "/consulting#services");
    }
    const contact = resolveNavigationTarget("/contact?intent=diagnostic");
    assert.equal(contact.ok, true);
    if (contact.ok) {
      assert.equal(contact.href, "/contact?intent=diagnostic");
    }
  });

  it("rejects external URLs, unknown pages, and unknown anchors", () => {
    for (const candidate of ["https://evil.example/consulting", "//evil.example", "javascript:alert(1)", "/not-a-page", "/consulting/../../etc/passwd"]) {
      const resolved = resolveNavigationTarget(candidate);
      assert.equal(resolved.ok, false, candidate);
    }
    const anchor = resolveNavigationTarget("/consulting", "https://evil.example");
    assert.equal(anchor.ok, false);
    const query = resolveNavigationTarget("/contact?intent=book-a-meeting");
    assert.equal(query.ok, false);
  });
});
