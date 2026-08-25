#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

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

function validateManifest(manifest) {
  assert(manifest.manifest_version === '0.1.0', 'MANIFEST_VERSION_UNSUPPORTED');
  assert(manifest.evidence_class === 'SIMULATED_RESOURCE_EXCHANGE', 'EVIDENCE_CLASS_INVALID');
  assert(manifest.maximum_evidence_state === 'LOCAL_CONTROL_PLANE_ONLY', 'EVIDENCE_CEILING_INVALID');
  assert(manifest.participants.length >= 3, 'MULTILATERAL_CYCLE_REQUIRED');

  const participants = new Map(manifest.participants.map((participant) => [participant.id, participant]));
  assert(participants.size === manifest.participants.length, 'PARTICIPANT_ID_DUPLICATE');
  const offeredTypes = new Set();
  for (const participant of manifest.participants) {
    assert(participant.offers.quantity > 0 && participant.wants.quantity > 0, 'RESOURCE_QUANTITY_INVALID');
    assert(!offeredTypes.has(participant.offers.resource_type), 'RESOURCE_TYPE_DUPLICATE');
    offeredTypes.add(participant.offers.resource_type);
  }
  assert(offeredTypes.size === manifest.participants.length, 'VECTOR_RESOURCE_TYPES_REQUIRED');

  const rightIds = new Set();
  const usedOffers = new Set();
  const satisfiedDemands = new Set();
  const outgoing = new Map();
  const incoming = new Map();
  for (const right of manifest.rights) {
    assert(!rightIds.has(right.right_id), 'RIGHT_ID_DUPLICATE');
    rightIds.add(right.right_id);
    const issuer = participants.get(right.issuer);
    const holder = participants.get(right.holder);
    assert(issuer && holder && issuer.id !== holder.id, 'RIGHT_PARTIES_INVALID');
    assert(right.resource_type === issuer.offers.resource_type, 'ISSUER_RESOURCE_MISMATCH');
    assert(right.quantity === issuer.offers.quantity, 'ISSUER_QUANTITY_AMPLIFICATION');
    assert(canonical(right.scope) === canonical(issuer.offers.scope), 'ISSUER_SCOPE_AMPLIFICATION');
    assert(right.resource_type === holder.wants.resource_type, 'HOLDER_DEMAND_MISMATCH');
    assert(right.quantity === holder.wants.quantity, 'HOLDER_QUANTITY_MISMATCH');
    assert(right.transferable === false, 'TRANSFERABILITY_NOT_AUTHORIZED');
    assert(right.revocable === true, 'REVOCATION_PATH_REQUIRED');
    assert(right.cash_equivalent === null, 'UNSUPPORTED_CASH_EQUIVALENCE');
    assert(right.status === 'reserved', 'RIGHT_NOT_RESERVED');
    assert(Date.parse(right.expires_at) > Date.parse(right.issued_at), 'RIGHT_EXPIRY_INVALID');
    assert(!usedOffers.has(right.issuer), 'OFFER_DOUBLE_ALLOCATED');
    assert(!satisfiedDemands.has(right.holder), 'DEMAND_DOUBLE_SATISFIED');
    usedOffers.add(right.issuer);
    satisfiedDemands.add(right.holder);
    outgoing.set(right.issuer, right.holder);
    incoming.set(right.holder, right.issuer);
  }

  assert(manifest.rights.length === manifest.participants.length, 'CYCLE_RIGHT_COUNT_MISMATCH');
  assert(usedOffers.size === participants.size && satisfiedDemands.size === participants.size, 'CYCLE_NOT_CLOSED');
  for (const id of participants.keys()) {
    assert(outgoing.has(id) && incoming.has(id), 'PARTICIPANT_NOT_IN_CYCLE');
  }
  const origin = manifest.participants[0].id;
  let cursor = origin;
  const visited = new Set();
  while (!visited.has(cursor)) {
    visited.add(cursor);
    cursor = outgoing.get(cursor);
  }
  assert(cursor === origin && visited.size === participants.size, 'EXCHANGE_NOT_SINGLE_CYCLE');
  return { participantCount: participants.size, resourceTypes: [...offeredTypes].sort() };
}

function simulateRedemption(manifest) {
  const consumed = new Set();
  for (const right of manifest.rights) {
    assert(!consumed.has(right.right_id), 'RIGHT_DOUBLE_REDEEMED');
    consumed.add(right.right_id);
  }
  return consumed.size;
}

function runGuards(manifest) {
  const cases = [
    ['reject transferable right', (copy) => { copy.rights[0].transferable = true; }],
    ['reject invented cash equivalent', (copy) => { copy.rights[0].cash_equivalent = 100; }],
    ['reject quantity amplification', (copy) => { copy.rights[0].quantity += 1; }],
    ['reject scope amplification', (copy) => { copy.rights[2].scope.actions.push('write'); }],
    ['reject duplicate right id', (copy) => { copy.rights[1].right_id = copy.rights[0].right_id; }],
    ['reject duplicate offer allocation', (copy) => { copy.rights[1].issuer = copy.rights[0].issuer; }],
    ['reject disconnected exchange', (copy) => { copy.rights[0].holder = 'compute-lab'; }]
  ];
  return cases.map(([name, mutate]) => {
    const copy = structuredClone(manifest);
    mutate(copy);
    let rejected = false;
    try { validateManifest(copy); } catch { rejected = true; }
    assert(rejected, `GUARD_FAILED_${name}`);
    return { name, passed: true };
  });
}

const manifestPath = process.argv[2] || new URL('./manifest.json', import.meta.url);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const validation = validateManifest(manifest);
const redeemed = simulateRedemption(manifest);
const guards = runGuards(manifest);

console.log(JSON.stringify({
  run_at: '2026-08-25T03:11:02Z',
  status: 'PASS',
  evidence_class: manifest.evidence_class,
  maximum_evidence_state: manifest.maximum_evidence_state,
  participants: validation.participantCount,
  resource_types: validation.resourceTypes,
  matched_rights: manifest.rights.length,
  simulated_redemptions: redeemed,
  cash_equivalents_asserted: 0,
  guard_tests_passed: guards.length,
  guards,
  cannot_prove: [
    'that any external provider will issue or honor a right',
    'that heterogeneous resources have a stable exchange rate',
    'legal ownership, accounting-asset treatment, transferability, or enforceability',
    'live atomic settlement across compute, data, and repository systems'
  ]
}, null, 2));
