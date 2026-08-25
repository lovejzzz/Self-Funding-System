# Research protocol

## Primary research program: the money lifecycle

The project's first-order question is not merely whether software can produce revenue. It is whether money can move through a complete, accountable lifecycle after a customer pays:

1. **Delivery** — what constitutes final, irreversible receipt on the chosen payment rail, and what remains refundable or disputed?
2. **Custody** — which legal operator and account or wallet holds the funds, how keys and credentials are isolated, and which balances are restricted versus available?
3. **Authorization** — which actions an agent may propose, which deterministic policies may approve, and which payments require an independent human decision?
4. **Spending** — how compute, tools, refunds, taxes, reserves, and public-access subsidies receive budgets and hard loss limits?
5. **Accounting and reconciliation** — how external rail balances, an append-only internal ledger, invoices, provider bills, and refunds are matched?
6. **Recovery** — what happens after a failed payout, duplicated event, compromised credential, unavailable rail, chargeback, or accounting discrepancy?

Until these questions are supported by research and a tested design, revenue growth, treasury allocation percentages, and self-funding runway remain downstream hypotheses.

## Broader research program: future action capacity

Money remains the first accountable bridge because customer obligations, refunds, taxes, provider invoices, and legal settlement still require monetary records. It is no longer the frontier definition of agent wealth.

The broader program asks whether verified contribution can earn a typed portfolio of future action rights: compute, storage, data queries, licenses, scoped permissions, reciprocal priority, and counterparty commitments. Research must keep each resource in its native unit, name its issuer and holder, record scope, expiry, revocation, transferability, redemption evidence, and dispute path, and default cash equivalence to `null`.

Do not describe cloud credits as cash, credentials as authority, reputation as transferable property, or simulated commitments as live capacity. The standing architecture uses two linked records: a reconciled money ledger for cash and obligations, and a resource-rights ledger for issuer-bound non-cash capacity. See [the resource-rights research note](notes/2026-08-25T03-11-02Z-nonmonetary-resource-rights-economy.md).

## Two horizons, one program

Research must maintain two explicit queues without allowing either to replace the other.

### Horizon A — make it work now

Find the smallest path that can operate under institutions and products that exist today. The current reference path is a verified operator acting as the sole merchant of record, a narrow machine-verifiable service, one payment rail, bounded agent permissions, a working refund, full-cost accounting, and reconciliation to the external rail.

Every Horizon A round must end with one of: a buildable decision; a concrete experiment; a measured result; or an exact blocker with the next cheapest test. “More research is needed” is not a sufficient output by itself.

### Horizon B — identify what would make the full vision possible

Work backward from a genuinely agent-native economic system. Investigate the missing primitives for durable identity and attribution, policy-native custody, delegated contracting, taxation, insurance and liability, dispute resolution, insolvency, security attestation, governance, and recovery.

Every Horizon B round must state:

1. what is impossible or unsafe today;
2. which missing legal, institutional, technical, or market primitive would change that;
3. what observable evidence would prove the primitive exists;
4. which bridge experiment can be run now without pretending the future condition already exists.

Maintain a bias toward execution: at least two Horizon A questions should be advanced for each Horizon B scan unless a newly discovered blocker makes a future primitive immediately decisive.

The journal is evidence-first and append-only. Each round addresses one bounded question and distinguishes:

1. Direct fact supported by a source.
2. Bounded inference with an explicit reasoning chain.
3. Testable project hypothesis.
4. Unknown or conflicting evidence.

Source order: standards and government material; peer-reviewed research and reproducible preprints; official protocol and product documentation; first-party market data; secondary analysis only as a lead.

Website content must distinguish `SUPPORTED`, `HYPOTHESIS`, `TARGET`, `ILLUSTRATIVE`, and `LIVE RESULT`. A research round may update the site only when the new evidence materially changes a claim, source, experiment design, risk boundary, or measured result.

`journal.html` is the public scholarly view of this research record and is the exception to the material-change rule: every completed research round must add its UTC time, question, evidence classification, concise result, citations, unknowns, and next question to that page. Update its evidence graphics when the standing model changes; never use graphics to imply measurements that were not observed.

Research must not invent citations, treat marketing claims as independent evidence, silently replace an existing conclusion, or turn a protocol's availability into proof of customer demand.
