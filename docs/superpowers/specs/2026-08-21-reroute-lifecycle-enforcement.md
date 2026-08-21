# Re-route Lifecycle Enforcement Specification

## Authority

This specification persists DevSwitchboard Dogfood #007 Approved Handoff Revision 2. It supersedes the Revision 1 docs-only execution strategy while preserving the Revision 1 requirement context, explanatory recovery aid, validated Re-route Required checkpoint, paused Work State, baseline evidence, and developer authority decisions that remain valid.

## Goal

Make the Re-route Required lifecycle semantically enforceable across canonical records without changing schema version `0.1`.

When a material event invalidates an approved route while intent remains feasible, strategy-dependent work pauses in `waiting_for_developer`. Work resumes only after a matching higher-authority Approved Handoff explicitly approves the checkpoint and replacement strategy. The historical Re-route Required artifact remains evidence and does not permanently block later approved work.

## Record identity and provenance

A Re-route Required checkpoint is identified by its canonical record path, `task_id`, and `revision`.

A Work State is associated with that checkpoint when both of the following hold:

- its `task_id` matches;
- its `authoritative_artifacts` names the canonical Re-route Required record path.

The checkpoint's paused Work State additionally uses `active_route.revision` equal to the checkpoint revision. Later-revision Work States remain associated lifecycle snapshots and cannot evade pending or approved-resumption enforcement by changing their route revision.

An Approved Handoff supersedes the pending checkpoint when all of the following hold:

- its `task_id` matches;
- its revision is equal to or greater than the checkpoint revision;
- its approval and readiness fields remain affirmative under the canonical Approved Handoff contract;
- its `completed_gates` contains an approved `re_route_required` gate whose `evidence_source` names the canonical checkpoint path.

If more than one qualifying Approved Handoff claims the same highest replacement revision, provenance is ambiguous and verification fails. A lower revision or unrelated task cannot clear the pending gate.

## Pending checkpoint invariants

While no qualifying replacement handoff exists:

- at least one exact-revision checkpoint Work State must exist;
- every associated Work State must use `lifecycle_state: waiting_for_developer`;
- its `next_safe_action` must direct route evaluation or developer approval;
- its next action must not direct implementation, execution, modification, continuation, resumption, or planning;
- strategy-dependent `active` work and premature `complete` state fail verification.

## Approved resumption invariants

After a qualifying replacement handoff exists, the historical checkpoint is no longer a blocker. Each associated Work State that becomes `active` or `complete` must name the unique highest qualifying Approved Handoff whose revision is not greater than that state's route revision.

The verifier also requires the globally highest qualifying handoff revision to be unique as current authority. Older approved revisions remain valid historical authority for their corresponding snapshots; a newer approval does not retroactively invalidate them.

## Material-event and conflict integrity

A Dogfood record that contains a `ROUTE_INVALIDATION` finding must have a same-task Re-route Required artifact. This prevents a recorded material route event from being represented as a silent implementation adaptation.

Re-route Required applies only while approved intent remains feasible. An artifact whose trigger or updated profile evidence explicitly states `intent_feasibility: infeasible`, or affirmatively says approved intent cannot be preserved safely (including the equivalent subject ordering), fails semantic verification and must use Conflict Report semantics instead. Explicitly negated or hypothetical conflict wording does not assert infeasibility.

Planning, sequencing, task class, review level, or resource changes alone are not conflicts.

## Canonical lifecycle

```text
Revision 1 bounded approval
  -> bounded work begins
  -> material route-invalidating event
  -> Re-route Required + waiting_for_developer
  -> Approved Handoff Revision 2 approves the checkpoint
  -> active Work State references Revision 2
  -> architectural implementation, dedicated review, fresh verification
  -> complete Work State
```

## Scope

Included:

- relational semantic verifier enforcement;
- regression-first coverage for pending, invalid continuation, valid resumption, silent adaptation, provenance ambiguity, and conflict distinction;
- canonical pending and resumed records;
- routing, contract, recovery, and Dogfood documentation;
- dedicated fresh review and final verification.

Excluded:

- schema-version changes;
- new bridge artifacts;
- CLI, plugin, Skill, MCP, or runtime automation;
- probabilistic routing;
- implementation subagents;
- publication or Git integration.

## Completion gate

Completion requires targeted regressions, the full workflow-integrity suite, the full repository verifier, schema and JSON checks, semantic invariants, Markdown links, terminology, unresolved-marker checks, Git whitespace checks, a dedicated fresh review with all Critical and Important findings remediated, and a final complete Work State.
