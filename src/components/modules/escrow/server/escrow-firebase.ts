/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/core/config/firebase/firebase";
import {
  addDoc,
  collection,
  DocumentReference,
  getDoc,
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
  contractId: string;
}

const addEscrow = async ({
  payload,
  address,
  contractId,
}: addEscrowProps): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  const collectionRef = collection(db, "escrows");

  try {
    const docRef: DocumentReference = await addDoc(collectionRef, {
      ...payload,
      issuer: address,
      contractId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const createdDoc = await getDoc(docRef);

    if (createdDoc.exists()) {
      return {
        success: true,
        message: `Escrow ${payload.title} created successfully`,
        data: { id: docRef.id, ...createdDoc.data() },
      };
    } else {
      return {
        success: false,
        message: "Document was created but no data was found.",
      };
    }
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
  type, // ! issuer, client, disputeResolver or serviceProvider
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
