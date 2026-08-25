# Routing Recommendation

A Routing Recommendation proposes where and how the next incomplete phase should run. It records `phase`, `surface`, `workflow`, selected `resources`, the matched catalog rule, evidence-based rationale, whether developer approval is required, and conditions that invalidate the recommendation.

Optional-resource eligibility and resource selection are separate decisions. For each optional candidate considered, the rationale records concrete eligibility evidence, expected execution, decision, or confidence value, material coordination, context-transfer, and integration costs, and any missing fact that could change the decision. The recommendation selects the resource only when its expected value materially exceeds those costs; it does not invent numeric estimates. When eligible choices are effectively tied, no decision-changing fact remains, and confidence and risk requirements are satisfied, `resources` records the lower-orchestration choice. Mandatory confidence work, including fresh final verification, is not subject to this optional-resource value gate.

Allowed surfaces are `chat`, `codex`, and `developer`. The recommendation is advisory even when `developer_approval_required` is false: it authorizes no external or materially different action. An explicit developer decision outranks catalog defaults.

Consumers MUST re-evaluate the recommendation after an invalidation condition or material event. Strategy-changing results use [Re-route Required](re-route-required.md).

Schema: [`routing-recommendation.schema.json`](../../schemas/routing-recommendation.schema.json).
