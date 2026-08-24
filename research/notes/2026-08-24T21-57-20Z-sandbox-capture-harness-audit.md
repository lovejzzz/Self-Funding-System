# Sandbox capture harness audit and hardening

**Research timestamp:** 2026-08-24T21:57:20Z
**Horizon:** A — smallest buildable path now
**Scope and assumptions:** This is a no-network audit of the uncommitted Stripe sandbox capture handoff. No Stripe key, account, sandbox object, live object, customer data, provider charge, bank rail, or real money was available or used. It is a security and evidence-boundary prototype, not production payment code or legal, accounting, tax, PCI, or financial advice.

## Research question

Is the proposed operator handoff strong enough to submit as a reproducible research artifact before an authorized sandbox run, and which defects can be closed without pretending that local tests are rail evidence?

## Method

The capture script, README, raw/public split, git-ignore rule, prior journal entry, fixture runner, and manifest were reviewed line by line. Current primary Stripe documentation was reopened for PaymentIntent creation/confirmation, Charge linkage, Balance Transaction accounting, Event provenance, and sandbox/restricted-key handling.

Queries included:

- `site:docs.stripe.com/api/payment_intents/create Stripe PaymentIntent latest_charge confirm pm_card_visa`
- `site:docs.stripe.com/api/charges/object balance_transaction source payment_intent`
- `site:docs.stripe.com/api/events/object request idempotency_key api_version immutable`
- `site:docs.stripe.com/keys restricted keys permissions payment intents events balance transactions`

## Source ledger

| # | Title | Institution | Status | URL | Pinpoint used |
|---|---|---|---|---|---|
| 1 | Create a PaymentIntent | Stripe | Living API reference; reopened 2026-08-24 | https://docs.stripe.com/api/payment_intents/create | `confirm=true`, amount, currency, PaymentMethod, 50-cent USD minimum |
| 2 | The Charge object | Stripe | Living API reference; reopened 2026-08-24 | https://docs.stripe.com/api/charges/object | PaymentIntent link, expandable Balance Transaction, amount, currency, captured/paid/status, `livemode` |
| 3 | The Balance Transaction object | Stripe | Living API reference; reopened 2026-08-24 | https://docs.stripe.com/api/balance_transactions/object | `source`, amount, fee, net, currency, status, type; `net = amount - fee` |
| 4 | The Event object | Stripe | Living API reference; reopened 2026-08-24 | https://docs.stripe.com/api/events/object | immutable versioned data, `livemode`, request ID, idempotency key |
| 5 | API keys | Stripe | Living documentation; reopened 2026-08-24 | https://docs.stripe.com/keys | sandbox/live separation, RAK/secret sensitivity, vault/environment handling, request logs |
| 6 | Capture harness audit result | SELF/FUNDING | Measured 2026-08-24 | ../experiments/fixture-runner-v0.1/capture-harness-audit-result.json | Exact no-network commands, passes, guards, and remaining blocker |

## Audit findings

### Finding 1 — the original command example weakened the stated secret boundary

The README placed a placeholder key literal inside an environment assignment on the command line. Even though the placeholder was not a real credential, copying that pattern with a real key would commonly put the secret in shell history and sometimes process or terminal records. Stripe says restricted and secret keys are sensitive, recommends a secrets vault or environment delivery, and says not to share keys in chat or other unencrypted channels. [5]

**Correction:** the handoff now prefers managed secret injection and provides a macOS/zsh non-echoing prompt that exports the value only for the run and unsets it afterward. The script never accepts a key argument and still refuses `sk_live_` and `rk_live_` prefixes.

### Finding 2 — object presence was checked more strongly than object-chain identity

The first harness required a succeeded test PaymentIntent, a Charge, an expanded Balance Transaction, and a matching Event lookup, but it did not explicitly assert every cross-object link and accounting invariant before writing the review bundle. Stripe documents these fields separately; a research capture should fail closed if any one of them disagrees. [1][2][3][4]

**Correction:** the harness now requires all of the following before writing:

1. all four object types are correct and all rail objects have `livemode=false`;
2. PaymentIntent is succeeded; Charge is succeeded, paid, and captured;
3. PaymentIntent `latest_charge` equals Charge ID;
4. Charge `payment_intent` equals PaymentIntent ID;
5. Balance Transaction `source` equals Charge ID;
6. amount and currency agree across PaymentIntent, Charge, and Balance Transaction;
7. captured amount equals received amount;
8. Balance Transaction `net = amount - fee`;
9. Event type, Event PaymentIntent, Event latest Charge, API version, request ID, and idempotency key all match the originating request.

### Finding 3 — private bytes and review bytes needed separate failure gates

The allowlist already omitted high-risk payment details, but the artifact did not scan the final review bundle for forbidden key names and credential prefixes. The default raw location was git-ignored, while a custom output directory could not honestly be described as automatically git-ignored.

**Correction:** the script now applies process umask `077`, scans the serialized review bundle for client secret, billing/payment details, receipt, fingerprint, and Stripe key fragments, and documents that a custom output directory requires separate operator permission and retention review. Exact raw bodies remain private; hashes alone do not make them independently reproducible.

## Direct measured result

The post-correction no-network run produced:

| Measurement | Result |
|---|---:|
| Syntax | Pass |
| Live-key prefix refusal | Pass |
| `client_secret` allowlist canary | Pass |
| Complete valid capture-chain fixture | Pass |
| Deliberate cross-object/math mismatches rejected | 5 / 5 |
| Review-bundle forbidden-fragment scan | Pass |
| Network calls | 0 |
| Missing credential behavior | `SANDBOX_CREDENTIAL_REQUIRED` |
| Existing fixture runner | 3 pass / 1 rail blocked |

The machine-readable result is preserved in `capture-harness-audit-result.json`.

## Counterevidence, unknowns, and blocker

- No Stripe-created object was captured, so these passes prove local validation and secret-handling behavior only. They do not establish `RAIL_SANDBOX` evidence.
- Event-list visibility within the current polling window, exact Event/request ID linkage, response headers, RAK permissions, Balance Transaction expansion permissions, account metadata, and Workbench confirmation remain unmeasured against an operator account.
- Environment variables and local files are not a universal secret-management guarantee. A production handoff still needs a managed secret service, isolated runtime, access policy, audit log, deletion/retention rule, and operator review.
- The capture harness does not yet import the bundle into the reducer. That should be implemented only against the actual allowlisted object shape or an explicitly synthetic lower evidence class, not by inventing a fake rail bundle.
- The exact blocker remains `RAIL_SANDBOX_CAPTURE_REQUIRED`. NOW 0 remains false.

## Buildable decision

Submit the hardened handoff, its append-only correction, and its measured no-network audit. Do not run an external mutation without the authorized Stripe operator. The next permitted state transition remains:

```text
LOCAL_HARNESS_AUDITED
  → operator-authorized sandbox key injection
  → Stripe-created test objects
  → private/public review
  → import the same accepted bundle twice
  → exactly one balanced booking
  → maximum CONTROL_PLANE_PASSED
```

## Falsification criteria

Reject or revise the handoff if an operator run shows any of the following:

1. a required RAK permission is broader than the approved boundary;
2. an Event lacks the originating request identity/idempotency linkage required by this evidence design;
3. any cross-object ID, amount, currency, or Balance Transaction equation differs;
4. any secret or forbidden payment field appears in the review bundle or terminal output;
5. a custom output path creates broader-than-approved access or retention;
6. replay produces two bookings or any evidence state above `CONTROL_PLANE_PASSED`;
7. Stripe logs cannot independently confirm the object/request chain.

## Next highest-priority question

When an authorized operator runs the hardened harness with a sandbox-only restricted key, do the real sandbox response shapes satisfy all linkage/privacy guards, and can the reviewed bundle be replayed twice through the reducer with exactly one balanced booking and no evidence-class upgrade?
