import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface DeleteEscrowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  escrowTitle: string;
}

export const DeleteEscrowDialog = ({
  isOpen,
  onClose,
  onConfirm,
  escrowTitle,
}: DeleteEscrowDialogProps) => {
  const { t } = useTranslation();

  const handleConfirm = async () => {
    await onConfirm();
    toast.success(t("confirmDialog.trashSuccess"));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("confirmDialog.deleteTitle")}</DialogTitle>
          <DialogDescription>
            {t("confirmDialog.deleteDescription", { title: escrowTitle })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {t("common.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
