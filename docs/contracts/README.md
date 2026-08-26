# Core Contracts

DevSwitchboard contracts make decisions portable across surfaces. Human semantics live here; Draft 2020-12 schemas live in [`schemas/`](../../schemas/).

## Common rules

- `schema` and `schema_version` identify the contract. Product and contract versions are independent; consumers select behavior from the contract's own version.
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
| [Local Delta](local-delta.md) | Codex → Chat | Minimum task-relevant local divergence from the shared baseline. |
| [Micro Consultation](micro-consultation.md) | Chat ↔ Codex | One focused fact exchange without phase-ownership transfer. |
| [Codex Preflight](codex-preflight.md) | Codex → workflow | Live-environment compatibility result. |
| [Conflict Report](conflict-report.md) | any → developer | Intent-versus-feasibility stop. |
| [Re-route Required](re-route-required.md) | any → developer | Approval request after route invalidation. |
| [Work State](work-state.md) | any → any | Resumable execution state. |
| [Verification Report](verification-report.md) | Codex → Chat; Developer authority preserved | Fresh technical acceptance evidence; `developer_acceptance_required` preserves final authority without requiring personal code/test inspection. |

## Evolution

Compatible clarifications MAY retain a contract version. Removing a field, adding a required field, changing an enum, or changing authority semantics requires a new schema version and current-version canonical examples. Existing historical records remain readable under their original version unless an explicitly approved migration says otherwise. The human contract, machine schema, current examples, workflows, and adapter MUST change together.

DevSwitchboard v0.2 introduces Routing Recommendation `0.2` and Approved Handoff `0.2`; their canonical schema files continue to validate historical `0.1` records. All other contract versions remain `0.1`.
