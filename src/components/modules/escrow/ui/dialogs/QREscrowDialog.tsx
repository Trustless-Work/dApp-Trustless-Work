import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalBoundedStore } from "@/core/store/data";
import useQREscrowDialogHook from "./hooks/qr-escrow-dialog.hook";
import QRCode from "react-qr-code";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QREscrowDialogProps {
  isQRDialogOpen: boolean;
  setIsQRDialogOpen: (value: boolean) => void;
}

const QREscrowDialog = ({
  isQRDialogOpen,
  setIsQRDialogOpen,
}: QREscrowDialogProps) => {
  // const { form, onSubmit } = useQREscrowDialogHook({
  //   setIsQRDialogOpen,
  // });

  const { handleClose } = useQREscrowDialogHook({
    setIsQRDialogOpen,
  });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);

  return (
    <Dialog open={isQRDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code of Escrow ID</DialogTitle>
          <DialogDescription>
            Scan it and you'll fund the escrow with your wallet.
          </DialogDescription>
        </DialogHeader>
        <Card className={cn("overflow-hidden")}>
          <CardContent className="p-6">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={selectedEscrow?.contractId || ""}
              viewBox={`0 0 256 256`}
            />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default QREscrowDialog;
