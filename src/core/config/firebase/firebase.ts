import { getFirestore, collection } from "firebase/firestore";
import { firebaseApp } from "../../../../firebase";

export const db = getFirestore(firebaseApp);

// Notification collections
export const notificationsCollection = collection(db, "notifications");
export const userNotificationsCollection = (walletAddress: string) =>
  collection(db, "users", walletAddress, "notifications");
