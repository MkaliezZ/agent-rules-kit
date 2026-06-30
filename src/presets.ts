import type { AgentId, PresetName } from "./types.js";

export const presets: Record<PresetName, AgentId[]> = {
  core: ["codex", "opencode", "claude", "gemini", "copilot", "cursor", "cline"],
  broad: [
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
  ],
  minimal: ["generic"]
};

export function isPresetName(input: string): input is PresetName {
  return input === "core" || input === "broad" || input === "minimal";
}

export function getPreset(name: PresetName): AgentId[] {
  return presets[name];
}
