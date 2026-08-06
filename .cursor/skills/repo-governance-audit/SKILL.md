---
name: repo-governance-audit
description: >-
  Installs this audit skill into the target repo for Cursor, Claude Code,
  Codex, or portable/.agents, then runs the full Agentic Repository Governance
  Kit (Parts 1-4) in multi-agent or step-by-step mode. Use when the user asks
  to audit a repository, install the governance kit skill, or run repo
  discovery and agentic governance planning.
---

# Repository governance audit

Entry point for the [Agentic Repository Governance Kit](https://github.com/Guigass/agentic-repo-governance-kit). The open workspace is the TARGET repository. The kit is only an instruction source — never audit or modify the kit as the target.

Pinned kit version for raw URLs: `v1.2.0`.

## Phase A — Install (stop and ask)

1. Stop and ask which IDE to install into: `cursor` | `claude` | `codex` | `generic`.
2. Read [references/install-targets.md](references/install-targets.md). Write this skill directory (`SKILL.md` + `references/`) into the chosen path in the **target** workspace.
3. Write authorization is limited to those skill files only. Do not change application code.
4. Record in the conversation: chosen IDE + install path (Part 3 uses this as the approved target environment; mark other environments `not applicable` unless the user expands later).

## Phase B — Execution mode (stop and ask)

Stop and ask: `multi-agent` or `step-by-step`.

Read [references/execution-modes.md](references/execution-modes.md) and follow the chosen mode.

## Phase C — Full audit (Parts 1–4)

Defaults: depth `STANDARD`; delivery language = user's language.

Load kit parts from the local kit clone when available; otherwise use pinned raw URLs under:

- English: `https://raw.githubusercontent.com/Guigass/agentic-repo-governance-kit/v1.2.0/en/`
- Portuguese: `https://raw.githubusercontent.com/Guigass/agentic-repo-governance-kit/v1.2.0/pt-BR/`

Always read Part 0 first (`00-HOW-TO-USE.md` / `00-COMO-USAR.md`), then the part for the current stage.

### Safety (non-negotiable)

- After Phase A install, the audit is read-only until explicit human approval of the consolidated plan.
- Part 4 runs only with an unambiguous allowlist of files and actions.
- No commit, push, PR, deploy, dependency install, or private external access without separate authorization.
- Separate facts, inferences, items not found, and human validation points.
- Preserve pre-existing, unrelated working-tree changes.
- If this skill was invoked from inside the kit repository itself, refuse to treat the kit as the audit target unless the user explicitly overrides.

### After install + mode are known

Proceed immediately with Phase C. Do not ask for the bootstrap paste from the README — this skill replaces that entrypoint.
