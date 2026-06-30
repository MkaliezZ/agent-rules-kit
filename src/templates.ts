import type { RenderContext } from "./types.js";

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function compatibleLine(context: RenderContext): string {
  if (context.filePath === "AGENTS.md") {
    return "Compatible with: Codex, opencode, Factory, Zed, Devin, and generic AGENTS.md-aware tools.";
  }

  const names = context.compatibleAgents.map((agent) => agent.displayName).join(", ");
  return `Compatible with: ${names}.`;
}

function titleForFile(filePath: string): string {
  if (filePath === "CONVENTIONS.md") {
    return "# Coding Conventions";
  }
  if (filePath === ".aider.conf.yml") {
    return "";
  }
  return "# Project Instructions";
}

function frontmatterForFile(filePath: string): string {
  if (filePath === ".github/instructions/general.instructions.md") {
    return "---\napplyTo: \"**\"\n---\n\n";
  }
  if (filePath === ".cursor/rules/project.mdc") {
    return "---\ndescription: Project rules for AI coding assistance\nalwaysApply: true\n---\n\n";
  }
  return "";
}

export function renderTemplate(context: RenderContext): string {
  if (context.filePath === ".aider.conf.yml") {
    return "read:\n  - CONVENTIONS.md\n";
  }

  const profile = context.profile;
  const title = titleForFile(context.filePath);
  const sections = [
    title,
    compatibleLine(context),
    "",
    "## Project Overview",
    profile.overview,
    "",
    "## Development Commands",
    bulletList(profile.developmentCommands),
    "",
    "## Coding Rules",
    bulletList(profile.codingRules),
    "",
    "## Testing Rules",
    bulletList(profile.testingRules),
    "",
    "## Build Commands",
    bulletList(profile.buildCommands),
    "",
    "## File Modification Rules",
    bulletList(profile.fileModificationRules),
    "",
    "## Safety Rules",
    bulletList(profile.safetyRules),
    "",
    "## Final Response Format",
    bulletList(profile.finalResponseRules),
    ""
  ];

  return frontmatterForFile(context.filePath) + sections.join("\n");
}
