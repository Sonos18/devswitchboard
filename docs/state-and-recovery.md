# State and Recovery

DevSwitchboard treats interruption as normal. Work State carries everything a fresh operator needs to resume safely without reconstructing hidden conversation.

## Lifecycle

| State | Meaning | Allowed next move |
| --- | --- | --- |
| `ready` | Approved intent is ready for its next surface. | Perform the recorded phase gate. |
| `active` | Approved work is in progress. | Continue the recorded next safe action. |
| `waiting_for_developer` | A decision or approval is required. | Read-only evidence gathering or developer response. |
| `blocked_by_conflict` | Intent and feasibility materially conflict. | Resolve Conflict Report; no strategy-dependent mutation. |
| `verification_failed` | A required check failed. | Diagnose, correct, and rerun all affected fresh checks. |
| `complete` | Required checks pass and the package is ready for developer review. | Developer acceptance or a new revision. |

## Minimum resumable state

Work State MUST identify the task revision, current phase, authoritative specification and handoff, active Routing Recommendation, completed and reused gates, workspace state, verification state, blockers, and one concrete next safe action. When recovery depends on local-only evidence, it also identifies the applicable Local Delta or linked Micro Consultation without copying conversation history.

## Repository baseline

Baseline state and task relevance determine whether a local bridge is needed. Structured records serialize these states in lowercase.

| State | Meaning | Local-context behavior |
| --- | --- | --- |
| `UNINITIALIZED` | No shared GitHub baseline exists. | Verify the declared empty/local state; record absent remote and SHA explicitly when a Local Delta is needed. |
| `SYNCED` | Local HEAD and the shared remote revision agree. | The remote can serve as the shared baseline. |
| `DIVERGED` | Local truth differs from the shared baseline. | Emit Local Delta only when the difference is relevant to the active task. |
| `UNKNOWN` | Local relation to the baseline is not established. | If local state could materially affect the task, request focused local evidence before continuing. |

A dirty working tree is evidence of divergence, not evidence of task relevance. Irrelevant local changes do not force a Local Delta.

## Resume procedure

1. Confirm the authoritative artifacts and developer approvals.
2. Inspect the live workspace for a material delta.
3. Classify missing context as `REMOTE`, `LOCAL`, or `INTENT`; acquire it from Chat/GitHub, Codex, or the developer respectively.
4. Check whether route evidence and completed gates remain fresh.
5. Resume `next_safe_action` when authority, route, and evidence remain valid.
6. Emit Re-route Required when new evidence invalidates strategy but approved intent remains feasible.
7. Emit Conflict Report when safe adaptation cannot preserve intent.
8. Set `verification_failed` when implementation is viable but required checks fail.

## Verification-failure recovery example

Suppose a required schema-conformance check rejects a task record while the approved implementation is still feasible. Treat the result as execution evidence, not as a reason to reopen intent:

1. Preserve a Work State with `lifecycle_state: verification_failed`, the failing command and evidence, the current route and workspace, reused gates, and one concrete `next_safe_action`.
2. Confirm whether the failure invalidates intent or routing. If it does not, keep Codex as phase owner and activate diagnosis under the current route.
3. Read and reproduce the failure, compare the invalid artifact with its schema and a passing example, and identify the root cause before editing it.
4. Apply only the correction supported by that diagnosis.
5. Rerun the affected check. After the last task change, rerun the full required verification before setting Work State to `complete`.

Dogfood #006 exercised this path with `node scripts/verify.mjs`. A task-scoped Dogfood record supplied a numeric count where its schema requires an evidence array, so schema conformance failed deterministically. The recorded next safe action was `diagnose_the_observed_verification_failure_before_modifying_the_fixture`; diagnosis confirmed the type mismatch, and replacing the count with one evidence entry corrected the fault. Requirement discovery, design, brainstorming, and routing approval remained reused because the failure contradicted none of them.

The key distinction is semantic: a verification failure becomes Re-route Required only when new evidence invalidates the approved strategy, and it becomes a Conflict Report only when safe implementation can no longer preserve approved intent. Otherwise, recover from the current Work State.

## Continue, re-route, or report a conflict?

Classify what the new evidence invalidates before choosing a recovery path:

| New evidence | Response | Why |
| --- | --- | --- |
| Approved intent and the execution strategy remain valid. | Continue the current route from [Work State](contracts/work-state.md). | No new decision or execution strategy is needed. An understood verification failure with a local cause belongs here: diagnose, correct, and verify. |
| Approved intent remains feasible, but a material event invalidates the approved route or strategy. | Emit [Re-route Required](contracts/re-route-required.md) and wait for developer approval. | The work can still be done, but continuing would presuppose an unapproved strategy. |
| Approved intent cannot be preserved through safe adaptation. | Emit a [Conflict Report](contracts/conflict-report.md) and stop. | The developer must resolve the intent-versus-feasibility conflict. |

Do not infer a conflict merely because execution became harder, and do not silently expand a route merely because the intent remains feasible. Preserve completed and reusable gates in Work State so an approved recovery resumes from current evidence rather than restarting the task.

### When Conflict Report is warranted

Use a Conflict Report only after live feasibility evidence shows that safe implementation cannot preserve all approved intent at the same time. First separate a change in **how** the work must run from an incompatibility in **what** the developer requires:

| Feasibility finding | Recovery artifact |
| --- | --- |
| The approved outcome remains feasible, but planning, sequencing, review level, resources, or another execution choice must change. | [Re-route Required](contracts/re-route-required.md) |
| Two approved requirements cannot coexist through any safe implementation or adaptation. | [Conflict Report](contracts/conflict-report.md) |

For example, a requirement to introduce executable behavior conflicts with a simultaneous non-negotiable prohibition on every permissible executable surface when the repository has no existing mechanism that already supplies that behavior. The report must identify both requirements, inspect the actual implementation surfaces, evaluate safe adaptations, and return the unresolved decision to the developer. It must not choose which requirement to weaken.

Missing preferences, harmless filename or layout adaptation, stale local context, environment or authentication failure, recoverable verification failure, and complexity that merely needs a different route are not conflicts. Record those through the applicable context, environment, verification-recovery, or Re-route Required path.

### Conflict Report approval lifecycle

When Conflict Report is pending, preserve the report and a matching `blocked_by_conflict` Work State, then stop strategy-dependent mutation. The state belongs to the same task, uses the report revision in its active route, and names the exact report path. Every same-task Work State at or after that route revision must also name the report; a later state cannot escape the pause by omitting provenance. Pre-conflict snapshots remain valid and outside the gate.

The checkpoint's next safe action uses only whole clauses that match a canonical report return, developer decision request, or explicit prohibition. Matching a safe phrase is not enough: arbitrary trailing content fails closed. It cannot append building, shipping, editing, writing, applying, patching, testing, validation, deployment, publication, Git mutation, creation, deletion, command execution, or equivalent strategy-dependent work after the decision request.

An intent-revision Approved Handoff resolves this gate only through exact provenance: the same task, a revision not older than the report, affirmative canonical approval/readiness, and an approved `conflict_report` completed gate naming the exact report path. Every later same-task state naming the report remains subject to the gate. A resumed `active` or `complete` snapshot names the unique highest qualifying handoff applicable to its own route revision.

Keep the historical report and blocked state after approval. They prove why work stopped; the provenance-linked handoff proves why it resumed. A newer approval does not retroactively invalidate an older authorized snapshot, but duplicated highest authority or a resumed state without its applicable handoff fails closed.

### Re-route approval lifecycle

When Re-route Required is pending, preserve the checkpoint and a matching `waiting_for_developer` Work State, then pause strategy-dependent implementation. The next safe action asks for route evaluation or approval; it does not tell an operator to plan, implement, continue, or resume under the unapproved strategy.

A replacement Approved Handoff resolves the gate only through explicit provenance: the same task, an adequate revision, affirmative approval/readiness, and an approved `re_route_required` completed gate that names the exact checkpoint path. Every later same-task state naming that checkpoint remains subject to the lifecycle gate. A resumed snapshot names the unique highest approved handoff applicable to its route revision; this preserves older authorized snapshots even after a newer route is approved. The historical checkpoint stays in the record but no longer blocks approved work. If current authority is duplicated at the highest revision, or a resumed state omits its applicable authority artifact, stop rather than guess.

This is distinct from infeasible intent. A route change can revise planning, task class, review level, sequencing, or resources while preserving intent. Evidence that safe implementation cannot preserve intent requires Conflict Report instead.

## Material events

Material events include scope expansion, new security or regression evidence, an unexpected repository architecture, independent parallel units, missing required authority, failed acceptance criteria, or a change that invalidates verification. Editorial corrections that preserve contract semantics are not material events, but they still make final verification stale.

## Decision table

| Evidence | Result |
| --- | --- |
| Route valid; no material delta | Continue from Work State. |
| `DIVERGED`; changes irrelevant to task | Continue without Local Delta and retain concise relevance evidence. |
| `DIVERGED`; changes relevant to task | Emit Local Delta and route it to Chat for freshness and material-event evaluation. |
| `UNKNOWN`; local state could be material | Request focused local evidence through Micro Consultation. |
| Route invalid; intent still feasible | Re-route Required and developer approval. |
| Intent cannot be preserved through safe adaptation | Conflict Report and stop. |
| Required check fails | Correct under the active route, then rerun fresh verification. |
