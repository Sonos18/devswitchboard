# Dogfood Measurement Kit

DevSwitchboard dogfood records measure whether routing is understandable, avoids duplicate ceremony, preserves approved intent, and keeps the developer in control. They are not performance leaderboards.

## Using the kit

1. Copy [`measurement-template.json`](measurement-template.json) and assign a stable task ID and revision.
2. Record the authority artifacts and approved phase route before implementation.
3. Record only observable phase timings; omit unavailable timing rather than estimate it.
4. Distinguish semantic gates legitimately `reused` from gates unnecessarily `repeated`.
5. Record clarification loops, re-routes and triggers, verification failures, developer overrides, and qualitative observations.
6. Set `result: pass` only after fresh verification; final developer acceptance remains separate.

## Interpreting fields

- `phase_timings`: observed phase durations with their units and measurement boundaries.
- `clarification_loops`: extra intent round trips after an Approved Handoff.
- `re_routes`: material events and resulting strategy decisions.
- `verification_failures`: failed checks and recovery performed.
- `developer_overrides`: explicit choices that replaced a recommendation.
- `observations`: evidence about clarity, efficiency, handoff fidelity, and developer control.

Records validate against [`dogfood-record.schema.json`](../schemas/dogfood-record.schema.json). JSON is also valid YAML 1.2.

## Recorded runs

- [`devswitchboard-bootstrap-001.json`](devswitchboard-bootstrap-001.json) records the documentation-first repository bootstrap.
- [`devswitchboard-shared-baseline-002.json`](devswitchboard-shared-baseline-002.json) records the pre-publication review, remediation, environment gate, and eventual shared-baseline transition.
- [`devswitchboard-first-run-guide-003.json`](devswitchboard-first-run-guide-003.json) records the bounded first-run onboarding addition.
- [`devswitchboard-local-context-bridge-004.json`](devswitchboard-local-context-bridge-004.json) records the restorative local-context bridge implementation and mandatory Local Delta checkpoint.
- [`devswitchboard-bridge-artifact-guide-005.json`](devswitchboard-bridge-artifact-guide-005.json) records the bridge-artifact selection guide and the local-state Micro Consultation used to choose its execution strategy.
- [`devswitchboard-verification-recovery-006.json`](devswitchboard-verification-recovery-006.json) records a controlled required-check failure, diagnosis, correction, and fresh recovery verification; its resumable failure checkpoint is preserved as a [Work State](devswitchboard-verification-recovery-006-failure-work-state.json).
- [`devswitchboard-reroute-recovery-007.json`](devswitchboard-reroute-recovery-007.json) records a controlled material event that paused bounded execution at a validated [Re-route Required checkpoint](devswitchboard-reroute-recovery-007-re-route-required.json), then resumed through a provenance-linked developer-approved Revision 2 route for normative lifecycle enforcement.
- [`devswitchboard-conflict-recovery-008.json`](devswitchboard-conflict-recovery-008.json) records a bounded explanatory conflict aid, the controlled [Conflict Report checkpoint](devswitchboard-conflict-recovery-008-conflict-report.json), and resumption through a provenance-linked developer-approved Revision 2 for normative lifecycle enforcement.
- [`devswitchboard-irrelevant-local-divergence-009.json`](devswitchboard-irrelevant-local-divergence-009.json) records a controlled unrelated dirty-tree divergence that was classified irrelevant, continued without Local Delta or Chat interruption, and removed before bounded documentation implementation.
- [`devswitchboard-unknown-local-context-010.json`](devswitchboard-unknown-local-context-010.json) records a possibly material `UNKNOWN` local relation resolved by one focused [Micro Consultation request](devswitchboard-unknown-local-context-010-micro-consultation-request.json) and [response](devswitchboard-unknown-local-context-010-micro-consultation-response.json), with no relevant local-only truth and no Local Delta.
- [`devswitchboard-unknown-to-local-delta-011.json`](devswitchboard-unknown-to-local-delta-011.json) records an `UNKNOWN` local relation resolved by a focused [Micro Consultation](devswitchboard-unknown-to-local-delta-011-micro-consultation-response.json), followed by a separate minimum-disclosure [Local Delta](devswitchboard-unknown-to-local-delta-011-local-delta.json) that Chat used to confirm the current bounded route.
- [`devswitchboard-adaptive-readiness-012.json`](devswitchboard-adaptive-readiness-012.json) records a ready, low-risk bounded task that stopped context acquisition at `NO_MORE_CONTEXT_NEEDED`, avoided decision-free orchestration, and still ran fresh final verification.
- [`devswitchboard-decision-value-boundary-013.json`](devswitchboard-decision-value-boundary-013.json) records an almost-ready task whose one material `REMOTE` fact produced `MORE_CONTEXT_REQUIRED`, changed the candidate route before handoff approval, and then reached `NO_MORE_CONTEXT_NEEDED` under the developer-approved architectural strategy.
- [`devswitchboard-profile-refresh-without-reroute-014.json`](devswitchboard-profile-refresh-without-reroute-014.json) records an evidence-backed planning-time `parallelizability` refresh from `low` to `medium`, immediate Chat route evaluation, and `CONTINUE_CURRENT_ROUTE` without developer reapproval or Re-route Required because both the active route and approved strategy remained valid.
- [`devswitchboard-orchestration-value-boundary-015.json`](devswitchboard-orchestration-value-boundary-015.json) records technically eligible parallelism and bounded delegation that were not selected because their benefits did not materially exceed orchestration costs, while independently valuable fresh review and mandatory fresh final verification remained selected.
