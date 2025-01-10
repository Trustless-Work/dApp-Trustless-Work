import { Escrow } from "@/@types/escrow.entity";
import { useEffect } from "react";
import { getBalance } from "../../../services/getBalance";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";

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
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);

  useEffect(() => {
    const fetchBalance = async () => {
      if (selectedEscrow) {
        const response = await getBalance(selectedEscrow?.contractId, address);

        const balance = response.data.balance;
        const plainBalance = JSON.parse(JSON.stringify(balance));

        if (selectedEscrow.balance !== plainBalance) {
          await updateEscrow({
            escrowId: selectedEscrow.id,
            payload: plainBalance,
          });
        }
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
