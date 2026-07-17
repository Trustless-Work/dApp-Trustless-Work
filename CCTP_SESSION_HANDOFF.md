# CCTP — Session handoff (2026-07-13)

Consolidated context to resume work in a fresh session. Covers three repos. Read this before touching anything — it replaces re-deriving state from scratch.

Related doc, still accurate and complementary: `CCTP_CONTEXT.md` in `Trustless-Work-Core` (the original design doc — security principle, contract summary, ecosystem/Discord research). This file picks up where that one's "what's left" section stood and covers everything done since, in more operational detail.

---

## 1. Where things stand, in one paragraph

CCTP cross-chain payout is **fully implemented and verified end-to-end on testnet** at the contract + backend level: a receiver registers a destination chain/address (and an API-computed `max_fee`), a normal release routes their share through Circle's Forwarding Service, and the mint completes automatically on the destination chain with zero extra signatures. This was proven live (Stellar → Base Sepolia) — see §4. The frontend module (`src/features/cctp-bridge/`) is built and now **wired into the real escrow-details UI** that just landed on `develop` (see §6) — but **nothing in the frontend has been committed yet**, and the dev server can't start locally until two env vars are added (§7).

---

## 2. The three repos and their branches

| Repo | Branch | Head commit | Status |
|---|---|---|---|
| `Trustless-Work-Smart-Escrow` (contracts) | `feat/single-release-v2` | `0571aaf` | pushed |
| `Trustless-Work-Smart-Escrow` (contracts) | `feat/multi-release-v2` | `82ca7eb` | pushed |
| `Trustless-Work-Core` (backend) | `feat/cctp` | `8535b56` | pushed |
| `dApp-Trustless-Work` (frontend) | `feat/cctp-v2` | `0c27938` (= tip of `develop`, fast-forwarded) | **local work uncommitted** |
| `trustlesswork-sdk-react` (Escrow React SDK) | `feature/version-2` | cloned locally, not modified | local-only, see §5 |

Note: `Trustless-Work-Smart-Escrow`'s repo moved to `https://github.com/Trustless-Work/trustlesswork-smart-contract-stellar.git` — pushes to the old URL still work (GitHub redirects) but worth updating the remote eventually.

---

## 3. Contracts — what changed and why

Both `feat/single-release-v2` and `feat/multi-release-v2` got the same two commits (mirrored by hand across branches since they don't share history):

1. **`feat(cctp): route CCTP releases through Circle's Forwarding Service`** — wires `deposit_for_burn_with_hook` into the release path (new `release_receiver_amount_via_cctp_forwarding` function in `modules/cctp/release.rs`), used whenever a receiver has a registered `CrossChainDestination`, instead of plain `deposit_for_burn`. The CCTP protocol fee is queried live on-chain via `get_min_fee_amount` on the real `TokenMessengerMinter` (confirmed via `stellar contract info interface` against the testnet deployment, not guessed).

2. **`feat(cctp): receiver approves the forwarding max_fee, not a contract constant`** — the important design change. Originally the Forwarding Service's flat fee was a hardcoded contract constant; this was **replaced mid-session** because every time Circle's fee drifted, the contracts would need a full redeploy. Now:
   - `CrossChainDestination` struct gained `max_fee: i128`.
   - `set_cross_chain_destination` gained a `max_fee` parameter, set once by the **receiver's own signature**, same call as the destination itself.
   - `release_funds`'s signature is **untouched** — the release signer still has zero influence over the fee or destination, only decides *when*.
   - A 10%-of-amount on-chain cap (`MaxFeeExceedsCap` error) is defense-in-depth against a bogus/compromised `max_fee`, in case someone calls the contract directly instead of going through the API.
   - The *API* (not the contract, not the frontend caller) computes the real `max_fee` from Circle's live fee-quote endpoint — see §4.

Both branches: single-release 46/46 tests pass, multi-release 58/58 tests pass.

Reference doc for the full contract business rules (all actions, all roles, both contracts): `CONTRACT_ROLES_REFERENCE.md` and `CONTRACT_BUSINESS_RULES.md`, both in `Trustless-Work-Smart-Escrow` repo root (untracked — kept as local reference docs, not committed, per earlier explicit instruction not to commit `CONTRACT_BUSINESS_RULES.md`).

**Latest testnet deploy**: the escrow owner (not me) ran `make deploy` on both branches and updated the real `.env` in `Trustless-Work-Core` with the new wasm hash + contract IDs (`SINGLE_RELEASE_V2_CONTRACT_ID`, `SINGLE_RELEASE_V2_WASM_HASH`, `MULTI_RELEASE_V2_CONTRACT_ID`, `MULTI_RELEASE_V2_WASM_HASH`). I don't have those exact values recorded here — they're already in the real `.env`, not reproduced in this doc.

---

## 4. Backend — what changed, and the E2E proof

`Trustless-Work-Core`, branch `feat/cctp`, two commits on top of a merge with `main` (which brought in a large GraphQL feature + a `predictContractId` fix, unrelated to CCTP):

1. **`feat(cctp): compute forwarding max_fee from a live Circle quote, not a client field`** — new `CctpForwardingFeeService` (`src/application/escrow-transactions/shared/cctp/cctp-forwarding-fee.service.ts`): queries `GET https://iris-api-sandbox.circle.com/v2/burn/USDC/fees/27/{destinationDomain}?forward=true`, takes `forwardFee.high`, converts 6-decimal CCTP units to 7-decimal Stellar stroops (×10), adds a 10% margin. Injected into both `SetCrossChainDestinationUseCase` (single-release-v2) and `SetMultiReleaseV2CrossChainDestinationUseCase` (multi-release-v2) — the public `POST .../cross-chain-destination` DTOs have **no `maxFee` field**; it's computed server-side and baked into the unsigned XDR before the receiver signs.

2. **`fix(cctp): extract feeExecuted from its actual nested path in Iris response`** — bug found during live verification: `forwardTxHash` is top-level on the Iris message object as assumed, but `feeExecuted` is nested at `decodedMessage.decodedMessageBody.feeExecuted`, not top-level. Fixed in `get-attestation.use-case.ts`.

### The actual end-to-end test that was run (raw API, no frontend)

Full manual flow against real testnet infra, with two separate wallets (an "Operator" holding admin/approver/service_provider/release_signer, and a "Receiver" holding only the receiver role — proving the role separation actually works, not just when one wallet holds everything):

1. `POST /escrow/single-release/v2/deploy` → Operator signs → escrow deployed.
2. USDC sent directly to the escrow contract (confirmed `release_funds` checks the real SAC token balance, not the `fund_escrow` accounting counter — so a direct transfer works fine without going through `fund_escrow`).
3. `POST /escrow/single-release/v2/cross-chain-destination` (destinationDomain=6/Base, recipientAddress=the receiver's EVM address) → **Receiver** signs. API computed `max_fee` internally.
4. `POST /escrow/single-release/v2/approve-and-release-milestones` → Operator signs (holds both approver + release_signer roles).
5. Circle's Forwarding Service completed the mint **automatically** — confirmed via Iris directly:
   ```json
   "forwardState": "CONFIRMED",
   "forwardTxHash": "0x03c7a10f36dcc321ace27e73bd0ad926fb497749a8646d06f50205100623e0ec",
   "decodedMessageBody": { "maxFee": "223379", "feeExecuted": "223379", ... }
   ```
   `maxFee == feeExecuted` exactly — the live-quote-plus-10%-margin sizing was correct on the first try with the new design (an earlier attempt with a hardcoded `$0.20` constant undershot Circle's real ~$0.203 fee and failed with `INSUFFICIENT_FEE` — this is exactly the class of bug the redesign fixes).
6. **User confirmed funds arrived in their Base wallet** — no second signature, no manual `receiveMessage` call.

This is the strongest evidence the whole feature works. `CCTP_CONTEXT.md` in `Trustless-Work-Core` has the full narrative with more detail if needed.

### Local dev environment gotchas (for running the backend locally again)

- Needs Postgres + RabbitMQ via `docker compose up -d` (repo has a `docker-compose.yml`).
- `npx prisma generate` + `npx prisma migrate deploy`.
- Two env vars the tracked `.env` was missing, unrelated to CCTP: `WALLET_AUTH_SIGNING_KEY` (a Stellar secret key, used for SEP-10-style wallet-link challenge signing) and `WALLET_AUTH_HOME_DOMAIN` (e.g. `localhost`).
- To get a usable API key against a fresh local DB, either the DB already has an admin (check first — `POST /auth/bootstrap-admin` returns `AUTH_BOOTSTRAP_ALREADY_DONE` if so) or set `ADMIN_BOOTSTRAP_SECRET` and call that endpoint once.
- Default port 3000 — **will collide with the frontend's Next dev server**, which also defaults to 3000. Run one of them on a different port when running both locally (see §7).

---

## 5. The Escrow React SDK (`@trustless-work/escrow`) — not published yet

The frontend's own `develop` branch landed a full escrows feature that imports `@trustless-work/escrow` directly (types, REST client, hooks) — but this package **was never added to `package.json`**, and worse, **the published npm version (3.0.5) is stale** — the real v2 rewrite (matching the V2 contracts) lives unpublished on a branch.

What was done:
1. Cloned `https://github.com/Trustless-Work/trustlesswork-sdk-react` (branch `feature/version-2`) to `/Users/armandocodecr/Documents/Programacion/Proyectos/trustlesswork-sdk-react` — a sibling directory to the other repos, **not inside** `dApp-Trustless-Work`.
2. `npm install` + `npm run build` there (it's an npm-managed package itself, `tsup`-based, produces `dist/`).
3. Added to `dApp-Trustless-Work/package.json`:
   ```json
   "@trustless-work/escrow": "file:../trustlesswork-sdk-react",
   ```
   (a `pnpm link --global` was tried first but warned about not resolving peer deps — `file:` protocol is more reliable for Next.js + React peer resolution.)
4. `pnpm install` in the frontend picked it up cleanly — `tsc --noEmit` came back with zero `@trustless-work/escrow`-related errors afterward.
5. Left `npm run build:watch` running in the SDK repo in the background, so any local edits to the SDK (or pulling updates on that branch) recompile automatically and the frontend picks it up live.

**To resume**: check if `npm run build:watch` is still running in `trustlesswork-sdk-react` (`pgrep -fl "tsup\|build:watch"`); if not, restart it. If the SDK team publishes an official v2 version to npm later, swap the `file:` dependency back to a normal npm version pin.

---

## 6. Frontend — what's wired, what isn't

### `src/features/cctp-bridge/` — built, self-contained, **still untracked in git**

Same module from earlier sessions (services/hooks/schemas/types/ui), calling this repo's own BFF (`/api/core/...` → `Trustless-Work-Core`) for the CCTP-specific endpoints — this is intentionally a *different* API pattern from the rest of the new escrows feature (see next section), because these endpoints don't exist on Trustless Work's public API/SDK at all; they're custom to this repo's own backend.

- `ui/PayoutPreferenceDialog.tsx` — receiver picks destination chain + address, save/revert. Already fully wired now (see below).
- `ui/CompleteCctpMintDialog.tsx` — manual EVM mint-completion fallback. **Still has no entry point in the UI** — needs a `burnTxHash`, which the backend's `GET` escrow endpoints don't expose yet (this was always the known gap; low priority now since Forwarding Service makes it a fallback path, not the happy path).

### New this session: wiring into the real escrows UI

`develop` landed a full escrow-details feature (`src/features/escrows/`) since the last session — the escrow-details page that was previously blocking CCTP integration now exists. Wired `PayoutPreferenceDialog` into it:

- **`src/features/escrows/domain/escrow-action-policy.ts`** — added a concrete (non-abstract) method on the base `EscrowActionPolicy` class:
  ```ts
  canManagePayoutPreference(milestoneIndex?: number): boolean {
    if (milestoneIndex === undefined) return this.roles.isEscrowReceiver();
    return this.roles.isMilestoneReceiver(milestoneIndex);
  }
  ```
  Same logic works for both single- and multi-release because `EscrowRoleContext` already had `isEscrowReceiver()`/`isMilestoneReceiver(index)` (used internally for dispute-opening gating) — just needed a public policy method mirroring the existing `canOpenDispute(milestoneIndex?)` pattern.

- **New file: `src/features/escrows/ui/actions/PayoutPreferenceAction.tsx`** — thin wrapper matching every other action's shape (`ActionTrigger` + a dialog), following `StartDisputeAction.tsx`'s pattern exactly. Opens `PayoutPreferenceDialog` from `cctp-bridge`, passing `escrowKind={escrow.type}` (the `StoredEscrow` discriminator, `"single-release" | "multi-release"`, matches `cctp-bridge`'s `EscrowKind` type 1:1) and `contractId`/`milestoneIndex`.

- **`src/features/escrows/ui/detail/EscrowGeneralActions.tsx`** — added a new "Payout Preference" action group, escrow-level, shown only when `policy.canManagePayoutPreference()` is true (naturally resolves `false` on multi-release escrows since no `milestoneIndex` is passed there).

- **`src/features/escrows/ui/detail/MilestoneActionsMenu.tsx`** — added a per-milestone menu item, shown when `policy.canManagePayoutPreference(milestoneIndex)` is true (multi-release only).

Verified: `tsc --noEmit` and `eslint` both clean across every touched/new file. **Not yet verified visually in a browser** — blocked on env vars (§7).

### The two parallel API patterns in this app (important, don't conflate them)

- **Everything under the new `src/features/escrows/` feature** (reads, approve, release, dispute, fund, etc.) goes through `@trustless-work/escrow`'s own SDK hooks, talking to Trustless Work's **public API** (`TrustlessWorkConfig` wraps `src/app/dashboard/escrows/layout.tsx`, configured with `baseURL={development}` + an API key from `clientEnv.integrations.twApiKey`).
- **`cctp-bridge`** talks to **this repo's own BFF** (`/api/core/...` → `Trustless-Work-Core`, the same backend from §4) — because cross-chain-destination and CCTP attestation endpoints are custom to this project, not part of Trustless Work's public SDK.
- These coexist deliberately. Don't try to migrate `cctp-bridge` onto SDK hooks — there's no SDK equivalent.

---

## 7. To resume: local dev setup checklist

Three services, watch the port collision:

1. **Contracts**: nothing to run locally unless redeploying — testnet only.

2. **Backend** (`Trustless-Work-Core`):
   ```
   docker compose up -d          # Postgres + RabbitMQ
   npx prisma generate && npx prisma migrate deploy
   # .env needs WALLET_AUTH_SIGNING_KEY, WALLET_AUTH_HOME_DOMAIN added (see §4)
   npx dotenv -e <env-file> -- nest start --watch --  # or plain `npm run start:dev` if .env is already complete
   ```
   Run on a **non-3000 port** if the frontend will also run locally, e.g. `PORT=3001`.

3. **SDK** (`trustlesswork-sdk-react`, sibling dir): `npm run build:watch` should already be running in the background — check with `pgrep -fl "tsup"`, restart if not.

4. **Frontend** (`dApp-Trustless-Work`): needs two env vars added to the real `.env` (user said they'll add these themselves, not me):
   ```
   SESSION_SECRET=<random string, 32+ chars>
   CORE_API_URL=http://localhost:3001   # or wherever the backend ends up running
   ```
   Then `pnpm dev` (port 3000, or `next dev` reads `PORT` env if set).

Once all three are up: navigate to `/dashboard/escrows/[contractId]` for an escrow with a CCTP-registered destination and confirm the "Payout Preference" action appears for the connected receiver wallet, opens the dialog, and the form/save flow works against the real backend.

---

## 8. Known gaps / next steps, roughly in priority order

1. **Nothing in `dApp-Trustless-Work` is committed** — `cctp-bridge/` (new), the policy/action-menu wiring (modified), and `package.json`/`pnpm-lock.yaml` (the `@trustless-work/escrow` `file:` dependency) are all sitting uncommitted. Commit once verified working in a browser.
2. **Visual verification blocked on env vars** — do this first once the user adds `SESSION_SECRET`/`CORE_API_URL`.
3. **`CompleteCctpMintDialog` has no UI entry point** — needs the backend to expose `releaseTxHash`/`burnTxHash` on the `GET` escrow response (an indexer change, tracked as a Notion task assigned to the backend/indexer owner — still open, deprioritized since it's now just a fallback path, not required for the happy path).
4. **SDK is unpublished** — using a local `file:` dependency is fine for now but is a standing risk (nothing pins a specific commit; if the SDK repo changes on that branch, behavior could shift under us). Worth asking the SDK team when `v2`/`5.0.0` will actually publish to npm.
5. Multi-release CCTP flow (`milestoneIndex`-scoped) has never been tested end-to-end against real testnet infra — only single-release was. The contract-level tests cover it (58/58 passing on `feat/multi-release-v2`), but no live API/UI run has exercised the multi-release cross-chain-destination path yet.
