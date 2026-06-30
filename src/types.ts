export type AgentId =
  | "codex"
  | "opencode"
  | "factory"
  | "zed"
  | "claude"
  | "gemini"
  | "cursor"
  | "copilot"
  | "copilot-path"
  | "cline"
  | "windsurf"
  | "roo"
  | "continue"
  | "aider"
  | "devin"
  | "trae"
  | "generic";

export type PresetName = "core" | "broad" | "minimal";

export type ProfileName =
  | "generic"
  | "typescript"
  | "python"
  | "next"
  | "tauri"
  | "rust"
  | "go"
  | "react"
  | "node";

export interface AgentDefinition {
  id: AgentId;
  displayName: string;
  outputFiles: string[];
  notes: string;
  aliases: string[];
  bestEffort?: boolean;
}

export interface ProfileDefinition {
  id: ProfileName;
  displayName: string;
  overview: string;
  developmentCommands: string[];
  codingRules: string[];
  testingRules: string[];
  buildCommands: string[];
  fileModificationRules: string[];
  safetyRules: string[];
  finalResponseRules: string[];
}

export interface RenderContext {
  filePath: string;
  profile: ProfileDefinition;
  compatibleAgents: AgentDefinition[];
}

export interface PlannedFile {
  path: string;
  content: string;
  compatibleAgents: AgentDefinition[];
}

export interface SkippedFile {
  path: string;
  reason: string;
  compatibleAgents: AgentDefinition[];
}

export interface GenerationResult {
  files: PlannedFile[];
  written: PlannedFile[];
  skipped: SkippedFile[];
  preset: string;
  profile: string;
  outputDirectory: string;
  dryRun: boolean;
}

export interface GenerateOptions {
  preset?: PresetName;
  profile?: ProfileName;
  outputDirectory?: string;
  agents?: string[];
  force?: boolean;
  dryRun?: boolean;
}
