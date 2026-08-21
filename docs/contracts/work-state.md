# Work State

Work State is the resumable snapshot for a pause, surface bridge, or handoff. It records lifecycle state, current phase, authoritative artifacts, active route, completed and reused semantic gates, workspace state, verification state, next safe action, and blockers.

Lifecycle states are `ready`, `active`, `waiting_for_developer`, `blocked_by_conflict`, `verification_failed`, and `complete`. A Work State with lifecycle state `complete` MUST have verification state `passed`; failed, missing, or invalid verification evidence cannot represent complete work. A fresh operator resumes only after checking authority, local delta, and evidence freshness. If those checks fail, the operator emits Re-route Required or Conflict Report instead of guessing.

For a pending [Re-route Required](re-route-required.md), the checkpoint Work State is identified by the same task, checkpoint revision in `active_route`, and checkpoint path in `authoritative_artifacts`. Later same-task Work States that name the checkpoint remain associated. Every associated state MUST be `waiting_for_developer`, and `next_safe_action` MUST request route evaluation or approval without positively instructing strategy-dependent work. It cannot be `active` or `complete` while replacement approval is unresolved.

When an Approved Handoff supersedes that gate, resumed `active` or `complete` Work State names both the historical checkpoint and the unique highest approved replacement applicable to its own route revision. This provenance distinguishes an approved resume from silent continuation, while per-state revision selection keeps older authorized snapshots valid after a newer route is approved.

When a pause depends on local-only context, `artifacts` and `next_safe_action` identify the applicable [Local Delta](local-delta.md) or linked [Micro Consultation](micro-consultation.md). The record carries references and state, not hidden conversation history, and consultation does not change the recorded phase owner.

Schema: [`work-state.schema.json`](../../schemas/work-state.schema.json).
