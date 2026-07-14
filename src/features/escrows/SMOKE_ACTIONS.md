# Escrow actions smoke checklist (Core v2 / SDK v5)

Manual verification on testnet after deploy. For each type (`single-release`, `multi-release`):

1. **Deploy** — Create escrow → toast + navigate to detail → appears in list (or indexing toast then refetch).
2. **Fund** — Fund action → balance/deposits update after invalidate.
3. **Change milestone status** — Service provider updates status.
4. **Approve milestone** — Approver approves.
5. **Release** — Single: release funds. Multi: release by milestone index / approve+release.
6. **Dispute** — Start dispute (escrow or milestone).
7. **Resolve** — Resolve with distributions.
8. **Withdraw** — Withdraw remaining when applicable.
9. **Update** — Change title/description.
10. **Manage milestones** — Add / edit milestone descriptions (and amounts on multi).

After each step: explorer link in toast works; detail Events/Deposits cards refresh; list cards reflect status.
