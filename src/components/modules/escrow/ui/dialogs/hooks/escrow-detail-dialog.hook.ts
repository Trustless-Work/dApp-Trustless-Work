import { Escrow } from "@/@types/escrow.entity";
import { useEffect } from "react";
import { getBalance } from "../../../services/getBalance";
import { useGlobalAuthenticationStore } from "@/core/store/data";

interface useEscrowDetailDialogProps {
  setIsDialogOpen: (value: boolean) => void;
  setSelectedEscrow: (selectedEscrow?: Escrow) => void;
  selectedEscrow: Escrow | null;
}

const useEscrowDetailDialog = ({
  setIsDialogOpen,
  setSelectedEscrow,
  selectedEscrow,
}: useEscrowDetailDialogProps) => {
  const address = useGlobalAuthenticationStore((state) => state.address);

  useEffect(() => {
    const fetchBalance = async () => {
      if (selectedEscrow) {
        const response = await getBalance(selectedEscrow?.contractId!, address);

        console.log(response);
      }
    };

    fetchBalance();
  }, [selectedEscrow]);

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedEscrow(undefined);
  };

  return { handleClose };
};

export default useEscrowDetailDialog;
