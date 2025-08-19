import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { useGlobalBoundedStore } from "@/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { useEditSingleBasicPropertiesDialog } from "../../hooks/single-release/useEditSingleBasicPropertiesDialog";
import { EditSingleBasicPropertiesForm } from "../forms/EditSingleBasicPropertiesForm";
import { EditMultiBasicPropertiesForm } from "../forms/EditMultiBasicPropertiesForm";

interface EditBasicPropertiesDialogProps {
  isEditBasicPropertiesDialogOpen: boolean;
  setIsEditBasicPropertiesDialogOpen: (value: boolean) => void;
}

const EditBasicPropertiesDialog = ({
  isEditBasicPropertiesDialogOpen,
  setIsEditBasicPropertiesDialogOpen,
}: EditBasicPropertiesDialogProps) => {
  const { handleClose } = useEditSingleBasicPropertiesDialog({
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

        {selectedEscrow.type === "single-release" ? (
          <EditSingleBasicPropertiesForm
            setIsEditBasicPropertiesDialogOpen={
              setIsEditBasicPropertiesDialogOpen
            }
            isEditingBasicProperties={isEditingBasicProperties}
          />
        ) : (
          <EditMultiBasicPropertiesForm
            setIsEditBasicPropertiesDialogOpen={
              setIsEditBasicPropertiesDialogOpen
            }
            isEditingBasicProperties={isEditingBasicProperties}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBasicPropertiesDialog;
