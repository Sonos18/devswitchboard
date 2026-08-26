# Verification Report

A Verification Report maps fresh checks to acceptance criteria. Each check names the criterion, command or inspection method, result, and evidence. Overall status is `pass` only when every required check passes; otherwise it is `fail`.

Final verification MUST run after the last content change. It cannot be reused through Semantic Gate Deduplication. A passing report supports Chat technical acceptance but does not itself accept the task or exercise Developer-owned authority.

Codex supplies the report with its structured completion evidence. Chat evaluates technical conformance and routes technical defects back to Codex. Material intent, policy, authority, strategy, override, merge, or publication decisions go through Chat to the Developer. `developer_acceptance_required: true` preserves Developer final authority; it does not require the Developer to personally inspect code, diffs, tests, verifier output, technical findings, or technical remediation.

Deterministic verifier checks supplement Chat semantic audit and Developer intent approval. They do not substitute for either layer and do not turn Developer final authority into a personal technical-QA requirement.

Schema: [`verification-report.schema.json`](../../schemas/verification-report.schema.json).
