# Escrow contract roles (V2) — what each one can do

This document describes, role by role, which actions each contract role can execute and which restrictions apply to that role itself (who can hold it, which other roles it can't overlap with, size limits, etc). It's the same business content as `CONTRACT_BUSINESS_RULES.md` but organized by role instead of by action, so the frontend can decide what to show/enable based on who's connected.

Covers both contracts:

- **Single-release** (`feat/single-release-v2`) — one receiver for the whole escrow.
- **Multi-release** (`feat/multi-release-v2`) — each milestone has its own receiver.

---

## 0. The roles that exist

Both contracts share the same list of roles, with one difference: in single-release the `receiver` is a single address for the whole escrow; in multi-release each milestone has its own `receiver`.

| Role | Count | Lives at |
|---|---|---|
| `admin` | 1 address | `roles.admin` |
| `approvers` | list, 1 to 5 | `roles.approvers` |
| `service_providers` | list, 1 to 5 | `roles.service_providers` |
| `release_signers` | list, 1 to 5 | `roles.release_signers` |
| `dispute_resolvers` | list, 1 to 5 | `roles.dispute_resolvers` |
| `platform` | 1 address | `roles.platform` |
| `observers` | list, 0 to 5 | `roles.observers` |
| `receiver` | single-release: 1 for the whole escrow. multi-release: 1 per milestone | `roles.receiver` (single) / `milestones[i].receiver` (multi) |

Rules that apply to **all** role lists (`approvers`, `service_providers`, `release_signers`, `dispute_resolvers`, `observers`):
- Maximum 5 members per list.
- No duplicate addresses allowed within the same list.

---

## 1. Single-Release Escrow

### `admin`

**Can:**
1. Initialize the escrow (`initialize_escrow`) — but note: the signer isn't `roles.admin` from the payload, it's the address that was fixed on the contract at deploy time (constructor). This is the only time that separate address is used.
2. Edit the escrow (`update_escrow`) — change title, description, amount, platform fee, trustline, etc.
3. Manage milestones (`manage_milestones`) — add new milestones and edit the description of existing ones.
4. Extend the contract's TTL (`extend_contract_ttl`).

**Cannot:**
- Approve milestones, release funds, dispute, resolve disputes, or change a milestone's status — none of those are the `admin`'s role.
- Change itself or change `platform` once the escrow is initialized (`AdminAddressCannotBeChanged`, `PlatformAddressCannotBeChanged`).
- Edit the escrow if a dispute is open, or if the escrow was already released (`manage_milestones` is blocked if `released == true`).
- Change the amount/description of existing milestones once the escrow has funds (`MilestoneUpdateNotAllowedWithFunds`) — can still keep adding new milestones.
- Change any escrow field (`engagement_id`, `title`, `description`, `roles`, `amount`, `platform_fee`, `trustline`, `receiver_memo`) once the escrow has funds.

**Restrictions on who can be `admin`:**
- Cannot also appear in `approvers`, `service_providers`, `release_signers`, or `dispute_resolvers`.
- Cannot be the same address as `receiver`.
- Immutable after the escrow is initialized.

---

### `approvers`

**Can:**
1. Approve milestones (`approve_milestones`), in batch (several indices at once).
2. Sign `approve_and_release_milestones` **if also** in `release_signers` (combined role).
3. Open a dispute (`dispute_escrow`) — approvers are on the list of who can dispute.

**Cannot:**
- Approve a milestone that already reached its approval `target` (`MilestoneHasAlreadyBeenApproved`).
- Approve the same milestone twice (`ApproverAlreadyApprovedMilestone`).
- The contract does **not** block approving a milestone that's already disputed or whose escrow was already released — `approve_milestones` itself allows it (the real block happens later, at `release_funds`). The UI should still disable the button for clarity.

**Restrictions on who can be an `approver`:**
- List of 1 to 5 addresses, no duplicates.
- Can be the same person as `service_provider`, `release_signer`, or `receiver` — no overlap restriction among those four.

---

### `service_providers`

**Can:**
1. Change a milestone's status/evidence (`change_milestone_status`), in batch.
2. Open a dispute (`dispute_escrow`).

**Cannot:**
- Approve milestones, release funds, or resolve disputes — not their role.
- `status` is free text (not an enum validated by the contract) and can be changed at any time, even if the milestone was already approved, released, or the escrow is in dispute — there is no state-based block on this function, only format checks (text length, valid index).

**Restrictions on who can be a `service_provider`:**
- List of 1 to 5 addresses, no duplicates.
- Can overlap with `approver`, `release_signer`, or `receiver`.

---

### `release_signers`

**Can:**
1. Release funds (`release_funds`) — releases **the whole escrow at once**, no partial release in single-release.
2. Sign `approve_and_release_milestones` **if also** in `approvers`.
3. Open a dispute (`dispute_escrow`).

**Cannot:**
- Release if the escrow was already released before (`EscrowAlreadyReleased`).
- Release if the dispute was already resolved (`EscrowAlreadyResolved`).
- Release if **not all** milestones are approved — it's all or nothing (`EscrowNotCompleted`).
- Release if the escrow is currently in dispute (`EscrowOpenedForDisputeResolution`).
- Choose how or where the receiver gets paid — that's decided solely by the receiver in advance (see the `receiver` section below). The release signer only decides *when*.

**Restrictions on who can be a `release_signer`:**
- List of 1 to 5 addresses, no duplicates.
- Can overlap with `approver`, `service_provider`, or `receiver`.

---

### `dispute_resolvers`

**Can:**
1. Resolve an open dispute (`resolve_dispute`), distributing the contract's balance among whichever addresses it decides (not necessarily the original receiver).
2. Withdraw remaining funds (`withdraw_remaining_funds`) — only after the escrow already reached a terminal state (released or dispute resolved).

**Cannot:**
- Open a dispute (`dispute_escrow`) — **explicitly excluded** from that function (`DisputeResolverCannotDisputeTheEscrow`), even if it holds another role.
- Resolve a dispute that isn't open (`EscrowNotInDispute`).
- Resolve by distributing a total different from the contract's current balance — it must be **exactly equal**, neither more nor less (`DistributionsMustEqualEscrowBalance`).
- Withdraw remaining funds if the escrow never went through a dispute, or if the escrow hasn't reached a terminal state yet (`EscrowNotFullyProcessed`).

**Restrictions on who can be a `dispute_resolver`:**
- List of 1 to 5 addresses, no duplicates.
- **Cannot overlap** with `approver`, `service_provider`, `release_signer`, or `receiver` (`DisputeResolverOverlapsWithOtherRole`) — the only role with this exclusivity restriction, besides `admin`.

---

### `receiver`

**Can:**
1. Open a dispute (`dispute_escrow`) — is on the list of who can dispute.
2. Receive the payout when the escrow releases (passive, requires no action on their part).

**Cannot:**
- Approve milestones, release funds, change status, or resolve disputes — has none of those powers.
- Change their own address — `receiver` is part of `roles`, and all of `roles` is frozen once the escrow has funds (via `update_escrow`).

**Restrictions on who can be `receiver`:**
- A single address for the whole escrow.
- Cannot be the same as `admin`.
- Can be the same as `approver`, `service_provider`, or `release_signer`.

---

### `platform`

**Can:**
1. Receive the platform fee on every release/dispute resolution.
2. Open a dispute (`dispute_escrow`) — is on the list of who can dispute.

**Cannot:**
- Execute any administrative action on the contract (isn't `admin`).
- Change itself once the escrow is initialized (`PlatformAddressCannotBeChanged`).

**Restrictions:**
- A single address.
- No overlap check with other roles for `platform` (unlike `admin` and `dispute_resolver`).

---

### `observers`

**Can:** nothing at the contract level. It's a read-only list with no on-chain authority — the contract never consults it to authorize anything.

**Restrictions:** optional list, 0 to 5 addresses. No overlap restrictions with other roles.

---

## 2. Multi-Release Escrow

Same roles, same count/duplicate restrictions. The real differences are in **what each one can do**, because here everything is per-milestone instead of per whole escrow.

### `admin`

**Can:**
1. Initialize the escrow (same detail: the constructor address signs, not `roles.admin` from the payload).
2. Edit the escrow (`update_escrow`).
3. Manage milestones (`manage_milestones`) — add and edit.
4. Extend the TTL (`extend_contract_ttl`).

**Cannot:**
- Same as single-release, with one difference: `manage_milestones` is only blocked if **all** milestones are already released (in single-release it's blocked if the whole escrow is released). As long as at least one milestone remains unreleased, the admin can keep adding/editing milestones.
- Same as single-release: cannot edit amounts/descriptions of existing milestones once the contract has funds.

**Restrictions on who can be `admin`:** same as single-release (no overlap with approvers/service_providers/release_signers/dispute_resolvers; immutable).

---

### `approvers`

**Can:**
1. Approve milestones (`approve_milestones`), in batch, over any combination of indices.
2. Sign `approve_and_release_milestones` if also in `release_signers` — here it does immediately release whichever milestones reach their `target` with that approval (unlike single-release, where it releases the *whole* escrow).
3. Dispute milestones (`dispute_milestones`), in batch.

**Cannot:** same restrictions as single-release (no approving twice, no approving an already-complete milestone). There's also no dispute/released block in `approve_milestones` — same as single-release, that check only happens at release.

**Restrictions on who can be an `approver`:** same as single-release.

---

### `service_providers`

**Can:**
1. Change milestone status (`change_milestone_status`), in batch.
2. Dispute milestones (`dispute_milestones`).

**Cannot:** same as single-release — `status` is free text, with no state-based block on the milestone.

**Restrictions:** same as single-release.

---

### `release_signers`

**Can:**
1. Release funds **per milestone** (`release_funds` with a list of indices) — unlike single-release, here **partial release is allowed**: it can release some milestones while others stay pending.
2. Sign `approve_and_release_milestones` if also in `approvers`.
3. Dispute milestones (`dispute_milestones`).

**Cannot:**
- Release a milestone that's in dispute, already has its dispute resolved, isn't approved, or was already released — these checks are **per milestone**, not per whole escrow.
- Same as single-release: doesn't control the destination or the fee of the receiver's cross-chain payout — that's approved by each milestone's receiver on their own.

**Restrictions:** same as single-release.

---

### `dispute_resolvers`

**Can:**
1. Resolve disputes **per milestone** (`resolve_dispute` with a list of indices + a distribution map).
2. Withdraw remaining funds (`withdraw_remaining_funds`) — but here the condition is stricter: it requires **all** milestones in the escrow to be in a terminal state (released or dispute resolved), not just the one(s) that were disputed.

**Cannot:**
- Dispute milestones (`dispute_milestones`) — explicitly excluded, same as single-release.
- Resolve a milestone that isn't in dispute, or that already has its dispute resolved.
- Unlike single-release (which requires exact equality), here the sum of the distributions can only be **at most** the sum of the indicated milestones' amounts — it doesn't have to be exact.

**Restrictions on who can be a `dispute_resolver`:** same as single-release (full exclusivity with the other operational roles).

---

### `receiver` (one per milestone)

**Can:**
1. Dispute milestones where they're the receiver (`dispute_milestones`) — each milestone's receiver is allowed to dispute the milestone(s) that belong to them (alongside approvers/service_providers/platform/release_signers).
2. Receive the payout for their milestone(s) when released.

**Cannot:**
- Touch the destination or configuration of a milestone that isn't theirs — each receiver only controls what corresponds to their own milestone index.
- Approve, release, or change the status of any milestone.

**Restrictions on who can be `receiver`:**
- Each milestone has its own `receiver`, independent of the escrow's other milestones.
- No overlap restriction with `approver`, `service_provider`, or `release_signer` — can coincide with those roles (same as single-release). There's no overlap check with `admin` at the individual-milestone level (unlike single-release, which does validate `admin != receiver`).

---

### `platform`

Same as single-release: receives the platform fee on every release/resolution, can dispute milestones, cannot change itself once initialized.

---

### `observers`

Same as single-release: no on-chain authority whatsoever.

---

## 3. Cross-cutting notes for the frontend

- **No role can see or choose another receiver's cross-chain destination** — not the admin, not the release signer, not the approver. That configuration is exclusive to each receiver, over their own payout.
- `admin` is the only role meant for escrow "management" (editing terms, adding milestones) — it doesn't participate in the operational approve/release/dispute flow.
- `dispute_resolver` is the most isolated role: it cannot overlap with any other operational role, and it's the only one explicitly excluded from being able to open a dispute itself.
- The UI should use the escrow's role list (`GET /escrow/.../v2/:contractId`) to decide which actions to show the connected wallet, comparing the connected address against each `roles` list (and, in multi-release, against `milestones[i].receiver` to know whether it can dispute/manage that particular milestone).
- The same wallet can appear in several roles at once (e.g. approver + service_provider + release_signer + receiver) as long as it doesn't violate the `admin` or `dispute_resolver` restrictions — the UI shouldn't assume each role is necessarily a different person.
