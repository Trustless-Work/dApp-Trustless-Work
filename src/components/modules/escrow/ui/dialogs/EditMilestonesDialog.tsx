import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalBoundedStore } from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { useEditSingleMilestonesDialog } from "../../hooks/single-release/edit-single-milestones-dialog.hook";
import { EditSingleMilestonesForm } from "./single-release/EditSingleMilestonesForm";
import { EditMultiMilestonesForm } from "./multi-release/EditMultiMilestonesForm";

interface EditEscrowDialogProps {
  isEditMilestoneDialogOpen: boolean;
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
}

const EditMilestonesDialog = ({
  isEditMilestoneDialogOpen,
  setIsEditMilestoneDialogOpen,
}: EditEscrowDialogProps) => {
  const { handleClose } = useEditSingleMilestonesDialog({
    setIsEditMilestoneDialogOpen,
  });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const isEditingMilestones = useEscrowUIBoundedStore(
    (state) => state.isEditingMilestones,
  );

  if (!selectedEscrow) return null;

  return (
    <Dialog open={isEditMilestoneDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Editing - {selectedEscrow?.title}</DialogTitle>
          <DialogDescription>
            You can edit escrow milestones, but not if they're completed,
            approved released, resolved or disputed.
          </DialogDescription>
        </DialogHeader>

        {selectedEscrow.type === "single-release" ? (
          <EditSingleMilestonesForm
            setIsEditMilestoneDialogOpen={setIsEditMilestoneDialogOpen}
            isEditingMilestones={isEditingMilestones}
          />
        ) : (
          <EditMultiMilestonesForm
            setIsEditMilestoneDialogOpen={setIsEditMilestoneDialogOpen}
            isEditingMilestones={isEditingMilestones}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMilestonesDialog;
