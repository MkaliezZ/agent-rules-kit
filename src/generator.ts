import { getAgent, resolveAgents } from "./agents.js";
import { getPreset } from "./presets.js";
import { getProfile } from "./profiles.js";
import { resolveOutputDirectory } from "./pathUtils.js";
import { renderTemplate } from "./templates.js";
import { writeFiles } from "./fileWriter.js";
import type { AgentDefinition, GenerateOptions, GenerationResult, PlannedFile } from "./types.js";

export class UnknownAgentError extends Error {
  constructor(public readonly unknownAgents: string[]) {
    super(`Unknown agent${unknownAgents.length === 1 ? "" : "s"}: ${unknownAgents.join(", ")}`);
  }
}

function selectedAgents(options: GenerateOptions): AgentDefinition[] {
  if (options.agents?.length) {
    const resolved = resolveAgents(options.agents);
    if (resolved.unknown.length > 0) {
      throw new UnknownAgentError(resolved.unknown);
    }
    return resolved.agents;
  }

  return getPreset(options.preset ?? "core").map(getAgent);
}

export function planFiles(options: GenerateOptions = {}): PlannedFile[] {
  const profile = getProfile(options.profile ?? "generic");
  const fileAgents = new Map<string, AgentDefinition[]>();

  for (const agent of selectedAgents(options)) {
    for (const outputFile of agent.outputFiles) {
      const agentsForPath = fileAgents.get(outputFile) ?? [];
      if (!agentsForPath.some((existing) => existing.id === agent.id)) {
        agentsForPath.push(agent);
      }
      fileAgents.set(outputFile, agentsForPath);
    }
  }

  return [...fileAgents.entries()].map(([filePath, compatibleAgents]) => ({
    path: filePath,
    compatibleAgents,
    content: renderTemplate({ filePath, profile, compatibleAgents })
  }));
}

export function generate(options: GenerateOptions = {}): GenerationResult {
  const outputDirectory = resolveOutputDirectory(options.outputDirectory);
  const files = planFiles(options);
  const { written, skipped } = writeFiles(files, {
    outputDirectory,
    force: options.force,
    dryRun: options.dryRun
  });

  return {
    files,
    written,
    skipped,
    preset: options.agents?.length ? "custom agents" : options.preset ?? "core",
    profile: options.profile ?? "generic",
    outputDirectory,
    dryRun: Boolean(options.dryRun)
  };
}
