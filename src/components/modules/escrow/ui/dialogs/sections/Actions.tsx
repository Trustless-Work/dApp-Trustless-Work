import { useDisputeEscrowDialog } from "../../../hooks/single-release/dispute-escrow-dialog.hook";
import { useEscrowDialogs } from "../hooks/use-escrow-dialogs.hook";
import {
  CircleDollarSign,
  Flame,
  Handshake,
  Loader2,
  Pencil,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { toast } from "sonner";
import { Escrow } from "@/@types/escrow.entity";
import { useTranslation } from "react-i18next";
import { useResolveDisputeDialog } from "../../../hooks/resolve-dispute-dialog.hook";

interface ActionsProps {
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
}

export const Actions = ({
  selectedEscrow,
  userRolesInEscrow,
}: ActionsProps) => {
  const { handleOpen } = useResolveDisputeDialog();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const isStartingDispute = useEscrowUIBoundedStore(
    (state) => state.isStartingDispute,
  );
  const { startDisputeSubmit } = useDisputeEscrowDialog();
  const { t } = useTranslation();
  const dialogStates = useEscrowDialogs();

  return (
    <div className="flex flex-col gap-2 pt-2 w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        {userRolesInEscrow.includes("platformAddress") &&
          !selectedEscrow?.flags?.disputed &&
          !selectedEscrow?.flags?.resolved &&
          !selectedEscrow?.flags?.released &&
          activeTab === "platformAddress" && (
            <Button
              disabled={Number(selectedEscrow.balance) === 0}
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

        <Button
          onClick={(e) => {
            e.stopPropagation();
            dialogStates.qr.setIsOpen(true);
          }}
          className="w-full"
          variant="outline"
        >
          <QrCode className="mr-2 h-4 w-4" />
          Show QR Code
        </Button>

        {selectedEscrow.type === "single-release" &&
          (userRolesInEscrow.includes("approver") ||
            userRolesInEscrow.includes("serviceProvider")) &&
          (activeTab === "approver" || activeTab === "serviceProvider") &&
          !selectedEscrow?.flags?.disputed &&
          !selectedEscrow?.flags?.resolved && (
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

        {selectedEscrow.type === "single-release" &&
          userRolesInEscrow.includes("disputeResolver") &&
          activeTab === "disputeResolver" &&
          !selectedEscrow?.flags?.resolved &&
          selectedEscrow?.flags?.disputed && (
            <Button
              onClick={handleOpen}
              className="bg-green-800 hover:bg-green-700 w-full"
            >
              <Handshake className="mr-2 h-4 w-4" />
              Resolve Dispute
            </Button>
          )}
      </div>

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
