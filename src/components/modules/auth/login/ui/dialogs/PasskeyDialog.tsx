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
import { usePasskeyRegister } from "@/components/modules/auth/wallet/hooks/passkey.hook";

interface PasskeyDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function PasskeyDialog({ open, setOpen }: PasskeyDialogProps) {
  const { t } = useTranslation();
  const { register, login, loading, error, keyId, contractId, success, reset } =
    usePasskeyRegister();

  const handleCreatePasskey = () => {
    register("User");
  };
  const handleUsePasskey = () => {
    login();
  };

  // Optionally reset state when dialog closes
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            disabled={loading}
          >
            <KeyRound className="w-5 h-5" />
            {loading && !success
              ? t("common.loading", "Cargando...")
              : t("passkeyDialog.create", "Crear Passkey")}
          </Button>
          <Button
            variant="outline"
            onClick={handleUsePasskey}
            className="flex items-center gap-2 text-base"
            disabled={loading}
          >
            <Fingerprint className="w-5 h-5" />
            {loading && !success
              ? t("common.loading", "Cargando...")
              : t("passkeyDialog.useExisting", "Usar Passkey Existente")}
          </Button>
          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}
          {success && keyId && contractId && (
            <div className="text-green-600 text-sm text-center">
              {t("passkeyDialog.success", "¡Registro exitoso!")}
              <br />
              <span className="break-all">Key ID: {keyId}</span>
              <br />
              <span className="break-all">Contract ID: {contractId}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            {t("passkeyDialog.cancel", "Cancelar")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
