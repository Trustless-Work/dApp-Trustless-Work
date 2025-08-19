import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationClientService } from "../../services/notification.service";

export const useNotificationsMutations = (address: string | null) => {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!notificationId) throw new Error("notificationId is required");
      await NotificationClientService.markAsRead(notificationId);
    },
    onSuccess: () => {
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["notifications", address] });
      }
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected");
      await NotificationClientService.markAllAsRead(address);
    },
    onSuccess: () => {
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["notifications", address] });
      }
    },
  });

  const clearAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected");
      await NotificationClientService.clearAllNotifications(address);
    },
    onSuccess: () => {
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["notifications", address] });
      }
    },
  });

  return {
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    clearAllNotifications: clearAllNotificationsMutation.mutate,
  };
};
