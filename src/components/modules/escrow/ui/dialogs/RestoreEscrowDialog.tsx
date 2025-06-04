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

interface RestoreEscrowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  escrowTitle: string;
}

export const RestoreEscrowDialog = ({
  isOpen,
  onClose,
  onConfirm,
  escrowTitle,
}: RestoreEscrowDialogProps) => {
  const { t } = useTranslation();

  const handleConfirm = async () => {
    await onConfirm();
    toast.success(t("confirmDialog.restoreSuccess"));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("confirmDialog.restoreTitle")}</DialogTitle>
          <DialogDescription>
            {t("confirmDialog.restoreDescription", {
              title: escrowTitle,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="default" onClick={handleConfirm}>
            {t("common.restore")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
