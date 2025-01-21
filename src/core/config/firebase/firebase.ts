import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../../../../firebase";

if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined");
}

export const db = getFirestore(
  firebaseApp,
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
);
