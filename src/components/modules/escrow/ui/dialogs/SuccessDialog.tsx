import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useSuccessDialogHook from "./hooks/success-dialog.hook";
import Link from "next/link";
import Image from "next/image";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { cn } from "@/lib/utils";
import { Escrow } from "@/@types/escrow.entity";
import EntityCard from "./cards/EntityCard";
import useSuccessReleaseDialogHook from "./hooks/success-release-dialog.hook";
import { Check, Copy } from "lucide-react";
import { useGlobalBoundedStore } from "@/core/store/data";
import useSuccessResolveDisputeDialog from "./hooks/success-resolve-dispute-dialog.hook";
import { useEscrowUIBoundedStore } from "../../store/ui";

interface SuccessDialogProps {
  title: string;
  description: string;
  recentEscrow?: Escrow;
  isSuccessDialogOpen: boolean;
  setIsSuccessDialogOpen: (value: boolean) => void;
}

const SuccessDialog = ({
  title,
  description,
  recentEscrow,
  isSuccessDialogOpen,
  setIsSuccessDialogOpen,
}: SuccessDialogProps) => {
  const { handleClose } = useSuccessDialogHook({ setIsSuccessDialogOpen });
  const { copyText, copiedKeyId } = useCopyUtils();
  const { formatAddress } = useFormatUtils();

  return (
    <Dialog open={isSuccessDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mb-5">
            {description}{" "}
            <Link
              href={`https://stellar.expert/explorer/testnet/contract/${recentEscrow?.contractId}`}
              className="text-primary"
              target="_blank"
            >
              Stellar Explorer
            </Link>
          </DialogDescription>

          <div className="flex items-center justify-center">
            <Image
              src="/assets/stellar-expert-blue.svg"
              alt="Stellar Explorer Icon"
              className="mt-6"
              width={80}
              height={80}
            />
          </div>
        </DialogHeader>

        <div className="flex flex-col mt-5">
          <span className="font-bold mt-3">Escrow ID:</span>
          <div className="flex gap-3 items-center">
            <div className="flex flex-col items-center justify-center">
              <p className="truncate text-xs">
                {formatAddress(recentEscrow?.contractId)}
              </p>
            </div>
            <button
              onClick={() =>
                copyText(recentEscrow?.contractId, recentEscrow?.contractId)
              }
              className="hover:bg-muted rounded-md transition-colors"
              title="Copy address"
            >
              {copiedKeyId ? (
                <Check size={15} className="text-green-700" />
              ) : (
                <Copy
                  size={15}
                  className={cn(
                    copiedKeyId
                      ? "text-green-700"
                      : "dark:text-white text-muted-foreground",
                  )}
                />
              )}
            </button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;

interface SuccessReleaseDialogProps {
  title: string;
  description: string;
  recentEscrow?: Escrow;
  isSuccessReleaseDialogOpen: boolean;
  setIsSuccessReleaseDialogOpen: (value: boolean) => void;
}

export const SuccessReleaseDialog = ({
  title,
  description,
  recentEscrow,
  isSuccessReleaseDialogOpen,
  setIsSuccessReleaseDialogOpen,
}: SuccessReleaseDialogProps) => {
  const { handleClose } = useSuccessReleaseDialogHook({
    setIsSuccessReleaseDialogOpen,
  });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const escrow = selectedEscrow || recentEscrow;

  const { formatDollar } = useFormatUtils();

  // Percentage
  const trustlessPercentage = 0.3;
  const platformFee = Number(escrow?.platformFee || 0);
  const receiverPercentage = 100 - (trustlessPercentage + platformFee);

  // Amount
  const totalAmount = Number(escrow?.amount || 0);
  const trustlessAmount = (totalAmount * trustlessPercentage) / 100;
  const receiverAmount = (totalAmount * receiverPercentage) / 100;
  const platformAmount = (totalAmount * platformFee) / 100;

  return (
    <Dialog open={isSuccessReleaseDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mb-5">
            {description}{" "}
            <Link
              href={`https://stellar.expert/explorer/testnet/contract/${escrow?.contractId}`}
              className="text-primary"
              target="_blank"
            >
              Stellar Explorer
            </Link>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-5">
          <p className="text-xs">
            <span className="font-bold">Total Amount: </span>
            {formatDollar(escrow?.amount)}
          </p>
          {recentEscrow && (
            <p className="text-xs">
              <span className="font-bold">Total Balance:</span>{" "}
              {formatDollar(escrow?.balance)}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <EntityCard
            type="Receiver"
            entity={escrow?.receiver}
            hasPercentage={true}
            percentage={receiverPercentage.toString()}
            hasAmount={true}
            amount={receiverAmount.toString()}
          />
          <EntityCard
            type="Trustless Work"
            entity={"0x"}
            hasPercentage={true}
            percentage={trustlessPercentage.toString()}
            hasAmount={true}
            amount={trustlessAmount.toString()}
          />
          <EntityCard
            type="Platform"
            entity={escrow?.platformAddress}
            hasPercentage={true}
            percentage={platformFee.toString()}
            hasAmount={true}
            amount={platformAmount.toString()}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface SuccessResolveDisputeProps {
  title: string;
  description: string;
  recentEscrow?: Escrow;
  isSuccessResolveDisputeDialogOpen: boolean;
  setIsSuccessResolveDisputeDialogOpen: (value: boolean) => void;
}

export const SuccessResolveDisputeDialog = ({
  title,
  description,
  recentEscrow,
  isSuccessResolveDisputeDialogOpen,
  setIsSuccessResolveDisputeDialogOpen,
}: SuccessResolveDisputeProps) => {
  const { handleClose } = useSuccessResolveDisputeDialog({
    setIsSuccessResolveDisputeDialogOpen,
  });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const receiverResolveFromStore = useEscrowUIBoundedStore(
    (state) => state.receiverResolve,
  );
  const approverResolveFromStore = useEscrowUIBoundedStore(
    (state) => state.approverResolve,
  );

  const receiverResolve =
    receiverResolveFromStore && receiverResolveFromStore !== ""
      ? receiverResolveFromStore
      : selectedEscrow?.receiverFunds;

  const approverResolve =
    approverResolveFromStore && approverResolveFromStore !== ""
      ? approverResolveFromStore
      : selectedEscrow?.approverFunds;

  const escrow = selectedEscrow || recentEscrow;
  const { formatDollar } = useFormatUtils();

  const trustlessPercentage = 0.3;
  const trustlessWorkFee = 0.003;
  const platformPercentage = Number(escrow?.platformFee);

  const trustlessWorkAmount = Number(escrow?.amount) * trustlessWorkFee;
  const platformFee = parseFloat(escrow?.platformFee || "0");

  const parsedApproverFunds = parseFloat(approverResolve || "0") || 0;
  const parsedReceiverFunds = parseFloat(receiverResolve || "0") || 0;

  const approverDeductions =
    parsedApproverFunds * (platformFee / 100) +
    parsedApproverFunds * trustlessWorkFee;

  const receiverDeductions =
    parsedReceiverFunds * (platformFee / 100) +
    parsedReceiverFunds * trustlessWorkFee;

  const approverNet = parsedApproverFunds - approverDeductions;
  const receiverNet = parsedReceiverFunds - receiverDeductions;

  const totalPlatformAmount =
    selectedEscrow?.amount && !isNaN(Number(selectedEscrow.amount))
      ? Number(selectedEscrow.amount) * (platformFee / 100)
      : 0;

  return (
    <Dialog open={isSuccessResolveDisputeDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mb-5">
            {description}{" "}
            <Link
              href={`https://stellar.expert/explorer/testnet/contract/${escrow?.contractId}`}
              className="text-primary"
              target="_blank"
            >
              Stellar Explorer
            </Link>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-5">
          <p className="text-xs">
            <span className="font-bold">Total Amount: </span>
            {formatDollar(escrow?.amount)}
          </p>
          {recentEscrow && (
            <p className="text-xs">
              <span className="font-bold">Total Balance:</span>{" "}
              {formatDollar(escrow?.balance)}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <EntityCard
            type="Receiver"
            entity={escrow?.receiver}
            hasPercentage={false}
            hasAmount={true}
            isNet={true}
            amount={receiverNet.toString()}
          />
          <EntityCard
            type="Approver"
            entity={escrow?.approver}
            hasPercentage={false}
            hasAmount={true}
            isNet={true}
            amount={approverNet.toString()}
          />
          <EntityCard
            type="Trustless Work"
            entity={"0x"}
            hasPercentage={true}
            percentage={trustlessPercentage.toString()}
            hasAmount={true}
            amount={trustlessWorkAmount.toString()}
          />
          <EntityCard
            type="Platform"
            entity={escrow?.platformAddress}
            hasPercentage={true}
            percentage={platformPercentage.toString()}
            hasAmount={true}
            amount={totalPlatformAmount.toString()}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
