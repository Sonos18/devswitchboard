# Conflict Report

A Conflict Report stops work when approved intent cannot be implemented safely or coherently in the live environment. It states the conflicting intent, feasibility evidence, impact, safe adaptations attempted, affected artifacts, and the exact developer decisions required.

Use this contract only for an actual intent-versus-feasibility conflict. Missing preference, ordinary implementation choice, or a recoverable validation defect is not a conflict. While `status` is `waiting_for_developer`, the next action MUST be non-mutating or absent.

Schema: [`conflict-report.schema.json`](../../schemas/conflict-report.schema.json).
