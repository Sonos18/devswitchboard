# State and Recovery

DevSwitchboard treats interruption as normal. Work State carries everything a fresh operator needs to resume safely without reconstructing hidden conversation.

## Lifecycle

| State | Meaning | Allowed next move |
| --- | --- | --- |
| `ready` | Approved intent is ready for its next surface. | Perform the recorded phase gate. |
| `active` | Approved work is in progress. | Continue the recorded next safe action. |
| `waiting_for_developer` | A decision or approval is required. | Read-only evidence gathering or developer response. |
| `blocked_by_conflict` | Intent and feasibility materially conflict. | Resolve Conflict Report; no strategy-dependent mutation. |
| `verification_failed` | A required check failed. | Diagnose, correct, and rerun all affected fresh checks. |
| `complete` | Required checks pass and the package is ready for developer review. | Developer acceptance or a new revision. |

## Minimum resumable state

Work State MUST identify the task revision, current phase, authoritative specification and handoff, active Routing Recommendation, completed and reused gates, workspace state, verification state, blockers, and one concrete next safe action. When recovery depends on local-only evidence, it also identifies the applicable Local Delta or linked Micro Consultation without copying conversation history.

## Repository baseline

Baseline state and task relevance determine whether a local bridge is needed. Structured records serialize these states in lowercase.

| State | Meaning | Local-context behavior |
| --- | --- | --- |
| `UNINITIALIZED` | No shared GitHub baseline exists. | Verify the declared empty/local state; record absent remote and SHA explicitly when a Local Delta is needed. |
| `SYNCED` | Local HEAD and the shared remote revision agree. | The remote can serve as the shared baseline. |
| `DIVERGED` | Local truth differs from the shared baseline. | Emit Local Delta only when the difference is relevant to the active task. |
| `UNKNOWN` | Local relation to the baseline is not established. | If local state could materially affect the task, request focused local evidence before continuing. |

A dirty working tree is evidence of divergence, not evidence of task relevance. Irrelevant local changes do not force a Local Delta.

## Resume procedure

1. Confirm the authoritative artifacts and developer approvals.
2. Inspect the live workspace for a material delta.
3. Classify missing context as `REMOTE`, `LOCAL`, or `INTENT`; acquire it from Chat/GitHub, Codex, or the developer respectively.
4. Check whether route evidence and completed gates remain fresh.
5. Resume `next_safe_action` when authority, route, and evidence remain valid.
6. Emit Re-route Required when new evidence invalidates strategy but approved intent remains feasible.
7. Emit Conflict Report when safe adaptation cannot preserve intent.
8. Set `verification_failed` when implementation is viable but required checks fail.

## Material events

Material events include scope expansion, new security or regression evidence, an unexpected repository architecture, independent parallel units, missing required authority, failed acceptance criteria, or a change that invalidates verification. Editorial corrections that preserve contract semantics are not material events, but they still make final verification stale.

## Decision table

| Evidence | Result |
| --- | --- |
| Route valid; no material delta | Continue from Work State. |
| `DIVERGED`; changes irrelevant to task | Continue without Local Delta and retain concise relevance evidence. |
| `DIVERGED`; changes relevant to task | Emit Local Delta and route it to Chat for freshness and material-event evaluation. |
| `UNKNOWN`; local state could be material | Request focused local evidence through Micro Consultation. |
| Route invalid; intent still feasible | Re-route Required and developer approval. |
| Intent cannot be preserved through safe adaptation | Conflict Report and stop. |
| Required check fails | Correct under the active route, then rerun fresh verification. |
