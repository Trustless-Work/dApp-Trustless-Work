import { Notification } from "@/@types/notification.entity";
import { NotificationItem } from "./NotificationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface NotificationListProps {
  notifications: Notification[];
  onClearAll: () => void;
}

export const NotificationList = ({
  notifications,
  onClearAll,
}: NotificationListProps) => {
  return (
    <div className="grid gap-1">
      <div className="px-4 py-3 flex items-center justify-between border-b">
        <h3 className="text-sm font-medium">Notifications</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 hover:bg-muted transition-colors rounded-md px-3"
          onClick={onClearAll}
          disabled={notifications.length === 0}
        >
          Clear all
        </Button>
      </div>
      <ScrollArea className="h-72">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="grid divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
