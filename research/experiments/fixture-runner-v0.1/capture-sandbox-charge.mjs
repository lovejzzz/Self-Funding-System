#!/usr/bin/env node

import { createHash, randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const API_VERSION = '2026-07-29.dahlia';
const API_ROOT = 'https://api.stripe.com';
const KEY_ENV = 'SELF_FUNDING_STRIPE_SANDBOX_KEY';
const OUTPUT_ENV = 'SELF_FUNDING_CAPTURE_DIR';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(raw) {
  return createHash('sha256').update(raw).digest('hex');
}

function requireSandboxKey(value) {
  if (!value) throw new Error('SANDBOX_CREDENTIAL_REQUIRED');
  if (/^(sk|rk)_live_/.test(value)) throw new Error('LIVE_CREDENTIAL_REFUSED');
  if (!/^(sk|rk)_test_/.test(value)) throw new Error('SANDBOX_CREDENTIAL_FORMAT_UNRECOGNIZED');
  return value;
}

export function paymentIntentView(value) {
  return {
    id: value.id,
    object: value.object,
    amount: value.amount,
    amount_received: value.amount_received,
    currency: value.currency,
    created: value.created,
    latest_charge: typeof value.latest_charge === 'object' ? value.latest_charge?.id : value.latest_charge,
    livemode: value.livemode,
    metadata: value.metadata,
    status: value.status,
  };
}

export function balanceTransactionView(value) {
  return {
    id: value.id,
    object: value.object,
    amount: value.amount,
    available_on: value.available_on,
    created: value.created,
    currency: value.currency,
    fee: value.fee,
    net: value.net,
    reporting_category: value.reporting_category,
    source: typeof value.source === 'object' ? value.source?.id : value.source,
    status: value.status,
    type: value.type,
  };
}

export function chargeView(value) {
  const balanceTransaction = typeof value.balance_transaction === 'object'
    ? balanceTransactionView(value.balance_transaction)
    : value.balance_transaction;
  return {
    id: value.id,
    object: value.object,
    amount: value.amount,
    amount_captured: value.amount_captured,
    balance_transaction: balanceTransaction,
    captured: value.captured,
    created: value.created,
    currency: value.currency,
    livemode: value.livemode,
    paid: value.paid,
    payment_intent: typeof value.payment_intent === 'object' ? value.payment_intent?.id : value.payment_intent,
    status: value.status,
  };
}

export function eventView(value) {
  return {
    id: value.id,
    object: value.object,
    api_version: value.api_version,
    created: value.created,
    data: { object: paymentIntentView(value.data.object) },
    livemode: value.livemode,
    request: {
      id: value.request?.id ?? null,
      idempotency_key: value.request?.idempotency_key ?? null,
    },
    type: value.type,
  };
}

function objectId(value) {
  return typeof value === 'object' ? value?.id : value;
}

export function validateCaptureChain({ paymentIntent, charge, event, creationRequestId, idempotencyKey }) {
  const balanceTransaction = charge.balance_transaction;
  assert(paymentIntent.object === 'payment_intent', 'PAYMENT_INTENT_OBJECT_INVALID');
  assert(charge.object === 'charge', 'CHARGE_OBJECT_INVALID');
  assert(balanceTransaction?.object === 'balance_transaction', 'BALANCE_TRANSACTION_OBJECT_INVALID');
  assert(event.object === 'event', 'EVENT_OBJECT_INVALID');
  assert(paymentIntent.livemode === false && charge.livemode === false && event.livemode === false, 'LIVE_OBJECT_REFUSED');
  assert(paymentIntent.status === 'succeeded', `PAYMENT_INTENT_${paymentIntent.status}`);
  assert(charge.status === 'succeeded' && charge.paid === true && charge.captured === true, 'CHARGE_NOT_CAPTURED');
  assert(objectId(paymentIntent.latest_charge) === charge.id, 'PAYMENT_INTENT_CHARGE_LINK_MISMATCH');
  assert(objectId(charge.payment_intent) === paymentIntent.id, 'CHARGE_PAYMENT_INTENT_LINK_MISMATCH');
  assert(objectId(balanceTransaction.source) === charge.id, 'BALANCE_TRANSACTION_SOURCE_MISMATCH');
  assert(paymentIntent.amount === charge.amount && charge.amount === balanceTransaction.amount, 'CAPTURE_AMOUNT_MISMATCH');
  assert(paymentIntent.amount_received === charge.amount_captured, 'CAPTURED_AMOUNT_MISMATCH');
  assert(paymentIntent.currency === charge.currency && charge.currency === balanceTransaction.currency, 'CAPTURE_CURRENCY_MISMATCH');
  assert(balanceTransaction.net === balanceTransaction.amount - balanceTransaction.fee, 'BALANCE_TRANSACTION_MATH_MISMATCH');
  assert(event.type === 'payment_intent.succeeded', 'EVENT_TYPE_MISMATCH');
  assert(event.api_version === API_VERSION, `EVENT_VERSION_MISMATCH_${event.api_version}`);
  assert(event.data?.object?.id === paymentIntent.id, 'EVENT_PAYMENT_INTENT_LINK_MISMATCH');
  assert(objectId(event.data?.object?.latest_charge) === charge.id, 'EVENT_CHARGE_LINK_MISMATCH');
  assert(event.request?.id === creationRequestId, 'EVENT_REQUEST_ID_MISMATCH');
  assert(event.request?.idempotency_key === idempotencyKey, 'EVENT_IDEMPOTENCY_KEY_MISMATCH');
}

export function validateReviewBundle(bundle) {
  const serialized = JSON.stringify(bundle);
  for (const forbidden of [
    'client_secret', 'billing_details', 'payment_method_details', 'receipt_url',
    'receipt_email', 'fingerprint', 'sk_test_', 'rk_test_', 'sk_live_', 'rk_live_',
  ]) assert(!serialized.includes(forbidden), `REVIEW_BUNDLE_FORBIDDEN_FRAGMENT_${forbidden}`);
}

async function stripeRequest(key, method, path, options = {}) {
  const headers = {
    Authorization: `Bearer ${key}`,
    'Stripe-Version': API_VERSION,
  };
  if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;
  if (options.body) headers['Content-Type'] = 'application/x-www-form-urlencoded';

  const response = await fetch(`${API_ROOT}${path}`, {
    method,
    headers,
    body: options.body,
  });
  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`STRIPE_NON_JSON_RESPONSE_${response.status}`);
  }
  if (!response.ok) {
    const code = data?.error?.code || data?.error?.type || 'unknown';
    throw new Error(`STRIPE_REQUEST_FAILED_${response.status}_${code}`);
  }
  return {
    data,
    raw,
    requestId: response.headers.get('request-id'),
    responseVersion: response.headers.get('stripe-version'),
  };
}

async function findSucceededEvent(key, paymentIntentId, createdAt) {
  const query = new URLSearchParams({
    'types[]': 'payment_intent.succeeded',
    'created[gte]': String(createdAt - 5),
    limit: '100',
  });
  let listResult;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    listResult = await stripeRequest(key, 'GET', `/v1/events?${query}`);
    const candidate = listResult.data.data.find((event) => event.data?.object?.id === paymentIntentId);
    if (candidate) {
      const eventResult = await stripeRequest(key, 'GET', `/v1/events/${candidate.id}`);
      return { listResult, eventResult };
    }
    await new Promise((done) => setTimeout(done, 400));
  }
  throw new Error('SUCCEEDED_EVENT_NOT_FOUND');
}

function runSelfTest() {
  assert(requireSandboxKey('sk_test_example') === 'sk_test_example', 'sandbox key rejected');
  for (const candidate of ['sk_live_example', 'rk_live_example']) {
    let rejected = false;
    try { requireSandboxKey(candidate); } catch (error) { rejected = error.message === 'LIVE_CREDENTIAL_REFUSED'; }
    assert(rejected, 'live key was not refused');
  }
  const safe = paymentIntentView({
    id: 'pi_test', object: 'payment_intent', amount: 50, amount_received: 50,
    currency: 'usd', created: 1, latest_charge: 'ch_test', livemode: false,
    metadata: {}, status: 'succeeded', client_secret: 'must_not_escape',
  });
  assert(!JSON.stringify(safe).includes('must_not_escape'), 'sanitizer leaked client_secret');
  const paymentIntent = {
    id: 'pi_test', object: 'payment_intent', amount: 50, amount_received: 50,
    currency: 'usd', latest_charge: 'ch_test', livemode: false, status: 'succeeded',
  };
  const charge = {
    id: 'ch_test', object: 'charge', amount: 50, amount_captured: 50, currency: 'usd',
    captured: true, livemode: false, paid: true, payment_intent: 'pi_test', status: 'succeeded',
    balance_transaction: {
      id: 'txn_test', object: 'balance_transaction', amount: 50, fee: 2, net: 48,
      currency: 'usd', source: 'ch_test', status: 'pending', type: 'charge',
    },
  };
  const event = {
    id: 'evt_test', object: 'event', api_version: API_VERSION, livemode: false,
    type: 'payment_intent.succeeded', request: { id: 'req_test', idempotency_key: 'idem_test' },
    data: { object: paymentIntent },
  };
  validateCaptureChain({ paymentIntent, charge, event, creationRequestId: 'req_test', idempotencyKey: 'idem_test' });
  const guardMutations = [
    (copy) => { copy.charge.payment_intent = 'pi_wrong'; },
    (copy) => { copy.charge.balance_transaction.source = 'ch_wrong'; },
    (copy) => { copy.charge.balance_transaction.net += 1; },
    (copy) => { copy.event.request.idempotency_key = 'idem_wrong'; },
    (copy) => { copy.event.data.object.latest_charge = 'ch_wrong'; },
  ];
  for (const mutate of guardMutations) {
    const copy = structuredClone({ paymentIntent, charge, event });
    mutate(copy);
    let rejected = false;
    try { validateCaptureChain({ ...copy, creationRequestId: 'req_test', idempotencyKey: 'idem_test' }); } catch { rejected = true; }
    assert(rejected, 'capture-chain mismatch was not rejected');
  }
  validateReviewBundle({ canonical_objects: { payment_intent: safe } });
  console.log(JSON.stringify({
    status: 'PASS', live_key_refusal: true, client_secret_redaction: true,
    capture_chain_validation: true, mismatch_guards_rejected: guardMutations.length,
    review_bundle_scan: true, network_calls: 0,
  }, null, 2));
}

async function main() {
  if (process.argv.includes('--self-test')) {
    runSelfTest();
    return;
  }

  const key = requireSandboxKey(process.env[KEY_ENV]);
  process.umask(0o077);
  const startedAt = Math.floor(Date.now() / 1000);
  const captureId = `stripe-sandbox-${new Date().toISOString().replaceAll(':', '-')}`;
  const idempotencyKey = `sf-sandbox-charge-${randomUUID()}`;
  const outputRoot = resolve(process.env[OUTPUT_ENV] || fileURLToPath(new URL('./capture-private/', import.meta.url)), captureId);
  const rawDir = resolve(outputRoot, 'raw');
  await mkdir(rawDir, { recursive: true });

  const body = new URLSearchParams();
  body.set('amount', '50');
  body.set('currency', 'usd');
  body.set('payment_method', 'pm_card_visa');
  body.append('payment_method_types[]', 'card');
  body.set('confirm', 'true');
  body.set('description', 'SELF/FUNDING RAIL_SANDBOX capture');
  body.set('metadata[experiment]', 'fixture-runner-v0.1');
  body.set('metadata[evidence_class]', 'RAIL_SANDBOX');

  const createResult = await stripeRequest(key, 'POST', '/v1/payment_intents', {
    body,
    idempotencyKey,
  });
  assert(createResult.data.livemode === false, 'LIVE_OBJECT_REFUSED');
  assert(createResult.data.status === 'succeeded', `PAYMENT_INTENT_${createResult.data.status}`);
  const chargeId = typeof createResult.data.latest_charge === 'object'
    ? createResult.data.latest_charge?.id
    : createResult.data.latest_charge;
  assert(chargeId, 'LATEST_CHARGE_MISSING');

  const chargeResult = await stripeRequest(key, 'GET', `/v1/charges/${chargeId}?expand[]=balance_transaction`);
  assert(chargeResult.data.livemode === false, 'LIVE_OBJECT_REFUSED');
  assert(typeof chargeResult.data.balance_transaction === 'object', 'BALANCE_TRANSACTION_EXPANSION_MISSING');
  const { listResult, eventResult } = await findSucceededEvent(key, createResult.data.id, startedAt);
  validateCaptureChain({
    paymentIntent: createResult.data,
    charge: chargeResult.data,
    event: eventResult.data,
    creationRequestId: createResult.requestId,
    idempotencyKey,
  });

  const rawRecords = {
    'payment-intent-create.json': createResult,
    'charge-expanded.json': chargeResult,
    'event-list.json': listResult,
    'event-retrieve.json': eventResult,
  };
  const provenance = {};
  for (const [filename, result] of Object.entries(rawRecords)) {
    await writeFile(resolve(rawDir, filename), result.raw, { mode: 0o600 });
    provenance[filename] = {
      request_id: result.requestId,
      response_api_version: result.responseVersion,
      raw_sha256: sha256(result.raw),
    };
  }

  const bundle = {
    bundle_version: '0.1.0',
    capture_id: captureId,
    captured_at: new Date().toISOString(),
    evidence_class: 'RAIL_SANDBOX',
    maximum_evidence_state: 'CONTROL_PLANE_PASSED',
    stripe_api_version: API_VERSION,
    creation_idempotency_key: idempotencyKey,
    stripe_object_ids: [
      createResult.data.id,
      chargeResult.data.id,
      chargeResult.data.balance_transaction.id,
      eventResult.data.id,
    ],
    canonical_objects: {
      payment_intent: paymentIntentView(createResult.data),
      charge: chargeView(chargeResult.data),
      event: eventView(eventResult.data),
    },
    raw_response_provenance: provenance,
    cannot_prove: [
      'real funds or card-network processing',
      'live availability or settlement timing',
      'automatic-payout membership',
      'bank posting or trace',
    ],
  };
  validateReviewBundle(bundle);
  await writeFile(resolve(outputRoot, 'capture-bundle.json'), `${JSON.stringify(bundle, null, 2)}\n`, { mode: 0o600 });
  console.log(JSON.stringify({
    status: 'CAPTURED',
    evidence_class: bundle.evidence_class,
    maximum_evidence_state: bundle.maximum_evidence_state,
    capture_directory: outputRoot,
    stripe_object_ids: bundle.stripe_object_ids,
  }, null, 2));
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
