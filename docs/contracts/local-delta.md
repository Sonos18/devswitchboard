# Local Delta

`LOCAL_DELTA` is a Codex-to-Chat bridge for the minimum task-relevant local facts that the shared GitHub baseline cannot show. It lets Chat refresh routing and design assumptions without receiving implementation ownership or reconstructing Codex conversation history.

## Direction and authority

```text
Codex -> Chat
```

Codex is authoritative for observed local repository facts. Chat uses those facts in its intent-facing reasoning. Local Delta does not authorize an intent change, transfer the current phase, replace Approved Handoff, or make Codex a design authority.

## When it is required

Baseline state and relevance are evaluated together:

| Baseline state | Task relevance | Behavior |
| --- | --- | --- |
| `synced` | none | The remote is the shared baseline; no Local Delta is needed. |
| `diverged` | false | Do not emit a Local Delta merely because the tree is dirty. |
| `diverged` | true | Emit a focused Local Delta. |
| `unknown` | could be material | Request focused local evidence; emit a Local Delta if divergence is established. |
| `uninitialized` | material local truth exists | Record the absent remote/baseline explicitly and carry only relevant evidence. |

Changed-file entries require evidence whether the file is relevant or irrelevant. Evidence for an irrelevant file explains why it is excluded from task reasoning; evidence for a relevant file explains its task relationship.

## Required content

| Field | Meaning |
| --- | --- |
| `task_id`, `revision`, `status` | Identity and handoff readiness of this record. |
| `repository` | Shared remote identity, branch, and baseline SHA; remote and SHA may be `null` only when no shared baseline exists. |
| `local` | Local HEAD, working-tree condition, and baseline state. |
| `relevance` | Overall task relevance, confidence, and non-empty supporting evidence. |
| `changed_files` | Minimal file inventory with change type, relevance, and non-empty per-file evidence. |
| `summary` | Concise statement of what differs locally. |
| `implications` | Consequences for assumptions, route, design, or remaining work. |
| `evidence` | Focused observations or check results supporting the record. |

The record should answer:

- What remote baseline was inspected?
- What is the local HEAD and working-tree state?
- Which local differences matter to the active task, and why?
- Do the facts invalidate any approved routing or design assumption?
- What work remains unfinished?

## Minimum disclosure

A Local Delta MUST NOT default to transmitting:

- full source files;
- a full Git diff;
- full terminal logs;
- unrelated dirty files; or
- conversation history.

Use paths, concise findings, and the smallest evidence that lets Chat evaluate freshness and material events. A consumer may request a separate Micro Consultation when one focused local fact needs clarification.

## Validation

Canonical records use `schema: local_delta`, `schema_version: "0.1"`, and [`local-delta.schema.json`](../../schemas/local-delta.schema.json). The canonical example is [`examples/local-delta.json`](../../examples/local-delta.json).

The verifier binds the record kind to that schema. Missing relevance evidence, empty changed-file evidence, unknown fields, and permissive-schema selection are invalid.
