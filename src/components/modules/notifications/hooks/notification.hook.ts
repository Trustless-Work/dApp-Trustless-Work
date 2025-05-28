import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useState } from "react";
import { useNotificationQueries } from "../services/notification.queries";
import { Notification } from "@/@types/notification.entity";

interface UseNotificationsProps {
  notification?: Notification;
}

export const useNotifications = (props?: UseNotificationsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const address = useGlobalAuthenticationStore((state) => state.address);
  const { notifications, markAsRead, clearAllNotifications, markAllAsRead } =
    useNotificationQueries(address);

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
