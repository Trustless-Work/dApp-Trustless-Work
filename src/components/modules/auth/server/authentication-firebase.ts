/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserPayload } from "@/@types/user.entity";
import { db } from "@/core/config/firebase/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

interface addUserProps {
  address: string;
}

const addUser = async ({
  address,
}: addUserProps): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  const collectionRef = collection(db, "users");

  try {
    const userDoc = doc(collectionRef, address);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      await setDoc(userDoc, {
        address,
        createdAt: new Date(),
        saveEscrow: false,
      });

      return {
        success: true,
        message: `User ${address} registered successfully`,
        data: {
          id: userDoc.id,
          address,
        },
      };
    } else {
      return {
        success: false,
        message: "User already exists.",
        data: userSnapshot.data(),
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

interface getUserProps {
  address: string;
}

const getUser = async ({
  address,
}: getUserProps): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const userDoc = doc(db, "users", address);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return {
        success: true,
        message: `User ${address} found successfully`,
        data: userSnapshot.data(),
      };
    } else {
      return {
        success: false,
        message: `User ${address} not found`,
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
interface updateUserProps {
  address: string;
  payload: UserPayload;
}

const updateUser = async ({
  address,
  payload,
}: updateUserProps): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const userDoc = doc(db, "users", address);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      await updateDoc(userDoc, { ...payload, updatedAt: serverTimestamp() });

      return {
        success: true,
        message: `User ${address} updated successfully`,
        data: { id: userDoc.id, address, ...payload },
      };
    } else {
      await setDoc(userDoc, {
        ...payload,
        address,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        message: `User ${address} registered and updated successfully`,
        data: { id: userDoc.id, address, ...payload },
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

export { addUser, getUser, updateUser };
