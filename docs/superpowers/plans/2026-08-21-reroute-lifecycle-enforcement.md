# Re-route Lifecycle Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce pending Re-route Required pauses and approved supersession across canonical records without changing schema version `0.1`.

**Architecture:** Extend the dependency-free semantic verifier with a repository-wide record index and small relational predicates for checkpoint association, replacement approval, paused-state validation, resumed-state provenance, route-invalidation evidence, and conflict distinction. Regression fixtures create isolated synthetic record sets in disposable repository copies, proving each invalid state is rejected and each valid lifecycle is accepted before documentation and Dogfood evidence are finalized.

**Tech Stack:** Node.js ES modules, filesystem-backed JSON fixtures, Draft 2020-12 repository schemas, Markdown.

**Spec:** `docs/superpowers/specs/2026-08-21-reroute-lifecycle-enforcement.md`

## Global Constraints

- Preserve schema version `0.1`; do not modify schemas unless a newly discovered material event is approved.
- Reuse the existing `codex/dogfood-007-reroute-recovery` worktree and all still-valid Revision 1 evidence.
- Execute sequentially without implementation subagents.
- Use a dedicated fresh-context reviewer after implementation.
- Do not commit, push, merge, create a PR, tag, release, package, publish Pages, delete the branch, or delete the worktree.
- Historical Re-route Required artifacts remain evidence and must not block a qualifying approved replacement revision.
- Conflict Report remains reserved for intent that cannot be preserved safely.

---

### Task 1: Persist approved replacement authority and canonical lifecycle records

**Files:**
- Create: `dogfood/devswitchboard-reroute-recovery-007-approved-handoff-revision-2.json`
- Create: `dogfood/devswitchboard-reroute-recovery-007-resumed-work-state.json`
- Create later in Task 5: `dogfood/devswitchboard-reroute-recovery-007-final-work-state.json`
- Modify: `dogfood/devswitchboard-reroute-recovery-007-work-state.json`

**Interfaces:**
- Consumes: Re-route Required checkpoint identity `devswitchboard-reroute-recovery-007`, revision `2`, and canonical checkpoint path.
- Produces: A schema-conforming Approved Handoff whose approved `re_route_required` completed gate names the checkpoint, plus an active Work State that names both checkpoint and replacement handoff.

- [x] **Step 1: Create the canonical Approved Handoff Revision 2 record**

Use `task_id: devswitchboard-reroute-recovery-007`, `revision: 2`, `task_class: architectural`, the seven updated Task Profile levels from the checkpoint, implementation planning owned by Codex, sequential implementation without subagents, dedicated review, existing isolation, and an approved completed gate:

```json
{
  "gate": "re_route_required",
  "status": "approved",
  "evidence_source": "dogfood/devswitchboard-reroute-recovery-007-re-route-required.json"
}
```

- [x] **Step 2: Preserve the historical paused Work State and add an active resumed state**

The resumed state must use `revision: 2`, `lifecycle_state: active`, `current_phase: implementation_planning`, reference both the checkpoint and Approved Handoff paths, set `active_route.revision: 2`, and name the persisted implementation plan as its next safe action.

- [x] **Step 3: Run schema and baseline validation**

Run: `node scripts/verify.mjs`

Expected: PASS before relational enforcement is added, proving the authority fixtures themselves conform.

### Task 2: Add regression-first lifecycle coverage

**Files:**
- Modify: `tests/verify-regressions.mjs`

**Interfaces:**
- Consumes: Existing `copyRepository`, `runVerifier`, `writeJson`, and canonical Dogfood #007 records.
- Produces: `expectAccepted`, synthetic reroute lifecycle fixture builders, and focused red/green cases.

- [x] **Step 1: Add an acceptance helper**

```js
function expectAccepted(name, mutate) {
  const { temporaryRoot, copyRoot } = copyRepository();
  try {
    mutate(copyRoot);
    const result = runVerifier(copyRoot);
    if (result.status !== 0) {
      throw new Error(`${name}: verifier rejected the valid record set\n${result.stdout}${result.stderr}`);
    }
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}
```

- [x] **Step 2: Add synthetic lifecycle builders**

Create helpers that copy the canonical Dogfood #007 Re-route Required, paused Work State, and Approved Handoff records under a unique `task_id`, rewrite artifact paths to the synthetic filenames, and optionally create a resumed Work State referencing the approved replacement.

- [x] **Step 3: Add the required behavior cases**

Add literal cases proving:

```text
pending reroute + waiting_for_developer + approval-oriented action -> accepted
pending reroute + active implementation -> rejected: pending Re-route Required requires waiting_for_developer Work State
pending reroute + complete -> rejected: pending Re-route Required cannot be complete
pending reroute + strategy-dependent next action -> rejected: pending Re-route Required next safe action must wait for approval
approved same-task replacement with exact gate provenance + active state -> accepted
unrelated or unproven approval + active state -> rejected
resumed active state missing replacement artifact provenance -> rejected
ROUTE_INVALIDATION finding without same-task reroute -> rejected
intent_feasibility: infeasible in ordinary reroute -> rejected: intent infeasible requires Conflict Report
ambiguous highest approved replacement revision -> rejected
```

- [x] **Step 4: Run regressions and capture RED evidence**

Run: `node tests/verify-regressions.mjs`

Expected: FAIL because the current verifier accepts the new invalid cross-record cases. Record the exact failing case names in Dogfood #007 evidence.

### Task 3: Implement minimal cross-record semantic enforcement

**Files:**
- Modify: `scripts/verify.mjs`
- Create: `examples/re-route-required-work-state.json`

**Interfaces:**
- Consumes: All canonical JSON records under `examples/` and `dogfood/`.
- Produces: Normalized record paths, checkpoint-to-state association, unique highest replacement approval selection, and semantic failures used by Task 2.

- [x] **Step 1: Add normalized record discovery**

Introduce a helper returning `{ file, path, record }` for every JSON record in `examples/` and `dogfood/`, with repository-relative paths normalized to `/`.

- [x] **Step 2: Add association and approval predicates**

Implement these exact relationships:

```js
isCheckpointState(reroute, state)
  = same task_id
    && authoritative_artifacts includes reroute.path
    && state.active_route.revision === reroute.record.revision

isApprovedReplacement(reroute, handoff)
  = same task_id
    && handoff.revision >= reroute.revision
    && canonical approval/readiness fields are true
    && completed_gates contains approved re_route_required
    && gate.evidence_source === reroute.path
```

Select the unique qualifying handoff at the highest revision; report ambiguity when more than one qualifies at that revision.

- [x] **Step 3: Enforce pending and resumed Work State behavior**

Pending checkpoints require a matching `waiting_for_developer` state and an approval-oriented, non-strategy-dependent next action. After approval, `active` or `complete` corresponding states must reference the selected replacement handoff path and use a route revision at least as high as the handoff revision.

- [x] **Step 4: Enforce silent-adaptation and conflict distinctions**

Require every Dogfood `ROUTE_INVALIDATION` finding to have a same-task Re-route Required artifact. Reject Re-route Required trigger/profile evidence that explicitly states intent is infeasible or cannot be preserved safely.

- [x] **Step 5: Add the canonical pending Work State required by the new invariant**

Associate `examples/re-route-required-work-state.json` with `examples/re-route-required.json`, task `example-parallel-units`, revision `2`, lifecycle `waiting_for_developer`, route evaluation as the next safe action, and a developer-approval blocker.

- [x] **Step 6: Run focused regressions and capture GREEN evidence**

Run: `node tests/verify-regressions.mjs`

Expected: `workflow-integrity regressions: PASS`.

- [x] **Step 7: Run the full verifier**

Run: `node scripts/verify.mjs`

Expected: every verification group PASS.

### Task 4: Add canonical pending example and normative documentation

**Files:**
- Modify: `scripts/verify.mjs`
- Modify: `docs/routing/rules.md`
- Modify: `docs/contracts/re-route-required.md`
- Modify: `docs/contracts/work-state.md`
- Modify: `docs/state-and-recovery.md`

**Interfaces:**
- Consumes: Implemented verifier relationships and existing Revision 1 explanatory aid.
- Produces: A stable pending example and human-readable normative rules matching enforcement.

- [x] **Step 1: Pin the example in required repository structure**

Add `examples/re-route-required-work-state.json` to `checkRequiredStructure()` so canonical pending evidence cannot disappear silently.

- [x] **Step 2: Document pending, superseded, and conflict behavior**

Clarify R011, Re-route Required, Work State, and recovery guidance with the exact task/revision/artifact provenance rule, approved-gate supersession, approval-oriented next action, resumed-state provenance, and the distinction between route invalidation and infeasible intent.

- [x] **Step 3: Rerun regressions and the full verifier**

Run: `node tests/verify-regressions.mjs`

Run: `node scripts/verify.mjs`

Expected: PASS for both.

### Task 5: Complete Dogfood lifecycle evidence and final Work State

**Files:**
- Modify: `dogfood/README.md`
- Modify: `dogfood/devswitchboard-reroute-recovery-007.json`
- Modify: `dogfood/devswitchboard-reroute-recovery-007-work-state.json`
- Modify: `dogfood/devswitchboard-reroute-recovery-007-resumed-work-state.json`
- Create: `dogfood/devswitchboard-reroute-recovery-007-final-work-state.json`

**Interfaces:**
- Consumes: Red/green evidence, dedicated review result, final verification commands.
- Produces: Complete lifecycle evidence from bounded Revision 1 through approved architectural Revision 2.

- [x] **Step 1: Preserve checkpoint history and record approval resumption**

Keep the Revision 1 Work State at `waiting_for_developer`; record Revision 2 approval, architectural planning, sequential implementation, dedicated review, and zero conflicts/requirement rework in the Dogfood run.

- [x] **Step 2: Create the final Work State as an active review snapshot**

Use `revision: 2`, `lifecycle_state: active`, `current_phase: review`, and `verification_state: in_progress`; reference the checkpoint, Approved Handoff Revision 2, specification, and plan. Task 7 promotes this record to `complete` only after review and fresh verification evidence exist.

- [x] **Step 3: Keep the run incomplete until review and final verification finish**

Use `result: not_run`, `review.status: not_run`, and `verification.status: not_run` until Tasks 6 and 7 provide current evidence.

### Task 6: Run dedicated fresh-context review and remediate findings

**Files:**
- Create: `dogfood/devswitchboard-reroute-recovery-007-review.md`
- Modify as findings require: approved task files only

**Interfaces:**
- Consumes: The complete local diff, specification, plan, and Revision 2 review checklist.
- Produces: Severity-ranked review evidence and remediated Critical/Important findings.

- [x] **Step 1: Dispatch one read-only fresh reviewer**

Give the reviewer the baseline SHA, exact working-tree diff, spec/plan paths, and the six required challenge areas from Approved Handoff Revision 2. The reviewer must not edit or dispatch subagents.

- [x] **Step 2: Evaluate every finding technically**

Apply Critical and Important fixes one at a time with focused regression evidence. Record valid Minor findings or justified non-action without expanding scope.

- [x] **Step 3: Re-review after any Critical or Important remediation**

Use the same reviewer with the updated diff. Do not mark review complete while any valid Critical or Important issue remains.

### Task 7: Run fresh final verification and close local Work State

**Files:**
- Modify: `dogfood/devswitchboard-reroute-recovery-007.json`
- Modify: `dogfood/devswitchboard-reroute-recovery-007-final-work-state.json`
- Modify: `docs/superpowers/plans/2026-08-21-reroute-lifecycle-enforcement.md`

**Interfaces:**
- Consumes: Final remediated tree.
- Produces: Current completion evidence and exact final inventory.

- [x] **Step 1: Run targeted and complete verification after the last remediation**

Run:

```text
node tests/verify-regressions.mjs
node scripts/verify.mjs
git diff --check
git diff --cached --check
```

Also parse every JSON record, assert the exact task inventory, scan unresolved markers, and verify no strategy-dependent pending state remains unsuperseded.

- [x] **Step 2: Record final pass only after Step 1 succeeds**

Set Dogfood `review.status` to `pass` or `findings_remediated`, `verification.status` to `pass`, `result` to `pass`, and `next_action` to `developer_review`. Keep the historical paused and active Work States as evidence; the final Work State represents current completion.

- [x] **Step 3: Rerun all Step 1 commands after the final evidence update**

Expected: all checks pass with no whitespace errors and no unrelated files.

- [x] **Step 4: Stop without Git or publication effects**

Return the exact changed-file set, red/green evidence, review disposition, and final Work State to the developer. Do not commit or push.
