# Canonical Examples

These examples show evidence-driven phase routing at three risk levels. Each file is validated against [`routing-case.schema.json`](../schemas/routing-case.schema.json) and contains a final Task Profile plus a Routing Recommendation.

- [`low-risk-doc-fix.json`](low-risk-doc-fix.json) demonstrates R012 direct execution.
- [`architectural-feature.json`](architectural-feature.json) demonstrates R006 architectural planning after approved design.
- [`security-sensitive-change.json`](security-sensitive-change.json) demonstrates R005 elevated review and verification.

The examples are JSON for dependency-free verification and are also valid YAML 1.2 documents.

The nine cross-surface and lifecycle fixtures (`devswitchboard-approved-handoff.json` through `verification-report.json`, plus `local-delta.json` and the linked Micro Consultation pair) complement the routing cases so every canonical bridge contract has a valid instance. These fixtures keep human contract text, schemas, and lifecycle examples synchronized.
