import { NotificationService } from "@/services/notificationService";
import { Notification } from "@/@types/notification.entity";

interface TriggerNotificationInput {
  contractId: string;
  type: string;
  title: string;
  message: string;
  entities?: Partial<Notification["entities"]>;
  recipients: string[]; // Wallet addresses
  url?: string; // opcional
}

export async function triggerNotification({
  contractId,
  type,
  title,
  message,
  entities = {},
  recipients,
  url,
}: TriggerNotificationInput): Promise<void> {
  const notificationId = await NotificationService.createNotification({
    contractId,
    type,
    title,
    message,
    entities,
    url,
  });

  await Promise.all(
    recipients.map((walletAddress) =>
      NotificationService.assignNotificationToUser(
        notificationId,
        walletAddress,
      ),
    ),
  );
}
