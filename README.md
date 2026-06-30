# Agent Rules Kit

Generate clean project rules for Codex, Claude Code, Cursor, GitHub Copilot, Gemini CLI, Cline, opencode, Windsurf, Roo Code, Continue, Aider, Zed, Devin, and other AI coding agents.

Agent Rules Kit is a static rule-file generator. It does not call AI APIs, run a backend, or provide a web UI.

## Why?

Different coding agents look for different project instruction files. Agent Rules Kit reduces that fragmentation by generating a concise, consistent ruleset across common agent-specific paths.

The generated files are intentionally short. They are meant to capture practical project rules, not duplicate your README or become large prompt dumps.

## Quick Demo

```bash
agent-rules-kit init --preset broad --profile typescript
```

Example output:

```text
Generated:
- AGENTS.md
  Compatible agents: Codex, opencode, Factory, Zed, Devin, generic agents

- CLAUDE.md
  Compatible agents: Claude Code
```

## Install

This project is not published to npm yet.

For local development:

```bash
git clone https://github.com/MkaliezZ/agent-rules-kit.git
cd agent-rules-kit
npm install
npm run build
node dist/cli.js list
```

## Usage

```bash
agent-rules-kit init
agent-rules-kit init --preset core
agent-rules-kit init --preset broad
agent-rules-kit init --preset minimal
agent-rules-kit init --profile typescript
agent-rules-kit init --profile python
agent-rules-kit init --profile tauri
agent-rules-kit init --profile next
agent-rules-kit init --profile rust
agent-rules-kit init --output .
agent-rules-kit init --agents codex,claude,cursor,copilot,gemini,cline,opencode
agent-rules-kit init --preset broad --profile typescript
agent-rules-kit list
agent-rules-kit preview --profile typescript
agent-rules-kit preview --preset broad --profile typescript
```

By default, `init` uses the `core` preset, the `generic` profile, and the current working directory.

Existing files are never overwritten unless you pass `--force`.

## Presets

| Preset | Purpose | Generated files |
| --- | --- | --- |
| `core` | Default set for common coding agents | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.cursor/rules/project.mdc`, `.clinerules` |
| `broad` | As many supported rule files as practical | Core files plus Copilot path rules, Windsurf, Roo, Continue, Aider, `.rules`, and related compatibility files |
| `minimal` | One portable instruction file | `AGENTS.md` |

## Supported Agents

Some rule paths are widely used or clearly documented. Others are ecosystem-fragmented, so this project treats them as best-effort compatibility and avoids claiming official support.

| Agent | Generated files | Status |
| --- | --- | --- |
| Codex | `AGENTS.md` | Common convention |
| opencode | `AGENTS.md` | Common convention |
| Factory | `AGENTS.md` | Best-effort |
| Zed | `AGENTS.md` / `.rules` compatibility | Best-effort |
| Claude Code | `CLAUDE.md` | Common convention |
| Gemini CLI | `GEMINI.md` | Common convention |
| Cursor | `.cursor/rules/project.mdc` | Common convention |
| GitHub Copilot | `.github/copilot-instructions.md` | Common convention |
| GitHub Copilot path rules | `.github/instructions/general.instructions.md` | Common convention |
| Cline | `.clinerules` | Common convention |
| Windsurf / Cascade | `.windsurfrules` / `.windsurf/rules/project.md` | Best-effort |
| Roo Code | `.roo/rules/project.md` / `.roorules` | Best-effort |
| Continue | `.continue/rules/project.md` | Best-effort |
| Aider | `CONVENTIONS.md` / `.aider.conf.yml` | Common convention |
| Devin | `AGENTS.md` / `.rules` | Best-effort |
| TRAE | `.rules` | Best-effort |
| Generic agents | `AGENTS.md` | Portable fallback |

## Generated Files

Each generated Markdown file uses a shared core structure:

```text
# Project Instructions

## Project Overview
## Development Commands
## Coding Rules
## Testing Rules
## File Modification Rules
## Safety Rules
## Final Response Format
```

Agent Rules Kit deduplicates output paths. For example, `codex`, `opencode`, `factory`, `zed`, `devin`, and `generic` can all map to `AGENTS.md`, but the file is generated once and the CLI summary lists compatible agents.

`CONVENTIONS.md` is used for Aider conventions. `.aider.conf.yml` is a minimal config:

```yaml
read:
  - CONVENTIONS.md
```

No model credentials or API keys are generated.

## Profiles

Profiles customize the concise rules for common project types:

| Profile | Focus |
| --- | --- |
| `generic` | Any repository |
| `typescript` | TypeScript, Node.js, npm scripts, strict typing where practical |
| `python` | Virtual environments, pytest, formatting/linting placeholders |
| `next` | Next.js, React, TypeScript, router boundaries |
| `tauri` | Tauri frontend/backend boundary and desktop filesystem caution |
| `rust` | `cargo check`, `cargo test`, clippy if available |
| `go` | `go test ./...`, `gofmt`, small packages |
| `react` | Component boundaries, accessibility, rerender caution |
| `node` | Package scripts, runtime compatibility, small modules |

## CLI Options

| Option | Description |
| --- | --- |
| `--profile <name>` | Select a profile. Default: `generic` |
| `--preset <core\|broad\|minimal>` | Select a preset. Default: `core` |
| `--output <dir>` | Write files under a directory. Default: current directory |
| `--agents <list>` | Comma-separated agents. Overrides preset selection |
| `--force` | Overwrite existing files |
| `--dry-run` | Print what would be generated without writing files |

## Examples

Generate the default set:

```bash
agent-rules-kit init
```

Generate broad TypeScript rules:

```bash
agent-rules-kit init --preset broad --profile typescript
```

Preview without writing:

```bash
agent-rules-kit preview --preset broad --profile typescript
```

Generate only selected agents:

```bash
agent-rules-kit init --agents codex,claude,cursor,copilot,gemini,cline,opencode
```

Dry run:

```bash
agent-rules-kit init --profile typescript --dry-run
```

## Best Practices

- Keep rules short.
- Avoid repeating README content.
- Avoid contradictory rules.
- Include only commands that actually exist.
- Prefer human-maintained project facts.
- Review generated files before committing.

## Related Projects

- [Repo2Prompt](https://github.com/MkaliezZ/repo2prompt): Turn any codebase into an AI-ready context pack.
- [Agent Rules Kit](https://github.com/MkaliezZ/agent-rules-kit): Generate reusable project rules for AI coding agents.

Agent Rules Kit does not depend on Repo2Prompt.

## Roadmap

- More agent adapters
- Better official-source verification
- Custom template config
- Existing rule file merge mode
- JSON manifest output
- Repo detection
- Integration with Repo2Prompt
- npm release

## License

MIT
