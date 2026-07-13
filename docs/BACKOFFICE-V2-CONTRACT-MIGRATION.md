# Trustless Work Core — Official Backoffice Integration: v2 Wire-Contract Changes

> What changed in the API on 2026-07-13, why, and exactly how an official
> backoffice must integrate against it. Every change below is **already live
> in the codebase**; the shapes shown here are the ones the server returns
> today. The field-by-field truth is always the live Swagger UI at `/docs`
> (OpenAPI JSON at `/api`) and `docs/schema.graphql` for GraphQL.

---

## 0. TL;DR for the frontend/backoffice team

1. **`contractId` (the on-chain `C…` address) is now the ONLY escrow
   identifier.** No response carries an internal UUID anymore — not the
   escrow, not its events, not its deposits, not the grants. If you stored
   or passed `id`/`escrowId` UUIDs anywhere, replace them with `contractId`.
2. **Everything is camelCase**, including the `snapshot` and event payloads
   (previously raw snake_case from the chain).
3. Renames: **`contractType` → `type`**, **`balanceProjected` → `balance`**.
4. **The listing now returns the full `snapshot` per row**, and there is a
   new **batch detail** endpoint: `GET /escrows/details?contractIds=…`.
5. The detail no longer returns `participants` (roles live in
   `snapshot.roles`), and events are now split into `topics` + `payload`.
6. `totalAmount` is **multi-release only** (null for single-release — read
   `snapshot.amount` instead).
7. The flat `asset` field is gone from the escrow body (read
   `snapshot.trustline.address`).
8. **Grants are addressed by `contractId`** now (`escrowId` UUID is gone
   from the body and the response).
9. `createdByUserId` / `creatorAddress` are **no longer always null** — the
   API now stamps the creator on every confirmed deploy. Creator-based
   grant authority works for new escrows.

All of this is breaking. Ship the backoffice update together with (or
immediately after) the core deploy.

---

## 1. Identity: `contractId` end to end

The same `C…` address now tracks an escrow through its whole life:

```
POST /escrow/single-release/v2/deploy   → { unsignedXdr, txHash, contractId }   (predicted)
POST /stellar/send-transaction          → { txHash, ledger, contractId, escrow } (confirmed)
GET  /escrows/:contractId               → the read-model, same key
POST /escrows/access-grants             → shared by the same key
```

**Do:** key your local state, routes and caches by `contractId`.
**Don't:** expect `id` (UUID) anywhere — it was removed from every response.
Keyset cursors (`nextCursor`) remain opaque strings; treat them as such.

## 2. camelCase everywhere (snapshot included)

The `snapshot` is the full on-chain contract state. It used to pass through
in the chain's snake_case; it is now presented in camelCase with a stable,
human-friendly root ordering. Values are untouched — only keys changed.

| Before (snake_case) | Now |
|---|---|
| `platform_fee` | `platformFee` |
| `engagement_id` | `engagementId` |
| `receiver_memo` | `receiverMemo` |
| `release_signers` | `releaseSigners` |
| `dispute_resolvers` | `disputeResolvers` |
| `service_providers` | `serviceProviders` |
| `is_disputed` | `isDisputed` |
| `approved_by` / `approval_count` | `approvedBy` / `approvalCount` |

Root key order is now canonical: `title`, `description`, `engagementId`,
`roles`, `trustline`, `amount`, `platformFee`, `receiverMemo`, `milestones`,
`dispute`, `flags`, `released`, then anything else. Don't rely on order for
parsing — it's cosmetic — but it is stable.

## 3. The escrow body (list, detail, batch)

```jsonc
{
  "network": "testnet",
  "contractId": "CBLPXYESZJJDQSYDZC6HOCWU6DQP2SFZBAESVK3RTVK4DTU42HYUG5DT",
  "type": "single-release",            // was `contractType`
  "engagementId": "ENG-12345",
  "status": "active",                  // derived on-chain: active | released | disputed
  "totalAmount": null,                 // multi-release ONLY (sum of milestones); single → snapshot.amount
  "lastLedgerSeq": "3529571",
  "createdAt": "2026-07-10T06:10:15.119Z",
  "updatedAt": "2026-07-10T06:10:16.515Z",
  "snapshot": { /* full camelCased contract state */ },
  // detail only (not on listing rows):
  "createdByUserId": "42",             // now populated on API deploys
  "creatorAddress": "G..."             // wallet that signed the deploy tx
}
```

Removed from this body: `id` (UUID), `asset` (read
`snapshot.trustline.address`), and `contractType` (renamed to `type`).

`createdByUserId`/`creatorAddress`: these were always null due to a wiring
bug — the authorship hook was never invoked. It now fires on every
confirmed factory deploy through `POST /stellar/send-transaction`. Escrows
deployed before this fix remain null (backfill is a pending team decision).

## 4. Read endpoints

| Endpoint | What it returns now |
|---|---|
| `GET /escrows` | Keyset page; **every row includes the full `snapshot`**. Filters unchanged: `scope(mine\|all)`, `status`, `contractType`*, `engagementId`, `contractIds[]`(1–50), `participant`(G…), `role`, `platformId`, `subjectId`, `createdAfter/Before`, `limit`(1–200), `cursor`, `sort`, `order`. |
| `GET /escrows/details?contractIds=C…&contractIds=C…` | **NEW.** Batch detail (1–50): `{ data: [ { escrow, deposits[] } ] }`. No timeline (page it per escrow). Inaccessible/unknown ids are silently absent. |
| `GET /escrows/:contractId` | `{ escrow, events[], deposits[] }` — **no `participants`** (use `snapshot.roles`). |
| `GET /escrows/:contractId/events` | Keyset-paged timeline (see §5 for the event shape). |
| `GET /escrows/:contractId/milestones` | `{ contractId, type, milestones[] }` (camelCased entries). |
| `GET /escrows/milestones?contractIds=…` | Batch milestones (1–50). |
| `GET /escrows/financial?contractIds=…` | Batch financials (see §6). |
| `POST /graphql` | Same contract on the graph: `Escrow.type`, no `asset` field, camelCased `snapshot`/`milestones`, `EscrowFinancial.balance`, events as `topics`+`payload`. |

\* The *query filter* is still named `contractType` (only response fields
were renamed). Send `?contractType=single-release`; read `type` back.

## 5. Events: `topics` + `payload`

Before, each event carried a double-nested `data: { data, topics }` blob
and an `id`. Now:

```jsonc
{
  "kind": "tw_init",
  "actor": null,                       // still null — requires an Indexer change (pending)
  "ledgerSeq": "3529571",
  "txHash": "d4f776a7…",
  "ledgerClosedAt": "2026-07-10T06:10:13.000Z",
  "topics": ["tw_init", "ENG-12345"],  // the indexed values the CONTRACT emitted (Soroban event topics)
  "payload": {                          // the decoded event body, camelCased
    "amount": "10000000000",
    "receiver": "G…",
    "trustline": "C…",
    "platformFee": 100
  }
}
```

`topics` come from the smart contract itself (event kind + engagement id) —
the core passes them through. Deposits similarly lost their `id`; everything
else in the deposit shape is unchanged (`asset` there is still the SAC
string `"USDC:G…"` — the structured asset object is a pending decision).

## 6. Financial view

```jsonc
{
  "contractId": "C…",
  "type": "multi-release",             // was `contractType`
  "asset": "C…",                       // unchanged here for now (structured asset = pending decision)
  "platformFee": "100",
  "totalAmount": "2500000000",
  "totalDeposited": "2500000000",
  "totalReleased": "0",
  "pendingRelease": "2500000000",
  "nextRelease": { "milestoneIndex": 0, "amount": "2500000000" },
  "balance": "2500000000"              // was `balanceProjected`; still deposited − released
}
```

`balance` is the **projected** figure (recorded deposits minus released
value). The authoritative balance lives on-chain; a live on-chain balance
read is a pending team decision.

## 7. Access grants: by `contractId`

```jsonc
// POST /escrows/access-grants
{ "granteeEmail": "partner@x.com", "scope": "escrow",
  "contractId": "CBLPXYES…", "expiresAt": "2026-12-31T23:59:59Z" }
// → 201 { id, scope, contractId, grantorUserId, granteeUserId, permission, expiresAt, createdAt }

// POST /escrows/access-grants/revoke
{ "granteeEmail": "partner@x.com", "scope": "escrow", "contractId": "CBLPXYES…" }
// → 200 { revoked: 1 }
```

`escrowId` (UUID) is gone from both the body and the response. An unknown
or unprojected `contractId` returns the usual no-leak `404 ESCROW_NOT_FOUND`.
Because authorship is now stamped (§3), the "creator or admin" authority
check works for every escrow deployed after this release.

## 8. Reminder: the platform/tenancy rules this builds on

Shipped in the same release train (see `BACKOFFICE-INTEGRATION-GUIDE.md`
for the full picture):

- Every account is born with a default Platform ("My Platform"); admin
  -created users get one too.
- Integration (`ESCROW_MANAGER`) API keys are **always platform-scoped** —
  issue keys from a platform, never as loose "user keys". Multi-platform
  owners must pass `platformId` (`422 PLATFORM_REQUIRED` otherwise).
- Every deploy is attributed to a platform, **guaranteed**: platform keys
  scope themselves; wallet sessions resolve to the owner's sole platform or
  the `X-TW-Platform` header; the attribution note is awaited — a deploy
  that can't be attributed fails instead of creating an orphan.
- `X-TW-Subject: <externalId>` on deploy attributes the escrow to the
  platform's end-user; filter later with `?subjectId=`.

## 9. Backoffice migration checklist

- [ ] Replace every UUID usage with `contractId` (state, routes, caches,
      grant calls).
- [ ] Rename readers: `contractType`→`type`, `balanceProjected`→`balance`.
- [ ] Update snapshot readers to camelCase keys (`platformFee`,
      `engagementId`, `releaseSigners`, `isDisputed`, …).
- [ ] Detail view: stop reading `participants`; render roles from
      `snapshot.roles`. Stop reading `asset`; use `snapshot.trustline.address`.
- [ ] `totalAmount`: only render for `type === "multi-release"`; for
      single-release use `snapshot.amount`.
- [ ] Events UI: read `topics` + `payload` (the `data` wrapper is gone);
      drop event/deposit `id` usage.
- [ ] Lists: the rows now carry `snapshot` — you may drop follow-up detail
      calls for list rendering; use `GET /escrows/details` for bulk views.
- [ ] Grants UI: send `contractId`, handle `404 ESCROW_NOT_FOUND`.
- [ ] GraphQL clients: regenerate types from `docs/schema.graphql`.

## 10. Known pending items (not in this release)

Structured asset object (`{ name, address, contractId }` — needs an asset
metadata catalog), live on-chain `balance`, `actor` on events (needs the
Indexer to forward the tx source account), admin enable/disable endpoints
(semantics undecided), authorship backfill for historical escrows, and the
`?contractType=` filter rename. Amount formatting stays raw-integer by
design (7-decimal assets); expose formatting in the client.
