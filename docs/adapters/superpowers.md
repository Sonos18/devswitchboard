# Superpowers Adapter

Superpowers is the only supported DevSwitchboard methodology adapter. The adapter maps semantic needs to practices; skill eligibility or availability does not imply invocation, create a second gate, or change authority. Optional practices run only after concrete expected execution, decision, or confidence value materially exceeds coordination, context-transfer, and integration costs, the active route selects them, and any required approval exists.

| DevSwitchboard semantic need | Superpowers practice | Deduplication behavior |
| --- | --- | --- |
| Explore requirements and design | `brainstorming` | Reuse an approved upstream design when evidence and freshness are adequate. |
| Produce repository-grounded execution detail | `writing-plans` | Run only when the selected route includes repository-grounded implementation planning; ground approved preparation instead of repeating upstream design. |
| Execute a fixed plan inline | `executing-plans` | Use when the selected route preserves single-context authorship. |
| Execute bounded tasks through workers | `subagent-driven-development` | Bounded-unit eligibility is insufficient: use only when expected value materially exceeds orchestration costs and implementation subagents are approved. |
| Dispatch independent units | `dispatching-parallel-agents` | Stable independent units establish eligibility; invocation also requires expected value to materially exceed orchestration costs and any required strategy approval. |
| Diagnose a defect | `systematic-debugging` | Applies when a real failure or unexpected behavior appears. |
| Build production executable behavior | `test-driven-development` | Begins when production executable code exists; it is not fabricated for documentation-only bootstrap work. |
| Acquire one local-only repository fact | Focused read-only Codex inspection | Produces a Micro Consultation response under the active phase; it creates no new phase gate or ownership transfer. |
| Communicate relevant local divergence | Active execution practice plus Local Delta | Pause at an approved checkpoint and return minimum evidence to Chat; do not treat the artifact as authorization. |
| Obtain fresh review | `requesting-code-review` | Select independently when a non-authoring context has material contradiction-detection value, even if implementation remains single-context. |
| Support a completion claim | `verification-before-completion` | Mandatory and always fresh after the last change; never deduplicated or removed by optional-resource cost reasoning. |

## Adapter procedure

1. Identify the next incomplete DevSwitchboard phase and applicable semantic gate.
2. Check whether upstream evidence already satisfies that gate.
3. If reusable, record the gate as `reused` with its source and do not invoke an equivalent practice again. Upstream Execution Preparation alone does not invoke `writing-plans`.
4. For an optional resource, distinguish technical eligibility from selection. Compare concrete expected execution, decision, or confidence value with coordination, context-transfer, and integration costs; when value does not justify extra orchestration, retain the lower-orchestration route.
5. If the gate is not reusable, invoke only the selected mapped practice without expanding the approved scope. Mandatory final verification always runs after the last change.
6. Preserve developer approvals and stop conditions from the active route; practice availability never authorizes implementation subagents.
7. Classify missing context by source. Use focused Codex inspection only for `LOCAL` facts; leave `REMOTE` acquisition with Chat and `INTENT` with the developer.
8. Record material events in Work State; use Re-route Required before changing strategy, not merely because an optional resource is eligible.
9. Preserve plan-free R012 direct execution when preparation is `not_needed`; Codex Preflight and fresh final verification still run.
10. Return Codex technical completion as `READY_FOR_CHAT_ACCEPTANCE` with `next_owner: chat`; Chat accepts the technical result, routes technical remediation to Codex, and sends only material Developer-owned decisions to the Developer.
11. Require Approved Handoff `0.2` to record the explicit Boolean `chat_verify_commit_before_next_task`. On `true`, Chat withholds a dependent handoff until the exact stable remote predecessor commit is audited and a resolvable `predecessor_commit_verification` gate can be recorded. On `false`, do not fabricate a mandatory gate. Neither choice authorizes publication.

For DevSwitchboard Dogfood #001, approved Design Revision 2 satisfies brainstorming. Codex Preflight, repository implementation planning, fresh review, and final verification remain distinct required gates.
