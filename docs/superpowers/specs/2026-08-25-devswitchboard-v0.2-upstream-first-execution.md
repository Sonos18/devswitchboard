# DevSwitchboard v0.2 — Upstream-First Execution Design Specification

**Revision:** 1
**Status:** Approved
**Product version:** `v0.2.0`
**Working name:** Upstream-First Execution
**Project authority:** [`docs/north-star.md`](../../north-star.md)
**Baseline:** `688c9d51ab23909872119181248e8cf8dce5ae5c`

## 1. Purpose

DevSwitchboard v0.2 reduces avoidable Codex usage by completing all safe repository-independent execution reasoning in ChatGPT Web/Desktop before Codex entry.

Codex remains responsible for work whose value depends on live repository truth or repository execution:

- local-only facts;
- Codex Preflight;
- repository grounding;
- implementation;
- debugging;
- independent review when selected;
- fresh verification.

The Developer remains the final authority.

This specification defines only the v0.2 delta. It does not redefine the project North Star.

## 2. Problem statement

DevSwitchboard v0.1 establishes the correct high-level division of responsibility:

```text
ChatGPT Web/Desktop
  → requirements
  → intent clarification
  → design
  → shared or remote context
  → specification
  → acceptance criteria
  → approved execution strategy

Codex
  → local repository truth
  → preflight
  → repository-grounded planning
  → implementation
  → debugging
  → review
  → fresh verification
```

However, an Approved Handoff can currently carry goal, scope, acceptance criteria, approved strategy, routing, and verification expectations without explicitly recording:

1. which execution reasoning Chat has already completed;
2. which parts are approved intent or strategy;
3. which parts remain provisional until local grounding;
4. which exact facts still require Codex;
5. why the selected phase materially requires Codex.

As a result, Codex can legitimately receive an approved handoff yet still restart planning from first principles.

The current Codex workflow requires repository-grounded planning for routes that include `implementation_planning`, while preserving direct execution for valid R012 tasks. The remaining v0.2 problem is therefore not whether planning exists, but whether Codex repeats reasoning that Chat could safely have completed upstream.

## 3. Goals

v0.2 MUST:

1. make upstream execution preparation explicit;
2. make the value of each selected surface explicit;
3. prevent Codex from repeating valid upstream reasoning without material local evidence;
4. preserve Codex ownership of repository truth;
5. transfer the smallest sufficient approved context;
6. distinguish binding intent from provisional decomposition;
7. preserve R012 direct execution;
8. retain all historical v0.1 artifacts without rewriting them;
9. measure avoidable Codex work through observable workflow evidence;
10. preserve Developer authority and mandatory confidence work.

## 4. Non-goals

v0.2 does not introduce:

- a CLI;
- a plugin;
- a web UI;
- a product runtime;
- multi-provider integration;
- learned or probabilistic routing;
- autonomous approval;
- new Task Profile dimensions;
- a new routing-rule family;
- a new lifecycle phase;
- a new bridge artifact;
- generic multi-agent orchestration;
- exact token accounting;
- a multi-version roadmap.

These capabilities are not goals by themselves under the project North Star.

## 5. Preserved v0.1 invariants

The following semantics remain unchanged:

- recommendations are not authorization;
- the Developer is final authority;
- Task Profile retains exactly seven dimensions;
- routing remains deterministic and phase-level;
- `REMOTE` context belongs to Chat/GitHub;
- `LOCAL` context belongs to Codex;
- `INTENT` belongs to the Developer;
- Micro Consultation does not transfer phase ownership;
- Local Delta represents task-relevant local divergence, not dirtiness alone;
- semantic gates are reused when their evidence remains adequate and fresh;
- `MORE_CONTEXT_REQUIRED` and `NO_MORE_CONTEXT_NEEDED` remain valid stopping decisions;
- profile refresh does not automatically cause re-routing;
- technical eligibility does not select a resource;
- lower orchestration is preferred on effective ties;
- fresh final verification is mandatory;
- Re-route Required and Conflict Report retain their existing lifecycle meanings.

The ordered R001–R012 catalog remains in force. In particular, R006 still routes architectural or high-complexity implementation planning to Codex, while R012 still permits low-risk direct execution.

## 6. Terminology

### Upstream Execution Preparation

Repository-independent execution reasoning completed by Chat before Codex entry.

It may include:

- selected approach;
- logical work units;
- non-local sequencing assumptions;
- approved constraints;
- exclusions;
- acceptance mapping;
- verification intent;
- known assumptions;
- explicit local-grounding questions.

It MUST NOT fabricate live repository facts.

### Surface Value

A machine-readable statement of the material value for selecting a surface.

Surface Value explains why work belongs on Chat, Codex, or Developer. It does not grant authority.

### Repository Grounding

Codex work that maps approved preparation to the live repository:

- exact files;
- exact symbols;
- repository interfaces;
- local instructions;
- current workspace state;
- toolchain availability;
- exact verification commands;
- repository-specific adaptations.

### Duplicated Reasoning

Material reasoning repeated by Codex when:

- the decision was already completed upstream;
- its evidence remains adequate and fresh;
- no material local evidence invalidates it;
- the repetition produces no new repository-grounded value or required confidence.

### Required Re-evaluation

Reasoning repeated because new local evidence can materially affect:

- feasibility;
- decomposition;
- route;
- execution strategy;
- scope;
- acceptance;
- required confidence.

Required re-evaluation is not duplicated reasoning.

## 7. Selected architecture

v0.2 uses **Versioned Inline Upstream Preparation**.

It preserves one Chat-to-Codex bridge:

```text
Routing Recommendation
        ↓
Approved Handoff
        ↓
Codex Preflight
        ↓
repository grounding
        ↓
implementation / review / verification
```

It does not create a separate Execution Preparation artifact.

The selected contract changes are:

```yaml
routing_recommendation:
  new_schema_version: "0.2"
  required_delta:
    - surface_value

approved_handoff:
  new_schema_version: "0.2"
  required_delta:
    - upstream_preparation

dogfood_record:
  schema_version: "0.1"
  compatible_optional_delta:
    - measurements.codex_value_checks
```

All other contract versions remain `0.1`.

## 8. Contract versioning

Product version and contract version are independent.

```yaml
product_version: v0.2.0

contract_versions:
  routing_recommendation: "0.2"
  approved_handoff: "0.2"

unchanged_contract_versions:
  task_profile: "0.1"
  codex_preflight: "0.1"
  local_delta: "0.1"
  micro_consultation_request: "0.1"
  micro_consultation_response: "0.1"
  re_route_required: "0.1"
  conflict_report: "0.1"
  work_state: "0.1"
  verification_report: "0.1"
  dogfood_record: "0.1"
```

The existing schema files remain canonical and discriminate `0.1` versus `0.2` records through version-conditioned schema branches.

Historical `0.1` artifacts MUST remain valid and unchanged.

New v0.2 Routing Recommendations and Approved Handoffs MUST use schema version `0.2`.

No historical migration is required:

```yaml
migration:
  rewrite_historical_artifacts: false
  support_0_1_reading: true
  require_0_2_for_new_v0_2_records: true
```

This follows the existing evolution rule: compatible clarification may retain a version, while adding a required field or changing machine-contract semantics requires a new schema version.

## 9. Routing Recommendation `0.2`

### 9.1 New field

Every Routing Recommendation `0.2` requires:

```yaml
surface_value:
  - repository_grounding
```

`surface_value` is a non-empty array whose items use this vocabulary:

```text
intent_resolution
shared_context_acquisition
developer_decision
local_repository_truth
repository_grounding
implementation_execution
debugging
independent_review
fresh_verification
```

### 9.2 Surface compatibility

Allowed values by surface:

```yaml
chat:
  - intent_resolution
  - shared_context_acquisition

developer:
  - developer_decision

codex:
  - local_repository_truth
  - repository_grounding
  - implementation_execution
  - debugging
  - independent_review
  - fresh_verification
```

A recommendation whose surface is `codex` MUST contain at least one Codex-specific value.

A recommendation MUST NOT use surface values belonging exclusively to another surface.

### 9.3 Semantics

`surface_value` answers:

> What material result requires this surface?

It does not:

- authorize execution;
- replace `rationale`;
- replace the matched routing rule;
- prove Developer approval;
- transfer phase ownership;
- claim repository compatibility.

The existing recommendation remains advisory.

### 9.4 Example

```yaml
$schema_file: ../schemas/routing-recommendation.schema.json
schema: routing_recommendation
schema_version: "0.2"
task_id: devswitchboard-upstream-preparation-boundary-017
revision: 1
phase: implementation_planning
surface: codex
workflow: repository_grounded_planning
resources:
  - approved_handoff
  - approved_v0_2_specification
matched_rule: R006
surface_value:
  - repository_grounding
rationale:
  - Approved intent and upstream preparation are complete.
  - Exact files, interfaces, repository conventions, and checks require live repository truth.
developer_approval_required: true
invalidation_conditions:
  - Local evidence invalidates the approved route or strategy.
  - Safe implementation requires a material intent change.
```

## 10. Approved Handoff `0.2`

### 10.1 New required object

Every Approved Handoff `0.2` requires:

```yaml
upstream_preparation:
  status: prepared
  source_artifacts: []
  approach_summary: null
  logical_work_units: []
  sequencing_assumptions: []
  local_grounding_needed: []
  rationale: []
```

The object has exactly two valid states:

```text
prepared
not_needed
```

### 10.2 Prepared state

Use `prepared` when repository-independent execution preparation has material value.

Required shape:

```yaml
upstream_preparation:
  status: prepared

  source_artifacts:
    - docs/superpowers/specs/example-approved-spec.md

  approach_summary: >
    Preserve existing public behavior while adding validation
    at the approved boundary.

  logical_work_units:
    - Add regression evidence for the invalid case.
    - Implement the approved validation behavior.
    - Update affected normative guidance.

  sequencing_assumptions:
    - Establish failing regression evidence before implementation.
    - Finalize documentation after behavior is verified.

  local_grounding_needed:
    - Identify the exact validation owner.
    - Identify the canonical regression-test location.
    - Confirm the complete repository verification commands.

  rationale:
    - The approach and logical work units follow from approved intent.
    - Exact repository locations and commands require Codex.
```

Validation requirements:

```yaml
status:
  const: prepared

source_artifacts:
  min_items: 1

approach_summary:
  non_empty_string: true

logical_work_units:
  min_items: 1

sequencing_assumptions:
  array: true

local_grounding_needed:
  min_items: 1

rationale:
  min_items: 1
```

### 10.3 Not-needed state

Use `not_needed` when a separate preparation surface would add ceremony without material value.

Typical case:

```text
clear bounded R012 task
→ compatible preflight
→ direct bounded implementation
```

Required shape:

```yaml
upstream_preparation:
  status: not_needed
  source_artifacts: []
  approach_summary: null
  logical_work_units: []
  sequencing_assumptions: []
  local_grounding_needed: []
  rationale:
    - Scope, acceptance criteria, and verification expectations already constrain the bounded task.
    - A separate preparation layer would not materially reduce Codex reasoning.
```

Validation requirements:

```yaml
status:
  const: not_needed

source_artifacts:
  max_items: 0

approach_summary:
  type: null

logical_work_units:
  max_items: 0

sequencing_assumptions:
  max_items: 0

local_grounding_needed:
  max_items: 0

rationale:
  min_items: 1
```

### 10.4 Source addressability

Each `source_artifacts` entry MUST be resolvable without conversation history.

Valid forms include:

- repository-relative canonical paths;
- approved shared-baseline URLs;
- another canonical artifact identifier that the repository can resolve deterministically.

Display-name-only references are invalid for new v0.2 preparation sources.

This requirement is included because unresolved preparation provenance can force Codex to reconstruct context and consume avoidable usage. It does not generalize unrelated historical addressability cleanup into v0.2 scope.

## 11. Authority model

`upstream_preparation` introduces no new authority surface.

### 11.1 Binding authority remains

The following remain binding:

- goal;
- approved scope and exclusions;
- acceptance criteria;
- Developer decisions;
- approved strategy;
- approved design and specification artifacts;
- existing bridge authority semantics.

### 11.2 Field-specific semantics

```yaml
source_artifacts:
  meaning: authoritative provenance

approach_summary:
  meaning: approved transfer summary
  rule: cannot expand, contradict, or replace source authority

logical_work_units:
  meaning: provisional decomposition
  rule: may be mapped, split, merged, or adapted during local grounding

sequencing_assumptions:
  meaning: provisional non-local ordering
  rule: may be adapted when repository dependencies require it

local_grounding_needed:
  meaning: explicitly unresolved local facts
  rule: Codex must resolve or classify them before strategy-dependent work

rationale:
  meaning: evidence for preparing or omitting preparation
```

### 11.3 Conflict handling

If local evidence changes repository details while preserving intent and approved strategy:

```text
compatible_with_adaptation
→ record adaptation
→ continue
```

If local evidence invalidates the active route or approved strategy:

```text
Re-route Required
→ pause strategy-dependent work
→ Developer approval
```

If safe implementation requires a material intent change:

```text
Conflict Report
→ pause mutating work
→ Developer decision
```

Approved Handoff remains intent truth. Codex Preflight remains the authority on live repository compatibility.

## 12. Chat workflow changes

After specification and before final readiness, Chat performs:

```text
Evaluate upstream-preparation value
```

Chat asks:

> Can repository-independent preparation materially reduce Codex reasoning, context transfer, or round trips without inventing local facts?

### 12.1 Prepared decision

Use `prepared` when Chat can establish material execution structure from:

- approved intent;
- approved design;
- shared or remote context;
- existing acceptance criteria;
- Developer-approved strategy.

### 12.2 Not-needed decision

Use `not_needed` when:

- the task is fully bounded;
- a separate preparation layer would repeat scope or acceptance;
- Codex can proceed through minimal preflight and direct implementation;
- preparation would not materially reduce reasoning or context.

### 12.3 Chat may prepare

- selected approach;
- logical outcomes;
- logical work units;
- intent-level dependencies;
- non-local sequencing assumptions;
- approved constraints;
- acceptance mapping;
- verification intent;
- known assumptions;
- focused local-grounding questions.

### 12.4 Chat must not fabricate

- exact unobserved files;
- exact unobserved symbols;
- current local modifications;
- local-only instructions;
- toolchain availability;
- exact local commands;
- local architecture unavailable from the shared baseline;
- repository compatibility.

### 12.5 Readiness

A v0.2 Approved Handoff is ready only when:

- the Routing Recommendation uses schema `0.2`;
- `surface_value` is valid;
- upstream-preparation status is explicit;
- preparation provenance is resolvable where required;
- local-grounding questions are explicit;
- Developer approval remains affirmative;
- no unresolved conflict exists.

## 13. Codex workflow changes

Codex still begins with live Codex Preflight.

Upstream preparation never replaces:

- local instruction discovery;
- workspace inspection;
- baseline comparison;
- material-delta evaluation;
- conflict detection.

### 13.1 Planning with prepared input

When:

```yaml
upstream_preparation.status: prepared
routing.implementation_planning.active: true
```

the repository-grounded plan MUST include a section that maps every logical work unit to local evidence.

Each item is classified as:

```text
reused
adapted
invalidated
```

Example:

```yaml
upstream_grounding:
  - upstream_item: Add regression evidence for the invalid case.
    result: reused
    local_evidence:
      - The existing regression harness owns this boundary.
    exact_targets:
      - tests/verify-regressions.mjs

  - upstream_item: Implement the approved validation behavior.
    result: adapted
    local_evidence:
      - Validation is centralized in the verifier rather than a schema helper.
    exact_targets:
      - scripts/verify.mjs
```

### 13.2 Reused

Use `reused` when local evidence confirms the upstream item without a material change.

### 13.3 Adapted

Use `adapted` when repository details change decomposition or ordering while preserving:

- goal;
- approved scope;
- acceptance criteria;
- active route;
- approved strategy.

### 13.4 Invalidated

Use `invalidated` when the upstream item cannot safely be used.

An invalidated item MUST include an impact classification:

```text
repository_adaptation
route_or_strategy_invalidation
intent_feasibility_conflict
```

The corresponding existing lifecycle is then applied.

### 13.5 Direct execution

When:

```yaml
upstream_preparation.status: not_needed
matched_rule: R012
preflight: compatible
```

Codex may proceed directly to bounded implementation.

It MUST NOT fabricate:

- a separate implementation-planning phase;
- a plan artifact;
- a repeated upstream approach analysis.

### 13.6 Re-evaluation rule

Codex may reconsider upstream preparation only when local evidence can materially change the result.

It MUST record that evidence.

Reconsideration without material local evidence is duplicated reasoning.

## 14. Smallest sufficient Codex transfer bundle

The default Chat-to-Codex transfer consists of:

1. the complete Approved Handoff `0.2`;
2. directly referenced source artifacts necessary to interpret it;
3. no prior Chat transcript.

The transfer SHOULD exclude:

- rejected alternatives whose decision is final;
- conversational exploration;
- duplicate descriptions of approved scope;
- unrelated GitHub history;
- stale planning notes;
- previous model reasoning not needed for provenance or execution.

The handoff MUST remain self-contained enough for Codex to identify:

- goal;
- authority;
- scope;
- acceptance;
- strategy;
- preparation status;
- preparation provenance;
- unresolved local facts;
- verification expectations.

## 15. Superpowers adapter behavior

The Superpowers adapter remains the only supported methodology adapter.

For v0.2:

- Chat-owned design may satisfy upstream brainstorming and design gates;
- Upstream Execution Preparation does not invoke `writing-plans` merely because preparation exists;
- Codex uses `writing-plans` only when the selected route includes repository-grounded implementation planning;
- that plan grounds approved preparation rather than repeating upstream design;
- R012 direct execution remains plan-free;
- implementation methodology remains selected independently;
- review remains value-gated;
- verification-before-completion remains mandatory.

## 16. Dogfood measurement extension

Dogfood Record remains schema version `0.1`.

Add optional:

```yaml
measurements:
  codex_value_checks:
    - checkpoint_id: CV-017-001
      phase: implementation_planning
      activity: Ground the approved regression work unit.
      upstream_item: Add regression evidence for the invalid case.
      classification: UPSTREAM_PREPARATION_REUSED
      evidence:
        - Codex mapped the approved work unit to the existing regression harness without reopening approach selection.
```

### 16.1 Required item fields

```text
checkpoint_id
phase
activity
upstream_item
classification
evidence
```

`upstream_item` is either a non-empty string or `null`.

`evidence` is a non-empty array.

### 16.2 Classifications

```text
UPSTREAM_PREPARATION_REUSED
LOCAL_GROUNDING_REQUIRED
REQUIRED_ADAPTATION
IMPLEMENTATION_EXECUTION
MANDATORY_CONFIDENCE
DUPLICATED_REASONING
```

### 16.3 Semantics

- `UPSTREAM_PREPARATION_REUSED`: approved preparation was consumed without reopening the decision.
- `LOCAL_GROUNDING_REQUIRED`: live repository evidence was materially necessary.
- `REQUIRED_ADAPTATION`: local evidence required a safe repository-level adjustment.
- `IMPLEMENTATION_EXECUTION`: repository mutation or executable implementation work.
- `MANDATORY_CONFIDENCE`: required review or verification work.
- `DUPLICATED_REASONING`: repeated material reasoning with no new local value or required confidence.

Adding this optional measurement is backward compatible and does not require historical migration.

Dogfood #013 established the precedent for optional, machine-readable decision-value measurements under schema version `0.1`.

Dogfood #015 further demonstrated that actual decisions should not remain prose-only when a canonical measurement surface exists.

## 17. Verifier requirements

The verifier MUST support both historical and v0.2 records.

### 17.1 Routing Recommendation checks

Reject a Routing Recommendation `0.2` when:

- `surface_value` is missing or empty;
- a value is unknown;
- a value conflicts with the selected surface;
- a Codex route contains no Codex-specific value;
- a version `0.1` record contains v0.2-only fields.

### 17.2 Approved Handoff checks

Reject an Approved Handoff `0.2` when:

- `upstream_preparation` is missing;
- the selected status shape is contradictory;
- a prepared handoff has no source artifact;
- a prepared handoff has no logical work unit;
- a prepared handoff has no local-grounding question;
- a not-needed handoff contains preparation content;
- source provenance is display-name-only or unresolvable;
- preparation contradicts approved scope, acceptance, or strategy;
- existing Developer-approval invariants fail.

### 17.3 Compatibility checks

The verifier MUST continue accepting:

- every historical Routing Recommendation `0.1`;
- every historical Approved Handoff `0.1`;
- every historical Dogfood record;
- all current v0.1 lifecycle artifacts.

Historical artifacts MUST not be rewritten merely to adopt v0.2 representation.

## 18. Regression requirements

Regression coverage MUST include:

### Routing Recommendation `0.2`

Valid:

- Chat route with Chat-specific value.
- Developer route with `developer_decision`.
- Codex route with one Codex-specific value.
- Codex route with multiple compatible values.

Invalid:

- empty `surface_value`;
- unknown value;
- Chat value on Codex route;
- Codex value on Chat route;
- Codex route with no Codex-specific value;
- v0.2 field on a `0.1` record.

### Approved Handoff `0.2`

Valid:

- prepared handoff;
- not-needed R012 handoff.

Invalid:

- missing preparation;
- prepared with empty provenance;
- prepared with null summary;
- prepared with no work unit;
- prepared with no local-grounding question;
- not-needed with non-empty work units;
- not-needed with non-null summary;
- display-name-only source;
- contradictory Developer authority.

### Compatibility

- all current `0.1` records remain valid;
- no historical Dogfood edit is required;
- canonical v0.2 examples validate;
- malformed v0.2 records fail for the intended reason.

## 19. Dogfood #017 — Upstream Preparation Boundary

### 19.1 Task identity

```yaml
task_id: devswitchboard-upstream-preparation-boundary-017
purpose: >
  Determine whether approved upstream execution preparation reduces
  avoidable Codex reasoning while preserving repository correctness,
  Developer control, and mandatory confidence.
```

### 19.2 Bootstrap authority

Because v0.2 schemas do not exist before implementation, Dogfood #017 begins with:

1. a valid Approved Handoff `0.1`;
2. this Developer-approved v0.2 specification as authoritative intent;
3. an exact shared baseline;
4. an isolated worktree;
5. an approved architectural execution strategy.

The previous Chat transcript is not supplied to Codex.

### 19.3 Single-run experiment

Dogfood #017 uses one fresh Codex implementation context.

It does not run an A/B pair by default because a second equivalent implementation run would consume additional Codex usage without proven decision value.

Every material Codex activity is classified through `codex_value_checks`.

### 19.4 Material activity boundary

A material activity is an activity that:

- establishes or changes the repository-grounded plan;
- changes repository artifacts;
- changes the route or approved strategy;
- resolves a local-only fact;
- performs selected review;
- performs mandatory verification.

Micro-level editor operations are not measured separately.

### 19.5 Hypothesis

```yaml
upstream_preparation:
  reused_by_codex: true

duplicated_material_reasoning:
  count: 0

codex_local_grounding:
  contains_only_material_local_value: true

local_adaptations:
  evidence_based: true

developer_authority:
  preserved: true

fresh_final_verification:
  preserved: true

historical_v0_1_artifacts:
  valid_and_unchanged: true
```

This is a hypothesis, not a result claim.

### 19.6 Review

A fresh independent reviewer MUST inspect:

- the approved preparation;
- the Codex grounding plan;
- actual repository changes;
- `codex_value_checks`;
- any adaptations;
- lifecycle decisions;
- final verification.

The reviewer challenges whether any activity labeled as local value or required adaptation was actually duplicated reasoning.

### 19.7 Failure behavior

If `DUPLICATED_REASONING` is recorded:

1. the Dogfood does not automatically fail;
2. the run records the exact cause;
3. the team determines whether the gap is:
   - missing preparation data;
   - ambiguous authority;
   - workflow wording;
   - verifier weakness;
   - unavoidable re-evaluation;
4. applicable defects are remediated;
5. affected verification is rerun.

An additional A/B run requires separate Developer approval and evidence that it can materially change the design decision.

## 20. Acceptance criteria

v0.2 is accepted only when:

```yaml
routing_recommendation_0_2:
  surface_value_required: true
  surface_compatibility_enforced: true
  codex_value_explicit: true

approved_handoff_0_2:
  upstream_preparation_required: true
  prepared_shape_validated: true
  not_needed_shape_validated: true
  source_provenance_resolvable: true
  local_facts_not_fabricated: true

codex_workflow:
  preflight_required: true
  preparation_grounded_not_restarted: true
  material_re_evaluation_requires_evidence: true
  R012_fake_plan_absent: true

compatibility:
  routing_recommendation_0_1_valid: true
  approved_handoff_0_1_valid: true
  historical_dogfoods_unchanged: true
  historical_migration_required: false

measurement:
  codex_value_checks_machine_readable: true
  duplicated_reasoning_visible: true
  fabricated_token_savings_absent: true

authority:
  developer_final_authority_preserved: true
  recommendation_not_authorization: true
  local_adaptation_not_silent_redesign: true

confidence:
  independent_review_passes: true
  fresh_final_verification_passes: true
```

## 21. Expected implementation surfaces

The design anticipates changes to the following classes of repository surface:

- Routing Recommendation human contract and schema;
- Approved Handoff human contract and schema;
- Chat workflow;
- Codex workflow;
- Superpowers adapter;
- canonical v0.2 examples;
- repository verifier;
- regression suite;
- Dogfood measurement schema;
- Dogfood #017 record and index;
- first-run guidance where required;
- version-specific design and implementation plan.

Exact files, interfaces, and checks remain Codex repository-grounding work after approved handoff.

## 22. Release boundary

Completing Dogfood #017 does not automatically authorize release `v0.2.0`.

A later release decision requires:

- all approved v0.2 semantics integrated;
- compatibility verification;
- clean-room first-run validation;
- artifact-only recovery validation where materially affected;
- no unresolved Critical or Important finding;
- fresh integrated-main verification;
- separate Developer publication approval.

## 23. Rejected alternatives

### Separate Execution Preparation contract

Rejected because it creates another bridge, provenance relationship, and transfer step without evidence that a new artifact provides more value than its orchestration cost.

### Optional `0.1` Approved Handoff field

Rejected because the core v0.2 behavior could be silently omitted while still validating as a current handoff.

### Documentation-only clarification

Rejected because Codex-entry value and preparation decisions would remain prose-only and could not be verified or measured consistently.

### New lifecycle phase

Rejected because upstream preparation is work within existing Chat-owned specification and strategy preparation, not an independently owned lifecycle stage.

### New routing rule

Rejected because existing rules already determine the phase and surface. v0.2 records the selected surface’s value rather than adding another rule family.

## 24. Developer decisions represented by this specification

Approval of this specification means approval of:

```yaml
product_version:
  target: v0.2.0
  name: Upstream-First Execution

representation:
  new_bridge: false
  new_phase: false
  new_routing_rule: false

routing_recommendation:
  schema_version: "0.2"
  required_field: surface_value

approved_handoff:
  schema_version: "0.2"
  required_field: upstream_preparation

dogfood_record:
  schema_version: "0.1"
  optional_field: measurements.codex_value_checks

compatibility:
  historical_rewrite: false
  historical_0_1_support: required

dogfood:
  next_run: "#017 — Upstream Preparation Boundary"
  default_experiment: single fresh Codex context
```

Approval does not authorize semantic implementation until:

1. this specification is persisted in the repository;
2. the persisted copy is reviewed against this approved content;
3. a separate implementation Approved Handoff is issued;
4. Codex completes live preflight against the implementation baseline.
