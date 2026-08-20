# Re-route Required

Re-route Required is emitted when a material event invalidates an approved route or execution strategy. It records the trigger, affected assumptions, updated profile evidence, affected phases, recommended route, alternatives considered, and required developer approval.

Examples include discovering independent implementation units after single-agent execution was approved, a risk increase that requires deeper review, or new repository state that changes sequencing. Work MAY continue only on safe actions that do not presuppose the unapproved route.

Schema: [`re-route-required.schema.json`](../../schemas/re-route-required.schema.json).
