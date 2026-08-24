# Decision-Value Boundary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add backward-compatible, machine-validatable Dogfood decision-value checkpoints for `MORE_CONTEXT_REQUIRED` and `NO_MORE_CONTEXT_NEEDED`.

**Architecture:** Extend only the closed `measurements` object in the v0.1 Dogfood schema with an optional non-empty `decision_value_checks` array. Each checkpoint is a closed object whose two exclusive `oneOf` branches encode the approved decision/source/fact/materiality combinations using keywords already supported by the repository verifier; repository-copy regressions exercise real schema validation before and after the change.

**Tech Stack:** Draft 2020-12 JSON Schema, Node.js ES modules, filesystem-backed JSON regression fixtures, Markdown.

**Spec:** Developer-approved DevSwitchboard Dogfood #013 Approved Handoff Revision 1 for task `devswitchboard-decision-value-boundary-013`.

## Global Constraints

- Keep schema version `0.1` and all existing Dogfood records valid without modification.
- Add only optional `measurements.decision_value_checks`; do not rewrite Dogfood #012 to populate it.
- Encode `MORE_CONTEXT_REQUIRED` as a non-`NONE` source, non-null focused fact, and non-empty `material_to`.
- Encode `NO_MORE_CONTEXT_NEEDED` as source `NONE`, null fact, and empty `material_to`.
- Prefer schema-only enforcement; do not modify `scripts/verify.mjs` unless the repository validator cannot enforce an approved invariant.
- Do not change Approved Handoff, bridge, routing, Work State, Re-route Required, or Conflict Report semantics.
- Execute sequentially without implementation subagents; use one fresh independent reviewer after implementation.
- Do not commit, push, create a Pull Request, merge, tag, release, or publish.

---

### Task 1: Add regression-first decision-value coverage

**Files:**
- Modify: `tests/verify-regressions.mjs`

**Interfaces:**
- Consumes: `copyRepository`, `runVerifier`, `readJson`, `writeJson`, `expectAccepted`, and `expectRejected`.
- Produces: Real-verifier accepted and rejected cases for the optional checkpoint array.

- [x] **Step 1: Add literal checkpoint fixtures and a Dogfood-record writer.**

Add helpers equivalent to:

```js
function moreContextRequiredCheck() {
  return {
    checkpoint_id: "DV-regression-001",
    decision: "MORE_CONTEXT_REQUIRED",
    context_source: "REMOTE",
    missing_fact: "Does the canonical schema support structured decision-value checkpoints?",
    material_to: ["execution_strategy", "task_class"],
    evidence: ["The answer determines whether schema work is required."]
  };
}

function noMoreContextNeededCheck() {
  return {
    checkpoint_id: "DV-regression-002",
    decision: "NO_MORE_CONTEXT_NEEDED",
    context_source: "NONE",
    missing_fact: null,
    material_to: [],
    evidence: ["The authoritative fact and resulting strategy are resolved."]
  };
}
```

Write each synthetic record by cloning `dogfood/devswitchboard-adaptive-readiness-012.json`, assigning a unique task ID, and setting `measurements.decision_value_checks` without changing production fixtures.

- [x] **Step 2: Add accepted cases.**

Assert verifier success for:

```text
historical Dogfood record with the optional field absent
valid MORE_CONTEXT_REQUIRED with REMOTE source, focused fact, and material targets
valid NO_MORE_CONTEXT_NEEDED with NONE source, null fact, and empty material targets
```

- [x] **Step 3: Add rejected adversarial cases.**

Assert verifier rejection for:

```text
MORE_CONTEXT_REQUIRED + NONE source
MORE_CONTEXT_REQUIRED + null missing fact
MORE_CONTEXT_REQUIRED + empty material_to
NO_MORE_CONTEXT_NEEDED + REMOTE source
NO_MORE_CONTEXT_NEEDED + non-null missing fact
NO_MORE_CONTEXT_NEEDED + non-empty material_to
unknown decision
missing required checkpoint field
empty evidence
unexpected checkpoint property
```

- [x] **Step 4: Run the complete regression suite and capture RED.**

Run: `node tests/verify-regressions.mjs`

Expected: FAIL because the current closed `measurements` schema rejects the new valid field and cannot yet produce the intended conditional-validation failures.

### Task 2: Implement the minimal optional schema extension

**Files:**
- Modify: `schemas/dogfood-record.schema.json`

**Interfaces:**
- Consumes: Existing closed `measurements` schema and verifier-supported JSON Schema keywords.
- Produces: Optional `decision_value_checks` with exclusive decision shapes and no historical-record migration.

- [x] **Step 1: Add the optional non-empty array.**

Add `decision_value_checks` to `measurements.properties` without adding it to `measurements.required`. Use `minItems: 1`; require `checkpoint_id`, `decision`, `context_source`, `missing_fact`, `material_to`, and `evidence` on every item; keep checkpoint items closed with `additionalProperties: false`.

- [x] **Step 2: Encode both decisions with `oneOf`.**

Use this conditional boundary:

```json
"oneOf": [
  {
    "properties": {
      "decision": { "const": "MORE_CONTEXT_REQUIRED" },
      "context_source": { "enum": ["REMOTE", "LOCAL", "INTENT"] },
      "missing_fact": { "type": "string", "minLength": 1 },
      "material_to": { "type": "array", "minItems": 1 }
    }
  },
  {
    "properties": {
      "decision": { "const": "NO_MORE_CONTEXT_NEEDED" },
      "context_source": { "const": "NONE" },
      "missing_fact": { "type": "null" },
      "material_to": { "type": "array", "maxItems": 0 }
    }
  }
]
```

Define string item constraints for `material_to` and require at least one non-empty evidence string. Do not change schema version or any other record surface.

- [x] **Step 3: Run regression GREEN and the full verifier.**

Run: `node tests/verify-regressions.mjs`

Run: `node scripts/verify.mjs`

Expected: PASS. If conditional cases fail because of an unsupported keyword, stop and reassess before changing `scripts/verify.mjs`; the planned keywords are already supported.

### Task 3: Document and dogfood the decision boundary

**Files:**
- Modify: `docs/getting-started.md`
- Modify: `dogfood/README.md`
- Create: `dogfood/devswitchboard-decision-value-boundary-013.json`

**Interfaces:**
- Consumes: The two machine-valid checkpoint shapes and the approved #013 lifecycle evidence.
- Produces: Developer-oriented guidance plus one canonical Dogfood run using both decisions.

- [x] **Step 1: Add the positive `MORE_CONTEXT_REQUIRED` contrast.**

Explain that an almost-ready task stops when one authoritative missing fact could change task class or execution strategy. Before an Approved Handoff exists, acquiring that fact and selecting the resulting route is context acquisition—not Re-route Required.

- [x] **Step 2: Create the Dogfood #013 record.**

Record exactly two decision-value checks:

```text
DV-013-001: MORE_CONTEXT_REQUIRED / REMOTE / focused schema-support fact / execution_strategy + task_class
DV-013-002: NO_MORE_CONTEXT_NEEDED / NONE / null fact / empty material_to
```

Preserve that GitHub supplied the authoritative fact, the fact changed the candidate route from bounded to architectural, the developer approved that route, and implementation then proceeded under the Approved Handoff. Keep result/review/verification incomplete until their gates run.

- [x] **Step 3: Add the Dogfood index entry and run focused validation.**

Run: `node scripts/verify.mjs`

Expected: PASS with both checkpoints validated by the existing v0.1 schema engine.

### Task 4: Run fresh independent review and remediate

**Files:**
- Modify as findings require: approved task files only

**Interfaces:**
- Consumes: Full uncommitted diff, this plan, Approved Handoff requirements, and baseline SHA.
- Produces: Severity-ranked review findings with every valid Critical/Important and decision-value/backward-compatibility/machine-validation Minor issue remediated.

- [x] **Step 1: Dispatch one read-only fresh reviewer.**

Require direct adversarial checks for contradictory combinations, optional-field backward compatibility, accidental schema/version expansion, verifier necessity, historical #012 stability, and authority/lifecycle boundary drift. The reviewer must not edit files or dispatch subagents.

- [x] **Step 2: Validate and remediate findings regression-first.**

For any schema-semantics defect, add a focused failing regression before the minimum schema correction. Re-run the affected cases after each remediation.

- [x] **Step 3: Re-review if Critical or Important findings required changes.**

Reuse the same reviewer until no Critical or Important issue remains. Resolve every valid Minor issue affecting decision-value semantics, backward compatibility, or machine validation.

### Task 5: Run fresh final verification and stop locally

**Files:**
- Modify: `dogfood/devswitchboard-decision-value-boundary-013.json`
- Modify: `docs/superpowers/plans/2026-08-24-decision-value-boundary.md`

**Interfaces:**
- Consumes: Final remediated tree.
- Produces: Current review/verification evidence and an exact local-completion inventory.

- [x] **Step 1: Finalize review and verification evidence only after review completes.**

Set the Dogfood record to `result: pass`, review `pass` or `findings_remediated`, verification `pass`, and `next_action: developer_review`. Mark completed plan steps only when their commands have actually passed.

- [x] **Step 2: Run fresh checks after the final evidence change.**

Run:

```text
node tests/verify-regressions.mjs
node scripts/verify.mjs
git diff --check
git diff --cached --check
```

Also parse every JSON file, validate the exact changed-file inventory, compare every pre-existing Dogfood record against the extended schema unchanged, scan unresolved markers, confirm schema version `0.1`, and confirm no Approved Handoff, bridge, routing, Work State, Re-route Required, Conflict Report, or `scripts/verify.mjs` file changed.

- [x] **Step 3: Stop without Git or publication effects.**

Return the plan summary, exact inventory, RED/GREEN evidence, backward-compatibility evidence, independent-review disposition, and fresh final verification. Do not commit or publish.
