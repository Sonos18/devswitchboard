# Chat Workflow

Chat owns intent-facing work. Its output is an approved, testable handoff—not a claim about local repository compatibility.

## Entry

Start here when material requirements, trade-offs, scope, or developer preferences remain unresolved. Existing approved evidence is accepted through Semantic Gate Deduplication when it is adequate, fresh, and unaffected by a material delta.

## Context acquisition

Classify missing context by source before choosing a surface:

| Source | Owner | Action |
| --- | --- | --- |
| `REMOTE` | Chat | Acquire the fact from GitHub or another approved shared-baseline source. |
| `LOCAL` | Codex | Request one focused fact through Micro Consultation. If task-relevant local divergence exists, consume a Local Delta. |
| `INTENT` | Developer | Ask for an explicit decision; do not infer intent from repository evidence. |

Context Depth and Context Source are independent. Depth says how much information is needed; source says where it comes from. `HIGH` depth does not imply Codex consultation, and a `LOW`-depth fact still routes to Codex when it exists only in the local workspace.

Codex consultation is last-mile acquisition for local-only facts, not a general fallback. A Micro Consultation does not transfer the active phase. A Local Delta reports relevant facts and implications but does not change approved intent or replace Approved Handoff.

## Flow

1. **Discover requirements.** Resolve intended outcome, users, constraints, exclusions, acceptance criteria, and developer authority. Keep `requirement_ambiguity` evidence current.
2. **Profile the task.** Complete all seven Task Profile dimensions. A level without concrete evidence is invalid.
3. **Design.** Compare materially different approaches, make trade-offs visible, and obtain developer approval. Do not reopen an adequately approved design without new evidence.
4. **Specify.** Persist stable terminology, interfaces, scope, failure behavior, and testable acceptance criteria.
5. **Recommend execution strategy.** Apply the ordered rule catalog per phase. State surfaces, workflow resources, orchestration level, isolation, review, invalidation conditions, and required approvals.
6. **Deduplicate semantic gates.** For every planned gate, record `passed`, `approved`, or `reused` with an evidence source. Tool labels do not create new semantic gates.
7. **Evaluate readiness.** Intent must be clear, material decisions resolved, scope bounded, acceptance testable, context adequate, conflicts absent, and developer approval explicit. When a Local Delta checkpoint returns, evaluate freshness and material events before continuing or re-routing.
8. **Emit Approved Handoff.** Set `status: ready_for_codex_preflight`. Include the expected repository baseline; `uninitialized` is valid. Approved Handoff, not consultation history, crosses the implementation boundary.

## Stop conditions

Chat waits for the developer when a consequential preference is missing, alternatives change approved scope, authority is contradictory, or developer approval is required. It emits Conflict Report only when intent itself is irreconcilable with known feasibility—not merely because more discussion would be useful.

## Exit

The next surface is Codex for local preflight. Chat MUST NOT label a handoff repository-compatible; only Codex can inspect the live environment and produce Codex Preflight.
