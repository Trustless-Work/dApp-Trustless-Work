/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/core/config/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const getAllTokens = async (): Promise<{
  success: boolean;
  message: string;
  data?: any[];
}> => {
  const collectionRef = collection(db, "tokens");

  try {
    const querySnapshot = await getDocs(collectionRef);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: "No tokens found",
      };
    }

    const tokens = querySnapshot.docs
      .map((doc) => {
        const tokenData = doc.data();
        if (!tokenData.name || !tokenData.token) {
          return null;
        }

        return {
          id: doc.id,
          ...tokenData,
        };
      })
      .filter((token) => token !== null);

    return {
      success: true,
      message: "Tokens retrieved successfully",
      data: tokens,
    };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred";

    return { success: false, message: errorMessage };
  }
};

export { getAllTokens };
