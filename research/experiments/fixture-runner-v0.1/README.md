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
