# DevSwitchboard

> Route the work. Keep the developer in control.

DevSwitchboard is developer-centric orchestration for AI coding workflows. It helps choose the right surface, workflow, and resources for each phase of development work while preserving the developer as final authority.

## v0.1 status

DevSwitchboard v0.1 is a manual-first, documentation-first methodology. Its recommendations are advisory, its routing is deterministic and inspectable, and its bridge artifacts make work resumable across Chat and Codex.

This repository deliberately contains no CLI, plugin, web application, or multi-provider integration.

## Quick start

1. **Profile** the current task using the evidence-backed, seven-dimension [Task Profile](docs/contracts/task-profile.md).
2. **Route** the next incomplete phase using the ordered [rule catalog](docs/routing/rules.md), then record a [Routing Recommendation](docs/contracts/routing-recommendation.md).
3. **Approve and execute** on the recommended surface. The developer approves material choices; structured bridge contracts carry state between surfaces.

```text
task → profile current evidence → route the next phase → developer approval
     → execute → review → fresh verification → developer handoff
```

Routing happens by phase. Chat normally owns requirement discovery, design, and specification. Codex normally owns local preflight, implementation planning, implementation, review, and verification. The developer owns consequential approvals and final acceptance.

New to the workflow? Follow [Your First DevSwitchboard Run](docs/getting-started.md) for a concrete journey from a raw requirement in ChatGPT Chat to Codex Preflight.

## Core contracts

- [Task Profile](docs/contracts/task-profile.md) — assesses the seven canonical routing dimensions.
- [Routing Recommendation](docs/contracts/routing-recommendation.md) — makes the selected phase route and its evidence explicit.
- [Approved Handoff](docs/contracts/approved-handoff.md) — carries approved intent from Chat to Codex.
- [Local Delta](docs/contracts/local-delta.md) — carries minimum task-relevant local divergence from Codex to Chat.
- [Micro Consultation](docs/contracts/micro-consultation.md) — exchanges one focused fact without transferring phase ownership.
- [Codex Preflight](docs/contracts/codex-preflight.md) — compares approved intent with the live workspace.
- [Conflict Report](docs/contracts/conflict-report.md) — stops work for an actual intent-versus-feasibility conflict.
- [Re-route Required](docs/contracts/re-route-required.md) — requests approval when a material event invalidates strategy.
- [Work State](docs/contracts/work-state.md) — preserves the next safe action for recovery.
- [Verification Report](docs/contracts/verification-report.md) — records fresh completion evidence.

Machine-readable definitions live in [`schemas/`](schemas/). Canonical scenarios live in [`examples/`](examples/).

## How the methodology fits together

- [Project North Star](docs/north-star.md) states the enduring project intent.
- [Approved v0.1 design](docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md) is the normative product and workflow intent.
- [Chat workflow](docs/workflows/chat.md) turns developer intent into an Approved Handoff.
- [Codex workflow](docs/workflows/codex.md) performs local preflight, planning, implementation, review, and verification.
- [Routing rules](docs/routing/rules.md) make phase-level recommendations deterministic.
- [Superpowers adapter](docs/adapters/superpowers.md) is the only v0.1 methodology adapter.
- [State and recovery](docs/state-and-recovery.md) defines safe pause and resume behavior.
- [Dogfood kit](dogfood/README.md) measures whether the methodology remains understandable, efficient, and developer-controlled.

## Design principles

- **Developer authority:** a recommendation is never authorization.
- **Manual first:** every workflow can be performed from the documented artifacts.
- **Advisory first:** consequential choices stay visible and reviewable.
- **Phase-level routing:** different phases may use different surfaces and resources.
- **Efficiency-balanced:** process grows with uncertainty and risk, while duplicate semantic gates are reused when their evidence remains valid.
- **Fresh completion evidence:** final verification is always rerun.

## Non-goals for v0.1

DevSwitchboard v0.1 does not automate enforcement, learn routing behavior, execute provider integrations, or remove developer approval. It establishes the public contracts and workflow foundation on which later, separately approved product work can build.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes to normative language or contracts. Governance and private vulnerability-reporting policies are intentionally deferred until working reporting channels are configured.

## License

DevSwitchboard is available under the [Apache License 2.0](LICENSE).
