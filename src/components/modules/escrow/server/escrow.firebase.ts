/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/core/config/firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { convertFirestoreTimestamps } from "@/utils/hook/format.hook";

interface getAllEscrowsByUserProps {
  address: string;
  type: string;
}

const getAllEscrowsByUser = async ({
  address,
  type,
}: getAllEscrowsByUserProps): Promise<{
  success: boolean;
  message?: string;
  data?: any;
}> => {
  const collectionRef = collection(db, "escrows");

  try {
    const q = query(collectionRef, where(`roles.${type}`, "==", address));
    const snapshot = await getDocs(q);

    const escrowList = snapshot.docs.map((doc) => {
      const data = doc.data();
      return convertFirestoreTimestamps({
        ...data,
        id: doc.id,
      });
    });

    return { success: true, data: escrowList };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred";

    return { success: false, message: errorMessage };
  }
};

interface updateEscrowProps {
  escrowId: string;
  payload: Record<string, any>;
}

const updateEscrow = async ({
  escrowId,
  payload,
}: updateEscrowProps): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const docRef = doc(db, "escrows", escrowId);
    const updatesWithTimestamp = {
      ...payload,
      balance: payload.balance || 0,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updatesWithTimestamp);

    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) {
      throw new Error("Escrow not found.");
    }

    const updatedEscrow = updatedDoc.data();
    const convertedEscrow = convertFirestoreTimestamps({
      escrowId,
      ...updatedEscrow,
    });

    return {
      success: true,
      message: `Escrow with ID ${escrowId} updated successfully.`,
      data: convertedEscrow,
    };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred during the update.";

    return { success: false, message: errorMessage };
  }
};

interface getUserRoleInEscrowProps {
  contractId: string | undefined;
  address: string;
}

const getUserRoleInEscrow = async ({
  contractId,
  address,
}: getUserRoleInEscrowProps): Promise<{
  success: boolean;
  message: string;
  roles?: string[];
}> => {
  const collectionRef = collection(db, "escrows");
  const roles = [
    "approver",
    "serviceProvider",
    "platformAddress",
    "releaseSigner",
    "issuer",
    "disputeResolver",
  ];

  try {
    const escrowSnapshot = await getDocs(
      query(collectionRef, where("contractId", "==", contractId)),
    );

    if (escrowSnapshot.empty) {
      return {
        success: false,
        message: `No escrow found with contractId: ${contractId}`,
      };
    }

    const escrowData = convertFirestoreTimestamps(
      escrowSnapshot.docs[0].data(),
    );

    const userRoles = roles.filter(
      (role) => escrowData.roles[role] === address,
    );

    if (userRoles.length > 0) {
      return {
        success: true,
        message: `User has roles: ${userRoles.join(", ")}`,
        roles: userRoles,
      };
    }

    return {
      success: false,
      message: `Error`,
      roles: [],
    };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred during the role determination.";

    return { success: false, message: errorMessage };
  }
};

export { getAllEscrowsByUser, updateEscrow, getUserRoleInEscrow };
