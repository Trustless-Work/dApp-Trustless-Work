import { describe, expect, it } from "vitest";
import type { MultiReleaseMilestone } from "@trustless-work/escrow";
import {
  getMilestoneDisputeReason,
  getMilestoneEvidence,
  getMilestoneFlags,
  getMilestoneStatusText,
  hasEscrowDispute,
  hasMilestoneDetailAttachments,
} from "@/features/escrows/utils/escrow-milestone.helper";

function buildMilestone(
  overrides?: Partial<MultiReleaseMilestone>,
): MultiReleaseMilestone {
  return {
    description: "Ship feature",
    amount: 100,
    receiver: "GRECEIVER",
    status: "in progress",
    approvals: {
      target: 1,
      approvalCount: 1,
      approvedBy: ["GAPPROVER"],
    },
    ...overrides,
  };
}

describe("getMilestoneStatusText", () => {
  it("returns the free-form status string", () => {
    expect(getMilestoneStatusText(buildMilestone())).toBe("in progress");
  });

  it("returns empty when status is missing", () => {
    expect(
      getMilestoneStatusText(buildMilestone({ status: undefined })),
    ).toBe("");
  });
});

describe("getMilestoneFlags", () => {
  it("keeps approved independent from status text", () => {
    expect(getMilestoneFlags(buildMilestone())).toEqual(["approved"]);
  });

  it("can return multiple multi-release flags together", () => {
    expect(
      getMilestoneFlags(
        buildMilestone({
          dispute: {
            isDisputed: true,
            reason: "late",
            resolved: true,
          },
          released: true,
        }),
      ),
    ).toEqual(["approved", "disputed", "resolved", "released"]);
  });

  it("returns empty when no lifecycle flags apply", () => {
    expect(
      getMilestoneFlags(
        buildMilestone({
          approvals: {
            target: 2,
            approvalCount: 0,
            approvedBy: [],
          },
        }),
      ),
    ).toEqual([]);
  });
});

describe("milestone detail attachments", () => {
  it("counts evidence without requiring dispute", () => {
    const milestone = buildMilestone({
      evidence: "https://example.com/proof.pdf",
    });

    expect(getMilestoneEvidence(milestone)).toBe(
      "https://example.com/proof.pdf",
    );
    expect(hasMilestoneDetailAttachments(milestone)).toBe(true);
  });

  it("ignores dispute reason unless includeDispute is set", () => {
    const milestone = buildMilestone({
      dispute: {
        isDisputed: true,
        reason: "Deliverable incomplete",
        resolved: false,
      },
    });

    expect(getMilestoneDisputeReason(milestone)).toBe(
      "Deliverable incomplete",
    );
    expect(hasMilestoneDetailAttachments(milestone)).toBe(false);
    expect(
      hasMilestoneDetailAttachments(milestone, { includeDispute: true }),
    ).toBe(true);
  });

  it("returns false when neither evidence nor dispute reason exist", () => {
    expect(hasMilestoneDetailAttachments(buildMilestone())).toBe(false);
  });
});

describe("hasEscrowDispute", () => {
  it("is false when dispute object exists but isDisputed is false", () => {
    expect(
      hasEscrowDispute({
        type: "single-release",
        contractId: "C1",
        signer: "",
        engagementId: "E",
        title: "T",
        description: "D",
        platformFee: 1,
        balance: 0,
        trustline: { address: "C" },
        roles: {
          approvers: [],
          serviceProviders: [],
          platform: "G1",
          releaseSigners: [],
          disputeResolvers: [],
          receiver: "G2",
          admin: "G3",
        },
        amount: 1,
        milestones: [],
        dispute: {
          isDisputed: false,
          reason: "",
          resolved: false,
        },
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      }),
    ).toBe(false);
  });

  it("is true when dispute is open", () => {
    expect(
      hasEscrowDispute({
        type: "single-release",
        contractId: "C1",
        signer: "",
        engagementId: "E",
        title: "T",
        description: "D",
        platformFee: 1,
        balance: 0,
        trustline: { address: "C" },
        roles: {
          approvers: [],
          serviceProviders: [],
          platform: "G1",
          releaseSigners: [],
          disputeResolvers: [],
          receiver: "G2",
          admin: "G3",
        },
        amount: 1,
        milestones: [],
        dispute: {
          isDisputed: true,
          reason: "late",
          resolved: false,
        },
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      }),
    ).toBe(true);
  });
});
