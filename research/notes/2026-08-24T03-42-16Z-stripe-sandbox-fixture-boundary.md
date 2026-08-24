# Stripe sandbox fixture boundary for the V0.1 close reducer

**Research timestamp:** 2026-08-24T03:42:16Z
**Horizon:** A — smallest buildable path now
**Jurisdiction and assumptions:** One US legal operator owns a standard Stripe account, accepts one USD card payment, uses standard automatic payouts, and reconciles to one operator-owned US business checking account. This note defines a product-testing boundary. It is not legal, accounting, tax, security, or financial advice. Live-account eligibility, reserve sizing, record retention, tax treatment, consumer obligations, and production controls require account evidence and appropriate US professional review.

## Research question

Which preregistered V0.1 daily-close fixtures can Stripe's current sandbox generate as canonical Stripe objects, which require deterministic transport or policy injection, and which facts remain impossible to prove without a minimum live-money test?

## Why it matters

The proposed reducer must survive charges, fees, refunds, disputes, payouts, duplicate or reordered events, provider mismatches, and compromise signals before the first real payment. But a sandbox object is not a bank posting and a simulated payout is not money received. If all fixtures are called equivalent “sandbox evidence,” the experiment can pass while its most important external claims remain untested.

## Search method and queries

The search was bounded to current Stripe primary documentation. Pages were reopened on 2026-08-24 and checked for the exact sandbox/live boundary, documented payment and dispute test values, asynchronous refund transitions, payout success/failure values, webhook retry/ordering behavior, report availability, and sandbox payout settings.

Queries included:

- `site:docs.stripe.com/testing refunds disputes available balance payout failure test mode Stripe`
- `site:docs.stripe.com/testing-use-cases simulated balances payouts test mode`
- `site:docs.stripe.com/payouts test bank account payout fails sandbox standard payout failure merchant account`
- `site:docs.stripe.com/sandboxes automatic payouts payout schedule`
- `site:docs.stripe.com/webhooks duplicate events unordered delivery manual resend event`
- `site:docs.stripe.com reporting API sandbox balance report payout reconciliation`

No secondary source is used as evidence. Infrastructure availability is not treated as evidence of customer demand, production eligibility, or bank settlement.

## Source ledger

| # | Title | Institution / authors | Date | Stable URL | Pinpoint used |
|---|---|---|---|---|---|
| 1 | Testing | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/testing | “Simulate a dispute”, “Simulate an asynchronous refund”, “Send funds to your available balance”, “Event destinations” |
| 2 | Testing use cases | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/testing-use-cases | “Testing environments versus live mode”; charge/dispute/refund/payout QA cases |
| 3 | Receive payouts | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/payouts | “Test payouts”, US test bank/debit destinations, “Payout failures” |
| 4 | Receive Stripe events in your webhook endpoint | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/webhooks | sandbox retry count, manual resend, ordering, duplicate-event handling |
| 5 | How the Reports API works | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/reports/api | report types, `data_available_*`, interval bounds, UTC, major/minor-unit difference |
| 6 | Payout reconciliation report | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/reports/payout-reconciliation | automatic-payout scope and next-day data availability |
| 7 | Sandbox settings | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/sandboxes/dashboard/sandbox-settings | copied payout schedule, minimum balance, start-of-day, currency settings |
| 8 | How disputes work | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/disputes/how-disputes-work | live issuer decision and unpredictable late-win boundary |

## Direct evidence

### Direct facts

1. **A Stripe sandbox creates simulated API objects without processing real money or external networks.** Stripe says sandboxes return simulated payments, charges, refunds, balances, and other objects, while card networks and payment providers do not process the transactions. [2]
2. **Canonical sandbox-backed refund regressions exist.** `pm_card_pendingRefund` creates a refund that starts pending and later succeeds; `pm_card_refundFail` creates a refund that appears succeeded and later fails. Each produces the documented update/failure event. [1]
3. **Canonical sandbox-backed dispute withdrawal/reinstatement movements exist, but only for the simplified test path.** Stripe test payment methods/tokens create disputes. Submitting `winning_evidence` closes the dispute as won and credits the disputed amount and related fees; losing evidence closes without reinstatement. Inquiry escalation is separately testable. [1][2]
4. **A sandbox can create available-balance and payout fixtures.** `pm_card_bypassPending` sends the simulated charge directly to the available test balance. Stripe publishes US test payout destinations that succeed or fail with specified failure codes; test payouts simulate live payout behavior without bank processing. [1][3]
5. **Webhook transport is explicitly at-least-once and unordered.** Stripe documents sandbox retries, manual resend of the same Event, non-guaranteed order, repeated Event IDs, and separate Event objects that can describe the same underlying object/type. [4]
6. **Reports can be exercised in test mode.** Report Type objects have a `livemode` flag, report runs use explicit availability bounds, and the API distinguishes inclusive interval start/exclusive interval end and major-unit CSV values from minor-unit API values. Payout reconciliation remains defined around automatic payouts. [5][6]
7. **Sandbox payout settings can mirror important production configuration without proving production behavior.** Stripe can copy payout schedule, minimum balance, enabled currencies, custom start of day, and instant-payout settings into a sandbox. [7]
8. **Some live dispute behavior is issuer-driven and not deterministic.** Stripe says a rare live dispute can change from lost to won as a late win, and Stripe cannot predict when or why because the issuer drives it. [8]

## Counterevidence and negative results

- **Against one undifferentiated fixture suite:** provider-cost mismatch, an unexpected payout destination, credential compromise, evidence corruption, and policy bypass are project conditions—not Stripe rail events. They require synthetic policy inputs even when surrounding object fixtures originate from Stripe.
- **Against “sandbox proves settlement”:** no sandbox payment is processed by a card network and no test payout reaches a bank. Therefore sandbox success cannot establish actual availability timing, a posted bank line, trace support, real refund funding, or funds custody. [2][3]
- **Against using the bypass-pending fixture as a timing test:** `pm_card_bypassPending` deliberately skips the pending state. It proves the reducer's available-balance branch, not the live account's settlement delay. [1]
- **Against deterministic coverage of every dispute regression:** the simplified winning/losing test path can create withdrawal and reinstatement evidence, but unpredictable live late wins and issuer/card-network nuance remain outside deterministic sandbox proof. [2][8]
- **Negative result:** the reviewed primary sources did not establish a deterministic API that advances a one-off card charge through the account's real automatic-payout schedule, bank posting, and trace lifecycle on demand. The sandbox should therefore record whether an automatic payout appears naturally; it must not substitute a manual payout and call transaction membership proven.
- **Negative result:** no reviewed source established that sandbox report latency matches live report latency. A sandbox run can validate schemas, intervals, parsing, and availability-state handling; it cannot validate the 36-hour live stale-evidence target.

## Bounded inferences and buildable decision

### Four evidence classes

V0.1 should assign every fixture an `evidence_class` and refuse to upgrade it silently:

| Class | Source | What it can prove | Required fixtures |
|---|---|---|---|
| `RAIL_SANDBOX` | Stripe-created sandbox object plus API read-back | Object linkage, Balance Transaction math, documented state changes, signed event ingestion | successful charge + fee; pending/available branches; refund success/failure; dispute debit/reinstatement/loss; payout success/failure if supported; report parsing |
| `TRANSPORT_INJECTION` | Authenticated sandbox payload delivered by controlled harness | Idempotency, duplicate delivery, reorder tolerance, signature rejection, canonical refresh | same Event ID twice; separate events for same object/type; reverse delivery; stale/tampered signature |
| `POLICY_INJECTION` | Versioned project-owned fixture with explicit expected oracle | Freeze logic and recovery controls not emitted by Stripe | provider-cost mismatch; manual-payout rejection; unexpected destination; unbalanced entry; credential/evidence compromise |
| `LIVE_EVIDENCE` | Minimum real charge/refund/payout/provider/bank chain | Real custody, settlement timing, external posting, account eligibility and residual differences | one minimum charge; one deliberate refund; standard automatic payout; report; bank line/trace; provider cash document |

### Fixture manifest decision

Each fixture must contain: `fixture_id`, `evidence_class`, source URL and retrieval date, Stripe API version, source object IDs or synthetic seed, raw-payload hashes, intended delivery order, expected canonical state, expected ledger entries, expected close state, expected freeze tier, permitted mutations, and the exact assertion that the fixture **cannot** prove.

Passing NOW 0 means every `RAIL_SANDBOX`, `TRANSPORT_INJECTION`, and `POLICY_INJECTION` fixture reaches its preregistered oracle with:

- zero duplicate external-object bookings;
- every internal transaction balanced;
- zero unexplained difference inside the fixture's simulated evidence boundary;
- the exact freeze tier and permitted-recovery path;
- no synthetic record labeled as external observation;
- no `REVIEWED_CLOSED_LIVE` state.

Only the live chain can produce `REVIEWED_CLOSED_LIVE`.

## Concrete state transition

```text
FIXTURE_DECLARED
  ├─ Stripe sandbox creates object → RAIL_SANDBOX_CAPTURED
  ├─ authenticated delivery mutation → TRANSPORT_INJECTED
  └─ versioned project fault → POLICY_INJECTED
        ↓
CANONICAL_READ + IMPORT + MATCH + LEDGER POST
        ├─ oracle mismatch → TEST_FAILED + required freeze tier
        └─ oracle exact → CLASS_PASSED
              ├─ sandbox/transport/policy → CONTROL_PLANE_PASSED
              │                            (never live-close evidence)
              └─ real rail + provider + bank → EVIDENCE_COMPLETE_LIVE
                                                ↓ independent review
                                           REVIEWED_CLOSED_LIVE
```

## Authority matrix and real-funds boundary

| Component / role | Creates fixture | Mutates Stripe | Moves real funds | May declare live close | Holds real funds? |
|---|---:|---:|---:|---:|---|
| Test author | Declares manifest/oracle | No | No | No | No |
| Stripe sandbox | Creates simulated rail objects | Test objects only | No | No | **No—simulated balances only** |
| Transport harness | Replays/reorders captured payloads | No | No | No | No |
| Policy fault injector | Creates project-owned exception inputs | No | No | No | No |
| Reducer/importer | Appends observations, matches, ledger entries | No | No | No | No—records only |
| Independent test reviewer | Attests fixture result | No | No | No | No |
| Live Stripe account | N/A | Through separately authorized actions | Yes | Supplies rail evidence only | **Yes—Stripe custodies operator funds** |
| Operator business checking | N/A | Bank rail | Yes | Supplies posted bank evidence only | **Yes—the bank custodies operator funds** |
| Independent live reviewer | No | No | No | Yes, after all evidence classes remain labeled | No |

## Testable hypotheses

1. **H1:** Every Stripe-created sandbox Balance Transaction can be imported exactly once and reconciled to one source object and one balanced internal transaction.
2. **H2:** Replaying the same authenticated Event ID and reversing the delivery order changes delivery evidence but never duplicates a cash booking.
3. **H3:** Refund failure and dispute reinstatement create the expected reversal movements and reopen the affected close interval.
4. **H4:** The configured sandbox can produce a standard automatic payout with queryable membership; if it cannot, `AUTOMATIC_PAYOUT_SANDBOX_BLOCKED` is the exact result and a manual payout is not an acceptable substitute.
5. **H5:** Every policy-only exception reaches the preregistered freeze tier without any Stripe write or erased evidence.

## Unknowns

- Whether the actual operator account and a copied sandbox expose all named report types and automatic-payout membership.
- Whether an automatic sandbox payout can be induced within a bounded test window without changing the production-like standard-automatic configuration.
- The sandbox delay before documented asynchronous refund and payout transitions complete.
- Whether sandbox trace/reference fields resemble the operator bank's eventual posted fields.
- Actual live settlement, report latency, refund-prefunding access, payout failure timing, bank trace/reference support, and provider cash-document linkage.
- Appropriate live amount, customer disclosures, refund wording, accounting treatment, tax treatment, reserve amount, and record-retention period; these require operator decisions and relevant US professional review.

## Implications for current site claims

- `mvp.html` must replace “test every payment ... and reconciliation transition” with the narrower supported claim: test Stripe object logic, transport faults, and policy faults, while reserving custody, bank posting, settlement timing, and trace proof for NOW 1.
- `build.html` must distinguish `CONTROL_PLANE_PASSED` from `REVIEWED_CLOSED_LIVE`; a synthetic or sandbox-zero difference cannot satisfy the real report/bank close definition.
- No treasury, demand, margin, or live-result claim changes. No evidence graphic should change because this round refines the experiment boundary rather than the standing evidence strength.

## Falsification criteria

This design is falsified or must be revised if any of the following occurs:

1. Stripe's sandbox cannot produce the documented refund or dispute movement links used by the reducer.
2. A duplicate or reordered authenticated delivery causes a second external-object booking.
3. A synthetic policy fault can be mistaken for an observed Stripe object or can reach a live-close state.
4. A manual payout is accepted as evidence for standard automatic-payout membership.
5. Any fixture oracle requires updating after seeing the reducer output rather than through a versioned correction with a stated reason.
6. The live round later shows an object, timing, trace, fee, or bank behavior outside the fixture model and the system fails to reopen the affected interval safely.

## Next highest-priority question

Can the first versioned fixture runner execute the source-backed `RAIL_SANDBOX`, `TRANSPORT_INJECTION`, and `POLICY_INJECTION` manifest—including an explicit automatic-payout capability probe—and produce the preregistered close state, freeze tier, and balanced entries for every case with zero silent evidence-class upgrades?
