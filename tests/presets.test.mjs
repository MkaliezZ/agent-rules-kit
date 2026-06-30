import assert from "node:assert/strict";
import test from "node:test";
import { getPreset, presets } from "../dist/index.js";

test("preset selection returns expected core agents", () => {
  assert.deepEqual(getPreset("core"), ["codex", "opencode", "claude", "gemini", "copilot", "cursor", "cline"]);
});

test("broad preset covers all MVP agents", () => {
  assert.equal(presets.broad.length, 17);
  assert.ok(presets.broad.includes("aider"));
  assert.ok(presets.broad.includes("copilot-path"));
  assert.ok(presets.broad.includes("generic"));
});

test("minimal preset generates a portable AGENTS.md selection", () => {
  assert.deepEqual(getPreset("minimal"), ["generic"]);
});
