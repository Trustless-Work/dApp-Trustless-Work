function formatApproverCount(count: number): string {
  return count === 1 ? "1 approver" : `${count} approvers`;
}

export function getApprovalsTargetHint(approversCount: number): string {
  if (approversCount === 0) {
    return "Add at least one approver in Roles (step 2).";
  }

  return `Maximum ${approversCount} — you configured ${formatApproverCount(approversCount)} in Roles.`;
}

export function getApprovalsTargetExceedsApproversMessage(
  approvalsTarget: number,
  approversCount: number,
): string {
  const requiredLabel =
    approvalsTarget === 1 ? "1 approval" : `${approvalsTarget} approvals`;

  return `This milestone requires ${requiredLabel}, but you only have ${formatApproverCount(approversCount)}. Lower this number or add more approvers in Roles.`;
}

export function getAdminOverlapMessage(conflictingRoleLabel: string): string {
  return `This admin address is already used as ${conflictingRoleLabel}. Use a distinct wallet for admin.`;
}
