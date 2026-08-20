# Chat Workflow

Chat owns intent-facing work. Its output is an approved, testable handoff—not a claim about local repository compatibility.

## Entry

Start here when material requirements, trade-offs, scope, or developer preferences remain unresolved. Existing approved evidence is accepted through Semantic Gate Deduplication when it is adequate, fresh, and unaffected by a material delta.

## Flow

1. **Discover requirements.** Resolve intended outcome, users, constraints, exclusions, acceptance criteria, and developer authority. Keep `requirement_ambiguity` evidence current.
2. **Profile the task.** Complete all seven Task Profile dimensions. A level without concrete evidence is invalid.
3. **Design.** Compare materially different approaches, make trade-offs visible, and obtain developer approval. Do not reopen an adequately approved design without new evidence.
4. **Specify.** Persist stable terminology, interfaces, scope, failure behavior, and testable acceptance criteria.
5. **Recommend execution strategy.** Apply the ordered rule catalog per phase. State surfaces, workflow resources, orchestration level, isolation, review, invalidation conditions, and required approvals.
6. **Deduplicate semantic gates.** For every planned gate, record `passed`, `approved`, or `reused` with an evidence source. Tool labels do not create new semantic gates.
7. **Evaluate readiness.** Intent must be clear, material decisions resolved, scope bounded, acceptance testable, context adequate, conflicts absent, and developer approval explicit.
8. **Emit Approved Handoff.** Set `status: ready_for_codex_preflight`. Include the expected repository baseline; `uninitialized` is valid.

## Stop conditions

Chat waits for the developer when a consequential preference is missing, alternatives change approved scope, authority is contradictory, or developer approval is required. It emits Conflict Report only when intent itself is irreconcilable with known feasibility—not merely because more discussion would be useful.

## Exit

The next surface is Codex for local preflight. Chat MUST NOT label a handoff repository-compatible; only Codex can inspect the live environment and produce Codex Preflight.
