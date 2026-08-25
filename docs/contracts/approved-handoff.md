# Approved Handoff

The Approved Handoff is the Chat-to-Codex intent bridge. It carries the authoritative goal, approved scope and exclusions, acceptance criteria, final Task Profile, baseline expectations, context freshness, completed semantic gates, approved execution strategy, and readiness evidence.

`status: ready_for_codex_preflight` means intent is ready for local comparison; it does not claim repository compatibility. Codex MUST treat the artifact as intent truth, apply Semantic Gate Deduplication, and emit a [Codex Preflight](codex-preflight.md) before implementation planning.

A ready handoff carries affirmative developer-approved routing and strategy authority. `developer_decisions.routing_recommendation_approved` MUST be `true`, consistent with `workflow_state.developer_approval: true` and `readiness.developer_approval: true`; `false` cannot represent `ready_for_codex_preflight`. This approval does not establish local repository compatibility, which remains Codex Preflight's responsibility.

A handoff is not ready when authority contradicts itself, required evidence is absent, critical context is stale, readiness checks fail, or unresolved conflicts remain.

Schema: [`approved-handoff.schema.json`](../../schemas/approved-handoff.schema.json).
