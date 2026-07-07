import type {
  MultiReleaseEscrow,
  SingleReleaseEscrow,
} from "@trustless-work/escrow";

export const ESCROW_TYPES = ["single-release", "multi-release"] as const;

export type EscrowType = (typeof ESCROW_TYPES)[number];

export function isEscrowType(value: string): value is EscrowType {
  return ESCROW_TYPES.includes(value as EscrowType);
}

export type StoredEscrowMetadata = {
  readonly contractId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type StoredSingleReleaseEscrow = SingleReleaseEscrow &
  StoredEscrowMetadata & {
    readonly type: "single-release";
  };

export type StoredMultiReleaseEscrow = MultiReleaseEscrow &
  StoredEscrowMetadata & {
    readonly type: "multi-release";
  };

export type StoredEscrow = StoredSingleReleaseEscrow | StoredMultiReleaseEscrow;

export function isStoredSingleReleaseEscrow(
  escrow: StoredEscrow,
): escrow is StoredSingleReleaseEscrow {
  return escrow.type === "single-release";
}

export function isStoredMultiReleaseEscrow(
  escrow: StoredEscrow,
): escrow is StoredMultiReleaseEscrow {
  return escrow.type === "multi-release";
}

export type EscrowFilterStatus = "all" | "active" | "released" | "disputed";

export type EscrowFilters = {
  search: string;
  status: EscrowFilterStatus;
};

export const DEFAULT_ESCROW_FILTERS: EscrowFilters = {
  search: "",
  status: "all",
};
