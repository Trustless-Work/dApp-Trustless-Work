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
import { platform } from "os";

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
  const totalAmount = Number(escrow?.amount || 0);
  const serviceProviderPercentage = 100 - (trustlessPercentage + platformFee);

  // Amount
  const trustlessAmount = (totalAmount * trustlessPercentage) / 100;
  const serviceProviderAmount = (totalAmount * serviceProviderPercentage) / 100;
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
            type="Service Provider"
            entity={escrow?.serviceProvider}
            hasPercentage={true}
            percentage={"testeo1%"}
            hasAmount={true}
            amount={"testeo1"}
          />
          <EntityCard
            type="Trustless Work"
            entity={"0x"}
            hasPercentage={true}
            percentage={"testeo2%"}
            hasAmount={true}
            amount={"testeo2"}
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
  const approverFunds = selectedEscrow?.approverFunds || "0";
  const serviceProviderFunds = selectedEscrow?.serviceProviderFunds || "0";
  const escrow = selectedEscrow || recentEscrow;

  const { formatDollar } = useFormatUtils();

  // Percentage
  // const totalAmount = Number(escrow?.amount || 0);
  // const trustlessPercentage = 0.3;
  // const platformFee = Number(escrow?.platformFee || 0);

  // const remainingPercentage = 100 - (trustlessPercentage + platformFee);

  // // Amounts
  // const trustlessAmount = (totalAmount * trustlessPercentage) / 100;
  // const platformAmount = (totalAmount * platformFee) / 100;

  // // Total funds available for approver and service provider
  // const totalAvailableFunds = totalAmount - (trustlessAmount + platformAmount);

  // const totalAmount = Number(escrow?.amount || 0);
  // //percentages
  // const trustlessPercentage = 0.3; //WORK HERE
  // const platformPercentage = Number(escrow?.platformFee);
  // const serviceproviderPercentage = 100 - (trustlessPercentage + platformPercentage);
  // const approverPercentageRaw = 100 - (trustlessPercentage + platformPercentage);

  // //Amounts
  // const trustlessAmount = (totalAmount * trustlessPercentage) / 100;
  // const platformAmount = (totalAmount * platformPercentage) / 100;
  // const serviceProviderAmount = (totalAmount * serviceproviderPercentage) / 100;
  // const approverAmount = (totalAmount * approverPercentageRaw) / 100;

  /////////

  //FIX LATER
  const totalAmount = Number(escrow?.amount || 0);

  const trustlessPercentage = 0.3; // Fee  Trustless Work
  const platformPercentage = Number(escrow?.platformFee); // Fee  plataform

  const approverAmount = Number(escrow?.approverFunds || "0"); //
  const serviceProviderAmount = Number(escrow?.serviceProviderFunds || "0");

  if (Math.abs(approverAmount + serviceProviderAmount - totalAmount) > 0.01) {
    console.warn(
      "La suma de las cantidades asignadas no coincide con el monto total",
    );
  }

  const approverTrustlessFee = (approverAmount * trustlessPercentage) / 100;
  const approverPlatformFee = (approverAmount * platformPercentage) / 100;
  const approverFinalAmount =
    approverAmount - approverTrustlessFee - approverPlatformFee;

  const serviceProviderTrustlessFee =
    (serviceProviderAmount * trustlessPercentage) / 100;
  const serviceProviderPlatformFee =
    (serviceProviderAmount * platformPercentage) / 100;
  const serviceProviderFinalAmount =
    serviceProviderAmount -
    serviceProviderTrustlessFee -
    serviceProviderPlatformFee;

  const totalTrustlessFee = approverTrustlessFee + serviceProviderTrustlessFee;
  const totalPlatformFee = approverPlatformFee + serviceProviderPlatformFee;
  console.log("Dispute Aproveder Founds:" + escrow?.approverFunds);

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
            type="Service Provider"
            entity={escrow?.serviceProvider}
            hasPercentage={true}
            percentage={platformPercentage.toString()}
            hasAmount={true}
            amount={serviceProviderFinalAmount.toFixed(2)}
          />
          <EntityCard
            type="Approver"
            entity={escrow?.approver}
            hasPercentage={true}
            percentage={platformPercentage.toString()}
            hasAmount={true}
            amount={approverFinalAmount.toFixed(2)}
          />
          <EntityCard
            type="Trustless Work"
            entity={"0x"}
            hasPercentage={true}
            percentage={trustlessPercentage.toString()}
            hasAmount={true}
            amount={totalTrustlessFee.toFixed(2)}
          />
          <EntityCard
            type="Platform"
            entity={escrow?.platformAddress}
            hasPercentage={true}
            percentage={platformPercentage.toString()}
            hasAmount={true}
            amount={totalPlatformFee.toFixed(2)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
