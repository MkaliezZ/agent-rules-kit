import assert from "node:assert/strict";
import test from "node:test";
import { getAgent, getProfile, renderTemplate } from "../dist/index.js";

test("template rendering includes core sections", () => {
  const content = renderTemplate({
    filePath: "CLAUDE.md",
    profile: getProfile("typescript"),
    compatibleAgents: [getAgent("claude")]
  });
  assert.match(content, /# Project Instructions/);
  assert.match(content, /## Project Overview/);
  assert.match(content, /## Development Commands/);
  assert.match(content, /## Coding Rules/);
  assert.match(content, /## Testing Rules/);
  assert.match(content, /## File Modification Rules/);
  assert.match(content, /## Safety Rules/);
  assert.match(content, /## Final Response Format/);
});

test("cursor template uses MDC frontmatter", () => {
  const content = renderTemplate({
    filePath: ".cursor/rules/project.mdc",
    profile: getProfile("generic"),
    compatibleAgents: [getAgent("cursor")]
  });
  assert.match(content, /^---\ndescription: Project rules for AI coding assistance\nalwaysApply: true\n---/);
});

test("copilot path template uses applyTo frontmatter", () => {
  const content = renderTemplate({
    filePath: ".github/instructions/general.instructions.md",
    profile: getProfile("generic"),
    compatibleAgents: [getAgent("copilot-path")]
  });
  assert.match(content, /^---\napplyTo: "\*\*"\n---/);
});

test("aider config generation is minimal and credential-free", () => {
  const content = renderTemplate({
    filePath: ".aider.conf.yml",
    profile: getProfile("generic"),
    compatibleAgents: [getAgent("aider")]
  });
  assert.equal(content, "read:\n  - CONVENTIONS.md\n");
  assert.doesNotMatch(content, /api|key|token/i);
});
