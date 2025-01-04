/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/core/config/firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { z } from "zod";
import { formSchema } from "../schema/initialize-escrow-schema";

interface addEscrowProps {
  payload: z.infer<typeof formSchema>;
  address: string;
}

const addEscrow = async ({
  payload,
  address,
}: addEscrowProps): Promise<{ success: boolean; message: string }> => {
  const collectionRef = collection(db, "escrows");

  try {
    await addDoc(collectionRef, {
      ...payload,
      user: address,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Escrow ${payload.title} created successfully`,
    };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred";

    return { success: false, message: errorMessage };
  }
};

interface getAllEscrowsByUserProps {
  address: string;
  type: string;
}

const getAllEscrowsByUser = async ({
  address,
  type, // ! client/user, disputeResolver or serviceProvider
}: getAllEscrowsByUserProps): Promise<{
  success: boolean;
  message?: string;
  data?: any;
}> => {
  const collectionRef = collection(db, "escrows");

  try {
    const escrowCollectionSnapshot = await getDocs(
      query(collectionRef, where(type, "==", address)),
    );

    const escrowList = escrowCollectionSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return { success: false, data: escrowList };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred";

    return { success: false, message: errorMessage };
  }
};

export { addEscrow, getAllEscrowsByUser };
