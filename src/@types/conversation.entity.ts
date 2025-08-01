import { UpdatedAt } from "./dates.entity";

export interface Conversation {
  id: string;
  name: string;
  email: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: Date;
  type: "text" | "image" | "file";
  attachment?: {
    name: string;
    type: string;
    data: string;
  };
  isRead: boolean;
}

export interface ChatSession {
  conversation: Conversation;
  messages: ChatMessage[];
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: UpdatedAt;
}
