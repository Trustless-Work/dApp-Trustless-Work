import { describe, expect, it } from "vitest";
import { createEscrowActionPolicy } from "@/features/escrows/domain/create-escrow-action-policy";
import type {
  StoredMultiReleaseEscrow,
  StoredSingleReleaseEscrow,
} from "@/features/escrows/types/escrow.types";

const ADMIN = "GADMIN";
const APPROVER = "GAPPROVER";
const SERVICE_PROVIDER = "GSERVICE";
const RELEASE_SIGNER = "GRELEASE";
const DISPUTE_RESOLVER = "GDISPUTE";
const PLATFORM = "GPLATFORM";
const RECEIVER = "GRECEIVER";
const OTHER = "GOTHER";
const DUAL = "GDUAL";

function approvedMilestone() {
  return {
    description: "Milestone 1",
    approvalsTarget: 1,
    approvals: {
      target: 1,
      approvalCount: 1,
      approvedBy: [APPROVER],
    },
  };
}

function pendingMilestone() {
  return {
    description: "Milestone 1",
    approvalsTarget: 1,
    approvals: {
      target: 1,
      approvalCount: 0,
      approvedBy: [],
    },
  };
}

function createSingleEscrow(
  overrides?: Partial<StoredSingleReleaseEscrow>,
): StoredSingleReleaseEscrow {
  return {
    type: "single-release",
    contractId: "CDCONTRACT",
    signer: ADMIN,
    engagementId: "eng-1",
    title: "Test escrow",
    description: "Description",
    platformFee: 1,
    balance: 100,
    amount: 100,
    trustline: {
      address: "GUSDC",
      symbol: "USDC",
      contractId: "CUSDC",
    },
    roles: {
      admin: ADMIN,
      approvers: [APPROVER],
      serviceProviders: [SERVICE_PROVIDER],
      releaseSigners: [RELEASE_SIGNER],
      disputeResolvers: [DISPUTE_RESOLVER],
      platform: PLATFORM,
      receiver: RECEIVER,
    },
    milestones: [approvedMilestone()],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function createMultiEscrow(
  overrides?: Partial<StoredMultiReleaseEscrow>,
): StoredMultiReleaseEscrow {
  return {
    type: "multi-release",
    contractId: "CDCONTRACT",
    signer: ADMIN,
    engagementId: "eng-1",
    title: "Test multi escrow",
    description: "Description",
    platformFee: 1,
    balance: 100,
    trustline: {
      address: "GUSDC",
      symbol: "USDC",
      contractId: "CUSDC",
    },
    roles: {
      admin: ADMIN,
      approvers: [APPROVER],
      serviceProviders: [SERVICE_PROVIDER],
      releaseSigners: [RELEASE_SIGNER],
      disputeResolvers: [DISPUTE_RESOLVER],
      platform: PLATFORM,
    },
    milestones: [
      {
        ...approvedMilestone(),
        amount: 50,
        receiver: RECEIVER,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("createEscrowActionPolicy role gating", () => {
  it("shows approve only for approvers", () => {
    const escrow = createSingleEscrow({
      milestones: [pendingMilestone()],
    });

    expect(
      createEscrowActionPolicy(escrow, APPROVER).canApproveMilestone(0),
    ).toBe(true);
    expect(
      createEscrowActionPolicy(escrow, SERVICE_PROVIDER).canApproveMilestone(0),
    ).toBe(false);
    expect(
      createEscrowActionPolicy(escrow, OTHER).canApproveMilestone(0),
    ).toBe(false);
  });

  it("shows change status only for service providers", () => {
    const escrow = createSingleEscrow();

    expect(
      createEscrowActionPolicy(
        escrow,
        SERVICE_PROVIDER,
      ).canChangeMilestoneStatus(0),
    ).toBe(true);
    expect(
      createEscrowActionPolicy(escrow, APPROVER).canChangeMilestoneStatus(0),
    ).toBe(false);
  });

  it("shows single-release release only for release signers when all approved", () => {
    const escrow = createSingleEscrow();

    expect(
      createEscrowActionPolicy(escrow, RELEASE_SIGNER).canReleaseEscrow(),
    ).toBe(true);
    expect(
      createEscrowActionPolicy(escrow, APPROVER).canReleaseEscrow(),
    ).toBe(false);
  });

  it("shows dispute for allowed roles and never for dispute resolvers", () => {
    const escrow = createSingleEscrow();

    expect(
      createEscrowActionPolicy(escrow, APPROVER).canDisputeEscrow(),
    ).toBe(true);
    expect(
      createEscrowActionPolicy(escrow, RECEIVER).canDisputeEscrow(),
    ).toBe(true);
    expect(
      createEscrowActionPolicy(escrow, PLATFORM).canDisputeEscrow(),
    ).toBe(true);
    expect(
      createEscrowActionPolicy(escrow, DISPUTE_RESOLVER).canDisputeEscrow(),
    ).toBe(false);
    expect(
      createEscrowActionPolicy(escrow, ADMIN).canDisputeEscrow(),
    ).toBe(false);
  });

  it("shows resolve and withdraw only for dispute resolvers", () => {
    const escrow = createSingleEscrow({
      dispute: {
        isDisputed: true,
        reason: "late",
        resolved: false,
      },
    });

    expect(
      createEscrowActionPolicy(
        escrow,
        DISPUTE_RESOLVER,
      ).canResolveEscrowDispute(),
    ).toBe(true);
    expect(
      createEscrowActionPolicy(escrow, APPROVER).canResolveEscrowDispute(),
    ).toBe(false);

    const terminal = createSingleEscrow({
      balance: 10,
      dispute: {
        isDisputed: false,
        reason: "late",
        resolved: true,
      },
      released: false,
    });

    expect(
      createEscrowActionPolicy(
        terminal,
        DISPUTE_RESOLVER,
      ).canWithdrawRemainingFunds(),
    ).toBe(true);
    expect(
      createEscrowActionPolicy(terminal, APPROVER).canWithdrawRemainingFunds(),
    ).toBe(false);
  });

  it("shows update and manage milestones only for admin", () => {
    const escrow = createSingleEscrow({ balance: 0 });

    expect(createEscrowActionPolicy(escrow, ADMIN).canUpdate()).toBe(true);
    expect(
      createEscrowActionPolicy(escrow, ADMIN).canManageMilestones(),
    ).toBe(true);
    expect(createEscrowActionPolicy(escrow, APPROVER).canUpdate()).toBe(false);
    expect(
      createEscrowActionPolicy(escrow, APPROVER).canManageMilestones(),
    ).toBe(false);
  });

  it("requires both approver and release signer for multi approve-and-release", () => {
    const escrow = createMultiEscrow({
      roles: {
        admin: ADMIN,
        approvers: [DUAL, APPROVER],
        serviceProviders: [SERVICE_PROVIDER],
        releaseSigners: [DUAL, RELEASE_SIGNER],
        disputeResolvers: [DISPUTE_RESOLVER],
        platform: PLATFORM,
      },
      milestones: [
        {
          ...pendingMilestone(),
          amount: 50,
          receiver: RECEIVER,
        },
      ],
    });

    expect(
      createEscrowActionPolicy(escrow, DUAL).canApproveAndReleaseMilestone(0),
    ).toBe(true);
    expect(
      createEscrowActionPolicy(
        escrow,
        APPROVER,
      ).canApproveAndReleaseMilestone(0),
    ).toBe(false);
    expect(
      createEscrowActionPolicy(
        escrow,
        RELEASE_SIGNER,
      ).canApproveAndReleaseMilestone(0),
    ).toBe(false);
  });

  it("allows multi manage milestones until all milestones are released", () => {
    const escrow = createMultiEscrow({
      balance: 0,
      milestones: [
        {
          ...approvedMilestone(),
          amount: 50,
          receiver: RECEIVER,
          released: true,
        },
        {
          ...pendingMilestone(),
          description: "Milestone 2",
          amount: 50,
          receiver: RECEIVER,
        },
      ],
    });

    expect(
      createEscrowActionPolicy(escrow, ADMIN).canManageMilestones(),
    ).toBe(true);

    const allReleased = createMultiEscrow({
      balance: 0,
      milestones: [
        {
          ...approvedMilestone(),
          amount: 50,
          receiver: RECEIVER,
          released: true,
        },
      ],
    });

    expect(
      createEscrowActionPolicy(allReleased, ADMIN).canManageMilestones(),
    ).toBe(false);
  });

  it("hides operational actions when no wallet is connected", () => {
    const escrow = createSingleEscrow({
      milestones: [pendingMilestone()],
    });
    const policy = createEscrowActionPolicy(escrow, null);

    expect(policy.canFund()).toBe(false);
    expect(policy.canApproveMilestone(0)).toBe(false);
    expect(policy.canReleaseEscrow()).toBe(false);
    expect(policy.canDisputeEscrow()).toBe(false);
    expect(policy.canUpdate()).toBe(false);
  });
});
