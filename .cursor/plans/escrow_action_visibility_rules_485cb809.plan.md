---
name: Escrow action visibility rules
overview: Add conditional visibility to escrow/milestone actions based on balance and lifecycle state, and implement the missing "Manage milestones" action using the SDK's useManageMilestones hook.
todos:
  - id: visibility-helper
    content: Create escrow-action-visibility.helper.ts with pure condition functions for escrow-level and milestone-level actions
    status: pending
  - id: actions-hook
    content: Add manageMilestones (useManageMilestones) to useEscrowActions and return it
    status: pending
  - id: manage-milestones-action
    content: Create ManageMilestonesAction.tsx dialog (edit descriptions/amounts + add new milestones) using manageMilestones
    status: pending
  - id: gate-general-actions
    content: Gate escrow-level actions in EscrowGeneralActions.tsx and hide empty groups; add ManageMilestonesAction
    status: pending
  - id: gate-milestone-menu
    content: Gate milestone actions in MilestoneActionsMenu.tsx, drop empty separators, disable trigger when no actions
    status: pending
isProject: false
---

# Escrow Action Visibility Rules

Restrict which actions render based on escrow `balance` and lifecycle flags, and add the missing **Manage milestones** action. Actions that don't meet their condition are **hidden** (not disabled), matching the request ("aparezcan o no"). Empty action groups/menus collapse away.

## Data model (from SDK `types.entity.ts`)

- `escrow.balance: number` — 0 until funded.
- Single-release: `escrow.released?`, `escrow.dispute?.{ isDisputed, resolved }`.
- Multi-release: per milestone `released?`, `dispute?.{ isDisputed, resolved }`, `approvals?.{ approvalCount, target }`, `approvalsTarget?`.
- Existing helpers in [escrow-display.helper.ts](src/features/escrows/utils/escrow-display.helper.ts): `isEscrowReleased`, `isEscrowDisputed`, `getMilestoneDisplayStatus`.

## 1. Visibility helper (new)

Create `src/features/escrows/utils/escrow-action-visibility.helper.ts` with pure functions (named `function` exports):

- `canFundEscrow(escrow)` → always `true`.
- `canUpdateEscrow(escrow)` → `escrow.balance <= 0`.
- `canManageMilestones(escrow)` → `escrow.balance <= 0`.
- `canWithdrawRemainingFunds(escrow)` → single-release only: `balance > 0 && (isEscrowReleased(escrow) || escrow.dispute?.resolved === true)`.
- `canReleaseEscrow(escrow)` → single: `balance > 0 && !released && !disputed`.
- `canDisputeEscrow(escrow)` → single: `balance > 0 && !disputed && !released`.
- `canResolveEscrowDispute(escrow)` → single: `disputed && !resolved`.
- Milestone-scoped (multi): `canApproveMilestone`, `canChangeMilestoneStatus` (always `true`), `canApproveAndReleaseMilestone`, `canReleaseMilestone`, `canDisputeMilestone`, `canResolveMilestoneDispute`, each reading `escrow.milestones[index]` flags + `escrow.balance`.
- `canApproveMilestone` rule: milestone not released and not already fully approved (`approvalCount < target`).

## 2. Extend actions hook

In [useEscrowActions.ts](src/features/escrows/hooks/useEscrowActions.ts):

- Import `useManageMilestones` and payload types `ManageSingleReleaseMilestonesPayload` / `ManageMultiReleaseMilestonesPayload` from `@trustless-work/escrow`.
- Add a `manageMilestones` callback via `runAction(() => signAndSend(() => manageMilestones(payload, escrowType)), "Milestones updated")` and return it (same pattern as `update`).

## 3. Manage milestones action (new)

Create `src/features/escrows/ui/actions/ManageMilestonesAction.tsx`:

- Dialog with a field array (local state rows, like [ResolveDisputeAction.tsx](src/features/escrows/ui/actions/ResolveDisputeAction.tsx)): edit existing milestone descriptions (+ `amount` for multi via `milestoneUpdates`) and append `newMilestones`.
- Build `ManageSingleReleaseMilestonesPayload` / `ManageMultiReleaseMilestonesPayload` (`contractId`, `admin: escrow.roles.admin`, `newMilestones[]`, `milestoneUpdates[]`) and call `manageMilestones`.
- Uses `ActionTrigger` for consistent trigger rendering.

## 4. Gate escrow-level actions

In [EscrowGeneralActions.tsx](src/features/escrows/ui/detail/EscrowGeneralActions.tsx):

- Compute visibility booleans from the helper.
- Wrap each action: `FundEscrowAction` (always), `WithdrawFundsAction` (only `canWithdrawRemainingFunds`, single-release), `UpdateEscrowAction` (`canUpdateEscrow`), new `ManageMilestonesAction` (`canManageMilestones`), and single-release `ReleaseFundsAction`/`StartDisputeAction`/`ResolveDisputeAction` per their conditions.
- Only render a group when it has at least one visible action; hide groups that become empty.

## 5. Gate milestone-level actions

In [MilestoneActionsMenu.tsx](src/features/escrows/ui/detail/MilestoneActionsMenu.tsx):

- Compute per-milestone booleans and conditionally render `ApproveMilestoneAction`, `ChangeMilestoneStatusAction` (always), and multi actions `ApproveAndReleaseAction`, `ReleaseFundsAction`, `StartDisputeAction`, `ResolveDisputeAction`.
- Drop separators when adjacent sections are empty; if no actions are available, disable the trigger button.

## Notes

- Individual action components keep their internal guards; visibility is layered on top so callers stay declarative.
- `Withdraw` stays single-release only (SDK `SingleReleaseWithdrawRemainingFundsPayload`); it will no longer show for multi-release.
