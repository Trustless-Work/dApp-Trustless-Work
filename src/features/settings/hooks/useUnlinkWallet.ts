"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { walletService } from "@/features/settings/services/wallet.service";
import { USER_WALLETS_QUERY_KEY } from "@/features/settings/hooks/useUserWallets";
import { parseApiError } from "@/lib/api-error";
import { formatAddress } from "@/helpers/format.helper";

export function useUnlinkWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address: string) => walletService.unlinkWallet(address),
    onSuccess: (_data, address) => {
      void queryClient.invalidateQueries({ queryKey: USER_WALLETS_QUERY_KEY });
      toast.success("Wallet unlinked", {
        description: `${formatAddress(address, 6)} was removed from your account.`,
      });
    },
    onError: (error) => {
      const apiError = parseApiError(error);
      const message =
        apiError.status === 409
          ? "You must keep at least one verified wallet on your account."
          : apiError.detail;
      toast.error(message);
    },
  });
}
