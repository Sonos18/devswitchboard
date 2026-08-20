# Codex Workflow

Codex owns repository-facing work while preserving the Approved Handoff as intent truth.

## 1. Preflight

Inspect the actual workspace, repository status, available toolchain, local instructions, and material delta. Compare those facts with the declared baseline and produce one outcome:

- `compatible`: proceed without intent-affecting change;
- `compatible_with_adaptation`: record repository-level adaptations and proceed; or
- `blocked_by_conflict`: stop and emit Conflict Report.

An expected empty repository is compatible. A filename, standard serialization, or text convention is an adaptation; product thesis, scope, control model, phase routing, Task Profile dimensions, routing model, and adapter support are intent.

## 2. Persist and plan

Persist the approved specification before implementation. Create a repository-grounded implementation plan with exact files, interfaces, checks, and scope constraints. Apply Semantic Gate Deduplication: an approved upstream design can satisfy design exploration, but it does not satisfy local preflight or final verification.

## 3. Implement

Follow the developer-approved execution strategy. Before changing strategy, evaluate material events. If independent units emerge after single-agent execution was approved, emit Re-route Required with trigger `PARALLEL_UNITS_DISCOVERED`; do not dispatch implementation subagents until the developer approves.

Keep bridge contract names and field semantics stable. When production executable code exists, use the appropriate correctness cycle; documentation-only work uses structural and semantic checks.

## 4. Review

Review against the approved specification, not only the implementation plan. Use fresh context when the route calls for it. Confirm contract/schema agreement, example conformity, routing order, developer authority, scope exclusions, and acceptance coverage. Triage findings by evidence and remediate confirmed defects.

## 5. Verify and hand off

Run fresh verification after the last change. Final verification is never reused. Emit Verification Report, update Work State to `complete` only when required checks pass, and set the next safe action to developer review. The developer performs final acceptance.

## Recovery paths

- Validation defect: correct it, set `verification_failed` while unresolved, and rerun fresh verification.
- Route invalidated: emit Re-route Required and pause strategy-dependent work.
- Intent-versus-feasibility conflict: emit Conflict Report and pause mutating work.
- Interrupted work with valid route: restore from Work State and continue its recorded next safe action.
