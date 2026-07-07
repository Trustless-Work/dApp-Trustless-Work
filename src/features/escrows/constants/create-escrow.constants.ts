import type { FieldPath } from "react-hook-form";
import type { CreateEscrowFormData } from "@/features/escrows/schemas/create-escrow.schema";
import type { EscrowType } from "@/features/escrows/types/escrow.types";

export type MultiRoleFieldName =
  | "roles.approvers"
  | "roles.serviceProviders"
  | "roles.releaseSigners"
  | "roles.disputeResolvers";

export type CreateEscrowFieldPath = FieldPath<CreateEscrowFormData>;

export const MAX_ROLE_ADDRESS_COUNT = 5;

export const CREATE_ESCROW_STEPS = [
  {
    id: "basics",
    label: "Basics",
  },
  {
    id: "roles",
    label: "Roles",
  },
  {
    id: "milestones",
    label: "Milestones",
  },
] as const;

export type CreateEscrowStepId = (typeof CREATE_ESCROW_STEPS)[number]["id"];

export type RoleFieldKey =
  | "approvers"
  | "serviceProviders"
  | "platform"
  | "releaseSigners"
  | "disputeResolvers"
  | "admin"
  | "receiver";

export type RoleFieldConfig = {
  key: RoleFieldKey;
  label: string;
  description: string;
  multiple: boolean;
  singleReleaseOnly?: boolean;
};

export const CREATE_ESCROW_ROLE_FIELDS: RoleFieldConfig[] = [
  {
    key: "approvers",
    label: "Approvers",
    description: "1-5 distinct addresses that approve milestones.",
    multiple: true,
  },
  {
    key: "serviceProviders",
    label: "Service providers",
    description: "1-5 distinct addresses that update milestone status.",
    multiple: true,
  },
  {
    key: "platform",
    label: "Platform",
    description: "Single platform address for metadata and fees.",
    multiple: false,
  },
  {
    key: "releaseSigners",
    label: "Release signers",
    description: "1-5 distinct addresses authorized to release funds.",
    multiple: true,
  },
  {
    key: "disputeResolvers",
    label: "Dispute resolvers",
    description: "1-5 distinct addresses that resolve disputes.",
    multiple: true,
  },
  {
    key: "admin",
    label: "Admin",
    description:
      "Single admin address for escrow updates. Must be distinct from every other role.",
    multiple: false,
  },
  {
    key: "receiver",
    label: "Receiver",
    description: "Single beneficiary for the full release.",
    multiple: false,
    singleReleaseOnly: true,
  },
];

export function getBasicsStepFields(type: EscrowType): CreateEscrowFieldPath[] {
  const shared: CreateEscrowFieldPath[] = [
    "engagementId",
    "title",
    "description",
    "platformFee",
    "trustline.address",
    "trustline.symbol",
  ];

  if (type === "single-release") {
    return [...shared, "amount"];
  }

  return shared;
}

export function getRolesStepFields(_type: EscrowType): CreateEscrowFieldPath[] {
  return ["roles"];
}

export function getFinalStepFields(_type: EscrowType): CreateEscrowFieldPath[] {
  return [...MILESTONES_STEP_FIELDS, "roles"];
}

export const MILESTONES_STEP_FIELDS = [
  "milestones",
] as const satisfies readonly CreateEscrowFieldPath[];

export const CREATE_ESCROW_PLACEHOLDERS = {
  engagementId: "eng-2024-001",
  title: "Website redesign project",
  description: "Scope of work, deliverables, and acceptance criteria",
  amount: "1000",
  platformFee: "2",
  stellarAddress: "G…",
  trustlineSymbol: "USDC",
  milestoneDescription: "Describe this deliverable",
  approvalsTarget: "1",
  milestoneAmount: "250",
} as const;
