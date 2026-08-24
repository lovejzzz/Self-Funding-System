# Stripe credential and approval matrix for V0.1

**Recorded:** 2026-08-24T02:44:43Z
**Horizon:** A — smallest buildable current path
**Evidence status:** Direct facts + bounded inference + exact pre-live test gates

## Research question

For V0.1's US Stripe card-payment topology, what is the minimum credential and approval matrix for balance reads, refunds, payout settings, top-ups, bank-account changes, emergency stop, rotation, and independent close—and which controls can be verified before a live charge?

## Why it matters

The previous round established three real custody locations: the operator's Stripe payments balance, operator-funded refund/dispute prefunding, and business-only checking. That topology is unsafe if one model process, one unrestricted key, or one Dashboard role can both observe funds and redirect, remove, or spend them. This round converts the abstract separation of proposal, approval, signature, and review into a Stripe-specific build decision.

## Scope, jurisdiction, and advice boundary

- Assumed deployment: one US legal operator, one standard Stripe merchant account, US card payments, no Connect money movement, low-volume V0.1, and a separately controlled business bank account.
- “Independent close” means the daily accounting/reconciliation close, not closing the Stripe account. Stripe says only the Account Owner can close the account.
- This is a product-control design based on public Stripe documentation, not legal, accounting, tax, security, or financial advice. Account-specific feature availability, insurance, regulatory duties, and professional segregation requirements remain subject to Stripe account evidence and qualified US review.
- Stripe documentation is living documentation. Each cited page was re-checked on 2026-08-24; an undated page is reported as “current documentation verified 2026-08-24,” not assigned an invented publication date.

## Search method and queries

1. Read the current Stripe documentation for API-key types, restricted-key permissions, rotation, team roles, security history, top-ups, payouts, refunds, webhooks, and idempotency.
2. Searched within the official documentation for `restricted API key AI agent`, `Stripe roles refund payout bank API keys`, `Top-up Specialist`, `pause payments payouts`, `rotate expire API key`, `webhook secret rotate`, `refund idempotency`, and `own bank account payout settings`.
3. Mapped each requested capability to: proposer, deterministic approver, signer or Dashboard actor, independent reviewer, real-funds effect, and a sandbox/tabletop verification.
4. Looked specifically for disconfirming evidence: a standard-account one-click stop, a native two-person approval gate, a narrower human payout role, an API for the operator's own bank-account change, and proof that test-mode top-ups exercise live refund-prefunding rails.
5. Used only first-party Stripe documentation for findings. No secondary source is treated as evidence.

## Source ledger

| # | Title | Institution / author | Date | Stable URL | Pinpoint used |
|---|---|---|---|---|---|
| S1 | Restricted API keys | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/keys/restricted-api-keys | “What is a restricted API key?”, “Create a restricted API key”, “Migrate from a secret key”, “Assign permissions” |
| S2 | API keys | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/keys | “Create a restricted API key”, “Expire an API key”, “Rotate an API key”, “Access policies” |
| S3 | User roles | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/get-started/account/teams/roles?locale=en-GB | Administrator, Account Owner, Developer, Analyst, Refund Analyst, View Only, Accountant, Top-up Specialist, Connect Risk Analyst |
| S4 | Manage team members in an organization | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/get-started/account/orgs/team | “Require 2FA for all users”, “View your security history” |
| S5 | Refund and cancel payments | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/refunds | Refund creation and refund webhook-event sections |
| S6 | Receive Stripe events in your webhook endpoint | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/webhooks | “Test your handler”, “Secure your endpoint”, signature verification and secret-rolling sections |
| S7 | Idempotent requests | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/idempotent_requests | POST idempotency behavior, parameter comparison, and key-retention guidance |
| S8 | The Top-up object / Create a top-up | Stripe | Living API reference; verified 2026-08-24 | https://docs.stripe.com/api/topups/create | `POST /v1/topups`, required amount and currency, pending result |
| S9 | Receive payouts | Stripe | Living documentation; verified 2026-08-24 | https://docs.stripe.com/payouts | payout scheduling and Dashboard bank-account/currency settings |

## Direct evidence

### Direct fact — restricted keys are the supported machine boundary

Stripe says a restricted API key (RAK) can be set to `Read`, `Write`, or `None` by resource, defaults new permissions to `None`, and is preferred over an unrestricted secret key—especially for an AI agent. Stripe also says all Stripe APIs support RAKs. `Write` includes `Read`, so write credentials must be treated as readable credentials too. [S1]

Stripe directs teams to create and test a RAK in a sandbox, inspect request logs, map successful `GET` calls to read permissions and `POST`/`DELETE` calls to write permissions, then remove unused access before creating the live equivalent. [S1]

### Direct fact — human roles do not supply the desired separation automatically

- Administrator can refund payments, view balance, pay out to the external bank, create/delete API keys, edit the operator's bank details, and edit payout schedules. [S3]
- Developer can access the unrestricted secret key, refund payments, view balance, and create payouts, although it cannot edit the operator's payout schedule or own bank details. [S3]
- Analyst can refund payments and create external payouts in the same role. [S3]
- Refund Analyst can view and refund payments but cannot view balance, create payouts, edit bank details, manage keys, or view events/logs. [S3]
- View Only can view payments, balance, payouts, events/logs, reports, and security history, but cannot refund, create payouts, edit bank details, or manage keys. Accountant is similarly non-mutating for payments and payouts while adding accounting access. [S3]
- Top-up Specialist can create, view, and update top-ups and view balance/payouts, but cannot access other Stripe features. [S3]
- Multiple human roles are additive; Stripe explicitly warns that combining roles can create unintended authority. [S3]

### Direct fact — rotation and audit have testable controls

Stripe says expiring a key immediately prevents further API calls. Rotation revokes the key and generates a replacement; a grace period of up to seven days can support migration, and request logs should be checked before old-key expiry. Stripe recommends a secrets vault and access policies rather than legacy IP restrictions. [S2]

Organization/team documentation recommends phishing-resistant passkeys or security keys, allows enforced 2FA, and exposes exportable security history covering user security, team, API, and product actions. [S4]

### Direct fact — refunds, top-ups, and webhooks are distinct powers

Stripe's refund API is a state-changing request; refund outcomes also arrive through events. POST requests support idempotency keys, and Stripe compares parameters on repeated keys to reject accidental reuse with different inputs. [S5, S7]

The Top-ups API can create a pending top-up for a specified amount and currency. Separately, the human Top-up Specialist role can create and update top-ups. Neither fact proves that the account has the feature enabled or that a test top-up exercises the live bank-funded `refund_and_dispute_prefunding` path. [S3, S8]

A webhook signing secret authenticates inbound event payloads; it is not an API credential that moves funds. Stripe provides local/sandbox event tests and signing verification. [S6]

## Counterevidence and negative findings

1. **No documented standard-account one-click stop.** The reviewed role table gives Connect Risk Analyst the ability to pause a *connected account's* payments and payouts, but says that role cannot act on the platform account. V0.1 assumes no Connect money movement. The reviewed primary sources therefore do not establish a single Stripe control that freezes all payment acceptance, refunds, payouts, bank changes, and API access for the operator's own account. [S3]
2. **No native maker-checker approval was found.** RAKs and Dashboard roles define who can call or view a function; the reviewed documentation does not show a two-person pre-execution approval for a refund, own-account payout, bank change, or key rotation. This is an absence finding, not proof that no enterprise/private control exists.
3. **Broad roles undermine least privilege.** Analyst combines refund and payout; Developer carries almost-all-API power through the secret key; Administrator combines refund, payout, key, bank, and schedule powers. Those roles are not acceptable runtime identities for the agent. [S3]
4. **Test mode is not live custody evidence.** A sandbox can prove allow/deny behavior, idempotency, signature verification, and application state transitions. It cannot prove live account eligibility, real bank authentication, live limits, settlement timing, or the actual refund-prefunding debit path.
5. **Top-up terminology is not enough.** The existence of `POST /v1/topups` does not establish that programmatic top-ups are the correct or enabled mechanism for V0.1's separate refund/dispute prefunding balance. The first live prefunding must remain a human account-verified operation.

## Bounded inference — buildable V0.1 decision

Use three machine secrets and three distinct human roles. Do not give a runtime process an unrestricted `sk_live_...` key, a Dashboard session, or any permission to change payout settings, bank details, keys, team membership, or top-ups.

### Machine credentials

1. **`stripe-reconcile-rk`** — resource reads only for the exact payment, balance-transaction, refund, dispute, and payout objects needed by close. Begin at all `None`; add only permissions demonstrated by successful sandbox calls. It records external truth and never moves money.
2. **`stripe-refund-rk`** — a separate RAK with write access only to the exact tested refund endpoint and the minimum reads required to bind `job_id → payment object → maximum refundable amount`. The model may propose; deterministic policy approves only a disclosed, still-valid refund for the original payment and amount cap; an isolated refund service signs with a job-derived idempotency key. Any mismatch or policy exception goes to a human Refund Analyst. This credential can move real funds back to the customer and is never available to the job sandbox or reconciliation worker.
3. **`stripe-webhook-whsec`** — endpoint-specific verification secret available only to the ingress verifier. It proves event origin; it cannot call Stripe or move funds. A separate read-only retriever may fetch canonical objects after signature verification.

### Human roles

1. **Refund Analyst** — handles refund exceptions without receiving balance, payout, bank, key, or log authority.
2. **Administrator under phishing-resistant 2FA** — performs live key creation/expiry, payout-schedule changes, and own-bank-account changes. These are out-of-band change operations, never normal agent workflow. A second human with View Only reviews the resulting security-history and payout/bank evidence; because Stripe does not document pre-execution dual control here, V0.1 adds an internal approval ticket and post-change freeze.
3. **View Only independent reviewer** — performs daily close, exports evidence, and reviews payments, balances, payouts, logs, and security history without mutation. Use Accountant instead only when Stripe Revenue Recognition/accounting access is actually required. Do not add roles to this reviewer.

The operator may temporarily assign a separate **Top-up Specialist** to prefund refunds/disputes after an approved amount and bank-source check. Remove or leave dormant according to the operator's access policy. Do not automate top-ups in V0.1.

## Authority matrix

| Capability | Propose | Approve | Sign / act | Independent review | Real-funds effect | Pre-live verification |
|---|---|---|---|---|---|---|
| Balance/object read | Reconciliation schedule | Deterministic endpoint allowlist | `stripe-reconcile-rk` | View Only | None; records external state | Positive GETs plus negative POST/DELETE matrix; inspect per-key logs |
| Refund within disclosed rule | Agent or failed-job state machine | Deterministic policy binds original payment, amount cap, time, and job | Isolated service with `stripe-refund-rk` and idempotency key | View Only daily close; Refund Analyst for exception | Stripe payments/refund balance → customer | Sandbox success, duplicate replay, parameter mismatch, insufficient permission, event signature, pending/failed outcome |
| Payout creation / schedule | No agent proposal in V0.1 | Named operator change ticket | Human Administrator in Dashboard | View Only checks security history and subsequent payout | Stripe payments balance → operator bank | Role tabletop and security-history evidence only; no live movement before charge |
| Refund/dispute prefunding top-up | Reserve policy flags threshold | Named operator and bank-source check | Human Top-up Specialist / supported Dashboard flow | View Only verifies source, Stripe balance, and bank posting | Operator bank → Stripe prefunding | Sandbox/API object tests do not prove live path; live micro-prefund remains gated |
| Own bank-account change | Denied to agent | Two-person internal change ticket | Human Administrator with phishing-resistant 2FA | View Only checks security history; payout freeze until re-verified | Redirects future payouts; no immediate ledger movement | Role/2FA tabletop and audit-log export; actual bank verification is live-only |
| API key rotation / expiry | Security policy or incident signal | Named human incident lead | Human Administrator or Developer; vault deployment | View Only reviews API/security history | No direct movement; changes ability to move/read funds | Sandbox dual-key rollout, old-key zero-use check, immediate expiry test |
| Emergency stop | Any anomaly detector or reviewer | Deterministic local threshold for application stop; human for Stripe credential revocation | Local kill switch first; human expires affected RAK/rolls webhook secret; Administrator freezes high-risk Dashboard changes | View Only exports logs and closes incident | Stops new application actions; does not reverse completed external movements | Tabletop: deny new jobs/provider spend, reject refund signer, expire test RAK, verify old key fails, restore with new key |
| Daily independent close | Scheduled close worker prepares evidence | None—comparison is deterministic | Read-only worker + View Only human attestation | Separate operator resolves exceptions | None; records/attests only | Reconcile sandbox objects and exported logs with zero unexplained difference |

## Concrete control state transition

```text
agent_or_event_proposal
  -> immutable intent {job_id, action, Stripe object, amount, policy version, expiry}
  -> deterministic policy APPROVE | REJECT | HUMAN_REVIEW
  -> isolated signer selects exactly one action-specific credential
  -> Stripe request with job-derived idempotency key
  -> signed webhook + read-only canonical-object retrieval
  -> append-only internal journal
  -> independent read-only close
  -> CLOSED | EXCEPTION_FREEZE

credential_or_bank_anomaly
  -> LOCAL_STOP (new jobs, provider spend, automatic refund signer)
  -> HUMAN_REVOKE (expire/rotate affected RAK or webhook secret)
  -> EXPORT_LOGS + RECONCILE
  -> ROTATE + NEGATIVE_PERMISSION_TEST
  -> independent approval
  -> RESTORE
```

### What holds real funds versus what only records or proposes

| Component | Holds or moves real funds? | Role |
|---|---|---|
| Operator Stripe payments balance | **Holds real external funds** | Receives and debits customer-payment proceeds |
| Operator Stripe refund/dispute prefunding | **Holds real external funds** | Separately funded backup for refunds/disputes |
| Operator business checking | **Holds real external funds** | Receives payouts and sources approved prefunding |
| Customer/card rail | **Receives real refund movement** | External destination/source; not controlled by the agent |
| `stripe-refund-rk` signer | **Can cause a bounded real-funds movement; holds no funds** | Executes only approved refunds |
| Administrator / Top-up Specialist Dashboard action | **Can cause or redirect real-funds movements; holds no funds** | Human-only high-impact change surface |
| Reconciliation RAK, webhook verifier, internal ledger, agent, and policy engine | **Hold no funds** | Observe, propose, approve, verify, or record |

## Pre-live verification plan and acceptance gate

The control plane may proceed toward one live charge only after all of the following pass in a Stripe sandbox or documented human-role tabletop:

1. Each machine secret is stored in a vault and accessible to only one service identity.
2. A generated endpoint matrix shows every required request succeeds and every forbidden request fails for each RAK; failures include refund creation by the read key and payout/top-up/account/key mutation by both runtime RAKs.
3. Two identical refund submissions with one job-derived idempotency key produce one Stripe mutation; reusing that key with a changed amount is rejected.
4. Signed webhook fixtures are accepted once, invalid/old signatures are rejected, duplicates are journal-idempotent, and a secret-roll rehearsal accepts the intended overlap then rejects the retired secret.
5. A test RAK is rotated, old-key traffic reaches zero, the old key is expired, and a deliberate old-key request fails.
6. The local emergency stop denies new job acceptance, provider spend, and automatic refund signing while retaining read-only reconciliation.
7. The human role review confirms: Refund Analyst cannot view balance or payout; View Only cannot mutate; Top-up Specialist cannot reach other functions; Administrator changes are visible in security history; all humans use phishing-resistant 2FA where the account supports it.
8. The independent close reconstructs sandbox payment/refund objects and the internal journal with zero unexplained difference.

Passing these tests establishes permission behavior and recovery mechanics, not live bank custody or settlement. Live top-up/prefunding, bank-change verification, payout limits, and the first real refund remain separate low-value experiments requiring operator approval.

## Testable hypotheses

1. **H1 — least privilege is sufficient:** the two action-specific RAKs plus one webhook secret can support all normal V0.1 runtime behavior without any `sk_live_` credential.
2. **H2 — refund automation is bounded:** an isolated refund signer can execute the disclosed full-refund rule while every unrelated write endpoint is denied and duplicates are harmless.
3. **H3 — recovery is measurable:** after a simulated credential compromise, the system can stop local mutation, expire the test RAK, establish zero old-key traffic, rotate, reconcile, and restore without an unexplained ledger difference.

## Unknowns and conflicts

- Exact resource permission labels required by the selected SDK/API version must be captured from the account's sandbox UI and request logs; this note does not invent a permission name.
- Whether the account supports refund/dispute prefunding, API top-ups, access policies, organization-level enforcement, or every listed role is account- and region-dependent.
- The reviewed documentation does not establish formal Stripe-native two-person approval for own-account payouts, bank changes, refunds, or key rotation.
- The correct live path from the named bank account into `refund_and_dispute_prefunding`, its minimum amount/timing, and its relation to `/v1/topups` remain unproved.
- A local stop plus credential revocation cannot undo an already completed refund, payout, top-up, or bank change.
- Account recovery after compromise, Stripe support response time, insurance coverage, liability allocation, and required incident notices remain outside this round and need contractual/professional review.

## Implications for current site claims

The Architecture page's statement that proposal, approval, and signing are separate remains supportable but was too abstract. It should now name the actual V0.1 boundary: one read-only RAK, one refund-only RAK, one webhook-verification secret, human-only top-up/payout/bank/key changes, and independent View Only close. “Emergency stop” must be described as a tested sequence, not a Stripe-wide kill switch. No displayed balance or ledger bucket becomes evidence of settled external funds.

## Falsification criteria

Reject or revise this design if any of the following occurs:

1. A required normal runtime operation cannot be completed without an unrestricted secret key or a Dashboard user session.
2. Either runtime RAK can create a payout, top-up, bank/account change, API key, team change, or unrelated payment mutation.
3. The reconciliation RAK can mutate any Stripe resource.
4. The refund RAK cannot be narrowed to the chosen refund path, or a duplicate/mismatched request can create more than the approved refund.
5. A View Only reviewer can mutate funds/settings, or the refund/operator roles cannot be separated on the actual account.
6. Key expiry fails to stop old-key requests, security history omits the tested high-impact changes, or the recovery drill leaves an unexplained external/internal difference.
7. Live account evidence shows that refund prefunding or bank/payout controls behave materially differently from the documented topology.

## Next highest-priority question

What is the minimum external reconciliation schema and daily-close procedure that can match Stripe payment, balance-transaction, refund, dispute, and payout objects to the internal double-entry journal, provider bills, and the operator's bank posting—and which exact mismatches must freeze new work or discretionary spending?
