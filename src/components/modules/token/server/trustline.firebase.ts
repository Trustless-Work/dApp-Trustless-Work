/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/core/config/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const getAllTrustlines = async (): Promise<{
  success: boolean;
  message: string;
  data?: any[];
}> => {
  const collectionRef = collection(db, "trustlines");

  try {
    const querySnapshot = await getDocs(collectionRef);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: "No trustlines found",
      };
    }

    const trustlines = querySnapshot.docs
      .map((doc) => {
        const trustlineData = doc.data();
        if (!trustlineData.name || !trustlineData.trustline) {
          return null;
        }

        return {
          id: doc.id,
          ...trustlineData,
        };
      })
      .filter((trustline) => trustline !== null);

    return {
      success: true,
      message: "Trustlines retrieved successfully",
      data: trustlines,
    };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred";

    return { success: false, message: errorMessage };
  }
};

export { getAllTrustlines };
