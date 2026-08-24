# Secret-safe Stripe sandbox capture handoff

**Research timestamp:** 2026-08-24T05:13:00Z
**Horizon:** A — smallest buildable path now
**Jurisdiction and assumptions:** One US legal operator owns the Stripe account and authorizes any sandbox credential use. This round used no Stripe account, credential, sandbox object, bank rail, provider charge, or real money. It produced a test-only capture harness and product-control procedure, not legal, accounting, tax, security, PCI, or financial advice. Production permissions, retention, accounting, tax, customer terms, and incident response still require account evidence and appropriate US professional review.

## Research question

What is the minimum secret-safe, version-pinned procedure that an authorized operator can run to capture one Stripe sandbox PaymentIntent, its successful Charge, linked Balance Transaction, immutable Event, raw hashes, and idempotency metadata without installing Stripe CLI or committing credentials—and what exact evidence remains blocked before that operator run occurs?

## Why it matters

The existing fixture runner correctly refuses to call authored JSON `RAIL_SANDBOX`, but the next experiment still lacked a safe handoff from an operator-owned Stripe sandbox. Asking an operator to paste a secret into chat, checking raw PaymentIntent output into git, or capturing only screenshots would weaken credential safety and provenance. The next rail test needs a reproducible object chain while preserving the distinction between Stripe-created simulation and real-money evidence.

## Search method and queries

Primary Stripe documentation was searched and reopened on 2026-08-24. The search checked the current monthly API changelog, PaymentIntent creation and confirmation, official sandbox PaymentMethods, Charge-to-Balance-Transaction linkage, Event snapshot/request metadata, sandbox key handling, and request-log filtering.

Queries included:

- `site:docs.stripe.com/api payment_intents create test payment method charge balance_transaction expand API version idempotency`
- `site:docs.stripe.com/api/events retrieve event api_version data object Stripe`
- `site:docs.stripe.com/api/charges/object balance_transaction payment_intent Stripe`
- `site:docs.stripe.com/keys restricted API keys request logs idempotency Stripe`
- `site:docs.stripe.com/changelog 2026-07-29 dahlia Stripe API`
- `site:docs.stripe.com/testing paymentintent test payment methods pm_card_visa confirm=true`
- `site:docs.stripe.com/development/dashboard/request-logs idempotency key request ID Stripe`

No secondary source is used as evidence. A no-network self-test and missing-credential execution were run locally with Node.js 26.5.0.

## Source ledger

| # | Title | Institution / authors | Date | Stable URL | Pinpoint used |
|---|---|---|---|---|---|
| 1 | Stripe API changelog | Stripe | Living changelog; verified 2026-08-24 | https://docs.stripe.com/changelog | Dahlia, `2026-07-29.dahlia` release heading and Payments changes |
| 2 | Testing | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/testing | “How to use test cards”; use test keys and `pm_card_visa`; sandbox moves no real money |
| 3 | Create a PaymentIntent | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/payment_intents/create | `amount`, `currency`, `payment_method`, `confirm`, `metadata`; USD minimum 50 cents |
| 4 | The Charge object | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/charges/object | `balance_transaction` expandable link; `payment_intent`, `livemode`, `status` |
| 5 | The Event object and Retrieve an event | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/events/object and https://docs.stripe.com/api/events/retrieve | immutable `data`, `api_version`, `livemode`, `request.id`, `request.idempotency_key` |
| 6 | API keys | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/keys | sandbox versus live keys; vault/environment storage; restricted keys; request-log access |
| 7 | Best practices for managing secret API keys | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/keys-best-practices | least privilege, secret-manager handoff, exposure response |
| 8 | View API request logs | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/development/dashboard/request-logs | API calls are logged; filter by resource ID, source, endpoint, status, and API version |
| 9 | Versioning | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/versioning | explicit `Stripe-Version`; account default and endpoint version behavior |

## Direct evidence

### Direct facts

1. **A no-CLI charge path exists.** Stripe's API can create and immediately confirm a PaymentIntent with an amount, currency, test PaymentMethod, and `confirm=true`. Stripe's testing guide recommends `pm_card_visa` in test code and requires test keys; the minimum USD PaymentIntent is 50 cents. [2][3]
2. **The required external movement anchor is directly retrievable.** A successful PaymentIntent creates at most one successful Charge. The Charge exposes the associated PaymentIntent and an expandable `balance_transaction` whose ID/object describes the impact on the Stripe balance. [3][4]
3. **The Event preserves version and request provenance.** Stripe says an Event's `data` never changes after creation and records the `api_version` used to render it. The Event request field can carry the originating request ID and idempotency key. [5]
4. **Sandbox evidence is not real funds.** Stripe test keys and test PaymentMethods create simulated objects without card-network/payment-provider processing or actual money. `livemode=false` must therefore be an invariant, and the evidence ceiling remains `CONTROL_PLANE_PASSED`. [2][6]
5. **A secret should not enter the repository or conversation.** Stripe recommends restricted keys where possible, a secret vault or environment variable, and immediate rotation after exposure. Only publishable keys are safe to expose outside the backend. [6][7]
6. **The operator can independently inspect provenance.** Stripe logs API calls and permits filtering by resource ID, source, endpoint, status, and API version. That Dashboard/Workbench review is a separate check from the local bundle. [8]
7. **`2026-07-29.dahlia` is a real published monthly version.** Stripe's changelog lists it as a Dahlia release and its request-log documentation uses it as the version-filter example. A request can pin that version explicitly rather than depend on the account default. [1][8][9]

### Direct measured result

The new `capture-sandbox-charge.mjs` harness was tested locally without a network credential:

| Measurement | Result | Classification |
|---|---:|---|
| Node syntax check | Pass | Direct measured result |
| No-network self-test | Pass | Direct measured result |
| Live-key prefix rejection | 2 / 2 (`sk_live_`, `rk_live_`) | Direct measured result |
| PaymentIntent `client_secret` sanitizer check | Pass | Direct measured result |
| Missing-key execution | `SANDBOX_CREDENTIAL_REQUIRED`, exit 1 | Exact blocker |
| Raw capture directory ignored by git | Pass | Direct measured result |
| Stripe-created objects captured | 0 | Direct negative result |

## Counterevidence and negative results

- **Against claiming the journal's requested rail result:** no authorized sandbox key or Stripe CLI was available, so no PaymentIntent, Charge, Balance Transaction, or Event was created. The runner was not replayed with rail evidence. `RAIL_SANDBOX_CAPTURE_REQUIRED` remains the project blocker.
- **Against requiring Stripe CLI:** the object chain is available through ordinary HTTPS endpoints, so CLI absence is no longer the blocker. The unresolved dependency is operator-authorized sandbox access.
- **Against committing “raw evidence”:** a raw PaymentIntent response can contain `client_secret`; raw API records may also accumulate customer or payment metadata in later experiments. A committed raw directory would create an avoidable credential/privacy risk. The harness therefore writes exact raw bodies with mode `0600` only under a git-ignored directory and emits a separate allowlisted bundle.
- **Against equating a raw-body hash with public reproducibility:** a hash proves later bytes match the private capture, but a reviewer without those private bytes cannot independently reconstruct it. Independent review therefore also needs Stripe object IDs, canonical safe fields, request IDs, and Workbench/request-log confirmation.
- **Documentation conflict:** the Stripe changelog lists `2026-07-29.dahlia`, and the request-log guide uses it as an API-version example, while one render of the general Versioning page still said `2026-06-24.dahlia` was current. This does not invalidate pinning `2026-07-29.dahlia`, but “current version” should not be inferred from one living-doc render. [1][8][9]
- **Against overclaiming the sanitizer:** the self-test covers the explicit allowlist and one `client_secret` canary. It is not a proof that every future Stripe field or operator-authored metadata value is non-sensitive; operator review remains required before any bundle is committed.

## Bounded inferences

- **Bounded inference:** PaymentIntent + Charge + expanded Balance Transaction + Event + raw-response hashes + request/idempotency metadata is the smallest useful first rail bundle for the existing charge reducer. It does not cover refund, dispute, report, payout, or bank evidence.
- **Bounded inference:** a secret-manager/environment handoff is safer than accepting a key as a CLI argument because command-line arguments can appear in process listings. The harness therefore has no key argument.
- **Bounded inference:** byte-preserved raw bodies plus a field-allowlisted public bundle provide a workable split between forensic capture and publishable research evidence, subject to operator privacy review.

## Testable hypotheses

1. With one operator-owned `sk_test_` or sufficiently scoped `rk_test_` credential, the harness creates a 50-cent simulated PaymentIntent, finds one successful Charge, expands one Balance Transaction, and retrieves one matching Event at `2026-07-29.dahlia`.
2. The Event's `request.idempotency_key` equals the creation idempotency key, and all captured objects report `livemode=false`.
3. The sanitized bundle contains no `client_secret`, API key, billing details, receipt URL, email, or card fingerprint.
4. Importing the same bundle twice into the runner produces one balanced external booking and one duplicate suppression, without exceeding `CONTROL_PLANE_PASSED`.
5. Stripe Workbench/request logs can independently locate the creation call by PaymentIntent ID and confirm its API version and request ID.

## Unknowns

- Whether the operator's sandbox permits the exact PaymentIntent creation/retrieval calls under a restricted key, and the minimum RAK permissions required.
- Whether Event listing is immediately consistent enough for the six-attempt, 2-second polling window; a longer bounded window may be needed.
- Whether the API response `Stripe-Version` header is populated on every endpoint and whether Workbench exposes all idempotency metadata needed for independent review.
- Whether the current runner's canonicalization and transaction mapper can import the sanitized bundle without refinement.
- Refund failure, dispute reinstatement, report availability, automatic-payout membership, bank posting, provider cash linkage, live settlement, accounting, tax, and professional-review requirements.

## Buildable decision

Keep the runner blocked and add the operator capture harness as the next cheapest test. The harness:

1. refuses live credential prefixes and any non-test credential format;
2. accepts a sandbox key only through `SELF_FUNDING_STRIPE_SANDBOX_KEY`;
3. pins `Stripe-Version: 2026-07-29.dahlia` and uses one unique idempotency key;
4. creates exactly one simulated USD 0.50 card PaymentIntent;
5. retrieves the Charge, expanded Balance Transaction, and matching Event;
6. requires `livemode=false`, the pinned Event version, and the same Event idempotency key;
7. stores exact raw bodies privately and emits an allowlisted bundle with raw hashes;
8. caps the evidence at `CONTROL_PLANE_PASSED` and states what it cannot prove.

No Stripe object was captured in this round. The operator execution remains a deliberate external action because it requires account authority not present in the repository.

## Concrete state transition

```text
NO_OPERATOR_CREDENTIAL
  → SANDBOX_CREDENTIAL_REQUIRED
  → RAIL_SANDBOX_CAPTURE_REQUIRED

AUTHORIZED_SANDBOX_KEY (never written or printed)
  → reject live prefix / validate test prefix
  → POST PaymentIntent (50¢, pm_card_visa, confirm, pinned version, idempotency key)
  → require succeeded + livemode=false
  → GET Charge?expand[]=balance_transaction
  → require linked PaymentIntent + expanded Balance Transaction + livemode=false
  → GET matching payment_intent.succeeded Event
  → require immutable Event api_version + matching idempotency key + livemode=false
  → private raw bytes (0600, git-ignored) + allowlisted hash bundle
  → OPERATOR_REVIEW_REQUIRED
  → RAIL_SANDBOX_CAPTURED
  → import twice → exactly one balanced booking
  → maximum CONTROL_PLANE_PASSED
```

## Authority matrix and real-funds boundary

| Component / role | Proposes | Validates / approves | Signs or mutates Stripe | Holds real funds? | This round |
|---|---:|---:|---:|---:|---|
| Agent / automation | Capture procedure and code | Local safety assertions | No credential; no Stripe mutation | No | Built and self-tested harness |
| Authorized legal operator | Whether and when to run sandbox test | Account access and secret handoff | **Yes, sandbox objects only** | **Yes only in separate live Stripe/bank accounts; not in sandbox** | Absent |
| Capture harness | Fixed test request | Prefix, version, livemode, object linkage, sanitizer | Uses operator-supplied test key when invoked | No—records only | No network call |
| Stripe sandbox | N/A | Stripe simulation rules | Creates simulated objects | **No—simulated balance only** | Not reached |
| Private capture directory | N/A | Operator controls filesystem access | No | No—stores records only | Git-ignore verified |
| Sanitized bundle / runner | N/A | Hash, schema, balance, dedupe, evidence ceiling | No | No—records only | Bundle not yet created |
| Independent reviewer | No | Object IDs, hashes, logs, no-secret review | No | No | Required next |
| Live Stripe / business bank | N/A | Rail/account rules | Authorized live operations only | **Yes—operator funds** | Not used |

The agent, harness, fixture runner, website, internal ledger, and sandbox hold no real funds. Only the named operator's separate live Stripe account or business bank can hold real funds.

## Implications for current site claims

- No product, treasury, margin, demand, custody, or live-result claim changes. The standing site already says the rail capture and NOW 0 are incomplete.
- `journal.html` must record the buildable handoff, local safety measurements, documentation conflict, exact blocker, and next operator test.
- No evidence graphic changes: the standing evidence model is unchanged.
- No shared navigation, CSS, JavaScript, theme, motion, or standalone preview change is warranted.
- `research/foundations.md` is not updated because this round operationalizes the existing evidence boundary rather than correcting it.

## Falsification criteria

The capture decision must be rejected or revised if:

1. the harness accepts any `sk_live_` or `rk_live_` credential;
2. any key, PaymentIntent client secret, billing detail, receipt URL, email, or card fingerprint appears in console output or the sanitized bundle;
3. any captured Stripe object has `livemode=true` or an Event version other than the pinned version;
4. the Event idempotency key does not match the creation request;
5. the Charge lacks a linked PaymentIntent or expanded Balance Transaction;
6. a raw response is written outside the git-ignored private directory by default;
7. a sandbox bundle can reach `REVIEWED_CLOSED_LIVE` or be described as real funds;
8. replaying the same accepted bundle twice creates two cash bookings;
9. the operator cannot confirm the request/object chain independently in Stripe logs;
10. a restricted-key test shows the proposed permission boundary cannot create and retrieve the required objects without broader authority than approved.

## Next highest-priority question

When an authorized operator runs the harness with a sandbox-only credential, does the resulting `2026-07-29.dahlia` bundle pass privacy/provenance review and replay twice through the fixture runner with exactly one balanced external booking and no evidence-class upgrade?
