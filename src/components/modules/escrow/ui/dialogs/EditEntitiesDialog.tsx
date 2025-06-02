import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalBoundedStore } from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import useEditEntitiesDialog from "../../hooks/edit-entities-dialog.hook";
import { EditEntitiesForm } from "./forms/EditEntitiesForm";
import { SkeletonEditEntities } from "./utils/SkeletonEditEntities";

interface EditEntitiesDialogProps {
  isEditEntitiesDialogOpen: boolean;
  setIsEditEntitiesDialogOpen: (value: boolean) => void;
}

const EditEntitiesDialog = ({
  isEditEntitiesDialogOpen,
  setIsEditEntitiesDialogOpen,
}: EditEntitiesDialogProps) => {
  const { handleClose } = useEditEntitiesDialog({
    setIsEditEntitiesDialogOpen,
  });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const isEditingEntities = useEscrowUIBoundedStore(
    (state) => state.isEditingEntities,
  );

  if (!selectedEscrow) return null;

  return (
    <Dialog open={isEditEntitiesDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Editing - {selectedEscrow?.title}</DialogTitle>
          <DialogDescription>
            You can edit escrow entities, but not if the milestones are not
            completed or approved and if there is not balance.
          </DialogDescription>
        </DialogHeader>

        {isEditingEntities ? (
          <SkeletonEditEntities />
        ) : (
          <EditEntitiesForm
            setIsEditEntitiesDialogOpen={setIsEditEntitiesDialogOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditEntitiesDialog;
