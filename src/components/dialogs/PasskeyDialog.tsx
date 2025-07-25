import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { KeyRound, Fingerprint } from "lucide-react";

interface PasskeyDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function PasskeyDialog({ open, setOpen }: PasskeyDialogProps) {
  const { t } = useTranslation();

  // Aquí va la lógica real de Passkey
  const handleCreatePasskey = () => {
    // TODO: Implementar lógica para crear passkey
    setOpen(false);
  };
  const handleUsePasskey = () => {
    // TODO: Implementar lógica para usar passkey existente
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>
            {t("passkeyDialog.title", "Elige una opción de Passkey")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            variant="default"
            onClick={handleCreatePasskey}
            className="flex items-center gap-2 text-base"
          >
            <KeyRound className="w-5 h-5" />
            {t("passkeyDialog.create", "Crear Passkey")}
          </Button>
          <Button
            variant="outline"
            onClick={handleUsePasskey}
            className="flex items-center gap-2 text-base"
          >
            <Fingerprint className="w-5 h-5" />
            {t("passkeyDialog.useExisting", "Usar Passkey Existente")}
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {t("passkeyDialog.cancel", "Cancelar")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
