import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { NotificationService } from "@/services/notificationService";
import { useWallet } from "@/components/modules/auth/wallet/hooks/wallet.hook";

export function useNotifications() {
  const { getWalletAddress } = useWallet();
  const queryClient = useQueryClient();

  const { data: walletAddress } = useQuery({
    queryKey: ["walletAddress"],
    queryFn: getWalletAddress,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", walletAddress],
    queryFn: () => NotificationService.getUserNotifications(walletAddress!),
    enabled: !!walletAddress,
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const clearAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      const address = await getWalletAddress();
      if (!address) throw new Error("Wallet not connected");
      return NotificationService.clearAllNotifications(address);
    },
    onSuccess: async () => {
      const address = await getWalletAddress();
      if (address) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", address],
        });
      }
    },
  });

  return {
    notifications,
    unreadCount,
    clearAllNotifications: clearAllNotificationsMutation.mutate,
  };
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { getWalletAddress } = useWallet();

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const walletAddress = await getWalletAddress();
      if (!walletAddress) throw new Error("Wallet not connected");
      return NotificationService.markAsRead(notificationId, walletAddress);
    },
    onSuccess: async () => {
      const walletAddress = await getWalletAddress();
      if (walletAddress) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", walletAddress],
        });
      }
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const walletAddress = await getWalletAddress();
      if (!walletAddress) throw new Error("Wallet not connected");
      return NotificationService.markAllAsRead(walletAddress);
    },
    onSuccess: async () => {
      const walletAddress = await getWalletAddress();
      if (walletAddress) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", walletAddress],
        });
      }
    },
  });

  return {
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
}
