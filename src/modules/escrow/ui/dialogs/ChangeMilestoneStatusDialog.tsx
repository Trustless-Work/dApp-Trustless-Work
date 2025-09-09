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

import { useEscrowBoundedStore } from "../../store/data";
import { Textarea } from "@/ui/textarea";
import { Input } from "@/ui/input";
import useChangeMilestoneStatusDialogHook from "../../hooks/useChangeStatusEscrowDialog";

interface ChangeMilestoneStatusDialogProps {
  isChangeMilestoneStatusDialogOpen: boolean;
  setIsChangeMilestoneStatusDialogOpen: (value: boolean) => void;
}

export const ChangeMilestoneStatusDialog = ({
  isChangeMilestoneStatusDialogOpen,
  setIsChangeMilestoneStatusDialogOpen,
}: ChangeMilestoneStatusDialogProps) => {
  const { form, onSubmit, handleClose } = useChangeMilestoneStatusDialogHook({
    setIsChangeMilestoneStatusDialogOpen,
  });

  const isChangingStatus = useEscrowUIBoundedStore(
    (state) => state.isChangingStatus,
  );
  const completingMilestone = useEscrowBoundedStore(
    (state) => state.completingMilestone,
  );

  return (
    <>
      <Dialog
        open={isChangeMilestoneStatusDialogOpen}
        onOpenChange={handleClose}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="truncate">
              Change Status - {completingMilestone?.description}
            </DialogTitle>
            <DialogDescription>
              By changing the status, you will indicate to your approver that
              you have finished it. You can also add an evidence that you did
              it.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit((data) => onSubmit(data))}
              className="grid gap-4 py-4"
            >
              <div className="flex flex-col ms-center gap-4">
                <FormField
                  control={form.control}
                  name="newStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        New Status{" "}
                        <TooltipInfo content="The new status of the milestone." />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New status"
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

                <FormField
                  control={form.control}
                  name="newEvidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Evidence (optional){" "}
                        <TooltipInfo content="The evidence that you've changed the milestone status." />
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
                      Changing Status...
                    </>
                  ) : (
                    <>
                      <PackageCheck className="w-4 h-4" />
                      Change Status
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
