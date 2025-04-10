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
import { useEscrowUIBoundedStore } from "../../store/ui";
import SkeletonFundEscrow from "./utils/SkeletonFundEscrow";
import { DollarSign } from "lucide-react";
import useCompleteMilestoneDialogHook from "./hooks/complete-milestone-dialog.hook";
import { useEscrowBoundedStore } from "../../store/data";

interface CompleteMilestoneDialogProps {
  isCompleteMilestoneDialogOpen: boolean;
  setIsCompleteMilestoneDialogOpen: (value: boolean) => void;
}

const CompleteMilestoneDialog = ({
  isCompleteMilestoneDialogOpen,
  setIsCompleteMilestoneDialogOpen,
}: CompleteMilestoneDialogProps) => {
  const { form, onSubmit, handleClose, setIsDialogOpen } =
    useCompleteMilestoneDialogHook({
      setIsCompleteMilestoneDialogOpen,
    });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const isFundingEscrow = useEscrowUIBoundedStore(
    (state) => state.isFundingEscrow,
  );
  const completingMilestone = useEscrowBoundedStore(
    (state) => state.completingMilestone,
  );

  return (
    <>
      <Dialog open={isCompleteMilestoneDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="truncate">
              Complete - {completingMilestone?.description}
            </DialogTitle>
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
                onSubmit={() => console.log("first")}
                className="grid gap-4 py-4"
              >
                <div className="flex flex-col ms-center gap-4">
                  <FormField
                    control={form.control}
                    name="evidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Evidence{" "}
                          <span className="text-destructive ml-1">*</span>
                          <TooltipInfo content="The evidence that you've completed the milestone." />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                              size={18}
                            />
                            <Input
                              className="pl-10"
                              placeholder="The evidence of your work"
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
                  <Button
                    type="button"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setIsCompleteMilestoneDialogOpen(false);
                    }}
                  >
                    Complete Milestone
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompleteMilestoneDialog;
