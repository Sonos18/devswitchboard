# Codex Preflight

Codex Preflight compares an Approved Handoff with the live workspace. It records the inspected baseline, local repository state, material delta, adaptations, conflicts, semantic gates reused, and next action.

Only three outcomes are valid:

- `compatible`: intent is directly feasible.
- `compatible_with_adaptation`: implementation details change without changing approved intent.
- `blocked_by_conflict`: intent and feasible implementation materially disagree; a [Conflict Report](conflict-report.md) is required.

An absent repository is valid when the handoff declares an uninitialized baseline. Filename, serialization, and repository-convention choices MAY be adaptations. Product thesis, scope, authority, routing model, Task Profile dimensions, and adapter support are not adaptable implementation details.

`material_delta` means the local difference is relevant enough to affect the active task, route, or approved assumptions. A dirty working tree alone does not make it true. When local state is task-relevant and diverged, Codex emits a [Local Delta](local-delta.md) for Chat to evaluate. When the relationship is unknown and could be material, use a focused [Micro Consultation](micro-consultation.md) to establish the missing local fact.

Schema: [`codex-preflight.schema.json`](../../schemas/codex-preflight.schema.json).
