# Trustless Work Core — Official Backoffice Integration Guide

> How to connect a backoffice (or any application) to the **Trustless Work Core API**:
> the mental model, the credentials, every endpoint, the end-to-end flows, and a
> checklist of what an _official_ backoffice must implement.
>
> The contract that never lies is the live **Swagger UI** the core serves at
> **`/docs`** (OpenAPI JSON at **`/api`**). This guide explains the _how_ and the
> _why_; Swagger is the field-by-field truth for every request body.
>
> _(Versión en español: `BACKOFFICE-INTEGRATION-GUIDE.es.md`.)_

---

## 1. Who this is for

You are building an application — a backoffice, a dashboard, an integrator backend —
that talks to the Core API. After reading this you should be able to: authenticate,
provision accounts, let people sign in with their wallet, deploy and operate escrows,
and read them back, without guessing.

Two things to internalize before anything else:

1. **The blockchain is the source of truth.** The core never moves money and never
   decides who _may_ move money — the smart contract does, on-chain, via
   `require_auth`. The core builds unsigned transactions, reads on-chain state
   (through an Indexer), and manages _identity, tenancy and visibility_ around it.
2. **The core exposes almost no public endpoints.** Everything is authenticated.
   Sign-up and login are _mediated_ by the official backoffice — they are not open
   to the public internet.

---

## 2. The mental model — four actors and one note

| Actor                | What it is                                                                              | Identity / credential                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Account (User)**   | A person. Owns one or more Platforms.                                                   | Registers with a wallet (SEP-10). Authenticates with a **wallet session**. Has account-level **roles**. |
| **Platform**         | A _tenant_ — an app/integrator (e.g. "Grant Fox"). The unit of data isolation.          | Owned by an Account. Holds machine api-keys.                                                            |
| **Platform API-key** | The machine credential a platform's backend uses.                                       | `x-api-key`, role **`ESCROW_MANAGER`**, scoped to ONE platform.                                         |
| **Subject**          | A platform's _end-user_ — the person an escrow is created _for_ (à la Stripe Customer). | No TW account. Just a record: `externalId` + optional `walletAddress`.                                  |

And the **attribution note**: when a platform builds a deploy, the core records an
off-chain note — _"this deploy belongs to platform X, for subject Y"_ — keyed by the
transaction hash. When the Indexer later projects the escrow, the core reconciles the
note and stamps the escrow with `(platformId, subjectId)`. Best-effort metadata; the
chain remains the truth.

**Visibility** — an account sees an escrow if **any** of these hold:

- one of its **verified wallets participates** on-chain (signer, approver, …), or
- the escrow was **shared** with it (an access grant), or
- the escrow is **attributed to a platform it owns**.

Platforms additionally segment by end-user with the `subjectId` / `participant` filters.

---

## 3. How you connect — the BFF pattern and the two credentials

The core understands exactly **two** credentials, both resolving to the same internal
context `{ userId, platformId, roles }`:

| Credential                 | Header                          | Who uses it                         | Carries                                                              |
| -------------------------- | ------------------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| **API key** (machine)      | `x-api-key: <id>.<secret>`      | Platforms / operators / your server | The key's own roles + its `platformId` (if scoped)                   |
| **Wallet session** (human) | `Authorization: Bearer <token>` | A signed-in person                  | The account's roles (default `ESCROW_MANAGER`); `platformId` is null |

**Never put either credential in the browser.** The official backoffice is a
**Backend-for-Frontend (BFF)**: the browser calls your own same-origin `/api/*`
routes; your server attaches the credential and forwards to the core. Concretely you
need two server-side fetch helpers:

- `coreFetch(path, { bearer })` — forwards the signed-in user's **session token**.
  This is the door for everything a _user_ does (deploy, read escrows, manage their
  own platforms).
- `platformFetch(path)` — injects your server-only **operator api-key**
  (`BACKOFFICE_ADMIN`) for the _mediated_ flows (register / login / recover) and the
  admin endpoints. If the key is unset, fail loudly (`503 PLATFORM_CREDENTIAL_MISSING`)
  instead of sending a confusing bare 401.

> Rule of thumb: **user actions → session bearer; operator/admin actions → operator
> api-key.** A wallet session can do anything `ESCROW_MANAGER` can (including escrow
> deploys), but **cannot** call `ADMIN`/`BACKOFFICE_ADMIN` endpoints — those need the
> operator key.

---

## 4. Authentication in depth

### 4.1 API keys

- Format: `x-api-key: <id>.<secret>` (the `<id>` is a public base64url string; the
  `<secret>` is shown **once** at creation — store it then or never).
- Roles: `ADMIN`, `BACKOFFICE_ADMIN`, `ESCROW_MANAGER`. A key may hold several.
- Keys expire (default policy: 90 days for `ESCROW_MANAGER`, longer for operators).
  Rotate or revoke as needed.
- A platform key is **scoped** to one platform (`platformId`); deploys made with it
  are attributed to that platform.

### 4.2 Wallet sessions (humans)

A short-lived **Bearer token** (TTL ≈ 2h) the user gets by proving wallet ownership
via **SEP-10**. It carries the account's roles. `logout` bumps the account's token
"epoch", invalidating _all_ of its outstanding sessions at once.

### 4.3 The SEP-10 challenge → sign → verify dance

This single pattern powers **registration, login, recovery, and wallet-linking**.
Only the endpoints and the response differ.

```
1. POST /auth/<flow>/challenge   { address: "G..." }
   → { xdr, networkPassphrase, expiresAt }

2. The wallet signs `xdr` (a seq-0 ManageData transaction — it is NEVER submitted
   on-chain) using `networkPassphrase`. Use Freighter / Stellar Wallets Kit.

3. POST /auth/<flow>/verify      { address: "G...", signedXdr }
   → register/recover  → a new API key (GeneratedApiKeyResponse)
     session           → { token, expiresAt }   ← your session Bearer
     wallets/link      → { verified: true, address }
```

`<flow>` ∈ `register` · `session` · `recover` (and `wallets/link` under `/wallets`).
**The challenge/verify of register/session/recover are operator-mediated** — your BFF
must present the `BACKOFFICE_ADMIN` key (`platformFetch`). `wallets/link` is called by
an already-authenticated user (`coreFetch` with their bearer).

### 4.4 Roles, in one line each

- **`ADMIN` / `BACKOFFICE_ADMIN`** — the TW operator (you). Runs the official
  backoffice, mediates register/login/recover, provisions platforms, manages users &
  keys. Does **not** deploy escrows.
- **`ESCROW_MANAGER`** — deploys and operates escrows. Held by platform keys and, by
  default, by every user account.

Missing credential → **401** `AUTH_CREDENTIAL_MISSING`. Wrong role → **403**
`AUTH_INSUFFICIENT_ROLE` (the body's `extensions` tells you `requiredAnyOf` vs
`present`).

---

## 5. Standing up the official backoffice — what _you_ must build

A minimal but correct official backoffice is:

1. **A BFF** (server-side) — the only place that talks to the core. Holds the
   credentials, exposes same-origin routes to your browser app. Never leak keys or
   tokens to the client.
2. **Config** (server env):
   - `CORE_API_URL` — the deployed core (e.g. `https://…railway.app`).
   - `BACKOFFICE_ADMIN_API_KEY` — your operator key (role `ADMIN` or `BACKOFFICE_ADMIN`).
     Used by `platformFetch`. Keep it server-only.
   - `SESSION_SECRET` (≥32 bytes) — to sign the httpOnly cookie that stores the user's
     session token.
3. **Mediated auth routes** — `/auth/register/*`, `/auth/session/*`, `/auth/recover/*`
   proxied through `platformFetch` (operator key). On `session/verify`, store the
   returned `token` in an **httpOnly** cookie.
4. **An authenticated proxy** — a catch-all (`/api/core/[...path]`) that forwards the
   browser's calls to the core **with the user's session bearer**, server-side. Add
   CSRF protection (same-origin check) on state-changing methods.
5. **Wallet signing in the browser** — connect wallet, sign the SEP-10 challenge and
   sign deploy/operation XDRs. The signed XDR goes back through your BFF.
6. **Read-model handling** — consume the **keyset envelope** (`{ data, hasMore,
nextCursor }`) for lists; don't assume bare arrays.

---

## 6. The end-to-end flows

### 6.1 Bootstrap the very first admin (one-time)

```
POST /auth/bootstrap-admin   { adminSecret: "<ADMIN_BOOTSTRAP_SECRET>", email? }
→ GeneratedApiKeyResponse   (your first ADMIN key — save the `apiKey`)
```

Public but throttled (5 / 60s). Idempotent guard: it only ever mints the first admin.

### 6.2 Provision / register an account (operator-mediated)

Driven from the official backoffice with the operator key:

```
platformFetch POST /auth/register/challenge { address }     → { xdr, networkPassphrase }
  (user signs xdr)
platformFetch POST /auth/register/verify    { address, signedXdr, email? }
→ GeneratedApiKeyResponse   (the new account + its first ESCROW_MANAGER key,
                             plus a default Platform "My Platform")
```

### 6.3 Sign a user in (wallet session)

```
platformFetch POST /auth/session/challenge { address }     → { xdr, networkPassphrase }
  (user signs xdr)
platformFetch POST /auth/session/verify    { address, signedXdr }
→ { token, expiresAt }      ← store `token` in an httpOnly cookie
```

From now on, the BFF forwards that token as `Authorization: Bearer` (`coreFetch`).
`POST /auth/session/logout` (with the user's bearer) kills all their sessions.

### 6.4 Create a platform + issue a machine key (for an integrator)

```
coreFetch POST /platforms                 { name }                 → { id, … }
coreFetch POST /users/me/api-keys         { platformId: "<id>" }   → GeneratedApiKeyResponse
```

The self-service key is **always `ESCROW_MANAGER`** (self-service can never grant
elevated roles) and is scoped to that platform. The integrator's backend uses its
`apiKey` from here on.

### 6.5 Deploy an escrow (build → sign → submit)

```
1. POST /escrow/single-release/v2/deploy   (x-api-key: ESCROW_MANAGER, or a user bearer)
   Body: escrow properties (signer, engagementId, title, description, amount,
         platformFee, roles, milestones[], trustline). Optional header
         `X-TW-Subject: <externalId>` to attribute to a subject (platform keys only).
   → { unsignedXdr, txHash }

2. The `signer` wallet signs `unsignedXdr`.

3. POST /stellar/send-transaction   { signedXdr }
   → { txHash, ledger, contractId, escrow }            (deploy confirmed)
     or { code: "STELLAR_TX_SUBMITTED_INDEXER_LAGGING" } (submitted; read-model catching up)

4. The Indexer projects the escrow → it appears in GET /escrows shortly after, and
   the attribution note reconciles → the escrow is stamped (platformId, subjectId).
```

> Deploy is the **only** escrow endpoint gated to `ESCROW_MANAGER`. An `ADMIN`-only
> credential gets `403` here — by design: operator keys don't create escrows.

### 6.6 Operate an escrow (fund, approve, dispute, release, …)

Every escrow action is the **same shape** as deploy: `POST` the action with the
relevant **signer** (a `G…` address whose name matches the on-chain role) + params →
get `{ unsignedXdr, txHash }` → sign → `POST /stellar/send-transaction`. These are
**not** role-gated in the core; on-chain `require_auth(role)` is the real gate.

### 6.7 Read escrows (keyset pagination)

```
GET /escrows?limit=20&sort=updatedAt&order=desc&status=&participant=G…&subjectId=…
→ { data: EscrowSummary[], hasMore: bool, nextCursor: string|null }
   (next page: pass ?cursor=<nextCursor>; keep sort/order identical across pages)

GET /escrows/:escrowId              → full detail (state + participants + timeline + deposits)
GET /escrows/:escrowId/events?limit=50&order=asc&cursor=…   → paged timeline
```

`escrowId` is the read-model **UUID** (not the contract address). Detail returns the
same **404** whether the escrow doesn't exist _or_ isn't in your access set — existence
is never leaked.

### 6.8 Share access with another account (grants)

```
POST /escrows/access-grants          { granteeEmail, scope: "escrow", escrowId, expiresAt? }
POST /escrows/access-grants/revoke   { granteeEmail, scope, escrowId? }
```

`scope: "escrow"` shares one escrow (needs `escrowId`); `scope: "grantor"` shares all
of your escrows. Only the escrow's **creator** (or an `ADMIN`) may grant.

---

## 7. Endpoint reference (complete)

> No global prefix — paths are exactly as shown. Auth column: **Public** = none;
> **auth** = any valid credential; **role list** = `@ApiKeyRoles` (any-of).
> Bodies below are summaries; `/docs` (Swagger) has every field + constraint.

### Health

| Method | Path      | Auth   | Notes                                                     |
| ------ | --------- | ------ | --------------------------------------------------------- |
| GET    | `/health` | Public | `{ status, info, details }`; 503 if a dependency is down. |

### Auth

| Method | Path                       | Auth                    | Body → Response                                         |
| ------ | -------------------------- | ----------------------- | ------------------------------------------------------- |
| POST   | `/auth/bootstrap-admin`    | Public (5/60s)          | `{ adminSecret, email? }` → GeneratedApiKey             |
| POST   | `/auth/register/challenge` | ADMIN, BACKOFFICE_ADMIN | `{ address }` → `{ xdr, networkPassphrase, expiresAt }` |
| POST   | `/auth/register/verify`    | ADMIN, BACKOFFICE_ADMIN | `{ address, signedXdr, email? }` → GeneratedApiKey      |
| POST   | `/auth/session/challenge`  | ADMIN, BACKOFFICE_ADMIN | `{ address }` → challenge                               |
| POST   | `/auth/session/verify`     | ADMIN, BACKOFFICE_ADMIN | `{ address, signedXdr }` → `{ token, expiresAt }`       |
| POST   | `/auth/session/logout`     | auth                    | — → `{ loggedOut: true }` (revokes all sessions)        |
| POST   | `/auth/recover/challenge`  | ADMIN, BACKOFFICE_ADMIN | `{ address }` → challenge                               |
| POST   | `/auth/recover/verify`     | ADMIN, BACKOFFICE_ADMIN | `{ address, signedXdr }` → GeneratedApiKey              |

### API keys — self-service (`/users/me/api-keys`, any authenticated)

| Method | Path                               | Body → Response                                                             |
| ------ | ---------------------------------- | --------------------------------------------------------------------------- |
| GET    | `/users/me/api-keys`               | → `ApiKeyResponse[]`                                                        |
| POST   | `/users/me/api-keys`               | `{ description?, platformId? }` → GeneratedApiKey (always `ESCROW_MANAGER`) |
| POST   | `/users/me/api-keys/:keyId/rotate` | — → GeneratedApiKey (same roles, old revoked)                               |
| PUT    | `/users/me/api-keys/:keyId/revoke` | — → ApiKeyResponse                                                          |

### API keys — admin (`/admin/api-keys`, ADMIN/BACKOFFICE_ADMIN)

| Method | Path                              | Body → Response                                                                |
| ------ | --------------------------------- | ------------------------------------------------------------------------------ |
| POST   | `/admin/api-keys`                 | `{ userId, roles[], description?, expiresAt?, platformId? }` → GeneratedApiKey |
| POST   | `/admin/api-keys/:keyId/rotate`   | — → GeneratedApiKey (old stays active)                                         |
| PUT    | `/admin/api-keys/:keyId/revoke`   | — → ApiKeyResponse                                                             |
| PUT    | `/admin/api-keys/:keyId/roles`    | `{ roles[] }` → ApiKeyResponse                                                 |
| DELETE | `/admin/api-keys/:keyId`          | — → 204                                                                        |
| POST   | `/admin/api-keys/cleanup-expired` | — → `{ revoked, keyIds[] }`                                                    |
| GET    | `/admin/api-keys?limit=&offset=`  | → `{ data, pagination:{limit,offset,total} }` (offset-paginated)               |
| GET    | `/admin/api-keys/user/:userId`    | → `ApiKeyResponse[]`                                                           |
| GET    | `/admin/api-keys/:keyId`          | → ApiKeyResponse                                                               |

### Users

| Method | Path                         | Auth                    | Body → Response                                                               |
| ------ | ---------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| GET    | `/users/me`                  | auth                    | → UserResponse (the credential's account)                                     |
| POST   | `/admin/users`               | ADMIN, BACKOFFICE_ADMIN | `{ email?, firstName?, lastName? }` → UserResponse                            |
| GET    | `/admin/users`               | ADMIN, BACKOFFICE_ADMIN | → UserResponse[]                                                              |
| GET    | `/admin/users/:userId`       | ADMIN, BACKOFFICE_ADMIN | → UserResponse                                                                |
| PATCH  | `/admin/users/:userId`       | ADMIN, BACKOFFICE_ADMIN | `{ email?, firstName?, lastName?, isActive?, emailVerified? }` → UserResponse |
| PUT    | `/admin/users/:userId/roles` | ADMIN, BACKOFFICE_ADMIN | `{ roles[] }` → UserResponse                                                  |
| DELETE | `/admin/users/:userId`       | ADMIN, BACKOFFICE_ADMIN | — → UserResponse (soft-delete)                                                |

### Platforms & Subjects (any authenticated; ownership from the credential)

| Method | Path                              | Body → Response                                                                               |
| ------ | --------------------------------- | --------------------------------------------------------------------------------------------- |
| POST   | `/platforms`                      | `{ name }` → PlatformResponse                                                                 |
| GET    | `/users/me/platforms`             | → PlatformResponse[]                                                                          |
| POST   | `/platforms/:platformId/subjects` | `{ walletAddress?, externalId?, label?, metadata? }` → SubjectResponse (upsert by externalId) |
| GET    | `/platforms/:platformId/subjects` | → SubjectResponse[]                                                                           |

### Identity / wallets (any authenticated)

| Method | Path                         | Body → Response                                    |
| ------ | ---------------------------- | -------------------------------------------------- |
| POST   | `/wallets/link/challenge`    | `{ address }` → challenge                          |
| POST   | `/wallets/link/verify`       | `{ address, signedXdr }` → `{ verified, address }` |
| GET    | `/users/me/wallets`          | → UserWalletResponse[] (verified + pending)        |
| DELETE | `/users/me/wallets/:address` | — → 204 (409 if it's the last verified one)        |

### Escrow read-model (any authenticated; scoped to your access set)

| Method | Path                        | Notes                                                                                                                                                                                                  |
| ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/escrows`                  | Filters: `status, contractType, engagementId, participant(G…), subjectId, createdAfter, createdBefore`. Page: `limit(1–200), cursor, sort(createdAt\|updatedAt), order(asc\|desc)`. → keyset envelope. |
| GET    | `/escrows/:escrowId`        | UUID. → `{ escrow, participants[], events[], deposits[] }`. 404 = not found _or_ not yours.                                                                                                            |
| GET    | `/escrows/:escrowId/events` | `limit, cursor, order(asc default)`. → keyset envelope.                                                                                                                                                |

### Escrow access grants (any authenticated; creator-or-ADMIN enforced in use-case)

| Method | Path                            | Body → Response                                                           |
| ------ | ------------------------------- | ------------------------------------------------------------------------- |
| POST   | `/escrows/access-grants`        | `{ granteeEmail, scope(escrow\|grantor), escrowId?, expiresAt? }` → grant |
| POST   | `/escrows/access-grants/revoke` | `{ granteeEmail, scope, escrowId? }` → `{ revoked }`                      |

### Stellar bridge

| Method | Path                        | Auth | Body → Response                                                               |
| ------ | --------------------------- | ---- | ----------------------------------------------------------------------------- |
| POST   | `/stellar/send-transaction` | auth | `{ signedXdr }` → `{ txHash, ledger, contractId?, escrow?, code?, message? }` |

### Attribution admin

| Method | Path                          | Auth                    | Notes                                                              |
| ------ | ----------------------------- | ----------------------- | ------------------------------------------------------------------ |
| POST   | `/admin/attributions/cleanup` | ADMIN, BACKOFFICE_ADMIN | Expire orphan notes (deploys that never executed). → `{ expired }` |

### Escrow actions — builders (return `{ unsignedXdr, txHash }`)

Bases: `/escrow/single-release/v1`, `/escrow/single-release/v2`,
`/escrow/multi-release/v1`, `/escrow/multi-release/v2`. **Only `…/deploy` is gated to
`ESCROW_MANAGER`**; all other actions are any-authenticated (on-chain `require_auth`
is the real gate). All actions are `POST` except `…/update` which is **`PUT`**.

| Action (suffix)                                 | SR-v1             | SR-v2             | MR-v1                       | MR-v2                |
| ----------------------------------------------- | ----------------- | ----------------- | --------------------------- | -------------------- |
| `deploy` _(ESCROW_MANAGER)_                     | ✓                 | ✓                 | ✓                           | ✓                    |
| `fund`                                          | ✓                 | ✓                 | ✓                           | ✓                    |
| `approve-milestone` / `approve-milestones`      | ✓ (single)        | ✓ (array)         | ✓ (single)                  | ✓ (array)            |
| `approve-and-release-milestones`                | —                 | ✓                 | —                           | ✓                    |
| `change-milestone-status`                       | ✓                 | ✓ (updates[])     | ✓                           | ✓ (updates[])        |
| `dispute` / `dispute-milestone(s)`              | `dispute`         | `dispute`         | `dispute-milestone`         | `dispute-milestones` |
| `release-funds` / `release-milestone-funds`     | `release-funds`   | `release-funds`   | `release-milestone-funds`   | `release-funds`      |
| `resolve-dispute` / `resolve-milestone-dispute` | `resolve-dispute` | `resolve-dispute` | `resolve-milestone-dispute` | `resolve-dispute`    |
| `manage-milestones`                             | —                 | ✓                 | —                           | ✓                    |
| `extend-ttl`                                    | ✓                 | ✓                 | ✓                           | ✓                    |
| `update` _(PUT)_                                | ✓                 | ✓                 | ✓                           | ✓                    |
| `withdraw-remaining-funds`                      | ✓                 | ✓                 | ✓                           | ✓                    |
| `GET /escrow-balances?addresses=C…` _(read)_    | ✓                 | ✓                 | ✓                           | ✓                    |
| `GET /:contractId` _(read)_                     | ✓                 | ✓                 | ✓                           | ✓                    |

Builder body essentials: a **signer** field (G-address; name matches the required
on-chain role: `signer`, `approver`, `serviceProvider`, `releaseSigner`,
`disputeResolver`, `platformAddress`, `admin`) + `contractId` (the deployed escrow,
except `deploy`) + action params. Fee-collecting actions (`release`, `resolve-dispute`,
`withdraw`) also carry `trustlessWorkAddress` (one exception: MR-v2 `resolve-dispute`
does not). v2 differs from v1 mainly by **arrays** (multiple approvers/signers,
`milestoneIndexes[]`, `observers`). See `/docs` for the exact per-variant fields.

---

## 8. Conventions you must handle

### 8.1 Errors — RFC 9457 Problem Details

Every error is JSON of this shape:

```json
{
  "type": "https://docs.trustlesswork.com/errors/<code>",
  "title": "Forbidden",
  "status": 403,
  "code": "AUTH_INSUFFICIENT_ROLE",
  "detail": "API key does not have permission for this operation",
  "instance": "/escrow/single-release/v2/deploy",
  "traceId": "c2ca…",
  "extensions": { "requiredAnyOf": ["ESCROW_MANAGER"], "present": ["ADMIN"] }
}
```

Show `detail` to users, log `traceId` for support. Validation failures come as
**400/422** with the field messages under `extensions.errors` (an array). Status→code
map: 400 `BAD_REQUEST`, 401 `UNAUTHORIZED`, 403 `FORBIDDEN`, 404 `NOT_FOUND`,
409 `CONFLICT`, 422 `VALIDATION_ERROR`, 429 `TOO_MANY_REQUESTS`, 503 `SERVICE_UNAVAILABLE`,
5xx `INTERNAL_ERROR`. (Domain errors carry their own stable `code`, e.g.
`PLATFORM_NOT_FOUND`, `INVALID_CURSOR`, `ESCROW_NOT_FOUND`.)

### 8.2 Pagination

- **Read-model lists** (`/escrows`, `/escrows/:id/events`) use **keyset**: response
  `{ data, hasMore, nextCursor }`; pass `?cursor=<nextCursor>` for the next page and
  **keep `sort`/`order` constant** across pages. A bad cursor → `400 INVALID_CURSOR`.
- **Admin api-key list** uses **offset**: `{ data, pagination:{limit,offset,total} }`.

### 8.3 Strict validation

The global pipe is `whitelist + forbidNonWhitelisted + transform`: **unknown body
fields are rejected** (400), and you must send the declared types. Numeric bigints
travel as **strings** (`userId`, `platformId`, ids); money/`i128` amounts are **decimal
strings**.

### 8.4 Rate limiting

A global per-IP throttle (default **60 requests / window**; `bootstrap-admin` is
**5/60s**). Over the limit → **429 TOO_MANY_REQUESTS**. The core sits behind a proxy
and keys on the real client IP (`trust proxy` is configured) — your BFF's outbound IP
is what's limited, so don't hammer.

### 8.5 CORS & docs

CORS reflects the request origin (`credentials: false` — auth is in headers, not
cookies). Interactive contract: **`/docs`**; raw OpenAPI JSON: **`/api`** (can be
disabled with `SWAGGER_ENABLED=false`).

---

## 9. "Official backoffice" requirements checklist

- [ ] **BFF only** — the browser never sees `x-api-key` or the session token.
- [ ] `CORE_API_URL`, `BACKOFFICE_ADMIN_API_KEY` (operator key), `SESSION_SECRET`
      configured server-side.
- [ ] `platformFetch` (operator key) wired on **register/session/recover** + all
      `/admin/*` calls; returns a clear `503` when the operator key is missing.
- [ ] `coreFetch` (user bearer) wired for user actions; session token kept in an
      **httpOnly** cookie; CSRF (same-origin) check on mutations.
- [ ] **SEP-10** wallet signing in the browser (challenge + deploy/op XDRs).
- [ ] **Keyset envelope** parsed for all read-model lists (don't expect arrays).
- [ ] **Problem Details** surfaced to users (`detail`) and logged (`traceId`).
- [ ] Escrow flow implemented as **build → sign → `send-transaction`**, then read the
      escrow back from the read-model (eventually consistent — poll briefly).
- [ ] Deploys made with a **platform `ESCROW_MANAGER` key** (and `X-TW-Subject` when
      attributing) so the escrow is owned by the platform; user-session deploys are
      visible by participation but **not** attributed to a platform.

---

## 10. The source of truth

This guide is the map. The **live `/docs` (Swagger UI)** of the deployed core is the
territory — it always matches the running version field-for-field. When in doubt about
a body, a constraint, or a response shape, open `/docs`.
