import { db } from "@/core/config/firebase/firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

export const removeApiKey = async (address: string, apiKey: string) => {
  try {
    const userRef = doc(db, "users", address);
    await updateDoc(userRef, {
      apiKey: arrayRemove(apiKey),
    });
    return { success: true };
  } catch (error) {
    console.error("Error removing API key:", error);
    return { success: false, error };
  }
};
