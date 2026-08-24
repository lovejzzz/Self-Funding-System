#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const PRELIVE_CLASSES = new Set([
  'RAIL_SANDBOX',
  'TRANSPORT_INJECTION',
  'POLICY_INJECTION',
]);

const FREEZE_RANK = {
  NONE: 0,
  SURPLUS_FREEZE: 1,
  WORK_AND_SPEND_FREEZE: 2,
  ALL_MUTATIONS_STOPPED: 3,
};

const EXCEPTION_FREEZE = {
  stale_report: 'SURPLUS_FREEZE',
  provider_cost_mismatch: 'WORK_AND_SPEND_FREEZE',
  unmatched_balance_transaction: 'WORK_AND_SPEND_FREEZE',
  unexpected_payout_destination: 'ALL_MUTATIONS_STOPPED',
  credential_compromise: 'ALL_MUTATIONS_STOPPED',
  evidence_compromise: 'ALL_MUTATIONS_STOPPED',
  unbalanced_internal_booking: 'ALL_MUTATIONS_STOPPED',
};

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash('sha256').update(canonical(value)).digest('hex');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateEvidenceBoundary(fixture) {
  assert(PRELIVE_CLASSES.has(fixture.evidence_class), `${fixture.fixture_id}: unsupported evidence_class`);
  assert(fixture.stripe_api_version, `${fixture.fixture_id}: stripe_api_version is required`);
  assert(fixture.expected?.close_state !== 'REVIEWED_CLOSED_LIVE', `${fixture.fixture_id}: pre-live evidence cannot expect REVIEWED_CLOSED_LIVE`);
  assert(fixture.expected?.maximum_evidence_state === 'CONTROL_PLANE_PASSED', `${fixture.fixture_id}: pre-live evidence ceiling must be CONTROL_PLANE_PASSED`);

  if (fixture.evidence_class === 'RAIL_SANDBOX') {
    if (fixture.provenance?.capture_status !== 'captured') {
      return { blocked: true, blocker: 'RAIL_SANDBOX_CAPTURE_REQUIRED' };
    }
    assert(fixture.provenance.environment === 'stripe_sandbox', `${fixture.fixture_id}: rail evidence must name stripe_sandbox`);
    assert(fixture.provenance.stripe_object_ids?.length > 0, `${fixture.fixture_id}: rail evidence needs Stripe object IDs`);
    assert(fixture.provenance.raw_object_sha256 === sha256(fixture.input.canonical_objects), `${fixture.fixture_id}: rail object hash mismatch`);
  }

  if (fixture.evidence_class === 'TRANSPORT_INJECTION') {
    assert(fixture.provenance?.base_evidence_ref, `${fixture.fixture_id}: transport injection needs base_evidence_ref`);
    assert(fixture.provenance.authenticated_payload_sha256 === sha256(fixture.input.source_payload), `${fixture.fixture_id}: authenticated payload hash mismatch`);
  }

  if (fixture.evidence_class === 'POLICY_INJECTION') {
    assert(fixture.provenance?.oracle_version, `${fixture.fixture_id}: policy injection needs oracle_version`);
    assert(fixture.provenance?.synthetic === true, `${fixture.fixture_id}: policy injection must be labeled synthetic`);
  }

  return { blocked: false };
}

function highestFreeze(exceptions) {
  return exceptions.reduce((highest, exception) => {
    const candidate = EXCEPTION_FREEZE[exception.code] || 'WORK_AND_SPEND_FREEZE';
    return FREEZE_RANK[candidate] > FREEZE_RANK[highest] ? candidate : highest;
  }, 'NONE');
}

function reduceFixture(fixture) {
  const uniqueEventIds = new Set();
  const uniqueObjectEvents = new Set();
  let duplicate_deliveries = 0;

  for (const event of fixture.input.events || []) {
    const objectKey = `${event.type}:${event.object_id}`;
    if (uniqueEventIds.has(event.event_id) || uniqueObjectEvents.has(objectKey)) {
      duplicate_deliveries += 1;
      continue;
    }
    uniqueEventIds.add(event.event_id);
    uniqueObjectEvents.add(objectKey);
  }

  const posted = new Map();
  let duplicate_bookings = 0;
  const exceptions = [...(fixture.input.exceptions || [])];
  for (const transaction of fixture.input.transactions || []) {
    const digest = sha256(transaction.entries);
    const prior = posted.get(transaction.idempotency_key);
    if (prior) {
      assert(prior === digest, `${fixture.fixture_id}: idempotency key reused with different entries`);
      duplicate_bookings += 1;
      continue;
    }
    posted.set(transaction.idempotency_key, digest);
    const sum = transaction.entries.reduce((total, entry) => total + entry.amount_minor, 0);
    if (sum !== 0) exceptions.push({ code: 'unbalanced_internal_booking', object_ref: transaction.idempotency_key });
  }

  const freeze_tier = highestFreeze(exceptions);
  return {
    runner_status: 'PASS',
    close_state: exceptions.length ? 'PROVISIONAL_EXCEPTION' : 'CONTROL_PLANE_PASSED',
    freeze_tier,
    unique_events: uniqueEventIds.size,
    duplicate_deliveries,
    posted_transactions: posted.size,
    duplicate_bookings,
    exception_codes: [...new Set(exceptions.map((exception) => exception.code))].sort(),
    evidence_state: 'CONTROL_PLANE_PASSED',
  };
}

function compareExpected(fixture, actual) {
  for (const [key, expected] of Object.entries(fixture.expected)) {
    if (key === 'maximum_evidence_state' || key === 'blocker') continue;
    assert(canonical(actual[key]) === canonical(expected), `${fixture.fixture_id}: ${key} expected ${canonical(expected)}, got ${canonical(actual[key])}`);
  }
}

function execute(fixture) {
  const boundary = validateEvidenceBoundary(fixture);
  if (boundary.blocked) {
    const actual = {
      runner_status: 'BLOCKED',
      blocker: boundary.blocker,
      close_state: 'NOT_RUN',
      freeze_tier: 'NONE',
      evidence_state: 'NO_RAIL_EVIDENCE',
    };
    assert(fixture.expected.runner_status === actual.runner_status, `${fixture.fixture_id}: unexpected blocker`);
    assert(fixture.expected.blocker === actual.blocker, `${fixture.fixture_id}: blocker mismatch`);
    return actual;
  }
  const actual = reduceFixture(fixture);
  compareExpected(fixture, actual);
  return actual;
}

function runGuardTests(seed) {
  const guards = [];
  const expectReject = (name, mutate) => {
    const candidate = structuredClone(seed);
    mutate(candidate);
    try {
      execute(candidate);
      guards.push({ name, passed: false });
    } catch {
      guards.push({ name, passed: true });
    }
  };

  expectReject('reject pre-live live-close upgrade', (candidate) => {
    candidate.expected.close_state = 'REVIEWED_CLOSED_LIVE';
  });
  expectReject('reject authenticated-payload hash mismatch', (candidate) => {
    candidate.input.source_payload.amount_minor += 1;
  });
  expectReject('reject idempotency-key payload conflict', (candidate) => {
    candidate.input.transactions.push({
      idempotency_key: candidate.input.transactions[0].idempotency_key,
      entries: [{ account: 'cash', amount_minor: 1 }, { account: 'suspense', amount_minor: -1 }],
    });
  });
  return guards;
}

const manifestPath = process.argv[2] || new URL('./manifest.json', import.meta.url);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
assert(manifest.manifest_version === '0.1.0', 'unsupported manifest_version');
assert(manifest.stripe_api_version, 'manifest stripe_api_version is required');
for (const fixture of manifest.fixtures) {
  assert(fixture.stripe_api_version === manifest.stripe_api_version, `${fixture.fixture_id}: fixture API version differs from manifest`);
}

const results = manifest.fixtures.map((fixture) => ({ fixture_id: fixture.fixture_id, ...execute(fixture) }));
const transportSeed = manifest.fixtures.find((fixture) => fixture.evidence_class === 'TRANSPORT_INJECTION');
assert(transportSeed, 'manifest requires a transport fixture for guard tests');
const guards = runGuardTests(transportSeed);
assert(guards.every((guard) => guard.passed), 'one or more evidence-boundary guard tests failed');

const summary = {
  manifest_version: manifest.manifest_version,
  stripe_api_version: manifest.stripe_api_version,
  fixture_count: results.length,
  passed: results.filter((result) => result.runner_status === 'PASS').length,
  blocked: results.filter((result) => result.runner_status === 'BLOCKED').length,
  guard_tests_passed: guards.filter((guard) => guard.passed).length,
  complete_prelive_suite: results.every((result) => result.runner_status === 'PASS') && PRELIVE_CLASSES.size === new Set(results.map((result) => manifest.fixtures.find((fixture) => fixture.fixture_id === result.fixture_id).evidence_class)).size,
};

console.log(JSON.stringify({ summary, results, guards }, null, 2));
