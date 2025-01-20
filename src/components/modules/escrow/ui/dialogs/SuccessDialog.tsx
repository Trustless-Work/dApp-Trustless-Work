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
import { LuCheck, LuClipboard } from "react-icons/lu";
import { Escrow } from "@/@types/escrow.entity";
import EntityCard from "./components/EntityCard";
import useSuccessReleaseDialogHook from "./hooks/success-release-dialog.hook";

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
                <LuCheck size={15} className="text-green-700" />
              ) : (
                <LuClipboard
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

  const { formatDollar } = useFormatUtils();

  // Percentage
  const trustlessPercentage = 0.3;
  const platformFee = Number(recentEscrow?.platformFee || 0);
  const totalAmount = Number(recentEscrow?.amount || 0);
  const serviceProviderPercentage = 100 - (trustlessPercentage + platformFee);

  // Amount
  const trustlessAmount = (totalAmount * trustlessPercentage) / 100;
  const platformAmount = totalAmount * platformFee;
  const serviceProviderAmount = (totalAmount * serviceProviderPercentage) / 100;

  return (
    <Dialog open={isSuccessReleaseDialogOpen} onOpenChange={handleClose}>
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
        </DialogHeader>
        <div className="flex justify-between mt-5">
          <p className="text-xs">
            <span className="font-bold">Total Amount: </span>
            {formatDollar(recentEscrow?.amount)}
          </p>
          <p className="text-xs">
            <span className="font-bold">Total Balance:</span>{" "}
            {formatDollar(recentEscrow?.balance)}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <EntityCard
            type="Service Provider"
            entity={recentEscrow?.serviceProvider!}
            hasPercentage={true}
            percentage={serviceProviderPercentage.toString()}
            hasAmount={true}
            amount={serviceProviderAmount.toString()}
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
            entity={recentEscrow?.platformAddress!}
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

export default SuccessDialog;
