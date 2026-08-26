# Approved Handoff

The Approved Handoff is the Chat-to-Codex intent bridge. It carries the authoritative goal, approved scope and exclusions, acceptance criteria, final Task Profile, baseline expectations, context freshness, completed semantic gates, approved execution strategy, and readiness evidence.

`status: ready_for_codex_preflight` means intent is ready for local comparison; it does not claim repository compatibility. Codex MUST treat the artifact as intent truth, apply Semantic Gate Deduplication, and emit a [Codex Preflight](codex-preflight.md) before implementation planning.

A ready handoff carries affirmative developer-approved routing and strategy authority. `developer_decisions.routing_recommendation_approved` MUST be `true`, consistent with `workflow_state.developer_approval: true` and `readiness.developer_approval: true`; `false` cannot represent `ready_for_codex_preflight`. This approval does not establish local repository compatibility, which remains Codex Preflight's responsibility.

Approved Handoff `0.2` also requires the explicit Boolean `developer_decisions.chat_verify_commit_before_next_task`. Both `true` and `false` are valid Developer choices; omission is invalid and no default may be inferred. Historical `0.1` handoffs omit this v0.2-only field and reject it.

Approved Handoff `0.2` requires `upstream_preparation` in exactly one state:

- `prepared` transfers resolvable source artifacts, an approved approach summary, one or more logical work units, provisional sequencing assumptions, explicit local-grounding questions, and rationale;
- `not_needed` keeps all preparation-content fields empty or null and gives non-empty rationale showing why another preparation layer would add ceremony without material value.

Prepared source artifacts MUST resolve without conversation history. Repository-relative canonical files and commit-pinned GitHub blob or raw-file URLs are the supported deterministic shared-baseline forms. Display-name-only, missing local, arbitrary-host, branch-relative, and otherwise unpinned references are invalid for new v0.2 preparation sources.

`source_artifacts` are authoritative provenance and `approach_summary` is an approved transfer summary. Logical work units and sequencing assumptions remain provisional repository decomposition: Codex may reuse, split, merge, or adapt them when local evidence requires it. Preparation cannot expand or override the goal, approved scope, acceptance criteria, Developer decisions, approved strategy, or source authority. It never replaces Codex Preflight or claims local compatibility. Historical `0.1` handoffs omit this v0.2-only object and remain valid.

The verifier rejects positive preparation work for capability subjects explicitly named by `scope.excluded`, and rejects implementation- or review-subagent work when the corresponding approved-strategy flag is false. Negative statements that preserve an exclusion are not treated as work authorization. These deterministic checks supplement the closed contract shape and Developer review; they do not make preparation a new authority surface.

When the policy is `true`, Chat MUST withhold an Approved Handoff for a dependent next task until it has verified the predecessor as a stable remote commit whose fresh verification corresponds to the exact committed tree. The dependent handoff then records a completed or reused `predecessor_commit_verification` gate with `predecessor_task_id`, the exact 40-character `commit_sha`, and a resolvable `evidence_source`. When the policy is `false`, no mandatory predecessor commit-audit gate is created, though Chat may inspect a predecessor when a material event gives that inspection decision value. The policy never authorizes commit, push, merge, or publication.

Codex technical completion returns structured evidence to Chat for technical acceptance. Chat routes technical defects back to Codex and material intent, policy, authority, strategy, override, merge, or publication decisions to the Developer. The Developer remains final authority but is not required to inspect implementation diffs, source code, tests, verifier output, technical review findings, or technical remediation.

A handoff is not ready when authority contradicts itself, required evidence is absent, critical context is stale, readiness checks fail, or unresolved conflicts remain.

Schema: [`approved-handoff.schema.json`](../../schemas/approved-handoff.schema.json).
