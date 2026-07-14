import type {
  EscrowDeposit,
  EscrowDetail,
  EscrowEvent,
  EscrowSnapshot,
  EscrowSummary,
  MultiReleaseEscrow,
  MultiReleaseEscrowSnapshot,
  MultiReleaseMilestone,
  SingleReleaseEscrow,
  SingleReleaseEscrowSnapshot,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import type {
  EscrowDetailModel,
  EscrowListItem,
  EscrowStatus,
  EscrowType,
  StoredEscrow,
  StoredMultiReleaseEscrow,
  StoredSingleReleaseEscrow,
} from "@/features/escrows/types/escrow.types";
import { isEscrowType } from "@/features/escrows/types/escrow.types";

export function parseEscrowAmount(
  value: string | number | null | undefined,
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSingleReleaseSnapshot(
  snapshot: EscrowSnapshot,
): snapshot is SingleReleaseEscrowSnapshot {
  return "amount" in snapshot && Array.isArray(snapshot.milestones);
}

function isMultiReleaseSnapshot(
  snapshot: EscrowSnapshot,
): snapshot is MultiReleaseEscrowSnapshot {
  return !("amount" in snapshot) && Array.isArray(snapshot.milestones);
}

function resolveType(
  type: string | null | undefined,
  snapshot: EscrowSnapshot | null,
): EscrowType {
  if (type && isEscrowType(type)) {
    return type;
  }

  if (snapshot && isSingleReleaseSnapshot(snapshot)) {
    return "single-release";
  }

  return "multi-release";
}

function asSnapshot(value: unknown): EscrowSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.title !== "string" ||
    typeof value.description !== "string" ||
    typeof value.engagementId !== "string" ||
    !isRecord(value.trustline) ||
    typeof value.trustline.address !== "string" ||
    !Array.isArray(value.milestones) ||
    !isRecord(value.roles)
  ) {
    return null;
  }

  return value as unknown as EscrowSnapshot;
}

type SummaryLike = {
  contractId: string;
  engagementId: string;
  createdAt: string;
  updatedAt: string;
  status: EscrowStatus | string | null;
  type: EscrowType | string;
  totalAmount: number | null;
  snapshot: unknown;
};

function mapSingleStored(
  summary: SummaryLike,
  snapshot: SingleReleaseEscrowSnapshot,
  balance: number,
): StoredSingleReleaseEscrow {
  const entity: SingleReleaseEscrow = {
    type: "single-release",
    contractId: summary.contractId,
    signer: "",
    engagementId: snapshot.engagementId || summary.engagementId || "",
    title: snapshot.title,
    description: snapshot.description,
    platformFee: snapshot.platformFee,
    balance,
    receiverMemo: snapshot.receiverMemo,
    trustline: snapshot.trustline,
    roles: snapshot.roles,
    amount: snapshot.amount,
    milestones: snapshot.milestones as SingleReleaseMilestone[],
    dispute: snapshot.dispute,
    released: snapshot.released,
  };

  return {
    ...entity,
    type: "single-release",
    contractId: summary.contractId,
    createdAt: summary.createdAt,
    updatedAt: summary.updatedAt,
    status: summary.status,
  };
}

function mapMultiStored(
  summary: SummaryLike,
  snapshot: MultiReleaseEscrowSnapshot,
  balance: number,
): StoredMultiReleaseEscrow {
  const entity: MultiReleaseEscrow = {
    type: "multi-release",
    contractId: summary.contractId,
    signer: "",
    engagementId: snapshot.engagementId || summary.engagementId || "",
    title: snapshot.title,
    description: snapshot.description,
    platformFee: snapshot.platformFee,
    balance,
    trustline: snapshot.trustline,
    roles: snapshot.roles,
    milestones: snapshot.milestones as MultiReleaseMilestone[],
  };

  return {
    ...entity,
    type: "multi-release",
    contractId: summary.contractId,
    createdAt: summary.createdAt,
    updatedAt: summary.updatedAt,
    status: summary.status,
  };
}

export function mapEscrowSummaryToStored(
  summary: SummaryLike,
  balance = 0,
): StoredEscrow | null {
  const snapshot = asSnapshot(summary.snapshot);
  if (!snapshot) {
    return null;
  }

  const type = resolveType(
    typeof summary.type === "string" ? summary.type : null,
    snapshot,
  );

  if (type === "single-release" && isSingleReleaseSnapshot(snapshot)) {
    return mapSingleStored(summary, snapshot, balance);
  }

  if (type === "multi-release" && isMultiReleaseSnapshot(snapshot)) {
    return mapMultiStored(summary, snapshot, balance);
  }

  if (isSingleReleaseSnapshot(snapshot)) {
    return mapSingleStored(summary, snapshot, balance);
  }

  if (isMultiReleaseSnapshot(snapshot)) {
    return mapMultiStored(summary, snapshot, balance);
  }

  return null;
}

function resolveTotalAmount(
  summary: SummaryLike,
  stored: StoredEscrow,
): number | null {
  if (summary.totalAmount != null) {
    return parseEscrowAmount(summary.totalAmount);
  }

  if ("amount" in stored) {
    return stored.amount;
  }

  return stored.milestones.reduce(
    (sum, milestone) =>
      sum + ("amount" in milestone ? Number(milestone.amount) : 0),
    0,
  );
}

export function mapEscrowSummaryToListItem(
  summary: EscrowSummary,
): EscrowListItem | null {
  const stored = mapEscrowSummaryToStored(summary);
  if (!stored) {
    return null;
  }

  const totalAmount = resolveTotalAmount(summary, stored);
  const status = (summary.status ?? stored.status ?? "active") as
    | EscrowStatus
    | string
    | null;

  return {
    contractId: summary.contractId,
    type: stored.type,
    status,
    engagementId: summary.engagementId,
    title: stored.title,
    description: stored.description,
    createdAt: summary.createdAt,
    updatedAt: summary.updatedAt,
    totalAmount,
    balance: stored.balance,
    assetSymbol:
      stored.trustline && "symbol" in stored.trustline
        ? (stored.trustline.symbol ?? "USDC")
        : "USDC",
    milestoneCount: stored.milestones.length,
    financial: null,
    stored,
    layout: "standard",
  };
}

export function mapEscrowDetailToModel(
  detail: EscrowDetail,
): EscrowDetailModel | null {
  const stored = mapEscrowSummaryToStored(detail.escrow);
  if (!stored) {
    return null;
  }

  return {
    escrow: stored,
    status: detail.escrow.status,
    financial: null,
    deposits: detail.deposits,
    events: detail.events,
  };
}

export type { EscrowDeposit, EscrowEvent };
