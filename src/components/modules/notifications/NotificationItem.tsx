import { Notification } from "@/@types/notification.entity";
import { cn } from "@/lib/utils";
import { useMarkNotificationAsRead } from "@/hooks/notification.hook";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead } = useMarkNotificationAsRead();
  const router = useRouter();

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.url) {
      router.push(notification.url);
    }
  };

  return (
    <div
      className={cn(
        "p-3 hover:bg-muted/50 cursor-pointer",
        !notification.read && "bg-muted/30",
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <h4 className="text-sm font-medium">{notification.title}</h4>
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>
        </div>
        {!notification.read && (
          <div className="h-2 w-2 rounded-full bg-primary" />
        )}
      </div>
    </div>
  );
}
