import { db } from "@/core/config/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { Contact } from "@/@types/contact.entity";

const contactsCollection = (userId: string) =>
  collection(db, `users/${userId}/contacts`);

export const createContact = async (userId: string, contact: Contact) => {
  // Check if contact with same address already exists
  const contactsQuery = query(
    contactsCollection(userId),
    where("address", "==", contact.address),
  );
  const existingContacts = await getDocs(contactsQuery);

  if (!existingContacts.empty) {
    throw new Error("A contact with this wallet address already exists");
  }

  await addDoc(contactsCollection(userId), {
    ...contact,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getContacts = async (userId: string): Promise<Contact[]> => {
  const snapshot = await getDocs(contactsCollection(userId));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Contact[];
};

export const updateContact = async (
  userId: string,
  contactId: string,
  data: Partial<Contact>,
) => {
  // If address is being updated, check if it already exists
  if (data.address) {
    const contactsQuery = query(
      contactsCollection(userId),
      where("address", "==", data.address),
    );
    const existingContacts = await getDocs(contactsQuery);
    const existingContact = existingContacts.docs.find(
      (doc) => doc.id !== contactId,
    );

    if (existingContact) {
      throw new Error("A contact with this wallet address already exists");
    }
  }

  const docRef = doc(db, `users/${userId}/contacts/${contactId}`);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteContact = async (userId: string, contactId: string) => {
  const docRef = doc(db, `users/${userId}/contacts/${contactId}`);
  await deleteDoc(docRef);
};
