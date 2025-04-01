import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import useResolveDisputeEscrowDialogHook from "./hooks/resolve-dispute-escrow-dialog.hook";
import SkeletonResolveDispute from "./utils/SkeletonResolveDispute";
import { useEscrowBoundedStore } from "../../store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";
import { DollarSign } from "lucide-react";
import type { Escrow } from "../../../../../@types/escrow.entity";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { Card } from "@/components/ui/card";
import { format } from "path";

interface ResolveDisputeEscrowDialogProps {
  isResolveDisputeDialogOpen: boolean;
  setIsResolveDisputeDialogOpen: (value: boolean) => void;
  recentEscrow?: Escrow;
}

const ResolveDisputeEscrowDialog = ({
  isResolveDisputeDialogOpen,
  setIsResolveDisputeDialogOpen,
  recentEscrow,
}: ResolveDisputeEscrowDialogProps) => {
  const { form, onSubmit, handleClose } = useResolveDisputeEscrowDialogHook({
    setIsResolveDisputeDialogOpen,
  });

  const { formatDollar } = useFormatUtils();

  const isResolvingDispute = useEscrowBoundedStore(
    (state) => state.isResolvingDispute,
  );

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const escrow = selectedEscrow || recentEscrow;

  const [approverNet, setApproverNet] = useState<number | null>(null);
  const [serviceProviderNet, setServiceProviderNet] = useState<number | null>(
    null,
  );
  const [isEqualToAmount, setIsEqualToAmount] = useState<boolean>(false);
  const [isMissing, setIsMissing] = useState<number>(0);

  const trustlessWorkFee = 0.003;

  const approverFunds = form.watch("approverFunds");
  const serviceProviderFunds = form.watch("serviceProviderFunds");

  useEffect(() => {
    const platformFee = parseFloat(escrow?.platformFee || "0");

    const parsedApproverFunds = parseFloat(approverFunds) || 0;
    const parsedServiceProviderFunds = parseFloat(serviceProviderFunds) || 0;

    if (
      isNaN(parsedApproverFunds) ||
      isNaN(parsedServiceProviderFunds) ||
      isNaN(platformFee)
    ) {
      setApproverNet(null);
      setServiceProviderNet(null);
      return;
    }

    const approverDeductions =
      parsedApproverFunds * (platformFee / 100) +
      parsedApproverFunds * trustlessWorkFee;

    const serviceProviderDeductions =
      parsedServiceProviderFunds * (platformFee / 100) +
      parsedServiceProviderFunds * trustlessWorkFee;

    setApproverNet(parsedApproverFunds - approverDeductions);
    setServiceProviderNet(
      parsedServiceProviderFunds - serviceProviderDeductions,
    );

    setIsEqualToAmount(
      parsedApproverFunds + parsedServiceProviderFunds ===
        parseFloat(escrow?.balance || "0"),
    );

    setIsMissing(
      parsedApproverFunds +
        parsedServiceProviderFunds -
        parseFloat(escrow?.balance || "0"),
    );
  }, [approverFunds, serviceProviderFunds, escrow]);

  if (!escrow) {
    return null;
  }

  return (
    <Dialog open={isResolveDisputeDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resolve Dispute</DialogTitle>
          <DialogDescription>
            You, as the dispute resolver, will be able to split the proceeds
            between the two entities. It is important to know that the funds
            will be shared based on the{" "}
            <strong>
              Platform Fee ({escrow.platformFee}%) and the Trustless Work Fee
              (0.3%).
            </strong>
          </DialogDescription>

          <p className="text-end text-sm text-gray-400 p-0">
            <span className="font-extrabold">Balance:</span>{" "}
            {formatDollar(escrow.balance)}
          </p>

          <p className="text-end text-sm text-gray-400 p-0">
            <span className="font-extrabold">Approver Net:</span>{" "}
            {formatDollar(approverNet?.toFixed(2).toString())}
          </p>

          <p className="text-end text-sm text-gray-400 p-0">
            <span className="font-extrabold">Service Provider Net:</span>{" "}
            {formatDollar(serviceProviderNet?.toFixed(2).toString())}
          </p>
        </DialogHeader>

        {isResolvingDispute ? (
          <SkeletonResolveDispute />
        ) : (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="approverFunds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Approver Amount{" "}
                        <span className="text-destructive ml-1">*</span>
                        <TooltipInfo content="The amount for the approver." />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />
                          <Input
                            className="pl-10"
                            placeholder="The amount for the approver"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceProviderFunds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Service Provider Amount{" "}
                        <span className="text-destructive ml-1">*</span>
                        <TooltipInfo content="The amount for the service provider." />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />
                          <Input
                            className="pl-10"
                            placeholder="The amount for the service provider"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isEqualToAmount && (
                <p className="text-destructive text-xs font-bold text-end">
                  Both amounts must be equal to the global balance (
                  {formatDollar(escrow.balance)})
                  <br />
                  Difference: {formatDollar(isMissing.toString())}
                </p>
              )}

              <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between items-center">
                <Button type="submit" disabled={!isEqualToAmount}>
                  Resolve Conflicts
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResolveDisputeEscrowDialog;
