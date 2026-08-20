# Core Contracts

DevSwitchboard contracts make decisions portable across surfaces. Human semantics live here; Draft 2020-12 schemas live in [`schemas/`](../../schemas/).

## Common rules

- `schema` and `schema_version` identify the contract. v0.1 uses schema version `0.1`.
- Task-scoped records carry `task_id` and `revision`.
- Required evidence is explicit and non-empty; conversational memory is not evidence.
- Objects are closed. Producers MUST NOT add fields that the selected schema does not define.
- Canonical records use JSON for dependency-free validation. JSON is valid YAML 1.2, so users MAY preserve the same structure in YAML-aware workflows.
- A recommendation never grants authority. Fields that require a developer decision say so explicitly.

## Contract index

| Contract | Direction | Purpose |
| --- | --- | --- |
| [Task Profile](task-profile.md) | any | Evidence-backed routing assessment. |
| [Routing Recommendation](routing-recommendation.md) | any → developer | Proposed phase route. |
| [Approved Handoff](approved-handoff.md) | Chat → Codex | Approved intent and execution constraints. |
| [Codex Preflight](codex-preflight.md) | Codex → workflow | Live-environment compatibility result. |
| [Conflict Report](conflict-report.md) | any → developer | Intent-versus-feasibility stop. |
| [Re-route Required](re-route-required.md) | any → developer | Approval request after route invalidation. |
| [Work State](work-state.md) | any → any | Resumable execution state. |
| [Verification Report](verification-report.md) | Codex → developer | Fresh acceptance evidence. |

## Evolution

Compatible clarifications MAY retain `0.1`. Removing a field, adding a required field, changing an enum, or changing authority semantics requires a new schema version and migrated canonical examples. The human contract, machine schema, examples, and adapter MUST change together.
