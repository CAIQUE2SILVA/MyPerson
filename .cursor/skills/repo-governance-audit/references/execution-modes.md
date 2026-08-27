# Execution modes

Both modes run the full kit (Parts 1–4) and keep every human gate. Prefer the kit README orchestrator / bootstrap wording over inventing a parallel process.

## Shared gates

1. **Diagnosis** — Part 1 stops after the diagnosis; no file writes (except Phase A skill install already done).
2. **Plans** — Parts 2 and 3 stop after the exact file/action plan; a plan is not authorization to implement.
3. **Explicit approval** — Part 4 starts only with an unambiguous human approval of the allowlist (not vague “continue”).
4. **Implementation** — write only approved files; then validate and report.

Minimum artifact contracts (validate before advancing): `DIAGNOSTICO_APROVAVEL`, `PLANO_DOCUMENTAL`, `PLANO_GOVERNANCA`, `PLANO_CONSOLIDADO`, `IMPLEMENTACAO_REALIZADA` — field lists are in the kit README “One-copy multi-agent orchestrator” section.

## Multi-agent

Follow the one-copy orchestrator in the kit `README.md` (or `README.pt-BR.md`):

- Act as MAIN ORCHESTRATOR; launch one specialist at a time; wait; validate; pass artifacts forward.
- Chain: `repo-discovery-auditor` → `documentation-architect` → `agent-governance-architect` → human gate → `approved-implementer` → QA review as specified in the README.
- Use only real subagent / delegated-task mechanisms. Do not invent tool calls.
- If the environment has no real multi-agent support: state the fallback clearly and run the same roles sequentially in the main agent. Do not pretend subagents were created.

Pass into every stage: target repo = open workspace; kit = instruction source only; IDE from Phase A as approved target environment; depth `STANDARD`; delivery language = user's language.

## Step-by-step

Run all roles in the main agent, one part at a time:

1. Read Part 0, then Part 1 — deliver diagnosis — **stop and wait**.
2. After the user continues (or corrects facts), read and run Part 2 — **stop after the documentation plan**.
3. Read and run Part 3 — use Phase A IDE as the approved environment; mark others `not applicable` unless expanded — **stop after the governance plan**.
4. Produce / confirm the consolidated allowlist. **Stop for explicit human approval.**
5. Only then read and run Part 4 on the approved scope.

Do not skip stops. Do not start Part 4 without an explicit allowlist approval in the conversation.
