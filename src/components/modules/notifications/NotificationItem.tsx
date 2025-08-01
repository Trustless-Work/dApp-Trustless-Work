import { Notification } from "@/@types/notification.entity";
import { cn } from "@/lib/utils";
import { useNotifications } from "./hooks/notification.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";
interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { handleClick } = useNotifications({ notification });
  const { formatDateFromFirebase } = useFormatUtils();

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
          <div className="flex justify-between">
            <h4 className="text-sm font-medium">{notification.title}</h4>
            <p className="text-xs text-muted-foreground">
              {formatDateFromFirebase(
                notification.createdAt.seconds,
                notification.createdAt.nanoseconds,
              )}
            </p>
          </div>
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
};
