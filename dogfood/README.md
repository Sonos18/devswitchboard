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
