# Codex Workflow

Codex owns repository-facing work while preserving the Approved Handoff as intent truth.

## 1. Preflight

Inspect the actual workspace, repository status, available toolchain, local instructions, and material delta. Compare those facts with the declared baseline and produce one outcome:

- `compatible`: proceed without intent-affecting change;
- `compatible_with_adaptation`: record repository-level adaptations and proceed; or
- `blocked_by_conflict`: stop and emit Conflict Report.

An expected empty repository is compatible. A filename, standard serialization, or text convention is an adaptation; product thesis, scope, control model, phase routing, Task Profile dimensions, routing model, and adapter support are intent.

### Local-context bridge

Codex owns observed local repository facts, not general context acquisition or intent:

- Respond to a `LOCAL` Micro Consultation with one focused finding, evidence, implication, and `decision: none`; the current phase owner remains unchanged.
- Emit Local Delta when the workspace is `DIVERGED` and local changes are task-relevant. Dirty state alone is insufficient.
- Do not emit Local Delta for irrelevant divergence. When state is `UNKNOWN` and could materially affect the task, perform or answer a focused local consultation first.
- Leave `REMOTE` fact acquisition with Chat/GitHub and route `INTENT` questions to the developer.

Context Depth is the amount of information required; Context Source is where it must be obtained. Neither substitutes for the other. Approved Handoff remains intent truth and the implementation-boundary artifact.

## 2. Persist and prepare

Persist the approved specification before implementation. When the selected route includes `implementation_planning`, create a repository-grounded implementation plan with exact files, interfaces, checks, and scope constraints; architectural or high-complexity R006 work always requires that phase. When Approved Handoff `0.2` is `prepared`, map every logical work unit to local evidence and exact targets as `reused`, `adapted`, or `invalidated`. Adaptation may change repository decomposition or ordering while preserving intent and strategy. Invalidation MUST classify its impact as `repository_adaptation`, `route_or_strategy_invalidation`, or `intent_feasibility_conflict` and follow the existing lifecycle.

Reconsider approved preparation only when recorded local evidence can materially change feasibility, decomposition, route, strategy, scope, acceptance, or confidence. Repetition without such local value is duplicated reasoning. Upstream preparation never replaces local instruction discovery, workspace inspection, baseline comparison, material-delta evaluation, or conflict detection.

During implementation planning, decompose the actual work far enough to evaluate implementation parallelism, bounded implementation delegation, fresh independent review, and fresh final verification independently. For each optional resource, distinguish technical eligibility from selection and report concrete eligibility evidence, expected execution, decision, or confidence benefits, coordination, context-transfer, and integration costs, and any missing repository fact that could change the value judgment. Do not invent numeric savings or infer that `parallelizable` means parallel agents or that `bounded` means an implementation worker. When Chat owns the pending route/value evaluation, return the evidence without selecting resources and preserve the active strategy until Chat responds.

A valid low-risk R012 route with `upstream_preparation.status: not_needed` may proceed from compatible Codex Preflight directly to bounded implementation without fabricating a separate `implementation_planning` phase, plan artifact, or repeated approach analysis. The Approved Handoff and selected route still bound that execution, and Codex identifies the relevant files and checks needed for the bounded change. Apply Semantic Gate Deduplication in either path: an approved upstream design can satisfy design exploration, but it does not satisfy local preflight or fresh final verification.

## 3. Implement

Follow the developer-approved execution strategy and the selected resources in the active Routing Recommendation. Technical eligibility or adapter-practice availability alone neither selects a resource nor authorizes invocation. Before changing strategy, evaluate material events. If repository planning reveals new profile evidence, refresh the affected dimensions and return them for Chat route evaluation before strategy-dependent implementation. Independent units discovered after single-agent execution was approved do not by themselves require Re-route Required; emit it with trigger `PARALLEL_UNITS_DISCOVERED` when route evaluation determines that either the active route or approved execution strategy is invalidated. Continue the current route without developer reapproval only when both remain valid, and do not dispatch implementation subagents without developer approval. When optional resource value does not materially exceed its orchestration costs, retain the lower-orchestration route.

Keep bridge contract names and field semantics stable. When production executable code exists, use the appropriate correctness cycle; documentation-only work uses structural and semantic checks.

## 4. Review

Review against the approved specification, not only the implementation plan. Select fresh review independently when a non-authoring context has material contradiction-detection value; single-context implementation does not preclude that review resource. Confirm contract/schema agreement, example conformity, routing order, developer authority, scope exclusions, and acceptance coverage. Triage findings by evidence and remediate confirmed defects.

## 5. Verify and hand off

Run fresh verification after the last change. Final verification is mandatory, never reused, and never removed through optional-resource value or orchestration-cost reasoning. Emit Verification Report and update Work State to `complete` only when required checks pass. Then return structured technical completion evidence to Chat:

```yaml
phase: completion
state: READY_FOR_CHAT_ACCEPTANCE
next_owner: chat
```

Chat owns technical acceptance and remediation routing. Technical defects return to Codex. Material intent, policy, authority, strategy, override, merge, or publication decisions return through Chat to the Developer. The Developer remains final authority but does not have to inspect implementation diffs, source code, tests, verifier output, technical review findings, or technical remediation. `developer_acceptance_required` in the existing Verification Report continues to preserve Developer final authority; it does not require personal technical inspection or change that contract's version.

## Recovery paths

- Validation defect: correct it, set `verification_failed` while unresolved, and rerun fresh verification.
- Route invalidated: emit Re-route Required and pause strategy-dependent work.
- Intent-versus-feasibility conflict: emit Conflict Report and pause mutating work.
- Interrupted work with valid route: restore from Work State and continue its recorded next safe action.
- Local Delta checkpoint: return the validated artifact, record Chat as next owner, and pause until the developer returns Chat’s continuation, re-route, or conflict decision.
