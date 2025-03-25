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

  const isResolvingDispute = useEscrowBoundedStore(
    (state) => state.isResolvingDispute,
  );

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const escrow = selectedEscrow || recentEscrow;

  const [approverNet, setApproverNet] = useState<number | null>(null);
  const [serviceProviderNet, setServiceProviderNet] = useState<number | null>(
    null,
  );

  const trustlessWorkFee = 0.003;

  const approverFunds = form.watch("approverFunds");
  const serviceProviderFunds = form.watch("serviceProviderFunds");

  useEffect(() => {
    if (!escrow) {
      console.warn("Escrow is undefined. Skipping calculations.");
      return;
    }

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
      parsedApproverFunds * (platformFee / 100) + parsedApproverFunds * trustlessWorkFee;

    const serviceProviderDeductions =
      parsedServiceProviderFunds * (platformFee / 100) +
      parsedServiceProviderFunds * trustlessWorkFee;

    setApproverNet(parsedApproverFunds - approverDeductions);
    setServiceProviderNet(parsedServiceProviderFunds - serviceProviderDeductions);
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
            <strong>Platform Fee and the Trustless Work Fee.</strong>
          </DialogDescription>
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
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <Input className="pl-10" placeholder="The amount for the approver" {...field} />
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
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <Input className="pl-10" placeholder="The amount for the service provider" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center">
                <div className="text-sm text-white bg-gray-800 p-2 rounded-md">
                  {approverNet !== null && serviceProviderNet !== null ? (
                    <>
                      <p><strong>Approver Net:</strong> ${approverNet.toFixed(2)}</p>
                      <p><strong>Service Provider Net:</strong> ${serviceProviderNet.toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Enter values to see the calculation</p>
                  )}
                </div>
                <Button type="submit">Resolve Conflicts</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResolveDisputeEscrowDialog;