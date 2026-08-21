# v0.1 Routing Rule Catalog

Rules are deterministic and evaluated in ascending identifier order. The first matching rule recommends the next incomplete phase unless an explicit developer decision already fixes it. When multiple recommendations remain equally valid, choose the lower-orchestration route and record the evidence. Every route is advisory.

## R001 — Developer-owned intent and decisions

- **Match:** A decision changes licensing, legal terms, publication policy, ownership, or material distribution rights; or the developer explicitly approved a route or execution constraint and no material event invalidates it.
- **Recommend:** Classify legal and distribution decisions as intent and route them to the developer for approval. Preserve an approved developer decision for affected phases.
- **Rationale:** Legal and distribution rights are developer-owned intent, and developer authority outranks defaults.
- **Approval:** Developer approval is required before applying a pending legal or distribution decision. Existing explicit approval remains authoritative.
- **Invalidated by:** Material new evidence, a feasibility conflict, or an explicit replacement decision from the developer.

## R002 — Unresolved intent

- **Match:** Requirement ambiguity is high, material acceptance criteria are missing, or consequential preferences remain unresolved.
- **Recommend:** Route requirement discovery, design, or specification to Chat.
- **Rationale:** Repository execution cannot safely invent intent.
- **Approval:** Developer approval required before intent is final.
- **Invalidated by:** A fresh, approved specification resolving the evidence.

## R003 — Missing, stale, or divergent context

- **Match:** Required context is absent or stale, the source is unresolved, or local truth may differ materially from the shared baseline.
- **Recommend:** Classify the missing source before routing. `REMOTE` facts stay with Chat for GitHub/shared-baseline acquisition. `LOCAL` facts route to focused Codex evidence through Micro Consultation and, when divergence is task-relevant, Local Delta. `INTENT` routes to the developer. Before implementation planning, route `codex_preflight` to Codex for the current local workspace.
- **Rationale:** Context source determines the authority and acquisition surface. Context depth alone does not justify Codex consultation, and local dirtiness alone does not justify Local Delta.
- **Approval:** Read-only fact acquisition requires no new approval. Intent decisions and material route changes require developer approval; consultation never transfers phase ownership.
- **Invalidated by:** Fresh evidence from the authoritative source, a validated relevant Local Delta accepted by Chat, or a fresh Codex Preflight for the current revision and workspace.

## R004 — Intent-versus-feasibility conflict

- **Match:** Live evidence shows approved intent cannot be implemented safely without a material intent change.
- **Recommend:** Emit Conflict Report, preserve a matching `blocked_by_conflict` Work State, pause strategy-dependent work, and route the intent decision to the developer. Every same-task Work State at or after the conflict revision names the report; omission cannot bypass the gate.
- **Rationale:** Adaptation cannot silently redesign intent.
- **Approval:** Developer decision required. A later Approved Handoff resolves the pending gate only when it belongs to the same task, is not older than the report, retains affirmative approval/readiness, and records an approved `conflict_report` gate whose evidence source is that exact report artifact. Resumed active or complete Work State names the applicable approved handoff.
- **Invalidated by:** A unique provenance-linked approved intent revision or new feasibility evidence. Historical Conflict Report and blocked Work State evidence remain canonical but no longer block the approved route. Duplicate highest authority or missing provenance remains invalid.

## R005 — Security or regression sensitivity

- **Match:** Security sensitivity or regression risk is high.
- **Recommend:** Use Codex with explicit threat/regression checks, independent review, and fresh verification; use Chat first if risk acceptance is unresolved.
- **Rationale:** Consequence justifies increased confidence work.
- **Approval:** Developer approves material risk acceptance and external effects.
- **Invalidated by:** Evidence-backed re-profiling that reduces the risk.

## R006 — Architecture or high complexity

- **Match:** Scope complexity is high or the task is architectural.
- **Recommend:** Route implementation planning to Codex after an approved design; keep authorship sequential until interfaces stabilize.
- **Rationale:** Repository-grounded sequencing reduces semantic drift.
- **Approval:** Developer approves the execution strategy.
- **Invalidated by:** A revised profile or material event changing decomposition.

## R007 — Independent parallel units

- **Match:** Two or more units have stable interfaces, independent state, and independent verification.
- **Recommend:** Consider parallel implementation resources and emit Re-route Required if this changes approved strategy.
- **Rationale:** Parallelism creates value only when coordination cost is lower than saved time.
- **Approval:** Required before changing approved subagent strategy.
- **Invalidated by:** Shared semantics, ordering dependencies, overlapping files, or developer rejection.

## R008 — Bounded implementation delegation

- **Match:** A bounded implementation unit has clear constraints, acceptance criteria, relevant files, and verification commands.
- **Recommend:** A Codex implementation worker MAY receive minimal context when delegation was approved.
- **Rationale:** A focused worker can reduce cost without transferring authority.
- **Approval:** Required when the approved strategy disabled implementation subagents.
- **Invalidated by:** Ambiguous interfaces, shared mutable state, or cross-subsystem reasoning needs.

## R009 — Fresh-context review

- **Match:** The change is architectural, contract-heavy, high-risk, or likely to benefit from contradiction detection.
- **Recommend:** Route review to a fresh Codex context that does not author changes.
- **Rationale:** Context separation improves defect discovery.
- **Approval:** No additional approval when review was already approved; review actions that change external state still require authority.
- **Invalidated by:** A developer-approved lower review level after re-profiling.

## R010 — Fresh final verification

- **Match:** Work is about to be declared complete.
- **Recommend:** Route verification to Codex and rerun all acceptance checks after the last change.
- **Rationale:** Completion claims require current evidence.
- **Approval:** Developer acceptance follows verification.
- **Invalidated by:** Never deduplicated; any later content change makes evidence stale.

## R011 — Material event

- **Match:** New evidence invalidates the active route, profile, or approved execution strategy.
- **Recommend:** Emit Re-route Required, re-profile affected dimensions, and pause strategy-dependent work in a corresponding `waiting_for_developer` Work State. That state names the Re-route Required artifact and permits only an approval-oriented next safe action.
- **Rationale:** Routes are evidence-bound decisions.
- **Approval:** Developer approval is required for a replacement strategy. A later Approved Handoff supersedes the pending gate only when it belongs to the same task, is at least the checkpoint revision, and records an approved `re_route_required` gate whose evidence source is that exact checkpoint artifact. Resumed active or complete Work State names that Approved Handoff and uses its revision or later.
- **Invalidated by:** A provenance-linked approved replacement route or evidence showing the event was non-material. Historical Re-route Required evidence remains canonical but is no longer pending after valid supersession. Evidence that intent cannot be preserved safely matches R004 instead.

## R012 — Low-risk direct execution

- **Match:** Intent is clear; scope is small; repository dependency, regression risk, security sensitivity, and context uncertainty are low; no higher rule matches.
- **Recommend:** Route implementation directly to Codex with minimal orchestration, proportionate review, and fresh verification.
- **Rationale:** Efficiency-balanced routing avoids ceremony unsupported by risk.
- **Approval:** Normal developer authority remains; no separate strategy gate is needed.
- **Invalidated by:** Scope growth, failed checks, new uncertainty, or elevated risk.
