import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
  const [isRestoring, setIsRestoring] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsRestoring(true);
      await onConfirm();
      toast.success(t("confirmDialog.restoreSuccess"));
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t("common.error"));
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-auto max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t("confirmDialog.restoreTitle")}</DialogTitle>
          <DialogDescription>
            {t("confirmDialog.restoreDescription", {
              title: escrowTitle,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto" />
        <DialogFooter className="flex-shrink-0 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("common.restoring")}
              </>
            ) : (
              t("common.restore")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
