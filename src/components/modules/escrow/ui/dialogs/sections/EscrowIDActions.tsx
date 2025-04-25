import { useCopyUtils } from "@/utils/hook/copy.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";
import useStartDisputeEscrowDialog from "../hooks/start-dispute-escrow-dialog.hook";
import useResolveDisputeEscrowDialog from "../hooks/resolve-dispute-escrow-dialog.hook";
import { useEscrowDialogs } from "../hooks/use-escrow-dialogs.hook";
import {
  Check,
  CircleDollarSignIcon,
  Copy,
  Flame,
  Handshake,
  Pencil,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Escrow } from "@/@types/escrow.entity";
import { toast } from "@/hooks/toast.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";

interface EscrowIDActionProps {
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
}

export const EscrowIDActions = ({
  selectedEscrow,
  userRolesInEscrow,
}: EscrowIDActionProps) => {
  const dialogStates = useEscrowDialogs();

  const { handleOpen } = useResolveDisputeEscrowDialog({
    setIsResolveDisputeDialogOpen: dialogStates.resolveDispute.setIsOpen,
  });
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const { startDisputeSubmit } = useStartDisputeEscrowDialog();
  const { formatAddress } = useFormatUtils();
  const { copyText, copiedKeyId } = useCopyUtils();

  return (
    <div className="flex flex-col justify-center w-full md:w-1/4 px-2">
      <p className="text-center mb-4 text-sm">
        <span className="uppercase font-bold block mb-1">
          {selectedEscrow.trustline?.name || "No Trustline"} | Escrow ID:
        </span>
        <div className="flex items-center justify-center gap-2 break-all text-center">
          {formatAddress(selectedEscrow.contractId)}
          <button
            onClick={() =>
              copyText(selectedEscrow?.contractId, selectedEscrow.contractId)
            }
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            {copiedKeyId ? (
              <Check className="h-4 w-4 text-green-700" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {userRolesInEscrow.includes("platformAddress") &&
            !selectedEscrow?.disputeFlag &&
            !selectedEscrow?.resolvedFlag &&
            !selectedEscrow?.releaseFlag &&
            activeTab === "platformAddress" && (
              <Button
                disabled={selectedEscrow?.balance !== undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  dialogStates.editBasicProperties.setIsOpen(true);
                }}
                className="w-full"
                variant="outline"
              >
                <Pencil className="mr-2" />
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
            <QrCode />
            Show QR Code
          </Button>

          {(userRolesInEscrow.includes("approver") ||
            userRolesInEscrow.includes("serviceProvider")) &&
            (activeTab === "approver" || activeTab === "serviceProvider") &&
            !selectedEscrow.disputeFlag &&
            !selectedEscrow.resolvedFlag && (
              <Button
                onClick={() => {
                  if (
                    Number(selectedEscrow.balance) === 0 ||
                    !selectedEscrow.balance
                  ) {
                    toast({
                      title: "Cannot start dispute",
                      description: "The escrow balance is 0",
                      variant: "destructive",
                    });
                  } else {
                    startDisputeSubmit();
                  }
                }}
                disabled={
                  Number(selectedEscrow.balance) === 0 ||
                  !selectedEscrow.balance
                }
                variant="destructive"
                className="w-full"
              >
                <Flame className="mr-2" />
                Start Dispute
              </Button>
            )}

          {userRolesInEscrow.includes("disputeResolver") &&
            activeTab === "disputeResolver" &&
            !selectedEscrow.resolvedFlag &&
            selectedEscrow.disputeFlag && (
              <Button
                onClick={handleOpen}
                className="bg-green-800 hover:bg-green-700 w-full"
              >
                <Handshake className="mr-2" />
                Resolve Dispute
              </Button>
            )}
        </div>

        <div className="mt-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              dialogStates.second.setIsOpen(true);
            }}
            className="w-full"
          >
            <CircleDollarSignIcon className="mr-2" />
            Fund Escrow
          </Button>
        </div>
      </div>
    </div>
  );
};
