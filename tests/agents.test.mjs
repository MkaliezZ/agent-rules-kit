import assert from "node:assert/strict";
import test from "node:test";
import { agents, resolveAgent, resolveAgents } from "../dist/index.js";

test("agent registry includes MVP agents", () => {
  const ids = agents.map((agent) => agent.id);
  assert.deepEqual(ids, [
    "codex",
    "opencode",
    "factory",
    "zed",
    "claude",
    "gemini",
    "cursor",
    "copilot",
    "copilot-path",
    "cline",
    "windsurf",
    "roo",
    "continue",
    "aider",
    "devin",
    "trae",
    "generic"
  ]);
});

test("agent aliases resolve to canonical agents", () => {
  assert.equal(resolveAgent("openai-codex")?.id, "codex");
  assert.equal(resolveAgent("claude-code")?.id, "claude");
  assert.equal(resolveAgent("github-copilot")?.id, "copilot");
  assert.equal(resolveAgent("google-gemini")?.id, "gemini");
  assert.equal(resolveAgent("roo-code")?.id, "roo");
});

test("unknown agents are returned without throwing", () => {
  const result = resolveAgents(["codex", "missing-agent"]);
  assert.equal(result.agents.length, 1);
  assert.deepEqual(result.unknown, ["missing-agent"]);
});
