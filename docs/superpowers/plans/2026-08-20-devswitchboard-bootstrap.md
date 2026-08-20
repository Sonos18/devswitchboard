# DevSwitchboard Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the documentation-first DevSwitchboard v0.1 repository from approved Design Revision 2.

**Architecture:** The repository is organized around small normative Markdown documents and machine-readable JSON Schema contracts. Canonical JSON records exercise those contracts; JSON is also valid YAML 1.2, preserving the approved structured-artifact model without introducing parser dependencies. A dependency-free Node verification script checks structure, links, JSON syntax, schema conformance, terminology, placeholders, and scope boundaries.

**Tech Stack:** Markdown, JSON Schema Draft 2020-12, JSON/YAML-compatible records, Node.js 22 standard library, Git.

**Spec:** `docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md`

## Global Constraints

- DevSwitchboard is developer-centric orchestration for AI coding workflows.
- The developer remains final authority.
- v0.1 is manual-first, advisory-first, efficiency-balanced, phase-routed, and rule-based.
- The Task Profile has exactly seven dimensions: `requirement_ambiguity`, `scope_complexity`, `repository_dependency`, `regression_risk`, `parallelizability`, `security_sensitivity`, and `context_uncertainty`.
- Superpowers is the only v0.1 methodology adapter.
- Semantic Gate Deduplication MUST reuse adequate, fresh upstream gates when no material delta invalidates them, but MUST NOT replace fresh final verification.
- No CLI, plugin, web application, or multi-provider integration belongs to this bootstrap.
- Production-runtime TDD is not applicable because this bootstrap contains no product runtime; executable repository tooling uses focused regression tests for behavioral defects.
- Implementation remains inline and single-agent. A fresh subagent performs review only after authorship is complete.
- Apache License 2.0 is selected by developer-owned decision `DEC-LICENSE-001`; licensing and comparable legal or distribution decisions are intent, not implementation adaptations.

## File Map

| Path | Responsibility |
| --- | --- |
| `README.md` | Public entrypoint, value proposition, workflow overview, and navigation. |
| `LICENSE` | Apache License 2.0 terms for the open-source repository. |
| `CONTRIBUTING.md` | Contribution workflow and normative-document change rules. |
| `.editorconfig`, `.gitattributes`, `.gitignore` | Portable text and Git conventions. |
| `docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md` | Approved Design Revision 2 and intent authority. |
| `docs/superpowers/plans/2026-08-20-devswitchboard-bootstrap.md` | Authoritative repository implementation plan. |
| `docs/contracts/README.md` | Contract index, common envelope, authority, and evolution policy. |
| `docs/contracts/*.md` | Human-readable semantics for each canonical bridge contract. |
| `schemas/*.schema.json` | Machine-readable contract definitions plus routing-case and dogfood validation wrappers. |
| `docs/workflows/chat.md` | Intent-facing Chat workflow. |
| `docs/workflows/codex.md` | Repository-facing Codex workflow and preflight outcomes. |
| `docs/routing/rules.md` | Ordered v0.1 routing catalog and deterministic evaluation. |
| `docs/adapters/superpowers.md` | Superpowers-only methodology mapping and gate deduplication. |
| `docs/state-and-recovery.md` | Pause, resume, invalidation, conflict, and re-route state model. |
| `examples/*.json` | Canonical contract-conforming scenarios. |
| `dogfood/README.md` | Measurement interpretation and usage. |
| `dogfood/measurement-template.json` | Reusable empty observation record with explicit zero/empty values. |
| `dogfood/devswitchboard-bootstrap-001.json` | Self-hosting Dogfood #001 record. |
| `scripts/verify.mjs` | Dependency-free repository and contract verification. |
| `tests/verify-regressions.mjs` | Executable workflow-integrity regression coverage for the verifier. |

---

### Task 1: Initialize the OSS Foundation and Public Narrative

**Status:** Complete

**Files:**
- Create: `.editorconfig`
- Create: `.gitattributes`
- Create: `.gitignore`
- Create: `README.md`
- Create: `LICENSE`
- Create: `CONTRIBUTING.md`

**Interfaces:**
- Consumes: The positioning, scope, principles, terminology, and acceptance criteria in the approved spec.
- Produces: Stable public navigation labels used by every later document: Task Profile, Routing Recommendation, Approved Handoff, Codex Preflight, Conflict Report, Re-route Required, Work State, and Verification Report.

- [ ] **Step 1: Initialize Git with the `main` default branch**

Run: `git init -b main`

Expected: `.git` exists and `git branch --show-current` prints `main` after the first commit; before a commit, `git status --short` is available and reports untracked files.

- [ ] **Step 2: Add portable repository conventions**

Create UTF-8, LF, final-newline rules in `.editorconfig`; set `* text=auto eol=lf` in `.gitattributes`; ignore OS/editor debris and `node_modules/` without ignoring project artifacts.

- [ ] **Step 3: Write the public README**

Include: thesis and tagline; v0.1 status; a three-step `profile → route → approve/execute` quick start; developer-authority statement; phase-routing overview; canonical contract links; Superpowers-only statement; explicit non-goals; repository map; contribution and license links.

- [ ] **Step 4: Add the OSS license and contribution foundation**

Use the unmodified Apache License 2.0 text. Define contribution gates for terminology, contract compatibility, examples, and verification. Defer governance and private vulnerability-reporting files until real, monitored reporting channels are configured; do not publish placeholder contact details.

- [ ] **Step 5: Verify foundation scope**

Run: `git status --short`

Expected: only planned bootstrap files are present; no CLI entrypoint, application source tree, plugin manifest, or provider integration exists.

### Task 2: Define Human and Machine-Readable Contracts

**Status:** Complete

**Files:**
- Create: `docs/contracts/README.md`
- Create: `docs/contracts/task-profile.md`
- Create: `docs/contracts/routing-recommendation.md`
- Create: `docs/contracts/approved-handoff.md`
- Create: `docs/contracts/codex-preflight.md`
- Create: `docs/contracts/conflict-report.md`
- Create: `docs/contracts/re-route-required.md`
- Create: `docs/contracts/work-state.md`
- Create: `docs/contracts/verification-report.md`
- Create: `schemas/task-profile.schema.json`
- Create: `schemas/routing-recommendation.schema.json`
- Create: `schemas/approved-handoff.schema.json`
- Create: `schemas/codex-preflight.schema.json`
- Create: `schemas/conflict-report.schema.json`
- Create: `schemas/re-route-required.schema.json`
- Create: `schemas/work-state.schema.json`
- Create: `schemas/verification-report.schema.json`
- Create: `schemas/routing-case.schema.json`
- Create: `schemas/dogfood-record.schema.json`

**Interfaces:**
- Consumes: Canonical terminology and bridge semantics from spec sections 4, 5, 7, and 8.
- Produces: Draft 2020-12 schemas with `$id` values under `https://devswitchboard.dev/schemas/`, `schema_version: "0.1"`, closed objects, and exact enums consumed by all examples, workflow documents, dogfood records, and verification tooling.

- [ ] **Step 1: Define the shared contract policy**

Document that structured records use JSON for dependency-free validation and remain YAML 1.2-compatible. Require `schema`, `schema_version`, task identity where applicable, explicit status, evidence, and closed unknown-field handling. State that schema changes require versioning plus migrated canonical examples.

- [ ] **Step 2: Define Task Profile and Routing Recommendation**

Require exactly seven profile dimensions, each with `level: low|medium|high` and a non-empty evidence array. Require routing fields for phase, surface (`chat|codex|developer`), workflow, resources, rationale, developer approval, invalidation conditions, and matched rule.

- [ ] **Step 3: Define handoff and preflight contracts**

Require an Approved Handoff to carry baseline, context, final profile, completed workflow gates, approved routing strategy, scope, exclusions, acceptance criteria, and readiness results. Restrict Codex Preflight to `compatible`, `compatible_with_adaptation`, or `blocked_by_conflict`, with inspected baseline, adaptations, conflicts, and next action.

- [ ] **Step 4: Define stop, recovery, and completion contracts**

Define Conflict Report, Re-route Required, Work State, and Verification Report with non-empty evidence and explicit developer-decision requirements. Work State records authoritative artifacts, completed/reused gates, workspace state, active route, verification state, and next safe action.

- [ ] **Step 5: Parse every schema**

Run: `node -e "const fs=require('fs');for(const f of fs.readdirSync('schemas'))JSON.parse(fs.readFileSync('schemas/'+f,'utf8'));console.log('schemas: parse PASS')"`

Expected: `schemas: parse PASS`.

### Task 3: Document Workflows, Ordered Routing, and the Superpowers Adapter

**Status:** Complete

**Files:**
- Create: `docs/workflows/chat.md`
- Create: `docs/workflows/codex.md`
- Create: `docs/routing/rules.md`
- Create: `docs/adapters/superpowers.md`
- Create: `docs/state-and-recovery.md`

**Interfaces:**
- Consumes: Contract names, enums, and fields from Task 2.
- Produces: A deterministic phase-level decision procedure and recovery flow referenced by README and examples.

- [ ] **Step 1: Write the Chat workflow**

Define entry conditions, requirement/design/specification phases, Task Profile construction, strategy approval, Semantic Gate Deduplication, Approved Handoff readiness, exit conditions, and stop conditions. Explicitly prohibit Chat from asserting repository compatibility.

- [ ] **Step 2: Write the Codex workflow**

Define preflight inspection, the three allowed outcomes, spec persistence, implementation planning, inline/delegated execution gates, review, mandatory fresh verification, Work State updates, Conflict Report, and Re-route Required behavior.

- [ ] **Step 3: Write the ordered rule catalog**

Create rules `R001` through `R012` in priority order: developer override; unresolved intent; missing/stale repository context; actual conflict; security/high regression; architecture/high complexity; independent parallel units; bounded implementation delegation; fresh-context review; fresh verification; material-event re-route; low-risk direct execution. For every rule include match, recommendation, rationale, approval, and invalidation conditions.

- [ ] **Step 4: Write the Superpowers adapter**

Map the approved practices exactly as specified. Distinguish semantic gates from skill names. Record that upstream brainstorming is reusable with adequate evidence, while verification-before-completion is always fresh. State that production-code TDD begins only when production executable code exists.

- [ ] **Step 5: Write state and recovery guidance**

Define lifecycle states `ready`, `active`, `waiting_for_developer`, `blocked_by_conflict`, `verification_failed`, and `complete`; material events; resumability checks; and the exact choice between continue, re-route, and conflict.

- [ ] **Step 6: Check canonical names**

Run: `rg -n "Task Profile|Routing Recommendation|Approved Handoff|Codex Preflight|Conflict Report|Re-route Required|Work State|Verification Report" README.md docs`

Expected: each term appears in its defining document and relevant workflow; no alternate name replaces a canonical name.

### Task 4: Add Canonical Scenarios and Dogfood Measurement

**Status:** Complete

**Files:**
- Create: `examples/README.md`
- Create: `examples/low-risk-doc-fix.json`
- Create: `examples/architectural-feature.json`
- Create: `examples/security-sensitive-change.json`
- Create: `examples/devswitchboard-approved-handoff.json`
- Create: `examples/codex-preflight.json`
- Create: `examples/conflict-report.json`
- Create: `examples/re-route-required.json`
- Create: `examples/work-state.json`
- Create: `examples/verification-report.json`
- Create: `dogfood/README.md`
- Create: `dogfood/measurement-template.json`
- Create: `dogfood/devswitchboard-bootstrap-001.json`

**Interfaces:**
- Consumes: Task 2 schemas and Task 3 routing rule identifiers.
- Produces: Valid records referenced by README and exercised by `scripts/verify.mjs`.

- [ ] **Step 1: Add three routing examples**

Represent: a low-risk documentation fix routed directly to Codex; an architectural feature routed through Chat approval and Codex planning with single-agent implementation; and a security-sensitive change requiring elevated review and verification. Each example contains a final seven-dimension Task Profile and Routing Recommendation whose `matched_rule` exists in the catalog.

- [ ] **Step 2: Add the measurement kit**

Define interpretation for phase timing, gates reused/repeated, clarification loops, re-routes, verification failures, developer overrides, result, and observations. The template uses explicit empty arrays and zero counts so it is ready to copy without placeholder tokens.

- [ ] **Step 3: Record self-hosting Dogfood #001**

Capture task `devswitchboard-bootstrap-001`, Design Revision 2 authority, approved single-agent authorship, fresh review subagent, no isolation, upstream brainstorming reuse, preflight adaptation for repository conventions, verification criteria, developer controls, and the observable result. Unknown elapsed times are omitted by schema rather than invented.

- [ ] **Step 4: Parse every canonical record**

Run: `node -e "const fs=require('fs');for(const d of ['examples','dogfood'])for(const f of fs.readdirSync(d).filter(x=>x.endsWith('.json')))JSON.parse(fs.readFileSync(d+'/'+f,'utf8'));console.log('records: parse PASS')"`

Expected: `records: parse PASS`.

### Task 5: Add Dependency-Free Verification and Run the Author Self-Review

**Status:** Complete

**Files:**
- Create: `scripts/verify.mjs`
- Create: `tests/verify-regressions.mjs`
- Modify: any bootstrap file found inconsistent by verification.

**Interfaces:**
- Consumes: All repository files, schema definitions, example records, and rule identifiers.
- Produces: Exit code `0` plus named PASS checks, or exit code `1` plus actionable failures.

- [ ] **Step 1: Implement schema and record checks**

Use only `node:fs`, `node:path`, and `node:url`. Parse every `.json`; recursively validate the JSON Schema subset used here (`type`, `required`, `properties`, `additionalProperties`, `enum`, `const`, `items`, `minItems`, `minLength`, `pattern`, `$ref`, and `oneOf`); resolve local `$ref` values; and validate every example/dogfood record that declares `$schema_file`.

- [ ] **Step 2: Implement documentation checks**

Verify required paths, local Markdown links, all eight canonical contract names, the seven Task Profile dimensions, rule identifiers referenced by examples, absence of `TBD`, `TODO`, `FIXME`, and `PLACEHOLDER`, and absence of forbidden product directories or manifests (`src/cli`, `.codex-plugin`, `app`, `pages`). Ignore `.git` and the plan's explanatory no-placeholder text when scanning.

- [ ] **Step 3: Run repository verification**

Run: `node tests/verify-regressions.mjs` and `node scripts/verify.mjs`

Expected: all named checks print `PASS`; process exits `0`.

- [ ] **Step 4: Run clean-diff formatting checks**

Run: `git diff --check` and `git diff --cached --check`
Run: `git status --short`

Expected: both diff checks are silent; status contains only intended bootstrap artifacts.

- [ ] **Step 5: Perform plan self-review**

Compare every spec acceptance criterion to Tasks 1–5, scan this plan for forbidden placeholder language excluding the explicit instruction that names it, and confirm contract field names match between schemas, docs, examples, and verifier. Fix any mismatch before review.

### Task 6: Fresh Review, Remediation, and Final Verification

**Status:** Complete

**Files:**
- Modify: only files implicated by evidence-backed review findings.
- Create: `dogfood/review-001.md`

**Interfaces:**
- Consumes: Complete authored repository and Task 5 verification output.
- Produces: A fresh-context review record, remediated repository, final Verification Report data in Dogfood #001, and handoff-ready Work State.

- [ ] **Step 1: Dispatch one fresh review subagent**

Give the reviewer the approved spec, this plan, and repository paths. Ask specifically for contradictions, contract/schema mismatches, example/rule inconsistencies, unfulfilled acceptance criteria, hidden placeholders, and scope violations. The reviewer must not edit files.

- [ ] **Step 2: Record and triage review findings**

Write `dogfood/review-001.md` with review scope, findings ordered by severity, disposition, and evidence. Fix every confirmed issue; record `No findings` if the reviewer returns none.

- [ ] **Step 3: Re-run all verification from a fresh process**

Run: `node scripts/verify.mjs`
Run: `git diff --check` and `git diff --cached --check`
Run: `git status --short`

Expected: verifier exits `0`, both diff checks are silent, and status lists only intended bootstrap artifacts.

- [ ] **Step 4: Finalize Dogfood #001 state**

Update the record with review outcome, final check names, verified result, completed phase, and next action `developer_review`. Do not invent timing or token data that was not observed.

- [ ] **Step 5: Prepare the developer handoff**

Report preflight outcome, delivered artifact groups, review outcome, exact verification commands and results, Git state, implementation adaptations, and any residual decisions. Do not claim completion from stale or inferred evidence.

### Task 7: Apply Approved License Intent and Remediate Routing

**Status:** Complete

**Files:**
- Modify: `LICENSE`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md`
- Create: `docs/superpowers/specs/2026-08-20-license-intent-update.md`
- Modify: `docs/routing/rules.md`
- Modify: `schemas/dogfood-record.schema.json`
- Modify: `dogfood/measurement-template.json`
- Modify: `dogfood/devswitchboard-bootstrap-001.json`
- Modify: `examples/codex-preflight.json`
- Modify: `examples/work-state.json`
- Modify: `scripts/verify.mjs`

**Interfaces:**
- Consumes: Approved developer decision `DEC-LICENSE-001` and the existing R001 developer-authority gate.
- Produces: Apache-2.0 repository terms, an explicit developer-owned legal/distribution intent rule, a structured remediated router finding, and fresh completion evidence.

- [x] **Step 1: Add a failing decision-value verification check**

Run: `node scripts/verify.mjs`

Expected: FAIL for MIT licensing, missing R001 legal/distribution semantics, and missing Dogfood router finding.

- [x] **Step 2: Apply Apache-2.0 and the semantic routing correction**

Replace `LICENSE`, update public metadata and approved intent, extend R001 semantically, and remove licensing from the preflight adaptation list.

- [x] **Step 3: Record the router error**

Extend the dogfood schema and records with the approved `ROUTER_ERROR` finding and correction.

- [x] **Step 4: Run fresh completion verification**

Run: `node scripts/verify.mjs`, `git diff --check`, and `git diff --cached --check`.

Expected: all repository checks pass, both Git formatting checks are silent, Work State is `complete`, and Dogfood #001 next action is `developer_review`.
