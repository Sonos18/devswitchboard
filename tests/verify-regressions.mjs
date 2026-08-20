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
