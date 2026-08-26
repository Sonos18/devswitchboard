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
2. **Profile the task.** Complete all seven Task Profile dimensions. A level without concrete evidence is invalid. When new evidence revises a level, record the refreshed profile at a higher task revision and immediately evaluate the active route and approved execution strategy as a separate decision. Continue the current route without developer reapproval or Re-route Required only when both remain valid; follow R011 when the refreshed evidence invalidates either one.
3. **Design.** Compare materially different approaches, make trade-offs visible, and obtain developer approval. Do not reopen an adequately approved design without new evidence.
4. **Specify.** Persist stable terminology, interfaces, scope, failure behavior, and testable acceptance criteria.
5. **Recommend execution strategy.** Apply the ordered rule catalog per phase. State surfaces, workflow resources, orchestration level, isolation, review, invalidation conditions, required approvals, and—on Routing Recommendation `0.2`—the compatible material `surface_value` for the selected surface.
6. **Evaluate upstream-preparation value.** Ask whether repository-independent preparation can materially reduce Codex reasoning, context transfer, or round trips without inventing local facts. Use `prepared` for valuable approved approach/decomposition transfer and `not_needed` for a bounded route where another layer adds no material value.
7. **Prepare only non-local execution truth.** Chat may transfer approved approach, logical outcomes/work units, intent-level dependencies, non-local sequencing, constraints, acceptance mapping, verification intent, assumptions, and focused local-grounding questions. It MUST NOT fabricate exact unobserved files or symbols, local changes or instructions, tool availability, exact local commands, unavailable architecture, or repository compatibility.
8. **Deduplicate semantic gates.** For every planned gate, record `passed`, `approved`, or `reused` with an evidence source. Tool labels do not create new semantic gates.
9. **Evaluate readiness.** Intent must be clear, material decisions resolved, scope bounded, acceptance testable, context adequate, conflicts absent, and developer approval explicit. A v0.2 handoff additionally requires valid surface value, explicit preparation status, resolvable provenance when prepared, explicit local-grounding questions, and the explicit Boolean `developer_decisions.chat_verify_commit_before_next_task`. When a Local Delta checkpoint returns, evaluate freshness and material events before continuing or re-routing.
10. **Emit Approved Handoff.** Set `status: ready_for_codex_preflight`. Include the expected repository baseline; `uninitialized` is valid. Transfer the complete handoff plus directly necessary source artifacts, not the prior Chat transcript. Approved Handoff, not consultation history, crosses the implementation boundary.

## Stop conditions

Chat waits for the developer when a consequential preference is missing, alternatives change approved scope, authority is contradictory, or developer approval is required. It emits Conflict Report only when intent itself is irreconcilable with known feasibility—not merely because more discussion would be useful.

## Exit

The next surface is Codex for local preflight. Chat MUST NOT label a handoff repository-compatible; only Codex can inspect the live environment and produce Codex Preflight.

## Post-Codex technical acceptance

Codex returns fresh structured completion evidence to Chat with:

```yaml
phase: completion
state: READY_FOR_CHAT_ACCEPTANCE
next_owner: chat
```

Chat inspects that evidence against the approved goal, scope, acceptance criteria, authority, and required confidence work. It then chooses exactly one outcome:

```yaml
TASK_ACCEPTED:
  state: TASK_ACCEPTED_BY_CHAT
  next_owner: chat

TECHNICAL_FIX_REQUIRED:
  state: REMEDIATION_REQUIRED
  next_owner: codex

MATERIAL_DECISION_REQUIRED:
  state: WAITING_FOR_DEVELOPER_DECISION
  next_owner: developer
```

Technical defects return to Codex without requiring Developer technical review. Material intent, policy, authority, strategy, override, merge, or publication decisions go to the Developer through Chat. This routing preserves Developer final authority while keeping technical acceptance and remediation on the surfaces equipped to perform them.

## Cross-task commit verification

For:

```yaml
developer_decisions:
  chat_verify_commit_before_next_task: true
```

Chat MUST NOT emit an Approved Handoff for a dependent next task until the predecessor exists as a stable remote commit, fresh verification corresponds to that exact committed tree, and Chat has inspected the exact commit against predecessor scope, acceptance, authority, compatibility, and protected historical surfaces. Chat also confirms that no unverified change followed the final verification. Until the audit passes:

```yaml
next_dependent_task:
  approved_handoff_allowed: false
```

The next dependent-task handoff records a completed or reused `predecessor_commit_verification` gate with the predecessor task ID, exact commit SHA, and resolvable evidence_source. A failed technical audit routes remediation to Codex; a material decision routes to the Developer.

For:

```yaml
developer_decisions:
  chat_verify_commit_before_next_task: false
```

Chat may proceed from Codex completion evidence with no mandatory predecessor commit-audit gate. It may still inspect a predecessor commit when a material event, contradiction, stale evidence, or dependency risk gives inspection decision value. Neither policy value authorizes commit, push, merge, publication, or the next task by itself.
