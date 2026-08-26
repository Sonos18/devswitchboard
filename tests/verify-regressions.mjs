import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function copyRepository() {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "devswitchboard-regression-"));
  const copyRoot = path.join(temporaryRoot, "repo");
  fs.cpSync(root, copyRoot, {
    recursive: true,
    filter: (source) => ![".git", "node_modules"].includes(path.basename(source))
  });
  return { temporaryRoot, copyRoot };
}

function runVerifier(copyRoot) {
  return spawnSync(process.execPath, [path.join(copyRoot, "scripts", "verify.mjs")], {
    cwd: copyRoot,
    encoding: "utf8"
  });
}

function rewriteJson(file, change) {
  const value = JSON.parse(fs.readFileSync(file, "utf8"));
  change(value);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function validLocalDelta() {
  return {
    $schema_file: "../schemas/local-delta.schema.json",
    schema: "local_delta",
    schema_version: "0.1",
    task_id: "regression-local-delta",
    revision: 1,
    status: "ready_for_handoff",
    repository: {
      remote: "https://github.com/example/project.git",
      branch: "main",
      baseline_sha: "0123456789abcdef0123456789abcdef01234567"
    },
    local: {
      head: "0123456789abcdef0123456789abcdef01234567",
      working_tree: "dirty",
      baseline_state: "diverged"
    },
    relevance: {
      relevant_to_task: true,
      confidence: "high",
      evidence: ["The changed contract is required by the active task."]
    },
    changed_files: [
      {
        path: "docs/contracts/local-delta.md",
        change_type: "added",
        relevant_to_task: true,
        evidence: ["The file defines the requested Local Delta semantics."]
      }
    ],
    summary: "The local workspace adds the task-relevant Local Delta contract.",
    implications: ["The approved route remains valid."],
    evidence: ["git diff --name-status identified the contract as added."]
  };
}

function validMicroConsultationRequest() {
  return {
    $schema_file: "../schemas/micro-consultation-request.schema.json",
    schema: "micro_consultation_request",
    schema_version: "0.1",
    task_id: "regression-micro-consultation",
    revision: 1,
    consultation_id: "MC-regression-001",
    status: "open",
    requester: "chat",
    responder: "codex",
    phase_owner: "chat",
    consultation_type: "repository_fact",
    focused_question: "Which local module owns invoice filtering?",
    why_it_matters: "The answer selects the repository-grounded integration point without changing the approved behavior.",
    requested_evidence: ["Relevant file paths and a concise ownership finding."],
    authority: {
      may_change_intent: false,
      may_transfer_phase_ownership: false,
      boundary: "Codex may report repository facts but may not choose product behavior."
    }
  };
}

function validMicroConsultationResponse() {
  return {
    $schema_file: "../schemas/micro-consultation-response.schema.json",
    schema: "micro_consultation_response",
    schema_version: "0.1",
    task_id: "regression-micro-consultation",
    revision: 1,
    consultation_id: "MC-regression-001",
    status: "answered",
    requester: "chat",
    responder: "codex",
    phase_owner: "chat",
    consultation_type: "repository_fact",
    in_response_to: {
      consultation_id: "MC-regression-001",
      request_revision: 1
    },
    finding: "Invoice filters are assembled in src/invoices/query.ts.",
    evidence: ["src/invoices/query.ts exports buildInvoiceQuery."],
    implication: ["Use that module as the implementation integration point."],
    decision: "none"
  };
}

function validRoutingRecommendation(surface = "codex", surfaceValue = ["repository_grounding"]) {
  const routes = {
    chat: {
      phase: "specification",
      workflow: "approved_specification",
      resources: ["approved shared context"],
      matched_rule: "R002"
    },
    developer: {
      phase: "requirement_discovery",
      workflow: "developer_intent_decision",
      resources: ["intent question"],
      matched_rule: "R001"
    },
    codex: {
      phase: "implementation_planning",
      workflow: "repository_grounded_planning",
      resources: ["approved handoff", "approved v0.2 specification"],
      matched_rule: "R006"
    }
  };
  return {
    $schema_file: "../schemas/routing-recommendation.schema.json",
    schema: "routing_recommendation",
    schema_version: "0.2",
    task_id: `regression-routing-${surface}`,
    revision: 1,
    phase: routes[surface].phase,
    surface,
    workflow: routes[surface].workflow,
    resources: routes[surface].resources,
    matched_rule: routes[surface].matched_rule,
    surface_value: surfaceValue,
    rationale: [`The selected ${surface} surface produces material value for this phase.`],
    developer_approval_required: true,
    invalidation_conditions: ["Material evidence invalidates the approved route or strategy."]
  };
}

function validApprovedHandoff(copyRoot, status = "prepared", chatVerifyCommit = status === "prepared") {
  const record = readJson(path.join(copyRoot, "examples", "devswitchboard-approved-handoff.json"));
  record.schema_version = "0.2";
  record.task_id = `regression-upstream-preparation-${status}`;
  record.revision = 2;
  record.developer_decisions.chat_verify_commit_before_next_task = chatVerifyCommit;
  if (status === "prepared") {
    record.upstream_preparation = {
      status: "prepared",
      source_artifacts: [
        "docs/north-star.md",
        "docs/superpowers/specs/2026-08-25-devswitchboard-v0.2-upstream-first-execution.md"
      ],
      approach_summary: "Extend the existing contract families while retaining historical version 0.1 support.",
      logical_work_units: [
        "Add version-conditioned contract validation.",
        "Preserve historical version 0.1 artifacts."
      ],
      sequencing_assumptions: ["Establish regression evidence before production changes."],
      local_grounding_needed: ["Identify the canonical validator integration point."],
      rationale: ["Approved intent determines the approach while exact repository targets require Codex."]
    };
  } else {
    record.task_class = "bounded";
    record.routing.implementation_planning.active = false;
    record.execution.methodology.path = "bounded";
    record.upstream_preparation = {
      status: "not_needed",
      source_artifacts: [],
      approach_summary: null,
      logical_work_units: [],
      sequencing_assumptions: [],
      local_grounding_needed: [],
      rationale: ["Scope and acceptance already constrain direct bounded execution, so preparation adds no material value."]
    };
  }
  return record;
}

function addPredecessorCommitVerification(record) {
  record.completed_gates.push({
    gate: "predecessor_commit_verification",
    status: "passed",
    evidence_source: "https://github.com/Sonos18/devswitchboard/commit/dc8e727ef0c02f3fb7f2b150effa327c87192336",
    predecessor_task_id: "devswitchboard-upstream-preparation-boundary-017",
    commit_sha: "dc8e727ef0c02f3fb7f2b150effa327c87192336"
  });
  return record;
}

function validCodexValueChecks() {
  const classifications = [
    "UPSTREAM_PREPARATION_REUSED",
    "LOCAL_GROUNDING_REQUIRED",
    "REQUIRED_ADAPTATION",
    "IMPLEMENTATION_EXECUTION",
    "MANDATORY_CONFIDENCE",
    "DUPLICATED_REASONING"
  ];
  return classifications.map((classification, index) => ({
    checkpoint_id: `CV-regression-${String(index + 1).padStart(3, "0")}`,
    phase: index < 3 ? "implementation_planning" : index === 3 ? "implementation" : "verification",
    activity: `Exercise ${classification} validation.`,
    upstream_item: index < 3 ? "Ground the approved logical work unit." : null,
    classification,
    evidence: [`Observed evidence for ${classification}.`]
  }));
}

function writeRoutingRecommendation(copyRoot, label, record) {
  writeJson(path.join(copyRoot, "examples", `regression-routing-${label}.json`), record);
}

function writeApprovedHandoff(copyRoot, label, record) {
  writeJson(path.join(copyRoot, "examples", `regression-handoff-${label}.json`), record);
}

function writeCodexValueRecord(copyRoot, label, checks = validCodexValueChecks()) {
  const record = readJson(path.join(copyRoot, "dogfood", "devswitchboard-adaptive-readiness-012.json"));
  record.task_id = `regression-codex-value-${label}`;
  record.measurements.codex_value_checks = checks;
  writeJson(path.join(copyRoot, "dogfood", `regression-codex-value-${label}.json`), record);
}

function moreContextRequiredCheck() {
  return {
    checkpoint_id: "DV-regression-001",
    decision: "MORE_CONTEXT_REQUIRED",
    context_source: "REMOTE",
    missing_fact: "Does the canonical schema support structured decision-value checkpoints?",
    material_to: ["execution_strategy", "task_class"],
    evidence: ["The answer determines whether schema work is required."]
  };
}

function noMoreContextNeededCheck() {
  return {
    checkpoint_id: "DV-regression-002",
    decision: "NO_MORE_CONTEXT_NEEDED",
    context_source: "NONE",
    missing_fact: null,
    material_to: [],
    evidence: ["The authoritative fact and resulting strategy are resolved."]
  };
}

function writeDecisionValueRecord(copyRoot, label, check) {
  const record = readJson(path.join(copyRoot, "dogfood", "devswitchboard-adaptive-readiness-012.json"));
  record.task_id = `regression-decision-value-${label}`;
  if (check !== undefined) record.measurements.decision_value_checks = [check];
  writeJson(path.join(copyRoot, "dogfood", `regression-decision-value-${label}.json`), record);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeRerouteScenario(copyRoot, label, options = {}) {
  const taskId = `regression-reroute-${label}`;
  const reroutePath = `dogfood/regression-${label}-reroute.json`;
  const workStatePath = `dogfood/regression-${label}-work-state.json`;
  const approvalPath = `dogfood/regression-${label}-approved-handoff.json`;
  const reroute = readJson(path.join(copyRoot, "dogfood", "devswitchboard-reroute-recovery-007-re-route-required.json"));
  reroute.task_id = taskId;
  reroute.revision = 2;
  reroute.recommended_route.task_id = taskId;
  reroute.recommended_route.revision = 2;
  if (options.intentInfeasible) {
    reroute.updated_profile_evidence.push("intent_feasibility: infeasible; approved intent cannot be preserved safely.");
  }
  writeJson(path.join(copyRoot, reroutePath), reroute);

  if (options.omitWorkState) return { taskId, reroutePath, workStatePath, approvalPath };

  const workState = readJson(path.join(copyRoot, "dogfood", "devswitchboard-reroute-recovery-007-work-state.json"));
  workState.task_id = taskId;
  workState.revision = 1;
  workState.authoritative_artifacts = workState.authoritative_artifacts.map((artifact) =>
    artifact === "dogfood/devswitchboard-reroute-recovery-007-re-route-required.json" ? reroutePath : artifact
  );
  workState.active_route.task_id = taskId;
  workState.active_route.revision = 2;
  workState.lifecycle_state = options.lifecycleState ?? "waiting_for_developer";
  workState.current_phase = options.lifecycleState === "complete" ? "handoff" : "implementation";
  workState.verification_state = options.lifecycleState === "complete" ? "passed" : options.lifecycleState === "active" ? "in_progress" : "not_started";
  workState.next_safe_action = options.nextSafeAction ?? "Return the Re-route Required artifact for developer approval.";
  workState.blockers = workState.lifecycle_state === "waiting_for_developer" ? ["Developer approval is required."] : [];

  if (options.approval) {
    const handoff = readJson(path.join(copyRoot, "dogfood", "devswitchboard-reroute-recovery-007-approved-handoff-revision-2.json"));
    handoff.task_id = options.approvalTaskId ?? taskId;
    handoff.revision = 2;
    handoff.routing.implementation.owner = "codex";
    for (const gate of handoff.completed_gates) {
      if (gate.gate === "re_route_required") {
        gate.evidence_source = options.omitApprovalGateProvenance ? "dogfood/unrelated-reroute.json" : reroutePath;
      }
    }
    writeJson(path.join(copyRoot, approvalPath), handoff);

    if (workState.lifecycle_state !== "waiting_for_developer") {
      workState.active_route.revision = 2;
      workState.active_route.surface = "codex";
      workState.active_route.workflow = "approved_revision_2_execution";
      workState.active_route.developer_approval_required = false;
      workState.next_safe_action = workState.lifecycle_state === "complete" ? "developer_review" : "Execute approved Revision 2 implementation.";
      if (options.resumedReferencesApproval !== false) workState.authoritative_artifacts.push(approvalPath);
    }

    if (options.duplicateApproval) {
      writeJson(path.join(copyRoot, `dogfood/regression-${label}-approved-handoff-duplicate.json`), handoff);
    }
  }

  writeJson(path.join(copyRoot, workStatePath), workState);
  return { taskId, reroutePath, workStatePath, approvalPath };
}

function writeApprovedReplacement(copyRoot, label, taskId, reroutePath, revision) {
  const approvalPath = `dogfood/regression-${label}-approved-handoff-revision-${revision}.json`;
  const handoff = readJson(path.join(copyRoot, "dogfood", "devswitchboard-reroute-recovery-007-approved-handoff-revision-2.json"));
  handoff.task_id = taskId;
  handoff.revision = revision;
  for (const gate of handoff.completed_gates) {
    if (gate.gate === "re_route_required") gate.evidence_source = reroutePath;
  }
  writeJson(path.join(copyRoot, approvalPath), handoff);
  return approvalPath;
}

function writeLaterActiveState(copyRoot, label, taskId, reroutePath, revision, approvalPath = null) {
  const statePath = `dogfood/regression-${label}-active-state-revision-${revision}.json`;
  const state = readJson(path.join(copyRoot, "dogfood", "devswitchboard-reroute-recovery-007-resumed-work-state.json"));
  state.task_id = taskId;
  state.revision = revision;
  state.lifecycle_state = "active";
  state.current_phase = "implementation";
  state.authoritative_artifacts = [reroutePath];
  if (approvalPath) state.authoritative_artifacts.push(approvalPath);
  state.active_route.task_id = taskId;
  state.active_route.revision = revision;
  state.active_route.phase = "implementation";
  state.active_route.workflow = `approved_revision_${revision}_execution`;
  state.next_safe_action = `Execute approved Revision ${revision} implementation.`;
  writeJson(path.join(copyRoot, statePath), state);
  return statePath;
}

function writeConflictScenario(copyRoot, label, options = {}) {
  const taskId = `regression-conflict-${label}`;
  const conflictPath = `dogfood/regression-${label}-conflict-report.json`;
  const workStatePath = `dogfood/regression-${label}-conflict-work-state.json`;
  const resumedStatePath = `dogfood/regression-${label}-conflict-resumed-work-state.json`;
  const approvalPath = `dogfood/regression-${label}-conflict-approved-handoff.json`;
  const conflict = readJson(path.join(copyRoot, "dogfood", "devswitchboard-conflict-recovery-008-conflict-report.json"));
  conflict.task_id = taskId;
  conflict.revision = 2;
  writeJson(path.join(copyRoot, conflictPath), conflict);

  if (options.omitWorkState) return { taskId, conflictPath, workStatePath, resumedStatePath, approvalPath };

  const workState = readJson(path.join(copyRoot, "dogfood", "devswitchboard-conflict-recovery-008-work-state.json"));
  workState.task_id = taskId;
  workState.revision = 2;
  workState.authoritative_artifacts = [conflictPath];
  workState.active_route.task_id = taskId;
  workState.active_route.revision = 2;
  workState.lifecycle_state = "blocked_by_conflict";
  workState.current_phase = "implementation";
  workState.verification_state = "not_started";
  workState.next_safe_action = options.nextSafeAction
    ?? "Return the Conflict Report for a developer intent decision.";
  workState.blockers = ["Developer intent decision required."];

  let stateToWrite = workState;
  let statePathToWrite = workStatePath;
  if (!options.approval && options.lifecycleState && options.lifecycleState !== "blocked_by_conflict") {
    stateToWrite = structuredClone(workState);
    stateToWrite.lifecycle_state = options.lifecycleState;
    stateToWrite.current_phase = options.lifecycleState === "complete" ? "handoff" : "implementation";
    stateToWrite.verification_state = options.lifecycleState === "complete" ? "passed" : "in_progress";
    stateToWrite.next_safe_action = options.lifecycleState === "complete"
      ? "developer_review"
      : "Continue implementation while the developer decides.";
    stateToWrite.blockers = [];
  }

  if (options.approval) {
    const handoff = readJson(path.join(copyRoot, "dogfood", "devswitchboard-conflict-recovery-008-approved-handoff-revision-2.json"));
    handoff.task_id = options.approvalTaskId ?? taskId;
    handoff.revision = options.approvalRevision ?? 2;
    if (options.unapproved) {
      handoff.workflow_state.developer_approval = false;
      handoff.readiness.developer_approval = false;
    }
    for (const gate of handoff.completed_gates) {
      if (gate.gate === "conflict_report") {
        gate.evidence_source = options.omitApprovalGateProvenance
          ? "dogfood/unrelated-conflict-report.json"
          : conflictPath;
      }
    }
    writeJson(path.join(copyRoot, approvalPath), handoff);

    if (["active", "complete"].includes(options.lifecycleState)) {
      stateToWrite = structuredClone(workState);
      statePathToWrite = resumedStatePath;
      stateToWrite.lifecycle_state = options.lifecycleState;
      stateToWrite.current_phase = options.lifecycleState === "complete" ? "handoff" : "implementation";
      stateToWrite.verification_state = options.lifecycleState === "complete" ? "passed" : "in_progress";
      stateToWrite.blockers = [];
      stateToWrite.active_route.revision = options.approvalRevision ?? 2;
      stateToWrite.active_route.surface = options.lifecycleState === "complete" ? "developer" : "codex";
      stateToWrite.active_route.workflow = options.lifecycleState === "complete"
        ? "developer_review"
        : "approved_conflict_resolution_execution";
      stateToWrite.active_route.developer_approval_required = false;
      stateToWrite.next_safe_action = options.lifecycleState === "complete"
        ? "developer_review"
        : "Execute the approved intent revision.";
      if (options.resumedReferencesApproval !== false) stateToWrite.authoritative_artifacts.push(approvalPath);
    }

    if (options.duplicateApproval) {
      writeJson(path.join(copyRoot, `dogfood/regression-${label}-conflict-approved-handoff-duplicate.json`), handoff);
    }
  }

  if (!options.omitHistoricalCheckpoint) writeJson(path.join(copyRoot, workStatePath), workState);
  if (statePathToWrite !== workStatePath || options.omitHistoricalCheckpoint) {
    writeJson(path.join(copyRoot, statePathToWrite), stateToWrite);
  } else if (!options.omitHistoricalCheckpoint) {
    writeJson(path.join(copyRoot, workStatePath), stateToWrite);
  }
  return { taskId, conflictPath, workStatePath, resumedStatePath, approvalPath };
}

function writeApprovedConflictResolution(copyRoot, label, taskId, conflictPath, revision) {
  const approvalPath = `dogfood/regression-${label}-conflict-approved-handoff-revision-${revision}.json`;
  const handoff = readJson(path.join(copyRoot, "dogfood", "devswitchboard-conflict-recovery-008-approved-handoff-revision-2.json"));
  handoff.task_id = taskId;
  handoff.revision = revision;
  for (const gate of handoff.completed_gates) {
    if (gate.gate === "conflict_report") gate.evidence_source = conflictPath;
  }
  writeJson(path.join(copyRoot, approvalPath), handoff);
  return approvalPath;
}

function writeLaterConflictState(copyRoot, label, taskId, conflictPath, revision, approvalPath = null) {
  const statePath = `dogfood/regression-${label}-conflict-active-state-revision-${revision}.json`;
  const state = readJson(path.join(copyRoot, "dogfood", "devswitchboard-conflict-recovery-008-resumed-work-state.json"));
  state.task_id = taskId;
  state.revision = revision;
  state.lifecycle_state = "active";
  state.current_phase = "implementation";
  state.authoritative_artifacts = [conflictPath];
  if (approvalPath) state.authoritative_artifacts.push(approvalPath);
  state.active_route.task_id = taskId;
  state.active_route.revision = revision;
  state.active_route.phase = "implementation";
  state.active_route.workflow = `approved_conflict_revision_${revision}_execution`;
  state.verification_state = "in_progress";
  state.next_safe_action = `Execute approved conflict resolution Revision ${revision}.`;
  state.blockers = [];
  writeJson(path.join(copyRoot, statePath), state);
  return statePath;
}

function expectRejected(name, mutate, expectedMessage) {
  const { temporaryRoot, copyRoot } = copyRepository();
  try {
    mutate(copyRoot);
    const result = runVerifier(copyRoot);
    const output = `${result.stdout}${result.stderr}`;
    if (result.status === 0) {
      throw new Error(`${name}: verifier accepted the invalid record`);
    }
    if (!output.includes(expectedMessage)) {
      throw new Error(`${name}: verifier failed for the wrong reason\n${output}`);
    }
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function expectAccepted(name, mutate) {
  const { temporaryRoot, copyRoot } = copyRepository();
  try {
    mutate(copyRoot);
    const result = runVerifier(copyRoot);
    if (result.status !== 0) {
      throw new Error(`${name}: verifier rejected the valid record set\n${result.stdout}${result.stderr}`);
    }
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

const baseline = runVerifier(root);
if (baseline.status !== 0) {
  throw new Error(`baseline verifier must pass before regression cases run\n${baseline.stdout}${baseline.stderr}`);
}

const failures = [];
for (const regression of [
  {
    name: "Routing Recommendation 0.2 accepts a Chat-specific surface value",
    mutate(copyRoot) {
      writeRoutingRecommendation(copyRoot, "chat-valid", validRoutingRecommendation("chat", ["shared_context_acquisition"]));
    }
  },
  {
    name: "Routing Recommendation 0.2 accepts developer_decision on the Developer surface",
    mutate(copyRoot) {
      writeRoutingRecommendation(copyRoot, "developer-valid", validRoutingRecommendation("developer", ["developer_decision"]));
    }
  },
  {
    name: "Routing Recommendation 0.2 accepts one Codex-specific surface value",
    mutate(copyRoot) {
      writeRoutingRecommendation(copyRoot, "codex-valid", validRoutingRecommendation("codex", ["repository_grounding"]));
    }
  },
  {
    name: "Routing Recommendation 0.2 accepts multiple compatible Codex surface values",
    mutate(copyRoot) {
      writeRoutingRecommendation(copyRoot, "codex-multiple-valid", validRoutingRecommendation("codex", ["local_repository_truth", "fresh_verification"]));
    }
  },
  {
    name: "Approved Handoff 0.2 accepts prepared upstream execution preparation",
    mutate(copyRoot) {
      writeApprovedHandoff(copyRoot, "prepared-valid", validApprovedHandoff(copyRoot, "prepared"));
    }
  },
  {
    name: "Approved Handoff 0.2 accepts explicit commit verification policy true",
    mutate(copyRoot) {
      writeApprovedHandoff(copyRoot, "policy-true-valid", validApprovedHandoff(copyRoot, "prepared", true));
    }
  },
  {
    name: "prepared upstream preparation accepts a selected independent review subagent",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.logical_work_units.push("Run a fresh independent review subagent.");
      writeApprovedHandoff(copyRoot, "prepared-review-subagent-valid", record);
    }
  },
  {
    name: "Approved Handoff 0.2 accepts commit-pinned GitHub preparation provenance",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.source_artifacts = [
        "https://github.com/Sonos18/devswitchboard/blob/dc8e727ef0c02f3fb7f2b150effa327c87192336/docs/north-star.md"
      ];
      writeApprovedHandoff(copyRoot, "prepared-pinned-url-valid", record);
    }
  },
  {
    name: "Approved Handoff 0.2 accepts not-needed preparation for bounded direct execution",
    mutate(copyRoot) {
      writeApprovedHandoff(copyRoot, "not-needed-valid", validApprovedHandoff(copyRoot, "not_needed"));
    }
  },
  {
    name: "Approved Handoff 0.2 accepts explicit commit verification policy false without a predecessor gate",
    mutate(copyRoot) {
      writeApprovedHandoff(copyRoot, "policy-false-valid", validApprovedHandoff(copyRoot, "not_needed", false));
    }
  },
  {
    name: "Approved Handoff 0.2 accepts a completed predecessor commit verification gate",
    mutate(copyRoot) {
      const record = addPredecessorCommitVerification(validApprovedHandoff(copyRoot, "prepared", true));
      writeApprovedHandoff(copyRoot, "predecessor-gate-valid", record);
    }
  },
  {
    name: "Dogfood Record 0.1 accepts every Codex-value classification",
    mutate(copyRoot) {
      writeCodexValueRecord(copyRoot, "all-classifications-valid");
    }
  },
  {
    name: "historical Dogfood record remains valid without decision-value checkpoints",
    mutate(copyRoot) {
      writeDecisionValueRecord(copyRoot, "historical-omission");
    }
  },
  {
    name: "MORE_CONTEXT_REQUIRED accepts a focused material REMOTE fact",
    mutate(copyRoot) {
      writeDecisionValueRecord(copyRoot, "more-context-valid", moreContextRequiredCheck());
    }
  },
  {
    name: "NO_MORE_CONTEXT_NEEDED accepts resolved context with no material target",
    mutate(copyRoot) {
      writeDecisionValueRecord(copyRoot, "no-more-context-valid", noMoreContextNeededCheck());
    }
  },
  {
    name: "pending Re-route Required accepts waiting-for-developer approval state",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "pending-waiting");
    }
  },
  {
    name: "approved replacement revision permits provenance-linked active work",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "approved-resume", { lifecycleState: "active", approval: true });
    }
  },
  {
    name: "pending reroute accepts an explicit prohibition on strategy work",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "safe-prohibition", {
        nextSafeAction: "Do not continue implementation; return the Re-route Required artifact for developer approval."
      });
    }
  },
  {
    name: "pending reroute accepts a prohibition across coordinated strategy verbs",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "coordinated-prohibition", {
        nextSafeAction: "Do not implement or execute the replacement; request developer approval."
      });
    }
  },
  {
    name: "feasible reroute accepts explicitly negated conflict wording",
    mutate(copyRoot) {
      const scenario = writeRerouteScenario(copyRoot, "feasible-negation");
      rewriteJson(path.join(copyRoot, scenario.reroutePath), (reroute) => {
        reroute.trigger = "New repository constraints invalidate the route; no evidence says approved intent cannot be preserved safely.";
      });
    }
  },
  {
    name: "newer approval does not retroactively invalidate historical approved state",
    mutate(copyRoot) {
      const scenario = writeRerouteScenario(copyRoot, "approval-history", {
        lifecycleState: "active",
        approval: true
      });
      const revision3Approval = writeApprovedReplacement(
        copyRoot,
        "approval-history",
        scenario.taskId,
        scenario.reroutePath,
        3
      );
      writeLaterActiveState(
        copyRoot,
        "approval-history",
        scenario.taskId,
        scenario.reroutePath,
        3,
        revision3Approval
      );
    }
  },
  {
    name: "pending Conflict Report accepts blocked-by-conflict developer decision state",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "pending-conflict-blocked");
    }
  },
  {
    name: "pending Conflict Report accepts an explicit prohibition before returning the report",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "pending-conflict-prohibition", {
        nextSafeAction: "Do not continue implementation; return the Conflict Report for a developer intent decision."
      });
    }
  },
  {
    name: "approved conflict resolution permits provenance-linked active work",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "approved-conflict-resume", {
        lifecycleState: "active",
        approval: true
      });
    }
  },
  {
    name: "approved conflict resolution preserves historical blocked evidence",
    mutate(copyRoot) {
      const scenario = writeConflictScenario(copyRoot, "conflict-history-blocked");
      const approvalPath = writeApprovedConflictResolution(
        copyRoot,
        "conflict-history-blocked",
        scenario.taskId,
        scenario.conflictPath,
        2
      );
      writeLaterConflictState(
        copyRoot,
        "conflict-history-blocked",
        scenario.taskId,
        scenario.conflictPath,
        2,
        approvalPath
      );
    }
  },
  {
    name: "newer conflict approval does not retroactively invalidate historical approved state",
    mutate(copyRoot) {
      const scenario = writeConflictScenario(copyRoot, "conflict-approval-history", {
        lifecycleState: "active",
        approval: true
      });
      const revision3Approval = writeApprovedConflictResolution(
        copyRoot,
        "conflict-approval-history",
        scenario.taskId,
        scenario.conflictPath,
        3
      );
      writeLaterConflictState(
        copyRoot,
        "conflict-approval-history",
        scenario.taskId,
        scenario.conflictPath,
        3,
        revision3Approval
      );
    }
  }
]) {
  try {
    expectAccepted(regression.name, regression.mutate);
  } catch (error) {
    failures.push(error.message);
  }
}

for (const regression of [
  {
    name: "Routing Recommendation 0.2 requires surface_value",
    expectedMessage: "Routing Recommendation 0.2 requires non-empty surface_value",
    mutate(copyRoot) {
      const record = validRoutingRecommendation();
      delete record.surface_value;
      writeRoutingRecommendation(copyRoot, "missing-surface-value", record);
    }
  },
  {
    name: "Routing Recommendation 0.2 rejects an empty surface_value",
    expectedMessage: "Routing Recommendation 0.2 requires non-empty surface_value",
    mutate(copyRoot) {
      writeRoutingRecommendation(copyRoot, "empty-surface-value", validRoutingRecommendation("codex", []));
    }
  },
  {
    name: "Routing Recommendation 0.2 rejects an unknown surface value",
    expectedMessage: "unknown surface_value unmeasured_value",
    mutate(copyRoot) {
      writeRoutingRecommendation(copyRoot, "unknown-surface-value", validRoutingRecommendation("codex", ["unmeasured_value"]));
    }
  },
  {
    name: "Routing Recommendation 0.2 rejects a Chat value on Codex",
    expectedMessage: "surface_value shared_context_acquisition is incompatible with surface codex",
    mutate(copyRoot) {
      writeRoutingRecommendation(copyRoot, "chat-value-on-codex", validRoutingRecommendation("codex", ["shared_context_acquisition"]));
    }
  },
  {
    name: "Routing Recommendation 0.2 rejects a Codex value on Chat",
    expectedMessage: "surface_value repository_grounding is incompatible with surface chat",
    mutate(copyRoot) {
      writeRoutingRecommendation(copyRoot, "codex-value-on-chat", validRoutingRecommendation("chat", ["repository_grounding"]));
    }
  },
  {
    name: "Routing Recommendation 0.1 rejects the v0.2-only surface_value",
    expectedMessage: "Routing Recommendation 0.1 cannot contain surface_value",
    mutate(copyRoot) {
      const record = validRoutingRecommendation();
      record.schema_version = "0.1";
      writeRoutingRecommendation(copyRoot, "surface-value-on-0.1", record);
    }
  },
  {
    name: "Approved Handoff 0.2 requires upstream_preparation",
    expectedMessage: "Approved Handoff 0.2 requires upstream_preparation",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      delete record.upstream_preparation;
      writeApprovedHandoff(copyRoot, "missing-preparation", record);
    }
  },
  {
    name: "Approved Handoff 0.2 requires an explicit commit verification policy",
    expectedMessage: "Approved Handoff 0.2 requires explicit boolean chat_verify_commit_before_next_task",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared", true);
      delete record.developer_decisions.chat_verify_commit_before_next_task;
      writeApprovedHandoff(copyRoot, "missing-commit-verification-policy", record);
    }
  },
  {
    name: "Approved Handoff 0.2 rejects a non-boolean commit verification policy",
    expectedMessage: "Approved Handoff 0.2 requires explicit boolean chat_verify_commit_before_next_task",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared", true);
      record.developer_decisions.chat_verify_commit_before_next_task = "true";
      writeApprovedHandoff(copyRoot, "non-boolean-commit-verification-policy", record);
    }
  },
  {
    name: "Approved Handoff 0.1 rejects the v0.2-only commit verification policy",
    expectedMessage: "Approved Handoff 0.1 cannot contain chat_verify_commit_before_next_task",
    mutate(copyRoot) {
      const record = readJson(path.join(copyRoot, "examples", "devswitchboard-approved-handoff.json"));
      record.task_id = "regression-policy-on-0.1";
      record.developer_decisions.chat_verify_commit_before_next_task = true;
      writeApprovedHandoff(copyRoot, "policy-on-0.1", record);
    }
  },
  {
    name: "predecessor commit verification requires task, exact SHA, and resolvable evidence",
    expectedMessage: "predecessor_commit_verification requires predecessor_task_id, exact commit_sha, and resolvable evidence_source",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared", true);
      record.completed_gates.push({
        gate: "predecessor_commit_verification",
        status: "passed",
        evidence_source: "unresolvable commit audit"
      });
      writeApprovedHandoff(copyRoot, "incomplete-predecessor-gate", record);
    }
  },
  {
    name: "predecessor commit verification evidence must identify the exact recorded SHA",
    expectedMessage: "predecessor_commit_verification requires predecessor_task_id, exact commit_sha, and resolvable evidence_source",
    mutate(copyRoot) {
      const record = addPredecessorCommitVerification(validApprovedHandoff(copyRoot, "prepared", true));
      record.completed_gates.at(-1).evidence_source = "https://github.com/Sonos18/devswitchboard/commit/688c9d51ab23909872119181248e8cf8dce5ae5c";
      writeApprovedHandoff(copyRoot, "mismatched-predecessor-evidence", record);
    }
  },
  {
    name: "Codex technical completion cannot route directly to Developer review",
    expectedMessage: "Codex completion must return READY_FOR_CHAT_ACCEPTANCE to Chat",
    mutate(copyRoot) {
      const file = path.join(copyRoot, "docs", "workflows", "codex.md");
      const content = fs.readFileSync(file, "utf8").replaceAll("READY_FOR_CHAT_ACCEPTANCE", "READY_FOR_DEVELOPER_REVIEW");
      fs.writeFileSync(file, content);
    }
  },
  {
    name: "true commit verification policy blocks a dependent handoff until the predecessor gate passes",
    expectedMessage: "Chat workflow must block dependent handoffs until predecessor_commit_verification passes",
    mutate(copyRoot) {
      const file = path.join(copyRoot, "docs", "workflows", "chat.md");
      const content = fs.readFileSync(file, "utf8").replaceAll("predecessor_commit_verification", "predecessor_commit_audit");
      fs.writeFileSync(file, content);
    }
  },
  {
    name: "false commit verification policy does not fabricate a mandatory predecessor gate",
    expectedMessage: "Chat workflow must preserve the explicit false path without a mandatory predecessor gate",
    mutate(copyRoot) {
      const file = path.join(copyRoot, "docs", "workflows", "chat.md");
      const content = fs.readFileSync(file, "utf8").replaceAll("chat_verify_commit_before_next_task: false", "chat_verify_commit_before_next_task: true");
      fs.writeFileSync(file, content);
    }
  },
  {
    name: "Developer technical code and test review is not required",
    expectedMessage: "completion policy cannot require Developer technical review",
    mutate(copyRoot) {
      const file = path.join(copyRoot, "docs", "workflows", "codex.md");
      fs.appendFileSync(file, "\nThe Developer MUST review implementation diffs and tests before technical acceptance.\n");
    }
  },
  {
    name: "prepared upstream preparation requires source provenance",
    expectedMessage: "prepared upstream_preparation requires source_artifacts",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.source_artifacts = [];
      writeApprovedHandoff(copyRoot, "prepared-empty-provenance", record);
    }
  },
  {
    name: "prepared upstream preparation requires an approach summary",
    expectedMessage: "prepared upstream_preparation requires approach_summary",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.approach_summary = null;
      writeApprovedHandoff(copyRoot, "prepared-null-summary", record);
    }
  },
  {
    name: "prepared upstream preparation requires a logical work unit",
    expectedMessage: "prepared upstream_preparation requires logical_work_units",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.logical_work_units = [];
      writeApprovedHandoff(copyRoot, "prepared-empty-work", record);
    }
  },
  {
    name: "prepared upstream preparation requires a local-grounding question",
    expectedMessage: "prepared upstream_preparation requires local_grounding_needed",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.local_grounding_needed = [];
      writeApprovedHandoff(copyRoot, "prepared-empty-grounding", record);
    }
  },
  {
    name: "prepared upstream preparation requires rationale",
    expectedMessage: "upstream_preparation requires non-empty rationale",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.rationale = [];
      writeApprovedHandoff(copyRoot, "prepared-empty-rationale", record);
    }
  },
  {
    name: "prepared upstream preparation rejects display-name-only provenance",
    expectedMessage: "source artifact is not resolvable without conversation history",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.source_artifacts = ["Approved v0.2 specification"];
      writeApprovedHandoff(copyRoot, "prepared-display-name-source", record);
    }
  },
  {
    name: "prepared upstream preparation rejects an unpinned remote URL",
    expectedMessage: "source artifact is not resolvable without conversation history",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.source_artifacts = ["https://example.invalid/not-an-approved-shared-baseline"];
      writeApprovedHandoff(copyRoot, "prepared-unpinned-url", record);
    }
  },
  {
    name: "prepared upstream preparation rejects a missing repository-relative path",
    expectedMessage: "source artifact is not resolvable without conversation history",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.source_artifacts = ["docs/missing-approved-source.md"];
      writeApprovedHandoff(copyRoot, "prepared-missing-local-source", record);
    }
  },
  {
    name: "prepared upstream preparation cannot add an explicitly excluded product capability",
    expectedMessage: "upstream_preparation contradicts excluded scope: CLI",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.logical_work_units.push("Add a CLI product runtime despite the binding excluded scope.");
      writeApprovedHandoff(copyRoot, "prepared-excluded-capability", record);
    }
  },
  {
    name: "prepared upstream preparation cannot override the no-subagents strategy",
    expectedMessage: "upstream_preparation contradicts approved strategy: implementation_subagents",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.upstream_preparation.logical_work_units.push("Implement the change with implementation subagents.");
      writeApprovedHandoff(copyRoot, "prepared-strategy-override", record);
    }
  },
  {
    name: "not-needed upstream preparation rejects logical work content",
    expectedMessage: "not_needed upstream_preparation cannot contain preparation content",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "not_needed");
      record.upstream_preparation.logical_work_units = ["Fabricated plan work."];
      writeApprovedHandoff(copyRoot, "not-needed-work", record);
    }
  },
  {
    name: "not-needed upstream preparation rejects a non-null approach summary",
    expectedMessage: "not_needed upstream_preparation cannot contain preparation content",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "not_needed");
      record.upstream_preparation.approach_summary = "No separate preparation is needed.";
      writeApprovedHandoff(copyRoot, "not-needed-summary", record);
    }
  },
  {
    name: "Approved Handoff 0.1 rejects the v0.2-only upstream_preparation",
    expectedMessage: "Approved Handoff 0.1 cannot contain upstream_preparation",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.schema_version = "0.1";
      writeApprovedHandoff(copyRoot, "preparation-on-0.1", record);
    }
  },
  {
    name: "upstream preparation cannot override Developer approval",
    expectedMessage: "ready handoff requires affirmative workflow, readiness, and routing approval",
    mutate(copyRoot) {
      const record = validApprovedHandoff(copyRoot, "prepared");
      record.developer_decisions.routing_recommendation_approved = false;
      writeApprovedHandoff(copyRoot, "authority-contradiction", record);
    }
  },
  {
    name: "Codex-value checkpoint rejects an unknown classification",
    expectedMessage: "expected one of \"UPSTREAM_PREPARATION_REUSED\"",
    mutate(copyRoot) {
      const checks = validCodexValueChecks();
      checks[0].classification = "UNMEASURED_VALUE";
      writeCodexValueRecord(copyRoot, "unknown-classification", checks);
    }
  },
  {
    name: "Codex-value checkpoint requires evidence",
    expectedMessage: "expected at least 1 items",
    mutate(copyRoot) {
      const checks = validCodexValueChecks();
      checks[0].evidence = [];
      writeCodexValueRecord(copyRoot, "empty-evidence", checks);
    }
  },
  {
    name: "Codex-value checkpoint requires every canonical field",
    expectedMessage: "missing required property activity",
    mutate(copyRoot) {
      const checks = validCodexValueChecks();
      delete checks[0].activity;
      writeCodexValueRecord(copyRoot, "missing-activity", checks);
    }
  },
  {
    name: "Codex-value checkpoint rejects an empty non-null upstream item",
    expectedMessage: "codex_value_checks[0].upstream_item: expected exactly one oneOf branch, matched 0",
    mutate(copyRoot) {
      const checks = validCodexValueChecks();
      checks[0].upstream_item = "";
      writeCodexValueRecord(copyRoot, "empty-upstream-item", checks);
    }
  },
  {
    name: "Codex-value checkpoint rejects unexpected properties",
    expectedMessage: "unexpected property token_savings",
    mutate(copyRoot) {
      const checks = validCodexValueChecks();
      checks[0].token_savings = 50;
      writeCodexValueRecord(copyRoot, "unexpected-property", checks);
    }
  },
  {
    name: "ready Approved Handoff requires affirmative routing approval",
    expectedMessage: "Approved Handoff authority",
    mutate(copyRoot) {
      const handoff = readJson(path.join(copyRoot, "examples", "devswitchboard-approved-handoff.json"));
      handoff.task_id = "regression-ready-routing-unapproved";
      handoff.developer_decisions.routing_recommendation_approved = false;
      writeJson(path.join(copyRoot, "dogfood", "regression-ready-routing-unapproved-handoff.json"), handoff);
    }
  },
  {
    name: "MORE_CONTEXT_REQUIRED rejects context source NONE",
    expectedMessage: "expected exactly one oneOf branch",
    mutate(copyRoot) {
      const check = moreContextRequiredCheck();
      check.context_source = "NONE";
      writeDecisionValueRecord(copyRoot, "more-context-none-source", check);
    }
  },
  {
    name: "MORE_CONTEXT_REQUIRED rejects a null missing fact",
    expectedMessage: "expected exactly one oneOf branch",
    mutate(copyRoot) {
      const check = moreContextRequiredCheck();
      check.missing_fact = null;
      writeDecisionValueRecord(copyRoot, "more-context-null-fact", check);
    }
  },
  {
    name: "MORE_CONTEXT_REQUIRED rejects an empty material target list",
    expectedMessage: "expected exactly one oneOf branch",
    mutate(copyRoot) {
      const check = moreContextRequiredCheck();
      check.material_to = [];
      writeDecisionValueRecord(copyRoot, "more-context-empty-material", check);
    }
  },
  {
    name: "NO_MORE_CONTEXT_NEEDED rejects a non-NONE context source",
    expectedMessage: "expected exactly one oneOf branch",
    mutate(copyRoot) {
      const check = noMoreContextNeededCheck();
      check.context_source = "REMOTE";
      writeDecisionValueRecord(copyRoot, "no-more-context-remote-source", check);
    }
  },
  {
    name: "NO_MORE_CONTEXT_NEEDED rejects a non-null missing fact",
    expectedMessage: "expected exactly one oneOf branch",
    mutate(copyRoot) {
      const check = noMoreContextNeededCheck();
      check.missing_fact = "One more fact";
      writeDecisionValueRecord(copyRoot, "no-more-context-non-null-fact", check);
    }
  },
  {
    name: "NO_MORE_CONTEXT_NEEDED rejects a non-empty material target list",
    expectedMessage: "expected exactly one oneOf branch",
    mutate(copyRoot) {
      const check = noMoreContextNeededCheck();
      check.material_to = ["execution_strategy"];
      writeDecisionValueRecord(copyRoot, "no-more-context-material", check);
    }
  },
  {
    name: "decision-value checkpoint rejects an unknown decision",
    expectedMessage: "expected exactly one oneOf branch",
    mutate(copyRoot) {
      const check = moreContextRequiredCheck();
      check.decision = "MAYBE_MORE_CONTEXT";
      writeDecisionValueRecord(copyRoot, "unknown-decision", check);
    }
  },
  {
    name: "decision-value checkpoint requires every canonical field",
    expectedMessage: "missing required property missing_fact",
    mutate(copyRoot) {
      const check = moreContextRequiredCheck();
      delete check.missing_fact;
      writeDecisionValueRecord(copyRoot, "missing-field", check);
    }
  },
  {
    name: "decision-value checkpoint requires evidence",
    expectedMessage: "expected at least 1 items",
    mutate(copyRoot) {
      const check = moreContextRequiredCheck();
      check.evidence = [];
      writeDecisionValueRecord(copyRoot, "empty-evidence", check);
    }
  },
  {
    name: "decision-value checkpoint rejects unexpected properties",
    expectedMessage: "unexpected property extra",
    mutate(copyRoot) {
      const check = moreContextRequiredCheck();
      check.extra = "not canonical";
      writeDecisionValueRecord(copyRoot, "unexpected-property", check);
    }
  },
  {
    name: "unapproved handoff cannot select a permissive schema",
    expectedMessage: "noncanonical schema selection",
    mutate(copyRoot) {
      fs.writeFileSync(
        path.join(copyRoot, "schemas", "permissive.schema.json"),
        `${JSON.stringify({ $schema: "https://json-schema.org/draft/2020-12/schema", type: "object" }, null, 2)}\n`
      );
      rewriteJson(path.join(copyRoot, "examples", "devswitchboard-approved-handoff.json"), (handoff) => {
        handoff.$schema_file = "../schemas/permissive.schema.json";
        handoff.status = "unapproved";
        handoff.workflow_state.developer_approval = false;
        handoff.readiness.developer_approval = false;
      });
    }
  },
  {
    name: "unapproved handoff cannot select an external absolute schema",
    expectedMessage: "noncanonical schema selection",
    mutate(copyRoot) {
      const externalSchema = path.join(path.dirname(copyRoot), "permissive.schema.json");
      fs.writeFileSync(
        externalSchema,
        `${JSON.stringify({ $schema: "https://json-schema.org/draft/2020-12/schema", type: "object" }, null, 2)}\n`
      );
      rewriteJson(path.join(copyRoot, "examples", "devswitchboard-approved-handoff.json"), (handoff) => {
        handoff.$schema_file = externalSchema;
        handoff.status = "unapproved";
        handoff.workflow_state.developer_approval = false;
        handoff.readiness.developer_approval = false;
      });
    }
  },
  {
    name: "canonical Approved Handoff cannot masquerade as another record kind",
    expectedMessage: "noncanonical schema selection",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "devswitchboard-approved-handoff.json"), (handoff) => {
        handoff.$schema_file = "../schemas/routing-case.schema.json";
        handoff.schema = "routing_case";
        handoff.status = "unapproved";
        handoff.workflow_state.developer_approval = false;
        handoff.readiness.developer_approval = false;
      });
    }
  },
  {
    name: "complete Work State cannot have failed verification",
    expectedMessage: "complete Work State requires passed verification",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "work-state.json"), (workState) => {
        workState.verification_state = "failed";
      });
    }
  },
  {
    name: "complete Work State cannot omit verification",
    expectedMessage: "missing required property verification_state",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "work-state.json"), (workState) => {
        delete workState.verification_state;
      });
    }
  },
  {
    name: "complete Work State cannot use an invalid verification value",
    expectedMessage: "expected one of",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "work-state.json"), (workState) => {
        workState.verification_state = "unknown";
      });
    }
  },
  {
    name: "pending Re-route Required requires a matching Work State",
    expectedMessage: "pending Re-route Required requires a matching Work State",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "missing-state", { omitWorkState: true });
    }
  },
  {
    name: "pending Re-route Required rejects active strategy-dependent implementation",
    expectedMessage: "pending Re-route Required requires waiting_for_developer Work State",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "pending-active", { lifecycleState: "active" });
    }
  },
  {
    name: "pending Re-route Required rejects premature completion",
    expectedMessage: "pending Re-route Required cannot be complete",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "pending-complete", { lifecycleState: "complete" });
    }
  },
  {
    name: "pending Re-route Required rejects strategy-dependent next action",
    expectedMessage: "pending Re-route Required next safe action must wait for approval",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "pending-action", {
        nextSafeAction: "Continue implementation while developer approval is pending."
      });
    }
  },
  {
    name: "pending Re-route Required rejects later-revision active continuation",
    expectedMessage: "pending Re-route Required requires waiting_for_developer Work State",
    mutate(copyRoot) {
      const scenario = writeRerouteScenario(copyRoot, "pending-later-active");
      writeLaterActiveState(copyRoot, "pending-later-active", scenario.taskId, scenario.reroutePath, 3);
    }
  },
  {
    name: "later approved Work State must reference its replacement artifact",
    expectedMessage: "resumed Work State must reference approved replacement",
    mutate(copyRoot) {
      const scenario = writeRerouteScenario(copyRoot, "later-missing-provenance");
      writeApprovedReplacement(copyRoot, "later-missing-provenance", scenario.taskId, scenario.reroutePath, 3);
      writeLaterActiveState(copyRoot, "later-missing-provenance", scenario.taskId, scenario.reroutePath, 3);
    }
  },
  {
    name: "pending Re-route Required rejects coding after approval in next action",
    expectedMessage: "pending Re-route Required next safe action must wait for approval",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "pending-start-coding", {
        nextSafeAction: "Request developer approval, then start coding the replacement route."
      });
    }
  },
  {
    name: "pending Re-route Required rejects positive strategy work after a negated verb",
    expectedMessage: "pending Re-route Required next safe action must wait for approval",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "pending-mixed-polarity", {
        nextSafeAction: "Do not continue the old route and instead implement the replacement; request developer approval."
      });
    }
  },
  {
    name: "unrelated task approval cannot supersede pending Re-route Required",
    expectedMessage: "pending Re-route Required requires waiting_for_developer Work State",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "unrelated-approval", {
        lifecycleState: "active",
        approval: true,
        approvalTaskId: "regression-unrelated-task"
      });
    }
  },
  {
    name: "approval without checkpoint provenance cannot supersede pending Re-route Required",
    expectedMessage: "pending Re-route Required requires waiting_for_developer Work State",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "unproven-approval", {
        lifecycleState: "active",
        approval: true,
        omitApprovalGateProvenance: true
      });
    }
  },
  {
    name: "resumed Work State must reference approved replacement artifact",
    expectedMessage: "resumed Work State must reference approved replacement",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "missing-resume-provenance", {
        lifecycleState: "active",
        approval: true,
        resumedReferencesApproval: false
      });
    }
  },
  {
    name: "ambiguous highest approved replacement revision is rejected",
    expectedMessage: "ambiguous approved replacement revision",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "ambiguous-approval", {
        lifecycleState: "active",
        approval: true,
        duplicateApproval: true
      });
    }
  },
  {
    name: "material route invalidation cannot be represented as silent adaptation",
    expectedMessage: "ROUTE_INVALIDATION requires Re-route Required",
    mutate(copyRoot) {
      const record = readJson(path.join(copyRoot, "dogfood", "devswitchboard-reroute-recovery-007.json"));
      record.task_id = "regression-silent-route-adaptation";
      record.measurements.re_routes = [];
      writeJson(path.join(copyRoot, "dogfood", "regression-silent-route-adaptation.json"), record);
    }
  },
  {
    name: "intent infeasible cannot be encoded as ordinary Re-route Required",
    expectedMessage: "intent infeasible requires Conflict Report",
    mutate(copyRoot) {
      writeRerouteScenario(copyRoot, "intent-infeasible", { intentInfeasible: true });
    }
  },
  {
    name: "equivalent intent conflict wording cannot be encoded as ordinary reroute",
    expectedMessage: "intent infeasible requires Conflict Report",
    mutate(copyRoot) {
      const scenario = writeRerouteScenario(copyRoot, "intent-conflict-ordering");
      rewriteJson(path.join(copyRoot, scenario.reroutePath), (reroute) => {
        reroute.trigger = "Live evidence shows safe implementation cannot preserve approved intent.";
      });
    }
  },
  {
    name: "pending Conflict Report requires a matching Work State",
    expectedMessage: "pending Conflict Report requires a matching Work State",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-missing-state", { omitWorkState: true });
    }
  },
  {
    name: "pending Conflict Report rejects active implementation",
    expectedMessage: "pending Conflict Report requires blocked_by_conflict Work State",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-pending-active", { lifecycleState: "active" });
    }
  },
  {
    name: "pending Conflict Report rejects premature completion",
    expectedMessage: "pending Conflict Report cannot be complete",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-pending-complete", { lifecycleState: "complete" });
    }
  },
  {
    name: "pending Conflict Report rejects strategy-dependent next action",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-pending-action", {
        nextSafeAction: "Continue implementation while the developer decides."
      });
    }
  },
  {
    name: "pending Conflict Report rejects later-revision active continuation",
    expectedMessage: "pending Conflict Report requires blocked_by_conflict Work State",
    mutate(copyRoot) {
      const scenario = writeConflictScenario(copyRoot, "conflict-pending-later-active");
      writeLaterConflictState(
        copyRoot,
        "conflict-pending-later-active",
        scenario.taskId,
        scenario.conflictPath,
        3
      );
    }
  },
  {
    name: "pending Conflict Report rejects a later active state that omits report provenance",
    expectedMessage: "post-conflict Work State must reference Conflict Report",
    mutate(copyRoot) {
      const scenario = writeConflictScenario(copyRoot, "conflict-pending-omitted-report");
      const statePath = writeLaterConflictState(
        copyRoot,
        "conflict-pending-omitted-report",
        scenario.taskId,
        scenario.conflictPath,
        3
      );
      rewriteJson(path.join(copyRoot, statePath), (state) => {
        state.authoritative_artifacts = ["docs/state-and-recovery.md"];
      });
    }
  },
  {
    name: "unrelated task approval cannot resolve pending Conflict Report",
    expectedMessage: "pending Conflict Report requires blocked_by_conflict Work State",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-unrelated-approval", {
        lifecycleState: "active",
        approval: true,
        approvalTaskId: "regression-unrelated-conflict-task"
      });
    }
  },
  {
    name: "approval without exact Conflict Report provenance cannot resolve pending conflict",
    expectedMessage: "pending Conflict Report requires blocked_by_conflict Work State",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-unproven-approval", {
        lifecycleState: "active",
        approval: true,
        omitApprovalGateProvenance: true
      });
    }
  },
  {
    name: "unapproved handoff cannot resolve pending Conflict Report",
    expectedMessage: "expected constant true",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-unapproved-handoff", {
        lifecycleState: "active",
        approval: true,
        unapproved: true
      });
    }
  },
  {
    name: "resumed conflict Work State must reference approved intent revision",
    expectedMessage: "resumed conflict Work State must reference approved intent revision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-missing-resume-provenance", {
        lifecycleState: "active",
        approval: true,
        resumedReferencesApproval: false
      });
    }
  },
  {
    name: "approved conflict resolution rejects active state omitting report and approval provenance",
    expectedMessage: "post-conflict Work State must reference Conflict Report",
    mutate(copyRoot) {
      const scenario = writeConflictScenario(copyRoot, "conflict-approved-omitted-provenance");
      const approvalPath = writeApprovedConflictResolution(
        copyRoot,
        "conflict-approved-omitted-provenance",
        scenario.taskId,
        scenario.conflictPath,
        2
      );
      const statePath = writeLaterConflictState(
        copyRoot,
        "conflict-approved-omitted-provenance",
        scenario.taskId,
        scenario.conflictPath,
        2,
        approvalPath
      );
      rewriteJson(path.join(copyRoot, statePath), (state) => {
        state.authoritative_artifacts = ["docs/state-and-recovery.md"];
      });
    }
  },
  {
    name: "approved conflict resolution preserves a historical blocked checkpoint",
    expectedMessage: "Conflict Report lifecycle requires historical blocked checkpoint Work State",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-missing-history", {
        lifecycleState: "active",
        approval: true,
        omitHistoricalCheckpoint: true
      });
    }
  },
  {
    name: "ambiguous highest approved conflict resolution is rejected",
    expectedMessage: "ambiguous approved conflict resolution revision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-ambiguous-approval", {
        lifecycleState: "active",
        approval: true,
        duplicateApproval: true
      });
    }
  },
  {
    name: "pending Conflict Report rejects build and ship after requesting approval",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-build-ship", {
        nextSafeAction: "Ask the developer to approve option A, then build and ship the change."
      });
    }
  },
  {
    name: "pending Conflict Report rejects write and apply after requesting approval",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-write-apply", {
        nextSafeAction: "Request a developer decision, then write and apply the patch."
      });
    }
  },
  {
    name: "pending Conflict Report rejects test and validate after requesting approval",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-test-validate", {
        nextSafeAction: "Return the Conflict Report for a developer decision, then test and validate the implementation."
      });
    }
  },
  {
    name: "pending Conflict Report rejects alter appended to an approval request",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-alter", {
        nextSafeAction: "Ask the developer to approve option A and alter the implementation."
      });
    }
  },
  {
    name: "pending Conflict Report rejects overwrite appended to a decision request",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-overwrite", {
        nextSafeAction: "Request a developer decision and overwrite the workflow record."
      });
    }
  },
  {
    name: "pending Conflict Report rejects refactor appended to a report return",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-refactor", {
        nextSafeAction: "Return the Conflict Report for a developer intent decision and refactor the verifier."
      });
    }
  },
  {
    name: "pending Conflict Report rejects affirmative refactor hidden after a prohibition",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-prohibition-refactor", {
        nextSafeAction: "Do not continue implementation and you should refactor the verifier; return the Conflict Report for a developer intent decision."
      });
    }
  },
  {
    name: "pending Conflict Report rejects affirmative overwrite hidden after a prohibition",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-prohibition-overwrite", {
        nextSafeAction: "Do not continue implementation and you should overwrite the workflow record; return the Conflict Report for a developer intent decision."
      });
    }
  },
  {
    name: "pending Conflict Report rejects a colon imperative after a prohibition",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-prohibition-colon", {
        nextSafeAction: "Do not continue implementation: refactor the verifier; return the Conflict Report for a developer intent decision."
      });
    }
  },
  {
    name: "pending Conflict Report rejects a dash imperative after a prohibition",
    expectedMessage: "pending Conflict Report next safe action must wait for a developer intent decision",
    mutate(copyRoot) {
      writeConflictScenario(copyRoot, "conflict-action-prohibition-dash", {
        nextSafeAction: "Do not continue implementation — overwrite the workflow record; return the Conflict Report for a developer intent decision."
      });
    }
  },
  {
    name: "intent conflict cannot be recorded without a same-task Conflict Report",
    expectedMessage: "INTENT_CONFLICT requires Conflict Report",
    mutate(copyRoot) {
      const record = readJson(path.join(copyRoot, "dogfood", "devswitchboard-conflict-recovery-008.json"));
      record.task_id = "regression-silent-intent-conflict";
      writeJson(path.join(copyRoot, "dogfood", "regression-silent-intent-conflict.json"), record);
    }
  },
  {
    name: "Local Delta cannot omit record-level relevance evidence",
    expectedMessage: "missing required property evidence",
    mutate(copyRoot) {
      const record = validLocalDelta();
      delete record.relevance.evidence;
      writeJson(path.join(copyRoot, "examples", "local-delta.json"), record);
    }
  },
  {
    name: "Local Delta cannot claim a file is relevant without evidence",
    expectedMessage: "expected at least 1 items",
    mutate(copyRoot) {
      const record = validLocalDelta();
      record.changed_files[0].evidence = [];
      writeJson(path.join(copyRoot, "examples", "local-delta.json"), record);
    }
  },
  {
    name: "Local Delta cannot select a permissive schema",
    expectedMessage: "noncanonical schema selection",
    mutate(copyRoot) {
      writeJson(path.join(copyRoot, "schemas", "permissive.schema.json"), {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        type: "object"
      });
      const record = validLocalDelta();
      record.$schema_file = "../schemas/permissive.schema.json";
      writeJson(path.join(copyRoot, "examples", "local-delta.json"), record);
    }
  },
  {
    name: "canonical Local Delta path cannot masquerade as another record kind",
    expectedMessage: "noncanonical schema selection",
    mutate(copyRoot) {
      const otherRecord = JSON.parse(fs.readFileSync(path.join(copyRoot, "examples", "verification-report.json"), "utf8"));
      writeJson(path.join(copyRoot, "examples", "local-delta.json"), otherRecord);
    }
  },
  {
    name: "canonical Micro Consultation response path cannot masquerade as another record kind",
    expectedMessage: "noncanonical schema selection",
    mutate(copyRoot) {
      const otherRecord = JSON.parse(fs.readFileSync(path.join(copyRoot, "examples", "verification-report.json"), "utf8"));
      writeJson(path.join(copyRoot, "examples", "micro-consultation-response.json"), otherRecord);
    }
  },
  {
    name: "mandatory Dogfood 004 Local Delta checkpoint cannot be deleted",
    expectedMessage: "missing dogfood/devswitchboard-local-context-bridge-004-local-delta.json",
    mutate(copyRoot) {
      fs.rmSync(path.join(copyRoot, "dogfood", "devswitchboard-local-context-bridge-004-local-delta.json"));
    }
  },
  {
    name: "uninitialized Local Delta cannot identify a remote baseline",
    expectedMessage: "uninitialized Local Delta cannot identify a remote baseline",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "local-delta.json"), (record) => {
        record.local.baseline_state = "uninitialized";
      });
    }
  },
  {
    name: "synced Local Delta requires a clean tree at the baseline SHA",
    expectedMessage: "synced Local Delta requires a clean working tree at the baseline SHA",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "local-delta.json"), (record) => {
        record.local.baseline_state = "synced";
      });
    }
  },
  {
    name: "Local Delta aggregate relevance cannot hide a relevant changed file",
    expectedMessage: "Local Delta aggregate relevance contradicts a relevant changed file",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "local-delta.json"), (record) => {
        record.relevance.relevant_to_task = false;
      });
    }
  },
  {
    name: "task-relevant Local Delta cannot have an empty changed-file inventory",
    expectedMessage: "task-relevant Local Delta requires at least one relevant changed file",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "local-delta.json"), (record) => {
        record.changed_files = [];
      });
    }
  },
  {
    name: "task-relevant Local Delta cannot have only irrelevant changed files",
    expectedMessage: "task-relevant Local Delta requires at least one relevant changed file",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "local-delta.json"), (record) => {
        record.changed_files[0].relevant_to_task = false;
      });
    }
  },
  {
    name: "ready Local Delta cannot represent a synced baseline",
    expectedMessage: "ready Local Delta requires diverged or uninitialized local truth",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "local-delta.json"), (record) => {
        record.local.baseline_state = "synced";
        record.local.working_tree = "clean";
      });
    }
  },
  {
    name: "ready Local Delta cannot represent an unknown baseline relation",
    expectedMessage: "ready Local Delta requires diverged or uninitialized local truth",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "local-delta.json"), (record) => {
        record.local.baseline_state = "unknown";
      });
    }
  },
  {
    name: "ready Local Delta cannot represent irrelevant divergence",
    expectedMessage: "ready Local Delta requires task-relevant local truth",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "local-delta.json"), (record) => {
        record.relevance.relevant_to_task = false;
        record.changed_files[0].relevant_to_task = false;
      });
    }
  },
  {
    name: "repository-fact consultation cannot authorize intent changes",
    expectedMessage: "expected constant false",
    mutate(copyRoot) {
      const request = validMicroConsultationRequest();
      request.authority.may_change_intent = true;
      writeJson(path.join(copyRoot, "examples", "micro-consultation-request.json"), request);
    }
  },
  {
    name: "Micro Consultation must cross between Chat and Codex",
    expectedMessage: "expected exactly one oneOf branch",
    mutate(copyRoot) {
      rewriteJson(path.join(copyRoot, "examples", "micro-consultation-request.json"), (request) => {
        request.responder = "chat";
      });
      rewriteJson(path.join(copyRoot, "examples", "micro-consultation-response.json"), (response) => {
        response.responder = "chat";
      });
    }
  },
  {
    name: "Micro Consultation response must link to its canonical request",
    expectedMessage: "Micro Consultation response does not link to a canonical request",
    mutate(copyRoot) {
      const request = validMicroConsultationRequest();
      const response = validMicroConsultationResponse();
      response.in_response_to.consultation_id = "MC-unrelated-999";
      writeJson(path.join(copyRoot, "examples", "micro-consultation-request.json"), request);
      writeJson(path.join(copyRoot, "examples", "micro-consultation-response.json"), response);
    }
  },
  {
    name: "Micro Consultation request identity must be unique",
    expectedMessage: "duplicate Micro Consultation request identity",
    mutate(copyRoot) {
      const request = JSON.parse(fs.readFileSync(path.join(copyRoot, "examples", "micro-consultation-request.json"), "utf8"));
      writeJson(path.join(copyRoot, "examples", "micro-consultation-request-duplicate.json"), request);
    }
  }
]) {
  try {
    expectRejected(regression.name, regression.mutate, regression.expectedMessage);
  } catch (error) {
    failures.push(error.message);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`regression: FAIL: ${failure}`);
  process.exitCode = 1;
} else {
  console.log("workflow-integrity regressions: PASS");
}
