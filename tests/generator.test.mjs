import assert from "node:assert/strict";
import test from "node:test";
import { planFiles } from "../dist/index.js";

test("duplicate output paths are deduplicated", () => {
  const files = planFiles({ agents: ["codex", "opencode", "factory", "zed", "devin", "generic"] });
  const agentsFile = files.find((file) => file.path === "AGENTS.md");
  assert.ok(agentsFile);
  assert.equal(files.filter((file) => file.path === "AGENTS.md").length, 1);
  assert.deepEqual(
    agentsFile.compatibleAgents.map((agent) => agent.id),
    ["codex", "opencode", "factory", "zed", "devin", "generic"]
  );
});

test("broad preset output coverage matches expected files", () => {
  const files = planFiles({ preset: "broad" }).map((file) => file.path);
  assert.deepEqual(files, [
    "AGENTS.md",
    ".rules",
    "CLAUDE.md",
    "GEMINI.md",
    ".cursor/rules/project.mdc",
    ".github/copilot-instructions.md",
    ".github/instructions/general.instructions.md",
    ".clinerules",
    ".windsurfrules",
    ".windsurf/rules/project.md",
    ".roo/rules/project.md",
    ".roorules",
    ".continue/rules/project.md",
    "CONVENTIONS.md",
    ".aider.conf.yml"
  ]);
});

test("custom agent selection overrides preset", () => {
  const files = planFiles({ preset: "broad", agents: ["claude"] }).map((file) => file.path);
  assert.deepEqual(files, ["CLAUDE.md"]);
});
