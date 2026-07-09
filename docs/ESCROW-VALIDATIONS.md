# Escrow Contract Business Rules (V2)

This document describes, action by action, what each V2 escrow contract allows and what it blocks. The goal is for the frontend team (or an AI given this file) to validate that the UI reflects exactly what the contract permits, without guessing rules.

It covers two distinct contracts, both in the `Trustless-Work-Smart-Escrow` repo:

- **Single-release** (`feat/single-release-v2`, commit `605bcfd`) — one receiver for the entire escrow, one release that pays everything at once.
- **Multi-release** (`feat/multi-release-v2`, commit `634e28b`) — each milestone has its own receiver and is released independently.

Both share structure (roles, approvals, disputes, CCTP) but differ in granularity: in single-release, "released"/"disputed" state lives at the escrow level; in multi-release, it lives on each milestone.

---

## 1. Single-Release Escrow

### 1.1 Data Model

- **Escrow**: `engagement_id`, `title`, `description`, `amount` (total amount, single), `platform_fee` (bps), `roles`, `milestones`, `dispute` (single, at escrow level), `released` (bool, at escrow level), `trustline`, `receiver_memo`.
- **Milestone**: `description`, `status` (free text, not an enum — the contract does not validate specific values), `evidence`, `approvals { target, approval_count, approved_by }`. Has no amount or receiver of its own — money and receiver are at the escrow level.
- **Roles**: `admin`, `platform` (single address), `approvers` (list), `service_providers` (list), `release_signers` (list), `dispute_resolvers` (list), `receiver` (single address), `observers` (list, not used as an actor in any validation).
- Each role list allows a maximum of 5 members and does not allow duplicate addresses within the same list.
- A milestone is considered **approved** when `target > 0 and approval_count >= target`.

### 1.2 Initialize the Escrow (`initialize_escrow`)

Who can call: only the `admin` address stored in the contract at deploy time (not the one in the payload, but the one fixed in the constructor).

1. Can only initialize if the escrow does not yet exist in this contract.
2. Can only initialize if `platform_fee <= 9900` (99%) and `platform_fee + 30 <= 10000` (30 is the fixed Trustless Work fee).
3. Can only initialize if `amount > 0`.
4. Can only initialize if `approvers`, `service_providers`, `release_signers`, and `dispute_resolvers` each have at least one member.
5. Can only initialize if no role list exceeds 5 members or has repeated addresses.
6. Can only initialize if no `dispute_resolver` also appears as approver, service_provider, release_signer, or receiver.
7. Can only initialize if `admin` is not repeated in approvers, service_providers, release_signers, or dispute_resolvers, and `admin != receiver`.
8. Can only initialize if there are 50 milestones or fewer.
9. Can only initialize if `released`, `dispute.is_disputed`, and `dispute.resolved` are all `false`.
10. If milestones are sent at initialization: none may have `approval_count > 0` or non-empty `approved_by`; each must have `approvals.target > 0` and `target <= number of approvers`.
11. Cannot initialize if `engagement_id`/`title` exceed 100 characters, `description` exceeds 500, or any milestone's `description`/`status`/`evidence` exceed 500/50/500 characters respectively.

Effect: stores the escrow, consumes the `admin`/`approved_wasm_hash` keys (this contract cannot be initialized again).

### 1.3 Fund the Escrow (`fund_escrow`)

Who can call: any address (no role restriction for funding).

1. Can only fund if `amount > 0`.
2. Can only fund if the `expected_escrow` sent by the client exactly matches the current escrow in the contract (protection against funding with stale data — the frontend must read fresh state right before funding).
3. Can only fund if the signer's token balance is greater than or equal to the amount.
4. There is no validation that funding does not exceed the escrow `amount` — over-funding or under-funding is allowed; it is just an accumulated counter.

### 1.4 Change Milestone Status (`change_milestone_status`)

Who can call: an address in `roles.service_providers`.

1. Can only call if the updates list is not empty and has 50 or fewer elements.
2. Can only call if the escrow has at least one milestone.
3. Can only call if each `new_status` is not empty and has 50 characters or fewer.
4. Can only call if `new_evidence` (if sent) has 500 characters or fewer.
5. Can only call if each `milestone_index` exists.
6. There is no restriction by milestone state: status can be changed even if the milestone was already approved, released, or the escrow is in dispute. Status is descriptive text only and does not block anything else.

### 1.5 Approve Milestones (`approve_milestones`)

Who can call: an address in `roles.approvers`.

1. Can only approve if the index list is not empty, has 50 or fewer items, and has no duplicate indices.
2. Can only approve if the escrow has at least one milestone.
3. Can only approve if each index exists.
4. Cannot approve a milestone that already reached its approval `target`.
5. Cannot approve twice with the same approver on the same milestone.
6. There is no validation against escrow dispute or release state at this step — technically, milestones can be approved on an already released or disputed escrow (the real block happens later in `release_funds`). The UI should disable the approve button if the escrow is already released or disputed, even though the contract allows it.

### 1.6 Release Funds (`release_funds`)

Who can call: an address in `roles.release_signers`. Releases **the entire escrow at once**; individual milestone release is not supported.

1. Can only release if the escrow has not been released before (`released == false`).
2. Can only release if the dispute has not been resolved before (`dispute.resolved == false`).
3. Can only release if the escrow has at least one milestone.
4. Can only release if **all** milestones are approved (no partial release).
5. Cannot release if the escrow is currently in dispute (`dispute.is_disputed == true`).
6. On execution, if the contract balance is less than the escrow `amount`, the transaction fails (even if prior validations passed).

Effect: sets `released = true`, calculates fees (platform fee + 30 bps Trustless Work fee), transfers the Trustless Work fee, platform fee, and net amount to `receiver` — unless the receiver has a registered `CrossChainDestination`, in which case the net amount is routed via CCTP instead of a normal Stellar transfer (see section 1.10).

### 1.7 Approve and Release in One Step (`approve_and_release_milestones`)

Who can call: an address that is **both** in `roles.approvers` and `roles.release_signers`.

1. Applies the same approval rules (section 1.5) on the given indices.
2. Then applies the same release rules (section 1.6) — since release requires **all** milestones to be approved, this action only releases funds if, after approving the indices in this call, the remaining milestones were already approved previously.

### 1.8 Open a Dispute (`dispute_escrow`)

Who can call: any address that is an approver, service_provider, `roles.platform`, release_signer, or `roles.receiver`. A `dispute_resolver` **cannot** open a dispute.

1. Can only dispute if `reason` has 500 characters or fewer.
2. Cannot dispute if the escrow is already in dispute.
3. Cannot dispute if the dispute was already resolved.

Effect: sets `dispute.is_disputed = true` and stores `reason`. It is a single state for the entire escrow, not per milestone.

### 1.9 Resolve the Dispute (`resolve_dispute`)

Who can call: an address in `roles.dispute_resolvers`.

1. Can only resolve if the escrow is currently in dispute (`dispute.is_disputed == true`).
2. Can only resolve if each amount in `distributions` is greater than zero.
3. Can only resolve if `distributions` has 50 entries or fewer.
4. Can only resolve if the sum of `distributions` is **exactly equal** to the contract's current balance (cannot be over or under).
5. Can only resolve if the contract balance is sufficient to cover the total.
6. The total to distribute must be greater than zero.

Effect: sets `dispute.resolved = true` and `dispute.is_disputed = false` (does not set `released = true` — these are independent states). Calculates fees on the total and distributes the remainder according to the `distributions` map decided by the dispute resolver (not necessarily all to the original receiver).

### 1.10 Withdraw Remaining Funds (`withdraw_remaining_funds`)

Who can call: an address in `roles.dispute_resolvers`.

1. Can only call if the escrow went through a dispute at some point (`dispute.is_disputed == true` or `dispute.resolved == true`).
2. Can only call if the escrow is fully resolved: `released == true` or `dispute.resolved == true`. In other words, this function sweeps what was left **after** the escrow reached a terminal state, not to release funds directly.
3. Each amount in `distributions` must be greater than zero, with 50 entries or fewer.
4. The total must be greater than zero and the contract must have sufficient balance.
5. Unlike `resolve_dispute`, the total here does **not** have to exactly equal the balance — partial withdrawal is allowed.

### 1.11 Edit the Escrow (`update_escrow`)

Who can call: the address that is `roles.admin`.

1. Same string, platform fee, role list, and overlap validations as initialization apply.
2. Cannot edit if the escrow does not exist.
3. Cannot change `admin` or `platform` once initialized.
4. Cannot edit if the escrow is currently in dispute.
5. New `released`, `dispute.is_disputed`, and `dispute.resolved` must be `false` (cannot be set manually via this path).
6. If the contract already has funds (`FundedAmount > 0`), cannot change: `engagement_id`, `title`, `description`, `roles`, `amount`, `platform_fee`, `trustline`, `receiver_memo` — once funded, this function basically has no effect on those fields.
7. `milestones` can never be changed via this function, funded or not — that is only done via `manage_milestones`. This function preserves `milestones`, `dispute`, and `released` from the existing escrow regardless of the payload.

### 1.12 Manage Milestones (`manage_milestones`)

Who can call: the address that is `roles.admin`.

1. At least one of the two lists (`new_milestones` or `milestone_updates`) must be sent; both cannot be empty.
2. Cannot call if the escrow is in dispute.
3. Cannot call if the escrow was already released.
4. Cannot call if the dispute was already resolved.
5. If adding new milestones: total (existing + new) cannot exceed 50; each needs `target > 0` and `target <= number of approvers`; none may have prior approvals.
6. If editing existing milestones (`milestone_updates`): **only allowed if the contract balance is 0** (not yet funded) — once funded, existing milestone descriptions cannot be edited, though new milestones can still be added.
7. Each index to update must exist.

### 1.13 Extend TTL (`extend_contract_ttl`)

Who can call: the address that is `roles.admin`. No additional business rules, only subject to Soroban's own limits.

### 1.14 Cross-Chain Destination (CCTP) — `set_cross_chain_destination` / `clear_cross_chain_destination` / `get_cross_chain_destination`

Who can call: only the address that is `roles.receiver` (the single receiver for the entire escrow — no `milestone_index`; applies to the whole escrow).

1. Can only register a destination if `destination_domain` is one of the valid CCTP domains: `0, 1, 2, 3, 5, 6, 7` (cannot use `27`, which is Stellar's own domain).
2. Can only register if `mint_recipient` (32 bytes) is not all zeros.
3. `clear_cross_chain_destination` reverts to normal Stellar payment on the next release.
4. The receiver can register or clear the destination at any time before release — there is no escrow state lock. Whatever is registered at the moment of `release_funds` is what is used.

---

## 2. Multi-Release Escrow

### 2.1 Data Model

- **Escrow**: `engagement_id`, `title`, `description`, `platform_fee`, `roles`, `milestones`, `trustline`, `receiver_memo`. Has no `amount`, `dispute`, or `released` at escrow level — all of that lives on each milestone.
- **Milestone**: `description`, `status` (free text), `evidence`, `approvals { target, approval_count, approved_by }`, **own `amount`**, **own `dispute`**, **own `released`**, **own `receiver`**. Each milestone is effectively a mini-escrow with its own amount and beneficiary.
- **Roles**: same as single-release, but **without** an escrow-level `receiver` — the receiver lives on each milestone.
- Same role limits (maximum 5 per list, no duplicates) and same "approved" definition (`target > 0 and approval_count >= target`).

### 2.2 Initialize the Escrow (`initialize_escrow`)

Who can call: the `admin` address fixed in the contract at deploy time.

1. Can only initialize if the escrow does not exist yet.
2. Can only initialize if `platform_fee <= 9900` and `platform_fee + 30 <= 10000`.
3. Can only initialize if `approvers`, `service_providers`, `release_signers`, and `dispute_resolvers` each have at least one member, not exceeding 5, with no duplicates.
4. Can only initialize if no `dispute_resolver` is repeated as approver, service_provider, or release_signer.
5. Can only initialize if `admin` is not repeated in any other role.
6. Can only initialize if there are 50 milestones or fewer.
7. Each milestone must have `amount > 0` and `approvals.target > 0`, with `target <= number of approvers`.
8. No milestone may have approvals, `released`, or `dispute` already set to true at initialization.
9. Text length limits are the same as single-release (100/100/500 for engagement_id/title/description, 500/50/500 for milestone description/status/evidence).

### 2.3 Fund the Escrow (`fund_escrow`)

Same as single-release: any address can fund, same three validations (amount > 0, `expected_escrow` matches current state, sufficient signer balance). There is also no cap against the sum of milestone amounts — it is a separate counter.

### 2.4 Change Milestone Status (`change_milestone_status`)

Same as single-release: only `service_providers`, same length and index validations, no restriction by that milestone's approval/release/dispute state.

### 2.5 Approve Milestones (`approve_milestones`)

Who can call: an address in `roles.approvers`. Accepts a batch of indices.

1. Same rules as single-release: non-empty list, maximum 50, no duplicates, each index must exist.
2. Cannot approve a milestone that already reached its `target`.
3. Cannot approve twice with the same approver on the same milestone.
4. Milestone dispute/release state is also not validated at this step — same as single-release, the UI should block "approve" on already released or disputed milestones even though the contract allows it.

### 2.6 Release Funds (`release_funds`)

Who can call: an address in `roles.release_signers`. **Unlike single-release, release is per milestone here**: receives a list of `milestone_indices` and releases only those, each to its own receiver.

1. Can only call if the index list is not empty, has no duplicates, and each index is in range.
2. For each milestone in the list: cannot release if that milestone is in dispute.
3. For each milestone: cannot release if that milestone's dispute was already resolved.
4. For each milestone: can only release if it is approved (reached its `target`).
5. For each milestone: cannot release if it was already released.
6. On execution, the sum of the requested milestone amounts must fit within the contract's current balance.

Effect: for each milestone, sets `released = true`, calculates fees, and transfers the net to that milestone's `receiver` — or routes via CCTP if that milestone has a registered `CrossChainDestination` (see 2.11). Because release is per milestone, an escrow can have some milestones released and others pending at the same time.

### 2.7 Approve and Release in One Step (`approve_and_release_milestones`)

Who can call: an address that is both in `approvers` and `release_signers`.

1. Applies approval rules (2.5) on the given indices.
2. Then applies release rules (2.6) on the same indices.
3. Since each milestone is released individually (unlike single-release), this does release funds immediately if those milestones' `target` is met by this approval — it does not depend on the rest of the escrow's milestones.

### 2.8 Open a Dispute (`dispute_milestones`)

Who can call: approver, service_provider, `roles.platform`, release_signer, or the `receiver` of any involved milestone. A `dispute_resolver` cannot.

1. Multiple milestones can be disputed at once (batch); the same `reason` applies to all indicated.
2. `reason` must have 500 characters or fewer.
3. Number of indices cannot exceed number of milestones, no duplicates, each in range.
4. Cannot dispute a milestone whose dispute was already resolved.
5. Cannot dispute a milestone that is already in dispute.
6. Cannot dispute a milestone that was already released.

### 2.9 Resolve Dispute (`resolve_dispute`)

Who can call: an address in `roles.dispute_resolvers`. Receives a list of milestones and a `distributions` map.

1. Each amount in `distributions` must be greater than zero, maximum 50 entries.
2. Milestone list cannot be empty, no duplicates, valid indices.
3. Each indicated milestone must currently be in dispute.
4. Each indicated milestone cannot have its dispute already resolved.
5. Sum of `distributions` cannot exceed the sum of the `amount` values of the indicated milestones — unlike single-release, this is a maximum cap, not exact equality.
6. Contract must have sufficient balance to cover the total.
7. Total must be greater than zero.

Effect: sets `resolved = true` and `is_disputed = false` on each indicated milestone (does not set `released`). Distributes the net according to the `distributions` map, at the dispute resolver's discretion.

### 2.10 Withdraw Remaining Funds (`withdraw_remaining_funds`)

Who can call: an address in `roles.dispute_resolvers`. Unlike `release_funds`/`resolve_dispute`, this function does not target specific milestones — it sweeps what remains in the contract in general.

1. At least one milestone in the escrow must have gone through a dispute (`is_disputed` or `resolved` on some milestone).
2. **All** milestones in the escrow must be in a terminal state: each must have `released == true` or `dispute.resolved == true`. If any milestone is still pending, this function cannot be used.
3. Each amount in `distributions` greater than zero, maximum 50 entries.
4. Total must be greater than zero and the contract must have sufficient balance.

### 2.11 Edit the Escrow (`update_escrow`)

Same as single-release: only `admin`, cannot change `admin` or `platform`, cannot edit if any milestone is in dispute, and if the contract already has funds, cannot change `engagement_id`/`title`/`description`/`roles`/`platform_fee`/`trustline`/`receiver_memo`. Milestones are never touched via this path, only via `manage_milestones`.

### 2.12 Manage Milestones (`manage_milestones`)

Almost the same as single-release, with one difference in the "already released" block:

1. At least one of the two lists (`new_milestones`/`milestone_updates`) must have content.
2. Cannot call if any milestone is in dispute.
3. Cannot call **only if all** existing milestones are already released (unlike single-release, which blocks when the entire escrow is released — here, as long as at least one milestone is unreleased, management can continue).
4. Cannot call if any milestone has its dispute already resolved.
5. New milestones: same rules as single-release (`amount > 0`, `target > 0` and within approver limit, no prior approvals), plus the 50 milestone total cap.
6. Edit existing milestones (`milestone_updates`): only if contract balance is 0, same as single-release.

### 2.13 Extend TTL (`extend_contract_ttl`)

Same as single-release: only `admin`, no additional business rules.

### 2.14 Cross-Chain Destination (CCTP) — `set_cross_chain_destination` / `clear_cross_chain_destination` / `get_cross_chain_destination`

Who can call: the address that is `receiver` **of that specific milestone** (unlike single-release, this receives `milestone_index` — each milestone has its own receiver and therefore its own independent cross-chain destination).

1. Only that milestone's receiver can register/clear its destination — another milestone's receiver in the same escrow cannot touch it.
2. Same domain validations (`0,1,2,3,5,6,7`, never `27`) and non-zero `mint_recipient`.
3. Can register/clear at any time before that specific milestone is released.

---

## 3. CCTP Interaction on Release (Applies to Both Contracts)

At release time, for each amount owed to a receiver, the contract checks whether that receiver (or that milestone, in multi-release) has a registered `CrossChainDestination`:

- **If a destination is registered**: the net amount is burned via CCTP (`deposit_for_burn`) to the indicated `destination_domain`/`mint_recipient`. The amount is truncated to 6 decimals for the burn (the Stellar token has 7); the remainder of the seventh decimal is sent as a normal Stellar transfer to the receiver so nothing is lost to rounding.
- **If no destination is registered**: normal Stellar transfer, as if CCTP did not exist.
- The receiver can change their mind at any time before release (register, clear, register again) — whatever is set at the exact moment of `release_funds` is what is used. There is no way to "lock in" the choice ahead of time.
- This routing logic **does not apply** to `resolve_dispute` or `withdraw_remaining_funds` — those two always pay via normal Stellar transfer according to the `distributions` map decided by the dispute resolver, regardless of any registered `CrossChainDestination`.
- Who decides how and where to get paid is always the receiver, never the release signer or admin — the release signer only decides _when_ to release, not _how_ the receiver gets paid. This is intentional: it is the security principle of the entire CCTP design (prevents whoever releases funds from redirecting payment).

---

## 4. Cross-Cutting UI Notes

- The escrow creation form should validate the 5-member cap per role and that no role list is empty before attempting `initialize_escrow` — avoids transactions that will definitely fail.
- `fund_escrow` requires sending the exact, current escrow state (`expected_escrow`) — the UI must re-read the escrow (`get_escrow`) right before building the funding transaction, not use cached state.
- Editing amount/description of an existing milestone (`manage_milestones` with `milestone_updates`) is blocked as soon as the escrow receives any funding, in both contracts. Adding new milestones can still be done even after funding.
- The contract allows approving milestones that are already in dispute or released (it does not block at `approve_milestones`), but release blocks it afterward. The UI should disable the approve button in those cases, even though the transaction would not technically fail.
- In single-release, release is all-or-nothing: cannot release while a single milestone remains unapproved. In multi-release, release is per milestone: milestones can be released one by one as they are approved, without waiting for the others.
- The cross-chain destination UI should use `roles.receiver` (single-release) or `milestones[i].receiver` (multi-release) to decide who sees the "how I want to get paid" button — no one else has permission to touch that configuration, not even admin.
- CCTP domain `27` is never a valid destination (it is Stellar's own domain); valid domains today are `0` (Ethereum), `1` (Avalanche), `2` (Optimism), `3` (Arbitrum), `5` (Solana), `6` (Base), `7` (Polygon).
