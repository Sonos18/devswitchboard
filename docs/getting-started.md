# Your First DevSwitchboard Run

This walkthrough shows what you do from a raw development request through Codex Preflight. It is an onboarding example, not a replacement for the [Chat workflow](workflows/chat.md), [Codex workflow](workflows/codex.md), or canonical contracts.

The example request is deliberately small:

> Add a status filter to an existing invoice list.

Use your real repository and requirement when following the steps.

## The journey at a glance

```text
you state the requirement in ChatGPT Chat
  -> Chat establishes context from the shared GitHub baseline
  -> Chat profiles and routes the work
  -> you resolve material choices and approve the route
  -> Chat returns one complete APPROVED_HANDOFF
  -> you copy that artifact into Codex
  -> Codex inspects the local repository and returns CODEX_PREFLIGHT
  -> compatible preflight enters the selected Superpowers path
```

Chat owns intent. Codex owns local repository compatibility. You remain the final authority at both surfaces.

## 1. Start in regular ChatGPT Chat

Open a normal ChatGPT conversation and provide the raw requirement plus the GitHub repository that represents the shared baseline. For example:

```text
I want to use DevSwitchboard for this change.

Shared baseline:
https://github.com/example/billing-app on main

Raw requirement:
Add a status filter to the existing invoice list.

First establish enough project context from the shared baseline. Then follow
the DevSwitchboard Chat workflow: build the Task Profile, surface only material
developer decisions, produce a Routing Recommendation, and ask for my approval.
After I approve, return one complete Approved Handoff that I can copy to Codex.

Do not claim that the repository is locally compatible; Codex will perform
that preflight after the handoff.
```

Replace the example URL and branch with your project. For a private repository, provide Chat with authorized access or attach the relevant repository context. If Chat cannot establish sufficient context, keep the work in Chat and supply what it requests. Codex is not a fallback for general context acquisition.

The GitHub remote is the normal shared baseline for a synced project. It gives Chat and Codex a common revision to discuss; it does not replace developer intent or local preflight.

## 2. Let Chat establish intent and context

Chat should inspect enough of the baseline to understand the existing invoice list, nearby conventions, and likely change boundary. It then follows the normative [Chat workflow](workflows/chat.md).

For this example, Chat might ask:

- Which statuses should appear?
- Should “All” be the default?
- Must the selection persist in the URL, or is view-local state sufficient?

Answer only the questions that materially change scope or acceptance. A concrete answer could be:

```text
Use All, Open, and Paid. Default to All. Keep the selection local to the
current view; do not add URL or backend behavior. Preserve the existing list
layout and update the nearest relevant tests.
```

These are example-specific choices. They do not add fields or semantics to any DevSwitchboard contract.

## 3. Review the Task Profile and route

Chat completes all seven dimensions in the [Task Profile](contracts/task-profile.md) with evidence from the requirement and shared baseline. A compact summary for this example might be:

| Dimension | Example level | Evidence |
| --- | --- | --- |
| `requirement_ambiguity` | low | Statuses, default, persistence, and exclusions are resolved. |
| `scope_complexity` | low | One existing list and its nearby tests change. |
| `repository_dependency` | low | The shared baseline exposes the relevant list and conventions. |
| `regression_risk` | low | The behavior is bounded and has nearby test coverage. |
| `parallelizability` | low | The UI and its tests form one small unit. |
| `security_sensitivity` | low | No authorization, secrets, or sensitive data flow changes. |
| `context_uncertainty` | low | The remote baseline and developer answers provide adequate context. |

Chat then applies the [routing rules](routing/rules.md) and returns a [Routing Recommendation](contracts/routing-recommendation.md). For example:

```yaml
phase: implementation
surface: codex
workflow: bounded_direct_execution
resources:
  - approved_handoff
  - repository-local tests
matched_rule: R012
developer_approval_required: false
rationale:
  - Intent is clear and the change is small and low-risk.
```

The recommendation is advisory. Check that its scope, exclusions, execution strategy, and invalidation conditions match what you intend.

## 4. Approve before Chat emits the handoff

If the profile and route are correct, reply explicitly:

```text
Approved. Produce the final Approved Handoff for Codex.
```

If they are not correct, revise the material decision in Chat first. Do not edit a generated artifact to hide an unresolved disagreement.

Chat now returns one complete, schema-conforming [Approved Handoff](contracts/approved-handoff.md). Its shape will include the approved goal, shared baseline, final Task Profile, routing, execution strategy, scope, exclusions, acceptance criteria, and readiness evidence:

```yaml
schema: approved_handoff
schema_version: "0.1"
status: ready_for_codex_preflight
goal: Add a status filter to the existing invoice list.
baseline:
  state: initialized
  github_remote_available: true
  local_repository_available: true
routing:
  codex_preflight:
    active: true
  implementation:
    owner: codex
scope:
  included:
    - Existing invoice-list status filter and nearby tests
  excluded:
    - Backend, URL persistence, and unrelated list redesign
readiness:
  intent_clear: pass
  developer_approval: true
```

This excerpt illustrates the contents; use the complete artifact Chat produces. `APPROVED_HANDOFF` means the intent is approved and ready for local comparison. It does **not** mean the repository is compatible.

## 5. Copy only the Approved Handoff into Codex

Open the local checkout corresponding to the shared baseline, start Codex there, and paste the entire Approved Handoff followed by:

```text
Execute this DevSwitchboard task from the Approved Handoff. Begin with Codex
Preflight against the current local repository. Treat the handoff as intent
truth, and stop if preflight finds an intent-versus-feasibility conflict.
```

The bridge is the structured Approved Handoff, not the Chat conversation history. You may include separately referenced approved artifacts when the handoff names them, but Codex should not need the earlier conversational transcript to reconstruct intent.

## 6. Expect Codex Preflight before implementation

Codex follows the [Codex workflow](workflows/codex.md). Before editing, it inspects the actual checkout, including local instructions, branch and revision, working-tree state, relevant files, available verification commands, and material differences from the declared baseline.

Codex then produces a distinct [Codex Preflight](contracts/codex-preflight.md), for example:

```yaml
schema: codex_preflight
schema_version: "0.1"
outcome: compatible
inspected_baseline: synced main at the declared remote revision
material_delta: false
adaptations: []
conflicts: []
next_action: Execute the approved bounded implementation path.
```

`CODEX_PREFLIGHT` is repository evidence. It does not replace or revise `APPROVED_HANDOFF` intent.

## 7. Act on the preflight outcome

Only three outcomes are valid:

| Outcome | What it means | What happens next |
| --- | --- | --- |
| `compatible` | The local repository supports the approved intent as written. | Codex enters the selected Superpowers execution path. |
| `compatible_with_adaptation` | Repository details such as filenames, component boundaries, or verification commands differ, but intent does not. | Codex records the bounded adaptations, then enters the selected path. |
| `blocked_by_conflict` | Safe implementation would require a material change to approved intent. | Codex stops, emits a Conflict Report, and waits for a developer decision. |

An unexpected filename is usually an adaptation. Discovering that the approved feature contradicts the product’s actual constraints may be a conflict. Missing general project context should have been resolved in Chat, not deferred to Codex.

For either compatible outcome, Codex uses the [Superpowers adapter](adapters/superpowers.md) selected by the handoff. It reuses adequate approved intent work, performs only the execution steps appropriate to the route, and always runs fresh verification before claiming completion.

## First-run boundary check

Before Codex implements, confirm:

- Chat established adequate context from the shared remote or developer-supplied material.
- All seven Task Profile dimensions have evidence.
- You resolved and approved material decisions.
- Chat produced one complete Approved Handoff.
- You copied that artifact, not conversation history, into Codex.
- Codex inspected the live checkout and produced a separate Codex Preflight.
- Implementation starts only after `compatible` or `compatible_with_adaptation`.

For full semantics and field definitions, follow the linked canonical documents; they remain authoritative over this walkthrough.
