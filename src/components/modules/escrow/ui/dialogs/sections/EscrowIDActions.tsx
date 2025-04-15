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
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Escrow } from "@/@types/escrow.entity";
import { toast } from "@/hooks/toast.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import TooltipInfo from "@/components/utils/ui/Tooltip";

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
    <div className="flex flex-col justify-center w-full md:w-1/5">
      <p className="text-center mb-3 text-sm">
        <span className="uppercase font-bold">
          {selectedEscrow.trustline?.name || "No Trustline"} | Escrow ID:
        </span>
        <div className="flex items-center justify-center">
          {formatAddress(selectedEscrow.contractId)}
          <button
            onClick={() =>
              copyText(selectedEscrow?.contractId, selectedEscrow.contractId)
            }
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <TooltipInfo content="Copy Escrow ID">
              {copiedKeyId ? (
                <Check className={cn("h-4 w-4 text-green-700")} />
              ) : (
                <Copy className={cn("h-4 w-4")} />
              )}
            </TooltipInfo>
          </button>
        </div>
      </p>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          dialogStates.qr.setIsOpen(true);
        }}
        className="w-full mb-3"
        variant="outline"
      >
        <QrCode />
        Show QR Address
      </Button>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          dialogStates.second.setIsOpen(true);
        }}
        className="w-full"
      >
        <CircleDollarSignIcon />
        Fund Escrow
      </Button>

      {(userRolesInEscrow.includes("approver") ||
        userRolesInEscrow.includes("serviceProvider")) &&
        (activeTab === "approver" || activeTab === "serviceProvider") &&
        !selectedEscrow.disputeFlag &&
        !selectedEscrow.resolvedFlag && (
          <button
            type="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
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
              }
            }}
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
            className="w-full cursor-pointer"
          >
            <Button
              disabled={
                Number(selectedEscrow.balance) === 0 || !selectedEscrow.balance
              }
              variant="destructive"
              className="mt-3 pointer-events-none w-full"
            >
              <Flame />
              Start Dispute
            </Button>
          </button>
        )}

      {userRolesInEscrow.includes("disputeResolver") &&
        activeTab === "disputeResolver" &&
        !selectedEscrow.resolvedFlag &&
        selectedEscrow.disputeFlag && (
          <Button
            onClick={handleOpen}
            className="bg-green-800 hover:bg-green-700 mt-3"
          >
            <Handshake />
            Resolve Dispute
          </Button>
        )}
    </div>
  );
};
