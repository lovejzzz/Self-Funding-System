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
