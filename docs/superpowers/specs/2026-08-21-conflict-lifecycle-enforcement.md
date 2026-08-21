# Conflict Report Lifecycle Enforcement Specification

## Authority

This specification persists DevSwitchboard Dogfood #008 Approved Handoff Revision 2. The developer selected Conflict Report option A: preserve the machine-enforcement goal and supersede Revision 1's documentation-only restriction. Revision 1 requirement context, explanatory guidance, feasibility evidence, Conflict Report, blocked Work State, baseline evidence, and satisfied semantic gates remain valid.

## Goal

Make the Conflict Report pause-and-resume lifecycle semantically enforceable across canonical records without changing schema version `0.1`.

When live repository evidence shows approved intent cannot be preserved safely, a Conflict Report pauses strategy-dependent work in `blocked_by_conflict`. Work resumes only after a developer-approved intent revision names and approves that exact Conflict Report. Historical Conflict Report and blocked Work State records remain canonical evidence and do not permanently block later authorized work.

## Record identity and provenance

A Conflict Report checkpoint is identified by its canonical repository-relative path, `task_id`, and `revision`.

A Work State is subject to a Conflict Report lifecycle when both of these conditions hold:

- its `task_id` matches;
- its `active_route.revision` is equal to or greater than the Conflict Report revision.

Every subject Work State MUST contain the canonical Conflict Report path in `authoritative_artifacts`. The checkpoint Work State additionally uses `active_route.revision` equal to the Conflict Report revision and remains `blocked_by_conflict` as historical evidence. Pre-conflict snapshots are exempt. A later state cannot evade pending or approved-resumption enforcement by omitting the report path or changing route revision.

An Approved Handoff resolves a Conflict Report when all of these conditions hold:

- its `task_id` matches;
- its revision is equal to or greater than the Conflict Report revision;
- canonical approval and readiness fields are affirmative;
- its `completed_gates` contains `conflict_report` with status `approved`;
- that gate's `evidence_source` is the exact canonical Conflict Report path.

If more than one qualifying Approved Handoff claims the same highest revision, authority is ambiguous and verification fails. An unrelated task, unapproved handoff, lower revision, or handoff without exact report provenance cannot clear the conflict.

## Pending conflict invariants

While no qualifying approved intent revision exists:

- at least one exact-revision checkpoint Work State must exist;
- every associated Work State must use `lifecycle_state: blocked_by_conflict`;
- `next_safe_action` must consist only of whole clauses that match a canonical developer-decision request, canonical report return, or an anchored prohibition made only of coordinated recognized work predicates; safe prefixes and punctuation pivots cannot authorize trailing text;
- `next_safe_action` must not direct implementation, execution, modification, continuation, resumption, planning, verification, completion, building, shipping, editing, writing, applying, patching, testing, validation, deployment, publication, Git mutation, creation, deletion, or execution of commands;
- strategy-dependent `active` work and premature `complete` state fail verification.

## Approved resumption invariants

After a qualifying approved intent revision exists, the historical checkpoint is no longer a blocker. Each associated Work State that becomes `active` or `complete` must name the unique highest qualifying Approved Handoff whose revision is not greater than that state's route revision.

The globally highest qualifying handoff revision must also be unique as current authority. Older approved revisions remain valid historical authority for their corresponding snapshots; a newer approval does not retroactively invalidate them.

## Conflict classification integrity

Conflict Report remains reserved for intent-versus-feasibility incompatibility. A Dogfood record with an `INTENT_CONFLICT` finding requires a same-task Conflict Report. Documentation and regressions preserve the distinction from:

- route or resource changes while intent remains feasible, which use Re-route Required;
- environment or authentication failures;
- recoverable verification failures;
- missing preferences, stale context, or harmless implementation adaptations.

The verifier enforces record linkage and authority. It does not attempt to replace the developer's feasibility judgment with broad natural-language classification.

## Canonical lifecycle

```text
Revision 1 bounded approval
  -> controlled intent conflict
  -> Conflict Report + blocked_by_conflict Work State
  -> developer selects option A
  -> Approved Handoff Revision 2 approves the exact report
  -> active Work State references Revision 2
  -> architectural implementation, dedicated review, fresh verification
  -> complete Work State
```

## Scope

Included:

- relational Conflict Report semantic verifier enforcement;
- regression-first pending, invalid-continuation, approved-resume, provenance, authority-ambiguity, and history coverage;
- canonical pending lifecycle records;
- normative routing, contract, recovery, and Dogfood documentation;
- dedicated fresh-context review and fresh final verification.

Excluded:

- schema-version changes;
- CLI, plugin, Skill, MCP, or runtime automation;
- new bridge artifacts or methodology adapters;
- probabilistic routing;
- implementation subagents;
- Git integration or publication.

## Completion gate

Completion requires focused RED/GREEN lifecycle regressions, the complete workflow-integrity suite, the full repository verifier, JSON and schema conformance, semantic invariants, Markdown links, terminology, routing rules, unresolved-marker and decision-value checks, Git whitespace checks, exact task inventory, a dedicated fresh review with all Critical and Important findings remediated, and a final complete Work State.
