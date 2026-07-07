"use client";

import type { MultiReleaseMilestone } from "@trustless-work/escrow";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UsdcAmount } from "@/components/shared/UsdcAmount";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";
import {
  EscrowCardStatusBadge,
  EscrowTypeBadge,
} from "@/features/escrows/ui/EscrowStatusBadge";
import { MilestoneCardStatusBadge } from "@/features/escrows/ui/MilestoneStatusBadge";
import {
  getEscrowAssetSymbol,
  getEscrowDisplayAmount,
  isEscrowDisputed,
  isEscrowReleased,
  type MilestoneCardDisplayStatus,
} from "@/features/escrows/utils/escrow-display.helper";
import { truncateStellarAddress } from "@/helpers/stellar.helper";

type EscrowCardStatus = "active" | "released" | "disputed";

type EscrowCardMilestone = {
  readonly id: string;
  readonly title: string;
  readonly status: MilestoneCardDisplayStatus;
  readonly amount?: number;
};

type EscrowCardProps = {
  escrow: StoredEscrow;
};

function getEscrowCardStatus(escrow: StoredEscrow): EscrowCardStatus {
  if (isEscrowDisputed(escrow)) {
    return "disputed";
  }

  if (isEscrowReleased(escrow)) {
    return "released";
  }

  return "active";
}

function normalizeMilestoneStatus(
  rawStatus: string | undefined,
): Exclude<MilestoneCardDisplayStatus, "released" | "disputed"> {
  const status = rawStatus?.toLowerCase().replace(/\s+/g, "_");

  if (status === "in_progress") {
    return "in_progress";
  }

  if (status === "completed") {
    return "completed";
  }

  return "pending";
}

function getMilestoneCardStatus(
  escrow: StoredEscrow,
  milestone: StoredEscrow["milestones"][number],
): MilestoneCardDisplayStatus {
  if (isStoredMultiReleaseEscrow(escrow)) {
    const multiMilestone = milestone as MultiReleaseMilestone;

    if (multiMilestone.dispute?.isDisputed) {
      return "disputed";
    }

    if (multiMilestone.released) {
      return "released";
    }
  }

  return normalizeMilestoneStatus(milestone.status);
}

function mapEscrowMilestones(escrow: StoredEscrow): EscrowCardMilestone[] {
  const isMulti = isStoredMultiReleaseEscrow(escrow);

  return escrow.milestones.map((milestone, index) => {
    const multiMilestone = isMulti
      ? (milestone as MultiReleaseMilestone)
      : null;

    return {
      id: `${escrow.contractId}-${index}`,
      title: milestone.description || `Milestone ${index + 1}`,
      status: getMilestoneCardStatus(escrow, milestone),
      amount: multiMilestone?.amount,
    };
  });
}

export const EscrowCard = ({ escrow }: EscrowCardProps) => {
  const status = getEscrowCardStatus(escrow);
  const amount = getEscrowDisplayAmount(escrow);
  const currency = getEscrowAssetSymbol(escrow);
  const milestones = mapEscrowMilestones(escrow);
  const visibleMilestones = milestones.slice(0, 3);
  const remaining = milestones.length - visibleMilestones.length;

  return (
    <Link
      href={`/dashboard/escrows/${escrow.contractId}`}
      className="block h-full"
    >
      <article className="flex h-[22rem] flex-col overflow-hidden rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-shadow hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center gap-2">
              <EscrowTypeBadge escrow={escrow} />

              <Badge variant="secondary" className="font-mono font-normal uppercase">
                {truncateStellarAddress(escrow.contractId, 8, 6)}
              </Badge>
            </div>
            <h3 className="truncate text-base font-semibold leading-tight text-balance">
              {escrow.title}
            </h3>
          </div>
          <EscrowCardStatusBadge status={status} />
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {escrow.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border-2 px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Amount</p>
            <UsdcAmount
              amount={amount}
              symbol={currency}
              size="sm"
              emphasis
              className="mt-0.5"
            />
          </div>
          <div className="rounded-2xl border-2 px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Balance</p>
            <UsdcAmount
              amount={escrow.balance}
              symbol={currency}
              size="sm"
              emphasis
              className="mt-0.5"
            />
          </div>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
            Milestones
          </p>
          <ul className="flex flex-col gap-1.5">
            {visibleMilestones.map((milestone) => (
              <li
                key={milestone.id}
                className="flex items-center justify-between gap-2"
              >
                <span className="min-w-0 flex-1 truncate text-sm">
                  {milestone.title}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <MilestoneCardStatusBadge status={milestone.status} />
                  {typeof milestone.amount === "number" ? (
                    <UsdcAmount
                      amount={milestone.amount}
                      symbol={currency}
                      size="sm"
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          {remaining > 0 ? (
            <p className="mt-auto pt-2 text-xs font-medium text-muted-foreground">
              +{remaining} more milestone{remaining > 1 ? "s" : ""}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
};
