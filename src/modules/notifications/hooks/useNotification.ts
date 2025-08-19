import { useGlobalAuthenticationStore } from "@/store/data";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/types/notification.entity";
import { NotificationClientService } from "../services/notification.service";
import { useNotificationsMutations } from "./tanstack/useNotificationsMutations";

interface UseNotificationsProps {
  notification?: Notification;
}

export const useNotifications = (props?: UseNotificationsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const address = useGlobalAuthenticationStore((state) => state.address);
  const queryClient = useQueryClient();
  const { markAsRead, markAllAsRead, clearAllNotifications } =
    useNotificationsMutations(address);

  useEffect(() => {
    if (!address) return;
    const unsubscribe = NotificationClientService.subscribeToNotifications(
      address,
      (updated) => {
        setNotifications(updated);
        queryClient.setQueryData(["notifications", address], updated);
      },
    );
    return () => unsubscribe();
  }, [address, queryClient]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleClick = () => {
    if (props?.notification && !props.notification.read) {
      markAsRead(props.notification.id);
    }
  };

  return {
    notifications,
    unreadCount,
    isOpen,
    handleClick,
    handleOpenChange,
    markAsRead,
    clearAllNotifications,
  };
};
