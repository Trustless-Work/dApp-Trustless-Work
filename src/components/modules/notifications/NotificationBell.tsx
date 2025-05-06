import { BellIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "./NotificationList";
import { useNotifications } from "@/components/modules/notifications/hooks/notification.hook";

export const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    isOpen,
    handleOpenChange,
    clearAllNotifications,
  } = useNotifications();

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-full border-0"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center p-2">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 h-[500px] px-2" align="end">
        <NotificationList
          notifications={notifications}
          onClearAll={clearAllNotifications}
        />
      </PopoverContent>
    </Popover>
  );
};
