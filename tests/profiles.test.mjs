import assert from "node:assert/strict";
import test from "node:test";
import { getProfile, profiles } from "../dist/index.js";

test("profile registry includes MVP profiles", () => {
  assert.deepEqual(Object.keys(profiles), ["generic", "typescript", "python", "next", "tauri", "rust", "go", "react", "node"]);
});

test("typescript profile includes required details", () => {
  const profile = getProfile("typescript");
  assert.match(profile.overview, /TypeScript/);
  assert.match(profile.developmentCommands.join(" "), /npm/);
  assert.match(profile.codingRules.join(" "), /strict typing/);
});
