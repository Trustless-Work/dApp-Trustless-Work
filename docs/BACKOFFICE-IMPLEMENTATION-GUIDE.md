# Trustless Work Core API — Backoffice Implementation Guide

> Audience: engineers building a **backoffice / frontend** on top of the Trustless Work Core API.
> Goal: everything you need to integrate correctly — every endpoint, what it expects, what it
> returns, and the visual flows that mirror the internal ones.
>
> Status: reflects the API as of **2026‑07‑15**. If something here disagrees with `/docs`
> (Swagger UI) or `docs/schema.graphql`, those generated artifacts win — tell us so we can fix
> this document.

---

## 1. Mental model (read this first)

Trustless Work escrows live **on the Stellar/Soroban blockchain**. The chain is the single source
of truth. This API is **not** a database that owns escrow state — it is two cooperating halves:

1. **The transaction-build side** (`/escrow/**`, `/stellar/send-transaction`). It builds
   **unsigned transactions** (XDR) for you to sign with the user's wallet, and submits the signed
   result to the network. **The API never holds private keys and never signs.**

2. **The read‑model side** (`/escrows/**`, GraphQL `/graphql`). A CQRS projection fed by an
   off‑chain **Indexer** that watches the chain and forwards contract state/events. It is a fast,
   queryable **cache** — *eventually consistent* with the chain, never authoritative.

```
        ┌─────────────────────────────────────────────────────────────┐
        │                        BACKOFFICE (you)                      │
        └───────────────┬─────────────────────────────┬───────────────┘
                        │ build + submit              │ read
                        ▼                             ▼
   ┌────────────────────────────────┐   ┌──────────────────────────────────┐
   │  TRANSACTION-BUILD SIDE         │   │  READ-MODEL SIDE                  │
   │  POST /escrow/**   -> XDR       │   │  GET /escrows/**   (REST)         │
   │  POST /stellar/send-transaction │   │  POST /graphql     (GraphQL)      │
   └───────────────┬────────────────┘   └──────────────▲───────────────────┘
                   │ signed XDR                          │ projected state
                   ▼                                     │
        ┌──────────────────────┐   on-chain events   ┌───┴───────────┐
        │  STELLAR / SOROBAN    ├────────────────────►│   INDEXER      │
        │  (source of truth)    │                     │  (projection)  │
        └──────────────────────┘                     └───────────────┘
```

**The consequence for your UI:** after a successful write (deploy / fund / release / …) the
read‑model may lag by a few seconds. Design for eventual consistency — poll the read endpoints or
optimistically update, don't assume the projection is instantaneous.

---

## 2. Conventions that apply everywhere

| Topic | Rule |
|---|---|
| **Base URL** | Production: `https://trustless-core-production.up.railway.app`. **No global path prefix, no URL versioning** — the version is literally in the escrow paths (`/escrow/single-release/v2/...`). |
| **Content type** | `application/json` for all bodies. |
| **BigInt** | Every 64‑bit id (`id`, `userId`, `platformId`, `subjectId`, `ledgerSeq`, …) is serialized **as a string**. Never assume it fits a JS `number`. |
| **Dates** | ISO‑8601 strings (`2026-07-15T00:00:00.000Z`). |
| **Amounts** | **Human token units as decimal strings** on the read‑model (`"250.5"`), and **plain numbers** in transaction‑build request bodies (`250.5`). No base units on the wire. Scaling uses the token's real SEP‑41 `decimals()` (USDC = 7; custom tokens may differ). |
| **platformFee** | A **percent** integer in build bodies (`1` = 1%); a percent decimal string on reads (`"5"` = 5%). |
| **Validation** | Global `ValidationPipe` with `whitelist + forbidNonWhitelisted`. **Unknown/extra fields → 400.** Wrong types → 400. |
| **Errors** | RFC‑9457 Problem Details on every non‑2xx (see §3). |
| **Rate limiting** | Budgeted **per credential** (per api‑key id / per session token / per IP for public routes), not globally. Expect `429 TOO_MANY_REQUESTS`. `POST /auth/bootstrap-admin` is tightened to 5/min. |
| **Swagger** | Interactive docs at `/docs`, raw OpenAPI JSON at `/api`. GraphQL SDL committed at `docs/schema.graphql`. |

### 3. Error shape (RFC‑9457 Problem Details)

Every error looks like this:

```json
{
  "type": "https://docs.trustlesswork.com/errors/auth-insufficient-role",
  "title": "Forbidden",
  "status": 403,
  "code": "AUTH_INSUFFICIENT_ROLE",
  "detail": "This operation requires one of: ADMIN.",
  "instance": "/admin/users",
  "traceId": "1ba3413c-b7eb-496f-8560-b209d438ab27",
  "extensions": { "requiredAnyOf": ["ADMIN"], "present": ["ESCROW_MANAGER"] }
}
```

Branch on the stable **`code`** (machine‑readable), never on `detail`/`title` (human copy, may
change). Status mapping: validation → **400/422**, missing credential → **401**, wrong role →
**403**, not found → **404**, conflict → **409**, rate limit → **429**, dependency down → **503**,
unexpected → **500** (always carries a `traceId` — log it).

---

## 4. Authentication & authorization

### 4.1 Two credential types, one guard

Every route (except `POST /auth/bootstrap-admin` and `GET /health`) requires **one** credential:

- **API key** — header `x-api-key: <id>.<secret>`. For machines/integrators. Carries its own
  roles and (optionally) a platform scope. **Takes precedence** if both are present.
- **Wallet session JWT** — header `Authorization: Bearer <token>`. For humans logging in with a
  wallet. Always carries **only the `ESCROW_MANAGER` role** and `platformId: null`.

Both collapse to the same internal auth context `{ keyId, userId, platformId, roles }`. Missing
credential → `401 AUTH_CREDENTIAL_MISSING`.

### 4.2 Roles (`ApiKeyRole`)

`ADMIN`, `BACKOFFICE_ADMIN`, `ESCROW_MANAGER`. Role gates are **any‑of** (need at least one listed
role). Because wallet sessions only carry `ESCROW_MANAGER`, **any endpoint requiring
`ADMIN`/`BACKOFFICE_ADMIN` is reachable only with an api‑key of that role** — a human Bearer
session gets `403`.

Rule of thumb:

- **Operator/back‑office admin actions** (`/admin/**`, and mediating `/auth/register|recover|session`)
  → require an `ADMIN`/`BACKOFFICE_ADMIN` **api‑key**.
- **Escrow build + reads** → any authenticated credential with `ESCROW_MANAGER` (every self‑service
  key and every wallet session has it). **Deploy** specifically requires `ESCROW_MANAGER`.
- **Self‑service** (`/users/me/**`, `/platforms`, `/wallets/link/**`) → any authenticated caller;
  ownership is derived from the credential, never from the URL/body (anti‑IDOR).

### 4.3 The SEP‑10 challenge/verify pattern

Four flows prove wallet ownership with a signed Stellar challenge transaction. They all share the
same 2‑step shape:

1. `POST .../challenge` with `{ "address": "G..." }` → returns `{ xdr, networkPassphrase, expiresAt }`.
2. Sign that `xdr` **locally in the wallet** (Freighter, Lobstr, …) on the given `networkPassphrase`,
   before `expiresAt`.
3. `POST .../verify` with `{ "address", "signedXdr" }` → returns the credential/result.

Used by: **register** (onboard a new account), **recover** (mint a fresh key for an existing
wallet), **session** (human wallet login → Bearer JWT), **wallet‑link** (attach another wallet to
your account).

### 4.4 Bootstrap (first run only)

`POST /auth/bootstrap-admin` with `{ adminSecret, email? }` (secret must equal the server's
`ADMIN_BOOTSTRAP_SECRET`) mints the very first `ADMIN` user + api‑key. Returns the full key **once**.
Rotate the bootstrap secret immediately after.

### 4.5 Secrets shown once

The full `apiKey` credential (`<id>.<secret>`) is returned **exactly once** — on bootstrap,
register‑verify, recover‑verify, create, and rotate. It is never retrievable again. Persist it on
receipt or the user must rotate.

---

## 5. THE core flow: build → sign → submit

Every state‑changing escrow operation (deploy, fund, release, dispute, …) is a **three‑step dance**.
Internalize this — it is the spine of the whole product.

```
 (1) BUILD                          (2) SIGN                       (3) SUBMIT
 ┌───────────────────────┐        ┌──────────────────┐         ┌──────────────────────────┐
 │ POST /escrow/<fam>/vN/ │        │ wallet signs     │         │ POST /stellar/            │
 │      <action>          │  XDR   │ unsignedXdr      │ signed  │      send-transaction     │
 │ body: {contractId,...} ├───────►│ locally          ├────────►│ body: { signedXdr }       │
 │ -> { unsignedXdr,      │        │ (Freighter/Kit)  │         │ -> { txHash, ledger, ... }│
 │      txHash,           │        └──────────────────┘         └──────────────────────────┘
 │      contractId? }     │
 └───────────────────────┘
```

1. **Build.** Call the relevant `POST /escrow/<family>/<version>/<action>` with a plain‑JSON body.
   You get back `{ unsignedXdr, txHash, contractId? }`. `contractId` is present **only on deploy**
   (the escrow's future address, predicted from the deploy salt). The API **simulated** the tx but
   did **not** sign or submit it.

2. **Sign.** Hand `unsignedXdr` to the user's wallet to sign locally (Stellar Wallets Kit /
   Freighter). The private key never leaves the client.

3. **Submit.** `POST /stellar/send-transaction` with `{ signedXdr }`. The API forwards it to
   Horizon and enriches the reply from Soroban RPC. Response is one of three shapes — **branch on
   `code` when present, else on `contractId`** (see §7).

After submit, the Indexer will (a few seconds later) project the new state into the read‑model, at
which point your `/escrows/**` queries reflect it.

---

## 6. Escrow transaction endpoints (build side)

Four **families**, each with a `v1` and `v2`. Pick the version you deploy with and stay on it for
that escrow's lifetime — the on‑chain contract is versioned.

| Family | Base path | When to use |
|---|---|---|
| Single‑release v1 | `/escrow/single-release/v1` | Legacy. One lump sum, released once. |
| Single‑release v2 | `/escrow/single-release/v2` | **Current** single‑payout escrow. Multi‑approver, `admin` role, dispute reasons. |
| Multi‑release v1 | `/escrow/multi-release/v1` | Legacy. Independently releasable milestones. |
| Multi‑release v2 | `/escrow/multi-release/v2` | **Current** milestone escrow. Batch ops, `admin` role, `manage-milestones`. |

**Prefer v2 for new integrations.** v1 is documented for completeness and existing escrows.

### 6.1 Shared response — `UnsignedTransactionResponse`

Returned by **every** `POST`/`PUT` build endpoint (HTTP **200**, not 201):

```json
{
  "unsignedXdr": "AAAAAgAAAAAtWsgedQ...AAAAAQAAAAA=",
  "txHash": "b1946ac92492d2347c6235b4d2611184a8d53f7a8e6e9b4f0c79a2b30e5c4f3a",
  "contractId": "CAAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQC526"
}
```

- `unsignedXdr` (string) — sign & submit this.
- `txHash` (string) — hash of the prepared tx (changes if re‑prepared).
- `contractId` (string | absent) — **deploy only**; the address the escrow will have.

### 6.2 Auth & headers for build endpoints

- Credential: `x-api-key` (or Bearer). **Deploy requires the `ESCROW_MANAGER` role**; all other
  actions require only a valid credential (the *contract* enforces who may sign each op on‑chain).
- **Deploy** endpoints also accept two optional attribution headers so a platform can tag the
  escrow to one of its end‑users:
  - `X-TW-Subject: <externalId>` — the platform's own id for the end‑user (optional).
  - `X-TW-Platform: <platformId>` — required **only** when a *wallet session* owns multiple
    platforms (api‑keys already carry their platform).

### 6.3 Addresses & amounts in bodies

- `G...` = Stellar account (Ed25519, 56 chars, checksum‑validated). `C...` = Soroban contract
  address (56 chars).
- `amount`, `distributions[].amount`, milestone `amount` = **human token units as JSON numbers**
  (`250` or `250.5`).
- `platformFee` = **percent integer** (`1` = 1%).
- `receiverMemo`, `milestoneIndex(es)`, `ledgersToExtend`, `approvalsTarget` = integers.

### 6.4 Single‑release — operations

Endpoint list (append to the base path). Bodies below note **v1 → v2** differences.

| Action | Method + path | Body (v2 unless noted) |
|---|---|---|
| **Deploy** | `POST /deploy` | see §6.4.1 |
| **Fund** | `POST /fund` | `{ contractId, signer, amount }` (same in v1/v2) |
| **Approve** | `POST /approve-milestones` (v2) · `POST /approve-milestone` (v1) | v2: `{ contractId, approver, milestoneIndexes: number[] }` · v1: `{ contractId, approver, milestoneIndex }` |
| **Approve & release** | `POST /approve-and-release-milestones` (**v2 only**) | `{ contractId, signer, milestoneIndexes: number[] }` (signer must be approver **and** release signer) |
| **Change milestone status** | `POST /change-milestone-status` | v2: `{ contractId, serviceProvider, updates: [{ index, newStatus, newEvidence? }] }` · v1: `{ contractId, serviceProvider, milestoneIndex, newStatus, newEvidence? }` |
| **Manage milestones** | `POST /manage-milestones` (**v2 only**) | `{ contractId, admin, newMilestones: MilestoneV2[], milestoneUpdates: [{ index, newDescription? }] }` |
| **Release funds** | `POST /release-funds` | v2: `{ contractId, releaseSigner }` · v1: `{ contractId, releaseSigner, trustlessWorkAddress }` |
| **Dispute** | `POST /dispute` | v2: `{ contractId, signer, reason }` · v1: `{ contractId, signer }` |
| **Resolve dispute** | `POST /resolve-dispute` | v2: `{ contractId, disputeResolver, distributions: [{ address, amount }] }` · v1: adds `trustlessWorkAddress` |
| **Update** | `PUT /update` | v2: `{ contractId, admin, escrow: {…full props…} }` · v1: signer is `platformAddress`, escrow props include `flags` |
| **Extend TTL** | `POST /extend-ttl` | v2: `{ contractId, admin, ledgersToExtend }` · v1: signer is `platformAddress` |
| **Withdraw remaining** | `POST /withdraw-remaining-funds` | v2: `{ contractId, disputeResolver, distributions: [...] }` · v1: adds `trustlessWorkAddress` |
| **Get escrow** | `GET /:contractId` | on‑chain snapshot (see §6.6) |
| **Get balances (batch)** | `GET /escrow-balances?addresses=C…&addresses=C…` | `≤ 20` addresses → `[{ address, balance, decimals }]` |

#### 6.4.1 Single‑release **v2** deploy body

```json
{
  "signer": "G...deployer",
  "engagementId": "ENG-12345",
  "title": "Website redesign — Q2 2026",
  "description": "Single-release v2 escrow.",
  "roles": {
    "approvers": ["G..."],
    "serviceProviders": ["G..."],
    "platform": "G...",
    "releaseSigners": ["G..."],
    "disputeResolvers": ["G..."],
    "receiver": "G...",
    "admin": "G...",
    "observers": []
  },
  "amount": 1000,
  "platformFee": 1,
  "milestones": [
    { "description": "Phase 1 — design", "status": "pending", "approvalsTarget": 1 }
  ],
  "trustline": { "contractId": "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA" },
  "receiverMemo": 0
}
```

- `roles` in **v2** are **arrays** (`approvers`, `serviceProviders`, `releaseSigners`,
  `disputeResolvers`, each 1–5, unique) plus scalars `platform`, `receiver`, `admin` (all distinct),
  and optional `observers[]`.
- `milestones` are **optional** in v2 (`0–50`), each `{ description, status?, approvalsTarget? }`
  (no `evidence` at deploy).
- `trustline`: give **either** `contractId` (C…) **or** both `symbol` + `address` (issuer G…).
- `receiverMemo` optional (u32); **omit or 0** and it won't appear in responses.

**Single‑release v1 deploy** differs: `roles` are 6 **scalar** addresses (`approver`,
`serviceProvider`, `platformAddress`, `releaseSigner`, `disputeResolver`, `receiver`); `milestones`
are **required** (1–50) and shaped `{ description, evidence? }`; no `admin`, no `receiverMemo`.

### 6.5 Multi‑release — operations

Same table as single‑release, with these multi‑release specifics:

- **Deploy** has **no top‑level `amount`** — the escrow total is the **sum of per‑milestone
  amounts**, and each milestone has its **own `receiver`**.
- v1 per‑milestone: `{ description, amount, receiver, evidence? }` (milestones **required**, 1–50).
- v2 per‑milestone: `{ description, amount, receiver, status?, approvalsTarget? }` (milestones
  **optional**; add later via `manage-milestones`).
- Action name differences: **release** is `release-milestone-funds` (v1, single index) →
  `release-funds` (v2, `milestoneIndexes[]`); **dispute** is `dispute-milestone` (v1) →
  `dispute-milestones` (v2, batch + required `reason`); **resolve** is `resolve-milestone-dispute`
  (v1) → `resolve-dispute` (v2, batch).

#### 6.5.1 Multi‑release **v2** deploy body

```json
{
  "signer": "G...deployer",
  "engagementId": "ENG-67890",
  "title": "Product launch — Q3 2026",
  "description": "Multi-release v2 escrow.",
  "roles": {
    "approvers": ["G..."],
    "serviceProviders": ["G..."],
    "platform": "G...",
    "releaseSigners": ["G..."],
    "disputeResolvers": ["G..."],
    "admin": "G...",
    "observers": []
  },
  "platformFee": 1,
  "milestones": [
    { "description": "Phase 1", "amount": 250, "receiver": "G...", "status": "pending", "approvalsTarget": 1 }
  ],
  "trustline": { "contractId": "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA" },
  "receiverMemo": 0
}
```

### 6.6 `GET /:contractId` — on‑chain snapshot (build side)

This reads **directly from the chain** (not the read‑model) and returns the raw escrow struct. Use
it when you need the authoritative on‑chain state of a single escrow you know the version of. Shape
differs by family/version — v2 single‑release example:

```json
{
  "type": "single-release",
  "contractId": "C...",
  "contractBaseId": "C...factory",
  "engagementId": "ENG-1", "title": "…", "description": "…",
  "amount": 1000, "balance": 500, "platformFee": 5, "receiverMemo": 0,
  "trustline": { "address": "C...", "contractId": "C...", "symbol": "USDC" },
  "roles": { "approvers": ["G..."], "serviceProviders": ["G..."], "platform": "G...",
             "releaseSigners": ["G..."], "disputeResolvers": ["G..."], "receiver": "G...",
             "admin": "G...", "observers": [] },
  "milestones": [ { "description": "…", "status": "pending", "evidence": "",
                    "approvals": { "target": 2, "approvalCount": 1, "approvedBy": ["G..."] } } ],
  "dispute": { "isDisputed": false, "reason": "", "resolved": false },
  "released": false
}
```

- v1 single‑release uses `id` (not `contractId`/`type`), scalar `roles`, milestone `approved:
  boolean`, and a `flags {disputed, released, resolved}` object.
- Multi‑release milestones carry per‑milestone `amount`, `receiver`, `approvals`/`approved`,
  `dispute`/`flags`, `released`.
- `GET /escrow-balances?addresses=…` (≤ 20 C… addresses) returns `[{ address, balance, decimals }]`
  with `balance` already in human units.

> **For dashboards and lists, prefer the read‑model (§8) over these per‑escrow on‑chain reads.** The
> read‑model is indexed, paginated, filterable, and version‑agnostic; the on‑chain `GET` is a
> single‑escrow, version‑specific fallback.

---

## 7. `POST /stellar/send-transaction` (submit side)

Submits a client‑signed XDR. Auth: any authenticated credential (authorization is enforced
on‑chain by the contract's `require_auth`).

**Request:**

```json
{ "signedXdr": "AAAA...base64 signed XDR..." }
```

**Response (HTTP 200) — three mutually exclusive shapes:**

1. **Plain call** (fund/release/approve/dispute/… against an existing escrow):
   ```json
   { "txHash": "a3f1…", "ledger": 12345678, "code": "STELLAR_TX_SUBMITTED", "message": "The escrow has been funded." }
   ```
2. **Factory deploy — success** (escrow deployed *and* indexed in time):
   ```json
   { "txHash": "a3f1…", "ledger": 12345678, "contractId": "C...", "escrow": { /* initial snapshot */ } }
   ```
3. **Factory deploy — indexer lagging** (tx is in the ledger, snapshot not ready yet):
   ```json
   { "txHash": "a3f1…", "ledger": 12345678, "code": "STELLAR_TX_SUBMITTED_INDEXER_LAGGING", "message": "…retry shortly." }
   ```

**Client branching:** if `code` is present, switch on it; otherwise the presence of `contractId`
means a successful deploy. On `STELLAR_TX_SUBMITTED_INDEXER_LAGGING`, keep the `txHash` and re‑query
shortly (`getTransaction(txHash)` client‑side, or poll `GET /escrows/:contractId` once you compute
the address). `code` is stable; `message` is free text.

---

## 8. Escrow read‑model (query side)

Base path `/escrows`. **Reads are open**: any authenticated `ESCROW_MANAGER` can read any escrow on
this deployment's network (escrow state is public on‑chain). Caller identity only affects
`scope=mine` segmentation on the listing. Amounts are **human decimal strings**.

### 8.1 `GET /escrows` — list (keyset paginated)

Query params (all optional, AND‑combined):

| param | type | default | notes |
|---|---|---|---|
| `scope` | `mine \| all` | `mine` | `mine` = escrows that concern the caller (verified‑wallet participation ∪ platform attribution). `all` = every escrow on the network. |
| `limit` | int 1–200 | 50 | page size |
| `cursor` | string | — | opaque, from previous `nextCursor` |
| `sort` | `createdAt \| updatedAt` | `updatedAt` | |
| `order` | `asc \| desc` | `desc` | |
| `createdAfter` / `createdBefore` | ISO date | — | range filter |
| `status` | string | — | exact lifecycle status |
| `contractType` | string | — | e.g. `single-release`, `multi-release` |
| `engagementId` | string | — | exact |
| `contractIds` | string[] | — | batch filter, repeat the param, 1–50 C… addresses |
| `participant` | G… | — | escrows where this wallet is an on‑chain participant |
| `role` | snake_case | — | combined with `participant`: "wallet X as approver" |
| `platformId` | numeric string | — | tenant‑scoped; caller must own it → else `403 ESCROW_FILTER_FORBIDDEN` |
| `subjectId` | numeric string | — | tenant‑scoped like `platformId` |

**Response envelope:**

```json
{ "data": [ EscrowSummary, … ], "hasMore": true, "nextCursor": "…|null" }
```

**`EscrowSummary`** (also nested as `escrow` inside detail/batch responses):

```json
{
  "network": "testnet",
  "contractId": "C...",
  "type": "single-release",
  "engagementId": "ENG-1",
  "status": "active",
  "totalAmount": null,
  "balance": "0.0001",
  "asset": { "name": "USDC", "address": "GBBD...issuer", "contractId": "CBIEL...token" },
  "lastLedgerSeq": "5512345",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-02T00:00:00.000Z",
  "snapshot": { /* full camelCased contract state, amounts in human units */ }
}
```

- `balance` — **projected** balance (`total deposited − total released`) from the deposit trail;
  always present (`"0"` when nothing deposited); eventually consistent with the on‑chain token
  balance. *(New — see the change log.)*
- `asset` — resolved trustline token `{ name, address, contractId }`; any unresolved field is
  `null`. *(New.)*
- `totalAmount` — multi‑release only (sum of milestone amounts); `null` for single‑release (the
  amount lives in `snapshot.amount`).
- **No** `createdByUserId` / `creatorAddress` — off‑chain authorship is **not** exposed on reads.

### 8.2 `GET /escrows/:contractId` — one escrow, full detail

```json
{
  "escrow": EscrowSummary,
  "events": [ EscrowEvent, … ],      // first 200 timeline events, chronological
  "deposits": [ EscrowDeposit, … ]   // fund trail, newest first
}
```

`EscrowEvent`: `{ kind, actor, ledgerSeq, txHash, ledgerClosedAt, topics[], payload }`.
`EscrowDeposit`: `{ fromAddress, asset, amount, txHash, ledgerSeq, ledgerClosedAt }` (`amount`
human units). 404 only if the contract is unknown on this network.

### 8.3 Batch reads (the ids **are** the request; 1–50 `contractIds`; unknown ids silently absent)

- `GET /escrows/details?contractIds=C…&contractIds=C…` → `{ "data": [ { escrow, deposits }, … ] }`
  (full state + fund trail; no timeline).
- `GET /escrows/financial?contractIds=…` → `{ "data": [ EscrowFinancial, … ] }`.
- `GET /escrows/milestones?contractIds=…` → `{ "data": [ { contractId, type, milestones[] }, … ] }`.

**`EscrowFinancial`** (the money view of one escrow):

```json
{
  "contractId": "C...", "type": "single-release", "asset": "USDC:GBBD...",
  "platformFee": "5", "totalAmount": "250.5",
  "totalDeposited": "250.5", "totalReleased": "0", "pendingRelease": "250.5",
  "nextRelease": { "milestoneIndex": null, "amount": "250.5" },
  "balance": "250.5"
}
```

### 8.4 `GET /escrows/:contractId/events` — timeline (keyset paginated)

Query: `limit` (1–200, default 50), `cursor`, `order` (`asc` default | `desc`). Response
`{ data: EscrowEvent[], hasMore, nextCursor }`.

### 8.5 `GET /escrows/:contractId/milestones` — milestone slice only

`{ contractId, type, milestones: [ … raw milestone entries … ] }` (shape depends on flavor).

---

## 9. GraphQL (`POST /graphql`)

Same auth (`x-api-key` / Bearer, `ESCROW_MANAGER`) and the **same use‑cases** as the REST reads —
what GraphQL adds is **field selection**: ask for exactly the fields you render, of one escrow or a
filtered page, in one round trip. Introspection is on outside PROD. SDL: `docs/schema.graphql`.

Queries: `escrows(filters…): EscrowPage`, `escrow(contractId): Escrow`, `ping`. The `Escrow` type
exposes `contractId, network, type, status, engagementId, totalAmount, balance, asset{…},
snapshot, milestones, lastLedgerSeq, createdAt, updatedAt` and the batched relations
`participants`, `deposits`, `financial{…}`, `events(…)`. Same `data/hasMore/nextCursor` envelope as
REST.

Example — a dashboard page:

```graphql
query Dashboard($cursor: String) {
  escrows(scope: mine, limit: 25, sort: updatedAt, order: desc, cursor: $cursor) {
    data {
      contractId type status balance
      asset { name contractId }
      financial { totalDeposited totalReleased pendingRelease balance }
    }
    hasMore nextCursor
  }
}
```

Example — one escrow detail:

```graphql
query Detail($id: String!) {
  escrow(contractId: $id) {
    contractId type status balance
    asset { name address contractId }
    milestones
    participants { address role }
    deposits { fromAddress amount ledgerClosedAt }
    events(limit: 50) { data { kind actor ledgerClosedAt } hasMore nextCursor }
  }
}
```

---

## 10. Accounts, tenancy & self‑service endpoints

### 10.1 Onboarding & sessions (`/auth/**`)

| Endpoint | Auth | Body | Returns |
|---|---|---|---|
| `POST /auth/bootstrap-admin` | public (5/min) | `{ adminSecret, email? }` | `GeneratedApiKey` (ADMIN), once |
| `POST /auth/register/challenge` | ADMIN/BACKOFFICE_ADMIN key | `{ address }` | `{ xdr, networkPassphrase, expiresAt }` |
| `POST /auth/register/verify` | ADMIN/BACKOFFICE_ADMIN key | `{ address, signedXdr, email? }` | `GeneratedApiKey` (ESCROW_MANAGER), once — **201** |
| `POST /auth/recover/challenge` | ADMIN/BACKOFFICE_ADMIN key | `{ address }` | challenge (404 if wallet not registered) |
| `POST /auth/recover/verify` | ADMIN/BACKOFFICE_ADMIN key | `{ address, signedXdr }` | `GeneratedApiKey`, once — **201** |
| `POST /auth/session/challenge` | ADMIN/BACKOFFICE_ADMIN key | `{ address }` | challenge (404 if not registered) |
| `POST /auth/session/verify` | ADMIN/BACKOFFICE_ADMIN key | `{ address, signedXdr }` | `{ token, expiresAt }` — the human's Bearer JWT |
| `POST /auth/session/logout` | any auth | — | `{ loggedOut: true }` (invalidates all the user's sessions) |

> Register/recover/session **challenge+verify** are *mediated by the backoffice's admin key* — the
> backoffice drives SEP‑10 on behalf of the wallet user, then hands the user their session token or
> api‑key.

### 10.2 Self api‑keys (`/users/me/api-keys`) — any authenticated caller

- `GET /users/me/api-keys?limit&cursor` → `{ data: ApiKey[], hasMore, nextCursor }`.
- `POST /users/me/api-keys` `{ description?, platformId? }` → `GeneratedApiKey` (once) — **201**.
- `POST /users/me/api-keys/:keyId/rotate` → `GeneratedApiKey` (once); revokes the old key.
- `PUT /users/me/api-keys/:keyId/revoke` → `ApiKey` (`active:false`); idempotent.

### 10.3 Self identity & wallets

- `GET /users/me` → `UserResponse { id, email, firstName, lastName, isActive, emailVerified, roles[], createdAt, updatedAt }`.
- `GET /users/me/wallets?limit&cursor` → `{ data: [{ address, verified, verifiedAt, createdAt }], hasMore, nextCursor }`.
- `DELETE /users/me/wallets/:address` → **204** (cannot remove the last verified wallet → 409).
- `POST /wallets/link/challenge` `{ address }` → challenge; `POST /wallets/link/verify`
  `{ address, signedXdr }` → `{ verified: true, address }` (adds another wallet to your account).

### 10.4 Platforms & Subjects (tenancy) — any authenticated caller, scoped to you

A **Platform** is your tenant; a **Subject** is one of that platform's end‑users (à la Stripe's
Customer). Attach subjects to escrows at deploy (`X-TW-Subject`/`X-TW-Platform`) to segment your
data, then filter reads by `platformId`/`subjectId`.

- `POST /platforms` `{ name }` → `Platform { id, name, ownerUserId, createdAt, updatedAt }` — **201**.
- `GET /users/me/platforms?limit&cursor` → paginated platforms.
- `PATCH /platforms/:platformId` `{ name }` → updated platform.
- `DELETE /platforms/:platformId` → **204** (soft archive; scoped api‑keys revoked, data preserved).
- `POST /platforms/:platformId/subjects` `{ walletAddress?, externalId?, label?, metadata? }` →
  `Subject { id, platformId, walletAddress, externalId, label, metadata, createdAt, updatedAt }` —
  **201** (upsert by `externalId`).
- `GET /platforms/:platformId/subjects?limit&cursor` → paginated subjects.
- `PATCH /platforms/:platformId/subjects/:subjectId` `{ … }` → updated (409 if `externalId` clashes).
- `DELETE /platforms/:platformId/subjects/:subjectId` → **204** (soft archive).

### 10.5 Admin (operator) endpoints — require `ADMIN`/`BACKOFFICE_ADMIN` api‑key

- **Users** `/admin/users`: `POST` (create), `GET` (list, offset), `GET /:userId`,
  `PATCH /:userId` (partial; `isActive` toggles soft‑delete), `PUT /:userId/roles` `{ roles[] }`,
  `DELETE /:userId` (soft‑delete → returns the updated `UserResponse`, not 204).
- **Api‑keys** `/admin/api-keys`: `POST` (create for any user), `POST /:keyId/rotate`,
  `PUT /:keyId/revoke`, `PUT /:keyId/roles`, `DELETE /:keyId` (**hard delete**),
  `POST /cleanup-expired` → `{ revoked, keyIds[] }`, `GET` (**offset** pagination:
  `{ data, pagination: { limit, offset, total } }`), `GET /user/:userId` (keyset), `GET /:keyId`.
- **Attributions** `/admin/attributions`: `POST /reconcile` → `{ attached, waiting }`,
  `POST /cleanup` → `{ expired }` (maintenance sweeps; also run on a scheduler).

### 10.6 Health

`GET /health` (public) → `200 { status:"ok", … }` or `503` when a dependency is down. Terminus
shape, not Problem Details.

---

## 11. Visual flows the backoffice should implement

Each screen/flow below maps to the internal endpoints. The **build → sign → submit** dance (§5) is
implied wherever a transaction is created.

### 11.1 Operator onboarding a client wallet

1. Screen: "Invite / onboard wallet" → input a `G…` address.
2. `POST /auth/register/challenge` → show "sign in your wallet".
3. User signs → `POST /auth/register/verify` → store the returned api‑key (or immediately convert
   to a session with the session flow). **Show the key once**, force the user to save it.
4. Fallback "recover access": `recover/challenge` → `recover/verify` mints a fresh key.

### 11.2 Human wallet login (for a self‑service backoffice)

1. "Connect wallet" (Stellar Wallets Kit) → get `G…`.
2. `POST /auth/session/challenge` → sign → `POST /auth/session/verify` → store `{ token }` as the
   Bearer for the session. Logout → `POST /auth/session/logout`.

### 11.3 Create escrow (wizard)

1. Multi‑step form: engagement/title/description → roles → amount & fee → milestones → trustline
   (pick USDC or a custom token contract).
2. On submit: `POST /escrow/<family>/<version>/deploy` (send `X-TW-Subject`/`X-TW-Platform` to
   attribute it) → get `{ unsignedXdr, contractId }`.
3. Wallet signs → `POST /stellar/send-transaction`. On success show the new `contractId`; on
   `…INDEXER_LAGGING` show "confirming…" and poll.
4. Redirect to the escrow detail screen (§11.6), which reads from the read‑model.

### 11.4 Fund escrow

1. On the escrow detail, "Fund" → amount.
2. `POST /escrow/<family>/<version>/fund` → sign → submit.
3. The `balance` on the read‑model rises once the Indexer records the deposit (poll / refetch).

### 11.5 Milestone lifecycle (multi‑release, and single‑release milestones)

Model the milestone state machine visually and gate each action by role:

- Service provider marks progress → `change-milestone-status`.
- Approver approves → `approve-milestones` (v2 batch). Show `approvals { target, approvalCount,
  approvedBy }` as a progress pill (multi‑approver in v2).
- Release signer releases → `release-funds` (v2) / `release-milestone-funds` (v1). v2 shortcut:
  `approve-and-release-milestones` when one signer holds both roles.
- Admin edits/adds milestones → `manage-milestones` (v2) / `update` (v1).

### 11.6 Escrow detail screen

- Header + money panel from `GET /escrows/:contractId` (or GraphQL `escrow`): `status`, `balance`,
  `asset`, and `financial { totalDeposited, totalReleased, pendingRelease, nextRelease }`.
- Milestones list from `snapshot.milestones` / `GET /escrows/:contractId/milestones`.
- Activity timeline from `GET /escrows/:contractId/events` (paginate with the cursor).
- Fund trail from `deposits`.
- Action buttons wired to the build endpoints, each visible only to the role that may sign it.

### 11.7 Portfolio / dashboard (listing)

- Table from `GET /escrows?scope=mine&sort=updatedAt&order=desc` (keyset paginate with
  `nextCursor`). Columns: contractId, type, status, `balance`, `asset.name`, updatedAt.
- Filters map 1:1 to query params (`status`, `contractType`, `engagementId`, `participant`+`role`,
  `platformId`, `subjectId`, date range). For multi‑platform accounts, a platform switcher →
  `platformId` filter.
- Prefer GraphQL here if you want fewer round trips / narrower payloads.

### 11.8 Tenancy admin (multi‑tenant backoffice)

- Platforms CRUD (`/platforms`, `/users/me/platforms`).
- Subjects CRUD per platform; attach a subject id at deploy via `X-TW-Subject`.
- Operator console (ADMIN keys): users & api‑keys management under `/admin/**`, attribution
  maintenance under `/admin/attributions/**`.

---

## 12. Data & lifecycle glossary

- **Roles (v2):** `approvers[]`, `serviceProviders[]`, `releaseSigners[]`, `disputeResolvers[]`,
  `platform`, `receiver`, `admin`, `observers[]`. **v1:** scalar `approver`, `serviceProvider`,
  `platformAddress`, `releaseSigner`, `disputeResolver`, `receiver` (no `admin`).
- **Escrow status** (read‑model, derived from snapshot): `active` → `disputed` → `released`
  (precedence disputed > released > active). `funded` is not a status — infer it from `balance` /
  deposits.
- **Milestone (v2)**: `{ description, status, evidence, approvals { target, approvalCount,
  approvedBy[] }, amount?(multi), receiver?(multi), dispute?, released? }`. **v1**: `approved:
  boolean` + `flags`.
- **Amounts:** reads = human decimal strings; build bodies = human numbers; `platformFee` = percent.
- **`balance` = projected** (deposited − released), eventually consistent — the authoritative
  balance is the on‑chain token balance (`GET /escrow-balances` reads it live from the chain).

---

## 13. Gotchas / do‑this‑not‑that

- **Eventual consistency:** never block the UI on the read‑model reflecting a just‑submitted tx.
  Handle `STELLAR_TX_SUBMITTED_INDEXER_LAGGING`; poll or optimistically update.
- **Sign locally:** the API never signs. Build → wallet signs `unsignedXdr` → submit `signedXdr`.
- **Version lock:** an escrow deployed with v2 is driven by v2 endpoints for life. Don't mix.
- **BigInt as string** and **amounts as strings** on reads — parse accordingly.
- **Reads are open** — do not build authorization around "can this user see this escrow"; they can
  see all. Use `scope=mine` for *segmentation*, and `platformId`/`subjectId` (tenant‑scoped) for
  filtering your own data.
- **Unknown fields → 400.** Send exactly the documented body.
- **Secrets once:** persist `apiKey` on receipt.
- **`receiverMemo`:** send `0`/omit if unused — it will not appear in deploy response snapshots.
```
