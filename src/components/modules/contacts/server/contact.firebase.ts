/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { ContactPayload } from "@/@types/contact.entity";
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
  deleteDoc,
} from "firebase/firestore";

interface addContactProps {
  payload: ContactPayload;
}

const addContact = async ({
  payload,
}: addContactProps): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(
    query(usersRef, where("address", "==", payload.address)),
  );

  if (querySnapshot.empty) {
    return { success: false, message: "User with this address not found." };
  }

  const userDoc = querySnapshot.docs[0];
  const userRef = doc(db, "users", userDoc.id);
  const contactId = crypto.randomUUID();

  try {
    await updateDoc(userRef, {
      [`contacts.${contactId}`]: {
        ...payload,
        status: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    });

    return {
      success: true,
      message: `Contact ${payload.name} ${payload.lastName} added successfully to user with address ${payload.address}`,
      data: { id: contactId, ...payload, status: true },
    };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred" };
  }
};

interface getAllContactsByUserProps {
  address: string;
  type: string;
}

const getAllContactsByUser = async ({
  address,
  type,
}: getAllContactsByUserProps) => {
  const collectionRef = collection(db, "contacts");

  try {
    const contactCollectionSnapshot = await getDocs(
      query(collectionRef, where(type, "==", address)),
    );

    const contactList = contactCollectionSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(contactList);

    return { success: true, data: contactList };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred" };
  }
};

interface updateContactProps {
  contactId: string;
  payload: Record<string, any>;
}

const updateContact = async ({ contactId, payload }: updateContactProps) => {
  try {
    const docRef = doc(db, "contacts", contactId);
    await updateDoc(docRef, { ...payload, updatedAt: serverTimestamp() });

    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) throw new Error("Contact not found.");

    return {
      success: true,
      message: `Contact with ID ${contactId} updated successfully.`,
      data: { contactId, ...updatedDoc.data() },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during the update.",
    };
  }
};

interface ToggleContactStatusProps {
  contactId: string;
}

const toggleContactStatus = async ({
  contactId,
}: ToggleContactStatusProps): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const docRef = doc(db, "contacts", contactId);

    const contactDoc = await getDoc(docRef);

    if (!contactDoc.exists()) {
      return { success: false, message: "Contact not found." };
    }

    const contactData = contactDoc.data();
    const currentStatus = contactData.status === true;

    await updateDoc(docRef, {
      status: !currentStatus,
      updatedAt: serverTimestamp(),
    });

    const updatedDoc = await getDoc(docRef);

    return {
      success: true,
      message: `Contact status successfully changed to ${!currentStatus}.`,
      data: { contactId, ...updatedDoc.data() },
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.message || "An error occurred while toggling contact status.",
    };
  }
};

export { addContact, getAllContactsByUser, updateContact, toggleContactStatus };
