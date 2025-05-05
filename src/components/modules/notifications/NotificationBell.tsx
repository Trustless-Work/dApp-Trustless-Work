import { BellIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "./NotificationList";
import {
  useNotifications,
  useMarkNotificationAsRead,
} from "@/hooks/notification.hook";
import { useState } from "react";

export function NotificationBell() {
  const { notifications, unreadCount, clearAllNotifications } =
    useNotifications();
  const { markAllAsRead } = useMarkNotificationAsRead();
  const [isOpen, setIsOpen] = useState(false);

  // Marcar todas como leídas cuando se abre el popover
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationList
          notifications={notifications}
          onClearAll={clearAllNotifications}
        />
      </PopoverContent>
    </Popover>
  );
}
