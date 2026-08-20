# Micro Consultation

`MICRO_CONSULTATION` is a focused Chat/Codex fact exchange that answers one context question without transferring ownership of the active phase.

```text
Consultation != handoff
```

Approved Handoff remains the artifact that crosses the implementation boundary. Micro Consultation carries evidence, not approval, and does not replace Local Delta when a material task-relevant divergence must be summarized.

## Direction and ownership

```text
Chat <-> Codex
```

The request records `requester`, `responder`, and `phase_owner`. The response repeats those fields, and the verifier requires them to match the request. `phase_owner` remains unchanged throughout the exchange.

Chat normally requests Codex evidence only for a `LOCAL` fact. Codex may ask Chat to clarify an already-approved shared-baseline artifact, but neither side may use consultation to decide intent. `REMOTE` context remains a Chat/GitHub acquisition responsibility, and `INTENT` questions go to the developer.

## Request

A request identifies:

- a stable `consultation_id` and task revision;
- requester, responder, and unchanged phase owner;
- `consultation_type`;
- one `focused_question`;
- `why_it_matters`;
- non-empty `requested_evidence`; and
- an explicit `authority` boundary.

Every v0.1 Micro Consultation has:

```yaml
authority:
  may_change_intent: false
  may_transfer_phase_ownership: false
```

For `repository_fact`, Codex may report observed repository state and its factual implication. It MUST NOT choose product behavior or treat repository inference as developer intent.

## Response

A response links to the request using its `consultation_id` and request `revision`. It keeps four concepts separate:

| Field | Meaning |
| --- | --- |
| `finding` | The focused factual answer. |
| `evidence` | Non-empty observations supporting the finding. |
| `implication` | What the fact means for the active work, without changing intent. |
| `decision` | Always `none` in a fact-only v0.1 consultation. |

The response is invalid when task identity, consultation identity, parties, type, phase owner, or request revision does not match the canonical request.

## Selection guidance

Use Micro Consultation when one focused fact is missing. Use Local Delta when relevant local truth differs from the shared baseline and Chat needs a concise divergence assessment. A Local Delta may lead to a follow-up Micro Consultation, but neither artifact transfers the phase or grants authority.

## Validation

Requests use [`micro-consultation-request.schema.json`](../../schemas/micro-consultation-request.schema.json); responses use [`micro-consultation-response.schema.json`](../../schemas/micro-consultation-response.schema.json). Canonical examples live in [`examples/micro-consultation-request.json`](../../examples/micro-consultation-request.json) and [`examples/micro-consultation-response.json`](../../examples/micro-consultation-response.json).
