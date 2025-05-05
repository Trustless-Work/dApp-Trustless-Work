import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService } from "@/components/modules/notifications/server/notification.firebase";
import { useEffect, useState } from "react";
import { Notification } from "@/@types/notification.entity";

export const useNotificationQueries = (address: string | null) => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!address) return;

    // Subscribe to realtime updates
    const unsubscribe = NotificationService.subscribeToNotifications(
      address,
      (updatedNotifications) => {
        setNotifications(updatedNotifications);
        // Update the query cache to keep everything in sync
        queryClient.setQueryData(
          ["notifications", address],
          updatedNotifications,
        );
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [address, queryClient]);

  const clearAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected");
      return NotificationService.clearAllNotifications(address);
    },
    onSuccess: () => {
      if (address) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", address],
        });
      }
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!address) throw new Error("Wallet not connected");
      return NotificationService.markAsRead(notificationId);
    },
    onSuccess: () => {
      if (address) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", address],
        });
      }
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected");
      return NotificationService.markAllAsRead(address);
    },
    onSuccess: () => {
      if (address) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", address],
        });
      }
    },
  });

  return {
    notifications,
    clearAllNotifications: clearAllNotificationsMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
