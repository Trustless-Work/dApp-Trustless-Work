/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/core/config/firebase/firebase";
import { Contact } from "@/@types/contact.entity";

export const getUserContacts = async (userId: string): Promise<Contact[]> => {
  const snapshot = await getDocs(collection(db, `users/${userId}/contacts`));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      address: data.address ?? "",
      role: data.role ?? "",
    };
  });
};

export const addUserContact = async (userId: string, contact: any) => {
  const ref = doc(collection(db, `users/${userId}/contacts`));
  await setDoc(ref, contact);
};

export const updateUserContact = async (
  userId: string,
  contactId: string,
  data: any,
) => {
  const ref = doc(db, `users/${userId}/contacts/${contactId}`);
  await updateDoc(ref, data);
};

export const deleteUserContact = async (userId: string, contactId: string) => {
  const ref = doc(db, `users/${userId}/contacts/${contactId}`);
  await deleteDoc(ref);
};
