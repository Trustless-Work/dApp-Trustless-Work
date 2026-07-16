import { describe, expect, it } from "vitest";
import {
  formatBatchActionCountLabel,
  formatMilestoneNumbers,
  getEligibleMilestoneIndexes,
  type MilestoneActionEligibility,
} from "@/features/escrows/utils/milestone-batch.helper";

function createPolicy(
  overrides?: Partial<MilestoneActionEligibility>,
): MilestoneActionEligibility {
  return {
    canApproveMilestone: () => false,
    canChangeMilestoneStatus: () => false,
    canReleaseMilestone: () => false,
    canApproveAndReleaseMilestone: () => false,
    canDisputeMilestone: () => false,
    canResolveMilestoneDispute: () => false,
    ...overrides,
  };
}

describe("getEligibleMilestoneIndexes", () => {
  it("returns only indexes that pass the action predicate, sorted", () => {
    const policy = createPolicy({
      canApproveMilestone: (index) => index === 0 || index === 2,
    });

    expect(
      getEligibleMilestoneIndexes(policy, [2, 0, 1], "approve"),
    ).toEqual([0, 2]);
  });

  it("returns an empty array when none are eligible", () => {
    const policy = createPolicy();

    expect(
      getEligibleMilestoneIndexes(policy, [0, 1], "release"),
    ).toEqual([]);
  });

  it("filters change-status eligibility independently", () => {
    const policy = createPolicy({
      canChangeMilestoneStatus: (index) => index === 1,
    });

    expect(
      getEligibleMilestoneIndexes(policy, [0, 1, 2], "changeStatus"),
    ).toEqual([1]);
  });
});

describe("formatBatchActionCountLabel", () => {
  it("formats counts with bracket spacing", () => {
    expect(formatBatchActionCountLabel("Approve", 3)).toBe("Approve [ 3 ]");
  });
});

describe("formatMilestoneNumbers", () => {
  it("formats 1-based milestone labels", () => {
    expect(formatMilestoneNumbers([0, 2])).toBe("#1, #3");
  });

  it("returns an empty string for an empty list", () => {
    expect(formatMilestoneNumbers([])).toBe("");
  });
});
