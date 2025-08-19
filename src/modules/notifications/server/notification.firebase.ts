import {
  getDocs,
  doc,
  query,
  updateDoc,
  writeBatch,
  collection,
  where,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";
import { Notification } from "@/types/notification.entity";
import { db } from "../../../../firebase";

export const NotificationService = {
  async getUserNotifications(walletAddress: string): Promise<Notification[]> {
    const q = query(
      collection(db, "notifications"),
      where("entities", "array-contains", walletAddress),
    );
    const snapshot = await getDocs(q);

    const notifications = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as DocumentData;
      return {
        id: docSnap.id,
        ...data,
      } as Notification;
    });

    return notifications.sort((a, b) => {
      const aTime =
        a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000;
      const bTime =
        b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000;
      return bTime - aTime;
    });
  },

  async markAsRead(notificationId: string): Promise<void> {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, { read: true });
  },

  async markAllAsRead(walletAddress: string): Promise<void> {
    const q = query(
      collection(db, "notifications"),
      where("entities", "array-contains", walletAddress),
      where("read", "==", false),
    );
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);

    snapshot.docs.forEach((docSnap) => {
      const notificationRef = doc(db, "notifications", docSnap.id);
      batch.update(notificationRef, { read: true });
    });

    await batch.commit();
  },

  async clearAllNotifications(walletAddress: string): Promise<void> {
    const q = query(
      collection(db, "notifications"),
      where("entities", "array-contains", walletAddress),
    );
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);

    snapshot.docs.forEach((docSnap) => {
      const notificationRef = doc(db, "notifications", docSnap.id);
      batch.delete(notificationRef);
    });

    await batch.commit();
  },

  subscribeToNotifications(
    walletAddress: string,
    callback: (notifications: Notification[]) => void,
  ): () => void {
    const q = query(
      collection(db, "notifications"),
      where("entities", "array-contains", walletAddress),
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as DocumentData;
        return {
          id: docSnap.id,
          ...data,
        } as Notification;
      });

      callback(
        notifications.sort((a, b) => {
          const aTime =
            a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000;
          const bTime =
            b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000;
          return bTime - aTime;
        }),
      );
    });
  },
};
