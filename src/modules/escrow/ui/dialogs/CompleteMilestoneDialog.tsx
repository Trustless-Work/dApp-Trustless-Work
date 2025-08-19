import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import TooltipInfo from "@/shared/utils/Tooltip";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { Loader2, PackageCheck } from "lucide-react";
import useCompleteMilestoneDialogHook from "../../hooks/useChangeStatusEscrowDialog";
import { useEscrowBoundedStore } from "../../store/data";
import { Textarea } from "@/ui/textarea";

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
        <DialogContent className="sm:max-w-[550px]">
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

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit((data) => onSubmit(data.newEvidence))}
              className="grid gap-4 py-4"
            >
              <div className="flex flex-col ms-center gap-4">
                <FormField
                  control={form.control}
                  name="newEvidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Evidence (optional){" "}
                        <TooltipInfo content="The evidence that you've completed the milestone." />
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="The evidence of your work"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isChangingStatus}>
                  {isChangingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <PackageCheck className="w-4 h-4" />
                      Complete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompleteMilestoneDialog;
