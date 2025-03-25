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
import { useGlobalBoundedStore } from "@/core/store/data"; // Import global store
import { DollarSign } from "lucide-react";
import type { Escrow } from "../../../../../@types/escrow.entity";

interface ResolveDisputeEscrowDialogProps {
  isResolveDisputeDialogOpen: boolean;
  setIsResolveDisputeDialogOpen: (value: boolean) => void;
  recentEscrow?: Escrow; // Used as a fallback if `selectedEscrow` is not available
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

  // Get the `selectedEscrow` from the global state
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const escrow = selectedEscrow || recentEscrow; // Use `selectedEscrow` first, fallback to `recentEscrow`

  const [approverNet, setApproverNet] = useState<number | null>(null);
  const [serviceProviderNet, setServiceProviderNet] = useState<number | null>(
    null,
  );

  const trustlessWorkFee = 0.003;

  useEffect(() => {
    if (!escrow) {
      console.warn("Escrow is undefined. Skipping calculations.");
      return;
    }

    console.log("Escrow Data:", escrow);

    // Convert `platformFee` to a safe number
    const platformFee = parseFloat(escrow?.platformFee || "0"); // Ensures a valid value
    console.log("Platform Fee:", platformFee);

    // Get fund values
    const approverFunds = parseFloat(form.getValues("approverFunds")) || 0;
    const serviceProviderFunds =
      parseFloat(form.getValues("serviceProviderFunds")) || 0;

    console.log("Approver Funds:", approverFunds);
    console.log("Service Provider Funds:", serviceProviderFunds);

    if (
      isNaN(approverFunds) ||
      isNaN(serviceProviderFunds) ||
      isNaN(platformFee)
    ) {
      console.warn("Invalid values detected. Skipping calculations.");
      setApproverNet(null);
      setServiceProviderNet(null);
      return;
    }

    // Calculate deductions
    const approverDeductions =
      approverFunds * (platformFee / 100) + approverFunds * trustlessWorkFee;
    const serviceProviderDeductions =
      serviceProviderFunds * (platformFee / 100) +
      serviceProviderFunds * trustlessWorkFee;

    console.log("Approver Deductions:", approverDeductions);
    console.log("Service Provider Deductions:", serviceProviderDeductions);

    // Compute final net amounts
    setApproverNet(approverFunds - approverDeductions);
    setServiceProviderNet(serviceProviderFunds - serviceProviderDeductions);

    console.log("Approver Net:", approverFunds - approverDeductions);
    console.log(
      "Service Provider Net:",
      serviceProviderFunds - serviceProviderDeductions,
    );
  }, [form.watch("approverFunds"), form.watch("serviceProviderFunds"), escrow]);

  if (!escrow) {
    return null; // Prevent rendering if `escrow` is not available
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

              <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center">
                <div className="text-sm text-white bg-gray-800 p-2 rounded-md">
                  {approverNet !== null && serviceProviderNet !== null ? (
                    <>
                      <p>
                        <strong>Approver Net:</strong> ${approverNet.toFixed(2)}
                      </p>
                      <p>
                        <strong>Service Provider Net:</strong> $
                        {serviceProviderNet.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400">
                      Enter values to see the calculation
                    </p>
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
