#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  API_VERSION,
  chargeView,
  eventView,
  paymentIntentView,
  validateCaptureChain,
  validateReviewBundle,
} from './capture-sandbox-charge.mjs';
import { execute, sha256 as canonicalSha256 } from './runner.mjs';

const RAW_FILES = [
  'payment-intent-create.json',
  'charge-expanded.json',
  'event-list.json',
  'event-retrieve.json',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function rawSha256(raw) {
  return createHash('sha256').update(raw).digest('hex');
}

function assertSame(actual, expected, message) {
  assert(canonical(actual) === canonical(expected), message);
}

async function readRawCapture(captureDirectory, filename) {
  const raw = await readFile(resolve(captureDirectory, 'raw', filename), 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`RAW_JSON_INVALID_${filename}`);
  }
  return { raw, data };
}

function validateBundleEnvelope(bundle) {
  assert(bundle.bundle_version === '0.1.0', 'BUNDLE_VERSION_UNSUPPORTED');
  assert(typeof bundle.capture_id === 'string' && bundle.capture_id.length > 0, 'BUNDLE_CAPTURE_ID_MISSING');
  assert(Number.isFinite(Date.parse(bundle.captured_at)), 'BUNDLE_CAPTURE_TIME_INVALID');
  assert(bundle.evidence_class === 'RAIL_SANDBOX', 'BUNDLE_EVIDENCE_CLASS_INVALID');
  assert(bundle.maximum_evidence_state === 'CONTROL_PLANE_PASSED', 'BUNDLE_EVIDENCE_UPGRADE_REFUSED');
  assert(bundle.stripe_api_version === API_VERSION, 'BUNDLE_API_VERSION_MISMATCH');
  assert(typeof bundle.creation_idempotency_key === 'string' && bundle.creation_idempotency_key.length > 0, 'BUNDLE_IDEMPOTENCY_KEY_MISSING');
  assert(Array.isArray(bundle.stripe_object_ids) && bundle.stripe_object_ids.length === 4, 'BUNDLE_OBJECT_IDS_INVALID');
  assert(new Set(bundle.stripe_object_ids).size === 4, 'BUNDLE_OBJECT_IDS_NOT_UNIQUE');
  assert(bundle.canonical_objects && typeof bundle.canonical_objects === 'object', 'BUNDLE_CANONICAL_OBJECTS_MISSING');
  assert(bundle.raw_response_provenance && typeof bundle.raw_response_provenance === 'object', 'BUNDLE_RAW_PROVENANCE_MISSING');
  assertSame(Object.keys(bundle.raw_response_provenance).sort(), [...RAW_FILES].sort(), 'BUNDLE_RAW_PROVENANCE_SET_INVALID');
  validateReviewBundle(bundle);
}

function buildReplayFixture(bundle) {
  const paymentIntent = bundle.canonical_objects.payment_intent;
  const charge = bundle.canonical_objects.charge;
  const event = bundle.canonical_objects.event;
  const balanceTransaction = charge.balance_transaction;
  assert(['pending', 'available'].includes(balanceTransaction.status), 'BALANCE_TRANSACTION_STATUS_INVALID');
  assert(balanceTransaction.type === 'charge', 'BALANCE_TRANSACTION_TYPE_INVALID');
  const eventInput = {
    event_id: event.id,
    type: event.type,
    object_id: paymentIntent.id,
  };
  const transaction = {
    idempotency_key: balanceTransaction.id,
    entries: [
      { account: balanceTransaction.status === 'available' ? 'stripe_available' : 'stripe_pending', amount_minor: balanceTransaction.net },
      { account: 'payment_fee', amount_minor: balanceTransaction.fee },
      { account: 'customer_obligation', amount_minor: -balanceTransaction.amount },
    ],
  };
  return {
    fixture_id: `rail-capture-replay-${bundle.capture_id}`,
    evidence_class: 'RAIL_SANDBOX',
    stripe_api_version: bundle.stripe_api_version,
    provenance: {
      capture_status: 'captured',
      environment: 'stripe_sandbox',
      stripe_object_ids: bundle.stripe_object_ids,
      raw_object_sha256: canonicalSha256(bundle.canonical_objects),
    },
    input: {
      canonical_objects: bundle.canonical_objects,
      events: [eventInput, structuredClone(eventInput)],
      transactions: [transaction, structuredClone(transaction)],
      exceptions: [],
    },
    expected: {
      runner_status: 'PASS',
      close_state: 'CONTROL_PLANE_PASSED',
      freeze_tier: 'NONE',
      unique_events: 1,
      duplicate_deliveries: 1,
      posted_transactions: 1,
      duplicate_bookings: 1,
      exception_codes: [],
      evidence_state: 'CONTROL_PLANE_PASSED',
      maximum_evidence_state: 'CONTROL_PLANE_PASSED',
    },
    cannot_prove: bundle.cannot_prove,
  };
}

export async function replayCaptureBundle(captureDirectory) {
  const bundle = JSON.parse(await readFile(resolve(captureDirectory, 'capture-bundle.json'), 'utf8'));
  validateBundleEnvelope(bundle);

  const records = {};
  for (const filename of RAW_FILES) {
    const provenance = bundle.raw_response_provenance[filename];
    assert(provenance, `RAW_PROVENANCE_MISSING_${filename}`);
    assert(/^[a-f0-9]{64}$/.test(provenance.raw_sha256), `RAW_HASH_INVALID_${filename}`);
    assert(provenance.response_api_version === API_VERSION, `RAW_API_VERSION_MISMATCH_${filename}`);
    records[filename] = await readRawCapture(captureDirectory, filename);
    assert(rawSha256(records[filename].raw) === provenance.raw_sha256, `RAW_HASH_MISMATCH_${filename}`);
  }

  const paymentIntent = records['payment-intent-create.json'].data;
  const charge = records['charge-expanded.json'].data;
  const eventList = records['event-list.json'].data;
  const event = records['event-retrieve.json'].data;
  const creationRequestId = bundle.raw_response_provenance['payment-intent-create.json'].request_id;

  validateCaptureChain({
    paymentIntent,
    charge,
    event,
    creationRequestId,
    idempotencyKey: bundle.creation_idempotency_key,
  });
  assert(Array.isArray(eventList.data), 'EVENT_LIST_DATA_INVALID');
  assert(eventList.data.some((candidate) => candidate.id === event.id && candidate.data?.object?.id === paymentIntent.id), 'EVENT_LIST_LINK_MISMATCH');
  assertSame(bundle.canonical_objects.payment_intent, paymentIntentView(paymentIntent), 'PAYMENT_INTENT_SAFE_VIEW_MISMATCH');
  assertSame(bundle.canonical_objects.charge, chargeView(charge), 'CHARGE_SAFE_VIEW_MISMATCH');
  assertSame(bundle.canonical_objects.event, eventView(event), 'EVENT_SAFE_VIEW_MISMATCH');

  const expectedIds = [
    paymentIntent.id,
    charge.id,
    charge.balance_transaction.id,
    event.id,
  ].sort();
  assertSame([...bundle.stripe_object_ids].sort(), expectedIds, 'BUNDLE_OBJECT_ID_SET_MISMATCH');

  const fixture = buildReplayFixture(bundle);
  const first = execute(fixture);
  const second = execute(fixture);
  assertSame(first, second, 'REPLAY_NONDETERMINISTIC');
  assert(first.posted_transactions === 1 && first.duplicate_bookings === 1, 'REPLAY_BOOKING_COUNT_INVALID');
  assert(first.evidence_state === 'CONTROL_PLANE_PASSED', 'REPLAY_EVIDENCE_STATE_INVALID');

  return {
    status: 'PASS',
    bundle_version: bundle.bundle_version,
    stripe_api_version: bundle.stripe_api_version,
    source_evidence_class: bundle.evidence_class,
    maximum_evidence_state: bundle.maximum_evidence_state,
    raw_hashes_verified: RAW_FILES.length,
    replay_count: 2,
    posted_transactions_per_replay: first.posted_transactions,
    duplicate_bookings_per_replay: first.duplicate_bookings,
    freeze_tier: first.freeze_tier,
    close_state: first.close_state,
  };
}

async function writeSyntheticCapture(root) {
  const paymentIntent = {
    id: 'pi_test_replay', object: 'payment_intent', amount: 50, amount_received: 50,
    currency: 'usd', created: 1, latest_charge: 'ch_test_replay', livemode: false,
    metadata: { experiment: 'fixture-runner-v0.1' }, status: 'succeeded',
  };
  const charge = {
    id: 'ch_test_replay', object: 'charge', amount: 50, amount_captured: 50,
    balance_transaction: {
      id: 'txn_test_replay', object: 'balance_transaction', amount: 50,
      available_on: 2, created: 1, currency: 'usd', fee: 2, net: 48,
      reporting_category: 'charge', source: 'ch_test_replay', status: 'pending', type: 'charge',
    },
    captured: true, created: 1, currency: 'usd', livemode: false, paid: true,
    payment_intent: 'pi_test_replay', status: 'succeeded',
  };
  const event = {
    id: 'evt_test_replay', object: 'event', api_version: API_VERSION, created: 1,
    data: { object: paymentIntent }, livemode: false,
    request: { id: 'req_test_replay', idempotency_key: 'idem_test_replay' },
    type: 'payment_intent.succeeded',
  };
  const rawData = {
    'payment-intent-create.json': paymentIntent,
    'charge-expanded.json': charge,
    'event-list.json': { object: 'list', data: [event] },
    'event-retrieve.json': event,
  };
  const rawResponseProvenance = {};
  for (const [filename, value] of Object.entries(rawData)) {
    const raw = `${JSON.stringify(value)}\n`;
    await writeFile(resolve(root, 'raw', filename), raw, { mode: 0o600 });
    rawResponseProvenance[filename] = {
      request_id: filename === 'payment-intent-create.json' ? 'req_test_replay' : `req_${filename}`,
      response_api_version: API_VERSION,
      raw_sha256: rawSha256(raw),
    };
  }
  const bundle = {
    bundle_version: '0.1.0',
    capture_id: 'synthetic-self-test',
    captured_at: '2026-08-26T15:27:40Z',
    evidence_class: 'RAIL_SANDBOX',
    maximum_evidence_state: 'CONTROL_PLANE_PASSED',
    stripe_api_version: API_VERSION,
    creation_idempotency_key: 'idem_test_replay',
    stripe_object_ids: [paymentIntent.id, charge.id, charge.balance_transaction.id, event.id],
    canonical_objects: {
      payment_intent: paymentIntentView(paymentIntent),
      charge: chargeView(charge),
      event: eventView(event),
    },
    raw_response_provenance: rawResponseProvenance,
    cannot_prove: ['real funds', 'Stripe object origin', 'bank posting'],
  };
  await writeFile(resolve(root, 'capture-bundle.json'), `${JSON.stringify(bundle, null, 2)}\n`, { mode: 0o600 });
}

async function makeSyntheticCapture() {
  const root = await mkdtemp(resolve(tmpdir(), 'sf-capture-replay-'));
  await mkdir(resolve(root, 'raw'), { recursive: true });
  await writeSyntheticCapture(root);
  return root;
}

async function expectReject(name, mutate) {
  const root = await makeSyntheticCapture();
  try {
    await mutate(root);
    await replayCaptureBundle(root);
    return { name, passed: false };
  } catch {
    return { name, passed: true };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function runSelfTest() {
  const validRoot = await makeSyntheticCapture();
  let valid;
  try {
    valid = await replayCaptureBundle(validRoot);
  } finally {
    await rm(validRoot, { recursive: true, force: true });
  }
  const guards = [];
  guards.push(await expectReject('reject raw hash mismatch', async (root) => {
    await writeFile(resolve(root, 'raw', 'charge-expanded.json'), '{"tampered":true}\n');
  }));
  guards.push(await expectReject('reject evidence-class upgrade', async (root) => {
    const path = resolve(root, 'capture-bundle.json');
    const bundle = JSON.parse(await readFile(path, 'utf8'));
    bundle.maximum_evidence_state = 'REVIEWED_CLOSED_LIVE';
    await writeFile(path, `${JSON.stringify(bundle, null, 2)}\n`);
  }));
  guards.push(await expectReject('reject canonical object mismatch', async (root) => {
    const path = resolve(root, 'capture-bundle.json');
    const bundle = JSON.parse(await readFile(path, 'utf8'));
    bundle.canonical_objects.charge.payment_intent = 'pi_wrong';
    await writeFile(path, `${JSON.stringify(bundle, null, 2)}\n`);
  }));
  guards.push(await expectReject('reject missing raw provenance', async (root) => {
    const path = resolve(root, 'capture-bundle.json');
    const bundle = JSON.parse(await readFile(path, 'utf8'));
    delete bundle.raw_response_provenance['event-retrieve.json'];
    await writeFile(path, `${JSON.stringify(bundle, null, 2)}\n`);
  }));
  assert(guards.every((guard) => guard.passed), 'SELF_TEST_GUARD_FAILED');
  return {
    status: 'PASS',
    scope: 'NO_NETWORK_SYNTHETIC_CAPTURE_SCHEMA_ONLY',
    evidence_ceiling: 'LOCAL_CONTROL_PLANE_ONLY',
    valid_replay: valid,
    guards,
    external_blocker: 'RAIL_SANDBOX_CAPTURE_REQUIRED',
  };
}

async function main() {
  if (process.argv.includes('--self-test')) {
    console.log(JSON.stringify(await runSelfTest(), null, 2));
    return;
  }
  const captureDirectory = process.argv[2];
  assert(captureDirectory, 'CAPTURE_DIRECTORY_REQUIRED');
  console.log(JSON.stringify(await replayCaptureBundle(resolve(captureDirectory)), null, 2));
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
