# Task Profile

The Task Profile describes current routing evidence. A final profile contains exactly seven dimensions: `requirement_ambiguity`, `scope_complexity`, `repository_dependency`, `regression_risk`, `parallelizability`, `security_sensitivity`, and `context_uncertainty`.

Each dimension has a `level` of `low`, `medium`, or `high` plus one or more concrete `evidence` statements. Levels without evidence are invalid. `profile_status` is `draft` while material evidence remains unresolved and `final` when it is adequate for routing.

`context_uncertainty` measures how incomplete, stale, or contradictory the available context is. It does not identify where missing context comes from. Context Source is classified separately as `REMOTE`, `LOCAL`, or `INTENT`: Chat acquires shared-baseline facts, Codex reports local-only facts, and the developer decides intent. A high level does not automatically route consultation to Codex, while one low-depth fact may still require Codex when it exists only locally.

Profiles are phase-sensitive snapshots. New local evidence MAY change a level, but a tool MUST NOT revise an approved profile merely to justify a preferred route. A changed profile records a higher task revision and, when it invalidates approved strategy, triggers [Re-route Required](re-route-required.md).

Schema: [`task-profile.schema.json`](../../schemas/task-profile.schema.json).
