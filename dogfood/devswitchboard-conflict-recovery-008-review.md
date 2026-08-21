# Dogfood #008 Dedicated Fresh-Context Review

## Initial result

The read-only fresh reviewer found one Critical and one Important workflow-integrity defect. The initial review did not pass.

### Critical: report provenance was an opt-in enforcement boundary

The verifier initially associated only same-task Work States that already named the exact Conflict Report. A later `active` state could omit the report and escape both the unresolved pause and approved-resume provenance checks.

Disposable adversarial copies proved both bypasses: a pending report plus a valid blocked checkpoint accepted a same-task Revision 3 active state omitting the report, and an approved resolution accepted an active state omitting both the report and approved handoff.

Remediation: treat every same-task Work State whose route revision is equal to or greater than the Conflict Report revision as subject to that lifecycle. Require every subject state to name the exact report, exempt only pre-conflict snapshots, and retain the historical exact-revision blocked checkpoint. Added rejected pending and approved omitted-provenance regressions.

### Important: next-action blocklist accepted mutating synonyms

The blocked next-action predicate recognized selected strategy verbs but accepted common mutations such as `build`, `ship`, `write`, `apply`, `test`, and `validate` after a developer-decision request.

The reviewer demonstrated that `Ask the developer to approve option A, then build and ship the change.` passed before remediation.

Remediation: use a fail-closed clause grammar. Every clause must return/present the Conflict Report, request or await a developer decision, or explicitly prohibit work. Expand positive strategy-work recognition across build, ship, edit, write, apply, patch, test, validate, deploy, publish, Git mutation, create/add/delete/remove, and run forms. Added rejected build/ship, write/apply, and test/validate regressions plus an accepted explicit-prohibition boundary case.

## Remediation evidence

- The two omitted-provenance regressions failed before the association fix and passed after it.
- The three mutating-synonym regressions failed before the action-grammar fix and passed after it.
- `node tests/verify-regressions.mjs` passed after both remediations.
- `node scripts/verify.mjs` passed every verification group after both remediations.
- No schema file or schema version changed.

## First focused re-review

The same reviewer confirmed the Critical association/provenance finding was resolved, pre-conflict snapshots remained valid, existing historical authority behavior passed, and all three enumerated mutation pairs were rejected. It found one remaining Important boundary defect: safe decision/report patterns matched substrings rather than whole clauses, so an unlisted synonym could be appended with plain `and`.

The reviewer demonstrated that `Ask the developer to approve option A and alter the implementation.` still passed. Equivalent `overwrite` and `refactor` paths shared the same root cause.

Remediation: anchor the canonical decision-request and report-return forms to the entire clause. Unknown or appended text now fails closed; explicit prohibitions remain a separate whole-clause form. Added three regressions for `and alter`, `and overwrite`, and `and refactor`. All three failed before the parser change and passed afterward.

## Second focused re-review

The reviewer confirmed the whole-clause decision and report-return forms rejected `alter`, `overwrite`, `refactor`, `redesign`, and `reorganize`, while canonical safe actions still passed. It found one remaining Important explicit-prohibition path: the broad `Do not ...` branch allowed an affirmative modal segment after plain `and`.

Two demonstrated bypasses appended `and you should refactor` or `and you should overwrite` after `Do not continue implementation`. Both passed before remediation.

Remediation: parse explicit prohibitions as coordinated work predicates. Every `and` or `or` segment must itself begin with a recognized strategy-work verb, affirmative modality and pivot transitions are rejected, and the full prohibition remains separate from the canonical report-return clause. Both reviewer-provided cases failed before this change and passed afterward.

## Third focused re-review

The reviewer confirmed affirmative modal segments were rejected and canonical single/coordinated prohibitions remained valid. It found one remaining Important punctuation pivot: a colon or em dash inside the prohibited clause could introduce an unrecognized positive imperative outside the negation's scope.

The demonstrated `Do not continue implementation: refactor ...` and `Do not continue implementation — overwrite ...` actions passed before remediation.

Remediation: anchor every coordinated prohibited segment to a recognized strategy-work predicate plus a constrained repository-work noun phrase. Arbitrary punctuation, unknown imperatives, modality, and trailing content no longer match the prohibition form. Both punctuation cases failed before this change and passed afterward.

## Final focused re-review

The same reviewer confirmed the colon and em-dash bypasses were rejected, canonical single and coordinated prohibitions passed, and additional parenthetical, slash, bare trailing-imperative, and contracted affirmative-pivot variants were rejected.

It also reconfirmed pending and approved provenance omissions fail, pre-conflict snapshots remain valid, historical approved snapshots remain valid after a later unique approval, and no schema file or schema version changed.

No valid Critical, Important, or Minor finding remains. The dedicated review passes after remediation.
