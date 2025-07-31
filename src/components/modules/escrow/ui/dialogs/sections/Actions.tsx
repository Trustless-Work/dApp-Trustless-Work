import { useDisputeEscrowDialog } from "../../../hooks/single-release/dispute-escrow-dialog.hook";
import { useEscrowDialogs } from "../hooks/use-escrow-dialogs.hook";
import {
  CircleDollarSign,
  Flame,
  Handshake,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { toast } from "sonner";
import { Escrow } from "@/@types/escrow.entity";
import { useTranslation } from "react-i18next";
import { useResolveDisputeDialog } from "../../../hooks/resolve-dispute-dialog.hook";
import { useReleaseFundsEscrowDialog } from "../../../hooks/single-release/release-funds-escrow-dialog.hook";

interface ActionsProps {
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
  areAllMilestonesCompleted: boolean;
  areAllMilestonesCompletedAndFlag: boolean;
}

export const Actions = ({
  selectedEscrow,
  userRolesInEscrow,
  areAllMilestonesCompleted,
  areAllMilestonesCompletedAndFlag,
}: ActionsProps) => {
  const { handleOpen } = useResolveDisputeDialog();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const isStartingDispute = useEscrowUIBoundedStore(
    (state) => state.isStartingDispute,
  );
  const { startDisputeSubmit } = useDisputeEscrowDialog();
  const { t } = useTranslation();
  const dialogStates = useEscrowDialogs();
  const { releaseFundsSubmit } = useReleaseFundsEscrowDialog();
  const isReleasingFunds = useEscrowUIBoundedStore(
    (state) => state.isReleasingFunds,
  );

  // Check if any of the conditional buttons should be displayed
  const shouldShowEditButton =
    userRolesInEscrow.includes("platformAddress") &&
    !selectedEscrow?.flags?.disputed &&
    !selectedEscrow?.flags?.resolved &&
    !selectedEscrow?.flags?.released &&
    activeTab === "platformAddress";

  const shouldShowDisputeButton =
    selectedEscrow.type === "single-release" &&
    (userRolesInEscrow.includes("approver") ||
      userRolesInEscrow.includes("serviceProvider")) &&
    (activeTab === "approver" || activeTab === "serviceProvider") &&
    !selectedEscrow?.flags?.disputed &&
    !selectedEscrow?.flags?.resolved;

  const shouldShowResolveButton =
    selectedEscrow.type === "single-release" &&
    userRolesInEscrow.includes("disputeResolver") &&
    activeTab === "disputeResolver" &&
    !selectedEscrow?.flags?.resolved &&
    selectedEscrow?.flags?.disputed;

  const shouldShowReleaseFundsButton =
    selectedEscrow.type === "single-release" &&
    areAllMilestonesCompleted &&
    areAllMilestonesCompletedAndFlag &&
    userRolesInEscrow.includes("releaseSigner") &&
    !selectedEscrow.flags?.released &&
    activeTab === "releaseSigner";

  const hasConditionalButtons =
    shouldShowEditButton ||
    shouldShowDisputeButton ||
    shouldShowResolveButton ||
    shouldShowReleaseFundsButton;

  return (
    <div className="flex items-start justify-start flex-col gap-2 w-full">
      {hasConditionalButtons && (
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {shouldShowEditButton && (
            <Button
              disabled={selectedEscrow.balance !== 0}
              onClick={(e) => {
                e.stopPropagation();
                dialogStates.editBasicProperties.setIsOpen(true);
              }}
              className="w-full"
              variant="outline"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Escrow
            </Button>
          )}

          {shouldShowDisputeButton && (
            <Button
              onClick={() => {
                if (
                  Number(selectedEscrow.balance) === 0 ||
                  !selectedEscrow.balance
                ) {
                  toast.error("The escrow balance cannot be 0");
                } else {
                  startDisputeSubmit();
                }
              }}
              disabled={
                Number(selectedEscrow.balance) === 0 ||
                !selectedEscrow.balance ||
                isStartingDispute
              }
              variant="destructive"
              className="w-full"
            >
              {isStartingDispute ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Dispute...
                </>
              ) : (
                <>
                  <Flame className="mr-2 h-4 w-4" />
                  {t("actions.startDispute")}
                </>
              )}
            </Button>
          )}

          {shouldShowResolveButton && (
            <Button
              onClick={handleOpen}
              type="button"
              variant="success"
              className="w-full"
            >
              <Handshake className="mr-2 h-4 w-4" />
              Resolve Dispute
            </Button>
          )}

          {shouldShowReleaseFundsButton && (
            <Button
              onClick={releaseFundsSubmit}
              type="button"
              variant="success"
              className="w-full"
              disabled={isReleasingFunds || selectedEscrow.balance === 0}
            >
              {isReleasingFunds ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("escrowDetailDialog.releasing")}
                </>
              ) : (
                <>
                  <CircleDollarSign />
                  {t("escrowDetailDialog.releaseFunds")}
                </>
              )}
            </Button>
          )}
        </div>
      )}

      <Button
        onClick={(e) => {
          e.stopPropagation();
          dialogStates.second.setIsOpen(true);
        }}
        className="w-full"
      >
        <CircleDollarSign className="mr-2 h-4 w-4" />
        Fund Escrow
      </Button>
    </div>
  );
};
