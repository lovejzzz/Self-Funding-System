# Capture-bundle replay gate for the first Stripe reducer

**Run time:** 2026-08-26T15:27:40Z

**Horizon:** A — make the accountable money loop work now

**Evidence ceiling:** `LOCAL_CONTROL_PLANE_ONLY` for this round

**Jurisdiction and assumptions:** Product-control research for a proposed US operator using one Stripe sandbox and later one US card payment. This round moves no real money and reaches no legal, tax, accounting, custody, or financial conclusion. Those matters still require operator-account evidence and qualified US professional review. The controls below are product-design constraints, not legal, accounting, tax, security, or financial advice.

## Research question

Can the reviewed V0.1 Stripe capture-bundle schema be imported and replayed twice through the existing close reducer with exactly one balanced booking, while rejecting raw-data tampering, broken object links, missing provenance, and any upgrade beyond the sandbox evidence ceiling?

## Why it matters

The current program is blocked on an authorized operator producing one Stripe-created sandbox PaymentIntent, Charge, Balance Transaction, and Event. The capture harness already writes private raw bodies and an allowlisted review bundle, but the journal correctly recorded that reducer import remained untested. Running a credentialed capture before the importer exists would create evidence that still could not satisfy the preregistered replay gate.

This is therefore the cheapest remaining local prerequisite. It does not repeat or replace the operator capture. It asks whether an accepted bundle can be consumed deterministically and whether the importer fails closed before external evidence is supplied.

## Search method and queries

Primary-source web search was limited to Stripe documentation, followed by direct opening of the current pages on 2026-08-26. Repository inspection covered the capture harness, fixture runner, manifest, measured results, current research protocol, append-only journal, foundations matrix, seven current navigation pages, shared JavaScript/CSS, and recent git history.

Queries:

- `site:docs.stripe.com/testing Stripe sandboxes simulated objects no real money`
- `site:docs.stripe.com/api/events/object Event immutable api_version request idempotency_key`
- `site:docs.stripe.com/api/charges/object balance_transaction payment_intent livemode`
- `site:docs.stripe.com/api/balance_transactions/object amount fee net source`
- `site:docs.stripe.com/api/versioning current API version August 2026 Stripe Dahlia`
- `site:docs.stripe.com/webhooks handle duplicate events ordering idempotency`
- `site:docs.stripe.com/api/idempotent_requests at least 24 hours`

## Source ledger

| Source | Institution / authors | Date | Stable URL | Pinpoint used | What it establishes |
| --- | --- | --- | --- | --- | --- |
| Versioning | Stripe | No publication date; verified 2026-08-26 | https://docs.stripe.com/api/versioning | “current version” and request/webhook version controls | `2026-07-29.dahlia` remains the current documented API version; requests and endpoints can pin a version. |
| API changelog — Dahlia | Stripe | 2026-07-29 release; verified 2026-08-26 | https://docs.stripe.com/changelog | Dahlia → `2026-07-29.dahlia` | Independently lists the pinned monthly release. |
| Testing use cases | Stripe | No publication date; verified 2026-08-26 | https://docs.stripe.com/testing-use-cases | Testing environments; environments versus live mode | Sandboxes return simulated objects and do not move actual money or process through card networks/payment providers. |
| The Event object | Stripe | No publication date; verified 2026-08-26 | https://docs.stripe.com/api/events/object | `api_version`, `data.object`, `request.id`, `request.idempotency_key`, `livemode`, `type` | The captured Event fields can bind a snapshot to an API version, source request, idempotency key, object, type, and test/live mode. |
| The Charge object | Stripe | No publication date; verified 2026-08-26 | https://docs.stripe.com/api/charges/object | `amount`, `balance_transaction`, `currency`, `payment_intent`, `livemode`, `paid`, `status` | A Charge links the PaymentIntent to the Balance Transaction and exposes the fields needed for the capture-chain checks. |
| The Balance Transaction object | Stripe | No publication date; verified 2026-08-26 | https://docs.stripe.com/api/balance_transactions/object | `amount`, `fee`, `net`, `currency`, `source`, `status`, `type` | `net = amount - fee`; `source` links the movement to its Stripe object; pending and available remain distinct. |
| Receive Stripe events in your webhook endpoint | Stripe | No publication date; verified 2026-08-26 | https://docs.stripe.com/webhooks | Event ordering; Handle duplicate events; API versioning | Event delivery is unordered and can duplicate both an Event ID and a logical object/type, so replay must be order-independent and deduplicated. |
| Idempotent requests | Stripe | No publication date; verified 2026-08-26 | https://docs.stripe.com/api/idempotent_requests | Idempotency-key replay, parameter mismatch, pruning after at least 24 hours | Stripe prevents many duplicate POST effects, but its key record can be pruned; permanent internal booking uniqueness remains necessary. |

## Direct evidence

### Direct facts from current primary sources

1. **Direct fact:** Stripe's current Versioning page and changelog both name `2026-07-29.dahlia`; the earlier documentation conflict recorded in the journal is not present in the pages opened on 2026-08-26.
2. **Direct fact:** Stripe sandboxes create simulated Stripe objects without card-network, payment-provider, bank, or real-money processing. A valid imported bundle therefore cannot exceed `CONTROL_PLANE_PASSED`.
3. **Direct fact:** The Charge exposes the associated PaymentIntent and Balance Transaction. The Balance Transaction exposes amount, fee, net, currency, source, and status; Stripe defines net as amount less fee.
4. **Direct fact:** The Event exposes an immutable versioned snapshot, test/live mode, type, object payload, request ID, and idempotency key. These fields are sufficient to recheck the capture harness's proposed PaymentIntent → Charge → Balance Transaction → Event chain.
5. **Direct fact:** Stripe warns that webhook delivery can be out of order and duplicated. It specifically recommends Event-ID deduplication and object-ID plus event-type deduplication for separate Event objects describing the same logical event.
6. **Direct fact:** Stripe idempotency keys are not a permanent ledger constraint; Stripe may remove them after at least 24 hours. The project must preserve its own durable booking key.

### Direct measured result from this repository

The new no-network replay self-test generated a schema-identical synthetic private/raw capture and allowlisted bundle, then exercised the same importer path intended for the authorized operator bundle.

- Syntax passed for the capture harness, fixture runner, and replay gate.
- Four private raw-body hashes were recomputed and matched.
- The safe PaymentIntent, Charge, Balance Transaction, and Event views matched the raw bodies.
- The complete identity, amount, currency, net, request, version, and idempotency chain passed.
- Two replay copies produced one unique event, one balanced posted transaction, one duplicate delivery, and one duplicate booking per deterministic run.
- Two independent executions returned the same result.
- Four mutations were rejected: raw-body hash mismatch, evidence-class upgrade, canonical-object mismatch, and missing raw provenance.
- The earlier fixture suite remains three local passes and one `RAIL_SANDBOX_CAPTURE_REQUIRED` blocker.

Machine-readable result: [`capture-replay-self-test-result.json`](../experiments/fixture-runner-v0.1/capture-replay-self-test-result.json).

## Counterevidence and negative result

- **Counterevidence:** Every object used in this round was locally generated. No Stripe-created object, account response, Workbench record, sandbox Event-list timing, or restricted-key permission was observed.
- **Counterevidence:** Hash consistency proves that the importer received the same private bytes named by the review bundle. It does not independently prove those bytes originated from Stripe. Origin still depends on the capture harness's authenticated HTTPS call plus independent Stripe request-log review.
- **Counterevidence:** HTTP response headers are recorded in the allowlisted provenance but are not inside the raw JSON body. The importer can require the recorded API version and request ID and cross-check the Event; it cannot reconstruct response headers from the body alone.
- **Negative result:** The complete pre-live suite is still false. This round closes the local importer prerequisite but does not clear `RAIL_SANDBOX_CAPTURE_REQUIRED` or NOW 0.

## Bounded inferences

1. **Bounded inference / buildable decision:** The authorized operator run can now use one bounded path: capture privately, review provenance/privacy, run the replay gate on the same private directory, and publish only the measured summary and allowlisted fields.
2. **Bounded inference:** Recomputing private raw hashes before rebuilding safe views prevents a later-edited bundle or raw body from silently changing the reducer input, assuming the hash-bearing review bundle itself is included in the independent review.
3. **Bounded inference:** Sending two identical events and bookings through one fixture is a useful test of deterministic deduplication. It is not yet evidence of database-level uniqueness under concurrency, crash recovery, or multi-process races.
4. **Bounded inference:** Refactoring the runner and capture harness into importable modules reduces code drift between capture validation and replay validation, but it does not turn research code into production payment infrastructure.

## Testable hypotheses

- **Hypothesis H1:** One authorized `2026-07-29.dahlia` sandbox capture will pass all raw-hash, safe-view, object-link, arithmetic, Event, and provenance checks without modifying the importer.
- **Hypothesis H2:** The same accepted bundle will replay twice with exactly one balanced booking and no evidence upgrade.
- **Hypothesis H3:** At least one real-account detail—restricted-key permission, response shape, Event-list timing, or metadata—will require a documented handoff correction without changing the evidence ceiling.

## Unknowns and conflicts

- **Unknown:** Whether the proposed sandbox restricted key can create the PaymentIntent and read the Charge, Balance Transaction, and Event endpoints with the intended minimum permissions.
- **Unknown:** Whether the real sandbox response headers and Event request metadata match the capture harness assumptions.
- **Unknown:** Whether operator metadata contains personal or business information that the current allowlist/forbidden-fragment scan fails to exclude.
- **Unknown:** Whether durable concurrent booking uniqueness survives database races and process crashes; the current reducer is in-memory research code.
- **Resolved documentation conflict:** The current Versioning page and changelog now agree on `2026-07-29.dahlia`.

## Concrete state transition

```text
RAIL_SANDBOX_CAPTURE_REQUIRED
  -- local synthetic importer test passes --> IMPORTER_CONTROL_PLANE_READY
  -- operator creates sandbox objects --> OPERATOR_CAPTURED_PRIVATE
  -- independent request-log + privacy review --> REVIEW_ACCEPTED
  -- all four raw hashes match --> RAW_PROVENANCE_MATCHED
  -- object/link/math/version checks pass --> CANONICAL_CHAIN_VERIFIED
  -- duplicate event + booking replay --> ONE_BALANCED_BOOKING
  -- deterministic second execution --> CONTROL_PLANE_PASSED_RAIL_SANDBOX

any hash/link/math/version/privacy failure
  --> CAPTURE_REJECTED
  --> no ledger import; no evidence upgrade; operator investigates

CONTROL_PLANE_PASSED_RAIL_SANDBOX
  -/-> REVIEWED_CLOSED_LIVE
```

This round reaches only `IMPORTER_CONTROL_PLANE_READY`.

## Authority and funds matrix

| Component / actor | May propose | May approve | May sign or move | May review | Holds real funds in this round? | Only records or simulates |
| --- | --- | --- | --- | --- | --- | --- |
| Agent / automation | Run local checks; prepare a fixture | No account or live-money approval | No credentials; no payment authority | May summarize results | No | Research files and synthetic objects |
| Verified operator | Authorize one sandbox capture | Sandbox credential use and later live gate | Supplies sandbox-only credential; later controls real Stripe account | Receives blocker and evidence | No real funds in this round | Operator authority is described, not exercised |
| Stripe sandbox | Return simulated PaymentIntent, Charge, Balance Transaction, and Event after the future capture | Stripe account policy | Simulates objects only | Request logs support review | No; Stripe explicitly says sandbox objects move no actual money | Simulated rail state |
| Capture harness | Propose one 50-cent simulated PaymentIntent request | Deterministic local checks only | Sends authenticated sandbox API request when operator supplies a key | Writes private raw bodies and safe bundle | No | Captured object records and hashes |
| Independent reviewer | Reject/accept privacy and provenance | Approves bundle for replay only | No payment signing | Compares private bytes, logs, IDs, and allowlist | No | Review attestation |
| Replay gate | Propose canonical fixture | Deterministic validation only | Cannot call Stripe or move funds | Emits measured pass/reject | No | Imports bytes and constructs one balanced booking |
| Reducer | Propose ledger effects from validated fixture | Enforces evidence and idempotency rules | No external rail authority | Reports close/freeze state | No | In-memory research bookings |
| Operator Stripe account in a later live round | N/A | Human/operator policies | Stripe and operator-controlled credentials move real funds | External close reviewer | Yes, only in the later live-money experiment | Not exercised here |

## Which component holds real funds versus records actions

No component held or moved real funds in this round. The temporary synthetic files existed only in a private operating-system temporary directory and were deleted after each test. The replay gate and reducer only validated bytes and created in-memory accounting records. A future Stripe sandbox capture will still contain simulated objects, not funds. Only the verified operator's real Stripe/bank accounts can hold real money in a later separately approved live experiment.

## Implications for current site claims

- No standing claim about money finality, custody, legal responsibility, demand, margin, resource wealth, or live economic closure changes.
- The public journal must record that the importer prerequisite is now measured locally and that the rail blocker remains.
- No evidence graphic changes: the standing model and evidence classes are unchanged.
- No balance may be presented as settled funds, and this self-test must not receive a `LIVE RESULT` label.

## Falsification criteria

Reject the importer design or reopen it if any of the following occurs:

1. a modified raw body passes without its recorded hash changing;
2. a bundle with missing provenance or a mismatched safe view is accepted;
3. a live-mode object or evidence state above `CONTROL_PLANE_PASSED` is accepted;
4. amount, currency, source, net, Event request, idempotency, or object-ID mismatch is accepted;
5. two copies create more than one posted booking or an unbalanced booking;
6. two executions of the same reviewed bundle produce different results;
7. the operator capture requires secrets to be written to a tracked file or command history;
8. a public artifact exposes a client secret, API key, personal data, or private raw response.

## Next highest-priority question

When an authorized operator runs the hardened capture harness with a sandbox-only restricted key, do the actual `2026-07-29.dahlia` response shapes and request logs pass privacy/provenance review and the new replay gate twice with exactly one balanced booking and no evidence-class upgrade?
