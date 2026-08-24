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

## Which bridge artifact should I use?

Choose the artifact based on what needs to cross the Chat/Codex boundary:

| Situation | Artifact | Direction | What crosses the boundary |
| --- | --- | --- | --- |
| Chat has approved the intent and implementation may begin after a local compatibility check. | [Approved Handoff](contracts/approved-handoff.md) | Chat → Codex | Developer-approved intent, authorization, scope, and execution constraints. |
| Task-relevant local implementation truth differs from the shared baseline and Chat must refresh its assumptions. | [Local Delta](contracts/local-delta.md) | Codex → Chat | The minimum relevant local facts, evidence, and implications. It does not authorize intent changes. |
| One focused local fact is missing and the current phase owner should remain unchanged. | [Micro Consultation](contracts/micro-consultation.md) | Chat ↔ Codex | A focused question and evidence-based response. Consultation is not a handoff; for a fact-only consultation, `decision: none`. |

In short: use an Approved Handoff to cross from approved intent into implementation, a Local Delta to refresh Chat when task-relevant local work has diverged, and a Micro Consultation to answer one focused local question without transferring phase ownership.

For example, Dogfood #004 used a Local Delta after its local implementation had materially diverged from the shared baseline. Dogfood #005 used a Micro Consultation because Chat needed only one fact: whether local `main` was clean and synchronized. The examples differ, but the general rule is the same: divergence calls for a relevant delta; a focused information gap calls for a consultation.

Remote-retrievable facts remain with Chat and GitHub, while intent and business decisions remain with the developer. Codex supplies local implementation truth; it is not a generic fallback for missing context. The normative [Chat workflow](workflows/chat.md) and [Codex workflow](workflows/codex.md) define how these artifacts fit into phase ownership.

### Dirty does not mean relevant

A dirty working tree proves only that local state differs from the shared baseline. It does not prove that the difference matters to the active task. For example, an unrelated scratch note from another experiment can make the workspace `DIVERGED`; if the approved task does not read, modify, or depend on that note, continue without sending it to Chat.

| Local condition | Task relevance | Action |
| --- | --- | --- |
| `SYNCED` | — | Use the shared remote baseline. |
| `DIVERGED` | Irrelevant | Continue the approved route; do not emit Local Delta. |
| `DIVERGED` | Relevant, and Chat needs the local truth | Emit a focused [Local Delta](contracts/local-delta.md). |
| `UNKNOWN` and possibly material | Unresolved | Acquire focused local evidence through [Micro Consultation](contracts/micro-consultation.md); emit Local Delta only if relevant divergence is established and a cross-surface refresh is needed. |

Local Delta is a decision-value bridge, not a mandatory dirty-tree report. Do not create one with `relevant_to_task: false` merely to document unrelated dirtiness. This rule does not mean relevant implementation changes never need a Local Delta: use one when Chat must reason about material local truth that the shared baseline cannot show.

### Resolve a possibly material `UNKNOWN` with one focused question

Do not guess that an unknown local relation is either safe or divergent. If the missing fact could affect the task, keep the phase with its current owner and ask only for the evidence needed to resolve it.

For Dogfood #010, Chat already understood the shared remote baseline but did not know whether a preserved worktree contained local-only changes to this guide. Chat sent one [Micro Consultation request](../dogfood/devswitchboard-unknown-local-context-010-micro-consultation-request.json) asking Codex to inspect only the target document. The [response](../dogfood/devswitchboard-unknown-local-context-010-micro-consultation-response.json) established that every target-file checkout was clean: some worktrees were merely historical branches behind the baseline, and none contained material local-only truth.

The result was:

```text
UNKNOWN and possibly material
  → one focused MICRO_CONSULTATION
  → relevant local-only truth: none
  → decision: none; phase owner: Chat
  → no LOCAL_DELTA
  → continue the approved bounded route
```

No Local Delta followed because there was no relevant divergence to communicate. The consultation acquired a fact; it did not transfer ownership, authorize implementation, or choose the route. If the same focused check had found task-relevant local truth that Chat needed, Codex could then provide a Local Delta for that separate cross-surface refresh.

### When the focused answer establishes relevant divergence

Approved implementation can create local truth that Chat cannot observe from the handoff or the shared baseline. Suppose Codex has begun an approved guide edit and Chat later needs to confirm that the bounded route still fits the work. Until Codex reports evidence, Chat should treat the local relation as `UNKNOWN`; intended or attempted implementation is not observed repository truth.

Chat can first use a [Micro Consultation](contracts/micro-consultation.md) to ask one factual question: has the target document actually diverged from the shared baseline, and is that divergence relevant to the active task? If Codex establishes both facts, the response still keeps the phase owner unchanged and records `decision: none`. It establishes `DIVERGED` and relevant; it does not turn the consultation into a Local Delta or authorize a route decision.

If Chat now needs the established local truth to evaluate the approved route, Codex sends a separate [Local Delta](contracts/local-delta.md) containing only the task-relevant baseline, local state, changed paths, summary, implications, and evidence. Do not substitute a full diff, terminal transcript, or unrelated workspace detail.

```text
UNKNOWN and possibly material
  → focused MICRO_CONSULTATION
  → actual local state: DIVERGED and relevant
  → decision: none; phase owner unchanged
  → Chat needs the established local truth
  → separate, focused LOCAL_DELTA
  → Chat confirms the route, requests re-routing, or surfaces a conflict
```

The two artifacts answer different questions. The consultation establishes whether the material local fact exists; the Local Delta carries the minimum established fact set needed for cross-surface reasoning. Neither artifact silently changes approved intent or execution strategy.

### Stop acquiring context when it cannot change the decision

Context acquisition is complete when the readiness questions are answered and more evidence would only increase confidence without changing scope, acceptance, risk, feasibility, or the approved route. At that point, record `NO_MORE_CONTEXT_NEEDED` and execute the selected path. Do not ask another clarification question or create a Micro Consultation or Local Delta merely because more context is available.

| Evidence situation | Action |
| --- | --- |
| A missing fact could change scope, acceptance, risk, feasibility, or routing. | Acquire that specific fact from its authoritative source. |
| Readiness is satisfied and extra context would not change a material decision. | Stop acquiring context and continue the approved route. |
| New evidence invalidates an assumption after execution begins. | Classify the material event and recover, re-route, or report a conflict as appropriate. |

For example, a bounded edit to this onboarding guide can proceed directly when the exact shared baseline is synced, the requested wording and acceptance criteria are explicit, and the existing guidance already establishes the relevant semantics. Asking Chat for another design comparison or asking Codex for unrelated local facts would add confidence but no decision value. The efficient path is therefore:

```text
readiness satisfied
  -> no decision-changing uncertainty
  -> NO_MORE_CONTEXT_NEEDED
  -> bounded direct execution
  -> fresh verification still required
```

Stopping context acquisition does not weaken the completion gate. Fresh verification remains mandatory after the final change. The normative [Chat readiness flow](workflows/chat.md) and low-risk direct-execution rule [R012](routing/rules.md#r012--low-risk-direct-execution) remain authoritative.

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

Replace the example URL and branch with your project. For a private repository, provide Chat with authorized access or attach the relevant repository context. When context is missing, classify its source: Chat acquires `REMOTE` facts from GitHub, a focused [Micro Consultation](contracts/micro-consultation.md) asks Codex for a `LOCAL` fact, and the developer answers `INTENT` questions. Codex is not a fallback for general context acquisition.

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

An unexpected filename is usually an adaptation. Discovering that the approved feature contradicts the product’s actual constraints may be a conflict. Missing general project context should have been resolved in Chat; only focused local-only facts belong in Codex consultation. If task-relevant local truth differs from the shared baseline, Codex returns a [Local Delta](contracts/local-delta.md) so Chat can refresh its assumptions without transferring implementation ownership.

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
