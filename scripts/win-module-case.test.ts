import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

describe("Windows module path casing", () => {
  it("loads one Next async-storage instance for both drive-letter casings", () => {
    if (process.platform !== "win32") {
      return;
    }
    const preload = path.join(process.cwd(), "scripts", "win-module-case.cjs");
    const result = spawnSync(process.execPath, ["--require", preload, "-e", `
      const real = require.resolve("next/dist/server/app-render/work-unit-async-storage-instance");
      const flipped = (real[0] === "C" ? "c" : "C") + real.slice(1);
      const first = require(real);
      const second = require(flipped);
      if (first.workUnitAsyncStorageInstance !== second.workUnitAsyncStorageInstance) {
        process.exit(2);
      }
    `], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
  });
});
