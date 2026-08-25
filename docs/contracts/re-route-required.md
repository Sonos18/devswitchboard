# Re-route Required

Re-route Required is emitted when a material event invalidates an approved route or execution strategy. It records the trigger, affected assumptions, updated profile evidence, affected phases, recommended route, alternatives considered, and required developer approval.

Examples include discovering independent implementation units when adopting parallel resources would change the approved single-agent route or execution strategy, a risk increase that requires deeper review, or new repository state that changes sequencing. A profile revision or level change that leaves the approved route and strategy valid is not a Re-route Required trigger. Work MAY continue only on safe actions that do not presuppose the unapproved route.

## Pending and superseded checkpoints

A checkpoint's paused Work State has the same `task_id`, the checkpoint revision in `active_route.revision`, and the exact repository-relative checkpoint path in `authoritative_artifacts`. Any later Work State with the same task that names that path also remains associated with the checkpoint. While no replacement route is approved, every associated Work State MUST use `waiting_for_developer`, MUST NOT claim completion, and MUST name an approval-oriented next safe action rather than strategy-dependent work. Explicit prohibitions such as "do not continue implementation" are safe; an instruction to request approval and then start coding is not.

A later Approved Handoff supersedes the pending gate only when it:

- has the same `task_id` and a revision at least as high as the checkpoint;
- contains affirmative developer approval and readiness evidence; and
- records an approved `re_route_required` completed gate whose `evidence_source` is the exact checkpoint path.

If more than one qualifying replacement has the same highest revision, current authority is ambiguous and execution remains invalid. After approval, each active or complete associated Work State MUST reference the unique highest qualifying Approved Handoff whose revision is not greater than that state's route revision. This preserves the authority that applied to each historical snapshot while allowing a newer uniquely approved route to govern later state. The Re-route Required artifact remains historical evidence; its existence alone does not block resumed work forever.

Re-route Required is not a substitute for Conflict Report. If evidence says approved intent is infeasible or cannot be preserved safely, use [Conflict Report](conflict-report.md) semantics instead of encoding an ordinary re-route.

Schema: [`re-route-required.schema.json`](../../schemas/re-route-required.schema.json).
