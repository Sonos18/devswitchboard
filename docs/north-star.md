# DevSwitchboard North Star

DevSwitchboard minimizes expensive Codex usage by moving reasoning and preparation that do not require local repository truth to ChatGPT Web/Desktop. Codex is reserved for work where local repository access, execution, review, debugging, adaptation, or fresh verification materially adds value.

The cost rule is simple: do not spend Codex usage on work that does not need Codex. This optimizes usage, not quality or confidence at all costs; mandatory confidence work remains mandatory.

ChatGPT Web/Desktop owns the **what** and **why**: requirements, intent clarification, design, shared or remote context, specifications, acceptance criteria, and upstream preparation. Codex owns the **how** against repository truth: local-only facts, preflight, repository grounding, implementation, debugging, review, and fresh verification. The Developer is the final authority; recommendations are never authorization.

Operate with the smallest sufficient approved context. Reuse semantic gates when their evidence remains valid, stop adding context or orchestration when it no longer changes a decision, and choose lower orchestration on effective ties. Preserve recovery through durable artifacts, and always run fresh final verification.

Future work should normally demonstrate at least one of these outcomes:

- reduces unnecessary Codex usage;
- reduces repeated reasoning, context transfer, round trips, or orchestration;
- improves routing value; or
- improves necessary confidence or recoverability at justified cost.

CLI, plugin, web UI, multi-provider, runtime automation, and additional agents are not goals themselves. They require evidence that they advance this North Star. This is not a roadmap.

Each version is evaluated under this North Star and should define only its version-specific delta. A North Star change is a project-intent change and requires explicit Developer approval; version changes do not automatically version this artifact.
