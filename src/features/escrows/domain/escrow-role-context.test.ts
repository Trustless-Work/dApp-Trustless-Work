import { describe, expect, it } from "vitest";
import { EscrowRoleContext } from "@/features/escrows/domain/escrow-role-context";
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
const OBSERVER = "GOBSERVER";
const OTHER = "GOTHER";
const MILESTONE_RECEIVER = "GMILESTONE";

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
    balance: 0,
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
      observers: [OBSERVER],
    },
    milestones: [
      {
        description: "Milestone 1",
        approvalsTarget: 1,
        approvals: {
          target: 1,
          approvalCount: 0,
          approvedBy: [],
        },
      },
    ],
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
      observers: [OBSERVER],
    },
    milestones: [
      {
        description: "Milestone 1",
        amount: 50,
        receiver: MILESTONE_RECEIVER,
        approvalsTarget: 1,
        approvals: {
          target: 1,
          approvalCount: 0,
          approvedBy: [],
        },
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("EscrowRoleContext", () => {
  it("returns no roles when the wallet is disconnected", () => {
    const roles = new EscrowRoleContext(createSingleEscrow(), null);

    expect(roles.isConnected).toBe(false);
    expect(roles.getConnectedRoleIds()).toEqual([]);
  });

  it("matches each single-release role for the connected wallet", () => {
    const escrow = createSingleEscrow();

    expect(new EscrowRoleContext(escrow, ADMIN).getConnectedRoleIds()).toEqual([
      "admin",
    ]);
    expect(
      new EscrowRoleContext(escrow, APPROVER).getConnectedRoleIds(),
    ).toEqual(["approvers"]);
    expect(
      new EscrowRoleContext(escrow, SERVICE_PROVIDER).getConnectedRoleIds(),
    ).toEqual(["service-providers"]);
    expect(
      new EscrowRoleContext(escrow, RELEASE_SIGNER).getConnectedRoleIds(),
    ).toEqual(["release-signers"]);
    expect(
      new EscrowRoleContext(escrow, DISPUTE_RESOLVER).getConnectedRoleIds(),
    ).toEqual(["dispute-resolvers"]);
    expect(
      new EscrowRoleContext(escrow, PLATFORM).getConnectedRoleIds(),
    ).toEqual(["platform"]);
    expect(
      new EscrowRoleContext(escrow, RECEIVER).getConnectedRoleIds(),
    ).toEqual(["receiver"]);
    expect(
      new EscrowRoleContext(escrow, OBSERVER).getConnectedRoleIds(),
    ).toEqual(["observers"]);
  });

  it("returns multiple roles when the same wallet overlaps", () => {
    const escrow = createSingleEscrow({
      roles: {
        admin: ADMIN,
        approvers: [APPROVER],
        serviceProviders: [APPROVER],
        releaseSigners: [APPROVER],
        disputeResolvers: [DISPUTE_RESOLVER],
        platform: PLATFORM,
        receiver: APPROVER,
        observers: [OBSERVER],
      },
    });

    expect(
      new EscrowRoleContext(escrow, APPROVER).getConnectedRoleIds(),
    ).toEqual([
      "approvers",
      "service-providers",
      "release-signers",
      "receiver",
    ]);
  });

  it("treats a multi-release milestone receiver as receiver", () => {
    const roles = new EscrowRoleContext(createMultiEscrow(), MILESTONE_RECEIVER);

    expect(roles.isAnyMilestoneReceiver()).toBe(true);
    expect(roles.getConnectedRoleIds()).toEqual(["receiver"]);
    expect(roles.canOpenDispute(0)).toBe(true);
    expect(roles.canOpenDispute(1)).toBe(false);
  });

  it("blocks dispute resolvers from opening disputes even with overlap", () => {
    const escrow = createSingleEscrow({
      roles: {
        admin: ADMIN,
        approvers: [DISPUTE_RESOLVER],
        serviceProviders: [SERVICE_PROVIDER],
        releaseSigners: [RELEASE_SIGNER],
        disputeResolvers: [DISPUTE_RESOLVER],
        platform: PLATFORM,
        receiver: RECEIVER,
      },
    });

    const roles = new EscrowRoleContext(escrow, DISPUTE_RESOLVER);

    expect(roles.canOpenDispute()).toBe(false);
  });

  it("returns empty role ids for an unrelated wallet", () => {
    expect(
      new EscrowRoleContext(createSingleEscrow(), OTHER).getConnectedRoleIds(),
    ).toEqual([]);
  });
});
