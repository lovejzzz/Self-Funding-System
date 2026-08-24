# Fixture runner V0.1 research prototype

This no-dependency prototype tests the evidence boundary proposed for the first Stripe close reducer. It is a research artifact, not production payment code.

Run it with Node.js 20 or newer:

```sh
node research/experiments/fixture-runner-v0.1/runner.mjs \
  research/experiments/fixture-runner-v0.1/manifest.json
```

The runner enforces three rules before reducing a fixture:

1. pre-live evidence can never expect `REVIEWED_CLOSED_LIVE`;
2. transport fixtures must match the hash of their authenticated base payload, and policy fixtures must be explicitly synthetic and versioned;
3. `RAIL_SANDBOX` requires captured Stripe sandbox object IDs and raw-object hashes. Missing rail input returns the exact blocker `RAIL_SANDBOX_CAPTURE_REQUIRED` rather than using a local mock.

The included manifest intentionally produces three local passes and one rail blocker. That is the measured result of this bounded run: transport and policy logic execute, the evidence-upgrade guards reject three attacks, but a complete three-class pre-live suite remains unproven until an operator sandbox capture is supplied.

`stripe-mock` is not used because Stripe describes it as stateless, hardcoded, locked to the latest API version, and unsuitable for reproducing real API behavior. It could validate request/response shape, but it cannot become `RAIL_SANDBOX` evidence.

## Operator sandbox capture handoff

The capture harness uses Node's built-in `fetch`; Stripe CLI is not required. It creates and confirms one USD 0.50 sandbox PaymentIntent at pinned API version `2026-07-29.dahlia`, retrieves the linked Charge with its Balance Transaction expanded, and retrieves the matching `payment_intent.succeeded` Event.

Run the no-network safety test first:

```sh
node research/experiments/fixture-runner-v0.1/capture-sandbox-charge.mjs --self-test
```

Then an authorized operator can provide a sandbox-only key through a secret manager or a non-echoing prompt. On macOS/zsh, the following keeps the key itself out of shell history and clears the exported value after the run:

```sh
read -rs "SELF_FUNDING_STRIPE_SANDBOX_KEY?Stripe sandbox key: "
export SELF_FUNDING_STRIPE_SANDBOX_KEY
printf '\n'
node research/experiments/fixture-runner-v0.1/capture-sandbox-charge.mjs
unset SELF_FUNDING_STRIPE_SANDBOX_KEY
```

Do not put a key literal in the command line, chat, a command transcript, or a tracked file. Prefer a managed secret injection when available. The harness rejects `sk_live_` and `rk_live_` credentials, applies a private process umask, and validates the complete PaymentIntent → Charge → Balance Transaction → Event chain before writing a bundle. Raw responses can contain a PaymentIntent client secret, so the default location is the git-ignored `capture-private/` directory. A custom `SELF_FUNDING_CAPTURE_DIR` is allowed only when the operator has separately verified its permissions and retention. A sibling `capture-bundle.json` contains allowlisted object fields and raw-response hashes for review and later replay. The harness does not prove real money, settlement timing, payout membership, or a bank posting; every output remains `RAIL_SANDBOX` with an evidence ceiling of `CONTROL_PLANE_PASSED`.
