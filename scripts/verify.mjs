import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const schemaCache = new Map();
const canonicalSchemaFiles = new Map([
  ["approved_handoff", "approved-handoff.schema.json"],
  ["codex_preflight", "codex-preflight.schema.json"],
  ["conflict_report", "conflict-report.schema.json"],
  ["dogfood_record", "dogfood-record.schema.json"],
  ["local_delta", "local-delta.schema.json"],
  ["micro_consultation_request", "micro-consultation-request.schema.json"],
  ["micro_consultation_response", "micro-consultation-response.schema.json"],
  ["re_route_required", "re-route-required.schema.json"],
  ["routing_case", "routing-case.schema.json"],
  ["routing_recommendation", "routing-recommendation.schema.json"],
  ["task_profile", "task-profile.schema.json"],
  ["verification_report", "verification-report.schema.json"],
  ["work_state", "work-state.schema.json"]
]);
const pinnedSchemaFiles = new Map([
  ["examples/devswitchboard-approved-handoff.json", "approved-handoff.schema.json"],
  ["examples/local-delta.json", "local-delta.schema.json"],
  ["examples/micro-consultation-request.json", "micro-consultation-request.schema.json"],
  ["examples/micro-consultation-response.json", "micro-consultation-response.schema.json"],
  ["dogfood/devswitchboard-local-context-bridge-004-local-delta.json", "local-delta.schema.json"],
  ["dogfood/devswitchboard-local-context-bridge-004.json", "dogfood-record.schema.json"]
]);

function fail(group, message) {
  failures.push(`${group}: ${message}`);
}

function loadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail("JSON syntax", `${path.relative(root, file)}: ${error.message}`);
    return null;
  }
}

function loadSchema(file) {
  const absolute = path.resolve(file);
  if (!schemaCache.has(absolute)) schemaCache.set(absolute, loadJson(absolute));
  return schemaCache.get(absolute);
}

function pointerValue(document, fragment) {
  if (!fragment || fragment === "#") return document;
  return fragment
    .replace(/^#\//, "")
    .split("/")
    .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"))
    .reduce((value, key) => value?.[key], document);
}

function resolveReference(reference, schemaFile, rootSchema) {
  if (reference.startsWith("#")) {
    return { schema: pointerValue(rootSchema, reference), schemaFile, rootSchema };
  }
  const [relativeFile, fragment = ""] = reference.split("#");
  const referencedFile = path.resolve(path.dirname(schemaFile), relativeFile);
  const referencedRoot = loadSchema(referencedFile);
  return {
    schema: pointerValue(referencedRoot, fragment ? `#${fragment}` : "#"),
    schemaFile: referencedFile,
    rootSchema: referencedRoot
  };
}

function sameValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function validate(value, schema, schemaFile, rootSchema, location = "$") {
  const errors = [];
  if (!schema) return [`${location}: referenced schema was not found`];

  if (schema.$ref) {
    const resolved = resolveReference(schema.$ref, schemaFile, rootSchema);
    errors.push(...validate(value, resolved.schema, resolved.schemaFile, resolved.rootSchema, location));
    schema = { ...schema };
    delete schema.$ref;
  }

  if (schema.oneOf) {
    const matches = schema.oneOf.filter((candidate) => validate(value, candidate, schemaFile, rootSchema, location).length === 0);
    if (matches.length !== 1) errors.push(`${location}: expected exactly one oneOf branch, matched ${matches.length}`);
  }

  if (Object.hasOwn(schema, "const") && !sameValue(value, schema.const)) {
    errors.push(`${location}: expected constant ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.some((item) => sameValue(value, item))) {
    errors.push(`${location}: expected one of ${schema.enum.map((item) => JSON.stringify(item)).join(", ")}`);
  }

  const typeMatches = {
    object: value !== null && typeof value === "object" && !Array.isArray(value),
    array: Array.isArray(value),
    string: typeof value === "string",
    boolean: typeof value === "boolean",
    integer: Number.isInteger(value),
    number: typeof value === "number" && Number.isFinite(value),
    null: value === null
  };
  if (schema.type && !typeMatches[schema.type]) {
    errors.push(`${location}: expected ${schema.type}`);
    return errors;
  }

  if (typeMatches.object) {
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required)) errors.push(`${location}: missing required property ${required}`);
    }
    for (const [key, child] of Object.entries(value)) {
      if (schema.properties?.[key]) {
        errors.push(...validate(child, schema.properties[key], schemaFile, rootSchema, `${location}.${key}`));
      } else if (schema.additionalProperties === false) {
        errors.push(`${location}: unexpected property ${key}`);
      }
    }
  }

  if (typeMatches.array) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${location}: expected at least ${schema.minItems} items`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${location}: expected at most ${schema.maxItems} items`);
    }
    if (schema.items) {
      value.forEach((item, index) => errors.push(...validate(item, schema.items, schemaFile, rootSchema, `${location}[${index}]`)));
    }
  }

  if (typeMatches.string) {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${location}: expected at least ${schema.minLength} characters`);
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${location}: does not match ${schema.pattern}`);
    }
  }

  if ((typeMatches.integer || typeMatches.number) && schema.minimum !== undefined && value < schema.minimum) {
    errors.push(`${location}: expected value >= ${schema.minimum}`);
  }
  return errors;
}

function walk(directory, predicate = () => true) {
  const results = [];
  if (!fs.existsSync(directory)) return results;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...walk(absolute, predicate));
    else if (predicate(absolute)) results.push(absolute);
  }
  return results;
}

function recordPath(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function artifactPath(value) {
  return typeof value === "string" ? value.replace(/\\/g, "/").replace(/^\.\//, "") : "";
}

function collectRecords() {
  const records = [];
  for (const directory of ["examples", "dogfood"]) {
    for (const file of walk(path.join(root, directory), (candidate) => candidate.endsWith(".json"))) {
      const record = loadJson(file);
      if (record) records.push({ file, path: recordPath(file), record });
    }
  }
  return records;
}

function referencesArtifact(record, expectedPath) {
  return (record.authoritative_artifacts ?? []).some((value) => artifactPath(value) === expectedPath);
}

const baseStrategyWorkPattern = "(?:start|begin)\\s+(?:the\\s+)?(?:implementation|execution|coding|planning|modification|work)|implement(?:s|ed|ing)?|execut(?:e|es|ed|ing)|modif(?:y|ies|ied|ying)|continu(?:e|es|ed|ing)|resum(?:e|es|ed|ing)|plan(?:s|ned|ning)?|cod(?:e|es|ed|ing)";
const extendedStrategyWorkPattern = "|verif(?:y|ies|ied|ying)|complet(?:e|es|ed|ing)|build(?:s|ing|built)?|ship(?:s|ped|ping)?|edit(?:s|ed|ing)?|writ(?:e|es|ten|ing)|appl(?:y|ies|ied|ying)|patch(?:es|ed|ing)?|test(?:s|ed|ing)?|validat(?:e|es|ed|ing)|deploy(?:s|ed|ing)?|publish(?:es|ed|ing)?|commit(?:s|ted|ting)?|push(?:es|ed|ing)?|merg(?:e|es|ed|ing)|creat(?:e|es|ed|ing)|add(?:s|ed|ing)?|delet(?:e|es|ed|ing)|remov(?:e|es|ed|ing)|run(?:s|ning)?";

function containsPositiveStrategyWork(action, includeCompletionWork = false) {
  const clauses = action.split(/[.;,]|\b(?:and then|but|then)\b/i);
  return clauses.some((clause) => {
    const strategyMatches = [...clause.matchAll(new RegExp(`\\b(${baseStrategyWorkPattern}${includeCompletionWork ? extendedStrategyWorkPattern : ""})\\b`, "gi"))];
    let previousEnd = 0;
    let prohibitionActive = false;
    for (const strategyMatch of strategyMatches) {
      const connector = clause.slice(previousEnd, strategyMatch.index);
      const explicitProhibition = /\b(do not|don't|must not|may not|cannot|can't|without)\s*$/i.test(connector);
      const coordinatedProhibition = prohibitionActive && /^\s*(?:and|or)\s*$/i.test(connector);
      prohibitionActive = explicitProhibition || coordinatedProhibition;
      if (!prohibitionActive) return true;
      previousEnd = strategyMatch.index + strategyMatch[0].length;
    }
    return false;
  });
}

function isExplicitStrategyProhibition(clause) {
  const match = /^(?:do not|don't|must not|may not|cannot|can't)\s+(.+)$/i.exec(clause);
  if (!match) return false;
  const prohibitedSegments = match[1].split(/\s+(?:and|or)\s+/i);
  const workObjectToken = "(?:the|this|that|approved|current|old|new|replacement|strategy-dependent|repository|workflow|implementation|execution|coding|planning|modification|work|route|task|change|changes|code|patch|file|files|verifier|record|records)";
  const prohibitedPredicate = new RegExp(
    `^(?:${baseStrategyWorkPattern}${extendedStrategyWorkPattern})(?:\\s+${workObjectToken}){0,6}$`,
    "i"
  );
  return prohibitedSegments.every((segment) => prohibitedPredicate.test(segment.trim()));
}

function isApprovalOrientedNextAction(action) {
  if (typeof action !== "string") return false;
  const requestsApproval = /(approv\w*|route evaluation|return\b.*re-?route)/i.test(action);
  return requestsApproval && !containsPositiveStrategyWork(action);
}

function isDeveloperDecisionOrientedNextAction(action) {
  if (typeof action !== "string") return false;
  if (containsPositiveStrategyWork(action, true)) return false;
  const clauses = action
    .split(/[.;,]|\b(?:and then|but|then)\b/i)
    .map((clause) => clause.trim())
    .filter(Boolean);
  return clauses.length > 0 && clauses.every((clause) => {
    const explicitProhibition = isExplicitStrategyProhibition(clause);
    const returnsReport = /^(?:return|send|present)\s+(?:(?:this|the)\s+)?conflict report(?:\s+to\s+(?:chat(?:\s+and\s+(?:the\s+)?developer)?|(?:the\s+)?developer))?(?:\s+for\s+(?:(?:a|the)\s+)?(?:non-mutating\s+)?(?:(?:developer|intent)\s+)*(?:decision|approval|resolution))?$/i.test(clause);
    const requestsDeveloperDecision = /^ask\s+(?:the\s+)?developer\s+to\s+(?:decide|approve|resolve|choose|select)(?:\s+(?:the\s+)?(?:option(?:\s+[a-z0-9_-]+)?|resolution|intent|conflict))?$/i.test(clause)
      || /^(?:ask|request|seek|await|wait for|obtain)\s+(?:(?:a|the)\s+)?developer\s+(?:for\s+)?(?:(?:a|the)\s+)?(?:intent\s+)?(?:decision|approval|resolution|choice|selection)$/i.test(clause);
    return explicitProhibition || returnsReport || requestsDeveloperDecision;
  });
}

function statesIntentInfeasible(record) {
  const evidence = [record.trigger, ...(record.updated_profile_evidence ?? [])]
    .filter((value) => typeof value === "string");
  if (evidence.some((value) => /intent_feasibility\s*:\s*infeasible\b/i.test(value))) return true;

  const conflictPattern = /approved intent (?:cannot|can not) be preserved safely|safe implementation (?:cannot|can not) preserve approved intent|approved intent (?:is |remains )?infeasible/i;
  for (const value of evidence) {
    for (const clause of value.split(/[.;]/)) {
      const conflictMatch = conflictPattern.exec(clause);
      if (!conflictMatch) continue;
      const prefix = clause.slice(0, conflictMatch.index);
      const isNegatedOrHypothetical = /\b(no evidence|without evidence|not established|hypothetical|if|unless|whether)\b/i.test(prefix);
      if (!isNegatedOrHypothetical) return true;
    }
  }
  return false;
}

function checkRequiredStructure() {
  const required = [
    "README.md", "LICENSE", "CONTRIBUTING.md",
    "docs/superpowers/specs/2026-08-20-devswitchboard-v0.1-design.md",
    "docs/superpowers/specs/2026-08-20-local-context-bridge-restoration.md",
    "docs/superpowers/plans/2026-08-20-devswitchboard-bootstrap.md",
    "docs/superpowers/plans/2026-08-20-local-context-bridge-restoration.md",
    "docs/contracts/README.md", "docs/workflows/chat.md", "docs/workflows/codex.md",
    "docs/contracts/local-delta.md", "schemas/local-delta.schema.json", "examples/local-delta.json",
    "docs/contracts/micro-consultation.md",
    "schemas/micro-consultation-request.schema.json", "schemas/micro-consultation-response.schema.json",
    "examples/micro-consultation-request.json", "examples/micro-consultation-response.json",
    "docs/routing/rules.md", "docs/adapters/superpowers.md", "docs/state-and-recovery.md",
    "examples/low-risk-doc-fix.json", "examples/architectural-feature.json",
    "examples/security-sensitive-change.json", "dogfood/measurement-template.json",
    "examples/devswitchboard-approved-handoff.json", "examples/codex-preflight.json",
    "examples/conflict-report.json", "examples/conflict-report-work-state.json",
    "examples/re-route-required.json",
    "examples/re-route-required-work-state.json",
    "examples/work-state.json", "examples/verification-report.json",
    "dogfood/devswitchboard-bootstrap-001.json",
    "dogfood/devswitchboard-local-context-bridge-004-local-delta.json",
    "dogfood/devswitchboard-local-context-bridge-004.json"
  ];
  for (const relative of required) {
    if (!fs.existsSync(path.join(root, relative))) fail("structure", `missing ${relative}`);
  }
  const forbidden = ["src/cli", ".codex-plugin", "app", "pages"];
  for (const relative of forbidden) {
    if (fs.existsSync(path.join(root, relative))) fail("scope", `forbidden v0.1 path exists: ${relative}`);
  }
}

function checkJsonAndSchemas() {
  for (const schemaFile of walk(path.join(root, "schemas"), (file) => file.endsWith(".json"))) loadSchema(schemaFile);
  for (const directory of ["examples", "dogfood"]) {
    for (const recordFile of walk(path.join(root, directory), (file) => file.endsWith(".json"))) {
      const record = loadJson(recordFile);
      if (!record) continue;
      if (!record.$schema_file) {
        fail("schema conformance", `${path.relative(root, recordFile)}: missing $schema_file`);
        continue;
      }
      const schemaFile = path.resolve(path.dirname(recordFile), record.$schema_file);
      const recordPath = path.relative(root, recordFile).split(path.sep).join("/");
      const canonicalSchemaName = pinnedSchemaFiles.get(recordPath) ?? canonicalSchemaFiles.get(record.schema);
      const canonicalSchemaFile = canonicalSchemaName && path.join(root, "schemas", canonicalSchemaName);
      if (!canonicalSchemaFile || path.normalize(schemaFile) !== path.normalize(canonicalSchemaFile)) {
        fail("schema conformance", `${path.relative(root, recordFile)}: noncanonical schema selection`);
        continue;
      }
      if (!fs.existsSync(schemaFile)) {
        fail("schema conformance", `${path.relative(root, recordFile)}: schema file does not exist`);
        continue;
      }
      const schema = loadSchema(schemaFile);
      for (const error of validate(record, schema, schemaFile, schema)) {
        fail("schema conformance", `${path.relative(root, recordFile)} ${error}`);
      }
    }
  }

  const consultationRequests = new Map();
  const consultationResponses = [];
  for (const directory of ["examples", "dogfood"]) {
    for (const file of walk(path.join(root, directory), (candidate) => candidate.endsWith(".json"))) {
      const record = loadJson(file);
      if (record?.schema === "micro_consultation_request") {
        const key = `${record.task_id}:${record.consultation_id}:${record.revision}`;
        if (consultationRequests.has(key)) {
          const firstFile = consultationRequests.get(key).file;
          fail("semantic invariants", `${path.relative(root, file)}: duplicate Micro Consultation request identity also used by ${path.relative(root, firstFile)}`);
        } else {
          consultationRequests.set(key, { file, record });
        }
        if (record.consultation_type === "repository_fact" && record.authority?.may_change_intent !== false) {
          fail("semantic invariants", `${path.relative(root, file)}: repository-fact consultation cannot authorize intent changes`);
        }
        if (record.authority?.may_transfer_phase_ownership !== false) {
          fail("semantic invariants", `${path.relative(root, file)}: Micro Consultation cannot transfer phase ownership`);
        }
      }
      if (record?.schema === "micro_consultation_response") consultationResponses.push({ file, record });
    }
  }
  for (const { file, record } of consultationResponses) {
    const link = record.in_response_to;
    const key = `${record.task_id}:${link?.consultation_id}:${link?.request_revision}`;
    const request = consultationRequests.get(key)?.record;
    const linked = request
      && record.consultation_id === request.consultation_id
      && record.requester === request.requester
      && record.responder === request.responder
      && record.phase_owner === request.phase_owner
      && record.consultation_type === request.consultation_type;
    if (!linked) {
      fail("semantic invariants", `${path.relative(root, file)}: Micro Consultation response does not link to a canonical request`);
    }
    if (record.decision !== "none") {
      fail("semantic invariants", `${path.relative(root, file)}: fact-only Micro Consultation response decision must be none`);
    }
  }
}

function checkSemanticInvariants() {
  const handoff = loadJson(path.join(root, "examples/devswitchboard-approved-handoff.json"));
  if (handoff) {
    if (handoff.status === "ready_for_codex_preflight" && handoff.task_profile?.profile_status !== "final") {
      fail("semantic invariants", "ready Approved Handoff requires a final Task Profile");
    }
    if (handoff.developer_decisions?.implementation_subagents !== handoff.approved_strategy?.implementation_subagents) {
      fail("semantic invariants", "Approved Handoff implementation-subagent decisions disagree");
    }
    if (handoff.developer_decisions?.workspace_isolation !== handoff.approved_strategy?.workspace_isolation) {
      fail("semantic invariants", "Approved Handoff workspace-isolation decisions disagree");
    }
    if (handoff.routing?.implementation?.subagents !== handoff.approved_strategy?.implementation_subagents) {
      fail("semantic invariants", "Approved Handoff routing and strategy disagree on implementation subagents");
    }
    if (handoff.routing?.review?.subagent !== handoff.approved_strategy?.review_subagent) {
      fail("semantic invariants", "Approved Handoff routing and strategy disagree on review subagent use");
    }
    if (handoff.execution?.isolation?.recommended !== handoff.approved_strategy?.workspace_isolation) {
      fail("semantic invariants", "Approved Handoff execution and strategy disagree on isolation");
    }
    for (const gate of handoff.completed_gates ?? []) {
      if (gate.status === "reused" && /verification/i.test(gate.gate)) {
        fail("semantic invariants", "final verification cannot be recorded as a reused gate");
      }
    }
  }

  const preflight = loadJson(path.join(root, "examples/codex-preflight.json"));
  if (preflight) {
    const blocked = preflight.outcome === "blocked_by_conflict";
    if (blocked !== (preflight.conflicts?.length > 0)) {
      fail("semantic invariants", "Codex Preflight outcome and conflicts array disagree");
    }
    if (blocked && !/conflict report/i.test(preflight.next_action)) {
      fail("semantic invariants", "blocked Codex Preflight must direct the producer to a Conflict Report");
    }
  }

  const reports = walk(path.join(root, "examples"), (file) => file.endsWith(".json"));
  for (const file of reports) {
    const record = loadJson(file);
    if (record?.schema !== "verification_report") continue;
    const failedChecks = record.checks.filter((check) => check.result === "fail");
    if (record.status === "pass" && (failedChecks.length || record.failed_criteria.length)) {
      fail("semantic invariants", `${path.relative(root, file)} passes with failed evidence`);
    }
    if (record.status === "fail" && !failedChecks.length && !record.failed_criteria.length) {
      fail("semantic invariants", `${path.relative(root, file)} fails without failed evidence`);
    }
  }

  for (const directory of ["examples", "dogfood"]) {
    for (const file of walk(path.join(root, directory), (candidate) => candidate.endsWith(".json"))) {
      const record = loadJson(file);
      if (record?.schema === "work_state" && record.lifecycle_state === "complete" && record.verification_state !== "passed") {
        fail("semantic invariants", `${path.relative(root, file)}: complete Work State requires passed verification`);
      }
      if (record?.schema === "local_delta") {
        const baselineState = record.local?.baseline_state;
        const remote = record.repository?.remote;
        const baselineSha = record.repository?.baseline_sha;
        const localHead = record.local?.head;
        const workingTree = record.local?.working_tree;
        const relevantFiles = (record.changed_files ?? []).filter((changedFile) => changedFile.relevant_to_task);

        if (baselineState === "uninitialized" && (remote !== null || baselineSha !== null)) {
          fail("semantic invariants", `${path.relative(root, file)}: uninitialized Local Delta cannot identify a remote baseline`);
        }
        if (baselineState === "synced" && (remote === null || baselineSha === null || localHead !== baselineSha || workingTree !== "clean")) {
          fail("semantic invariants", `${path.relative(root, file)}: synced Local Delta requires a clean working tree at the baseline SHA`);
        }
        if (baselineState === "diverged" && (remote === null || baselineSha === null || (localHead === baselineSha && workingTree === "clean"))) {
          fail("semantic invariants", `${path.relative(root, file)}: diverged Local Delta requires a remote baseline and an actual local difference`);
        }
        if (record.status === "ready_for_handoff" && !record.relevance?.relevant_to_task) {
          fail("semantic invariants", `${path.relative(root, file)}: ready Local Delta requires task-relevant local truth`);
        }
        if (record.status === "ready_for_handoff" && !["diverged", "uninitialized"].includes(baselineState)) {
          fail("semantic invariants", `${path.relative(root, file)}: ready Local Delta requires diverged or uninitialized local truth`);
        }
        if (record.relevance?.relevant_to_task && !record.relevance.evidence?.length) {
          fail("semantic invariants", `${path.relative(root, file)}: task-relevant Local Delta requires relevance evidence`);
        }
        if (!record.relevance?.relevant_to_task && relevantFiles.length) {
          fail("semantic invariants", `${path.relative(root, file)}: Local Delta aggregate relevance contradicts a relevant changed file`);
        }
        if (record.relevance?.relevant_to_task && !relevantFiles.length) {
          fail("semantic invariants", `${path.relative(root, file)}: task-relevant Local Delta requires at least one relevant changed file`);
        }
        for (const changedFile of record.changed_files ?? []) {
          if (changedFile.relevant_to_task && !changedFile.evidence?.length) {
            fail("semantic invariants", `${path.relative(root, file)}: task-relevant changed file requires evidence`);
          }
        }
      }
    }
  }

  const records = collectRecords();
  const reroutes = records.filter(({ record }) => record.schema === "re_route_required");
  const conflictReports = records.filter(({ record }) => record.schema === "conflict_report");
  const workStates = records.filter(({ record }) => record.schema === "work_state");
  const approvedHandoffs = records.filter(({ record }) => record.schema === "approved_handoff");

  for (const rerouteEntry of reroutes) {
    const reroute = rerouteEntry.record;
    if (statesIntentInfeasible(reroute)) {
      fail("semantic invariants", `${rerouteEntry.path}: intent infeasible requires Conflict Report`);
    }

    const associatedStates = workStates.filter(({ record }) =>
      record.task_id === reroute.task_id
      && referencesArtifact(record, rerouteEntry.path)
    );
    const checkpointStates = associatedStates.filter(
      ({ record }) => record.active_route?.revision === reroute.revision
    );
    const replacements = approvedHandoffs.filter(({ record }) =>
      record.task_id === reroute.task_id
      && record.revision >= reroute.revision
      && record.status === "ready_for_codex_preflight"
      && record.workflow_state?.developer_approval === true
      && record.developer_decisions?.routing_recommendation_approved === true
      && record.readiness?.developer_approval === true
      && (record.completed_gates ?? []).some((gate) =>
        gate.gate === "re_route_required"
        && gate.status === "approved"
        && artifactPath(gate.evidence_source) === rerouteEntry.path
      )
    );
    const highestReplacementRevision = replacements.reduce(
      (highest, { record }) => Math.max(highest, record.revision),
      -1
    );
    const highestReplacements = replacements.filter(
      ({ record }) => record.revision === highestReplacementRevision
    );

    if (highestReplacements.length > 1) {
      fail("semantic invariants", `${rerouteEntry.path}: ambiguous approved replacement revision`);
      continue;
    }

    const replacement = highestReplacements[0];
    if (!replacement) {
      if (!checkpointStates.length) {
        fail("semantic invariants", `${rerouteEntry.path}: pending Re-route Required requires a matching Work State`);
      }
      for (const stateEntry of associatedStates) {
        const state = stateEntry.record;
        if (state.lifecycle_state === "complete") {
          fail("semantic invariants", `${stateEntry.path}: pending Re-route Required cannot be complete`);
        } else if (state.lifecycle_state !== "waiting_for_developer") {
          fail("semantic invariants", `${stateEntry.path}: pending Re-route Required requires waiting_for_developer Work State`);
        } else if (!isApprovalOrientedNextAction(state.next_safe_action)) {
          fail("semantic invariants", `${stateEntry.path}: pending Re-route Required next safe action must wait for approval`);
        }
      }
      continue;
    }

    for (const stateEntry of associatedStates) {
      const state = stateEntry.record;
      if (!["active", "complete"].includes(state.lifecycle_state)) continue;
      const applicableReplacements = replacements.filter(
        ({ record }) => record.revision <= state.active_route?.revision
      );
      const applicableRevision = applicableReplacements.reduce(
        (highest, { record }) => Math.max(highest, record.revision),
        -1
      );
      const applicableHighest = applicableReplacements.filter(
        ({ record }) => record.revision === applicableRevision
      );
      if (applicableHighest.length > 1) {
        fail("semantic invariants", `${stateEntry.path}: ambiguous approved replacement revision`);
        continue;
      }
      const applicableReplacement = applicableHighest[0];
      if (!applicableReplacement || !referencesArtifact(state, applicableReplacement.path)) {
        fail("semantic invariants", `${stateEntry.path}: resumed Work State must reference approved replacement`);
      }
    }
  }

  for (const conflictEntry of conflictReports) {
    const conflict = conflictEntry.record;
    const postConflictStates = workStates.filter(({ record }) =>
      record.task_id === conflict.task_id
      && record.active_route?.revision >= conflict.revision
    );
    const associatedStates = postConflictStates.filter(({ record }) =>
      referencesArtifact(record, conflictEntry.path)
    );
    for (const stateEntry of postConflictStates) {
      if (!referencesArtifact(stateEntry.record, conflictEntry.path)) {
        fail("semantic invariants", `${stateEntry.path}: post-conflict Work State must reference Conflict Report`);
      }
    }
    const checkpointStates = associatedStates.filter(({ record }) =>
      record.active_route?.revision === conflict.revision
      && record.lifecycle_state === "blocked_by_conflict"
    );
    const resolutions = approvedHandoffs.filter(({ record }) =>
      record.task_id === conflict.task_id
      && record.revision >= conflict.revision
      && record.status === "ready_for_codex_preflight"
      && record.workflow_state?.developer_approval === true
      && record.developer_decisions?.routing_recommendation_approved === true
      && record.readiness?.developer_approval === true
      && (record.completed_gates ?? []).some((gate) =>
        gate.gate === "conflict_report"
        && gate.status === "approved"
        && artifactPath(gate.evidence_source) === conflictEntry.path
      )
    );
    const highestResolutionRevision = resolutions.reduce(
      (highest, { record }) => Math.max(highest, record.revision),
      -1
    );
    const highestResolutions = resolutions.filter(
      ({ record }) => record.revision === highestResolutionRevision
    );

    if (highestResolutions.length > 1) {
      fail("semantic invariants", `${conflictEntry.path}: ambiguous approved conflict resolution revision`);
      continue;
    }

    const resolution = highestResolutions[0];
    if (!resolution) {
      if (!associatedStates.some(({ record }) => record.active_route?.revision === conflict.revision)) {
        fail("semantic invariants", `${conflictEntry.path}: pending Conflict Report requires a matching Work State`);
      }
      for (const stateEntry of associatedStates) {
        const state = stateEntry.record;
        if (state.lifecycle_state === "complete") {
          fail("semantic invariants", `${stateEntry.path}: pending Conflict Report cannot be complete`);
        } else if (state.lifecycle_state !== "blocked_by_conflict") {
          fail("semantic invariants", `${stateEntry.path}: pending Conflict Report requires blocked_by_conflict Work State`);
        } else if (!isDeveloperDecisionOrientedNextAction(state.next_safe_action)) {
          fail("semantic invariants", `${stateEntry.path}: pending Conflict Report next safe action must wait for a developer intent decision`);
        }
      }
      continue;
    }

    if (!checkpointStates.length) {
      fail("semantic invariants", `${conflictEntry.path}: Conflict Report lifecycle requires historical blocked checkpoint Work State`);
    }

    for (const stateEntry of associatedStates) {
      const state = stateEntry.record;
      if (!["active", "complete"].includes(state.lifecycle_state)) continue;
      const applicableResolutions = resolutions.filter(
        ({ record }) => record.revision <= state.active_route?.revision
      );
      const applicableRevision = applicableResolutions.reduce(
        (highest, { record }) => Math.max(highest, record.revision),
        -1
      );
      const applicableHighest = applicableResolutions.filter(
        ({ record }) => record.revision === applicableRevision
      );
      if (applicableHighest.length > 1) {
        fail("semantic invariants", `${stateEntry.path}: ambiguous approved conflict resolution revision`);
        continue;
      }
      const applicableResolution = applicableHighest[0];
      if (!applicableResolution || !referencesArtifact(state, applicableResolution.path)) {
        fail("semantic invariants", `${stateEntry.path}: resumed conflict Work State must reference approved intent revision`);
      }
    }
  }

  for (const recordEntry of records) {
    const hasRouteInvalidation = (recordEntry.record.findings ?? []).some(
      (finding) => finding.type === "ROUTE_INVALIDATION"
    );
    if (hasRouteInvalidation && !reroutes.some(({ record }) => record.task_id === recordEntry.record.task_id)) {
      fail("semantic invariants", `${recordEntry.path}: ROUTE_INVALIDATION requires Re-route Required`);
    }
    const hasIntentConflict = (recordEntry.record.findings ?? []).some(
      (finding) => finding.type === "INTENT_CONFLICT"
    );
    if (hasIntentConflict && !conflictReports.some(({ record }) => record.task_id === recordEntry.record.task_id)) {
      fail("semantic invariants", `${recordEntry.path}: INTENT_CONFLICT requires Conflict Report`);
    }
  }

  for (const file of walk(path.join(root, "dogfood"), (candidate) => candidate.endsWith(".json"))) {
    const record = loadJson(file);
    if (record?.result === "pass" && record.verification?.status !== "pass") {
      fail("semantic invariants", `${path.relative(root, file)} passes without passing verification`);
    }
    if (record?.result === "pass" && !["pass", "findings_remediated"].includes(record.review?.status)) {
      fail("semantic invariants", `${path.relative(root, file)} passes without completed review`);
    }
  }
}

function checkMarkdownLinks() {
  const markdownFiles = walk(root, (file) => file.endsWith(".md"));
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const match of content.matchAll(linkPattern)) {
      const target = match[1].trim().replace(/^<|>$/g, "").split("#")[0];
      if (!target || /^(https?:|mailto:)/i.test(target)) continue;
      const absolute = path.resolve(path.dirname(file), decodeURIComponent(target));
      if (!fs.existsSync(absolute)) fail("Markdown links", `${path.relative(root, file)} -> ${target}`);
    }
  }
}

function checkTerminologyAndRules() {
  const docs = walk(root, (file) => file.endsWith(".md")).map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const terms = ["Task Profile", "Routing Recommendation", "Approved Handoff", "Local Delta", "Micro Consultation", "Codex Preflight", "Conflict Report", "Re-route Required", "Work State", "Verification Report"];
  for (const term of terms) if (!docs.includes(term)) fail("terminology", `missing canonical term ${term}`);

  const dimensions = ["requirement_ambiguity", "scope_complexity", "repository_dependency", "regression_risk", "parallelizability", "security_sensitivity", "context_uncertainty"];
  const taskProfileSchema = fs.readFileSync(path.join(root, "schemas/task-profile.schema.json"), "utf8");
  for (const dimension of dimensions) if (!taskProfileSchema.includes(`\"${dimension}\"`)) fail("terminology", `missing Task Profile dimension ${dimension}`);

  const rulesText = fs.readFileSync(path.join(root, "docs/routing/rules.md"), "utf8");
  const ruleIds = new Set([...rulesText.matchAll(/^## (R\d{3})/gm)].map((match) => match[1]));
  const expected = Array.from({ length: 12 }, (_, index) => `R${String(index + 1).padStart(3, "0")}`);
  for (const id of expected) if (!ruleIds.has(id)) fail("routing rules", `missing ${id}`);
  for (const file of walk(path.join(root, "examples"), (candidate) => candidate.endsWith(".json"))) {
    const record = loadJson(file);
    const matched = record?.routing_recommendation?.matched_rule;
    if (matched && !ruleIds.has(matched)) fail("routing rules", `${path.relative(root, file)} references unknown ${matched}`);
  }
}

function checkUnresolvedMarkers() {
  const excluded = new Set([
    path.normalize("docs/superpowers/plans/2026-08-20-devswitchboard-bootstrap.md"),
    path.normalize("scripts/verify.mjs")
  ]);
  const pattern = /\b(TBD|TODO|FIXME|PLACEHOLDER)\b/;
  for (const file of walk(root, (candidate) => /\.(md|json|jsonc|js|mjs)$/.test(candidate))) {
    if (excluded.has(path.normalize(path.relative(root, file)))) continue;
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      if (pattern.test(line)) fail("unresolved markers", `${path.relative(root, file)}:${index + 1}`);
    });
  }
}

function checkDecisionValueGate() {
  const license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
  if (!license.startsWith("Apache License\n") || !license.includes("Version 2.0, January 2004") || !license.includes("3. Grant of Patent License.")) {
    fail("decision value gate", "LICENSE is not the canonical Apache License 2.0 text");
  }

  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  if (!readme.includes("Apache License 2.0") || /MIT License/i.test(readme)) {
    fail("decision value gate", "README does not identify Apache License 2.0 exclusively");
  }

  const rules = fs.readFileSync(path.join(root, "docs/routing/rules.md"), "utf8").toLowerCase();
  for (const term of ["licensing", "legal terms", "publication policy", "ownership", "distribution rights", "intent", "developer approval"]) {
    if (!rules.includes(term)) fail("decision value gate", `R001 legal/distribution intent rule is missing ${term}`);
  }

  const dogfood = loadJson(path.join(root, "dogfood/devswitchboard-bootstrap-001.json"));
  const finding = dogfood?.findings?.find((item) => item.type === "ROUTER_ERROR" && item.area === "decision_value_gate");
  if (!finding || finding.status !== "remediated") {
    fail("decision value gate", "Dogfood #001 lacks the remediated ROUTER_ERROR finding");
  }
}

const groupsBefore = () => new Set(failures.map((item) => item.split(":")[0]));
checkRequiredStructure();
checkJsonAndSchemas();
checkSemanticInvariants();
checkMarkdownLinks();
checkTerminologyAndRules();
checkUnresolvedMarkers();
checkDecisionValueGate();

const expectedGroups = ["structure", "scope", "JSON syntax", "schema conformance", "semantic invariants", "Markdown links", "terminology", "routing rules", "unresolved markers", "decision value gate"];
const failedGroups = groupsBefore();
for (const group of expectedGroups) {
  if (!failedGroups.has(group)) console.log(`${group}: PASS`);
}

if (failures.length) {
  for (const message of failures) console.error(message);
  console.error(`verification: FAIL (${failures.length} issue${failures.length === 1 ? "" : "s"})`);
  process.exitCode = 1;
} else {
  console.log("verification: PASS");
}
