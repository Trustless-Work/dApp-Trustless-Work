import { describe, expect, it } from "vitest";
import { createManageMilestonesSchema } from "@/features/escrows/schemas/escrow-action.schemas";
import { getApprovalsTargetExceedsApproversMessage } from "@/features/escrows/utils/create-escrow.helper";

describe("createManageMilestonesSchema", () => {
  it("rejects new milestones when approvalsTarget exceeds approversCount", () => {
    const schema = createManageMilestonesSchema({
      isMulti: false,
      approversCount: 1,
    });

    const result = schema.safeParse({
      existingMilestones: [{ index: 0, description: "Keep", amount: 0 }],
      newMilestones: [
        {
          description: "Extra work",
          approvalsTarget: 2,
          amount: 0,
          receiver: "",
        },
      ],
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["newMilestones", 0, "approvalsTarget"],
          message: getApprovalsTargetExceedsApproversMessage(2, 1),
        }),
      ]),
    );
  });

  it("accepts new milestones when approvalsTarget is within approversCount", () => {
    const schema = createManageMilestonesSchema({
      isMulti: true,
      approversCount: 2,
    });

    const result = schema.safeParse({
      existingMilestones: [{ index: 0, description: "Keep", amount: 100 }],
      newMilestones: [
        {
          description: "Extra work",
          approvalsTarget: 2,
          amount: 50,
          receiver: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("requires receiver and amount for multi-release new milestones", () => {
    const schema = createManageMilestonesSchema({
      isMulti: true,
      approversCount: 2,
    });

    const result = schema.safeParse({
      existingMilestones: [],
      newMilestones: [
        {
          description: "Extra work",
          approvalsTarget: 1,
          amount: 0,
          receiver: "",
        },
      ],
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ["newMilestones", 0, "amount"] }),
        expect.objectContaining({ path: ["newMilestones", 0, "receiver"] }),
      ]),
    );
  });
});
