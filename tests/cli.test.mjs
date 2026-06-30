import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

const cli = new URL("../dist/cli.js", import.meta.url).pathname;

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
}

test("list prints agents, presets, profiles, and output paths", () => {
  const result = run(["list"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Agents:/);
  assert.match(result.stdout, /Presets:/);
  assert.match(result.stdout, /Profiles:/);
  assert.match(result.stdout, /Output paths:/);
});

test("preview prints generated content to stdout", () => {
  const result = run(["preview", "--profile", "typescript"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /# AGENTS.md/);
  assert.match(result.stdout, /TypeScript/);
});

test("unknown agent returns helpful error", () => {
  const result = run(["preview", "--agents", "codex,unknown-one"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown agent/);
  assert.match(result.stderr, /Available agents:/);
});
