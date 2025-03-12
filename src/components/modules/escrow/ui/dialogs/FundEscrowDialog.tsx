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
import { useGlobalBoundedStore } from "@/core/store/data";
import { FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import useFundEscrowDialogHook from "./hooks/fund-escrow-dialog.hook";
import { useEscrowBoundedStore } from "../../store/ui";
import SkeletonFundEscrow from "./utils/SkeletonFundEscrow";
import { DollarSign } from "lucide-react";

interface FundEscrowDialogProps {
  isSecondDialogOpen: boolean;
  setIsSecondDialogOpen: (value: boolean) => void;
}

const FundEscrowDialog = ({
  isSecondDialogOpen,
  setIsSecondDialogOpen,
}: FundEscrowDialogProps) => {
  const { form, onSubmit, handleClose } = useFundEscrowDialogHook({
    setIsSecondDialogOpen,
  });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const isFundingEscrow = useEscrowBoundedStore(
    (state) => state.isFundingEscrow,
  );

  return (
    <Dialog open={isSecondDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Funding - {selectedEscrow?.title}</DialogTitle>
          <DialogDescription>
            Allows users to deposit funds into an existing escrow contract,
            securing them until the agreed conditions are met.
          </DialogDescription>
        </DialogHeader>

        {isFundingEscrow ? (
          <SkeletonFundEscrow />
        ) : (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <div className="flex flex-col ms-center gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Amount <span className="text-destructive ml-1">*</span>
                        <TooltipInfo content="The amount to be funded." />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />
                          <Input
                            className="pl-10"
                            placeholder="The amount to be funded"
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
                <Button type="submit">Fund Escrow</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FundEscrowDialog;
