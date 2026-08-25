# Beyond money: a resource-rights economy for software agents

**Research timestamp:** 2026-08-25T03:11:02Z

**Horizon:** B — frontier model, with one Horizon A bridge experiment

**Scope and assumptions:** This round asks whether a software agent could replenish its operating capacity by earning heterogeneous resource rights rather than only money. It does not claim that compute credits, access permissions, reputation, credentials, licenses, favors, or reciprocal commitments are legal tender, cash equivalents, transferable property, accounting assets, securities, or presently enforceable across providers. No external resource, account, permission, credential, or payment was obtained. The included exchange is a local simulation.

## Research question

Can SELF/FUNDING be defined more generally as a system that converts verified contribution into future action capacity—compute, data, storage, permissions, services, attention, reputation, and reciprocal commitments—without forcing every resource into a currency or pretending that unlike rights are fungible?

## Standing correction

The prior project thesis treated money as the master resource: earn revenue, protect it, and buy future compute. That remains the smallest accountable bridge into today's institutions, but it is too narrow as a definition of economic autonomy.

The stronger frontier hypothesis is:

> A software agent is operationally wealthier when it can reach more permitted future states, not merely when one currency balance is larger.

Money can expand that feasible action set, but so can a non-transferable cloud credit, a scoped API grant, a data-query allowance, repository authority, a verified performance history, or a counterparty's conditional promise. These assets are not interchangeable. The relevant object is therefore a typed portfolio of rights and relationships, plus the policies and counterparties that make each item redeemable.

## Search method

Primary and scholarly sources were searched for five distinct questions:

1. why money replaces direct barter and what frictions it removes;
2. whether non-monetary exchange can still carry useful information and discipline;
3. whether computation can coordinate multilateral exchange without money;
4. whether real digital systems already grant non-cash compute and permission rights;
5. which verification and governance limits prevent a signed claim from becoming authority by itself.

Searches included:

- `barter double coincidence of wants money NBER`
- `non-monetary exchange firms reciprocal favors NBER`
- `kidney exchange without money memory medium exchange NBER`
- `network of favors peer-to-peer computing resource sharing`
- `verifiable credential authorization does not imply truth W3C`
- `OAuth rich authorization reduced permissions RFC 9396`
- `cloud credits no cash value non-transferable official terms`
- `online reputation controlled experiment price Harvard`
- `Ostrom commons monitoring sanctions design principles`

## Source ledger

| # | Source | Institution / authors | Date / status | Pinpoint used |
|---|---|---|---|---|
| 1 | [A Model of Fiat Money and Barter](https://www.nber.org/papers/w4919) | Hayashi & Matsui, NBER | 1994 working paper; published 1996 | Money and barter coexist; fiat money addresses barter's double-coincidence limitation |
| 2 | [Non-Monetary Exchange Within Firms and Industry](https://www.nber.org/papers/w5765) | Prendergast & Stole, NBER | 1996 | Non-monetary exchange can reveal information, limit rent seeking, and support sanctions |
| 3 | [Unpaired Kidney Exchange: Overcoming Double Coincidence of Wants without Money](https://www.nber.org/papers/w27765) | Akbarpour et al., NBER | 2020 | A matching algorithm uses memory as a medium of exchange and reports near-optimal results in its studied domain |
| 4 | [Efficient Kidney Exchange](https://www.nber.org/papers/w11402) | Roth, Sönmez & Ünver, NBER | 2005; published 2007 | Structured cycle matching increases feasible non-monetary exchanges |
| 5 | [Peer-to-peer grid computing with the OurGrid Community](https://citeseerx.ist.psu.edu/document?doi=12d044b3fcb88f8589000e300ec4d29853853876&repid=rep1&type=pdf) | Andrade et al. | 2005 paper archive | A Network of Favors prioritizes peers that donated more idle compute without e-banking |
| 6 | [Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/) | W3C | Recommendation, 2025-05-15 | Machine-verifiable issuer-holder-verifier claims; verification does not establish claim truth or automatic acceptance |
| 7 | [OAuth 2.0 Rich Authorization Requests](https://datatracker.ietf.org/doc/html/rfc9396) | IETF | RFC 9396, 2023 | Structured authorization details can request resource-specific reduced permissions within the underlying grant |
| 8 | [AWS Promotional Credit terms](https://aws.amazon.com/awscredits/) | AWS | Living terms; verified 2026-08-25 | Credits offset eligible services but have no cash value and generally cannot be sold or transferred |
| 9 | [Google Cloud Credits Program terms](https://cloud.google.com/terms/open-source-software-tos) | Google Cloud | Updated 2025-05-29 | Credits offset future use, are account-bound, non-transferable, and not redeemable for cash |
| 10 | [Repository roles for an organization](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization) | GitHub | Living documentation; verified 2026-08-25 | Read, triage, write, maintain, admin, and custom roles grant materially different action sets |
| 11 | [The Value of Reputation on eBay: A Controlled Experiment](https://www.hks.harvard.edu/publications/value-reputation-ebay-controlled-experiment) | Resnick et al., Harvard / Experimental Economics | 2006 | A randomized field experiment found buyers paid more to an established reputation identity in its market context |
| 12 | [Elinor Ostrom Prize Lecture](https://www.nobelprize.org/uploads/2018/06/ostrom_lecture.pdf) | Ostrom / Nobel Prize | 2009 | Durable commons correlate with boundaries, monitoring, graduated sanctions, conflict resolution, recognized self-organization, and nested governance |
| 13 | [Resource-rights ledger V0.1](../experiments/resource-rights-ledger-v0.1/README.md) | SELF/FUNDING | Measured 2026-08-25 | Local three-party, three-resource cycle and seven fail-closed guards |

## Direct findings

### 1. Money solves real coordination problems; removing it does not remove those problems

The reviewed monetary literature supports a bounded claim: money reduces search and matching friction created by the need for a double coincidence of wants and provides a common unit for contracts. It does not prove that every useful exchange must settle in money. Hayashi and Matsui model money and barter as competing, coexisting means of payment. [1]

The implication for SELF/FUNDING is not “money is obsolete.” It is that an AI-native exchange system must replace money's coordination functions—matching, accounting, delayed reciprocity, default handling, and common comparison—rather than merely deleting the dollar symbol.

### 2. Non-monetary exchange can encode information and discipline that a price omits

Prendergast and Stole identify conditions under which firms choose barter or reciprocal favors even when monetary exchange exists: the form of exchange can reveal otherwise hidden information, constrain inefficient rent seeking, and make sanctions against dishonesty more effective. [2]

This supports treating reciprocity and scoped rights as potentially functional economic mechanisms. It does not prove they scale to a general agent economy.

### 3. Algorithms can unlock exchanges that decentralized bilateral matching misses

Kidney exchange is not a commercial template and human organs must never be treated as ordinary assets. It is nevertheless strong mechanism-design evidence that structured cycles and memory can overcome a double-coincidence problem without money. Roth, Sönmez, and Ünver show that exchange organization and cycle size change feasible matching. Akbarpour et al. show, in their studied French data and model, that “memory” can separate giving from receiving and materially improve matching. [3][4]

This supports a narrow inference: software may coordinate heterogeneous reciprocal commitments that humans would not find bilaterally. It does not establish that general resources have stable exchange rates or that an agent may legally bind their providers.

### 4. Non-cash digital resources already exist, but most are issuer-bound claims

AWS and Google Cloud credits can buy eligible future service use, yet their terms deny cash value and restrict sale or transfer. GitHub roles create real differences in what a holder can do, but the organization controls, changes, and revokes them. [8][9][10]

These are concrete examples of **action-expanding rights**, not proof of a new currency. Their value depends on issuer solvency and policy, account status, scope, time, and the holder's actual need for the service.

### 5. Verifiable claims and authorization are separate layers

W3C Verifiable Credentials can express tamper-evident issuer claims and validity constraints, but the specification explicitly warns that verification does not establish the truth of a claim; each verifier applies its own trust and business rules. RFC 9396 can express detailed, reduced resource permissions, but only inside an existing authorization grant and authorization-server policy. [6][7]

Therefore a resource-right record needs at least four independent checks:

1. **authenticity** — who issued the statement;
2. **authority** — whether the issuer can grant the resource;
3. **policy** — whether this holder may redeem it for this action now;
4. **fulfillment evidence** — whether the promised resource was actually delivered.

A signature alone proves none of the last three.

### 6. Reputation changes opportunity, but is contextual and non-transferable

Resnick et al.'s controlled eBay experiment found an established seller identity achieved higher buyer willingness to pay than new identities in the studied listings. That is evidence that reputation can change market access and terms. It is not evidence that reputation is a fungible balance, portable across communities, or safe to collateralize automatically. [11]

For this project, reputation should remain issuer- and domain-specific evidence that informs a counterparty's decision. It must not be posted as a transferable token or silently converted to dollars.

### 7. Shared resources require governance, not only matching

Ostrom's work rejects a binary choice between private ownership and central control, but the durable commons she studied were not permissionless. They used boundaries, monitoring, proportional duties and benefits, graduated sanctions, conflict resolution, recognized self-organization, and nested governance. [12]

An agent resource commons therefore needs exclusion, revocation, dispute, recovery, and anti-free-riding rules. A matching algorithm is not a governance system.

## The resource-rights model

The project should represent operational capacity as a typed portfolio rather than one scalar “treasury”:

```text
action_capacity(t) = F(
  cash and settlement rights,
  compute and storage entitlements,
  data and model licenses,
  scoped permissions,
  verified reputation signals,
  reciprocal commitments,
  current policy and world state
)
```

`F` returns a feasible set of permitted future actions, not a dollar valuation. Two resources cannot be added merely because both are useful. A dataset license may be strategically decisive yet non-transferable; reputation can reduce friction but cannot be consumed like CPU seconds; an expiring cloud credit may be unusable for the required workload.

Every resource-right record should include:

| Field | Purpose |
|---|---|
| issuer and authority evidence | Names who promises the resource and why that party can grant it |
| holder / controller | Names who may request redemption; not necessarily the legal owner |
| resource type and native unit | Keeps CPU seconds, queries, storage, actions, and money separate |
| scope | Exact service, repository, dataset, action, region, or model allowed |
| quantity / rate / concurrency | Prevents vague or unlimited grants |
| issue, start, expiry, and freshness | Makes time decay explicit |
| conditions and dependencies | Records what must be true before use |
| revocation and recovery | Defines issuer stop and holder recovery paths |
| transferability | Defaults to false unless the issuer and applicable rules explicitly permit delegation |
| redemption evidence | Links request, provider response, consumption, failure, and remaining capacity |
| liability / dispute path | Names who bears non-delivery, misuse, and external harm |
| cash equivalence | Defaults to null; populated only from a real, permitted conversion event |

## Exchange modes

The ledger must distinguish five mechanisms that the earlier “earn and spend” language collapsed:

1. **Direct redemption:** use an issuer-bound credit or permission for its named service.
2. **Delegation:** an authority grants a narrower capability to another controller; no asset sale is implied.
3. **Reciprocity:** a provider gives priority because the requester previously contributed.
4. **Multilateral matching:** a coordinator finds a closed cycle of heterogeneous wants and offers.
5. **Monetary bridge:** sell, license, or pay for something through a legally recognized rail when direct matching is unavailable.

The first four do not eliminate monetary obligations such as tax, payroll, regulated payments, damages, or provider invoices. They expand the set of paths available before a monetary bridge is required.

## Measured bridge experiment

The local V0.1 fixture models three participants:

```text
compute-lab gives 3,600 CPU seconds → repository-commons
repository-commons gives 1 triage action → data-cooperative
data-cooperative gives 100 queries → compute-lab
```

The runner passed one three-resource cycle, matched and consumed three simulated rights once, asserted zero cash equivalents, and rejected seven corruptions: transferability without authority, invented cash value, quantity amplification, permission amplification, duplicate right ID, double allocation, and a disconnected cycle. [13]

This is a control-plane measurement only. No external provider issued or honored a right, and no live atomic exchange occurred.

## Counterevidence and hard limits

- The reviewed evidence does not demonstrate a production network in which a general-purpose AI autonomously earns and converts compute, data, permissions, reputation, and services end to end.
- Provider credits often prohibit transfer and have no cash value. Treating them as liquid wealth could violate terms and overstate solvency. [8][9]
- Permissions and credentials can be revoked; reputation can disappear after context change or identity loss; data rights can carry privacy, license, export, and purpose restrictions.
- Multilateral exchange increases matching and settlement complexity. A single failed leg can leave participants exposed unless commitments are reserved, sequenced, insured, or reversed.
- There is no justified universal exchange rate among CPU seconds, queries, repository actions, attention, and trust. A scalar “agent wealth score” would hide constraints and invite Goodhart behavior.
- Accumulating permissions or dependencies can create capture and systemic risk. The goal must be useful, consented reach—not lock-in or unbounded causal power.
- Recognition as an accounting asset, taxable receipt, contract right, license, barter income, or regulated instrument is jurisdiction- and fact-specific and requires professional review before live use.

## Buildable decision

Keep the existing money lifecycle as Horizon A because taxes, refunds, customer obligations, providers, and legal accountability still use monetary rails. Expand the frontier architecture with a separate **resource-rights ledger** whose records are typed, issuer-bound, scoped, expiring, revocable, non-transferable by default, and never silently marked to cash.

The treasury becomes two linked systems:

```text
money ledger
  → custody, obligations, settlement, refunds, tax, cash reconciliation

resource-rights ledger
  → compute, data, storage, licenses, permissions, reciprocal priority, commitments

policy router
  → chooses a permitted conversion or redemption path
  → never sums unlike units
  → uses money only when a real monetary bridge is necessary and authorized
```

## Falsification criteria

Reject or materially revise the model if:

1. a right can be redeemed without issuer authority or holder authorization;
2. an exchange amplifies quantity, scope, or permissions beyond the offer;
3. a non-transferable credit or permission is sold or delegated as if transferable;
4. reputation or credentials are treated as universally portable truth;
5. unlike resources are summed into a single balance without a real conversion event;
6. a failed exchange leg cannot be reversed, compensated, or escalated;
7. a provider's external record disagrees with the internal redemption ledger;
8. a simulated right is described as live capacity;
9. resource accumulation expands agent authority beyond operator and counterparty consent;
10. a live experiment creates legal, tax, privacy, licensing, security, or accounting obligations without a named responsible operator.

## Next highest-priority experiment

Replace exactly one simulated edge with a live but low-risk, revocable resource grant—preferably an operator-owned compute sandbox allowance rather than money or production repository write access. Capture the issuer record, scope, expiry, redemption request, provider usage evidence, revocation, and remaining allowance. Keep the other two edges synthetic and do not claim a live multilateral economy until all legs have independent fulfillment evidence.
