import type { AgentDefinition, AgentId } from "./types.js";

export const agents: AgentDefinition[] = [
  {
    id: "codex",
    displayName: "Codex",
    outputFiles: ["AGENTS.md"],
    notes: "Uses the portable AGENTS.md project instructions convention.",
    aliases: ["codex", "openai-codex", "chatgpt-codex"]
  },
  {
    id: "opencode",
    displayName: "opencode",
    outputFiles: ["AGENTS.md"],
    notes: "Uses AGENTS.md-compatible project instructions.",
    aliases: ["opencode", "open-code"]
  },
  {
    id: "factory",
    displayName: "Factory",
    outputFiles: ["AGENTS.md"],
    notes: "Best-effort AGENTS.md compatibility.",
    aliases: ["factory"],
    bestEffort: true
  },
  {
    id: "zed",
    displayName: "Zed",
    outputFiles: ["AGENTS.md", ".rules"],
    notes: "Best-effort compatibility for Zed and .rules consumers.",
    aliases: ["zed", "zed-agent"],
    bestEffort: true
  },
  {
    id: "claude",
    displayName: "Claude Code",
    outputFiles: ["CLAUDE.md"],
    notes: "Claude Code project instructions.",
    aliases: ["claude", "claude-code", "anthropic"]
  },
  {
    id: "gemini",
    displayName: "Gemini CLI",
    outputFiles: ["GEMINI.md"],
    notes: "Gemini CLI project instructions.",
    aliases: ["gemini", "gemini-cli", "google-gemini"]
  },
  {
    id: "cursor",
    displayName: "Cursor",
    outputFiles: [".cursor/rules/project.mdc"],
    notes: "Cursor MDC project rule.",
    aliases: ["cursor"]
  },
  {
    id: "copilot",
    displayName: "GitHub Copilot",
    outputFiles: [".github/copilot-instructions.md"],
    notes: "GitHub Copilot repository-wide custom instructions.",
    aliases: ["copilot", "github-copilot", "vscode-copilot"]
  },
  {
    id: "copilot-path",
    displayName: "GitHub Copilot path rules",
    outputFiles: [".github/instructions/general.instructions.md"],
    notes: "GitHub Copilot instructions file with applyTo frontmatter.",
    aliases: ["copilot-path", "github-copilot-path", "copilot-instructions-path"]
  },
  {
    id: "cline",
    displayName: "Cline",
    outputFiles: [".clinerules"],
    notes: "Cline rules file.",
    aliases: ["cline"]
  },
  {
    id: "windsurf",
    displayName: "Windsurf / Cascade",
    outputFiles: [".windsurfrules", ".windsurf/rules/project.md"],
    notes: "Best-effort support for current Windsurf rule file patterns.",
    aliases: ["windsurf", "codeium", "cascade"],
    bestEffort: true
  },
  {
    id: "roo",
    displayName: "Roo Code",
    outputFiles: [".roo/rules/project.md", ".roorules"],
    notes: "Best-effort support for Roo Code rule file patterns.",
    aliases: ["roo", "roo-code"],
    bestEffort: true
  },
  {
    id: "continue",
    displayName: "Continue",
    outputFiles: [".continue/rules/project.md"],
    notes: "Best-effort Continue rules file.",
    aliases: ["continue", "continue-dev"],
    bestEffort: true
  },
  {
    id: "aider",
    displayName: "Aider",
    outputFiles: ["CONVENTIONS.md", ".aider.conf.yml"],
    notes: "Aider conventions plus a minimal config that reads them.",
    aliases: ["aider"]
  },
  {
    id: "devin",
    displayName: "Devin",
    outputFiles: ["AGENTS.md", ".rules"],
    notes: "Best-effort AGENTS.md and .rules compatibility.",
    aliases: ["devin", "devin-cli"],
    bestEffort: true
  },
  {
    id: "trae",
    displayName: "TRAE",
    outputFiles: [".rules"],
    notes: "Best-effort .rules compatibility.",
    aliases: ["trae"],
    bestEffort: true
  },
  {
    id: "generic",
    displayName: "generic agents",
    outputFiles: ["AGENTS.md"],
    notes: "Portable AGENTS.md instructions for tools that read generic project rules.",
    aliases: ["generic", "agents-md"],
    bestEffort: true
  }
];

const byId = new Map<AgentId, AgentDefinition>(agents.map((agent) => [agent.id, agent]));
const byAlias = new Map<string, AgentDefinition>(
  agents.flatMap((agent) => agent.aliases.map((alias) => [alias, agent] as const))
);

export function getAgent(id: AgentId): AgentDefinition {
  const agent = byId.get(id);
  if (!agent) {
    throw new Error(`Unknown agent id: ${id}`);
  }
  return agent;
}

export function resolveAgent(input: string): AgentDefinition | undefined {
  return byAlias.get(input.trim().toLowerCase());
}

export function resolveAgents(inputs: string[]): { agents: AgentDefinition[]; unknown: string[] } {
  const found = new Map<AgentId, AgentDefinition>();
  const unknown: string[] = [];

  for (const input of inputs) {
    const normalized = input.trim();
    if (!normalized) {
      continue;
    }
    const agent = resolveAgent(normalized);
    if (!agent) {
      unknown.push(normalized);
      continue;
    }
    found.set(agent.id, agent);
  }

  return { agents: [...found.values()], unknown };
}

export function availableAgentIds(): AgentId[] {
  return agents.map((agent) => agent.id);
}
