# Resource-rights ledger V0.1

This local experiment tests one narrow proposition: three heterogeneous, non-cash resource promises can form a closed exchange cycle without being collapsed into a token or dollar balance.

The fixture has three providers. A compute lab offers CPU seconds and wants data queries; a data cooperative offers queries and wants one repository-maintenance action; a repository commons offers that action and wants compute. The runner requires one directly issued, scoped, expiring, revocable, non-transferable right for every edge.

Run it with:

```sh
node research/experiments/resource-rights-ledger-v0.1/runner.mjs
```

The runner rejects quantity or permission amplification, invented cash equivalents, transferable rights, duplicate allocation, duplicate IDs, and a disconnected exchange. It then consumes each simulated right once.

This is `SIMULATED_RESOURCE_EXCHANGE`, capped at `LOCAL_CONTROL_PLANE_ONLY`. It does not contact a cloud, dataset, GitHub repository, credential issuer, payment rail, or legal counterparty. It proves neither enforceability nor live redemption. The rights are typed commitments, not money, accounting assets, securities, or universally transferable tokens.
