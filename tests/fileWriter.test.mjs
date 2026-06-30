import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { generate } from "../dist/index.js";

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ark-test-"));
}

test("dry-run behavior does not write files", () => {
  const outputDirectory = tempDir();
  const result = generate({ outputDirectory, dryRun: true, profile: "typescript" });
  assert.ok(result.written.some((file) => file.path === "AGENTS.md"));
  assert.equal(fs.existsSync(path.join(outputDirectory, "AGENTS.md")), false);
});

test("no overwrite without --force", () => {
  const outputDirectory = tempDir();
  const target = path.join(outputDirectory, "AGENTS.md");
  fs.writeFileSync(target, "existing", "utf8");
  const result = generate({ outputDirectory, agents: ["codex"] });
  assert.equal(fs.readFileSync(target, "utf8"), "existing");
  assert.deepEqual(result.skipped.map((file) => file.path), ["AGENTS.md"]);
});

test("overwrite with --force", () => {
  const outputDirectory = tempDir();
  const target = path.join(outputDirectory, "AGENTS.md");
  fs.writeFileSync(target, "existing", "utf8");
  const result = generate({ outputDirectory, agents: ["codex"], force: true });
  assert.equal(result.skipped.length, 0);
  assert.match(fs.readFileSync(target, "utf8"), /Project Instructions/);
});

test("file path generation creates nested directories", () => {
  const outputDirectory = tempDir();
  generate({ outputDirectory, agents: ["cursor"], force: true });
  assert.equal(fs.existsSync(path.join(outputDirectory, ".cursor/rules/project.mdc")), true);
});
