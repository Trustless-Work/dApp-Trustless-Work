import type {
  MultiReleaseEscrow,
  SingleReleaseEscrow,
} from "@trustless-work/escrow";
import type {
  StoredEscrow,
  StoredMultiReleaseEscrow,
  StoredSingleReleaseEscrow,
} from "@/features/escrows/types/escrow.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSingleReleaseEscrow(
  escrow: SingleReleaseEscrow | MultiReleaseEscrow,
): escrow is SingleReleaseEscrow {
  return "amount" in escrow;
}

function isStoredEscrow(value: unknown): value is StoredEscrow {
  if (!isRecord(value)) {
    return false;
  }

  const type = value.type;
  const contractId = value.contractId;
  const createdAt = value.createdAt;
  const updatedAt = value.updatedAt;

  return (
    (type === "single-release" || type === "multi-release") &&
    typeof contractId === "string" &&
    typeof createdAt === "string" &&
    typeof updatedAt === "string"
  );
}

export function toStoredEscrow(
  escrow: SingleReleaseEscrow | MultiReleaseEscrow,
  contractId: string,
  existing?: StoredEscrow | null,
): StoredEscrow {
  const now = new Date().toISOString();
  const createdAt = existing?.createdAt ?? now;

  if (isSingleReleaseEscrow(escrow)) {
    const stored: StoredSingleReleaseEscrow = {
      ...escrow,
      contractId,
      type: "single-release",
      createdAt,
      updatedAt: now,
    };
    return stored;
  }

  const stored: StoredMultiReleaseEscrow = {
    ...escrow,
    contractId,
    type: "multi-release",
    createdAt,
    updatedAt: now,
  };
  return stored;
}

export interface EscrowRepository {
  list(walletAddress: string): StoredEscrow[];
  getByContractId(
    contractId: string,
    walletAddress: string,
  ): StoredEscrow | null;
  upsert(walletAddress: string, escrow: StoredEscrow): void;
  remove(walletAddress: string, contractId: string): void;
}

function storageKey(walletAddress: string): string {
  return `tw-escrows:${walletAddress}`;
}

function readRaw(walletAddress: string): StoredEscrow[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = localStorage.getItem(storageKey(walletAddress));
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isStoredEscrow);
  } catch {
    return [];
  }
}

function writeRaw(walletAddress: string, escrows: StoredEscrow[]): void {
  localStorage.setItem(storageKey(walletAddress), JSON.stringify(escrows));
}

export const localEscrowRepository: EscrowRepository = {
  list(walletAddress) {
    return readRaw(walletAddress);
  },

  getByContractId(contractId, walletAddress) {
    return (
      readRaw(walletAddress).find(
        (escrow) => escrow.contractId === contractId,
      ) ?? null
    );
  },

  upsert(walletAddress, escrow) {
    const escrows = readRaw(walletAddress);
    const index = escrows.findIndex(
      (item) => item.contractId === escrow.contractId,
    );

    if (index >= 0) {
      escrows[index] = escrow;
    } else {
      escrows.unshift(escrow);
    }

    writeRaw(walletAddress, escrows);
  },

  remove(walletAddress, contractId) {
    writeRaw(
      walletAddress,
      readRaw(walletAddress).filter(
        (escrow) => escrow.contractId !== contractId,
      ),
    );
  },
};
