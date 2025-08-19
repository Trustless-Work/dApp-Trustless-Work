import { Notification } from "@/types/notification.entity";
import { NotificationService } from "@/modules/notifications/server/notification.firebase";

export class NotificationClientService {
  static subscribeToNotifications(
    address: string,
    callback: (notifications: Notification[]) => void,
  ): () => void {
    return NotificationService.subscribeToNotifications(address, callback);
  }

  static async markAsRead(notificationId: string): Promise<void> {
    return NotificationService.markAsRead(notificationId);
  }

  static async markAllAsRead(address: string): Promise<void> {
    return NotificationService.markAllAsRead(address);
  }

  static async clearAllNotifications(address: string): Promise<void> {
    return NotificationService.clearAllNotifications(address);
  }
}
