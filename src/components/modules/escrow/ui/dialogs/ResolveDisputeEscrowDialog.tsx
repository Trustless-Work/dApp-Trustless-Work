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
import { DollarSign } from "lucide-react";

interface ResolveDisputeEscrowDialogProps {
  isResolveDisputeDialogOpen: boolean;
  setIsResolveDisputeDialogOpen: (value: boolean) => void;
}

const ResolveDisputeEscrowDialog = ({
  isResolveDisputeDialogOpen,
  setIsResolveDisputeDialogOpen,
}: ResolveDisputeEscrowDialogProps) => {
  const { form, onSubmit, handleClose } = useResolveDisputeEscrowDialogHook({
    setIsResolveDisputeDialogOpen,
  });
  const isResolvingDispute = useEscrowBoundedStore(
    (state) => state.isResolvingDispute,
  );

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
            That is, of the total of both entities, each will receive less for
            these deductions.
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
              <div className="flex flex-col ms-center gap-4">
                <FormField
                  control={form.control}
                  name="approverFunds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Approver Amount
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
                            onChange={(e) => {
                              field.onChange(e);
                            }}
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
                        Service Provider Amount
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
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
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
