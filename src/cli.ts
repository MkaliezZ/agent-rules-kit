#!/usr/bin/env node
import { agents, availableAgentIds } from "./agents.js";
import { generate, planFiles, UnknownAgentError } from "./generator.js";
import { isPresetName, presets } from "./presets.js";
import { isProfileName, profiles } from "./profiles.js";
import type { GenerateOptions, PresetName, ProfileName } from "./types.js";

interface ParsedArgs extends GenerateOptions {
  command: "init" | "list" | "preview" | "help";
}

function usage(): string {
  return [
    "Usage:",
    "  agent-rules-kit init [--preset core|broad|minimal] [--profile name] [--output dir] [--agents a,b] [--force] [--dry-run]",
    "  agent-rules-kit list",
    "  agent-rules-kit preview [--preset core|broad|minimal] [--profile name] [--agents a,b]",
    "",
    "Examples:",
    "  agent-rules-kit init",
    "  agent-rules-kit init --preset broad --profile typescript",
    "  agent-rules-kit preview --profile typescript"
  ].join("\n");
}

function readValue(args: string[], index: number, option: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} requires a value.`);
  }
  return value;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command = "help", ...args] = argv;
  if (!["init", "list", "preview", "help", "--help", "-h"].includes(command)) {
    throw new Error(`Unknown command: ${command}`);
  }

  const parsed: ParsedArgs = {
    command: command === "--help" || command === "-h" ? "help" : (command as ParsedArgs["command"])
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--profile") {
      const value = readValue(args, index, arg);
      if (!isProfileName(value)) {
        throw new Error(`Unknown profile: ${value}. Available profiles: ${Object.keys(profiles).join(", ")}`);
      }
      parsed.profile = value as ProfileName;
      index += 1;
    } else if (arg === "--preset") {
      const value = readValue(args, index, arg);
      if (!isPresetName(value)) {
        throw new Error(`Unknown preset: ${value}. Available presets: ${Object.keys(presets).join(", ")}`);
      }
      parsed.preset = value as PresetName;
      index += 1;
    } else if (arg === "--output") {
      parsed.outputDirectory = readValue(args, index, arg);
      index += 1;
    } else if (arg === "--agents") {
      parsed.agents = readValue(args, index, arg)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      index += 1;
    } else if (arg === "--force") {
      parsed.force = true;
    } else if (arg === "--dry-run") {
      parsed.dryRun = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return parsed;
}

function compatibleAgentsText(compatibleAgents: { displayName: string }[]): string {
  return compatibleAgents.map((agent) => agent.displayName).join(", ");
}

function printSummary(result: ReturnType<typeof generate>): void {
  const generatedTitle = result.dryRun ? "Would generate:" : "Generated:";
  console.log(generatedTitle);
  if (result.written.length === 0) {
    console.log("- none");
  }
  for (const file of result.written) {
    console.log(`- ${file.path}`);
    console.log(`  Compatible agents: ${compatibleAgentsText(file.compatibleAgents)}`);
  }

  console.log("");
  console.log("Skipped:");
  if (result.skipped.length === 0) {
    console.log("- none");
  }
  for (const file of result.skipped) {
    console.log(`- ${file.path} (${file.reason})`);
  }

  console.log("");
  console.log("Preset:");
  console.log(`- ${result.preset}`);
  console.log("");
  console.log("Profile:");
  console.log(`- ${result.profile}`);
  console.log("");
  console.log("Output directory:");
  console.log(`- ${result.outputDirectory}`);
}

function printList(): void {
  console.log("Agents:");
  for (const agent of agents) {
    console.log(`- ${agent.id}: ${agent.displayName}`);
    console.log(`  Aliases: ${agent.aliases.join(", ")}`);
    console.log(`  Output paths: ${agent.outputFiles.join(", ")}`);
    if (agent.bestEffort) {
      console.log("  Notes: best-effort compatibility");
    }
  }

  console.log("");
  console.log("Presets:");
  for (const [name, presetAgents] of Object.entries(presets)) {
    console.log(`- ${name}: ${presetAgents.join(", ")}`);
  }

  console.log("");
  console.log("Profiles:");
  for (const profile of Object.values(profiles)) {
    console.log(`- ${profile.id}: ${profile.displayName}`);
  }
}

function printPreview(options: GenerateOptions): void {
  const files = planFiles(options);
  for (const [index, file] of files.entries()) {
    if (index > 0) {
      console.log("\n---\n");
    }
    console.log(`# ${file.path}`);
    console.log("");
    console.log(file.content.trimEnd());
  }
}

export function run(argv = process.argv.slice(2)): number {
  try {
    const parsed = parseArgs(argv);
    if (parsed.command === "help") {
      console.log(usage());
      return 0;
    }
    if (parsed.command === "list") {
      printList();
      return 0;
    }
    if (parsed.command === "preview") {
      printPreview(parsed);
      return 0;
    }

    const result = generate(parsed);
    printSummary(result);
    return 0;
  } catch (error) {
    if (error instanceof UnknownAgentError) {
      console.error(error.message);
      console.error(`Available agents: ${availableAgentIds().join(", ")}`);
      return 1;
    }
    console.error(error instanceof Error ? error.message : String(error));
    console.error("");
    console.error(usage());
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = run();
}
