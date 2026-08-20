# Local Context Bridge Restoration Specification

**Task:** `devswitchboard-local-context-bridge-004`
**Revision:** 1
**Authority:** DevSwitchboard Dogfood #004 Approved Handoff
**Status:** Approved restorative intent

## 1. Purpose

Restore the approved v0.1 local-context bridge semantics that were incompletely persisted in the public repository. This is a compatible clarification of the approved design, not a redesign.

The two canonical bridge primitives are:

- `LOCAL_DELTA`: Codex to Chat evidence describing the minimum task-relevant local facts unavailable from the shared GitHub baseline.
- `MICRO_CONSULTATION`: a focused Chat/Codex fact exchange that does not transfer phase ownership.

## 2. Authority and Boundaries

The developer remains final authority for intent. Chat remains the intent-facing owner. Codex remains the source of implementation truth for the live local repository.

These invariants are normative:

- Consultation is not a handoff and does not transfer phase ownership.
- `LOCAL_DELTA` carries facts and implications, not design or intent authority.
- Approved Handoff remains the implementation-boundary artifact.
- Codex must not infer intent decisions from repository facts alone.
- v0.1 remains manual-first and must not add CLI, Skill, plugin, MCP, transfer automation, another adapter, learned routing, or a new runtime.

## 3. Local Delta

`LOCAL_DELTA` travels from Codex to Chat. It communicates only task-relevant local divergence that a remote GitHub baseline cannot show. It must enable Chat to determine what differs locally, why the difference matters to the task, and whether it invalidates routing or design assumptions.

A Local Delta records:

- task identity, revision, and status;
- remote identity, branch, and baseline SHA;
- local HEAD and working-tree state;
- explicit relevance and confidence;
- changed files with per-file relevance evidence;
- a concise summary, implications, and supporting evidence.

It must not default to full source files, full diffs, full terminal logs, unrelated dirty files, or conversation history. Dirty state alone does not require a Local Delta; task relevance does.

## 4. Micro Consultation

`MICRO_CONSULTATION` travels between Chat and Codex as a linked request and response. A request identifies requester, responder, consultation type, one focused question, why the answer matters, requested evidence, and the authority boundary.

For repository-fact consultation, `authority.may_change_intent` is `false`. The response keeps finding, evidence, implication, and decision distinct. A fact-only response records `decision: none`. Neither request nor response grants Codex design authority.

## 5. Missing Context Classification

Missing context is classified by source before selecting a surface:

| Source | Acquisition owner | Required behavior |
| --- | --- | --- |
| `REMOTE` | Chat through GitHub/shared baseline | Acquire more remote-retrievable context without using Codex as a fallback. |
| `LOCAL` | Codex | Request focused evidence through Micro Consultation and, when task-relevant divergence exists, Local Delta. |
| `INTENT` | Developer | Obtain an explicit developer decision; repository inference is insufficient. |

Context depth and context source are independent. Depth describes how much information is required; source describes where it comes from. High depth does not itself require Codex, and a single low-depth fact can require Codex when it is local-only.

## 6. Baseline and Relevance Semantics

The bridge remains compatible with `UNINITIALIZED`, `SYNCED`, `DIVERGED`, and `UNKNOWN`:

- `SYNCED`: the remote can serve as the shared baseline.
- `DIVERGED` with irrelevant local changes: Local Delta is not required.
- `DIVERGED` with task-relevant local changes: Local Delta is required.
- `UNKNOWN` where local state could materially affect the task: focused local consultation is required.
- `UNINITIALIZED`: no shared remote baseline exists; the declared empty state remains valid when verified.

## 7. Validation Requirements

Human contracts, Draft 2020-12 schemas, canonical examples, workflows, routing rules, state guidance, verifier behavior, regression coverage, and dogfood evidence must remain consistent.

Regression coverage must reject:

- Local Delta records missing relevance evidence;
- claims that unrelated changes are task-relevant without per-file evidence;
- repository-fact consultations that authorize intent changes;
- malformed consultation response linkage; and
- unknown or unapproved contract-selection bypasses.

## 8. Mandatory Dogfood Checkpoint

Implementation must pause after the `LOCAL_DELTA` human contract, schema, canonical example, validation mapping, and focused regression coverage work, once the isolated workspace materially differs from remote main.

Codex must then create and validate a real Local Delta for this task. It must identify the approved remote baseline, actual local HEAD and working-tree state, relevant changed files, restored semantics, unfinished work, and whether the local facts invalidate the approved route.

After validation, work state is:

```yaml
phase: implementation
state: READY_FOR_HANDOFF
next_owner: chat
handoff_reason: local_delta_checkpoint
```

Codex stops at that point. It does not finish Micro Consultation integration, run final completion review, merge, or push until an approved continuation is returned.
