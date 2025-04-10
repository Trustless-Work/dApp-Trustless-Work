import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { PackageCheck, TypeOutline } from "lucide-react";
import useCompleteMilestoneDialogHook from "./hooks/change-status-escrow-dialog.hook";
import { useEscrowBoundedStore } from "../../store/data";
import SkeletonCompleteMilestone from "./utils/SkeletonCompleteMilestone";
import { Textarea } from "@/components/ui/textarea";

interface CompleteMilestoneDialogProps {
  isCompleteMilestoneDialogOpen: boolean;
  setIsCompleteMilestoneDialogOpen: (value: boolean) => void;
}

const CompleteMilestoneDialog = ({
  isCompleteMilestoneDialogOpen,
  setIsCompleteMilestoneDialogOpen,
}: CompleteMilestoneDialogProps) => {
  const { form, onSubmit, handleClose } = useCompleteMilestoneDialogHook({
    setIsCompleteMilestoneDialogOpen,
  });

  const isChangingStatus = useEscrowUIBoundedStore(
    (state) => state.isChangingStatus,
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
              Complete Milestone - {completingMilestone?.description}
            </DialogTitle>
            <DialogDescription>
              By completing this milestone, you will indicate to your approver
              that you have finished it. You can also add an evidence that you
              did it.
            </DialogDescription>
          </DialogHeader>

          {isChangingStatus ? (
            <SkeletonCompleteMilestone />
          ) : (
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
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
                          <TooltipInfo content="The evidence that you've completed the milestone." />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <TypeOutline
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                              size={18}
                            />
                            <Textarea
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
                  <Button type="submit">
                    <PackageCheck />
                    Complete
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
