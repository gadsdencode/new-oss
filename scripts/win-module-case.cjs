/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Node on Windows treats `C:\...` and `c:\...` as different module cache keys.
 * Next then gets two AsyncLocalStorage instances and static prerender throws
 * "Expected workUnitAsyncStorage to have a store". Normalize the drive letter
 * before the cache lookup. No-op on other platforms.
 */
"use strict";

if (process.platform === "win32") {
  const cwd = process.cwd();
  if (cwd.length >= 2 && cwd.charCodeAt(1) === 58) {
    const stableCwd = cwd.charAt(0).toUpperCase() + cwd.slice(1);
    try {
      process.chdir(stableCwd);
    } catch {
      // Keep the original directory if the normalized path cannot be used.
    }
  }

  const Module = require("module");
  const original = Module._resolveFilename;
  Module._resolveFilename = function resolveWithStableDriveLetter(request, parent, isMain, options) {
    const resolved = original.call(this, request, parent, isMain, options);
    if (typeof resolved === "string" && resolved.length >= 2 && resolved.charCodeAt(1) === 58) {
      return resolved.charAt(0).toUpperCase() + resolved.slice(1);
    }
    return resolved;
  };
}
