import {
  notificationsCollection,
  userNotificationsCollection,
  db,
} from "@/core/config/firebase/firebase";
import {
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { Notification } from "@/@types/notification.entity";

export const NotificationService = {
  async createNotification(notification: {
    contractId: string;
    type: string;
    title: string;
    message: string;
    entities: Notification["entities"];
    url?: string;
  }): Promise<string> {
    const docRef = await addDoc(notificationsCollection, {
      ...notification,
      read: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async assignNotificationToUser(
    notificationId: string,
    walletAddress: string,
  ): Promise<void> {
    await addDoc(userNotificationsCollection(walletAddress), {
      notificationId,
      read: false,
      createdAt: serverTimestamp(),
    });
  },

  async getUserNotifications(walletAddress: string): Promise<Notification[]> {
    const q = query(userNotificationsCollection(walletAddress));
    const snapshot = await getDocs(q);

    const notifications = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const notificationDocRef = doc(
          db,
          "notifications",
          docSnap.data().notificationId,
        );
        const notificationDoc = await getDoc(notificationDocRef);
        return {
          id: docSnap.id,
          ...notificationDoc.data(),
          read: docSnap.data().read,
        } as Notification;
      }),
    );

    return notifications.sort((a, b) => b.createdAt - a.createdAt);
  },

  async markAsRead(
    notificationId: string,
    walletAddress: string,
  ): Promise<void> {
    const userNotificationRef = doc(
      db,
      "users",
      walletAddress,
      "notifications",
      notificationId,
    );
    await updateDoc(userNotificationRef, { read: true });
  },

  async markAllAsRead(walletAddress: string): Promise<void> {
    const q = query(userNotificationsCollection(walletAddress));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);

    snapshot.docs.forEach((docSnap) => {
      if (!docSnap.data().read) {
        const notificationRef = doc(
          db,
          "users",
          walletAddress,
          "notifications",
          docSnap.id,
        );
        batch.update(notificationRef, { read: true });
      }
    });

    // Commit el batch
    await batch.commit();
  },

  async clearAllNotifications(walletAddress: string): Promise<void> {
    const q = query(userNotificationsCollection(walletAddress));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);

    snapshot.docs.forEach((docSnap) => {
      const notificationRef = doc(
        db,
        "users",
        walletAddress,
        "notifications",
        docSnap.id,
      );
      batch.delete(notificationRef);
    });

    await batch.commit();
  },
};
