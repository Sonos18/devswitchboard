# Routing Recommendation

A Routing Recommendation proposes where and how the next incomplete phase should run. It records `phase`, `surface`, `workflow`, `resources`, the matched catalog rule, evidence-based rationale, whether developer approval is required, and conditions that invalidate the recommendation.

Allowed surfaces are `chat`, `codex`, and `developer`. The recommendation is advisory even when `developer_approval_required` is false: it authorizes no external or materially different action. An explicit developer decision outranks catalog defaults.

Consumers MUST re-evaluate the recommendation after an invalidation condition or material event. Strategy-changing results use [Re-route Required](re-route-required.md).

Schema: [`routing-recommendation.schema.json`](../../schemas/routing-recommendation.schema.json).
