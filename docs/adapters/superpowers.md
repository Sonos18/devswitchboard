# Superpowers Adapter

Superpowers is the only DevSwitchboard v0.1 methodology adapter. The adapter maps semantic needs to practices; a skill name does not create a second gate or change authority.

| DevSwitchboard semantic need | Superpowers practice | Deduplication behavior |
| --- | --- | --- |
| Explore requirements and design | `brainstorming` | Reuse an approved upstream design when evidence and freshness are adequate. |
| Produce repository-grounded execution detail | `writing-plans` | Always run after local preflight for architectural implementation. |
| Execute a fixed plan inline | `executing-plans` | Use when the developer approved single-context authorship. |
| Execute bounded tasks through workers | `subagent-driven-development` | Use only when implementation subagents are approved. |
| Dispatch independent units | `dispatching-parallel-agents` | Requires stable interfaces; strategy changes require Re-route Required. |
| Diagnose a defect | `systematic-debugging` | Applies when a real failure or unexpected behavior appears. |
| Build production executable behavior | `test-driven-development` | Begins when production executable code exists; it is not fabricated for documentation-only bootstrap work. |
| Obtain fresh review | `requesting-code-review` | Prefer a non-authoring context for architectural or contract-heavy changes. |
| Support a completion claim | `verification-before-completion` | Always fresh after the last change; never deduplicated. |

## Adapter procedure

1. Identify the next incomplete DevSwitchboard phase and applicable semantic gate.
2. Check whether upstream evidence already satisfies that gate.
3. If reusable, record the gate as `reused` with its source and do not invoke an equivalent practice again.
4. If not reusable, invoke the mapped practice without expanding the approved scope.
5. Preserve developer approvals and stop conditions from the active route.
6. Record material events in Work State; use Re-route Required before changing strategy.

For DevSwitchboard Dogfood #001, approved Design Revision 2 satisfies brainstorming. Codex Preflight, repository implementation planning, fresh review, and final verification remain distinct required gates.
