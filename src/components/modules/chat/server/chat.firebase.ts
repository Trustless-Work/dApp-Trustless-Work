import { Chat } from "@/@types/conversation.entity";
import { UpdatedAt } from "@/@types/dates.entity";
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
  Timestamp,
} from "firebase/firestore";

const chatsCollection = collection(db, "chats");

interface FirebaseChatData {
  participants: string[];
  lastMessage: string;
  updatedAt: Timestamp;
}

interface FirebaseMessageData {
  senderId: string;
  text: string;
  createdAt: Timestamp;
  attachment?: {
    name: string;
    type: string;
    data: string;
  };
}

interface FirebaseMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: Timestamp;
  attachment?: {
    name: string;
    type: string;
    data: string;
  };
}

export const getOrCreateChat = async (
  userId: string,
  contactId: string,
): Promise<string> => {
  const q = query(
    chatsCollection,
    where("participants", "array-contains", userId),
  );
  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as FirebaseChatData;
    const participants = data.participants;
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
  attachment?: { name: string; type: string; data: string },
): Promise<void> => {
  const messagesCol = collection(db, `chats/${chatId}/messages`);
  const messageData: FirebaseMessageData = {
    senderId,
    text,
    createdAt: serverTimestamp() as Timestamp,
  };

  if (attachment) {
    messageData.attachment = attachment;
  }

  await addDoc(messagesCol, messageData);

  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text || attachment?.name || "",
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
      const data = docSnap.data() as FirebaseChatData;
      return {
        id: docSnap.id,
        participants: data.participants,
        lastMessage: data.lastMessage,
        updatedAt: {
          _seconds: data.updatedAt.seconds,
          _nanoseconds: data.updatedAt.nanoseconds,
        } as UpdatedAt,
      } as Chat;
    });
    chats.sort((a, b) => {
      const aTime = a.updatedAt?._seconds || 0;
      const bTime = b.updatedAt?._seconds || 0;
      return bTime - aTime;
    });
    callback(chats);
  });
};

export const subscribeToMessages = (
  chatId: string,
  callback: (messages: FirebaseMessage[]) => void,
): (() => void) => {
  const messagesCol = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesCol, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages: FirebaseMessage[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as FirebaseMessageData;
      return {
        id: docSnap.id,
        senderId: data.senderId,
        text: data.text,
        createdAt: data.createdAt,
        attachment: data.attachment,
      };
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
