import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      toast.success(t("confirmDialog.trashSuccess"));
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t("common.error"));
    } finally {
      setIsDeleting(false);
    }
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
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("common.deleting")}
              </>
            ) : (
              t("common.delete")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
