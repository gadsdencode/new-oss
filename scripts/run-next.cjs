/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Start Next with the Windows module-cache preload.
 * Next copies NODE_OPTIONS into static-generation workers, so --require on the
 * parent command line is not enough by itself.
 */
"use strict";

const { spawn } = require("node:child_process");
const path = require("node:path");

const preload = path.join(__dirname, "win-module-case.cjs").replace(/\\/g, "/");
const nextBin = path.join(__dirname, "..", "node_modules", "next", "dist", "bin", "next");
const requireArg = `--require=${preload}`;
const existing = process.env.NODE_OPTIONS ?? "";
const nodeOptions = existing.includes(preload) ? existing : `${existing} ${requireArg}`.trim();

const child = spawn(process.execPath, [nextBin, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, NODE_OPTIONS: nodeOptions },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
