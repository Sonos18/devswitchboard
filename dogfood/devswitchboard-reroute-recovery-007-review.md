# Dogfood #007 Dedicated Fresh-Context Review

## Initial result

The read-only reviewer found one Critical and three Important issues. No Minor issues were reported. The initial review did not pass.

### Critical: later-route state evaded checkpoint enforcement

The verifier associated only Work States whose route revision exactly equaled the checkpoint revision. A same-task active Revision 3 state could therefore name a pending Revision 2 checkpoint and continue without approval; the same mismatch also bypassed resumed-state provenance checks.

Remediation: associate every same-task Work State that names the checkpoint path, retain an exact-revision checkpoint state requirement while pending, and enforce pending or approved-resumption semantics across all associated snapshots. Added rejected Revision 3 pending-continuation and missing-provenance regressions.

### Important: newer approval invalidated historical approved state

The verifier applied the globally highest replacement to every active historical snapshot. A valid Revision 2 state became invalid merely because Revision 3 was later approved.

Remediation: validate each active or complete snapshot against the unique highest qualifying Approved Handoff whose revision does not exceed that state's route revision, while retaining global highest-revision ambiguity rejection. Added a passing two-handoff/two-state history regression.

### Important: next-action polarity was unsafe

The keyword predicate accepted "request approval, then start coding" and rejected "do not continue implementation; return ... for approval."

Remediation: split actions into clauses, recognize coding as strategy work, and treat only explicitly negated strategy clauses as prohibitions. Added both exact strings as regressions.

### Important: conflict wording had false positive and false negative paths

The detector rejected a feasible statement containing "no evidence says approved intent cannot be preserved safely" but accepted "safe implementation cannot preserve approved intent."

Remediation: prioritize the structured infeasibility marker, recognize both affirmative subject orderings, and exclude explicit negation or hypothetical prefixes. Added both exact strings as regressions.

## Remediation evidence

- `node tests/verify-regressions.mjs` — PASS after all four remediations.
- `node scripts/verify.mjs` — PASS for every verification group after all four remediations.
- No schema version or contract shape changed.

## Re-review

The first re-review confirmed that the original Critical and three Important findings were resolved, then found one remaining Important mixed-polarity bypass: a negated first strategy verb hid a later positive implementation directive in the same clause.

Remediation: evaluate every strategy verb in each clause instead of only the first match. Added the exact rejected regression: "Do not continue the old route and instead implement the replacement; request developer approval."

The next re-review found that prohibition did not propagate across adjacent coordinated verbs, incorrectly rejecting "Do not implement or execute the replacement; request developer approval."

Remediation: carry prohibition polarity only across an adjacent plain `and` or `or` connector. It does not cross intervening text or `and instead`, so the mixed positive directive remains rejected. Added the exact coordinated-prohibition sentence as an accepted regression.

Final fresh-context confirmation found no remaining Critical or Important issues. The reviewer independently confirmed both polarity boundary cases, every earlier adversarial case, the full regression suite, the repository verifier, and Git whitespace checks. The implementation is ready for final verification.
