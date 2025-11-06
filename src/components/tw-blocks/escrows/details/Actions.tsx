import {
  DollarSign,
  CheckCircle,
  CheckSquare,
  AlertTriangle,
  Edit,
  Scale,
  Unlock,
  Wallet,
  Settings,
  Briefcase,
} from "lucide-react";
import {
  GetEscrowsFromIndexerResponse as Escrow,
  Role,
} from "@trustless-work/escrow/types";
import { FundEscrowDialog } from "../single-multi-release/fund-escrow/dialog/FundEscrow";
import { UpdateEscrowDialog } from "../single-release/update-escrow/dialog/UpdateEscrow";
import { UpdateEscrowDialog as UpdateMultiReleaseEscrowDialog } from "../multi-release/update-escrow/dialog/UpdateEscrow";
import { useEscrowUIBoundedStore } from "@/modules/escrow/store/ui";
import { DisputeEscrowButton } from "../single-release/dispute-escrow/button/DisputeEscrow";
import { ResolveDisputeDialog } from "../single-release/resolve-dispute/dialog/ResolveDispute";
import { ReleaseEscrowButton } from "../single-release/release-escrow/button/ReleaseEscrow";
import { WithdrawRemainingFundsDialog } from "../multi-release/withdraw-remaining-funds/dialog/WithdrawRemainingFunds";

interface ActionsProps {
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
  areAllMilestonesApproved: boolean;
}

export const roleActions: {
  role: Role;
  actions: string[];
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    role: "signer",
    actions: ["fundEscrow"],
    icon: <Wallet className="h-6 w-6 text-primary" />,
    color: "",
  },
  {
    role: "approver",
    actions: ["fundEscrow", "approveMilestone", "startDispute"],
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    color: "0",
  },
  {
    role: "serviceProvider",
    actions: ["fundEscrow", "completeMilestone", "startDispute"],
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    color: "0",
  },
  {
    role: "disputeResolver",
    actions: ["fundEscrow", "resolveDispute"],
    icon: <Scale className="h-6 w-6 text-primary" />,
    color: "00",
  },
  {
    role: "releaseSigner",
    actions: ["fundEscrow", "releasePayment"],
    icon: <Unlock className="h-6 w-6 text-primary" />,
    color: "",
  },
  {
    role: "platformAddress",
    actions: ["fundEscrow", "editEscrow"],
    icon: <Settings className="h-6 w-6 text-primary" />,
    color: "0",
  },
  {
    role: "receiver",
    actions: ["fundEscrow"],
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    color: "",
  },
];

export const actionIcons: Record<string, React.ReactNode> = {
  fundEscrow: <DollarSign className="h-6 w-6 text-primary/60" />,
  approveMilestone: <CheckCircle className="h-6 w-6 text-primary/60" />,
  completeMilestone: <CheckSquare className="h-6 w-6 text-primary/60" />,
  startDispute: <AlertTriangle className="h-6 w-6 text-primary/60" />,
  resolveDispute: <Scale className="h-6 w-6 text-primary/60" />,
  releasePayment: <Unlock className="h-6 w-6 text-primary/60" />,
  editEscrow: <Edit className="h-6 w-6 text-primary/60" />,
};

export const Actions = ({
  selectedEscrow,
  userRolesInEscrow,
  areAllMilestonesApproved,
}: ActionsProps) => {
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const shouldShowEditButton =
    activeTab === "platformAddress" &&
    userRolesInEscrow.includes("platformAddress") &&
    !selectedEscrow?.flags?.disputed &&
    !selectedEscrow?.flags?.resolved &&
    !selectedEscrow?.flags?.released;

  const shouldShowDisputeButton =
    ((selectedEscrow.type === "single-release" &&
      activeTab === "approver" &&
      userRolesInEscrow.includes("approver")) ||
      (activeTab === "serviceProvider" &&
        userRolesInEscrow.includes("serviceProvider"))) &&
    !selectedEscrow?.flags?.disputed &&
    !selectedEscrow?.flags?.resolved;

  const shouldShowResolveButton =
    activeTab === "disputeResolver" &&
    selectedEscrow.type === "single-release" &&
    userRolesInEscrow.includes("disputeResolver") &&
    !selectedEscrow?.flags?.resolved &&
    selectedEscrow?.flags?.disputed;

  const shouldShowReleaseFundsButton =
    activeTab === "releaseSigner" &&
    selectedEscrow.type === "single-release" &&
    areAllMilestonesApproved &&
    userRolesInEscrow.includes("releaseSigner") &&
    !selectedEscrow.flags?.released;

  const shouldShowWithdrawRemaining = (() => {
    if (activeTab !== "disputeResolver") return false;
    if (!userRolesInEscrow.includes("disputeResolver")) return false;
    if ((selectedEscrow.balance ?? 0) === 0) return false;
    const milestones = (selectedEscrow.milestones || []) as Array<{
      flags?: { resolved?: boolean; released?: boolean; disputed?: boolean };
    }>;
    return (
      milestones.length > 0 &&
      milestones.every((m) => {
        const f = m.flags || {};
        return !!(f.resolved || f.released || f.disputed);
      })
    );
  })();

  const hasConditionalButtons =
    shouldShowEditButton ||
    shouldShowDisputeButton ||
    shouldShowResolveButton ||
    shouldShowReleaseFundsButton ||
    shouldShowWithdrawRemaining;

  return (
    <div className="flex items-start justify-start flex-col gap-2 w-full">
      {/* You can add the buttons here, using the buttons from the blocks. These actions are conditional based on the escrow flags and the user roles. */}
      {hasConditionalButtons && (
        <div className="flex flex-col gap-2 w-full">
          {/* UpdateEscrowDialog component should be rendered based on the escrow type. It means that if the selectedEscrow.type is "single-release", then the UpdateEscrowDialog (from the single-release block) component should be rendered. If the selectedEscrow.type is "multi-release", then the UpdateEscrowDialog (from the multi-release block) component should be rendered. */}
          {shouldShowEditButton && selectedEscrow.type === "single-release" && (
            <UpdateEscrowDialog />
          )}
          {shouldShowEditButton && selectedEscrow.type === "multi-release" && (
            <UpdateMultiReleaseEscrowDialog />
          )}

          {/* Works only with single-release escrows */}
          {/* Only appears if the escrow has balance */}
          {shouldShowDisputeButton && <DisputeEscrowButton />}

          {/* Works only with single-release escrows */}
          {/* Only appears if the escrow is disputed */}
          {shouldShowResolveButton && <ResolveDisputeDialog />}

          {/* Works only with single-release escrows */}
          {/* Only appears if all the milestones are approved */}
          {shouldShowReleaseFundsButton && <ReleaseEscrowButton />}

          {/* Multi-release: Withdraw Remaining Funds */}
          {shouldShowWithdrawRemaining && <WithdrawRemainingFundsDialog />}
        </div>
      )}

      <FundEscrowDialog />
    </div>
  );
};
