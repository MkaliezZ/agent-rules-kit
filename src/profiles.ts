import type { ProfileDefinition, ProfileName } from "./types.js";

const common = {
  fileModificationRules: [
    "Do not modify unrelated files.",
    "Do not remove existing functionality unless explicitly requested.",
    "Prefer small, focused changes.",
    "Preserve existing behavior.",
    "Read relevant files before editing."
  ],
  safetyRules: [
    "Do not add secrets, credentials, or machine-specific paths.",
    "Avoid destructive commands unless explicitly requested.",
    "If unsure, state assumptions clearly."
  ],
  finalResponseRules: [
    "Summarize what changed.",
    "Report commands used.",
    "Report validation results and failures honestly.",
    "Do not claim success unless validation passes."
  ]
};

export const profiles: Record<ProfileName, ProfileDefinition> = {
  generic: {
    id: "generic",
    displayName: "Generic",
    overview: "Replace this with a short description of the repository and its main goals.",
    developmentCommands: ["Install dependencies: <project-specific command>", "Run locally: <project-specific command>"],
    codingRules: ["Follow existing project style.", "Keep changes easy to review.", "Prefer clear names and simple control flow."],
    testingRules: ["Run relevant tests when possible.", "Add or update tests for changed behavior."],
    buildCommands: ["Build: <project-specific command>"],
    ...common
  },
  typescript: {
    id: "typescript",
    displayName: "TypeScript",
    overview: "This repository uses TypeScript and Node.js. Keep implementation details aligned with existing npm scripts.",
    developmentCommands: ["Install dependencies: npm install", "Run available npm scripts from package.json."],
    codingRules: [
      "Use TypeScript types deliberately and keep strict typing where practical.",
      "Prefer small modules with explicit exports.",
      "Avoid adding runtime dependencies unless they clearly reduce complexity."
    ],
    testingRules: ["Run relevant tests before the final response.", "Add or update deterministic tests for changed behavior."],
    buildCommands: ["Build: npm run build", "Lint/check: npm run lint if available"],
    ...common
  },
  python: {
    id: "python",
    displayName: "Python",
    overview: "This repository uses Python. Prefer virtual environments and project-local tooling.",
    developmentCommands: ["Create or activate a virtual environment.", "Install dependencies from the project dependency file."],
    codingRules: ["Follow existing formatting and linting conventions.", "Keep modules focused.", "Use clear error handling."],
    testingRules: ["Run pytest when relevant.", "Add or update tests for changed behavior."],
    buildCommands: ["Build/package: <project-specific command>", "Format/lint: <project-specific command>"],
    ...common
  },
  next: {
    id: "next",
    displayName: "Next.js",
    overview: "This repository uses Next.js, React, and TypeScript.",
    developmentCommands: ["Install dependencies: npm install", "Run the dev server with the project npm script."],
    codingRules: [
      "Respect app router versus pages router boundaries.",
      "Keep server and client component responsibilities clear.",
      "Preserve existing route and data-loading behavior."
    ],
    testingRules: ["Run lint, type checks, and relevant tests before the final response.", "Check affected UI flows when practical."],
    buildCommands: ["Build: npm run build", "Lint: npm run lint"],
    ...common
  },
  tauri: {
    id: "tauri",
    displayName: "Tauri",
    overview: "This repository uses Tauri with a frontend/backend boundary.",
    developmentCommands: ["Install frontend dependencies with the project package manager.", "Use the existing Tauri dev command."],
    codingRules: [
      "Keep frontend and Rust-side responsibilities separate.",
      "Be cautious with Rust side effects and desktop filesystem access.",
      "Do not break local app data or user configuration."
    ],
    testingRules: ["Run relevant frontend checks and cargo tests when practical.", "Verify affected desktop behavior when possible."],
    buildCommands: ["Frontend build: <project-specific command>", "Tauri build/check: <project-specific command>"],
    ...common
  },
  rust: {
    id: "rust",
    displayName: "Rust",
    overview: "This repository uses Rust. Prefer small, safe changes.",
    developmentCommands: ["Check: cargo check", "Run: cargo run if this is an executable project."],
    codingRules: ["Prefer clear ownership and error handling.", "Keep changes localized.", "Avoid unnecessary unsafe code."],
    testingRules: ["Run cargo test when relevant.", "Run clippy if available."],
    buildCommands: ["Build: cargo build", "Lint: cargo clippy if available"],
    ...common
  },
  go: {
    id: "go",
    displayName: "Go",
    overview: "This repository uses Go. Keep packages small and behavior explicit.",
    developmentCommands: ["Run tests: go test ./...", "Run the project command from its main package when needed."],
    codingRules: ["Run gofmt on changed Go files.", "Use clear error handling.", "Avoid broad package-level state."],
    testingRules: ["Run go test ./... when practical.", "Add table-driven tests for changed behavior when useful."],
    buildCommands: ["Build: go build ./..."],
    ...common
  },
  react: {
    id: "react",
    displayName: "React",
    overview: "This repository uses React. Preserve component boundaries and user-facing behavior.",
    developmentCommands: ["Install dependencies with the project package manager.", "Run the dev server with the project script."],
    codingRules: [
      "Keep component boundaries clear.",
      "Be cautious with state management changes.",
      "Include accessibility basics for interactive UI.",
      "Avoid unnecessary rerenders."
    ],
    testingRules: ["Run relevant component or integration tests.", "Check affected UI flows when practical."],
    buildCommands: ["Build: <project-specific command>", "Lint/check: <project-specific command>"],
    ...common
  },
  node: {
    id: "node",
    displayName: "Node.js",
    overview: "This repository uses Node.js. Respect runtime compatibility and package scripts.",
    developmentCommands: ["Install dependencies: npm install", "Use package.json scripts for local commands."],
    codingRules: ["Keep modules small.", "Use clear error handling.", "Avoid adding dependencies without a strong reason."],
    testingRules: ["Run relevant tests with the project package script.", "Add or update tests for changed behavior."],
    buildCommands: ["Build/check: npm run build if available", "Lint/check: npm run lint if available"],
    ...common
  }
};

export function isProfileName(input: string): input is ProfileName {
  return Object.hasOwn(profiles, input);
}

export function getProfile(name: ProfileName): ProfileDefinition {
  return profiles[name];
}
