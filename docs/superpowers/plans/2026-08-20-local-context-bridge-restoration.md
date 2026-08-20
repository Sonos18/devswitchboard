# Local Context Bridge Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Implementation remains single-agent; only the separately approved final review uses a fresh subagent.

**Goal:** Restore the canonical `LOCAL_DELTA` and `MICRO_CONSULTATION` bridge semantics, prove them through repository verification, and execute the mandatory real Local Delta checkpoint before completing the wider restoration.

**Architecture:** Extend the existing documentation-first contract system with closed Draft 2020-12 JSON schemas, human contract pages, canonical JSON examples, and dependency-free Node verification. Contract selection remains bound to the canonical schema map. Semantic invariants supplement structural schema validation where relevance or authority claims require cross-field checks.

**Tech Stack:** Markdown, JSON Schema Draft 2020-12, JSON/YAML-compatible records, Node.js standard library, Git worktrees.

**Spec:** `docs/superpowers/specs/2026-08-20-local-context-bridge-restoration.md`

## Global Constraints

- Treat the Dogfood #004 Approved Handoff and restorative spec as intent truth.
- Do not reopen requirement or design brainstorming.
- Work only in `codex/dogfood-004-local-context-bridge`; do not change `main`.
- Use no implementation subagents. Use the approved fresh review subagent only after implementation resumes beyond the mandatory checkpoint.
- Keep Approved Handoff as the implementation-boundary artifact and developer authority unchanged.
- Do not add CLI, Skill, plugin, MCP, automation, runtime tooling, another adapter, learned routing, or publication surfaces.
- The mandatory Local Delta checkpoint is a hard stop. Do not execute tasks after it until Chat returns an approved continuation.
- Do not merge, push, tag, release, publish, or create packages/pages.

---

### Task 1: Lock the Local Delta Integrity Behavior with Failing Regressions

**Status:** Complete

**Files:**
- Modify: `tests/verify-regressions.mjs`

**Interfaces:**
- Produces failing expectations for canonical schema selection, explicit record-level relevance evidence, and per-file evidence for task-relevant changes.
- Consumes the verifier through its existing disposable-copy harness.

- [x] **Step 1: Add a valid Local Delta fixture builder to the regression harness**

Build records in disposable repository copies so focused cases do not depend on mutating the canonical example.

- [x] **Step 2: Add rejection coverage for missing record-level relevance evidence**

Create `examples/local-delta.json` in the copy, omit `relevance.evidence`, and require the verifier to report `missing required property evidence`.

- [x] **Step 3: Add rejection coverage for unsupported per-file relevance claims**

Mark a changed file `relevant_to_task: true` with an empty evidence array and require the verifier to report `expected at least 1 items`.

- [x] **Step 4: Add contract-selection bypass coverage**

Point a Local Delta record at an unapproved permissive schema and require `noncanonical schema selection`.

- [x] **Step 5: Run the focused regressions and confirm RED**

Run: `node tests/verify-regressions.mjs`

Expected: the new Local Delta cases fail because the contract and canonical validation mapping do not exist yet; existing regressions remain meaningful.

### Task 2: Implement the Canonical Local Delta Slice

**Status:** Complete

**Files:**
- Create: `docs/contracts/local-delta.md`
- Create: `schemas/local-delta.schema.json`
- Create: `examples/local-delta.json`
- Modify: `docs/contracts/README.md`
- Modify: `examples/README.md`
- Modify: `scripts/verify.mjs`
- Modify: `tests/verify-regressions.mjs`

**Interfaces:**
- Contract direction: Codex to Chat.
- Schema identifier: `local_delta`, version `0.1`.
- Validation binding: `local_delta` must select only `schemas/local-delta.schema.json`.

- [x] **Step 1: Write the human Local Delta contract**

Document purpose, producer/consumer, minimum-evidence rule, task relevance, prohibited default payloads, baseline meanings, and how Chat uses the facts without receiving implementation ownership.

- [x] **Step 2: Define the closed machine schema**

Require task identity, status, remote/branch/baseline SHA, local HEAD/working-tree/baseline state, record-level relevance evidence, changed-file evidence, summary, implications, and evidence. Enforce non-empty evidence when the record or a file claims task relevance.

- [x] **Step 3: Add a canonical minimal example**

Use a bounded illustrative divergence with task-relevant changed-file evidence and no full diff or source payload.

- [x] **Step 4: Bind the schema and require the canonical artifacts**

Add `local_delta` to `canonicalSchemaFiles`, add the new contract/schema/example to required structure, and add `Local Delta` to canonical terminology checks.

- [x] **Step 5: Add semantic relevance invariants**

Reject a Local Delta that sets record-level relevance true without record evidence, or marks a file relevant without file evidence. Keep the schema as the primary guard and semantic checks as explicit defense in depth.

- [x] **Step 6: Run focused regressions and full verifier until GREEN**

Run: `node tests/verify-regressions.mjs`

Expected: `workflow-integrity regressions: PASS`.

Run: `node scripts/verify.mjs`

Expected: every verification group and `verification: PASS`.

- [x] **Step 7: Self-review the slice**

Inspect the diff for scope, closed-schema consistency, minimal evidence semantics, canonical links, unresolved markers, and whitespace.

### Task 3: Execute the Mandatory Real Local Delta Checkpoint

**Status:** Complete — mandatory checkpoint reached

**Files:**
- Create: `dogfood/devswitchboard-local-context-bridge-004-local-delta.json`

**Interfaces:**
- Consumes the actual diff from baseline `55f7ba2fe6b31499532b82632697d439e95e78ef`.
- Produces a machine-valid `LOCAL_DELTA` for transfer to Chat.

- [x] **Step 1: Inspect the actual local divergence**

Run: `git status --short`, `git diff --name-status 55f7ba2fe6b31499532b82632697d439e95e78ef`, and `git rev-parse HEAD`.

Expected: the isolated workspace is `DIVERGED`, and all listed changes are attributable to Dogfood #004.

- [x] **Step 2: Write the real Local Delta**

Record remote baseline, actual local HEAD and working-tree state, every task-relevant changed file, restored Local Delta semantics, unfinished Micro Consultation and documentation work, validation evidence, and the finding that the approved route remains valid unless the facts show otherwise.

- [x] **Step 3: Validate the artifact and checkpoint slice**

Run: `node tests/verify-regressions.mjs`

Run: `node scripts/verify.mjs`

Run: `git diff --check`

Expected: all pass. This is checkpoint validation, not final completion verification.

- [x] **Step 4: Return the artifact and stop**

Return:

```yaml
phase: implementation
state: READY_FOR_HANDOFF
next_owner: chat
handoff_reason: local_delta_checkpoint
```

Do not execute Tasks 4–7 until Chat returns `CONTINUE_CURRENT_ROUTE` and the developer authorizes resumption.

---

### Task 4: Implement Micro Consultation Contracts After Approved Continuation

**Status:** Complete

**Files:**
- Create: `docs/contracts/micro-consultation.md`
- Create: `schemas/micro-consultation-request.schema.json`
- Create: `schemas/micro-consultation-response.schema.json`
- Create: `examples/micro-consultation-request.json`
- Create: `examples/micro-consultation-response.json`
- Modify: `docs/contracts/README.md`
- Modify: `examples/README.md`
- Modify: `scripts/verify.mjs`
- Modify: `tests/verify-regressions.mjs`

- [x] Add failing regressions for repository-fact requests with `may_change_intent: true` and malformed response linkage.
- [x] Define linked, closed request and response schemas.
- [x] Document `consultation != handoff`, unchanged phase ownership, and fact-only `decision: none`.
- [x] Bind both record kinds to canonical schemas and make regression tests green.

### Task 5: Restore Missing-Context, Source/Depth, and Baseline Semantics

**Status:** Complete

**Files:**
- Modify: `docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md`
- Modify: `docs/workflows/chat.md`
- Modify: `docs/workflows/codex.md`
- Modify: `docs/routing/rules.md`
- Modify: `docs/state-and-recovery.md`
- Modify: `docs/adapters/superpowers.md`

- [x] Classify missing context as `REMOTE`, `LOCAL`, or `INTENT` with the correct owner.
- [x] Distinguish context depth from context source.
- [x] Clarify `UNINITIALIZED`, `SYNCED`, `DIVERGED`, and `UNKNOWN` and require relevance rather than dirtiness.
- [x] Preserve Chat intent ownership, Codex local-fact ownership, and Approved Handoff boundaries.

### Task 6: Complete Canonical Examples, Dogfood Evidence, and Repository Verification

**Status:** Complete

**Files:**
- Modify: `dogfood/README.md`
- Create: `dogfood/devswitchboard-local-context-bridge-004.json`
- Modify: `scripts/verify.mjs`
- Modify: `tests/verify-regressions.mjs`

- [x] Persist Dogfood #004 routing, consultations, checkpoint, interruptions, rework, findings, and resolution evidence without erasing history.
- [x] Run all workflow-integrity regressions, full verifier, schema conformance, semantic invariants, unresolved-marker checks, and staged/unstaged whitespace checks.
- [x] Confirm no v0.1 non-goal or publication surface was introduced.

### Task 7: Fresh Review and Completion Handoff

**Status:** Complete

- [x] Request the developer-approved fresh review subagent after authorship is complete.
- [x] Remediate confirmed findings using regression-first changes where behavior is affected.
- [x] Rerun fresh full verification after the final change.
- [x] Produce completion evidence without merging or pushing.
