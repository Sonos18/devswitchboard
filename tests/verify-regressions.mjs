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
