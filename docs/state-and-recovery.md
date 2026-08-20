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

Work State MUST identify the task revision, current phase, authoritative specification and handoff, active Routing Recommendation, completed and reused gates, workspace state, verification state, blockers, and one concrete next safe action.

## Resume procedure

1. Confirm the authoritative artifacts and developer approvals.
2. Inspect the live workspace for a material delta.
3. Check whether route evidence and completed gates remain fresh.
4. Resume `next_safe_action` when authority, route, and evidence remain valid.
5. Emit Re-route Required when new evidence invalidates strategy but approved intent remains feasible.
6. Emit Conflict Report when safe adaptation cannot preserve intent.
7. Set `verification_failed` when implementation is viable but required checks fail.

## Material events

Material events include scope expansion, new security or regression evidence, an unexpected repository architecture, independent parallel units, missing required authority, failed acceptance criteria, or a change that invalidates verification. Editorial corrections that preserve contract semantics are not material events, but they still make final verification stale.

## Decision table

| Evidence | Result |
| --- | --- |
| Route valid; no material delta | Continue from Work State. |
| Route invalid; intent still feasible | Re-route Required and developer approval. |
| Intent cannot be preserved through safe adaptation | Conflict Report and stop. |
| Required check fails | Correct under the active route, then rerun fresh verification. |
