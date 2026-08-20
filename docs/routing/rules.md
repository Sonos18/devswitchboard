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

## R003 — Missing or stale repository context

- **Match:** Repository context is absent, stale, or expected to differ from the handoff.
- **Recommend:** Route `codex_preflight` to Codex before implementation planning.
- **Rationale:** Local compatibility needs live evidence.
- **Approval:** No approval for read-only inspection; adaptations remain bounded by intent.
- **Invalidated by:** A fresh Codex Preflight for the current revision and workspace.

## R004 — Intent-versus-feasibility conflict

- **Match:** Live evidence shows approved intent cannot be implemented safely without a material intent change.
- **Recommend:** Emit Conflict Report and route the decision to the developer.
- **Rationale:** Adaptation cannot silently redesign intent.
- **Approval:** Developer decision required.
- **Invalidated by:** An approved intent revision or new feasibility evidence.

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
- **Recommend:** Emit Re-route Required, re-profile affected dimensions, and pause strategy-dependent work.
- **Rationale:** Routes are evidence-bound decisions.
- **Approval:** Developer approval required for the replacement strategy.
- **Invalidated by:** Approved re-route or evidence showing the event was non-material.

## R012 — Low-risk direct execution

- **Match:** Intent is clear; scope is small; repository dependency, regression risk, security sensitivity, and context uncertainty are low; no higher rule matches.
- **Recommend:** Route implementation directly to Codex with minimal orchestration, proportionate review, and fresh verification.
- **Rationale:** Efficiency-balanced routing avoids ceremony unsupported by risk.
- **Approval:** Normal developer authority remains; no separate strategy gate is needed.
- **Invalidated by:** Scope growth, failed checks, new uncertainty, or elevated risk.
