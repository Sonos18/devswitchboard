# Profile Refresh Without Automatic Re-route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to execute this plan sequentially. Implementation subagents are not approved. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clarify that new evidence may revise a Task Profile dimension without automatically invalidating the approved route or requiring Re-route Required.

**Architecture:** Separate evidence refresh from route invalidation. The Task Profile contract records current evidence, Chat evaluates that refreshed evidence against the active route and strategy, and R011 applies only when that evaluation finds actual invalidation; downstream workflow and recovery guidance consume this distinction without changing schemas or lifecycle provenance.

**Tech Stack:** Normative Markdown contracts and workflows, JSON Dogfood evidence, dependency-free Node.js repository verification.

**Spec:** Developer-approved DevSwitchboard Dogfood #014 Approved Handoff Revision 1 for task `devswitchboard-profile-refresh-without-reroute-014`, as constrained by the Stage 1 execution directive.

**Continuation authority:** At task revision 2, Chat evaluated the planning-time `parallelizability` refresh from `low` to `medium` and returned `CONTINUE_CURRENT_ROUTE`. Approved Handoff Revision 1 remains the intent and strategy authority; Routing Recommendation Revision 2 carries the post-refresh implementation route.

## Global Constraints

- Start implementation only after Chat completes the Stage 1 profile/route evaluation and returns continuation authority.
- Preserve the seven canonical Task Profile dimensions and the `low` / `medium` / `high` level vocabulary.
- Treat a profile refresh as evidence for route evaluation, not as a route decision.
- Emit Re-route Required only when refreshed evidence invalidates the active route or approved execution strategy; a level change alone is insufficient.
- Preserve R007's existing condition: independent units cause Re-route Required only if using them changes the approved strategy.
- Preserve the existing Re-route Required lifecycle, provenance, Work State, and Conflict Report semantics.
- Keep schema version `0.1`; no schema shape changes or historical-record migrations are needed.
- Execute without implementation subagents in the isolated worktree created from `be96653d59135b7c851265e59acfc51c92defe6c`.
- Use a fresh reviewer after implementation and fresh verification after the last content change.
- Do not create Re-route Required or Conflict Report merely because a Task Profile level changed.

## File Structure

| File | Responsibility |
| --- | --- |
| `docs/contracts/task-profile.md` | Canonical separation between evidence refresh, route evaluation, and route invalidation. |
| `docs/routing/rules.md` | R011 match and recommendation boundary; R007 remains conditionally strategy-sensitive. |
| `docs/workflows/chat.md` | Chat-owned evaluation of a refreshed profile against the active route. |
| `docs/workflows/codex.md` | Codex stop/return behavior after repository planning reveals new profile evidence. |
| `docs/contracts/re-route-required.md` | Qualify the parallel-units example by actual approved-strategy invalidation. |
| `docs/state-and-recovery.md` | Distinguish candidate material evidence from an event that actually invalidates route or strategy. |
| `dogfood/devswitchboard-profile-refresh-without-reroute-014.json` | Final run evidence, created only after implementation, review, and verification. |
| `dogfood/README.md` | Dogfood #014 index entry. |
| `docs/superpowers/plans/2026-08-25-profile-refresh-without-reroute.md` | Preserved repository-grounded plan and execution checklist. |

No change is planned for `schemas/task-profile.schema.json`, `schemas/re-route-required.schema.json`, `schemas/dogfood-record.schema.json`, `scripts/verify.mjs`, or `tests/verify-regressions.mjs`. The schemas already represent all three profile levels and Re-route Required lifecycle data, while the approved clarification changes the meaning of when routing evaluation selects R011 rather than any serialized shape.

---

### Task 1: Clarify the canonical Task Profile and R011 boundary

**Files:**
- Modify: `docs/contracts/task-profile.md`
- Modify: `docs/routing/rules.md`

**Interfaces:**
- Consumes: The seven-dimension Task Profile model and R007's existing conditional strategy-change rule.
- Produces: One canonical invariant for every downstream guide: profile evidence may change first; R011 applies only after route evaluation finds active-route or approved-strategy invalidation.

- [x] **Step 1: Rewrite the Task Profile refresh paragraph.**

Replace the final behavioral paragraph with normative text that states all four points explicitly:

```text
Profiles are phase-sensitive snapshots. New evidence MAY revise any affected dimension, but a tool MUST NOT revise an approved profile merely to justify a preferred route. Record the refreshed evidence at a higher task revision, then evaluate the active route and approved execution strategy separately. A dimension level change is not itself route invalidation; emit Re-route Required only when route evaluation determines that the refreshed evidence invalidates the active route or approved execution strategy.
```

- [x] **Step 2: Narrow R011's match without weakening its lifecycle.**

Use this match boundary in R011:

```text
- **Match:** New evidence invalidates the active route or approved execution strategy. When evidence revises the Task Profile, evaluate route impact immediately; this rule matches when that revision causes the invalidation. A profile revision or dimension level change alone does not match this rule.
```

Keep the existing waiting-for-developer Work State, exact artifact provenance, replacement Approved Handoff, and infeasible-intent distinction unchanged. Update the rationale to say that profiles are evidence snapshots while routes and strategies are evidence-bound decisions.

- [x] **Step 3: Inspect R007 and the rule ordering for accidental drift.**

Confirm R001 through R012 remain in ascending order and R007 still says:

```text
Consider parallel implementation resources and emit Re-route Required if this changes approved strategy.
```

- [x] **Step 4: Run focused core-contract checks.**

Run:

```text
rg -n "level change|route evaluation|invalidates the active route|changes approved strategy" docs/contracts/task-profile.md docs/routing/rules.md
node scripts/verify.mjs
```

Expected: the focused scan shows the evidence/decision boundary in both canonical files, all twelve routing rules remain present, and the verifier passes.

### Task 2: Align phase-owner workflow guidance

**Files:**
- Modify: `docs/workflows/chat.md`
- Modify: `docs/workflows/codex.md`

**Interfaces:**
- Consumes: Task 1's canonical evidence-refresh and R011-match invariant.
- Produces: Explicit Chat route evaluation and Codex pause/return behavior that do not pre-decide the route.

- [x] **Step 1: Add the profile-refresh evaluation to Chat's flow.**

Extend the profiling/readiness flow to require Chat to record any evidence-backed level revision and evaluate its effect on the active route as a separate decision. State that an unchanged route continues without Re-route Required, while actual route or strategy invalidation follows R011.

- [x] **Step 2: Replace Codex's automatic parallel-units trigger.**

Replace the current unconditional sentence about independent units with guidance equivalent to this exact sequence:

```text
If repository planning reveals new profile evidence, refresh the affected dimensions and return them for Chat route evaluation before strategy-dependent implementation. Independent units discovered after single-agent execution was approved do not by themselves require Re-route Required; emit it with trigger `PARALLEL_UNITS_DISCOVERED` only when route evaluation determines that the approved route or execution strategy is invalidated. Do not dispatch implementation subagents without developer approval.
```

- [x] **Step 3: Verify both phase-owner boundaries independently.**

Run:

```text
rg -n "profile|route evaluation|Re-route Required|implementation subagents" docs/workflows/chat.md docs/workflows/codex.md
```

Expected: Chat owns the route evaluation, Codex supplies repository-grounded evidence and stops, and neither workflow treats a level change as an automatic route decision.

### Task 3: Align recovery and Re-route Required examples

**Files:**
- Modify: `docs/contracts/re-route-required.md`
- Modify: `docs/state-and-recovery.md`

**Interfaces:**
- Consumes: Task 1's R011 match boundary.
- Produces: Examples and recovery guidance that distinguish candidate evidence from actual invalidation while preserving the pending/superseded checkpoint lifecycle.

- [x] **Step 1: Qualify the independent-units contract example.**

Change the example so it describes independent units as a Re-route Required trigger only when adopting parallel resources would change the approved single-agent route or execution strategy.

- [x] **Step 2: Qualify the material-events list.**

State that scope expansion, risk evidence, unexpected architecture, independent units, missing authority, acceptance failure, and verification invalidation are candidate material evidence. They become an R011 material event when route evaluation determines that they invalidate the active route or approved execution strategy. Preserve the existing rule that editorial corrections only stale verification.

- [x] **Step 3: Check lifecycle language remained intact.**

Run:

```text
rg -n "waiting_for_developer|Approved Handoff|profile|route evaluation|approved route|approved execution strategy|Conflict Report" docs/contracts/re-route-required.md docs/state-and-recovery.md
```

Expected: profile refresh is distinct from invalidation, and all pending-checkpoint, supersession, Work State, and infeasible-intent rules remain present.

### Task 4: Create final Dogfood #014 evidence after semantics stabilize

**Files:**
- Create: `dogfood/devswitchboard-profile-refresh-without-reroute-014.json`
- Modify: `dogfood/README.md`

**Interfaces:**
- Consumes: The Chat route evaluation returned after this Stage 1 stop, implementation evidence from Tasks 1-3, the existing closed Dogfood schema, and final review/verification results.
- Produces: One schema-valid run showing an evidence-backed profile refresh with zero Re-route Required and zero Conflict Report artifacts.

- [x] **Step 1: Create the record only after Chat returns route authority.**

Use these exact control values:

```json
{
  "task_id": "devswitchboard-profile-refresh-without-reroute-014",
  "revision": 2,
  "execution_strategy": {
    "implementation_subagents": false,
    "review_subagent": true,
    "workspace_isolation": true,
    "methodology_adapter": "superpowers"
  },
  "measurements": {
    "phase_timings": [],
    "clarification_loops": 0,
    "re_routes": [],
    "verification_failures": [],
    "developer_overrides": []
  },
  "preflight": {
    "outcome": "compatible",
    "adaptations": [],
    "conflicts": []
  }
}
```

Complete all other required Dogfood fields with the actual returned Chat decision, implemented file inventory, review disposition, and fresh verification evidence. Record the profile before/after evidence in `observations` and `developer_controls`; do not add an unapproved `profile_refresh` schema field.

Record Routing Recommendation Revision 2 in the existing string evidence surfaces with these exact values: phase `implementation`, surface `codex`, matched rule `R001`, workflow `approved_architectural_sequential_implementation`, implementation subagents `false`, workspace isolation `true`, fresh independent review required, and developer approval required `false`. Do not create a new authority artifact or schema field.

- [x] **Step 2: Record the lifecycle boundary.**

The record must state that Stage 1 stopped before route evaluation, Chat evaluated the refreshed profile, no Re-route Required was created solely from a profile change, no Conflict Report was created, and implementation resumed only under the authority Chat returned. Do not claim the route remained valid until the returned Chat decision supplies that fact.

- [x] **Step 3: Add the Dogfood index entry and validate the incomplete record.**

Run:

```text
node scripts/verify.mjs
```

Expected: the new record validates with `result: not_run`, review and verification `not_run`, and no extra schema field.

### Task 5: Run fresh independent review and remediate

**Files:**
- Modify as findings require: only files listed in this plan

**Interfaces:**
- Consumes: The full uncommitted diff, this plan, Approved Handoff Revision 1, and Chat's Stage 1 route decision.
- Produces: Severity-ranked fresh-context findings with every valid clarification, lifecycle, authority, and scope issue remediated.

- [x] **Step 1: Give one fresh reviewer the exact adversarial questions.**

Require the reviewer to check that a profile revision is evidence-backed, level change is not equated with route invalidation, R007 and R011 remain consistent, Chat retains route evaluation, Codex does not continue before that evaluation, Re-route Required provenance is unchanged, Conflict Report remains reserved for infeasible intent, and schemas/version `0.1` did not drift. The reviewer must not edit files or dispatch subagents.

- [x] **Step 2: Remediate every valid finding in scope.**

Correct Critical and Important findings before continuing. Correct Minor findings that affect the profile/route boundary, developer authority, lifecycle consistency, or acceptance coverage. Re-run the focused check for every file changed during remediation.

- [x] **Step 3: Re-review material remediations.**

Reuse a fresh review context until no Critical or Important finding remains and all in-scope semantic Minor findings are resolved.

### Task 6: Finalize evidence and run fresh verification

**Files:**
- Modify: `dogfood/devswitchboard-profile-refresh-without-reroute-014.json`
- Modify: `docs/superpowers/plans/2026-08-25-profile-refresh-without-reroute.md`

**Interfaces:**
- Consumes: Final remediated tree and fresh review result.
- Produces: Current Dogfood completion evidence, checked plan state, and an exact local handoff inventory.

- [x] **Step 1: Finalize Dogfood evidence after review.**

Set `result: pass`, review to `pass` or `findings_remediated`, verification to `pass`, and `next_action: developer_review` only after those gates actually complete. Record zero re-routes and zero conflicts only if the repository contains no task-scoped Re-route Required or Conflict Report artifact.

- [x] **Step 2: Run fresh checks after the final evidence change.**

Run:

```text
node tests/verify-regressions.mjs
node scripts/verify.mjs
git diff --check
git diff --cached --check
```

Also parse the new JSON independently, inspect the exact changed-file inventory, confirm R001-R012 ordering, confirm schema version `0.1`, scan unresolved markers, and verify no schema, verifier, regression, Approved Handoff, Work State, Re-route Required, or Conflict Report file changed.

- [x] **Step 3: Hand off without unauthorized external effects.**

Return the implemented clarification, profile-refresh evidence, Chat route decision provenance, exact inventory, review disposition, and fresh verification results. Commit, push, PR, merge, release, and publication remain subject to explicit later authority.

## Stage 1 Planning Checkpoint

- Codex Preflight is `compatible`: the isolated worktree is clean at the exact baseline, matches `origin/main`, and both baseline verification commands pass.
- No new planning evidence changes `requirement_ambiguity`, `scope_complexity`, `repository_dependency`, `regression_risk`, `security_sensitivity`, or `context_uncertainty` from their Approved Handoff Revision 1 levels.
- New repository evidence supports revising `parallelizability` from `low` to `medium`: the canonical Task Profile/R011 pair must stabilize sequentially, after which phase-owner guidance, recovery guidance, and final Dogfood evidence occupy disjoint files with focused independent checks. This matches the repository's existing medium-level evidence pattern: core semantics first, later consumers may separate.
- The refreshed parallelizability evidence touches the approved single-agent authorship and R007/R011 strategy-change assumptions. It does not itself determine whether those assumptions are invalidated.
- Chat evaluated the refreshed profile at task revision 2 and returned `CONTINUE_CURRENT_ROUTE`; `active_route_invalidated = false`, `approved_strategy_invalidated = false`, Re-route Required count is zero, and developer reapproval count is zero.
- Approved Handoff Revision 1 remains the intent and strategy authority. Routing Recommendation Revision 2 is the post-refresh route evidence; no Approved Handoff Revision 2 is created solely for this refresh.
- Resume Task 1 from this checkpoint without repeating requirement discovery, design, Codex Preflight, or implementation planning.
