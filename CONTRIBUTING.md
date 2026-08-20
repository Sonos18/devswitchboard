# Contributing to DevSwitchboard

Thank you for helping improve developer-controlled AI workflow orchestration.

## Before proposing a change

1. Read the [approved v0.1 design](docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md).
2. Identify whether the change is editorial, contract-compatible, or intent-changing.
3. Open an issue before making an intent-changing proposal. Changes to the v0.1 thesis, scope, control model, phase routing, Task Profile dimensions, rule-based routing, bridge semantics, or supported adapters require explicit maintainer approval.

## Contribution workflow

1. Create a focused branch from `main`.
2. Keep each normative document responsible for one concern.
3. Preserve the canonical terminology in [`docs/contracts/`](docs/contracts/README.md).
4. When changing a schema, update its human contract, every affected canonical example, the dogfood kit, and the schema version when compatibility changes.
5. Run `node tests/verify-regressions.mjs`, `node scripts/verify.mjs`, `git diff --check`, and `git diff --cached --check`. The staged form is required for initial or newly added files.
6. Explain the developer impact, contract compatibility, verification evidence, and any migration in the pull request.

## Normative language

Use **MUST** for requirements, **SHOULD** for strong recommendations with legitimate exceptions, and **MAY** for optional behavior. Avoid introducing synonyms for canonical contract or field names.

## Review expectations

Reviewers check intent alignment, contract completeness, example-to-schema consistency, deterministic routing, developer authority, and fresh verification. A recommendation that increases automation must still preserve a manual path and explicit developer approval for material choices.

## Scope discipline

The v0.1 repository does not accept a CLI, plugin, web application, learned router, or multi-provider integration. Propose those as separately designed future work rather than hiding them inside methodology changes.
