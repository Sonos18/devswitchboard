# Conflict Report Lifecycle Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce pending Conflict Report pauses and developer-approved intent resumption across canonical records without changing schema version `0.1`.

**Architecture:** Extend the dependency-free semantic verifier's existing repository record index with Conflict Report association, approved-intent provenance, paused-state validation, resumed-state authority, and conflict-evidence linkage. Repository-copy regressions exercise real verifier behavior with synthetic canonical records, while normative Markdown and Dogfood records explain and preserve the full lifecycle.

**Tech Stack:** Node.js ES modules, filesystem-backed JSON fixtures, Draft 2020-12 repository schemas, Markdown.

**Spec:** `docs/superpowers/specs/2026-08-21-conflict-lifecycle-enforcement.md`

## Global Constraints

- Preserve schema version `0.1`; do not change schema files unless a new developer-approved material event authorizes it.
- Resume the existing `codex/dogfood-008-conflict-recovery` worktree and preserve all valid Revision 1 checkpoint evidence.
- Execute implementation sequentially without implementation subagents.
- Use one dedicated fresh-context reviewer after implementation.
- Do not commit, push, merge, create a Pull Request, tag, release, package, publish Pages, delete the branch, or delete the worktree.
- Historical Conflict Report and blocked Work State artifacts remain canonical after approval.
- Re-route Required, environment failure, and verification recovery remain distinct from Conflict Report.

---

### Task 1: Persist approved replacement authority and resumed state

**Files:**
- Create: `dogfood/devswitchboard-conflict-recovery-008-approved-handoff-revision-2.json`
- Create: `dogfood/devswitchboard-conflict-recovery-008-resumed-work-state.json`
- Create later in Task 5: `dogfood/devswitchboard-conflict-recovery-008-final-work-state.json`

**Interfaces:**
- Consumes: Conflict Report task `devswitchboard-conflict-recovery-008`, revision `2`, and canonical report path.
- Produces: A schema-conforming Approved Handoff whose approved `conflict_report` gate names the report, plus an active Work State that names the report and replacement handoff.

- [x] **Step 1: Persist the supplied Approved Handoff Revision 2 verbatim as canonical JSON.**

- [x] **Step 2: Add an active resumed Work State.**

Use `revision: 2`, `lifecycle_state: active`, `current_phase: implementation_planning`, and `active_route.revision: 2`. Reference the exact Conflict Report path, Approved Handoff Revision 2, specification, and plan. Reuse requirement discovery, design, Revision 1 feasibility evidence, baseline evidence, and isolation; record no blocker.

- [x] **Step 3: Validate persisted authority before adding relational enforcement.**

Run: `node scripts/verify.mjs`

Expected: PASS because the new authority and resumed state conform while Conflict Report cross-record enforcement is not yet implemented.

### Task 2: Add regression-first Conflict Report lifecycle coverage

**Files:**
- Modify: `tests/verify-regressions.mjs`

**Interfaces:**
- Consumes: Existing `copyRepository`, `runVerifier`, `readJson`, `writeJson`, `rewriteJson`, `expectRejected`, and `expectAccepted` helpers.
- Produces: Synthetic Conflict Report lifecycle builders and literal accepted/rejected verifier cases.

- [x] **Step 1: Add synthetic Conflict Report lifecycle builders.**

Create `writeConflictScenario(copyRoot, label, options)` that copies Dogfood #008's canonical Conflict Report and blocked Work State under a unique task ID, rewrites exact artifact provenance, optionally writes an approved handoff, and optionally creates active or complete resumed state. Create `writeApprovedConflictResolution` and `writeLaterConflictState` helpers for revision-history and ambiguity cases.

- [x] **Step 2: Add accepted behavior cases.**

Assert real verifier success for these literal scenarios:

```text
pending conflict + exact blocked_by_conflict state + developer-decision next action
approved exact-provenance Revision 2 + active Work State referencing the handoff
approved resolution retains the historical blocked Work State
newer approved revision does not retroactively invalidate an older authorized snapshot
```

- [x] **Step 3: Add rejected behavior cases.**

Assert real verifier failure for these literal scenarios and expected messages:

```text
pending conflict without matching Work State
pending conflict + active implementation
pending conflict + premature complete
pending conflict + strategy-dependent next action
pending conflict + later-revision active evasion
unrelated-task approval
approval without exact Conflict Report gate provenance
unapproved handoff
resumed active Work State missing approved handoff provenance
ambiguous highest approved intent revision
INTENT_CONFLICT Dogfood finding without a same-task Conflict Report
```

- [x] **Step 4: Run regressions and capture RED evidence.**

Run: `node tests/verify-regressions.mjs`

Expected: FAIL because the baseline verifier accepts one or more new invalid Conflict Report lifecycle states. Record the exact invalid cases accepted before implementation.

### Task 3: Implement minimal cross-record Conflict Report enforcement

**Files:**
- Modify: `scripts/verify.mjs`
- Create: `examples/conflict-report-work-state.json`

**Interfaces:**
- Consumes: `collectRecords`, normalized repository paths, `referencesArtifact`, and canonical approval/readiness fields.
- Produces: Conflict-to-state association, unique approved intent selection, pending-state enforcement, approved-resume provenance enforcement, and same-task conflict-finding linkage.

- [x] **Step 1: Add a developer-decision-oriented next-action predicate.**

Recognize a request to the developer, an intent decision, or returning the Conflict Report. Reject positive strategy-dependent verbs for implementation, execution, modification, continuation, resumption, planning, verification, or completion, while allowing explicit prohibitions such as `Do not continue implementation; return the Conflict Report for a developer intent decision.`

- [x] **Step 2: Discover and associate Conflict Reports.**

Collect records with `schema: conflict_report`. Treat every same-task Work State at or after the report revision as subject to the lifecycle and require its `authoritative_artifacts` to contain the exact report path. Treat a subject state whose route revision equals the report revision and lifecycle is `blocked_by_conflict` as the historical checkpoint; exempt only pre-conflict snapshots.

- [x] **Step 3: Select approved intent resolution by exact provenance.**

Qualifying Approved Handoffs use the same task, revision not lower than the report, affirmative canonical approval/readiness fields, and an approved `conflict_report` completed gate whose `evidence_source` is the exact report path. Reject multiple qualifying handoffs at the highest revision.

- [x] **Step 4: Enforce pending and resumed behavior.**

Pending reports require a checkpoint Work State. Every subject state must name the report, be `blocked_by_conflict`, and use a fail-closed developer-decision-oriented non-mutating next action. After approval, each subject active or complete state must name both the report and the unique highest qualifying handoff whose revision does not exceed its route revision.

- [x] **Step 5: Enforce conflict evidence linkage.**

Require a Dogfood record containing `finding.type: INTENT_CONFLICT` to have a same-task Conflict Report. Do not infer conflict merely from route, environment, or verification-failure records.

- [x] **Step 6: Add and pin the canonical pending example.**

Create `examples/conflict-report-work-state.json` for `examples/conflict-report.json`, revision `2`, `blocked_by_conflict`, verification `not_started`, exact report provenance, and a developer-decision next action. Add the example to `checkRequiredStructure()`.

- [x] **Step 7: Run focused regressions and full verification for GREEN.**

Run: `node tests/verify-regressions.mjs`

Run: `node scripts/verify.mjs`

Expected: PASS for the complete regression suite and every verifier group.

### Task 4: Align normative contracts, routing, and recovery guidance

**Files:**
- Modify: `docs/contracts/conflict-report.md`
- Modify: `docs/contracts/work-state.md`
- Modify: `docs/routing/rules.md`
- Modify: `docs/state-and-recovery.md`

**Interfaces:**
- Consumes: Implemented record identity, provenance, pending, and resumption rules.
- Produces: Normative human guidance that matches verifier behavior without redefining schemas.

- [x] **Step 1: Document exact Conflict Report lifecycle identity and approval provenance.**

State the same-task, exact artifact, revision, affirmative approval, unique-authority, blocked checkpoint, non-mutating next action, resumed-state provenance, and historical-evidence invariants.

- [x] **Step 2: Clarify R004 and Work State recovery.**

Document that approved intent revision resolves the pending gate only through exact Conflict Report provenance, while Re-route Required handles feasible route changes and environment/verification recovery remain separate.

- [x] **Step 3: Rerun regressions and the full verifier.**

Run: `node tests/verify-regressions.mjs`

Run: `node scripts/verify.mjs`

Expected: PASS for both.

### Task 5: Complete Dogfood #008 lifecycle evidence

**Files:**
- Modify: `dogfood/README.md`
- Modify: `dogfood/devswitchboard-conflict-recovery-008.json`
- Create: `dogfood/devswitchboard-conflict-recovery-008-final-work-state.json`

**Interfaces:**
- Consumes: Revision 1 checkpoint, approved Revision 2 authority, RED/GREEN evidence, review result, and final verification.
- Produces: One preserved lifecycle from bounded Revision 1 through approved architectural Revision 2.

- [x] **Step 1: Record resumption without reopening reused gates.**

Keep the original Conflict Report and blocked Work State unchanged as historical evidence. Add Revision 2 authority, superseded restriction, architectural plan, sequential implementation, dedicated review, and one developer conflict-resolution approval to the Dogfood run.

- [x] **Step 2: Create a final Work State as an active review snapshot.**

Use revision `2`, lifecycle `active`, phase `review`, verification `in_progress`, and exact report/handoff/spec/plan provenance. Task 7 changes only this final state to `complete` after current review and verification evidence exist.

- [x] **Step 3: Keep result and review incomplete until their gates finish.**

Use `result: not_run`, `review.status: not_run`, and `verification.status: not_run` until Tasks 6 and 7 produce current evidence.

### Task 6: Run dedicated fresh-context review and remediate

**Files:**
- Create: `dogfood/devswitchboard-conflict-recovery-008-review.md`
- Modify as findings require: approved task files only

**Interfaces:**
- Consumes: Complete local diff, Approved Handoff Revision 2, specification, implementation plan, and baseline SHA.
- Produces: Severity-ranked read-only review evidence and remediated Critical/Important findings.

- [x] **Step 1: Dispatch one read-only fresh reviewer with minimal context.**

Require the reviewer to challenge unresolved-conflict continuation, permanent historical blockers, revision/provenance spoofing or ambiguity, Conflict versus Re-route/Environment/Verification distinctions, fixture overfitting, existing valid lifecycle regressions, and schema-version stability. The reviewer must not edit or dispatch subagents.

- [x] **Step 2: Verify every finding against repository behavior.**

Apply valid Critical and Important fixes one at a time. Add focused failing regressions before verifier fixes, then rerun the affected checks.

- [x] **Step 3: Re-review after any Critical or Important remediation.**

Reuse the same reviewer with the updated diff until no valid Critical or Important issue remains.

### Task 7: Run fresh final verification and close local Work State

**Files:**
- Modify: `dogfood/devswitchboard-conflict-recovery-008.json`
- Modify: `dogfood/devswitchboard-conflict-recovery-008-final-work-state.json`
- Modify: `docs/superpowers/plans/2026-08-21-conflict-lifecycle-enforcement.md`

**Interfaces:**
- Consumes: Final remediated tree.
- Produces: Current completion evidence, exact final inventory, and complete local Work State.

- [x] **Step 1: Run targeted and complete checks after the last remediation.**

Run:

```text
node tests/verify-regressions.mjs
node scripts/verify.mjs
git diff --check
git diff --cached --check
```

Also parse every JSON record, compare every schema file's `schema_version`-equivalent constants to baseline, scan unresolved markers, assert the exact task inventory, and confirm the historical Conflict Report/blocked state coexist with an approved, provenance-linked resumed state.

- [x] **Step 2: Record completion only after Step 1 succeeds.**

Set Dogfood review to `pass` or `findings_remediated`, verification and result to `pass`, and next action to `developer_review`. Promote the final Work State to `complete`, phase `handoff`, verification `passed`, and next action `developer_review`.

- [x] **Step 3: Rerun all Step 1 checks after the evidence update.**

Expected: every check passes, the exact inventory contains no unrelated file, and no schema file or schema version changed.

- [x] **Step 4: Stop without Git or publication effects.**

Return the exact changed-file set, RED/GREEN evidence, enforcement approach, review disposition, final Work State, and fresh verification evidence. Do not commit or publish.
