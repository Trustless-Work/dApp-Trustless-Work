"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";
import {
  Banknote,
  ChevronDown,
  CircleDollarSign,
  Coins,
  Gavel,
  ListTree,
  ShieldAlert,
  Wallet,
  Wrench,
} from "lucide-react";
import { useEscrowActionPolicy } from "@/features/escrows/hooks/useEscrowActionPolicy";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { FundEscrowAction } from "@/features/escrows/ui/actions/FundEscrowAction";
import { ManageMilestonesAction } from "@/features/escrows/ui/actions/ManageMilestonesAction";
import { ReleaseFundsAction } from "@/features/escrows/ui/actions/ReleaseFundsAction";
import { ResolveDisputeAction } from "@/features/escrows/ui/actions/ResolveDisputeAction";
import { StartDisputeAction } from "@/features/escrows/ui/actions/StartDisputeAction";
import { UpdateEscrowAction } from "@/features/escrows/ui/actions/UpdateEscrowAction";
import { WithdrawFundsAction } from "@/features/escrows/ui/actions/WithdrawFundsAction";
import { cn } from "@/lib/utils";

type EscrowGeneralActionsProps = {
  escrow: StoredEscrow;
};

type ActionGroupProps = {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  open: boolean;
  onToggle: (id: string) => void;
};

const ActionGroup = ({
  id,
  title,
  description,
  children,
  open,
  onToggle,
}: ActionGroupProps) => {
  const contentId = useId();

  return (
    <div className="relative rounded-2xl border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => onToggle(id)}
        className={cn(
          "flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl p-4 text-left",
          "transition-colors duration-200 ease-out hover:bg-muted/40",
        )}
      >
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={contentId}
        aria-hidden={!open}
        className={cn(
          "absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-border bg-card p-3 shadow-xl shadow-background/30",
          "origin-top transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]",
          open
            ? "visible pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "invisible pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
        )}
      >
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
};

export const EscrowGeneralActions = ({ escrow }: EscrowGeneralActionsProps) => {
  const policy = useEscrowActionPolicy(escrow);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const handleToggleGroup = (groupId: string) => {
    setOpenGroup((current) => (current === groupId ? null : groupId));
  };

  const showFund = policy.canFund();
  const showWithdraw = policy.canWithdrawRemainingFunds();
  const showUpdate = policy.canUpdate();
  const showManageMilestones = policy.canManageMilestones();
  const showRelease = policy.canReleaseEscrow();
  const showDispute = policy.canDisputeEscrow();
  const showResolve = policy.canResolveEscrowDispute();

  const hasFundingGroup =
    showFund || showWithdraw || showUpdate || showManageMilestones;
  const hasReleasesGroup = showRelease || showDispute || showResolve;

  return (
    <aside className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-foreground text-background">
          <Coins className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Actions</h2>
          <p className="text-sm text-muted-foreground">
            Escrow-level operations.
          </p>
        </div>
      </div>

      {hasFundingGroup ? (
        <ActionGroup
          id="funding"
          title="Funding"
          description="Add or recover funds held in the escrow."
          open={openGroup === "funding"}
          onToggle={handleToggleGroup}
        >
          {showFund ? (
            <FundEscrowAction escrow={escrow} icon={Wallet} />
          ) : null}
          {showWithdraw ? (
            <WithdrawFundsAction escrow={escrow} icon={Banknote} />
          ) : null}
          {showUpdate ? (
            <UpdateEscrowAction escrow={escrow} icon={Wrench} />
          ) : null}
          {showManageMilestones ? (
            <ManageMilestonesAction escrow={escrow} icon={ListTree} />
          ) : null}
        </ActionGroup>
      ) : null}

      {hasReleasesGroup ? (
        <ActionGroup
          id="releases-disputes"
          title="Releases & Disputes"
          description="Release funds or manage disputes for this escrow."
          open={openGroup === "releases-disputes"}
          onToggle={handleToggleGroup}
        >
          {showRelease ? (
            <ReleaseFundsAction
              escrow={escrow}
              triggerVariant="primary"
              icon={CircleDollarSign}
            />
          ) : null}
          {showDispute ? (
            <StartDisputeAction
              escrow={escrow}
              triggerVariant="danger"
              icon={ShieldAlert}
            />
          ) : null}
          {showResolve ? (
            <ResolveDisputeAction escrow={escrow} icon={Gavel} />
          ) : null}
        </ActionGroup>
      ) : null}
    </aside>
  );
};
