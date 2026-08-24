# SELF/FUNDING Research Journal

This is the append-only research record for the SELF/FUNDING project.

Every automated round must add one new timestamped entry. Existing entries must not be rewritten except to correct a broken citation or an objective transcription error; corrections must be recorded in a later entry.

## 2026-08-23 — Foundation audit

### Research question

Which claims in the six-page SELF/FUNDING site are already supported, which are plausible but unproven, and which conflict with current infrastructure or evidence?

### Result

- Supported: bounded, tool-using software agents; cost-aware model routing; programmatic payment and discovery infrastructure; sandboxing, idempotency, reconciliation, and least-privilege patterns.
- Plausible but unproven: positive contribution margin for a narrowly verified software service.
- Unproven: persistent machine demand for paid code services; a self-funding treasury that can subsidize free frontier inference for humans.
- Contradicted or overstated in the current content: x402 as post-verification settlement; a $20 no-subsidy experiment that relies on cloud credits; ten successful jobs as economic or reliability proof; a Postgres journal described as inherently immutable.

### Highest-priority product hypothesis

Improve an existing test suite under a deterministic verifier. Require successful build, repeatable test execution, scoped patching, increased coverage or mutation score, full cost capture, and automatic refund on failure.

### Sources and detailed evidence

See [foundations.md](foundations.md), which records the initial evidence matrix and 36 primary or authoritative sources.

### Website status

No research-driven content rewrite has yet been applied. The current site is the visual and editorial baseline against which future evidence-driven changes will be reviewed.

### Next question

Determine the smallest legally accountable money lifecycle for the first paid job: how payment becomes final, where it is held, who can authorize each category of spending, and how the internal ledger is reconciled to the external rail.

## 2026-08-23 — Research priority reset: follow the money after payment

### Product direction

The primary research program is now the money lifecycle itself. Customer demand remains necessary, but it is not the next question. The project must first make the path from customer payment to custody, reservation, provider spend, refund, surplus allocation, and reconciliation explicit.

### Required distinction

- A displayed balance is not proof of settled funds.
- A ledger entry is not the same thing as money held on an external rail.
- An agent choosing a task is not authorization to move funds.
- Revenue is not available surplus until delivery, refund exposure, provider costs, taxes, and required reserves are accounted for.
- Treasury growth is an outcome to measure, not the financial control system.

### Website status

The Home, Architecture, and Economics pages were reframed around receipt, custody, authority, spending, refund, and reconciliation. The standalone homepage and Visual Review were regenerated. Illustrative capital, allocation rules, and financial control targets are explicitly labeled rather than presented as observed results. Theme persistence and all 28 theme definitions remain intact. Static structure, internal links, script syntax, synchronized standalone output, and responsive overflow safeguards were checked; screenshot-based browser inspection was blocked by the local-file browser security policy and is not claimed as completed in this entry.

### Next question

For a US-based operator running the first $20 experiment, what is the smallest viable custody and spending design across a bank or stablecoin rail, including legal ownership, signing authority, prepayment/refund handling, account segregation, reconciliation, and emergency controls?

## 2026-08-24 — Stripe enables delegated payments, not agent personhood

### Research question

Does Stripe solve the problem that an AI agent has no human or legal identity and therefore cannot receive money in its own name?

### Result

- Direct fact: Stripe's contract, verification, and merchant-of-record structure still requires an identifiable person, business, governmental body, or nonprofit plus a human representative where applicable.
- Direct fact: Stripe can receive, hold, and settle funds owed to that verified User, while software performs authorized API activity on the User's behalf.
- Direct fact: Connect selects whether the platform or connected account is merchant of record; it does not remove the merchant of record.
- Direct fact: ACP and Shared Payment Tokens primarily support buyer agents initiating purchases with bounded credentials while the business remains merchant of record.
- Bounded inference: SELF/FUNDING can operate through a verified human/company operator and give the agent narrow operational permissions, but must not describe the Stripe account or funds as legally owned by the agent.
- Unknown: the best operator entity, Stripe's approval of the exact business, and the production permission model require concrete onboarding, prototyping, and professional review.

### Detailed evidence

See [Stripe agent identity research note](notes/2026-08-24T00-25-34Z-stripe-agent-identity.md).

### Website status

Architecture now explicitly distinguishes the operator and merchant of record from the agent, policy service, Stripe, and customer. The site no longer implies that Stripe grants an agent independent financial identity.

### Next question

With the operator as the sole merchant of record, define the minimum Stripe money state machine across PaymentIntent status, Stripe pending/available balance, payout, refund, dispute, reserve, internal revenue recognition, and unrestricted surplus.

## 2026-08-24 — Two horizons: execute now, specify the missing future

### Product direction

The project must do both of the following without conflating them:

- **Horizon A / NOW:** find and build a path that can complete a real, accountable money loop with institutions available today.
- **Horizon B / FRONTIER:** identify the smallest missing primitives that would allow progressively more agent-native identity, custody, contracting, spending, liability, governance, and recovery.

### Current executable path

The working hypothesis is now concrete: one verified operator is the sole merchant of record; one narrowly verified service accepts one real payment through Stripe; the agent has no legal identity or unrestricted credentials; deterministic policy limits every action; failure exercises a real refund; the internal journal reconciles to Stripe and the operator's payout account.

### Future requirements program

The long-term vision does not depend on pretending current law or payment products already recognize an independent agent. It asks what would have to become true: durable machine-attributable identity, explicit legal wrappers, policy-native custody, machine-readable mandates, reliable liability and insurance, dispute and insolvency procedures, attestable software execution, and governance with human recourse.

Each future requirement must include an evidence threshold and a bridge experiment that can be run under today's operator model.

### Website status

Thesis and Experiment now show the present implementation path and future missing primitives as separate tracks. Existing targets were downgraded where they had no observed basis, and the first experiment now prioritizes payment control and reconciliation before monthly treasury growth.

### Next question

Horizon A: with the operator as sole merchant of record, define and implement the minimum Stripe money state machine from PaymentIntent through refund/dispute/payout and internal unrestricted surplus. After two Horizon A rounds, conduct a Horizon B scan of the requirements for machine-attributable commercial identity.

## 2026-08-24 — Stripe card payments have layered availability, not one final state

### Research question

For a US operator accepting one prepaid Stripe card payment, what minimum state machine should gate job-budget reservation, real provider spend, delivery, refunds/disputes, payout reconciliation, and the label “available surplus”?

### Result

- Direct fact: `PaymentIntent.succeeded` completes the payment flow and permits fulfillment, but the linked BalanceTransaction can still be `pending` and unusable for payout, refund, transfer, or other debit.
- Direct fact: `BalanceTransaction.available` means the net funds are usable on Stripe; it does not remove card refund or dispute exposure. Card disputes are typically possible for 120 days and sometimes longer.
- Direct fact: refunds and payouts can regress after appearing successful: a refund can later fail, and a payout can change from `paid` to `failed` within up to five additional business days.
- Bounded inference / buildable decision: track payment flow, Stripe custody availability, customer obligation, and internal allocation as separate dimensions. Allow an internal job reserve at `succeeded`; allow real provider spend only from an independently confirmed available operating balance. Never create a card state named `final` or `unrestricted_cash`.
- Testable hypothesis: Stripe's official dispute, asynchronous-refund, and available-balance sandbox fixtures plus duplicate/out-of-order webhook tests can validate the reducer before one small live payment and real refund.
- Unknown: actual account reserves/timing, revenue recognition, reserve sizing, and whether external account segregation is required need live evidence and US legal/accounting review.

### Detailed evidence

See [the Stripe money state-machine note](notes/2026-08-24T00-42-22Z-stripe-money-state-machine.md).

### Foundations update

Updated `research/foundations.md` because this round materially refines the standing payment-finality and custody matrix: `succeeded`, Stripe pending, Stripe available, payout, delivery, and policy-available surplus are now explicitly separate states, and no absolute card-finality state is claimed.

### Website status

Architecture and Economics now distinguish capture, Stripe pending/available custody, delivery, residual dispute exposure, and policy-available surplus. No shared component, navigation, theme, motion, or standalone artifact changed.

### Next question

Horizon A: decide the smallest real separation of receiving, operating, refund, tax, and reserve funds across Stripe/bank balances and internal double-entry subaccounts, including which separations are physical versus policy-only.

## 2026-08-24 — An agent can economically fund its API usage, but cannot yet own the mainstream billing account

### Research question

Which non-Stripe collection routes can close the money loop, and can an agent turn its own earned revenue into OpenAI, Claude, OpenRouter, or other API capacity without a human manually buying credits each time?

### Result

- Direct fact: OpenAI, Claude, and OpenRouter support prepaid credits or pay-as-you-go billing with automatic replenishment, but their public flows still charge an operator-owned account/payment method.
- Direct fact: OpenAI exposes organization usage and cost APIs, but its public billing guidance sends additional credit purchases to the Billing portal. Claude similarly assigns credit purchases and auto-reload configuration to Billing/Admin roles.
- Direct fact: OpenRouter exposes a read-only Credits API; its old programmatic Coinbase credit-purchase endpoint has been removed and returns `410 Gone` in favor of a web flow.
- Direct fact: Stripe Projects can let an agent provision an OpenRouter pay-as-you-go resource with scoped credentials and provider spend caps. Provider costs are charged to a payment method on the operator's Stripe account, not proven to net directly from Stripe sales balance.
- Direct fact: Square can receive customer payments into a verified seller account and, for eligible US owners, make sales available through Square Checking/debit. This is a short operator-owned receipt-to-card path, but provider card acceptance needs a live test.
- Direct fact: x402 lets a seller wallet receive USDC and a buyer wallet pay HTTP resources programmatically. Coinbase Agentic Wallet MCP lets the agent pay within user-set limits, but only the user may onramp, transfer arbitrary funds, or change limits.
- Bounded inference: a legally operator-owned agent can be economically self-funding today through auto-recharge or capped pay-as-you-go. Literal independent agent ownership of the merchant, bank, wallet onramp, or provider account is not established.
- Testable hypothesis: the first closed loop can be demonstrated either with `delivered revenue → operator payment method → capped OpenRouter/API usage` or, more natively, `x402 USDC receipt → same-wallet x402 spend`.

### Detailed evidence

See [collection rails and API self-funding](notes/2026-08-24T00-59-44Z-collection-rails-and-api-self-funding.md).

### Foundations update

Updated `research/foundations.md` because this round materially changes the implementation path: provider auto-reload, Stripe Projects, Square receipt-to-debit, MoR settlement, and x402 earn-to-spend are now distinguished as separate fuel loops with different identity, timing, and custody properties.

### Website status

Economics now compares collection routes and documents the three viable API fuel paths. The public Research Journal adds this round, a cited fuel-loop graphic, provider limitations, counterevidence, unknowns, and the next experiment. Responsive inspection also exposed and fixed a mobile document-grid constraint that let 660px tables force the surrounding article and cards beyond the viewport; tables now scroll inside their own wrappers while the article and cards stay within the screen. Theme navigation behavior is unchanged, and all standalone previews were resynchronized with the shared stylesheet.

### Next question

Horizon A: verify Stripe Projects' actual OpenRouter billing object, charge timing, failure states, and lowest-risk live test; compare it with a Square receipt-to-debit auto-reload path. Horizon B: audit whether x402 currently offers the model, sandbox, storage, and deployment services needed for a complete agent stack.

## 2026-08-24 — Stripe Projects delegates a provider payment credential; reconciliation remains unproven

### Research question

Stripe Projects 为 OpenRouter pay-as-you-go 实际建立了什么付款对象；当前公开证据是否足以把一笔 OpenRouter job cost 对账到 operator 的真实外部付款？

### Result

- Direct fact: paid Stripe Projects tiers tokenize the operator's stored payment credential into a Shared Payment Token; OpenRouter, as provider/seller, uses the granted token to create its own PaymentIntent. The token is a scoped credential, not funds or a balance.
- Direct fact: Stripe Projects documents provider-level current/previous-month spend and global/per-provider caps. It does not document generation IDs, SPT IDs, provider PaymentIntent or receipt IDs, charge cadence, retry state, or refund linkage in the Projects spend surface.
- Direct fact: OpenRouter can report generation-level cost and Activity/Analytics usage by API key, and a lower per-key guardrail can reject over-budget calls with HTTP 403.
- Unknown/conflicting: OpenRouter's general billing path deducts usage from credits, while the Projects integration is called pay-as-you-go and grants an SPT at upgrade. Current public documentation does not establish whether Projects charges per generation, buys or auto-reloads credits, aggregates charges, or exposes the resulting payment objects to the operator.
- Bounded inference / buildable decision: keep Stripe Projects for provisioning, scoped credentials, and an outer provider cap, but mark the paid fuel loop `RECONCILIATION_BLOCKED`. Projects spend is an aggregate cross-check, not the job ledger or proof of settled provider cash cost.
- Testable hypothesis: one deliberately capped live generation can be matched across generation usage, OpenRouter billing, Projects spend, SPT/payment evidence, and the operator's posted bank/card transaction with zero unexplained difference.

### Detailed evidence

See [Stripe Projects + OpenRouter billing object and reconciliation](notes/2026-08-24T01-44-21Z-stripe-projects-openrouter-reconciliation.md).

### Foundations update

Updated `research/foundations.md` because this round materially refines the standing provider-payment model: Stripe Projects uses a provider-side SPT/PaymentIntent path, and provisioning is now explicitly separated from proven job-to-cash reconciliation.

### Website status

Economics now distinguishes buildable provisioning from the blocked cash-reconciliation claim. The public Research Journal records the SPT authority boundary, counterevidence, exact unknowns, and the capped live-test gate. No shared navigation, theme, CSS, JavaScript, motion, or standalone artifact changed.

### Next question

Horizon A deliberate live replication: with operator approval, isolated test capital, a Projects per-provider cap, and a lower OpenRouter key limit, can one paid generation reconcile its generation ID, provider usage/billing, Projects spend, SPT/payment evidence, and bank/card posting to zero unexplained difference within a preregistered window?

## 2026-08-24 — Separate refund liquidity is real; most other “buckets” are ledger restrictions

### Research question

For the first US Stripe card job, which receiving, operating, refund, tax, and reserve separations can and should be real external fund containers, and which are only internal ledger restrictions?

### Result

- Direct fact: Stripe's payments balance receives customer charges; pending funds cannot be spent, while available funds can fund payouts, refunds, transfers, and other debits.
- Direct fact: Stripe documents `refund_and_dispute_prefunding` as a separate, operator-funded balance excluded from automatic payouts. Refunds and disputes use the available payments balance first and this prefunding second; both can still be exhausted.
- Direct fact: a Stripe minimum balance is only a retained payout floor. It can be changed or disabled and does not prevent negative balances above the floor. Stripe-created reserves are Stripe risk holds, not operator tax, job, or runway accounts.
- Direct fact: ASC 606 presents customer prepayment as a contract liability before delivery, but that classification does not itself move cash into a separate account. IRS Publication 583 advises a business-only checking account, journals/ledgers, and reconciliation rather than prescribing five purpose accounts.
- Bounded inference / buildable decision: V0.1 needs three external locations—a Stripe payments balance, an operator-prefunded Stripe refund/dispute balance, and one operator-owned business checking account. Customer obligation, job budget, tax allocation, general reserve, and policy-available surplus remain explicit internal accounts unless a separately funded external container is opened and reconciled.
- Unknown: actual Stripe-account feature access, buffer size, entity/state/tax treatment, and any activity-specific segregation duty require account evidence and US legal/accounting review.

### Detailed evidence

See [Stripe balance separation for the first paid job](notes/2026-08-24T02-12-52Z-stripe-balance-separation.md).

### Foundations update

Updated `research/foundations.md` because this round materially refines the standing custody matrix: Stripe refund/dispute prefunding is a real separate balance; a minimum balance and internal purpose accounts are not equivalent forms of segregation.

### Website status

Architecture and Economics now distinguish real custody containers, Stripe's retained payout floor, and internal policy restrictions. The public Research Journal records the decision, counterevidence, jurisdiction limits, and next authority question. No shared navigation, theme, CSS, JavaScript, motion, or standalone artifact changed.

### Next question

For this topology, define the minimum Stripe credential and approval matrix for balance read, refund, payout settings, top-up, bank-account changes, emergency stop, rotation, and independent close, and identify which controls can be verified before a live charge.

## 2026-08-24 — Stripe runtime authority splits into read, refund, and human-only change planes

### Research question

For V0.1's US Stripe card-payment topology, what is the minimum credential and approval matrix for balance reads, refunds, payout settings, top-ups, bank-account changes, emergency stop, rotation, and independent close—and which controls can be verified before a live charge?

### Result

- Direct fact: Stripe restricted API keys can be set per resource to `Read`, `Write`, or `None`; Stripe recommends them over unrestricted keys, especially for AI agents, and documents a sandbox/request-log workflow for deriving least privilege.
- Direct fact: Stripe's human roles do not supply the desired separation by default. Analyst combines refund and payout, Developer can access an almost-all-API secret key, and Administrator combines refund, payout, key, own-bank, and payout-schedule changes. Refund Analyst and View Only are materially narrower; Top-up Specialist is isolated to top-ups plus balance/payout views.
- Direct fact: key expiry stops further API calls; rotation supports a migration grace period and request-log checks. Stripe team security supports enforced 2FA and exportable security history.
- Counterevidence / negative result: the documented Connect Risk Analyst pause applies to connected accounts, not the standard operator account assumed by V0.1. The reviewed primary sources did not establish a Stripe-wide one-click stop or native two-person pre-execution approval for the operator's refunds, payouts, bank changes, or key rotation.
- Bounded inference / buildable decision: runtime receives only `stripe-reconcile-rk`, an isolated `stripe-refund-rk`, and an endpoint-specific webhook verification secret. Top-up, payout settings, own-bank changes, team/key management, and rotation remain human-only; an uncombined View Only role performs independent close.
- Exact gate: before a live charge, prove all positive and negative RAK permissions, refund idempotency and mismatch rejection, webhook signature/duplicate/secret-roll behavior, test-key expiry, local emergency stop, role boundaries, security-history capture, and a zero-difference sandbox close.
- Unknown: live feature eligibility, exact account permission labels, real prefunding/bank verification, payout limits, native enterprise approval controls, and recovery/support behavior require account evidence. These are product design constraints for a US operator, not legal, accounting, tax, security, or financial advice.

### Detailed evidence

See [Stripe credential and approval matrix for V0.1](notes/2026-08-24T02-44-43Z-stripe-credential-approval-matrix.md).

### Foundations update

Updated `research/foundations.md` because this round materially refines the standing authority and recovery model: it replaces the abstract three-power claim with concrete Stripe RAKs, human roles, negative permission tests, and a compositional emergency stop.

### Website status

Architecture now names the actual Stripe runtime and human-only change planes. The public Research Journal records this round, sources, counterevidence, unknowns, and the next reconciliation question. No shared navigation, theme, CSS, JavaScript, motion, or standalone artifact changed.

### Next question

What is the minimum external reconciliation schema and daily-close procedure that can match Stripe payment, balance-transaction, refund, dispute, and payout objects to the internal double-entry journal, provider bills, and the operator's bank posting—and which exact mismatches must freeze new work or discretionary spending?

## 2026-08-24 — Machine identity exists; institution-recognized economic identity does not

### Research question

Is the ideal state an agent with its own independent identity and bank card, and what exactly separates today's operator-owned system from a persistent agent that can receive, save, spend, recover, and bear responsibility?

### Result

- Direct fact: machine identity primitives are real. W3C DID permits non-human subjects and autonomous-software controllers; Verifiable Credentials provide tamper-evident issuer-holder-verifier claims. These establish identifier/key control and credential exchange, not legal personhood or institutional acceptance.
- Direct fact: AP2 v0.2 supports autonomous, Agent-Key-signed closed mandates, but trust still descends from a user-signed open mandate or Agent Provider trust list. Its Trusted Surface must remain non-agentic, deterministic verification is required, and commerce APIs, agent-to-agent delegation, and parts of dispute retrieval remain outside the current scope.
- Direct fact: current US electronic-agent law preserves a transaction when the agent's action is legally attributable to the person bound. FinCEN CDD still requires a legal-entity customer's natural-person beneficial owners and at least one natural-person control prong. Stripe likewise binds service and linked bank-account responsibility to an identifiable User that is the named account holder.
- Direct fact: financial and provider products expose bounded execution, not independent entry. Coinbase's Agentic Wallet lets an agent pay x402 services but reserves onramp, arbitrary transfer, and limit changes to the user. OpenAI exposes service accounts, cost/usage reads, alerts, spend limits, and Billing-UI auto-recharge, while the current public reference still does not list a general credit-purchase operation.
- Bounded inference: the safest near-term target is not a free-spending card. It is persistent agent identity plus an operator-owned legal wrapper, dedicated subledger/accounts, revocable mandates, action-specific credentials, deterministic policy, isolated signers, recovery quorum, and independent close.
- Project status: SELF/FUNDING has an evidence-backed control architecture but has not completed one real `payment → delivery/refund → full-cost close → API fuel → next accepted output` loop. This—not model intelligence—is the largest project-specific gap.

### Detailed evidence

See [agent-native identity, account, and responsibility gap map](notes/2026-08-24T02-52-25Z-agent-native-identity-gap-map.md).

### Foundations update

Updated `research/foundations.md` to separate six layers that had been conflated: persistent machine identity, delegated transaction authority, legal attribution, financial account ownership, policy-bounded custody, and observed economic closure. Each frontier claim now has an evidence threshold and a bridge experiment.

### Website status

The public Research Journal adds a six-layer gap graphic and this cited round. It now shows which primitives already exist, which require institution adoption or legal change, and which depend only on SELF/FUNDING completing its own controlled experiments. No theme, navigation, motion, or standalone artifact changed.

### Next question

Horizon A: finish the external reconciliation schema and daily close, then seek explicit operator approval for one minimum-value real economic loop. Horizon B: implement an `agent_identity + root_mandate + credential_lineage + revocation + recovery_quorum` prototype and prove identity continuity plus bounded autonomous authorization in a no-money or testnet AP2-style experiment.

## 2026-08-24 — Stripe close needs two passes and three explicit freeze lanes

### Research question

For V0.1's first US Stripe card job, what minimum external reconciliation schema and two-pass daily-close procedure can match Stripe payment, balance-transaction, refund, dispute, and payout movements, internal double entry, OpenRouter provider cost, and the operator's bank posting—and which exact mismatches freeze new work, discretionary spend, or all mutations?

### Result

- Direct fact: Stripe's Balance Transaction object is the external cash-movement anchor across gross, fee, net, availability, balance type, reporting category, and source. Refund, dispute, payout, and payout-failure objects expose separate movement or reversal links that must be preserved.
- Direct fact: Stripe says webhook delivery can be unordered, retried, and duplicated. Canonical API objects and itemized reports—not Event arrival order—must drive external close.
- Direct fact: standard automatic payouts support transaction-membership reconciliation; manual payouts do not inherit that mapping. Stripe's complete daily report data is normally available the following day, so an evidence-complete close cannot be guaranteed in real time or unconditionally under 24 hours.
- Counterevidence / negative result: OpenRouter generation usage establishes accrued cost in credits but not cash settlement; no reviewed primary source established that every bank feed exposes a Stripe payout ID. Bank trace/reference support must be observed, with exact-match and independent-review fallback.
- Bounded inference / buildable decision: run a `PROVISIONAL` canonical-API pass after interval end, then an `EVIDENCE_COMPLETE` itemized-report, automatic-payout, bank, and provider-document pass. Only an independent reviewer can mark `REVIEWED_CLOSED`; provisional evidence never releases surplus.
- Exact controls: normal timing exposure freezes affected surplus; any unmatched cent, stale report beyond the 36-hour experiment target, unexpected fee/adjustment, missing bank payout, provider-cost mismatch, or unsupported payout freezes new work and discretionary spend; unbalanced/duplicate booking, unexpected payout destination, unexplained negative external balance, or credential/evidence compromise stops all runtime mutations.
- Unknown: actual Stripe report access/latency, bank export identifiers, trace support, account cutoff/timezone, and OpenRouter billing linkage require sandbox and live-account evidence. Accounting, tax, reserve, consumer, and record-retention conclusions require US professional review. These are product-design constraints, not legal, accounting, tax, security, or financial advice.

### Detailed evidence

See [Stripe two-pass daily close for V0.1](notes/2026-08-24T03-14-27Z-stripe-two-pass-daily-close.md).

### Foundations update

Updated `research/foundations.md` because this round materially replaces the standing “daily reconciliation under 24 hours” shorthand with a source-backed two-pass close, minimum external schema, standard-automatic-payout decision, provider cash boundary, and tiered exception controls.

### Website status

Architecture, Economics, MVP, and Build now distinguish provisional freshness from evidence-complete close, show the 36-hour stale-evidence target as a target rather than an observed rail promise, name the exact freeze tiers, and include the minimum reconciliation records. The public Research Journal records this round and its primary sources. No shared navigation, theme, CSS, JavaScript, motion, or standalone artifact changed.

### Next question

Can a sandbox implementation of this schema ingest a preregistered fixture set—successful charge, duplicate/reordered webhook, Stripe fee, refund success/failure, dispute withdrawal/reinstatement, automatic payout/failure, manual-payout rejection, provider-cost mismatch, and unexpected destination—and produce the exact close state and freeze tier with zero duplicate or unbalanced entries?

## 2026-08-24 — Sandbox can prove reducer controls, not external settlement

### Research question

Which preregistered V0.1 daily-close fixtures can Stripe's current sandbox generate as canonical Stripe objects, which require deterministic transport or policy injection, and which facts remain impossible to prove without a minimum live-money test?

### Result

- Direct fact: Stripe sandboxes create simulated payment, charge, refund, balance, dispute, payout, and report objects without processing card networks, payment providers, banks, or real money.
- Direct fact: documented sandbox paths cover successful charges and fees, pending/available balance branches, asynchronous refund success/failure, dispute debit and reinstatement/loss, payout success/failure destinations, report parsing, and webhook resend. Stripe explicitly documents unordered and duplicate delivery.
- Counterevidence / negative result: the bypass-pending fixture cannot test live settlement timing; a test payout cannot prove a posted bank line or trace; no reviewed source established a deterministic on-demand path through a one-off card charge's real automatic-payout schedule; sandbox report latency cannot validate the 36-hour live target.
- Bounded inference / buildable decision: preregister four evidence classes—`RAIL_SANDBOX`, `TRANSPORT_INJECTION`, `POLICY_INJECTION`, and `LIVE_EVIDENCE`. Only the live class may reach `REVIEWED_CLOSED_LIVE`; sandbox and synthetic zero-difference results prove the reducer's control plane only.
- Exact experiment rule: the fixture manifest records source, API version, hashes, expected ledger entries, close state, freeze tier, and what each fixture cannot prove. A manual payout may test rejection but cannot substitute for standard automatic-payout membership.
- Unknown: actual sandbox report access, automatic-payout capability and timing, trace fields, live settlement/report latency, refund-prefunding access, bank identifiers, and provider cash linkage still require account evidence.

### Detailed evidence

See [Stripe sandbox fixture boundary for the V0.1 close reducer](notes/2026-08-24T03-42-16Z-stripe-sandbox-fixture-boundary.md).

### Foundations update

Updated `research/foundations.md` because this round materially splits the standing pre-live test plan into rail-sandbox, transport-injection, policy-injection, and live-evidence classes and forbids a sandbox result from being promoted to an external close.

### Website status

Experiment and Build now distinguish `CONTROL_PLANE_PASSED` from `REVIEWED_CLOSED_LIVE` and reserve custody, bank posting, settlement timing, and trace proof for the live round. The public Research Journal records the evidence boundary, counterevidence, unknowns, and next executable test. No shared navigation, theme, CSS, JavaScript, motion, graphics, or standalone artifact changed.

### Next question

Can the first versioned fixture runner execute the source-backed `RAIL_SANDBOX`, `TRANSPORT_INJECTION`, and `POLICY_INJECTION` manifest—including an explicit automatic-payout capability probe—and produce the preregistered close state, freeze tier, and balanced entries for every case with zero silent evidence-class upgrades?

## 2026-08-24 — Local fixture controls pass; rail evidence remains blocked

### Research question

Can the first versioned fixture runner execute all three pre-live evidence classes, including an automatic-payout capability probe, without silently upgrading evidence?

### Result

- Direct fact: Stripe requests, CLI calls, and webhook endpoints can pin an API version, but existing Event snapshots keep the version and data structure used when they were created.
- Direct fact: Stripe documents duplicate and unordered delivery; duplicate control needs both Event ID and underlying object ID + event type. Stripe idempotency records can be pruned after at least 24 hours, so permanent internal booking uniqueness remains necessary.
- Direct measured result: the no-dependency V0.1 prototype executed four preregistered fixtures. Three local transport/policy fixtures passed, and all three adversarial evidence guards rejected a live-close upgrade, payload-hash mutation, or idempotency-key conflict.
- Exact blocker / negative result: the automatic-payout `RAIL_SANDBOX` probe returned `RAIL_SANDBOX_CAPTURE_REQUIRED`. No Stripe CLI, credential, account capture, or Stripe-created object was available, so the complete pre-live suite remains `false` and NOW 0 is not passed.
- Counterevidence: Stripe's first-party `stripe-mock` is stateless, hardcoded, latest-version-only, and explicitly non-behavioral. It can check shape but cannot be relabeled as rail evidence.
- Bounded inference / decision: preserve the prototype and exact blocker. The next cheapest test is one operator-owned, version-pinned sandbox charge captured with Event, Charge, linked Balance Transaction, raw hashes, and idempotency metadata, replayed twice with exactly one booking.

### Detailed evidence and prototype

See [the fixture-runner measured-boundary note](notes/2026-08-24T04-42-09Z-fixture-runner-measured-boundary.md) and [the executable V0.1 prototype](experiments/fixture-runner-v0.1/README.md).

### Foundations update

No update. This round measures a prototype against the existing evidence classes; it does not change the standing evidence model.

### Website status

The public Research Journal records the exact 3-pass / 1-blocked result, counterevidence, sources, and next test. No other site claim, graphic, shared component, theme, motion, or standalone artifact changed.

### Next question

Can one operator-owned Stripe sandbox charge at pinned API version `2026-07-29.dahlia` be captured with its Event, Charge, linked Balance Transaction, raw hashes, and idempotency metadata, then replayed through the runner twice with exactly one balanced external booking and no evidence-class upgrade?
