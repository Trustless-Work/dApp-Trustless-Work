import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SkeletonFundEscrow from "./utils/SkeletonFundEscrow";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEscrowBoundedStore } from "../../store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";
import useEditMilestonesDialog from "./hooks/edit-milestones-dialog.hook";

interface FundEscrowDialogProps {
  isEditMilestoneDialogOpen: boolean;
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
}

const EditMilestonesDialog = ({
  isEditMilestoneDialogOpen,
  setIsEditMilestoneDialogOpen,
}: FundEscrowDialogProps) => {
  const { form, onSubmit, handleClose } = useEditMilestonesDialog({
    setIsEditMilestoneDialogOpen,
  });
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);

  return (
    <Dialog open={isEditMilestoneDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editing - {selectedEscrow?.title}</DialogTitle>
          <DialogDescription>
            You will be able to edit the Escrow milestones, both add and delete.
            But you will not be able to do it when one of them is already
            completed or approved.
          </DialogDescription>
        </DialogHeader>

        {false ? (
          <SkeletonFundEscrow />
        ) : (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <div className="flex flex-col ms-center gap-4">milestones</div>

              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMilestonesDialog;
