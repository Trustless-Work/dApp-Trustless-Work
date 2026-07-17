export type MilestoneBatchAction =
  | "approve"
  | "changeStatus"
  | "release"
  | "approveAndRelease"
  | "dispute"
  | "resolve";

export type MilestoneActionEligibility = {
  canApproveMilestone(milestoneIndex: number): boolean;
  canChangeMilestoneStatus(milestoneIndex: number): boolean;
  canReleaseMilestone(milestoneIndex: number): boolean;
  canApproveAndReleaseMilestone(milestoneIndex: number): boolean;
  canDisputeMilestone(milestoneIndex: number): boolean;
  canResolveMilestoneDispute(milestoneIndex: number): boolean;
};

const ELIGIBILITY_PREDICATES: Record<
  MilestoneBatchAction,
  (
    policy: MilestoneActionEligibility,
    milestoneIndex: number,
  ) => boolean
> = {
  approve: (policy, index) => policy.canApproveMilestone(index),
  changeStatus: (policy, index) => policy.canChangeMilestoneStatus(index),
  release: (policy, index) => policy.canReleaseMilestone(index),
  approveAndRelease: (policy, index) =>
    policy.canApproveAndReleaseMilestone(index),
  dispute: (policy, index) => policy.canDisputeMilestone(index),
  resolve: (policy, index) => policy.canResolveMilestoneDispute(index),
};

export function getEligibleMilestoneIndexes(
  policy: MilestoneActionEligibility,
  selectedIndexes: readonly number[],
  action: MilestoneBatchAction,
): number[] {
  const isEligible = ELIGIBILITY_PREDICATES[action];

  return selectedIndexes
    .filter((index) => isEligible(policy, index))
    .slice()
    .sort((left, right) => left - right);
}

export function formatMilestoneNumbers(indexes: readonly number[]): string {
  return indexes.map((index) => `#${index + 1}`).join(", ");
}

export function formatBatchActionCountLabel(
  label: string,
  count: number,
): string {
  return `${label} [ ${count} ]`;
}
