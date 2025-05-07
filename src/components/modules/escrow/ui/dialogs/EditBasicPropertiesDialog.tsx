import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalBoundedStore } from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import useEditBasicPropertiesDialog from "./hooks/edit-basic-properties-dialog.hook";
import { EditBasicPropertiesForm } from "./forms/EditBasicPropertiesForm";
import { SkeletonEditBasicProperties } from "./utils/SkeletonEditBasicProperties";

interface EditBasicPropertiesDialogProps {
  isEditBasicPropertiesDialogOpen: boolean;
  setIsEditBasicPropertiesDialogOpen: (value: boolean) => void;
}

const EditBasicPropertiesDialog = ({
  isEditBasicPropertiesDialogOpen,
  setIsEditBasicPropertiesDialogOpen,
}: EditBasicPropertiesDialogProps) => {
  const { handleClose } = useEditBasicPropertiesDialog({
    setIsEditBasicPropertiesDialogOpen,
  });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const isEditingBasicProperties = useEscrowUIBoundedStore(
    (state) => state.isEditingBasicProperties,
  );

  if (!selectedEscrow) return null;

  return (
    <Dialog open={isEditBasicPropertiesDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Editing - {selectedEscrow?.title}</DialogTitle>
          <DialogDescription>
            You can edit the basic properties of the escrow, but not if the
            milestones are not completed or approved and if there is no balance.
          </DialogDescription>
        </DialogHeader>

        {isEditingBasicProperties ? (
          <SkeletonEditBasicProperties />
        ) : (
          <EditBasicPropertiesForm
            setIsEditBasicPropertiesDialogOpen={
              setIsEditBasicPropertiesDialogOpen
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBasicPropertiesDialog;
