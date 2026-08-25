# Orchestration Value Boundary Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task after Chat returns the resource-route decision.

**Goal:** Clarify that technical eligibility for an orchestration resource is not its selection, make resource choice depend on concrete positive orchestration value, and preserve fresh review and mandatory fresh final verification semantics.

**Architecture:** Keep the ordered routing catalog and Approved Handoff as the authority boundary. Express the eligibility/value distinction in the existing routing rules and Routing Recommendation rationale, then align the Superpowers adapter and Codex workflow as consumers. Record Dogfood #015 through the existing Dogfood schema; add no resource-selection artifact, schema, lifecycle state, bridge, or authority surface.

**Tech Stack:** Markdown contracts and workflows, JSON Dogfood evidence, Node.js repository verification.

**Spec:** Developer-approved DevSwitchboard Dogfood #015 Approved Handoff Revision 1 for task `devswitchboard-orchestration-value-boundary-015`, constrained by the Stage 1 execution directive.

---

## Global Constraints

- Do not begin normative implementation until Chat evaluates the Stage 1 resource evidence and returns the resource route.
- Preserve Approved Handoff Revision 1 as intent and strategy authority unless a later authorized artifact explicitly supersedes it.
- Follow the resource decision Chat returns; technical eligibility recorded below is not authorization to dispatch implementation subagents or parallel agents.
- Keep the current isolated worktree and do not mix unrelated changes.
- Do not create a resource-selection artifact, lifecycle state, bridge contract, schema, or authority surface. Record selection in the existing Routing Recommendation resources and rationale.
- Do not change developer-approval boundaries. A recommendation remains advisory, and changing a strategy that disabled implementation subagents still requires approval through the existing lifecycle.
- Do not make fresh final verification optional or reusable. Cost/value optimization does not override R010.
- The affected boundary is normative documentation. Current verification inspects rule presence and general repository invariants but does not machine-enforce the eligibility/value distinction, so no schema, verifier, or regression change is planned.
- If implementation uncovers a concrete machine-enforced defect or a scope fact that changes this file inventory, pause for route evaluation rather than silently expanding the plan.
- Do not commit, push, open a pull request, merge, tag, release, or publish without separate developer authorization.

## Baseline and Planning Evidence

- The isolated worktree is `D:\me\devswitchboard-worktrees\dogfood-015` on `codex/dogfood-015-orchestration-value-boundary` at exact commit `daaeea49692e256ca90f9105dd53723344e26a97`.
- `HEAD`, `origin/main`, and their merge base are identical; the worktree is clean and has the exact baseline tree.
- `node scripts/verify.mjs` passes all repository checks and `node tests/verify-regressions.mjs` reports `workflow-integrity regressions: PASS` before implementation.
- `docs/routing/rules.md` defines lower-orchestration tie-breaking at line 3, eligibility-shaped match conditions in R007 and R008, value language only in R007's rationale, fresh-context review in R009, and non-deduplicable final verification in R010.
- `docs/adapters/superpowers.md` maps bounded tasks and independent units directly to worker practices, subject to approval and stable interfaces, but does not yet say that a match establishes eligibility rather than selection.
- `docs/workflows/codex.md` requires the approved strategy, forbids unapproved implementation subagents, and requires fresh final verification, but does not yet define a repository-grounded resource-value report for Chat.
- `docs/contracts/routing-recommendation.md` already owns selected `resources` and evidence-based `rationale`; this is the existing place to preserve a resource choice without a new artifact or schema.
- The approved v0.1 design requires efficiency-balanced orchestration, lower orchestration for equal-priority ties, fresh-context review when valuable, and final verification that cannot be deduplicated.
- `scripts/verify.mjs` only checks that R001-R012 remain present and applies generic semantic, link, terminology, and Dogfood invariants. Neither it nor `tests/verify-regressions.mjs` currently machine-enforces the affected normative wording boundary.

## Planned File Structure

| File | Planned responsibility |
| --- | --- |
| `docs/routing/rules.md` | Canonical R007-R010 eligibility, value, approval, and mandatory-verification semantics. |
| `docs/contracts/routing-recommendation.md` | Existing location for selected-resource and value rationale; no new artifact. |
| `docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md` | Align the approved design's efficiency and lower-orchestration principles with the clarified boundary. |
| `docs/adapters/superpowers.md` | Map only selected and authorized resources to Superpowers practices. |
| `docs/workflows/codex.md` | Require repository-grounded eligibility/value evidence and preserve Chat/developer authority over selection. |
| `dogfood/devswitchboard-orchestration-value-boundary-015.json` | Final run evidence after Chat's resource decision, implementation, review, and verification. |
| `dogfood/README.md` | Index Dogfood #015. |
| `docs/superpowers/plans/2026-08-25-orchestration-value-boundary.md` | Preserve this Stage 1 checkpoint and later execution evidence. |

`README.md`, `docs/state-and-recovery.md`, schemas, `scripts/verify.mjs`, and `tests/verify-regressions.mjs` are inspection-only under the repository-grounded plan: their current principles or mechanics already support the clarification, and no concrete defect requires changing them.

### Task 1: Clarify the canonical resource-decision boundary

**Files:**
- Modify: `docs/routing/rules.md`
- Modify: `docs/contracts/routing-recommendation.md`
- Modify: `docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md`

**Interfaces:**
- Consumes: Approved Handoff Revision 1; the existing lower-orchestration tie-break; R007-R010; the advisory Routing Recommendation contract; developer authority.
- Produces: One stable invariant for downstream consumers: technical eligibility permits value evaluation, selection requires concrete positive orchestration value and applicable approval, ties or unsupported benefit use the lower-orchestration route, and R010 remains mandatory.

- [x] **Step 1: Make eligibility distinct from selection in the catalog preamble.**

State that a rule's technical resource conditions identify candidates, not automatic resource use. Require the Routing Recommendation to compare concrete expected benefits with coordination, context-transfer, and integration costs. Do not require invented numeric estimates. When competing choices remain equally supported or no positive value is established, preserve the lower-orchestration tie-break.

- [x] **Step 2: Align R007 and R008 without weakening approval.**

Keep R007's stable-interface, independent-state, and independent-verification match and R008's bounded-unit match as technical eligibility tests. Clarify that neither `parallelizable` nor `bounded` implies agent dispatch. Select parallel resources or a worker only when the evidence supports positive orchestration value and the approved strategy permits it; otherwise retain the lower-orchestration resource choice. Preserve existing developer approval and Re-route Required behavior for strategy changes.

- [x] **Step 3: Preserve the distinct R009 and R010 boundaries.**

Make R009's fresh-context resource depend on material independent contradiction-detection value for the exact review. Keep the current no-additional-approval rule when that review was already approved. State explicitly that R010 is not subject to resource-cost optimization: it always reruns after the last content change and cannot be deduplicated.

- [x] **Step 4: Use the existing Routing Recommendation.**

Clarify that `resources` records the selected resource configuration and `rationale` records eligibility evidence, expected benefit, material costs, and the lower-orchestration decision when applicable. Do not add fields or modify `schemas/routing-recommendation.schema.json`.

- [x] **Step 5: Align the approved v0.1 design.**

Add the same eligibility/value distinction beside the efficiency and routing principles. Preserve manual-first operation, advisory recommendations, deterministic ordering, developer authority, and the existing fresh-verification exception to gate reuse.

- [x] **Step 6: Run focused canonical checks.**

Run:

```powershell
rg -n -i "technical eligibility|resource selection|coordination|context.transfer|integration|lower.orchestration|R007|R008|R009|R010|never deduplicated" docs/routing/rules.md docs/contracts/routing-recommendation.md docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md
git diff --check -- docs/routing/rules.md docs/contracts/routing-recommendation.md docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md
```

Expected: the three documents express one consistent boundary, retain all four rule identifiers, preserve the lower-orchestration tie-break, and have no whitespace errors.

### Task 2: Align the Superpowers adapter and Codex workflow

**Files:**
- Modify: `docs/adapters/superpowers.md`
- Modify: `docs/workflows/codex.md`

**Interfaces:**
- Consumes: The stable Task 1 invariant and the resource route returned by Chat.
- Produces: Tool-neutral planning guidance and adapter mappings that cannot turn eligibility into dispatch or bypass developer authority.

- [x] **Step 1: Put selection before adapter invocation.**

Clarify that `subagent-driven-development` and `dispatching-parallel-agents` map a resource only after the existing route selects it and required approval exists. A bounded unit or independent decomposition alone must not invoke either practice. Keep fresh review mapped to `requesting-code-review` when it has material independent value, and keep `verification-before-completion` mandatory after the last change.

- [x] **Step 2: Add the Codex planning/resource handoff.**

Require Codex planning to decompose repository work, evaluate technical eligibility separately for parallelism, bounded delegation, fresh review, and final verification, and report concrete benefits and costs without making Chat's route/value decision. Preserve the active approved strategy while Chat evaluates the evidence. Do not dispatch unapproved implementation resources or manufacture a Re-route Required solely because a resource is eligible.

- [x] **Step 3: Check each consumer independently and then together.**

Run:

```powershell
rg -n -i "eligib|select|approved|parallel|bounded|fresh|verification|Re-route Required" docs/adapters/superpowers.md
rg -n -i "eligib|select|benefit|coordination|context|integration|Chat|subagent|fresh verification" docs/workflows/codex.md
rg -n -i "technical eligibility|resource selection|lower.orchestration|developer approval|fresh final verification" docs/routing/rules.md docs/contracts/routing-recommendation.md docs/adapters/superpowers.md docs/workflows/codex.md docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md
git diff --check -- docs/adapters/superpowers.md docs/workflows/codex.md
```

Expected: both consumer files independently preserve the canonical invariant, their combined wording does not imply eligibility is selection, and verification remains mandatory.

### Task 3: Record Dogfood #015 after Chat returns the resource route

**Files:**
- Create: `dogfood/devswitchboard-orchestration-value-boundary-015.json`
- Modify: `dogfood/README.md`
- Modify: `docs/superpowers/plans/2026-08-25-orchestration-value-boundary.md`

**Interfaces:**
- Consumes: Chat's Stage 1 resource-route decision, the completed normative diff, review findings and remediations, and fresh verification results.
- Produces: One schema-valid historical record and index entry without a new decision artifact.

- [x] **Step 1: Create the record from observed evidence only.**

Use the existing closed `dogfood-record.schema.json`. Record the exact task revision and Routing Recommendation returned by Chat, all four resource evaluations, the final selected resources, and whether each active approved-strategy assumption remained valid. Do not invent time/token savings or unobserved counts.

- [x] **Step 2: Preserve the authority boundary.**

Record that Stage 1 stopped for Chat, technical eligibility did not authorize resource selection, no implementation subagent was dispatched before a returned route, and any later resource use followed that route. Record actual Re-route Required, Conflict Report, developer reapproval, and external-effect counts rather than assuming them in advance.

- [x] **Step 3: Index and validate the in-progress evidence.**

Add one entry to `dogfood/README.md`. Keep `result`, review, and verification states truthful until the corresponding work completes.

Run:

```powershell
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('dogfood/devswitchboard-orchestration-value-boundary-015.json','utf8')); console.log('Dogfood #015 JSON: PASS')"
node scripts/verify.mjs
git diff --check -- dogfood/devswitchboard-orchestration-value-boundary-015.json dogfood/README.md docs/superpowers/plans/2026-08-25-orchestration-value-boundary.md
```

Expected: JSON parsing and repository verification pass, the index link resolves, and the record does not claim review or completion early.

### Task 4: Obtain fresh independent review and remediate

**Files:**
- Review: the complete in-scope diff and this plan
- Modify if required: only affected planned files

**Interfaces:**
- Consumes: Approved Handoff Revision 1, Chat's returned route, the completed implementation, and the Stage 1 resource evidence.
- Produces: Independent contradiction-detection findings with Critical, Important, and Minor severity and evidence-backed remediation.

- [x] **Step 1: Route review to one non-authoring Codex context when the returned route preserves it.**

Require the reviewer to challenge whether technical eligibility accidentally selects a resource; whether an eligible resource can be selected without positive orchestration value; whether the lower-orchestration tie-break still applies; whether R007-R010 are mutually consistent; whether developer approval and Re-route Required remain intact; whether R010 was accidentally made optional; and whether any new artifact, schema, lifecycle, bridge, or authority concept was introduced.

- [x] **Step 2: Remediate every valid in-scope finding.**

Correct all Critical and Important findings and every valid Minor finding affecting this boundary. If a finding requires unapproved scope or strategy, stop for route evaluation. Re-run focused checks after each content remediation.

- [x] **Step 3: Re-review material remediation.**

Return relevant changes to the same independent context or another non-authoring context as the active route directs. Record the final finding state accurately in Dogfood #015.

### Task 5: Finalize evidence and run fresh verification

**Files:**
- Modify: `dogfood/devswitchboard-orchestration-value-boundary-015.json`
- Modify: `docs/superpowers/plans/2026-08-25-orchestration-value-boundary.md`
- Verify: exact in-scope inventory

**Interfaces:**
- Consumes: Final content, review result, and all acceptance criteria.
- Produces: Fresh completion evidence and a developer handoff; it does not perform developer acceptance or publication.

- [x] **Step 1: Finalize historical evidence before final verification.**

Record review findings/remediations and the exact route/resource outcome, then mark completed plan steps. Ensure the plan and Dogfood record are the last intended content edits before the final verification run.

- [x] **Step 2: Run fresh full checks after the final content change.**

Run:

```powershell
node tests/verify-regressions.mjs
node scripts/verify.mjs
node -e "const fs=require('fs'),path=require('path'); const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]); for(const f of walk('.').filter(f=>f.endsWith('.json'))) JSON.parse(fs.readFileSync(f,'utf8')); console.log('all JSON: PASS')"
rg -n -i "technical eligibility|resource selection|lower.orchestration|coordination|context.transfer|integration|fresh final verification|never deduplicated" README.md docs dogfood/devswitchboard-orchestration-value-boundary-015.json
rg -n "TB[D]|TO[D]O|FIXM[E]|PLACEHOLDE[R]" README.md docs dogfood schemas scripts tests
git status --short
git diff --check
```

Expected: regressions and the complete verifier pass; every JSON file parses; schema, links, terminology, routing semantics, unresolved-marker, and decision-value checks pass through the verifier; the semantic scan shows consistent wording; the inventory is exact; and `git diff --check` is silent.

- [x] **Step 3: Hand off without external effects.**

Report the exact changed-file inventory, resource eligibility and final selection evidence, review results/remediations, fresh verification output, Git state, and any residual decisions. Do not commit or publish.

## Stage 1 Resource-Evaluation Checkpoint

### A. Implementation parallelism

- **Technically eligible:** `true`.
- **Eligibility evidence:** Task 1 must establish one canonical invariant sequentially. After that interface is stable, the Superpowers adapter and Codex-workflow alignments in Task 2 have disjoint files, no shared mutable state, and focused file-specific checks before their combined semantic check. This satisfies R007 for those downstream units; it does not make the whole plan parallel.
- **Expected benefits:** The two consumer projections can be checked independently against the frozen invariant, and separate authorship could expose an omission peculiar to either adapter invocation or Codex phase ownership. Concurrent execution could shorten that downstream portion, but no numeric saving is asserted.
- **Coordination costs:** The canonical wording must be frozen first; ownership and stop conditions must be communicated; both units must use the same definition of positive orchestration value and the same approval boundary.
- **Context-transfer costs:** Each unit needs the Approved Handoff constraints, R007-R010, the Routing Recommendation role, the no-new-artifact exclusion, and the returned Chat resource route. That briefing is material relative to two small documentation edits.
- **Integration costs:** The two edits need terminology reconciliation, a combined cross-document semantic scan, independent review, full repository verification, and consolidated Dogfood evidence.
- **Missing decision-changing repository fact:** None. The relevant files, dependencies, verification commands, and overlap are known; the value/route judgment belongs to Chat rather than to an undiscovered repository fact.

### B. Bounded implementation delegation

- **Technically eligible:** `true`.
- **Eligibility evidence:** After Task 1 stabilizes, the adapter update is a bounded unit in one named file with explicit constraints, acceptance criteria, a canonical input, and focused verification commands. The Codex-workflow alignment is separately bounded on the same basis. Either can satisfy R008; neither is authorized for delegation by eligibility alone.
- **Expected benefits:** A focused worker could concentrate on one consumer mapping with minimal file ownership and produce an independently inspectable patch. A non-authoring implementation perspective could also reveal an assumption the canonical author failed to propagate.
- **Coordination costs:** The primary context must select and define exactly one unit, freeze Task 1, prohibit scope expansion, and review the returned patch before integration.
- **Context-transfer costs:** Even the narrow adapter unit requires the task's eligibility-versus-selection invariant, approval rules, Chat ownership, R009/R010 exceptions, and exclusions. That context is substantial compared with the small edit.
- **Integration costs:** The primary context must reconcile vocabulary with the canonical rules and other consumer, run the same focused and full checks, and incorporate the actual authorship path into Dogfood #015.
- **Missing decision-changing repository fact:** None. The repository supplies a bounded candidate and known checks; whether its benefits justify its costs is the pending Chat value judgment.

### C. Fresh independent review

- **Technically eligible:** `true`.
- **Independent value evidence:** This is an architectural, contract-heavy boundary spanning four ordered rules, a routing contract, an adapter, and phase-owner guidance. A non-authoring context has material contradiction-detection value because it can challenge two opposite failure modes: eligibility accidentally becoming dispatch, and cost optimization accidentally bypassing approved fresh review or mandatory final verification. It can also inspect developer authority and confirm that no lifecycle or artifact was introduced.

### D. Fresh final verification

- **Mandatory under current semantics:** `true`.
- **Evidence:** R010 says completion reruns all acceptance checks and is never deduplicated; the approved design says reuse never applies to fresh final verification; the Superpowers adapter marks completion evidence always fresh; the Codex workflow requires it after the last change; and the Verification Report contract uses `MUST`. Current v0.1 semantics do not permit a cost/value decision to skip it.

## Active Approved-Strategy Evidence

- **`implementation_subagents: false`:** R007-eligible downstream units and R008-bounded consumer edits are new repository evidence that touches this assumption, but eligibility alone neither selects a resource nor determines invalidation. Chat must compare the concrete benefits and costs above.
- **`workspace_isolation: true`:** The assumption is already realized by the clean dedicated worktree at the exact baseline. The planned multi-document changes and later review/verification benefit from a stable isolated inventory; no planning evidence argues against it.
- **`fresh_independent_review: true`:** The multi-rule authority boundary presents material contradiction-detection value, so repository evidence supports this assumption.
- **`fresh_final_verification: true`:** R010 and four aligned normative surfaces make this mandatory; optimization cannot remove it.
- **Route effect:** Not decided by Codex. Stop at this checkpoint for Chat resource-route evaluation.

No Re-route Required, Conflict Report, new resource-decision artifact, implementation dispatch, commit, push, or publication is produced by Stage 1.

## Chat Resource-Route Evaluation at Task Revision 2

- Chat found no missing decision-changing fact and returned `NO_MORE_CONTEXT_NEEDED` and `CONTINUE_CURRENT_ROUTE`.
- Implementation parallelism remained technically eligible but was not selected because its plausible benefits did not materially exceed coordination, context-transfer, reconciliation, and integration costs.
- Bounded implementation delegation remained technically eligible but was not selected because its incremental execution and confidence value did not materially exceed context-transfer, review, reconciliation, and integration costs.
- Fresh independent review was selected because a non-authoring context has material contradiction-detection value for the ordered-rule, adapter, phase-ownership, and developer-authority boundary.
- Fresh final verification was selected and remains mandatory under R010; cost reasoning cannot optimize it away.
- The approved strategy remains `implementation_subagents: false`, `workspace_isolation: true`, `fresh_independent_review: true`, and `fresh_final_verification: true`.
- No Re-route Required, Conflict Report, developer reapproval, or new resource-selection artifact was created.
- Implementation resumed sequentially from this checkpoint without repeating requirement discovery, design, Codex Preflight, implementation planning, or resource-value context acquisition.
- The local fresh independent non-authoring reviewer originally found no Critical, Important, or boundary-relevant Minor findings.
- A later GitHub-side developer merge-gate audit found one boundary-relevant Minor: Dogfood #015 preserved the actual `NO_MORE_CONTEXT_NEEDED` checkpoint only in prose. The finding was remediated by adding canonical measurement `DV-015-001` with `context_source: NONE`, `missing_fact: null`, and `material_to: []`; no schema, artifact, or normative implementation change was required.
- The final changed-file inventory contains exactly the five planned normative documents, this plan, the Dogfood index, and Dogfood #015. Schemas, `scripts/verify.mjs`, and `tests/verify-regressions.mjs` remain unchanged.
- Fresh final verification is rerun only after this remediation evidence and review history are finalized, so its results are current for the developer handoff.
