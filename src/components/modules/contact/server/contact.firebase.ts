import { db } from "@/core/config/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Contact } from "@/@types/contact.entity";

const contactsCollection = (userId: string) =>
  collection(db, `users/${userId}/contacts`);

export const createContact = async (userId: string, contact: Contact) => {
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
