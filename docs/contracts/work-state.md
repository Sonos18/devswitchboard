# Work State

Work State is the resumable snapshot for a pause, surface bridge, or handoff. It records lifecycle state, current phase, authoritative artifacts, active route, completed and reused semantic gates, workspace state, verification state, next safe action, and blockers.

Lifecycle states are `ready`, `active`, `waiting_for_developer`, `blocked_by_conflict`, `verification_failed`, and `complete`. A Work State with lifecycle state `complete` MUST have verification state `passed`; failed, missing, or invalid verification evidence cannot represent complete work. A fresh operator resumes only after checking authority, local delta, and evidence freshness. If those checks fail, the operator emits Re-route Required or Conflict Report instead of guessing.

When a pause depends on local-only context, `artifacts` and `next_safe_action` identify the applicable [Local Delta](local-delta.md) or linked [Micro Consultation](micro-consultation.md). The record carries references and state, not hidden conversation history, and consultation does not change the recorded phase owner.

Schema: [`work-state.schema.json`](../../schemas/work-state.schema.json).
