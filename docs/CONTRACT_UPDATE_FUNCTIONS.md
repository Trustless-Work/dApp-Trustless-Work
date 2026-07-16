# `update_escrow` and `manage_milestones` — what can and can't be changed

This document goes deep on two specific functions of the V2 escrow contracts: **`update_escrow`** (edit the escrow's general properties) and **`manage_milestones`** (add new milestones or edit existing ones). It complements `CONTRACT_BUSINESS_RULES.md` (sections 1.11/1.12 and 2.11/2.12) and `CONTRACT_ROLES_REFERENCE.md`, with the field-by-field detail that's only summarized there.

Source verified directly against the code (not just the existing documentation):

- **Single-release** (`feat/single-release-v2`, commit `0571aaf`) — `contracts/escrow/src/core/validators/escrow.rs`, `contracts/escrow/src/core/escrow.rs`, `contracts/escrow/src/storage/types.rs`.
- **Multi-release** (`feat/multi-release-v2`, commit `82ca7eb`) — same files, same path, within this repo.

In both contracts, **the caller of both functions is always `roles.admin`**. No other role (approver, service_provider, release_signer, dispute_resolver, platform, receiver) can execute them.

---

## 1. `update_escrow`

Edits the escrow's general properties (everything except `milestones`). It receives the full `Escrow` object with the new values — it's not a partial patch, it's a replacement, but the contract ignores the fields it isn't supposed to touch (see below).

### 1.1 Signature

```rust
pub fn update_escrow(
    e: &Env,
    admin_address: Address,
    escrow_properties: Escrow,
) -> Result<Escrow, EscrowError>
```

### 1.2 Guards that always apply (with or without funds)

| # | Condition | Error if it fails |
|---|---|---|
| 1 | The escrow must already exist | `EscrowNotFound` |
| 2 | `admin_address` must be exactly the stored `roles.admin` | `OnlyAdminAddressExecuteThisFunction` |
| 3 | `roles.admin` cannot be changed from the existing value | `AdminAddressCannotBeChanged` |
| 4 | `roles.platform` cannot be changed from the existing value | `PlatformAddressCannotBeChanged` |
| 5 | Cannot edit while a dispute is open | `EscrowOpenedForDisputeResolution` |
| 6 | The new `roles` cannot violate role-list limits (max 5 per list, no duplicates) | `RoleLimitExceeded` / `DuplicateAddressInRole` |
| 7 | `dispute_resolvers` cannot overlap with `approvers`/`service_providers`/`release_signers` (and, in single-release, also not with `receiver`) | `DisputeResolverOverlapsWithOtherRole` |
| 8 | `admin` cannot overlap with `approvers`/`service_providers`/`release_signers`/`dispute_resolvers` (and, in single-release, `admin != receiver`) | `AdminAddressOverlapsWithOtherRole` |
| 9 | `engagement_id`/`title` ≤ 100 characters, `description` ≤ 500 | `StringTooLong` |
| 10 | `platform_fee ≤ 9900` and `platform_fee + 30 ≤ 10000` | `PlatformFeeTooHigh` |
| 11 | None of the required role lists (`approvers`, `service_providers`, `release_signers`, `dispute_resolvers`) can be empty | `ApproversListEmpty` / etc. |

> **Note (single-release):** it also validates `amount > 0` and that `released`/`dispute.is_disputed`/`dispute.resolved` arrive as `false` in the payload — they can't be manually set through this call (`FlagsMustBeFalse`).

### 1.3 Additional guard once the contract already has funds (`FundedAmount > 0`)

If the escrow has already received any deposit, these fields **must arrive identical** to the stored value — if they differ, the transaction fails with `EscrowPropertiesMismatch` and nothing changes:

- `engagement_id`
- `title`
- `description`
- `roles` (the whole object: admin, platform, approvers, service_providers, release_signers, dispute_resolvers, observers, and `receiver` in single-release)
- `platform_fee`
- `trustline`
- `receiver_memo`
- **Single-release only:** `amount`

In other words: **once funded, `update_escrow` has no practical effect on these fields** — the only way for the call to succeed is to send exactly what already exists.

### 1.4 A field this function never touches

`milestones` — regardless of what the payload carries in that field, the contract always overwrites it with the existing milestones before saving:

```rust
let mut escrow_to_save = escrow_properties;
escrow_to_save.milestones = existing_escrow.milestones.clone(); // core/escrow.rs:296-297 (multi) / equivalent in single
```

Touching milestones requires `manage_milestones` (section 2).

**Single-release additionally preserves `dispute` and `released`** from the existing escrow no matter what the payload contains (those two fields only live at the escrow level in single-release; in multi-release they live inside each milestone, so this doesn't apply there).

### 1.5 Summary table — can this property be changed?

| Property | Without funds | With funds (`FundedAmount > 0`) |
|---|---|---|
| `engagement_id` | ✅ | ❌ (must be identical) |
| `title` | ✅ | ❌ (must be identical) |
| `description` | ✅ | ❌ (must be identical) |
| `roles.admin` | ❌ never (immutable since initialization) | ❌ |
| `roles.platform` | ❌ never (immutable since initialization) | ❌ |
| `roles.approvers` / `service_providers` / `release_signers` / `dispute_resolvers` / `observers` | ✅ | ❌ (must be identical) |
| `roles.receiver` (single-release only) | ✅ | ❌ (must be identical) |
| `amount` (single-release only; doesn't exist in multi-release) | ✅ | ❌ (must be identical) |
| `platform_fee` | ✅ | ❌ (must be identical) |
| `trustline` | ✅ | ❌ (must be identical) |
| `receiver_memo` | ✅ | ❌ (must be identical) |
| `milestones` | ❌ never through this function (use `manage_milestones`) | ❌ never |
| `dispute` / `released` (single-release only) | ❌ never through this function (always preserved) | ❌ never |

### 1.6 Effect on success

Saves the new `Escrow` (with `milestones` — and in single-release, `dispute`/`released` — taken from the existing state), extends the storage TTL, and emits the `EscrowUpdated { engagement_id, admin }` event.

---

## 2. `manage_milestones`

Adds new milestones and/or edits the description (and, in multi-release, the amount) of existing milestones. It's the **only** function that can touch the `milestones` array.

### 2.1 Signature

```rust
pub fn manage_milestones(
    e: &Env,
    admin_address: Address,
    new_milestones: Vec<Milestone>,
    milestone_updates: Vec<MilestoneUpdate>,
) -> Result<Escrow, EscrowError>
```

`MilestoneUpdate` (the only thing editable on an existing milestone):

```rust
// Multi-release
pub struct MilestoneUpdate {
    pub index: u32,
    pub new_description: Option<String>,
    pub new_amount: Option<i128>,
}

// Single-release (no new_amount: the amount lives at the escrow level, not per milestone)
pub struct MilestoneUpdate {
    pub index: u32,
    pub new_description: Option<String>,
}
```

### 2.2 Guards common to both contracts

| # | Condition | Error if it fails |
|---|---|---|
| 1 | At least one of the two lists must carry content (`new_milestones` or `milestone_updates`) | `NoMilestoneDefined` |
| 2 | `admin_address` must be exactly `roles.admin` | `OnlyAdminAddressExecuteThisFunction` |
| 3 | Cannot run while a dispute is open | `EscrowOpenedForDisputeResolution` |
| 4 | Cannot run if the dispute was already resolved | `EscrowAlreadyResolved` |
| 5 | Cannot run if the escrow is already released (see per-contract nuance in 2.3) | `EscrowAlreadyReleased` |
| 6 | Every `index` in `milestone_updates` must exist | `InvalidMilestoneIndex` |

### 2.3 Key difference between contracts: when is it considered "already released"

- **Single-release**: the whole function is blocked if the **entire escrow** was already released (`existing_escrow.released == true`).
- **Multi-release**: it's blocked **only if all** existing milestones are already individually released. As long as at least one milestone remains unreleased, you can keep adding/editing milestones (even if others were already paid out).

The same nuance applies to "disputed"/"resolved": in single-release these are escrow-level flags; in multi-release, the condition is evaluated by iterating over `milestones[i].dispute` — it only takes **one single milestone** being in dispute or resolved to block the entire call.

### 2.4 Adding new milestones (`new_milestones`)

Conditions per new milestone:

| # | Condition | Error if it fails |
|---|---|---|
| 1 | `existing + new ≤ 50` | `TooManyMilestones` |
| 2 | `approvals.target > 0` | `TargetCannotBeZero` |
| 3 | `approvals.target ≤ current number of approvers` | `TargetExceedsApprovers` |
| 4 | `approvals.approval_count == 0` and `approved_by` empty (cannot arrive with prior approvals) | `FlagsMustBeFalse` |
| 5 | **Multi-release only:** `amount > 0` | `AmountCannotBeZero` |
| 6 | **Multi-release only:** `released == false` (can't be born already released) | `FlagsMustBeFalse` |

**There is no funding-related block on adding new milestones** — you can keep adding milestones even after the contract is already funded, in both contracts.

**Multi-release only:** each new milestone carries its own `receiver` (Address) and its own `amount` — there's no validation at this point that the `receiver` has a trustline set up (that's only resolved at release time). This doesn't apply to single-release: `receiver` and `amount` live at the escrow level, so a new milestone there only contributes `description`/`status`/`evidence`/`approvals`.

### 2.5 Editing existing milestones (`milestone_updates`)

This is the most important restriction and the one that most often causes confusion:

> **Editing an existing milestone is only allowed if the contract's balance is exactly 0** (`FundedAmount == 0`, i.e. the escrow *hasn't received any deposit yet*). As soon as there's any funding, `milestone_updates` is blocked with `MilestoneUpdateNotAllowedWithFunds` — no exceptions, regardless of which of the two fields you're trying to touch.

Fields that can be edited (only if `FundedAmount == 0`):

| Field | Editable via `milestone_updates` |
|---|---|
| `description` | ✅ (`new_description: Option<String>`; if `None` is sent, it stays unchanged) |
| `amount` (multi-release only) | ✅ (`new_amount: Option<i128>`) |
| `status` | ❌ — that's changed via `change_milestone_status`, not `manage_milestones` |
| `evidence` | ❌ — same, via `change_milestone_status` |
| `approvals.target` (**required approval count**) | ❌ — **there is no field for this at all in `MilestoneUpdate`**. The `target` is only set once, when the milestone is created (either at escrow initialization or as a new milestone via `new_milestones`). There is no way to raise or lower it on a milestone that already exists. |
| `approval_count` / `approved_by` | ❌ — only `approve_milestones` modifies these, never `manage_milestones` |
| `receiver` (multi-release only, per milestone) | ❌ — doesn't exist in `MilestoneUpdate`; a milestone's receiver is fixed from the moment it's created |
| `dispute` / `released` (multi-release only, per milestone) | ❌ — not touchable through this function |

### 2.6 Summary table — can this property be changed on an already-existing milestone?

| Milestone property | Before funding | After funding |
|---|---|---|
| `description` | ✅ | ❌ (`MilestoneUpdateNotAllowedWithFunds`) |
| `amount` (multi-release only) | ✅ | ❌ (`MilestoneUpdateNotAllowedWithFunds`) |
| `approvals.target` (**number of required approvals**) | ❌ — no field for this exists in either case | ❌ |
| `status` / `evidence` | ❌ (use `change_milestone_status`) | ❌ (use `change_milestone_status`) |
| `approval_count` / `approved_by` | ❌ (only `approve_milestones` touches these) | ❌ |
| `receiver` (multi-release only) | ❌ — not editable, before or after funding | ❌ |
| `dispute` / `released` (multi-release only) | ❌ | ❌ |

**Direct answer to "can you change the number of approvals of an already-created milestone":** no, not at any point, before or after funding. The approval `target` is only fixed when the milestone is created (initialization or via `new_milestones`) and is validated against the current number of `approvers`. If a different `target` is needed, the only path within the contract's rules is to add a new milestone with the correct `target` — there is no endpoint that edits the `target` of an existing one.

### 2.7 Effect on success

1. For each entry in `milestone_updates`: overwrites `description` (and `amount` in multi-release) of the milestone at that index, leaving the rest of its fields untouched.
2. For each entry in `new_milestones`: appends it to the end of the `milestones` array (`push_back`), exactly as it arrived in the payload.
3. Saves the updated escrow, extends the TTL, and emits `MilestonesManaged { engagement_id, admin, added_count, updated_count }`.

---

## 3. Notes for the frontend

- If the "edit milestone" form includes a selector for "required approvals" on an **already-existing** milestone, that control should be disabled (or shouldn't exist) — the contract will silently ignore that value, because `MilestoneUpdate` doesn't even have that field. The UI shouldn't promise something the contract doesn't offer.
- Before showing the "edit milestone" form (`milestone_updates`), the UI should check `FundedAmount` (via `get_escrow` + the contract's balance) and hide/disable that action if there's already any deposit — this avoids a transaction that's guaranteed to fail with `MilestoneUpdateNotAllowedWithFunds`.
- Adding new milestones remains available after funding, in both contracts — it's the correct path if a milestone with a different approval `target` than the existing ones is needed.
- In `update_escrow`, if the escrow already has funds, it's safer for the UI to simply not show as editable the fields from section 1.3 (title, description, roles, fee, trustline, memo, and `amount` in single-release) — sending any value different from the current one fails the entire transaction with `EscrowPropertiesMismatch`, not just that field.
- `update_escrow` is never the path to touch `milestones`, `dispute`, or `released` — that's always via `manage_milestones` (milestones) or the corresponding operational functions (`dispute_escrow`/`dispute_milestones`, `resolve_dispute`, `release_funds`).
