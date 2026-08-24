# Stripe balance separation for the first paid job

**Research time:** 2026-08-24T02:12:52Z
**Horizon:** A — smallest buildable path under institutions available now
**Jurisdiction and assumptions:** United States; one verified operator is the sole Stripe User and merchant of record; one prepaid card job for a generic machine-verifiable software service; no Connect marketplace, escrow promise, payroll, sales-tax collection, or regulated client-money activity. This is a product-control design, not legal, tax, or accounting advice. Entity choice, state law, tax treatment, revenue policy, and any duty to hold customer funds in trust require licensed US review before launch.

## Research question

For the first US Stripe card job, which receiving, operating, refund, tax, and reserve separations can and should be real external fund containers, and which are only internal ledger restrictions?

## Why it matters

Calling five database accounts “separated balances” can hide a single spendable pool. The first experiment needs a refund that still works after a worker or payout mistake, while avoiding account complexity that does not change custody or loss containment.

## Search method and queries

Searched current official Stripe documentation, an official FASB Accounting Standards Update, and current IRS business-record guidance. Searches were run on 2026-08-24 UTC and limited to first-party or standards sources. Queries included:

- `site:docs.stripe.com balance refunds insufficient available balance reserve payouts bank accounts official`
- `site:docs.stripe.com refunds disputes balance external top up refund source payments balance`
- `site:docs.stripe.com minimum balance automatic payouts`
- `site:irs.gov separate business bank account Publication 583`
- `site:fasb.org ASC 606 contract liability customer pays before transfer PDF`

The search looked for disconfirming evidence that Stripe has no real purpose-separated balance, and for evidence that internal restrictions alone satisfy accounting, tax, or custody requirements.

## Source ledger

| # | Title | Institution / authors | Date | Stable URL | Pinpoint |
|---|---|---|---|---|---|
| 1 | Balances and settlement time | Stripe | Continuously updated; no page publication date shown; accessed 2026-08-24 | https://docs.stripe.com/payments/balances | “Balance types” and “Best practices for balance management,” lines 10–36 and 122–134 in the current Markdown view |
| 2 | Add funds to your Stripe balance | Stripe | Continuously updated; no page publication date shown; accessed 2026-08-24 | https://docs.stripe.com/get-started/account/add-funds | “Refunds and disputes balance,” lines 23–29; “Financial account,” lines 30–39 |
| 3 | Minimum balances for automatic payouts | Stripe | Continuously updated; no page publication date shown; accessed 2026-08-24 | https://docs.stripe.com/payouts/minimum-balances-for-automatic-payouts | Lines 10–24, 36–50: retained floor, setup, negative-balance limitation, reconciliation |
| 4 | Refund and cancel payments | Stripe | Continuously updated; no page publication date shown; accessed 2026-08-24 | https://docs.stripe.com/refunds | Lines 10–24 and 69–80: available-balance source, pending/failed paths, duplicate reimbursement risk |
| 5 | Accounting Standards Update 2014-09, Revenue from Contracts with Customers (Topic 606) | Financial Accounting Standards Board | May 2014 | https://asc.fasb.org/layoutComponents/getPdf?fileName=GUID-922C9F73-BD0D-42C8-805D-1105C5CF9692.pdf&isSitesBucket=false | ASC 606-10-45-2, PDF p. 47; ASC 606-10-55-46, PDF p. 64 |
| 6 | Publication 583 (12/2024), Starting a Business and Keeping Records | Internal Revenue Service | Revised December 2024 | https://www.irs.gov/publications/p583 | “Kinds of Records To Keep” and “Business checkbook,” current HTML lines 832–835 and 977–999 |

## Direct evidence

1. **Direct fact — real receipt custody.** Customer charges pass through Stripe's payments balance. Pending funds cannot be withdrawn or spent; available funds can fund payouts, refunds, transfers, or other debits. The payments balance also carries refunds and disputes. [1]
2. **Direct fact — a real separate refund container exists.** Stripe documents `refund_and_dispute_prefunding` as a separate “Future refunds or disputes” balance. It is funded from an external bank transfer, is excluded from automatic payouts, and can be manually paid out. Stripe first uses the available payments balance for a refund or dispute, then this prefunded balance; both can still be exhausted. [2]
3. **Direct fact — a minimum balance is not a purpose-separated reserve.** A configured minimum balance merely prevents automatic payouts from reducing the payments balance below a fixed amount. It is intended for anticipated refunds, disputes, and fees, can be changed or disabled by a Dashboard user, and does not prevent a negative balance when losses exceed the floor. [3]
4. **Direct fact — Stripe's own reserve is not operator-controlled working capital.** Stripe can create a reserve balance and prevents its payout or transfer until the hold ends. That is Stripe's risk control, not the operator's job, tax, or runway account. [1]
5. **Direct fact — refund liquidity must already be available somewhere.** Card refunds use available Stripe balance, not pending funds. When insufficient, the refund remains pending until the balance is replenished; Stripe may also debit a linked bank account where applicable. Refunds can fail later, and a simultaneous dispute can create duplicate reimbursement risk. [4]
6. **Direct fact — customer prepayment and cash location are different accounting dimensions.** Under US GAAP ASC 606, consideration received before the promised service transfers is presented as a contract liability and is derecognized as revenue when the performance obligation is satisfied. The standard does not say that the cash is thereby placed in a separate bank or trust account. [5]
7. **Direct fact — business/personal separation and records are explicit IRS guidance.** IRS Publication 583 says to open a business checking account, keep it separate from personal checking, identify receipt sources and expense types, maintain journals and ledgers, and reconcile the bank statement to the books. It generally allows a record system suited to the business rather than prescribing five bank accounts. [6]

## Counterevidence and negative results

- **Counterevidence to “Stripe is one undifferentiated balance”:** `refund_and_dispute_prefunding` is a real separate balance with different automatic-payout behavior. The standing design must recognize it. [2]
- **Counterevidence to “a Stripe minimum balance guarantees refunds”:** Stripe states that the balance can still go negative and that a refund above available funds can remain pending. [3][4]
- **Negative result:** no reviewed primary source established that a generic one-job US software merchant must maintain distinct bank accounts for tax, job budget, operating cash, and general reserve. This is not proof that no entity-, state-, contract-, or activity-specific requirement applies.
- **Negative result:** the reviewed sources do not establish a universal reserve percentage. Stripe's general four-to-five-times-average-daily-volume suggestion is not evidence for a one-job experiment, and no percentage should be copied into policy without observed refunds, disputes, fees, and professional review. [3]

## Bounded inferences

1. **Bounded inference — smallest external topology.** The minimum design that changes actual custody or failure behavior is: (a) the operator's Stripe payments balance for receipt, (b) a separately operator-prefunded Stripe refunds/disputes balance for the first full-price refund path, and (c) one operator-owned, business-only US checking account for payouts, top-ups, provider-card settlement, and tax payments. Three additional bank accounts do not add proof at this scale if the ledger and policy cannot enforce their restrictions.
2. **Bounded inference — internal accounts are claims, not cash containers.** `customer_contract_liability`, `job_budget_commitment`, `operating_allocation`, `estimated_tax_allocation`, and `general_reserve_allocation` should be separate ledger or commitment accounts. They become physically separated only when a referenced external account or balance is funded and independently reconciled.
3. **Bounded inference — customer money should not be the first job's working capital.** Before verified delivery, provider spend should draw from the operator's pre-existing operating float. This keeps the full customer-price refund executable even while the receipt is pending or obligated.
4. **Bounded inference — accounting and tax books must remain distinct from custody policy.** A GAAP contract-liability treatment, an internal operational restriction, and the operator's federal/state tax recognition can differ. The launch checklist therefore needs a reviewed accounting method and entity-specific tax policy; the software must not infer “not revenue for GAAP” means “not currently taxable.”

## Buildable decision

Use this V0.1 fund topology:

| Label | Real funds or record? | V0.1 location / account | Release rule |
|---|---|---|---|
| Receiving | **Real funds** | Operator's Stripe payments balance: pending then available | Never treated as surplus solely because it is available |
| Refund/dispute prefunding | **Real funds** | Operator-funded Stripe `refund_and_dispute_prefunding` balance | Refund/dispute only; operator review for any manual payout |
| Bank operating cash | **Real funds** | Dedicated operator-owned business checking, never personal spending | Human-approved provider funding, Stripe top-up, taxes, or reconciled withdrawal |
| Customer obligation | **Record / liability** | Internal double-entry contract-liability account | Verified delivery, completed refund, or reviewed dispute resolution |
| Job budget | **Record / commitment** | Internal per-job commitment account | Exact allowlisted cost, unused release, or stop |
| Tax allocation | **Record / policy restriction** | Internal liability/estimate account unless a separate tax bank account is later funded | Human/CPA-reviewed payment or adjustment |
| General reserve / runway | **Record / policy restriction** | Internal allocation unless a separate external savings container is later funded | Independent human policy change after reconciliation |
| Policy-available surplus | **Record / eligibility state** | Derived only; never a displayed external balance | Delivery + cost posting + obligations + external reconciliation complete |

Before accepting the first payment, the operator must confirm the Stripe account exposes the future-refund/dispute balance, fund it from business capital to at least the disclosed maximum customer refund, observe `balance.available`, set a refunds/disputes minimum balance or controlled payout schedule, and record the external bank-to-Stripe transfer. If that product is unavailable on the actual account, the exact blocker is **no independently protected Stripe refund liquidity**; the cheapest fallback is manual/monthly payout plus a payments minimum balance and a separately reconciled business-bank refund reserve, tested before a customer charge.

## State transition and custody map

| Transition | Real-fund holder | Internal posting / control | Allowed actor |
|---|---|---|---|
| Operator prefunds refund path | Stripe holds operator funds in `refund_and_dispute_prefunding` | Dr Stripe refund-prefunding asset; Cr bank cash | Human operator initiates and reviews |
| Customer card succeeds, net pending | Stripe holds pending operator receipt | Dr Stripe clearing; Cr customer contract liability; create job commitment | Stripe webhook reducer; no model write authority |
| Net becomes available | Stripe holds available operator funds | Reclassify pending to available custody; obligation unchanged | Deterministic rail adapter |
| Provider work starts | Provider/card issuer receives operator working capital | Dr job cost/work in process; Cr bank/card/provider payable; reduce job commitment | Agent proposes; policy approves; isolated credential executes |
| Delivery verifies | Stripe/bank custody does not move automatically | Release contract liability under reviewed accounting policy; post actual cost | Independent verifier + accounting policy |
| Refund created | Stripe first debits payments balance, then prefunding if needed | Dr customer liability/refund; Cr Stripe asset; freeze job/surplus | Deterministic rule within cap; otherwise human |
| Refund succeeds or fails | Customer issuer receives funds, or Stripe returns them | Close liability only on resolved evidence; reopen exception on failure | Reconciliation worker; human resolves exception |
| Payout posts to bank | Operator bank holds funds | Move Stripe available asset to bank cash through payout clearing | Stripe executes; reviewer reconciles bank posting |

## Authority matrix

| Action | Agent | Deterministic policy / service | Human operator / independent reviewer |
|---|---|---|---|
| Read redacted balances and propose a job budget | Propose | Validate source, freshness, cap, obligation coverage | Review exceptions |
| Change payout schedule or minimum balance | Denied | Denied in V0.1 | Approve and execute with Dashboard/admin credential |
| Top up or manually pay out refund prefunding | Denied | May alert only | Initiate and reconcile |
| Spend pre-existing operating float | Propose exact provider/job | Approve only allowlisted, double-capped mandate | Pre-approve provider and daily cap |
| Issue an in-policy refund | No direct credential | Create exact idempotent refund under price cap | Review mismatch, expired mandate, dispute overlap, or retry |
| Reclassify tax or general reserve as surplus | Denied | Denied | CPA-informed approval after reconciliation |
| Declare reconciliation closed | Denied | Compute candidate close | Independent reviewer signs close |

The operator/Stripe/bank components hold real funds. The ledger records claims and purposes. The agent only proposes actions and never holds, reclassifies, tops up, pays out, or signs unrestricted movement.

## Testable hypotheses

1. **Testable hypothesis:** an operator-prefunded amount equal to the maximum customer refund remains excluded from automatic payouts and is visible in the Balance snapshot until used or manually released.
2. **Testable hypothesis:** with zero available payments balance and sufficient refund prefunding, a deliberately authorized card refund draws from the prefunded balance and reconciles through the documented balance transactions with zero unexplained difference.
3. **Testable hypothesis:** blocking Dashboard/admin credentials from the worker prevents the agent from disabling the payout floor or manually releasing refund-prefunded funds while still permitting redacted balance reads and an exact Refund API action.

## Unknowns

- Whether `refund_and_dispute_prefunding`, minimum balances, and the required test fixtures are enabled on the operator's actual Stripe account.
- The smallest appropriate dispute-fee and residual-risk buffer for the account's current card pricing and risk profile.
- The operator entity, accounting method, state, sales-tax nexus, income-tax timing, and whether any customer-fund, trust, escrow, or professional-service rule applies.
- Whether a bank product can enforce purpose-based subaccounts or dual approval cheaply enough to improve V0.1 controls.
- The exact ledger presentation of payment fees, refund consideration, and prepayment for this service under the operator's reviewed accounting policy.

## Implications for current site claims

- Material refinement: “separated balances” must distinguish Stripe's real refund/dispute prefunding from a retained minimum and from internal tax/job/runway allocations.
- Material refinement: the refund reserve should be described as operator-prefunded; customer receipt remains a contract obligation and is not itself the working-capital proof.
- No live result changes: the site must continue to show zero paid jobs and must not portray any balance as observed unrestricted surplus.

## Falsification criteria

Reject this V0.1 topology if any of the following occurs:

- the actual Stripe account cannot expose or fund the separate refund/dispute balance and the fallback cannot complete a prompt full refund;
- a worker credential can change payout, top-up, bank, or reserve settings;
- the first refund cannot be linked to the original charge, balance transaction, prefunding source, and customer outcome;
- internal restricted allocations exceed reconciled external funds;
- provider spend consumes customer-obligation cash while the independently available refund path is below the disclosed maximum refund;
- a US legal or accounting reviewer identifies a required external segregation or treatment that the topology does not satisfy.

## Next highest-priority question

For this exact topology, what is the minimum Stripe credential and approval matrix for quote, balance read, refund creation, payout-setting changes, top-up, bank-account changes, emergency stop, key rotation, and independent close—and which controls can be verified in test mode before any live charge?
