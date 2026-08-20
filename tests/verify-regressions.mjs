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

const baseline = runVerifier(root);
if (baseline.status !== 0) {
  throw new Error(`baseline verifier must pass before regression cases run\n${baseline.stdout}${baseline.stderr}`);
}

const failures = [];
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
