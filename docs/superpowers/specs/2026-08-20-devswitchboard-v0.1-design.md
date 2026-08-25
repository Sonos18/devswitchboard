# DevSwitchboard v0.1 Design Specification

**Revision:** 2
**Status:** Approved
**Authority:** Intent truth for bootstrap task `devswitchboard-bootstrap-001`
**Positioning:** Developer-centric orchestration for AI coding workflows.
**Tagline:** Route the work. Keep the developer in control.

## 1. Thesis

DevSwitchboard is a developer-centric orchestration layer that routes AI development work to the appropriate surface, workflow, and resources while keeping the developer as final authority.

The v0.1 release is a public, documentation-first methodology. It is not a product runtime. It makes routing decisions visible, reviewable, and recoverable before automation is introduced.

## 2. Approved v0.1 Boundaries

### In scope

- A manual-first delivery model.
- Advisory-first control: DevSwitchboard recommends; the developer approves material decisions.
- Efficiency-balanced optimization: minimize unnecessary ceremony and orchestration without sacrificing confidence appropriate to risk.
- Phase-level routing rather than whole-task routing.
- A seven-dimension Task Profile.
- Deterministic, rule-based routing with evidence.
- Explicit bridge contracts between Chat and Codex.
- A Superpowers-only methodology adapter.
- Canonical examples, recovery state, dogfood measurement, and a self-hosting record.

### Out of scope

- A CLI or other product executable.
- An editor or platform plugin.
- A web application.
- Multi-provider integration.
- Autonomous enforcement or removal of developer approval gates.
- Learned, probabilistic, or opaque routing.

## 3. Operating Principles

1. **Developer authority:** Recommendations never become authorization. The developer approves scope, material strategy changes, external effects, completion, and decisions that change licensing, legal terms, publication policy, ownership, or material distribution rights.
2. **Manual first:** Every v0.1 workflow must be executable by a person using the documented artifacts.
3. **Advisory first:** The system explains a recommendation and its evidence. It does not conceal consequential choices behind defaults.
4. **Route by phase:** Discovery, design, planning, implementation, review, and verification can require different surfaces and resources.
5. **Balance efficiency and confidence:** Add process when uncertainty, risk, complexity, or concrete resource value warrants it; remove duplicate gates when evidence remains valid. Technical eligibility for an optional resource is not selection: use it only when expected execution, decision, or confidence value materially exceeds coordination, context-transfer, and integration costs. This optimization never removes mandatory confidence work.
6. **Rules before automation:** Routing rules are ordered, inspectable, and deterministic.
7. **Recovery is normal:** State needed to resume or re-route is a first-class contract, not conversational memory.

## 4. Canonical Terminology

- **Developer:** The final decision-maker and authority.
- **Surface:** The environment where a phase is best performed. v0.1 surfaces are `chat`, `codex`, and `developer`.
- **Phase:** A bounded stage of work: `requirement_discovery`, `design`, `specification`, `codex_preflight`, `implementation_planning`, `implementation`, `review`, `verification`, or `handoff`.
- **Task Profile:** Evidence-backed assessment across the seven canonical dimensions.
- **Route:** A recommendation assigning a phase to a surface and workflow resources.
- **Semantic gate:** A decision or validation checkpoint defined by meaning, not by a tool-specific label.
- **Bridge contract:** A structured artifact that carries intent or results across surfaces.
- **Local Delta:** Minimum task-relevant Codex-to-Chat evidence about local truth that differs from the shared baseline.
- **Micro Consultation:** One focused Chat/Codex fact exchange that does not transfer phase ownership.
- **Context Depth:** How much information is required for sound reasoning.
- **Context Source:** The authority or surface from which missing information must be acquired: `REMOTE`, `LOCAL`, or `INTENT`.
- **Material event:** New evidence that can change intent, scope, risk, route, or execution strategy.
- **Re-route:** A new routing decision prompted by a material event; it requires developer approval when it changes approved strategy.
- **Adapter:** A mapping from DevSwitchboard phases and gates to a methodology's practices. v0.1 supports only Superpowers.

Normative documents use **MUST**, **SHOULD**, and **MAY** in their ordinary requirements sense.

## 5. Task Profile Contract

A final Task Profile has `profile_status: final` and exactly these seven dimensions:

| Dimension | Question answered |
| --- | --- |
| `requirement_ambiguity` | How much material intent remains unresolved? |
| `scope_complexity` | How many interacting concerns and artifacts must change? |
| `repository_dependency` | How strongly must work conform to existing repository behavior or architecture? |
| `regression_risk` | How likely is the work to break existing behavior? |
| `parallelizability` | How safely can work be split into independent units? |
| `security_sensitivity` | How consequential are security, privacy, trust-boundary, or privilege mistakes? |
| `context_uncertainty` | How incomplete, stale, or contradictory is the available context? |

Each dimension MUST contain a `level` of `low`, `medium`, or `high` and one or more concrete `evidence` entries. A profile describes the current phase and may be revised only when new evidence appears.

## 6. Phase Routing Model

Routing is evaluated for the next incomplete phase, not once for the entire task.

| Phase | Default surface | Purpose |
| --- | --- | --- |
| `requirement_discovery` | `chat` | Resolve material intent with the developer. |
| `design` | `chat` | Compare approaches and obtain approval. |
| `specification` | `chat` | Freeze testable intent and boundaries. |
| `codex_preflight` | `codex` | Compare approved intent with the live local environment. |
| `implementation_planning` | `codex` | Produce the repository-grounded execution plan. |
| `implementation` | `codex` | Change repository artifacts under the approved plan. |
| `review` | `codex` | Inspect for defects and contradictions with fresh context when valuable. |
| `verification` | `codex` | Run fresh evidence-producing checks. |
| `handoff` | `developer` | Review results and exercise final authority. |

The rule catalog may override a default using profile evidence. Every recommendation records the selected phase, surface, workflow, resources, rationale, approval requirement, and conditions that would invalidate the route. Optional-resource match conditions establish eligibility, not invocation. The rationale compares concrete expected value with material orchestration costs without inventing numeric estimates; when optional routes are effectively tied, no decision-changing fact remains, and confidence and risk requirements are satisfied, select the lower-orchestration route. Mandatory confidence work remains required.

### Context depth and source

Context Depth and Context Source are independent. High depth does not imply Codex consultation; low depth may still require Codex when the only material fact is local-only.

Missing context is classified before it is routed:

| Source | Acquisition owner | Rule |
| --- | --- | --- |
| `REMOTE` | Chat through GitHub/shared baseline | Acquire additional shared context without using Codex as a general fallback. |
| `LOCAL` | Codex | Use focused Micro Consultation and, when task-relevant divergence exists, Local Delta. |
| `INTENT` | Developer | Obtain an explicit developer decision; repository inference cannot decide intent. |

## 7. Semantic Gate Deduplication

Before invoking a gate, the active surface MUST ask whether an equivalent semantic gate was already satisfied upstream.

An upstream gate is reusable only when all are true:

- the bridge artifact identifies the gate and records a pass or explicit approval;
- the evidence is adequate for the current phase;
- the evidence is fresh enough for the current environment;
- no material local delta invalidates it; and
- the current methodology does not require a distinct implementation-specific check.

When reusable, the downstream workflow records `reused` and the evidence source instead of repeating the gate. Reuse never applies to fresh final verification, and it never converts advice into authorization.

## 8. Bridge Contracts

The canonical contracts are:

- `APPROVED_HANDOFF`: Chat-to-Codex transfer of approved intent, profile, strategy, and readiness evidence.
- `LOCAL_DELTA`: Codex-to-Chat transfer of minimum task-relevant local divergence from the shared baseline. It carries facts and implications, not authority, and dirty state alone does not require it.
- `MICRO_CONSULTATION`: Linked Chat/Codex request and response for one focused fact. Consultation is not a handoff, phase ownership remains unchanged, and fact-only responses record `decision: none`.
- `CODEX_PREFLIGHT`: Codex comparison of that intent with the live workspace. Its only outcomes are `compatible`, `compatible_with_adaptation`, and `blocked_by_conflict`.
- `CONFLICT_REPORT`: A stop artifact for a real intent-versus-feasibility conflict. It states evidence, impact, attempted safe adaptations, and decisions required from the developer.
- `RE_ROUTE_REQUIRED`: A pause artifact emitted after a material event invalidates the approved route. It includes the trigger, affected assumptions, updated profile evidence, recommendation, and required approval.
- `WORK_STATE`: A resumable snapshot of phase, completed gates, active route, artifacts, verification state, and next safe action.
- `VERIFICATION_REPORT`: Fresh completion evidence mapped to acceptance criteria.

Unknown required fields, contradictory authority, stale critical evidence, or failed readiness gates make a bridge not ready. Downstream work MUST stop only when safe adaptation within approved intent is unavailable.

## 9. Chat Workflow

Chat owns intent-facing phases:

1. Discover requirements until material ambiguity is resolved.
2. Classify missing context as `REMOTE`, `LOCAL`, or `INTENT` and acquire it from the correct authority; Codex consultation is last-mile acquisition for local-only facts.
3. Create the seven-dimension Task Profile with evidence.
4. Design within explicit scope and compare meaningful alternatives.
5. Obtain developer approval for intent and execution strategy.
6. Apply semantic gate deduplication.
7. Evaluate a returned Local Delta for freshness and material events without treating it as a handoff or authorization.
8. Emit `APPROVED_HANDOFF` only when intent is clear, scope is bounded, acceptance is testable, context is fresh enough, and unresolved conflicts are absent.

Chat does not claim repository compatibility without Codex preflight.

## 10. Codex Workflow

Codex owns repository-facing phases:

1. Treat the approved handoff as intent truth.
2. Inspect the local baseline and run `CODEX_PREFLIGHT`.
3. Answer focused `LOCAL` Micro Consultations with repository facts, evidence, implications, and no intent decision.
4. Emit Local Delta when task-relevant local truth differs from the shared baseline; do not emit it for dirtiness alone.
5. Persist the approved specification before implementation.
6. Create a repository-grounded implementation plan.
7. Execute the approved strategy without reopening satisfied semantic gates.
8. Pause at an approved Local Delta checkpoint until Chat evaluates freshness and material events through the developer.
9. Emit `CONFLICT_REPORT` for an actual intent-versus-feasibility conflict.
10. Emit `RE_ROUTE_REQUIRED` and wait for developer approval before a material strategy change.
11. Review implemented artifacts against intent and contracts.
12. Run fresh verification; final verification cannot be deduplicated.
13. Update `WORK_STATE` and hand control back to the developer.

## 11. Rule-Based Routing

Rules are evaluated in catalog order. The first matching rule supplies the recommendation unless a higher-authority developer decision already fixes the route. Technical eligibility for an optional resource does not select or authorize it. Ties at the same priority choose the lower-orchestration route when no decision-changing fact remains and required confidence and risk controls are satisfied, and explain why. No rule may override explicit developer authority, and optional-resource optimization cannot suppress mandatory final verification.

Required rule families cover:

- developer-owned licensing, legal terms, publication policy, ownership, and material distribution rights;
- unresolved intent and high requirement ambiguity;
- absent or stale local repository context;
- security-sensitive or high-regression work;
- architectural or high-complexity planning;
- safe bounded implementation delegation;
- parallel execution only for independent units;
- fresh-context review;
- fresh final verification;
- re-routing after material events; and
- direct execution for small, low-risk, well-understood changes.

## 12. Superpowers Adapter

Superpowers is the only v0.1 methodology adapter. It maps semantic needs to practices without redefining DevSwitchboard authority:

| DevSwitchboard need | Superpowers practice |
| --- | --- |
| Requirement and design exploration | `brainstorming` |
| Repository-grounded implementation plan | `writing-plans` |
| Inline plan execution | `executing-plans` |
| Delegated plan execution | `subagent-driven-development` |
| Independent parallel units | `dispatching-parallel-agents` |
| Defect investigation | `systematic-debugging` |
| Implementation correctness cycle | `test-driven-development` when production executable code exists |
| Fresh review | `requesting-code-review` |
| Completion evidence | `verification-before-completion` |

An upstream approved design satisfies brainstorming when the handoff records adequate evidence, freshness, and no invalidating delta. Documentation-only bootstrap work does not fabricate production-code TDD; it uses structural and semantic verification instead.

## 13. State and Recovery

At every handoff or pause, `WORK_STATE` records enough information for a fresh operator to continue safely without reconstructing hidden chat history. Recovery uses this order:

1. Identify authoritative specification and approved handoff.
2. Confirm current phase and last completed semantic gate.
3. Classify the repository baseline as `UNINITIALIZED`, `SYNCED`, `DIVERGED`, or `UNKNOWN` and evaluate task relevance separately from dirty state.
4. Classify missing context by source and acquire focused evidence from its authority.
5. Check workspace delta and evidence freshness.
6. Resume the recorded next safe action if the route remains valid.
7. Otherwise emit `RE_ROUTE_REQUIRED` or `CONFLICT_REPORT` as appropriate.

## 14. Measurement

Dogfood measurement evaluates the methodology, not token counts alone. Each run records:

- task and revision identifiers;
- profile and approved route;
- elapsed phase timing when observable;
- semantic gates reused and repeated;
- handoff defects or clarification loops;
- re-routes and their triggers;
- verification failures and recovery work;
- developer overrides;
- outcome and qualitative observations.

The primary v0.1 questions are whether routing was understandable, whether duplicate ceremony was avoided, whether the handoff preserved intent, and whether the developer retained effective control.

## 15. Bootstrap Acceptance Criteria

The initial repository is complete when it contains:

- an OSS README and contribution foundation;
- this approved design specification;
- canonical bridge and profile contracts;
- Chat and Codex workflows;
- an ordered rule catalog;
- the Superpowers adapter;
- canonical examples that conform to the contracts;
- state and recovery guidance;
- a reusable dogfood measurement kit;
- a self-hosting Dogfood #001 record;
- no CLI, plugin, web application, or multi-provider integration; and
- fresh verification evidence for structure, syntax, terminology, contract coverage, example consistency, placeholder absence, and clean Git formatting.

## 16. Approved Intent Updates

`DEC-LICENSE-001` selects the Apache License 2.0 for DevSwitchboard. Licensing is developer-owned legal and distribution intent, not an implementation adaptation. Future changes to licensing, legal terms, publication policy, ownership, or material distribution rights require explicit developer approval.
