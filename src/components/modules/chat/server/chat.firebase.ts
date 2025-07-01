import { db } from "@/core/config/firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  DocumentData,
} from "firebase/firestore";

const chatsCollection = collection(db, "chats");

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}

export const getOrCreateChat = async (
  userId: string,
  contactId: string,
): Promise<string> => {
  const q = query(chatsCollection, where("participants", "array-contains", userId));
  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as DocumentData;
    const participants = data.participants as string[];
    if (participants.includes(contactId) && participants.includes(userId)) {
      return docSnap.id;
    }
  }

  const chatDoc = await addDoc(chatsCollection, {
    participants: [userId, contactId],
    lastMessage: "",
    updatedAt: serverTimestamp(),
  });
  return chatDoc.id;
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
): Promise<void> => {
  const messagesCol = collection(db, `chats/${chatId}/messages`);
  await addDoc(messagesCol, {
    senderId,
    text,
    createdAt: serverTimestamp(),
  });

  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToChats = (
  userId: string,
  callback: (chats: Chat[]) => void,
): (() => void) => {
  const q = query(
    chatsCollection,
    where("participants", "array-contains", userId),
  );

  return onSnapshot(q, (snapshot) => {
    const chats: Chat[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as DocumentData;
      return {
        id: docSnap.id,
        participants: data.participants,
        lastMessage: data.lastMessage,
        updatedAt: data.updatedAt,
      } as Chat;
    });
    chats.sort((a, b) => {
      const aTime = a.updatedAt?.seconds || 0;
      const bTime = b.updatedAt?.seconds || 0;
      return bTime - aTime;
    });
    callback(chats);
  });
};

export const subscribeToMessages = (
  chatId: string,
  callback: (messages: ChatMessage[]) => void,
): (() => void) => {
  const messagesCol = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesCol, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as DocumentData;
      return {
        id: docSnap.id,
        senderId: data.senderId,
        text: data.text,
        createdAt: data.createdAt,
      } as ChatMessage;
    });
    callback(messages);
  });
};

export const deleteChat = async (chatId: string): Promise<void> => {
  const messagesCol = collection(db, `chats/${chatId}/messages`);
  const snapshot = await getDocs(messagesCol);
  await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref)));
  const chatRef = doc(db, "chats", chatId);
  await deleteDoc(chatRef);
};
