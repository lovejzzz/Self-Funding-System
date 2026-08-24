# Stripe two-pass daily close for V0.1

**Research timestamp:** 2026-08-24T03:14:27Z
**Horizon:** A — smallest buildable path now
**Jurisdiction and assumptions:** One US legal operator is the Stripe merchant and account owner; one standard Stripe account accepts one USD card payment; standard automatic payouts are enabled; one operator-owned US business checking account receives payouts; OpenRouter supplies the first metered provider call. This is a product-control design, not legal, accounting, tax, security, or financial advice. Account eligibility, bank-export fields, accounting recognition, tax treatment, reserve sizing, and production controls require account evidence and professional review.

## Research question

For V0.1's first US Stripe card job, what minimum external reconciliation schema and two-pass daily-close procedure can match Stripe payment, balance-transaction, refund, dispute, and payout movements, internal double entry, OpenRouter provider cost, and the operator's bank posting—and which exact mismatches freeze new work, discretionary spend, or all mutations?

## Why it matters

An internal balance can be perfectly balanced and still disagree with Stripe, a provider, or the bank. Conversely, a successful PaymentIntent or webhook does not identify every fee, refund, dispute, payout, reversal, or bank posting. V0.1 cannot call residual cash policy-available surplus until those independent evidence chains converge. The procedure must also fail safely when Stripe's complete reports are not yet available.

## Search method and queries

The search was bounded to current primary sources: Stripe API/report/webhook documentation, OpenRouter's first-party usage-accounting documentation, and IRS recordkeeping guidance. Documentation pages were reopened on 2026-08-24 and checked for the object fields, report coverage, data-latency statements, payout limitations, webhook delivery properties, and recordkeeping passages actually used below.

Queries and document-path checks included:

- `site:docs.stripe.com balance transaction source payout reconciliation report automatic manual payout`
- `site:docs.stripe.com/api payout reconciliation_status trace_id failure_balance_transaction`
- `site:docs.stripe.com/api refund balance_transaction failure_balance_transaction status`
- `site:docs.stripe.com/api dispute balance_transactions withdrawal reinstatement`
- `site:docs.stripe.com webhooks event ordering duplicate event IDs canonical API object`
- `site:docs.stripe.com/reports/api interval_start interval_end data availability CSV major units`
- `site:openrouter.ai/docs usage accounting generation id cost credits`
- `site:irs.gov publication 583 bank reconciliation electronic records double entry`

No secondary source is used as evidence. No demand claim is inferred from the availability of these controls.

## Source ledger

| # | Title | Institution / authors | Date | Stable URL | Pinpoint used |
|---|---|---|---|---|---|
| 1 | The Balance Transaction object | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/balance_transactions/object | `amount`, `fee`, `net`, `balance_type`, `reporting_category`, `source`, `status`, `available_on`, and transaction `type` |
| 2 | Balance report | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/reports/balance | “Summary sections”, “Itemized data”, “Data availability”; starting balance + activity − payouts = ending balance |
| 3 | Payout reconciliation report | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/reports/payout-reconciliation | Automatic-payout scope, balance/payout sections, itemized data, data availability |
| 4 | Reconcile a payout with balance transactions | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/payouts/reconciliation | Query Balance Transactions by automatic payout ID; manual payout limitation |
| 5 | The Payout object | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/payouts/object | `balance_transaction`, `failure_balance_transaction`, `reconciliation_status`, `status`, `trace_id` |
| 6 | The Refund object | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/refunds/object | payment/charge linkage, `balance_transaction`, `failure_balance_transaction`, `status` |
| 7 | The Dispute object | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/disputes/object | payment/charge linkage and `balance_transactions` withdrawal/reinstatement list |
| 8 | Receive Stripe events in your webhook endpoint | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/webhooks | Event ordering, duplicate events, retries, API retrieval, asynchronous queue |
| 9 | Run reports with the Reporting API | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/reports/api | Inclusive/exclusive intervals, UTC option, CSV major units versus API minor units, report-run status |
| 10 | Usage Accounting | OpenRouter | Living documentation; verified 2026-08-24 | https://openrouter.ai/docs/cookbook/administration/usage-accounting | Response usage, `generation_id`, cost in credits, later `/generation` retrieval |
| 11 | Publication 583, Starting a Business and Keeping Records | Internal Revenue Service | Revised December 2024 | https://www.irs.gov/publications/p583 | Electronic records and source documents; business checking; bank reconciliation; double-entry equality; computerized-system controls |

## Direct evidence

### Direct facts

1. **Stripe's Balance Transaction is the rail-side cash-movement anchor.** It records gross amount, fee, net, currency, availability date, pending/available status, balance type, reporting category, and a `source` object. Its transaction types include charges, refunds, payout movements, failures, fees, adjustments, and dispute-related movements. The equation `net = amount - fee` is explicit. [1]
2. **Stripe's balance report is statement-like and complete only after source data is available.** The report covers starting balance, activity, payouts, and ending balance, with itemized transaction metadata. Stripe says data is computed daily and is normally available the following day; the Reporting API can also produce partial-day output. [2]
3. **Automatic payouts have a machine-queryable membership relation; manual payouts do not.** Stripe's payout-reconciliation report and API associate the balance transactions in a standard automatic payout. Stripe says the user is responsible for reconciling manual payouts, and the Payout object's reconciliation status is not applicable where the linkage is unsupported. [3][4][5]
4. **Payout completion is not only a single amount field.** A Payout includes its own balance transaction, optional failure balance transaction, status, destination, arrival date, reconciliation status, and—where supported—a bank-generated trace reference. [5]
5. **Refunds and disputes create their own cash-movement evidence.** A Refund links to its payment/charge and balance transaction; a failed refund can have a separate balance transaction reversing the initial movement. A Dispute can expose zero, one, or two balance transactions representing withdrawal and possible reinstatement. [6][7]
6. **Webhook delivery is neither ordered nor exactly once.** Stripe documents unordered delivery, retries, duplicate Event delivery, and cases where separate Event objects refer to the same underlying object. It recommends asynchronous handling and API retrieval of canonical objects. [8]
7. **Report ingestion needs explicit normalization.** Reporting intervals have inclusive start and exclusive end boundaries; UTC can be selected. CSV monetary values use major units while Stripe API objects use integer minor units. A report run can be pending, successful, or failed. [9]
8. **OpenRouter exposes attributable usage cost, not proof of external cash settlement.** Responses include usage and cost in credits; a generation ID can retrieve the record later. That supports provider-cost accrual for a job. It does not identify a Stripe Projects charge, card posting, or provider receipt. [10]
9. **Independent books-to-bank reconciliation is a standard recordkeeping control.** IRS Publication 583 describes source documents, a separate business checking account, reconciling statements to books, equal debits and credits under double entry, and controls that connect computerized entries to underlying source documents. It discusses monthly bank reconciliation; it does not prescribe this project's daily close. [11]

## Counterevidence and negative results

- **Against a real-time “closed” claim:** Stripe says daily report data is normally available the next day. A webhook/API pass can be current without being an evidence-complete report close. A guaranteed complete close in less than 24 hours is therefore not supported. [2][3]
- **Against universal automatic payout matching:** automatic-payout membership is supported, but manual and unsupported payout methods require user-controlled reconciliation. V0.1 should avoid manual and instant payouts unless a separate tested mapping exists. [3][4][5]
- **Against webhooks as the journal of record:** event order and uniqueness are not guaranteed. Events are authenticated triggers and immutable evidence records, not the authoritative cash ledger. [8]
- **Against treating generation cost as paid provider cash:** OpenRouter usage identifies an accrued cost in provider credits. It does not prove when or how the operator's external payment method was charged. [10]
- **Against presenting a daily close as a legal mandate:** the reviewed IRS source describes monthly reconciliation. The two-pass daily procedure below is a V0.1 product-control target, not a US legal conclusion. [11]
- **Negative result:** no reviewed primary source established that a generic bank feed always carries a Stripe payout ID. A supported trace/reference is preferable; otherwise the final bank match needs exact amount/currency/date/destination plus independent human review.

## Bounded inferences and buildable decision

### Bounded inference: two passes, one close

V0.1 should implement one reconciliation run with two evidence checkpoints:

1. **`PROVISIONAL` API pass.** After the UTC interval ends, verify/store webhook evidence, refresh canonical Stripe objects, exhaustively import Balance Transactions through a recorded watermark, import job ledger entries and OpenRouter generation usage, normalize all money to integer minor units, and run deterministic invariants. This pass can expose exceptions quickly, but it cannot release surplus.
2. **`EVIDENCE_COMPLETE` report-and-bank pass.** Wait until Stripe reports cover the entire interval, import and hash the itemized report, prove membership of every standard automatic payout, and match each payout to the operator's posted bank line. Store provider usage separately from provider invoice/payment evidence. An independent View Only reviewer then changes the run to `REVIEWED_CLOSED` or opens an exception.

This procedure deliberately distinguishes freshness from completeness. The build target is a provisional pass after each UTC day and an evidence-complete pass when the external sources are ready. A **36-hour stale-evidence threshold** is a conservative V0.1 target to freeze new work for investigation; it is not a Stripe guarantee or law and must be replaced by observed account latency.

### Minimum external reconciliation schema

All timestamps are UTC; all cash fields are integer minor units plus ISO currency. Raw payloads/reports are retained by content hash in access-controlled storage.

| Record | Minimum fields and invariant |
|---|---|
| `external_events` | `rail`, `event_id`, `object_type`, `object_id`, `event_type`, API version, Stripe-created time, received time, payload hash, signature result, processed time. Unique `rail + event_id`; a second Event for the same object/type triggers canonical refresh, not a second journal entry. |
| `stripe_balance_transactions` | `txn_id`, `balance_type`, `source_id`, source type, reporting category/type, gross, fee, net, currency, status, created, available-on, payout ID, raw hash, observed time. Require `net = gross - fee`; unique `txn_id`. |
| `stripe_payments` | job ID, PaymentIntent ID, Charge ID, amount, currency, status, linked Balance Transaction ID. |
| `stripe_refunds` | job ID, Refund ID, PaymentIntent/Charge IDs, amount, currency, status, initial and failure Balance Transaction IDs. |
| `stripe_disputes` | job ID, Dispute ID, PaymentIntent/Charge IDs, amount, currency, status, all withdrawal/reinstatement Balance Transaction IDs, response deadline. |
| `stripe_payouts` | Payout ID, amount, currency, status, automatic flag/method, arrival date, destination fingerprint, initial/failure Balance Transaction IDs, reconciliation status, trace status/value. |
| `provider_usage` | job/attempt ID, provider, generation ID, cost and unit, usage hash, observed time. Unique provider + generation ID. This accrues cost; it does not mark cash paid. |
| `provider_cash_documents` | provider, invoice/receipt ID, period, amount, currency, payment or bank-line reference, status, document hash. |
| `bank_statement_lines` | operator-account fingerprint, institution line ID, posted time, amount, currency, sanitized description hash, trace/reference, statement/export hash. |
| `ledger_transactions` / `ledger_entries` | transaction ID, accounts, debit/credit minor units, job ID, external reference type/ID, evidence hash, idempotency key, reversal-of ID, created/posted times. Every transaction balances; external reference is unique for its booking rule. Never update/delete a posted entry—append reversal/correction. |
| `reconciliation_runs` | run ID, inclusive start/exclusive end, source watermarks, report run ID/hash, opened time, state, exception count, preparer, reviewer, checkpoint hash. |
| `reconciliation_matches` | run ID, left/right evidence references, deterministic match rule, status, difference in minor units. |
| `reconciliation_exceptions` | run ID, code, severity, object reference, amount/currency, opened/resolved times, source-backed resolution reference. |

### State transition

```text
OPEN
  └─ canonical APIs + ledger + provider usage imported
       └─ PROVISIONAL
            ├─ source report not complete → EVIDENCE_WAIT
            ├─ invariant/authorization failure → ALL_MUTATION_STOP
            └─ full report + automatic-payout membership + bank evidence
                 └─ EVIDENCE_COMPLETE
                      ├─ independent rejection → EXCEPTION_FREEZE
                      └─ independent attestation → REVIEWED_CLOSED

Any later refund, dispute, payout failure, provider bill, or corrected bank line
reopens the affected interval by an append-only correcting run; it never edits
the prior checkpoint.
```

### Exact exception and freeze matrix

For the first $20 experiment, the tolerance for an unexplained cash difference is **zero cents**. The scope of the stop—not a de minimis amount—prevents a harmless duplicate from becoming a system-wide incident.

| Condition | Classification | Required control response | What remains allowed |
|---|---|---|---|
| Same Stripe Event ID delivered again with identical verified payload | Expected duplicate | Record delivery count; do not post again; no freeze | Normal operation |
| Separate Events for same object/type, canonical object converges, no new booking | Expected update | Refresh canonical object and evidence hash; no duplicate journal entry | Normal operation |
| Open refund/dispute; provider usage lacks later cash document; payout not yet bank-matched; report pass still provisional within target window | `SURPLUS_FREEZE` | Keep affected job/amount out of unrestricted surplus | Delivery, human-protective refund, already reserved provider work |
| Any unmatched or amount/currency/source-mismatched Balance Transaction; unexpected fee/adjustment; missing bank payout after the operator's documented posting deadline; report evidence older than 36 hours; provider generation cost mismatch; unsupported manual/instant payout | `NEW_WORK_AND_DISCRETIONARY_FREEZE` | Stop accepting new paid work, new provider/discretionary spend, and surplus release; open exact exception | Read-only collection, reconciliation, delivery already owed, human-controlled customer protection |
| Unbalanced internal transaction; same external object booked twice; unexplained negative external balance; unexpected payout destination; evidence-integrity or credential compromise; movement suggesting unauthorized funds transfer | `ALL_MUTATION_STOP` | Disable runtime signers including automated refunds, revoke/expire affected credentials, preserve logs, reconcile externally, require independent restore approval | Read/export only; refunds and customer protection use the separately authenticated human emergency path |

Restoration requires a source document, append-only reversal/correcting entry when needed, a clean rerun over the affected interval, negative-permission tests after credential events, and an independent reviewer who did not prepare the run.

## Authority matrix and real-funds boundary

| Component / role | May propose | May mutate records | May move real funds | May close / restore | Holds real funds? |
|---|---:|---:|---:|---:|---|
| Agent / job worker | Job and spend intent | Job-local artifacts only | No | No | No—only proposes |
| Webhook verifier | No | Append authenticated event evidence | No | No | No—records a rail message |
| Read-only reconciliation RAK | No | No rail mutation; importer appends observations | No | No | No—reads Stripe |
| Deterministic importer / matcher | Correcting-entry and exception proposal | Append evidence, matches, pending correction | No | No | No—records and compares |
| Isolated refund signer | Exact policy-approved refund | Creates one Stripe refund | Yes, a bounded outbound refund | No | No—can cause movement but does not custody funds |
| Independent View Only reviewer | Reject/approve close | Append attestation only | No | Close only; restore jointly | No |
| Operator Administrator / bank signer | Exception action | High-impact rail/bank/security changes | Yes | Approves emergency restore | No personally; acts for the named legal operator |
| Stripe payments balance | N/A | External rail | External debits/payouts | N/A | **Yes—Stripe custodies operator funds** |
| Stripe refund/dispute prefunding | N/A | External rail | Funds refunds/disputes after payments balance | N/A | **Yes—Stripe custodies operator-prefunded funds** |
| Operator business checking | N/A | Bank rail | Receives payouts and pays obligations | N/A | **Yes—the bank custodies operator funds** |
| Internal ledger / reconciliation DB | N/A | Append-only records | No | N/A | **No—records claims and restrictions** |
| OpenRouter usage record / credits | N/A | Provider record | Records/consumes provider credits | N/A | **No operator cash custody; it records provider service/credit obligation** |

## Testable hypotheses

1. **H1:** With standard automatic payouts, every imported Stripe Balance Transaction in the first experiment can be assigned exactly once to a source object, an internal balanced transaction, and—when paid out—one automatic payout batch.
2. **H2:** The operator's bank export exposes either a usable trace/reference or enough stable amount/currency/post-date/destination evidence for an independent reviewer to identify the payout without free-text guesswork.
3. **H3:** Stripe's complete itemized report becomes available within 36 hours of the UTC interval end for the test account.
4. **H4:** OpenRouter generation records reconcile to provider cash documentation at the provider's actual billing cadence without treating aggregate Projects spend as job-level proof.
5. **H5:** Injected duplicate, reordering, refund-failure, dispute, payout-failure, manual-payout, and unauthorized-destination fixtures produce the specified freeze tier with no double booking.

## Unknowns / conflicting evidence

- The account's actual Stripe report eligibility, report type/API version, balance types, payout method, timezone/cutoff, data latency, and bank trace support are unknown until sandbox and account inspection.
- The bank's exact CSV/API identifiers, pending-versus-posted semantics, corrections, and retention behavior are unknown.
- Stripe says report data is normally available the next day, but not at a guaranteed project deadline; the 36-hour stale threshold is a testable safety target.
- OpenRouter's generation cost remains disconnected from Stripe Projects SPT/PaymentIntent, receipt, charge cadence, and bank/card posting until the separately approved live replication is run.
- The proper US GAAP or tax treatment of customer prepayment, Stripe fees, disputes, provider credits, reserves, and revenue recognition requires the operator's accountant/tax adviser. This schema preserves evidence; it does not decide those policies.
- State-specific unclaimed-property, sales-tax, consumer-protection, money-transmission, privacy, and record-retention duties were outside this narrow technical-control round and require legal review before production.

## Implications for current site claims

- Replace the unqualified **TARGET · 24h reconciliation age** with a two-pass close: provisional API freshness followed by evidence-complete report/bank review. A 36-hour value may be shown only as the experiment's stale-evidence freeze target, not an observed Stripe service level.
- Replace “any unexplained difference freezes discretionary spending” with tiered controls. An unmatched cent freezes new work and discretionary spend; an unbalanced or duplicate internal booking, unexpected destination, or compromise stops all runtime mutations; unresolved normal timing exposure freezes surplus rather than customer protection.
- Add the minimum schema and standard-automatic-payout decision to the build guide.
- Do not change any claim about observed demand, margins, balances, or self-funding. This round produces a buildable control design, not a live financial result.

## Falsification criteria

This design is rejected or must be revised if any of the following occurs in deterministic fixtures or the first approved live loop:

1. A Stripe cash movement cannot be uniquely keyed and linked to a source object plus one balanced internal transaction.
2. A manual/instant payout is required but cannot be mapped to its transaction membership with independent evidence.
3. A report is marked complete while its starting balance + activity − payouts does not equal ending balance, or API/report unit normalization changes the amount.
4. A bank posting cannot be identified without subjective description matching or a second payout could satisfy the same rule.
5. A duplicate/reordered event creates a second journal entry or hides a later refund/dispute/payout reversal.
6. Provider generation cost cannot be separated from provider cash settlement evidence.
7. Any freeze fixture permits the prohibited signer/action, or recovery can erase prior evidence or be approved by the preparer alone.
8. The first account's normal report latency exceeds 36 hours often enough that the chosen close cadence prevents operation; then the threshold and operating cadence must be redesigned from measured data, not relaxed silently.

## Buildable decision

Implement the schema and matcher in a Stripe sandbox first. Use standard automatic payouts only. Preregister one UTC interval, a zero-cent tolerance, the freeze fixtures, the 36-hour stale-evidence target, and the independent reviewer. A sandbox close is necessary but not sufficient: the next live step still requires explicit operator approval and separately capped capital.

## Next highest-priority question

Can a sandbox implementation of this schema ingest a preregistered fixture set—successful charge, duplicate/reordered webhook, Stripe fee, refund success/failure, dispute withdrawal/reinstatement, automatic payout/failure, manual-payout rejection, provider-cost mismatch, and unexpected destination—and produce the exact close state and freeze tier with zero duplicate or unbalanced entries?
