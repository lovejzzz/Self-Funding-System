# V0.1 fixture runner: measured local pass, exact rail blocker

**Research timestamp:** 2026-08-24T04:42:09Z
**Horizon:** A — smallest buildable path now
**Jurisdiction and assumptions:** One US legal operator would own the Stripe account and all real funds. This round used no Stripe account, credential, sandbox object, bank rail, provider charge, or real money. It tested a local research harness only. The design is a product-control experiment, not legal, accounting, tax, security, or financial advice; live permissions, record retention, accounting treatment, tax, customer terms, and production controls require account evidence and appropriate US professional review.

## Research question

Can the first versioned fixture runner execute the source-backed `RAIL_SANDBOX`, `TRANSPORT_INJECTION`, and `POLICY_INJECTION` manifest—including an explicit automatic-payout capability probe—and produce the preregistered close state, freeze tier, and balanced entries for every case with zero silent evidence-class upgrades?

## Why it matters

The standing design distinguishes simulated rail facts from transport faults, project-owned policy faults, and live settlement. That distinction is only useful if executable code refuses to upgrade weak evidence. A runner that silently substitutes local JSON or a schema mock for Stripe-created sandbox objects could report `CONTROL_PLANE_PASSED` without ever observing the rail it claims to test.

## Search method and queries

Primary Stripe documentation and first-party Stripe repositories were reopened on 2026-08-24. The search checked current API-version pinning, Event snapshot/version behavior, duplicate and unordered delivery, idempotency retention, CLI fixture capabilities, sandbox scope, and the official mock server's limitations.

Queries included:

- `site:docs.stripe.com api versioning webhook events Stripe-Version event api_version`
- `site:docs.stripe.com idempotent requests same key parameters 24 hours`
- `site:docs.stripe.com stripe cli trigger fixture override supported events`
- `site:github.com/stripe stripe-mock stateless latest API version behavior`
- `site:docs.stripe.com testing use cases sandbox real money payout`

No secondary source is used as evidence. The local prototype was then executed once with Node.js 26.5.0. No network credential or Stripe account mutation was attempted.

## Source ledger

| # | Title | Institution / authors | Date | Stable URL | Pinpoint used |
|---|---|---|---|---|---|
| 1 | Versioning | Stripe | Living documentation; verified 2026-08-24; current version shown as 2026-07-29.dahlia | https://docs.stripe.com/api/versioning | “Versioning”: request header, CLI argument, and webhook endpoint version |
| 2 | Receive Stripe events in your webhook endpoint | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/webhooks | “Event ordering”, “API versioning”, “Handle duplicate events” |
| 3 | Idempotent requests | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/idempotent_requests | first-result replay, parameter comparison, at-least-24-hour retention, POST scope |
| 4 | Testing use cases | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/testing-use-cases | “Testing environments”: simulated objects and no real charges/payments |
| 5 | Trigger events with the Stripe CLI | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/cli/trigger | supported triggers; `--override`, `--add`, `--remove`, `--skip`, `--edit` |
| 6 | stripe-mock README | Stripe open-source project | Repository current; verified 2026-08-24 | https://github.com/stripe/stripe-mock | “Features and limitations”: stateless, hardcoded, latest-version-only, not behavioral |

## Direct evidence

### Direct facts

1. **The API version can and should be explicit.** Stripe's current API reference identifies `2026-07-29.dahlia` as the current version. Requests can set `Stripe-Version`; CLI requests can set a version argument; webhook destinations can pin their Event version. [1]
2. **A request version does not rewrite an Event snapshot.** Stripe says Event structure is determined by the account or destination version, existing Event objects do not change after creation, and retrieving an old Event under a newer request version does not change its data. [2]
3. **Delivery identity needs two dedupe keys.** Stripe may deliver the same Event more than once and may generate separate Events for the same underlying object and type; it recommends recording Event IDs and also using `data.object.id + event.type`. Delivery order is not guaranteed. [2]
4. **Stripe idempotency is necessary but not a durable ledger key.** Stripe replays the first status/body for a key, including a `500`, and rejects a same-key parameter mismatch while the record exists. Keys may be removed after at least 24 hours; reuse after pruning becomes a new request. Persistent internal booking keys therefore remain necessary. [3]
5. **Stripe CLI fixtures and triggers can create source flows, but they do not certify the runner result.** The CLI exposes supported event triggers and fixture edits/overrides. The runner must still capture object IDs, raw read-backs, API version, and hashes. [5]
6. **A local schema mock cannot become rail evidence.** Stripe describes `stripe-mock` as stateless, hardcoded, latest-version-only, and unable to reproduce real Stripe behavior or requested error states. Stripe recommends sandbox/test-mode checks for sophisticated integration behavior. [6]
7. **A Stripe sandbox is still simulated.** It creates and retrieves test objects without actual charges, payments, or moved money. [4]

### Measured local result

The prototype and manifest are under `research/experiments/fixture-runner-v0.1/`. One deterministic run produced:

| Measurement | Result | Classification |
|---|---:|---|
| Manifest fixtures | 4 | Direct measured result |
| Local transport/policy fixtures passed | 3 | Direct measured result |
| Evidence-boundary guard attacks rejected | 3 / 3 | Direct measured result |
| `RAIL_SANDBOX` fixtures passed | 0 | Direct measured result |
| Rail capability probe | `RAIL_SANDBOX_CAPTURE_REQUIRED` | Exact blocker |
| Complete three-class pre-live suite | `false` | Direct measured result |

The passing cases were duplicate/reordered delivery with duplicate booking suppression, provider-cost mismatch → `WORK_AND_SPEND_FREEZE`, and unexpected payout destination → `ALL_MUTATIONS_STOPPED`. Guards rejected a pre-live → live-close upgrade, a captured-payload hash change, and reuse of one idempotency key with different ledger entries.

## Counterevidence and negative results

- **Against declaring success:** the runner did not execute a single Stripe-created sandbox object. The `RAIL_SANDBOX` class is therefore blocked, and the answer to the full research question is **no, not yet**.
- **Against filling the gap with `stripe-mock`:** its hardcoded, stateless output can validate shape but not the stateful charge → Balance Transaction → refund/dispute/payout behavior under study. [6]
- **Against treating the prototype as the close reducer:** the local code exercises evidence gates, dedupe, balanced entries, and freeze selection only. It does not yet retrieve canonical Stripe objects, normalize reports, persist an append-only journal, reopen closed intervals, or reconcile a bank/provider document.
- **Against treating `object ID + event type` as canonical state:** that pair is a documented duplicate-detection key, but the prototype does not prove that every same-type update is economically redundant. Production ingestion must preserve delivery evidence and refresh the canonical object before deciding whether a new movement exists.
- **Against overreading three passes:** the fixtures are authored examples, not independent evidence of all source-backed cases in the previous manifest. Refund regression, dispute withdrawal/reinstatement, payout failure, report parsing, and recovery remain unexecuted.
- **Disconfirming fact for permanent reliance on Stripe idempotency:** the server-side key can be pruned after 24 hours. A durable internal uniqueness constraint is still required even when every POST uses a Stripe idempotency key. [3]

## Bounded inferences and buildable decision

### Evidence classifications

- **Direct fact:** version pinning, immutable Event snapshots, duplicate/order behavior, finite idempotency retention, sandbox simulation, and `stripe-mock` limitations are documented by Stripe.
- **Direct measured result:** three local fixtures and three evidence guards passed; the rail probe returned an exact blocker.
- **Bounded inference:** the manifest contract is sufficient to prevent the three tested silent-upgrade paths, not every possible provenance or reducer bug.
- **Testable hypothesis:** a pinned Stripe sandbox capture containing object IDs, raw hashes, Event version, Charge, and Balance Transaction can enter the same runner without changing its evidence ceiling.
- **Unknown:** whether the operator sandbox can produce a standard automatic payout and queryable membership within a bounded window remains account-dependent and untested.

### Decision

Keep the prototype and its negative result. Do not mark NOW 0 `CONTROL_PLANE_PASSED`. The cheapest next test is not more local fixture authoring: it is one read-only-preserved Stripe sandbox capture at a pinned version. The capture must include the creation request/idempotency key, Event ID and `api_version`, canonical object IDs/read-backs, raw hashes, Charge-linked Balance Transaction, and the exact CLI/API commands used. Only after that rail input passes should the automatic-payout capability probe run; a manual payout remains an invalid substitute.

## Concrete state transition

```text
MANIFEST_0_1_DECLARED
  ├─ TRANSPORT_INJECTION → hash/version check → dedupe → balanced post
  │                                             └─ exact oracle → LOCAL_CLASS_PASSED
  ├─ POLICY_INJECTION → synthetic/oracle check → freeze reducer
  │                                             └─ exact oracle → LOCAL_CLASS_PASSED
  └─ RAIL_SANDBOX → Stripe capture present?
          ├─ no  → RAIL_SANDBOX_CAPTURE_REQUIRED → NOT_RUN
          └─ yes → object IDs + raw hashes + API version → canonical import
                                                       └─ exact oracle → RAIL_CLASS_PASSED

LOCAL_CLASS_PASSED + RAIL_CLASS_PASSED + all manifest cases
  → CONTROL_PLANE_PASSED
  → never REVIEWED_CLOSED_LIVE
```

## Authority matrix and real-funds boundary

| Component / role | Proposes | Validates / approves | Signs or mutates Stripe | Holds real funds? | Evidence status this round |
|---|---:|---:|---:|---:|---|
| Fixture author | Manifest and oracle | No | No | No | Created synthetic inputs |
| Local runner | No | Hash, class, balance, freeze assertions | No | No—records only | Executed three local fixtures |
| Stripe CLI / sandbox adapter | Future test commands | Operator authorizes sandbox use | Test objects only | **No—sandbox balances are simulated** | Absent; exact blocker |
| Verified legal operator | Authorizes account experiment | Human approval | Owns credentials and account | **Yes in live Stripe/bank only** | No account action in this round |
| Live Stripe account | N/A | Rail rules | Authorized live mutations | **Yes—custodies operator funds** | Not used |
| Operator business checking | N/A | Bank rules | Bank rail | **Yes—bank custodies operator funds** | Not used |
| Independent reviewer | No | Reviews capture and result | No | No | Required later; not performed here |

The agent, manifest, runner, website, and internal ledger hold no funds. They only propose, validate, record, or display actions. Real funds would remain with the named operator's live Stripe account or business bank.

## Testable hypotheses

1. A pinned sandbox charge and linked Balance Transaction can be captured with stable object IDs and byte-preserved or canonically hashed read-backs.
2. Feeding that capture twice produces one external booking and preserves the `RAIL_SANDBOX` label.
3. An Event retrieved under a later request version retains its original `api_version` and snapshot hash.
4. The sandbox either exposes a standard automatic payout with membership inside the preregistered window or returns `AUTOMATIC_PAYOUT_SANDBOX_BLOCKED`; no manual payout is substituted.
5. After rail input exists, every pre-live class still remains capped at `CONTROL_PLANE_PASSED`.

## Unknowns

- Actual operator sandbox/API access, endpoint version, enabled report types, payout schedule, and automatic-payout timing.
- Whether an automatic sandbox payout can be induced without changing the production-like standard-automatic configuration.
- The complete object normalizer and ledger schema needed for refund failure, dispute reinstatement, payout failure, report availability, and interval reopen.
- Whether payload canonicalization across language/runtime versions is stable enough; production may require byte-preserved inputs plus a specified canonicalization standard.
- Live custody, settlement timing, bank trace, provider cash document, refund prefunding, tax, accounting, customer terms, and professional-review requirements.

## Implications for current site claims

- The standing site already distinguishes `CONTROL_PLANE_PASSED` from `REVIEWED_CLOSED_LIVE` and does not claim NOW 0 has passed. No product, treasury, margin, demand, custody, or live-result claim changes.
- `journal.html` must record the measured 3-pass / 1-blocked result and exact next test.
- No evidence graphic changes: the standing evidence model is unchanged. No shared navigation, CSS, JavaScript, theme, motion, or standalone preview change is warranted.
- `research/foundations.md` is not updated because this round measures a prototype against the existing evidence model rather than correcting that model.

## Falsification criteria

The current runner decision is falsified or must be revised if:

1. any pre-live manifest reaches `REVIEWED_CLOSED_LIVE`;
2. a payload hash, API version, object ID, or evidence class can be omitted without blocking execution;
3. two Events for one object/type or reuse of one internal booking key can create a second cash booking;
4. an unbalanced transaction or unexpected payout destination fails to select `ALL_MUTATIONS_STOPPED`;
5. local or `stripe-mock` data can be labeled `RAIL_SANDBOX` without a Stripe sandbox capture;
6. an actual sandbox capture cannot be represented without weakening provenance, balance, or evidence-ceiling checks.

## Next highest-priority question

Can one operator-owned Stripe sandbox charge at pinned API version `2026-07-29.dahlia` be captured with its Event, Charge, linked Balance Transaction, raw hashes, and idempotency metadata, then replayed through the runner twice with exactly one balanced external booking and no evidence-class upgrade?
