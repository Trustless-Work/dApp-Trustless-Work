import { describe, expect, it } from "vitest";
import { createEscrowSchema } from "@/features/escrows/schemas/create-escrow.schema";

const WALLET = `G${"A".repeat(55)}`;
const PLATFORM = `G${"B".repeat(55)}`;
const DISPUTE_RESOLVER = `G${"C".repeat(55)}`;
const ADMIN = `G${"D".repeat(55)}`;
const TRUSTLINE_CONTRACT =
  "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";

const baseRoles = {
  approvers: [WALLET],
  serviceProviders: [WALLET],
  platform: PLATFORM,
  releaseSigners: [WALLET],
  disputeResolvers: [DISPUTE_RESOLVER],
  admin: ADMIN,
};

const trustline = {
  isCustom: false,
  address: TRUSTLINE_CONTRACT,
  symbol: "USDC",
};

describe("createEscrowSchema", () => {
  it("allows a single-release escrow with amount 0", () => {
    const result = createEscrowSchema.safeParse({
      type: "single-release",
      engagementId: "eng-zero",
      title: "Zero amount escrow",
      description: "Deploy without funding amount",
      amount: 0,
      platformFee: 2,
      roles: {
        ...baseRoles,
        receiver: WALLET,
      },
      milestones: [{ description: "Kickoff", approvalsTarget: 1 }],
      trustline,
    });

    expect(result.success).toBe(true);
  });

  it("allows a multi-release escrow with milestone amount 0", () => {
    const result = createEscrowSchema.safeParse({
      type: "multi-release",
      engagementId: "eng-zero-multi",
      title: "Zero amount multi-release",
      description: "Deploy without milestone amounts",
      platformFee: 2,
      roles: baseRoles,
      milestones: [
        {
          description: "Kickoff",
          approvalsTarget: 1,
          amount: 0,
          receiver: WALLET,
        },
      ],
      trustline,
    });

    expect(result.success).toBe(true);
  });

  it("allows deploying without milestones", () => {
    const result = createEscrowSchema.safeParse({
      type: "single-release",
      engagementId: "eng-no-milestones",
      title: "Escrow without milestones",
      description: "Deploy with an empty milestones list",
      amount: 0,
      platformFee: 2,
      roles: {
        ...baseRoles,
        receiver: WALLET,
      },
      milestones: [],
      trustline,
    });

    expect(result.success).toBe(true);
  });

  it("rejects negative amounts", () => {
    const result = createEscrowSchema.safeParse({
      type: "single-release",
      engagementId: "eng-negative",
      title: "Negative amount",
      description: "Should fail",
      amount: -1,
      platformFee: 2,
      roles: {
        ...baseRoles,
        receiver: WALLET,
      },
      milestones: [{ description: "Kickoff", approvalsTarget: 1 }],
      trustline,
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ["amount"] }),
      ]),
    );
  });
});
