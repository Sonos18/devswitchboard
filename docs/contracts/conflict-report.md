# Conflict Report

A Conflict Report stops work when approved intent cannot be implemented safely or coherently in the live environment. It states the conflicting intent, feasibility evidence, impact, safe adaptations attempted, affected artifacts, and the exact developer decisions required.

Use this contract only for an actual intent-versus-feasibility conflict. Missing preference, ordinary implementation choice, route change, environment failure, or recoverable validation defect is not a conflict.

The canonical checkpoint identity is its repository-relative artifact path, `task_id`, and `revision`. A corresponding [Work State](work-state.md) MUST use the same task, name that exact artifact in `authoritative_artifacts`, use the checkpoint revision in `active_route`, and remain `blocked_by_conflict`. Every same-task Work State at or after that route revision MUST name the report; omission cannot bypass the gate. While no approved resolution exists, every such state remains blocked and each whole next-action clause must match a canonical developer intent-decision request, report return, or an anchored prohibition containing only coordinated recognized work predicates. Matching a safe prefix or adding a punctuation pivot does not authorize trailing text. Pre-conflict snapshots remain outside this lifecycle.

An Approved Handoff resolves the checkpoint only when it belongs to the same task, is not older than the report, has affirmative canonical approval/readiness, and records an approved `conflict_report` completed gate whose evidence source is the exact report path. Current highest approval MUST be unique. A resumed `active` or `complete` Work State names the applicable approved handoff as well as the historical report. The report and blocked checkpoint remain canonical history after resolution; their existence alone does not permanently block approved work.

Schema: [`conflict-report.schema.json`](../../schemas/conflict-report.schema.json).
